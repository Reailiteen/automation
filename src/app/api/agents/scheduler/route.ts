import { NextRequest, NextResponse } from 'next/server';
import { SchedulerAgent } from '@/lib/agents/scheduler-agent';
import { taskRepo, userRepo } from '@/lib/repos/task-repo';

export async function POST(request: NextRequest) {
  try {
    const { date, taskIds, existingEvents, constraints } = await request.json();
    
    // Get user from session or headers for now
    const userId = request.headers.get('x-user-id') || 'default-user';
    const user = await userRepo.getById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get tasks based on provided IDs
    const tasks = await Promise.all(
      (taskIds as string[]).map((id: string) => taskRepo.getById(id))
    );
    
    // Filter out any null tasks
    const validTasks = tasks.filter(task => task !== null);

    const schedulerAgent = new SchedulerAgent();
    const result = await schedulerAgent.process({
      user,
      tasks: validTasks,
      date: new Date(date),
      existingEvents,
      constraints
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
    // Get user from session or headers for now
    const userId = request.headers.get('x-user-id') || 'default-user';
    const user = await userRepo.getById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get today's date or use date from query
    const url = new URL(request.url);
    const dateParam = url.searchParams.get('date');
    const date = dateParam ? new Date(dateParam) : new Date();

    // Get all tasks for this user (for now, we'll just get all tasks)
    const tasks = await taskRepo.getAll();

    const schedulerAgent = new SchedulerAgent();
    const result = await schedulerAgent.process({
      user,
      tasks,
      date,
      existingEvents: [],
      constraints: undefined
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