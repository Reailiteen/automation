import { NextRequest, NextResponse } from 'next/server';
import { createServerClient as createClient } from '@automation/auth';
import { scheduleRepo, taskRepo } from '@automation/data';
import { SchedulerAgent } from '@automation/agents';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const dateParam = url.searchParams.get('date');
    const date = dateParam ? new Date(dateParam) : new Date();

    const schedule = await scheduleRepo.getByDate(date, { userId: user.id });

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    return NextResponse.json(schedule);
  } catch (error: any) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch schedule',
        details: error?.message || 'Unknown error',
      },
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
    const date = body.date ? new Date(body.date) : new Date();
    const confirm: boolean = Boolean(body.confirm);
    const taskIds = Array.isArray(body.taskIds) ? body.taskIds : [];
    const existingEvents = Array.isArray(body.existingEvents) ? body.existingEvents : [];
    const constraints = body.constraints;

    const tasks = (
      await Promise.all(taskIds.map((id: string) => taskRepo.getById(id)))
    ).filter((task): task is NonNullable<typeof task> => Boolean(task));

    const schedulerAgent = new SchedulerAgent();
    const result = await schedulerAgent.process({
      user,
      tasks,
      date,
      existingEvents,
      constraints,
      context: { confirmed: confirm },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error scheduling tasks:', error);
    return NextResponse.json(
      { error: 'Failed to generate schedule', details: (error as Error).message },
      { status: 500 }
    );
  }
}
