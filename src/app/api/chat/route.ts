import { NextRequest, NextResponse } from 'next/server';
import GeminiService from '@/lib/services/gemini';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get user from session or headers for now
    const userId = request.headers.get('x-user-id') || 'default-user';

    // Determine which agent to use based on message content
    let agentType: 'planner' | 'prioritization' | 'scheduler' | 'execution' | 'reflection' = 'planner';
    
    const messageLower = message.toLowerCase();
    if (messageLower.includes('priorit') || messageLower.includes('important')) {
      agentType = 'prioritization';
    } else if (messageLower.includes('schedule') || messageLower.includes('when') || messageLower.includes('time')) {
      agentType = 'scheduler';
    } else if (messageLower.includes('how') || messageLower.includes('execute') || messageLower.includes('do')) {
      agentType = 'execution';
    } else if (messageLower.includes('reflect') || messageLower.includes('review') || messageLower.includes('learn')) {
      agentType = 'reflection';
    }

    // Use Gemini to generate a helpful response
    const geminiService = new GeminiService();
    
    const prompt = `You are a helpful AI assistant for a task management system. A user has sent you this message: "${message}"

Based on the message, you should provide helpful guidance. If they're asking about:
- Creating tasks or plans: Help them break down their goals
- Prioritizing: Help them understand what's most important
- Scheduling: Help them plan their time
- Execution: Help them take action on tasks
- Reflection: Help them learn from their work

Provide a friendly, concise, and actionable response. Keep it under 200 words.`;

    const response = await geminiService.generateContent(prompt);

    return NextResponse.json({ 
      response,
      agentType,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Chat API is ready',
    endpoints: {
      POST: 'Send a message to chat with the AI assistant'
    }
  });
}
