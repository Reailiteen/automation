import { NextRequest, NextResponse } from 'next/server';
import GeminiService from '@/lib/services/gemini';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set in environment variables' },
        { status: 500 }
      );
    }

    const geminiService = new GeminiService();
    const response = await geminiService.generateContent(prompt);

    return NextResponse.json({ 
      prompt,
      response,
      geminiApi: 'connected'
    });
  } catch (error) {
    console.error('Error calling Gemini:', error);
    return NextResponse.json(
      { 
        error: 'Failed to call Gemini API',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}