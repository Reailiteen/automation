import { NextRequest, NextResponse } from 'next/server';
import { createServerClient as createClient } from '@automation/auth';
import { inAppReminderRepo } from '@automation/data';
import { InAppReminderStatus } from '@automation/types';

const ALLOWED_STATUS: InAppReminderStatus[] = ['unread', 'read', 'archived'];

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
    const unreadOnly = request.nextUrl.searchParams.get('unreadOnly') === 'true';
    const status =
      statusParam && ALLOWED_STATUS.includes(statusParam as InAppReminderStatus)
        ? (statusParam as InAppReminderStatus)
        : undefined;

    const reminders = await inAppReminderRepo.getAll({
      userId: user.id,
      status,
      unreadOnly,
    });

    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Error fetching in-app reminders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
