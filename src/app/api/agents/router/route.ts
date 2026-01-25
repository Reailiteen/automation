import { NextRequest, NextResponse } from 'next/server';
import { RouterAgent } from '@/lib/agents/router-agent';
import { userRepo } from '@/lib/repos/task-repo';

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json();
    
    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Input is required and must be a string' },
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

    const routerAgent = new RouterAgent();
    const result = await routerAgent.process({
      user,
      input: input.trim(),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in router agent API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
