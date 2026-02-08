import { Task, Plan, ValidationResult } from '@automation/types';
import {
  BaseAgent,
  BaseAgentOutput,
  PlannerInput,
  PlannerOutput,
  BaseAgentInput
} from './base-agent';
import { taskRepo, planRepo, userRepo } from '@automation/data';
import { GeminiService, memoryService, SimilarItem, validationService } from '@automation/services';
import { parseJsonFromGemini } from '@automation/utils';

export class PlannerAgent implements BaseAgent<PlannerInput, PlannerOutput> {
  type = 'planner';

  async process(input: PlannerInput): Promise<BaseAgentOutput> {
    const { user, goals, constraints, timeframe } = input;
    const reasoning: string[] = [];
    const originalInput = goals.join(' ');
    const forceCreate = (input as any).forceCreate || false;

    try {
      // Step 1: Load memory context
      const memoryContext = await memoryService.getUserContext(user.id);
      reasoning.push(`Loaded context: ${memoryContext.existingPlans.length} plans, ${memoryContext.existingTasks.length} tasks`);

      // Step 2: Check for duplicates/similar items (skip if forceCreate is true)
      let similarItems: SimilarItem[] = [];
      if (!forceCreate) {
        similarItems = await memoryService.findSimilarItems(originalInput, user.id, 0.7);
      }
      
      if (similarItems.length > 0) {
        const highestSimilarity = similarItems[0].similarity;
        reasoning.push(`Found ${similarItems.length} similar items (highest similarity: ${(highestSimilarity * 100).toFixed(0)}%)`);
        
        // If very similar (>= 0.9), suggest merge/update
        if (highestSimilarity >= 0.9) {
          return {
            result: {
              plan: null,
              tasks: [],
              reasoning: [`Duplicate detected: ${similarItems[0].item.title} (${(highestSimilarity * 100).toFixed(0)}% similar)`],
              duplicateItems: similarItems,
              requiresConfirmation: true,
            } as any,
            confidence: 0.9,
            metadata: { 
              duplicateDetected: true,
              similarItems: similarItems.map(item => ({
                id: item.item.id,
                type: item.type,
                title: item.item.title,
                similarity: item.similarity,
                reason: item.reason,
              })),
            },
          };
        }
      }

      // Step 3: Get related context for enrichment
      const relatedContext = await memoryService.getRelatedContext(originalInput, user.id);
      reasoning.push(`Found ${relatedContext.relatedPlans.length} related plans, ${relatedContext.relatedTasks.length} related tasks`);

      // Step 4: Use Gemini to generate plan title, description, and tasks
      const geminiService = new GeminiService();
      const prompt = geminiService.generatePrompt('planner', { 
        goals, 
        constraints, 
        originalInput,
        timeframe: timeframe ? {
          start: timeframe.start.toISOString(), 
          end: timeframe.end.toISOString()
        } : undefined,
        memoryContext: {
          existingPlans: memoryContext.existingPlans.slice(0, 5),
          relatedTasks: relatedContext.relatedTasks,
        },
        similarItems: similarItems.slice(0, 3),
      });
      
      const geminiResponse = await geminiService.generateContent(prompt);
      let parsedResponse: { planTitle?: string; planDescription?: string; tasks?: unknown[] };
      try {
        parsedResponse = parseJsonFromGemini(geminiResponse) as typeof parsedResponse;
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', geminiResponse);
        throw new Error('Failed to parse AI response. Please try again.');
      }
      
      const { planTitle, planDescription, tasks: geminiTasks } = parsedResponse;
      
      if (!geminiTasks || !Array.isArray(geminiTasks)) {
        console.error('Invalid Gemini response structure:', parsedResponse);
        throw new Error('AI returned invalid task structure. Please try again.');
      }
      
      // Step 5: Build draft tasks (no persistence yet)
      const taskDrafts = this.buildTaskDraftsFromGemini(geminiTasks, goals, timeframe);

      // Step 6: Validate drafts pre-commit
      const validationResults = taskDrafts.map(draft => ({
        draft,
        validation: validationService.validateTaskInput({
          task: draft,
          existing: memoryContext.existingTasks,
          projects: memoryContext.existingPlans as any // Mapping plans to projects for pressure calculation
        })
      }));

      const mergedValidation = this.mergeValidation(validationResults.map(v => v.validation));
      const hasBlocking = mergedValidation.issues.some(issue => issue.severity === 'error');
      const needsConfirmation = mergedValidation.requiresConfirmation || !input.confirm;

      if (hasBlocking || needsConfirmation) {
        reasoning.push(hasBlocking ? 'Validation blocked plan creation' : 'Validation requires user confirmation');
        return {
          result: {
            plan: null,
            tasks: [],
            reasoning,
            requiresConfirmation: true,
            validation: mergedValidation,
            draftTasks: taskDrafts
          } as PlannerOutput,
          confidence: hasBlocking ? 0.2 : 0.55,
          metadata: {
            validation: mergedValidation,
            similarItemsFound: similarItems.length,
            draftTaskCount: taskDrafts.length
          }
        };
      }

      // Step 7: Persist plan and tasks after validation & confirmation
      const planId = await this.createPlan(
        user.id, 
        goals, 
        constraints, 
        timeframe,
        planTitle || `${goals[0]} - Generated Plan`,
        planDescription || `Plan to achieve: ${goals.join(', ')}`
      );
      const plan = await planRepo.getById(planId);
      
      if (!plan) {
        return {
          result: null,
          confidence: 0,
          metadata: { error: 'Failed to create plan' }
        };
      }

      const tasks = await this.createTasksFromDrafts(taskDrafts, plan.id);
      
      // Update plan with task IDs
      const taskIds = tasks.map(task => task.id);
      await planRepo.update(plan.id, { tasks: taskIds });
      
      reasoning.push(`Generated plan title: "${plan.title}"`);
      reasoning.push(`Generated plan description: "${plan.description}"`);
      reasoning.push(`Analyzed ${goals.length} goals and created ${tasks.length} tasks using AI`);
      reasoning.push(`Estimated total effort: ${tasks.reduce((sum, task) => sum + task.estimatedTime, 0)} minutes`);
      
      // Record agent output for reflection
      await this.recordAgentOutput(input, { plan, tasks, reasoning });

      return {
        result: { plan, tasks, reasoning } as PlannerOutput,
        confidence: 0.85, // Higher confidence with AI assistance
        metadata: { 
          planId: plan.id, 
          taskCount: tasks.length,
          similarItemsFound: similarItems.length,
          validation: mergedValidation
        }
      };
    } catch (error: any) {
      console.error('Error in Planner agent:', error);
      console.error('Error stack:', error?.stack);
      console.error('Error message:', error?.message);
      return {
        result: null,
        confidence: 0,
        metadata: { 
          error: error?.message || 'Unknown error in planner agent',
          errorDetails: error?.stack,
        }
      };
    }
  }

