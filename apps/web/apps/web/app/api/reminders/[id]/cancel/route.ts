import { NextRequest, NextResponse } from 'next/server';
import { createServerClient as createClient } from '@automation/auth';
import { reminderRepo } from '@automation/data';

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

    const existing = await reminderRepo.getById(id);
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    const updated = await reminderRepo.update(id, { status: 'cancelled' });
    if (!updated) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error cancelling reminder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
