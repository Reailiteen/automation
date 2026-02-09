import { NextRequest, NextResponse } from 'next/server';
import { createServerClient as createClient } from '@automation/auth';
import { reminderRepo } from '@automation/data';
import { Reminder, ReminderChannel, ReminderStatus } from '@automation/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const ALLOWED_CHANNELS: ReminderChannel[] = ['email', 'inApp', 'push'];
const ALLOWED_STATUSES: ReminderStatus[] = ['pending', 'sent', 'partial', 'cancelled', 'failed'];

function dedupeChannels(value: unknown): ReminderChannel[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return [];
  const channels = value.filter((item): item is ReminderChannel =>
    ALLOWED_CHANNELS.includes(item as ReminderChannel)
  );
  return Array.from(new Set(channels));
}

function normalizePushTokens(value: unknown): string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return [];
  const tokens = value
    .filter((item): item is string => typeof item === 'string')
    .map((token) => token.trim())
    .filter(Boolean);
  return Array.from(new Set(tokens));
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reminder = await reminderRepo.getById(id);
    if (!reminder || reminder.userId !== user.id) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    return NextResponse.json(reminder);
  } catch (error) {
    console.error('Error getting reminder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await reminderRepo.getById(id);
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    const body = await request.json();
    const updates: Partial<Omit<Reminder, 'id' | 'createdAt'>> = {};

    if (body?.title !== undefined) {
      if (typeof body.title !== 'string' || !body.title.trim()) {
        return NextResponse.json({ error: 'title must be a non-empty string.' }, { status: 400 });
      }
      updates.title = body.title.trim();
    }

    if (body?.message !== undefined) {
      if (typeof body.message !== 'string' || !body.message.trim()) {
        return NextResponse.json({ error: 'message must be a non-empty string.' }, { status: 400 });
      }
      updates.message = body.message.trim();
    }

    if (body?.dueAt !== undefined) {
      if (typeof body.dueAt !== 'string') {
        return NextResponse.json({ error: 'dueAt must be an ISO datetime string.' }, { status: 400 });
      }
      const dueAt = new Date(body.dueAt);
      if (Number.isNaN(dueAt.getTime())) {
        return NextResponse.json({ error: 'dueAt must be a valid ISO datetime string.' }, { status: 400 });
      }
      updates.dueAt = dueAt;
    }

    if (body?.channels !== undefined) {
      const channels = dedupeChannels(body.channels);
      if (!channels || channels.length === 0) {
        return NextResponse.json(
          { error: 'channels must include at least one of email, inApp, push.' },
          { status: 400 }
        );
      }
      updates.channels = channels;
    }

    if (body?.status !== undefined) {
      if (!ALLOWED_STATUSES.includes(body.status as ReminderStatus)) {
        return NextResponse.json({ error: 'Invalid reminder status.' }, { status: 400 });
      }
      updates.status = body.status as ReminderStatus;
    }

    if (body?.recipientEmail !== undefined) {
      if (typeof body.recipientEmail !== 'string' || !body.recipientEmail.trim()) {
        updates.recipientEmail = undefined;
      } else {
        updates.recipientEmail = body.recipientEmail.trim();
      }
    }

    if (body?.pushTokens !== undefined) {
      updates.pushTokens = normalizePushTokens(body.pushTokens) ?? [];
    }

    if (body?.metadata !== undefined) {
      if (!body.metadata || typeof body.metadata !== 'object' || Array.isArray(body.metadata)) {
        return NextResponse.json({ error: 'metadata must be an object.' }, { status: 400 });
      }
      updates.metadata = body.metadata as Record<string, unknown>;
    }

    const updated = await reminderRepo.update(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await reminderRepo.getById(id);
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    const success = await reminderRepo.delete(id);
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete reminder' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
