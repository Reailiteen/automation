import { NextRequest, NextResponse } from 'next/server';
import { createServerClient as createClient } from '@automation/auth';
import { reminderRepo } from '@automation/data';
import { ReminderChannel, ReminderStatus } from '@automation/types';

const ALLOWED_CHANNELS: ReminderChannel[] = ['email', 'inApp', 'push'];
const ALLOWED_STATUSES: ReminderStatus[] = ['pending', 'sent', 'partial', 'cancelled', 'failed'];

function dedupeChannels(value: unknown): ReminderChannel[] {
  if (!Array.isArray(value)) return [];
  const channels = value.filter((item): item is ReminderChannel =>
    ALLOWED_CHANNELS.includes(item as ReminderChannel)
  );
  return Array.from(new Set(channels));
}

function normalizePushTokens(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const tokens = value
    .filter((item): item is string => typeof item === 'string')
    .map((token) => token.trim())
    .filter(Boolean);
  return Array.from(new Set(tokens));
}

function extractUserPushTokens(userMetadata: unknown): string[] {
  if (!userMetadata || typeof userMetadata !== 'object') return [];
  const record = userMetadata as Record<string, unknown>;
  const raw = record.fcmTokens;
  if (!Array.isArray(raw)) return [];

  const tokens = raw.flatMap((entry) => {
    if (typeof entry === 'string') return [entry];
    if (entry && typeof entry === 'object' && typeof (entry as Record<string, unknown>).token === 'string') {
      return [(entry as Record<string, unknown>).token as string];
    }
    return [];
  });

  return Array.from(new Set(tokens.map((token) => token.trim()).filter(Boolean)));
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const statusParam = request.nextUrl.searchParams.get('status');
    const status =
      statusParam && ALLOWED_STATUSES.includes(statusParam as ReminderStatus)
        ? (statusParam as ReminderStatus)
        : undefined;

    const reminders = await reminderRepo.getAll({ userId: user.id, status });
    const sorted = reminders.sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime());
    return NextResponse.json(sorted);
  } catch (error) {
    console.error('Error getting reminders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const title = typeof body?.title === 'string' ? body.title.trim() : '';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const dueAtInput = typeof body?.dueAt === 'string' ? body.dueAt : '';
    const channels = dedupeChannels(body?.channels);
    const dueAt = new Date(dueAtInput);

    if (!title || !message) {
      return NextResponse.json(
        { error: 'title and message are required.' },
        { status: 400 }
      );
    }

    if (!dueAtInput || Number.isNaN(dueAt.getTime())) {
      return NextResponse.json(
        { error: 'dueAt must be a valid ISO datetime string.' },
        { status: 400 }
      );
    }

    if (channels.length === 0) {
      return NextResponse.json(
        { error: 'At least one channel is required (email, inApp, push).' },
        { status: 400 }
      );
    }

    const metadata =
      body?.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata)
        ? (body.metadata as Record<string, unknown>)
        : {};

    const reminder = await reminderRepo.create({
      userId: user.id,
      title,
      message,
      dueAt,
      channels,
      status: 'pending',
      lastSentAt: undefined,
      sentChannels: [],
      failedChannels: [],
      attempts: [],
      recipientEmail:
        typeof body?.recipientEmail === 'string' && body.recipientEmail.trim()
          ? body.recipientEmail.trim()
          : user.email ?? undefined,
      pushTokens:
        normalizePushTokens(body?.pushTokens).length > 0
          ? normalizePushTokens(body?.pushTokens)
          : extractUserPushTokens(user.user_metadata),
      metadata,
    });

    return NextResponse.json(reminder, { status: 201 });
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
