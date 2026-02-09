import { NextRequest, NextResponse } from 'next/server';
import { createServerClient as createClient } from '@automation/auth';
import { inAppReminderRepo } from '@automation/data';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedCount = await inAppReminderRepo.markAllAsRead(user.id);
    return NextResponse.json({ ok: true, updatedCount });
  } catch (error) {
    console.error('Error marking all in-app reminders as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
