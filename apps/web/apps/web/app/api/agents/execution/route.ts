import { NextRequest, NextResponse } from 'next/server';
import { ExecutionAgent } from '@automation/agents';
import { taskRepo, userRepo } from '@automation/data';

export async function POST(request: NextRequest) {
  try {
    const { taskId, progress, nextSteps } = await request.json();
    
    // Get user from session or headers for now
    const userId = request.headers.get('x-user-id') || 'default-user';
    const user = await userRepo.getById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get the current task
    const currentTask = await taskRepo.getById(taskId);
    
    if (!currentTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const executionAgent = new ExecutionAgent();
    const result = await executionAgent.process({
      user,
      currentTask,
      progress,
      nextSteps
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in execution agent API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const taskId = url.searchParams.get('taskId');
    
    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Get user from session or headers for now
    const userId = request.headers.get('x-user-id') || 'default-user';
    const user = await userRepo.getById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get the current task
    const currentTask = await taskRepo.getById(taskId);
    
    if (!currentTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const executionAgent = new ExecutionAgent();
    const result = await executionAgent.process({
      user,
      currentTask
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in execution agent API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}