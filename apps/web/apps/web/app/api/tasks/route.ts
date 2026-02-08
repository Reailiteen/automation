import { NextRequest, NextResponse } from 'next/server';
import { createServerClient as createClient } from '@automation/auth';
import { taskRepo, planRepo } from '@automation/data';
import { validationService } from '@automation/services';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tasks = await taskRepo.getAll({ userId: user.id });
    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error('Error getting tasks:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message || 'Failed to fetch tasks',
        details: error.details || error.toString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const confirm: boolean = Boolean(body.confirm);

    const draft = {
      title: body.title ?? 'Untitled',
      description: body.description,
      status: (body.status || 'pending') as 'pending' | 'in-progress' | 'completed' | 'cancelled',
      priority: (body.priority || 'medium') as 'low' | 'medium' | 'high' | 'urgent',
      estimatedTime: body.estimatedTime ?? 30,
      focusLevel: (body.focusLevel || 'medium') as 'shallow' | 'medium' | 'deep',
      dueDate: body.dueAt ? new Date(body.dueAt) : undefined,
      subtasks: body.subtasks ?? [],
      dependencies: body.dependencies ?? [],
      tags: body.tags ?? [],
      energyRequirement: (body.energyRequirement || 'medium') as 'low' | 'medium' | 'high',
      context: body.context ?? 'anywhere',
      kind: (body.kind || 'todo') as 'reminder' | 'todo' | 'habit' | 'daily',
      projectId: body.projectId ?? undefined,
      recurrencePerWeek: body.recurrencePerWeek ?? undefined,
      isRecurring: body.isRecurring ?? undefined,
      recurrencePattern: body.recurrencePattern ?? undefined,
    };

    const validation = validationService.validateTaskInput({
      task: draft,
      existing: await taskRepo.getAll({ userId: user.id }),
      projects: (await planRepo.getAll({ userId: user.id })) as any,
    });

    if (!validation.ok) {
      return NextResponse.json(
        { validation, requiresConfirmation: true },
        { status: 400 }
      );
    }

    if (validation.requiresConfirmation && !confirm) {
      return NextResponse.json(
        { validation, requiresConfirmation: true },
        { status: 409 }
      );
    }

    const task = await taskRepo.create({ ...draft, userId: user.id });

    return NextResponse.json({ task, validation }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message || 'Failed to create task',
        details: error.details || error.toString()
      },
      { status: 500 }
    );
  }
}
