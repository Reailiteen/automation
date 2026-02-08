import { NextRequest, NextResponse } from 'next/server';
import { SchedulerAgent } from '@automation/agents';
import { taskRepo, userRepo } from '@automation/data';
import { createServerClient as createClient } from '@automation/auth';

export async function POST(request: NextRequest) {
  try {
    const { date, taskIds = [], existingEvents = [], constraints, confirm } =
      await request.json();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await userRepo.getById(user.id);
    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    const tasks = await Promise.all(
      (taskIds as string[]).map(id => taskRepo.getById(id))
    );
    const validTasks = tasks.filter((task): task is NonNullable<typeof task> => Boolean(task));

    const schedulerAgent = new SchedulerAgent();
    const result = await schedulerAgent.process({
      user: profile,
      tasks: validTasks,
      date: date ? new Date(date) : new Date(),
      existingEvents,
      constraints,
      context: { confirmed: Boolean(confirm) },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in scheduler agent API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
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

    const profile = await userRepo.getById(user.id);
    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Get today's date or use query param
    const url = new URL(request.url);
    const dateParam = url.searchParams.get('date');
    const date = dateParam ? new Date(dateParam) : new Date();

    const tasks = await taskRepo.getAll({ userId: profile.id });

    const schedulerAgent = new SchedulerAgent();
    const result = await schedulerAgent.process({
      user: profile,
      tasks,
      date,
      existingEvents: [],
      constraints: undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in scheduler agent API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
