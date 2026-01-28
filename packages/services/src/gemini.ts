// Gemini AI service for agent operations
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getEnv } from './env';

// This will be used for all Gemini API calls
export class GeminiService {
  private apiKey: string;
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    this.apiKey = getEnv('GEMINI_API_KEY') || '';
    
    // Remove any surrounding quotes that might have been included
    if (this.apiKey) {
      this.apiKey = this.apiKey.trim().replace(/^["']|["']$/g, '');
    }
    
    if (!this.apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables');
    } else {
      console.log('Gemini API key loaded, length:', this.apiKey.length);
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
      } catch (error) {
        console.error('Failed to initialize Google Generative AI:', error);
      }
    }
  }

  async generateContent(prompt: string, modelName: string = 'gemini-2.0-flash'): Promise<string> {
    if (!this.genAI) {
      throw new Error('Google Generative AI not initialized. Check your API key.');
    }

    // Try multiple model names in order of preference (updated to use currently available models)
    // Start with newer models that are actually available in v1beta API
    const modelNames = [
      'gemini-2.5-flash',  // Latest available
      'gemini-2.0-flash',  // Known to work (confirmed from your logs)
    ];

    // Allow override via environment variable or parameter
    const preferredModel = getEnv('GEMINI_MODEL') || modelName;
    if (preferredModel && modelNames.includes(preferredModel)) {
      modelNames.unshift(preferredModel);
    }

    let lastError: Error | null = null;
    let attemptedModels: string[] = [];
    
    for (const model of modelNames) {
      try {
        const genModel = this.genAI.getGenerativeModel({ model });
        const result = await genModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Silently succeed - no logging needed for normal operation
        return text;
      } catch (error: any) {
        // Silently skip 404 errors (model not available) - these are expected when trying fallbacks
        // Only track non-404 errors as they might indicate real problems
        if (!error.message?.includes('404') && !error.message?.includes('Not Found')) {
          console.warn(`Error with model ${model}:`, error.message);
        }
        attemptedModels.push(model);
        lastError = error;
        // Continue to next model
        continue;
      }
    }

    // If we get here, all models failed - log all attempted models
    const errorMessage = `Failed to generate content with any available Gemini model. Attempted: ${attemptedModels.join(', ')}. Please check your API key and model availability.`;
    console.error(errorMessage);
    throw lastError || new Error(errorMessage);
  }

  generatePrompt(agentType: 'planner' | 'prioritization' | 'scheduler' | 'execution' | 'reflection', context: any): string {
    switch (agentType) {
      case 'planner':
        return this.generatePlannerPrompt(context);
      case 'prioritization':
        return this.generatePrioritizationPrompt(context);
      case 'scheduler':
        return this.generateSchedulerPrompt(context);
      case 'execution':
        return this.generateExecutionPrompt(context);
      case 'reflection':
        return this.generateReflectionPrompt(context);
      default:
        throw new Error(`Unknown agent type: ${agentType}`);
    }
  }

  private generatePlannerPrompt(context: any): string {
    const memoryContext = context.memoryContext || {};
    const similarItems = context.similarItems || [];
    const originalInput = context.originalInput || context.goals.join(', ');
    
    let memorySection = '';
    if (memoryContext.existingPlans && memoryContext.existingPlans.length > 0) {
      memorySection += `\n\nExisting Plans (for context, avoid duplication):\n${memoryContext.existingPlans.slice(0, 5).map((plan: any) => 
        `- "${plan.title}": ${plan.description} (Goal: ${plan.goal})`
      ).join('\n')}`;
    }
    
    if (memoryContext.relatedTasks && memoryContext.relatedTasks.length > 0) {
      memorySection += `\n\nRelated Tasks (for context):\n${memoryContext.relatedTasks.slice(0, 5).map((task: any) => 
        `- "${task.title}": ${task.description || 'No description'}`
      ).join('\n')}`;
    }
    
    let duplicateWarning = '';
    if (similarItems.length > 0) {
      duplicateWarning = `\n\n⚠️ DUPLICATE DETECTION: Similar items found:\n${similarItems.map((item: any) => 
        `- ${item.type === 'plan' ? 'Plan' : 'Task'}: "${item.item.title}" (${(item.similarity * 100).toFixed(0)}% similar) - ${item.reason}`
      ).join('\n')}\n\nIMPORTANT: If creating a new plan, ensure it's meaningfully different from the above. Consider merging or updating existing items instead.`;
    }

    return `You are a task planning AI assistant. Your job is to help users break down their goals into actionable tasks.

User Input: "${originalInput}"
User goals: ${context.goals.join(', ')}
Time constraints: ${JSON.stringify(context.constraints)}
Expected timeframe: ${context.timeframe ? `${context.timeframe.start} to ${context.timeframe.end}` : 'not specified'}${memorySection}${duplicateWarning}

FIRST, generate a meaningful plan title and description from the user input:
- Title: Should be concise (under 60 characters), descriptive, and capture the essence of the goal
- Description: Should be a brief summary (under 200 characters) explaining what this plan aims to achieve

THEN, break down these goals into specific, actionable tasks. For each task, provide:
1. A clear title (under 60 characters)
2. A brief description (under 150 characters)
3. Estimated time to complete (in minutes)
4. Required focus level (shallow, medium, or deep)
5. Energy requirement (low, medium, or high)
6. Appropriate context (home, work, or anywhere)
7. Relevant tags (max 3)
8. kind: one of "reminder" (one-off time-based), "todo" (general actionable item), "habit" (recurring, no fixed time), "daily" (recurring daily)
9. recurrencePerWeek: 1 for reminder/todo, 7 for daily, 3 for habit (times per week)

Return ONLY valid JSON. Do not wrap in markdown code blocks (no \`\`\`).
Use this structure:
{
  "planTitle": "generated title from user input",
  "planDescription": "generated description from user input",
  "tasks": [
    {
      "title": "string",
      "description": "string",
      "estimatedTime": number,
      "focusLevel": "shallow|medium|deep",
      "energyRequirement": "low|medium|high",
      "context": "home|work|anywhere",
      "tags": ["tag1", "tag2"],
      "kind": "reminder|todo|habit|daily",
      "recurrencePerWeek": number
    }
  ]
}`;
  }

