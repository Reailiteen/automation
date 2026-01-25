import { NextRequest, NextResponse } from 'next/server';
import { taskRepo } from '@/lib/repos/task-repo';

export async function GET(request: NextRequest) {
  try {
    // In a real app, this would filter by user ID from auth
    const tasks = await taskRepo.getAll();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error getting tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const taskData = await request.json();
    const task = await taskRepo.create(taskData);
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}