import { NextRequest, NextResponse } from 'next/server';
import { createServerClient as createClient } from '@automation/auth';
import { inAppReminderRepo } from '@automation/data';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reminder = await inAppReminderRepo.getById(id);
    if (!reminder || reminder.userId !== user.id) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    const updated = await inAppReminderRepo.markAsRead(id);
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update reminder' }, { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error marking in-app reminder as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