  private generatePrioritizationPrompt(context: any): string {
    return `You are a task prioritization AI assistant. Your job is to help users prioritize their tasks based on multiple factors.

Current context:
${context.currentContext ? `
- Available time: ${context.currentContext.availableTime} minutes
- Current energy level: ${context.currentContext.currentEnergy}
- Current location: ${context.currentContext.location}
- Available tools: ${context.currentContext.toolsAvailable.join(', ')}` : 'No specific context provided'}

Please analyze these tasks and rank them by priority. Consider:
1. Deadline importance
2. Long-term value
3. Required focus level
4. Energy cost
5. Dependency complexity
6. User preferences based on context

Tasks to prioritize:
${JSON.stringify(context.tasks, null, 2)}

Return your response as JSON with an array of prioritized tasks, each with a priority score (0-1):
{
  "tasks": [
    {
      "id": "task_id",
      "priorityScore": number,
      "priority": "low|medium|high|urgent",
      "reasoning": "brief explanation of priority score"
    }
  ]
}`;
  }

  private generateSchedulerPrompt(context: any): string {
    return `You are a task scheduling AI assistant. Your job is to help users schedule their tasks optimally.

Date to schedule: ${context.date.toLocaleDateString()}
Energy profile: ${JSON.stringify(context.energyProfile)}
${context.existingEvents ? `Existing events: ${JSON.stringify(context.existingEvents)}` : ''}
${context.constraints ? `Constraints: ${JSON.stringify(context.constraints)}` : ''}

Tasks to schedule:
${JSON.stringify(context.tasks, null, 2)}

Please create a Schedule for this date. Consider:
1. User's energy profile (when their focus is strongest/weakest)
2. Deep work session limits (max 2-3 sessions per day)
3. Break time between deep work sessions (at least 15 minutes)
4. Task focus levels and energy requirements
5. Conflicts with existing events

Return your response as JSON with a schedule:
{
  "schedule": {
    "date": "${context.date.toISOString()}",
    "tasks": [
      {
        "taskId": "task_id",
        "title": "task_title",
        "scheduledStart": "ISO_datetime",
        "scheduledEnd": "ISO_datetime",
        "status": "scheduled"
      }
    ],
    "reasoning": "brief explanation of scheduling decisions"
  }
}`;
  }

  private generateExecutionPrompt(context: any): string {
    return `You are a task execution AI assistant. Your job is to help users work on their current task effectively.

Current task: ${JSON.stringify(context.currentTask, null, 2)}
${context.progress ? `Current progress: ${JSON.stringify(context.progress)}` : ''}
${context.nextSteps ? `Next steps: ${context.nextSteps.join(', ')}` : ''}

Please provide:
1. The absolute next step the user should take
2. Clear instructions on how to complete this step
3. Estimated time to complete this step
4. Relevant context about related tasks and potential blockers
5. Helpful suggestions for effective execution

Return your response as JSON:
{
  "nextStep": {
    "action": "string",
    "instructions": "string",
    "estimatedTime": number,
  },
  "context": {
    "relatedTasks": ["task_id1", "task_id2"],
    "blockers": ["blocker1", "blocker2"],
    "resources": ["resource1", "resource2"]
  },
  "suggestions": ["suggestion1", "suggestion2"]
}`;
  }

  private generateReflectionPrompt(context: any): string {
    return `You are a task reflection AI assistant. Your job is to help users learn from their task completion patterns.

Tasks being reflected on: ${JSON.stringify(context.tasks, null, 2)}
${context.completionHistory.length > 0 ? `Task completion history: ${JSON.stringify(context.completionHistory, null, 2)}` : ''}
${context.userFeedback && context.userFeedback.length > 0 ? `User feedback: ${JSON.stringify(context.userFeedback, null, 2)}` : ''}

Please analyze this data and provide:

1. Behavioral patterns in task completion (time estimation accuracy, procrastination tendencies, etc.)
2. Specific adjustments the user should make to their process
3. Personalized recommendations for better task management

Return your response as JSON:
{
  "insights": {
    "patterns": ["pattern1", "pattern2"],
    "adjustments": [
      {
        "type": "time|energy|priority|process",
        "before": "current approach",
        "after": "suggested approach",
        "reason": "why this change would help"
      }
    ]
  },
  "recommendations": ["recommendation1", "recommendation2"]
}`;
  }
}
