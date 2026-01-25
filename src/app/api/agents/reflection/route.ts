import { NextRequest, NextResponse } from 'next/server';
import { ReflectionAgent } from '@/lib/agents/reflection-agent';
import { taskRepo, userRepo } from '@/lib/repos/task-repo';

export async function POST(request: NextRequest) {
  try {
    const { taskIds, completionHistory, userFeedback } = await request.json();
    
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

    const reflectionAgent = new ReflectionAgent();
    const result = await reflectionAgent.process({
      user,
      tasks: validTasks,
      completionHistory,
      userFeedback
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in reflection agent API:', error);
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
    
    // Create mock completion history (in a real app this would come from database)
    const completionHistory = [];
    const userFeedback = [];

    const reflectionAgent = new ReflectionAgent();
    const result = await reflectionAgent.process({
      user,
      tasks,
      completionHistory,
      userFeedback
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in reflection agent API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}