  private async createPlan(
    userId: string, 
    goals: string[], 
    constraints: any, 
    timeframe?: { start: Date; end: Date },
    title?: string,
    description?: string
  ): Promise<string> {
    const plan = await planRepo.create({
      title: title || `${goals[0]} - Generated Plan`,
      description: description || `Plan to achieve: ${goals.join(', ')}`,
      status: 'draft',
      tasks: [], // Will be populated later
      goal: goals[0],
      constraints: constraints || {},
      startDate: timeframe?.start,
      endDate: timeframe?.end
    });

    return plan.id;
  }

  private buildTaskDraftsFromGemini(
    geminiTasks: any[],
    goals: string[],
    timeframe?: { start: Date; end: Date }
  ): Array<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>> {
    return geminiTasks.map((geminiTask, idx) => ({
      title: geminiTask.title || `Task ${idx + 1} for ${goals[0]}`,
      description: geminiTask.description || '',
      status: 'pending',
      priority: geminiTask.priority || 'medium',
      estimatedTime: geminiTask.estimatedTime || 30,
      focusLevel: geminiTask.focusLevel || 'medium',
      energyRequirement: geminiTask.energyRequirement || 'medium',
      context: geminiTask.context || '',
      subtasks: [],
      dependencies: geminiTask.dependencies || [],
      tags: geminiTask.tags || [],
      parentTaskId: undefined, // will be set on persistence
      kind: (geminiTask.kind || 'todo') as Task['kind'],
      projectId: geminiTask.projectId ?? undefined,
      recurrencePerWeek: geminiTask.recurrencePerWeek ?? undefined,
      dueDate: geminiTask.dueDate ? new Date(geminiTask.dueDate) : timeframe?.end,
      isRecurring: geminiTask.isRecurring ?? undefined,
      recurrencePattern: geminiTask.recurrencePattern ?? undefined,
    }));
  }

  private async createTasksFromDrafts(
    drafts: Array<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>,
    planId: string
  ): Promise<Task[]> {
    const tasks: Task[] = [];
    for (const draft of drafts) {
      const task = await taskRepo.create({
        ...draft,
        parentTaskId: planId,
      });
      tasks.push(task);
    }
    return tasks;
  }

  private mergeValidation(validations: ValidationResult[]): ValidationResult {
    if (!validations.length) {
      return { ok: true, requiresConfirmation: false, issues: [], summary: ['Validation passed'] };
    }
    const issues = validations.flatMap(v => v.issues || []);
    const ok = !issues.some(i => i.severity === 'error');
    const requiresConfirmation = issues.length > 0;
    const summary = validations.flatMap(v => v.summary || []);
    return { ok, requiresConfirmation, issues, summary };
  }

  private async recordAgentOutput(
    input: PlannerInput,
    output: PlannerOutput
  ): Promise<void> {
    // Would store the agent output for reflection
    const { agentOutputRepo } = await import('@automation/data');
    await agentOutputRepo.create({
      agentType: 'planner',
      input: input,
      output: output,
      confidence: 0.8
    });
  }
}
