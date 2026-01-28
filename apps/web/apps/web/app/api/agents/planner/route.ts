import { NextRequest, NextResponse } from 'next/server';
import { PlannerAgent } from '@automation/agents';
import { userRepo } from '@automation/data';

export async function POST(request: NextRequest) {
  try {
    const { goals, constraints, timeframe, forceCreate } = await request.json();
    
    // Get or create default user
    const userId = request.headers.get('x-user-id') || 'default-user';
    let user = await userRepo.getById(userId);
    
    // Create default user if doesn't exist
    if (!user) {
      // Create default user with fixed ID
      user = await userRepo.create({
        name: 'Default User',
        email: 'user@example.com',
        preferences: {
          workingHours: [],
          energyProfile: {
            peakHours: [],
            mediumHours: [],
            lowHours: [],
            recoveryTime: 15,
          },
          taskBreakingPreference: 'automatic',
          schedulingStyle: 'flexible',
          notificationSettings: {
            taskReminders: true,
            scheduleChanges: true,
            dailySummary: true,
          },
        },
      }, userId); // Use the userId as the ID
    }

    const plannerAgent = new PlannerAgent();
    const result = await plannerAgent.process({
      user,
      goals,
      constraints,
      timeframe: timeframe ? {
        start: new Date(timeframe.start),
        end: new Date(timeframe.end)
      } : undefined,
      forceCreate: forceCreate || false,
    } as any);

    // If duplicate detected, return with metadata for frontend handling
    if (result.metadata?.duplicateDetected) {
      return NextResponse.json({
        ...result,
        requiresConfirmation: true,
      });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in planner agent API:', error);
    return NextResponse.json(
      { 
        error: error?.message || 'Internal server error',
        details: error?.stack 
      },
      { status: 500 }
    );
  }
}