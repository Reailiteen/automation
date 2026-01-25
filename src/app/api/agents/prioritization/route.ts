import { NextRequest, NextResponse } from 'next/server';
import { PrioritizationAgent } from '@/lib/agents/prioritization-agent';
import { taskRepo, userRepo } from '@/lib/repos/task-repo';

export async function POST(request: NextRequest) {
  try {
    const { taskIds, currentContext } = await request.json();
    
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
      taskIds.map(id => taskRepo.getById(id))
    );
    
    // Filter out any null tasks
    const validTasks = tasks.filter(task => task !== null);

    const prioritizationAgent = new PrioritizationAgent();
    const result = await prioritizationAgent.process({
      user,
      tasks: validTasks,
      currentContext
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in prioritization agent API:', error);
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

    // Get all tasks for this user (for now, we'll just get all tasks)
    const tasks = await taskRepo.getAll();

    const prioritizationAgent = new PrioritizationAgent();
    const result = await prioritizationAgent.process({
      user,
      tasks,
      currentContext: null
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in prioritization agent API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}