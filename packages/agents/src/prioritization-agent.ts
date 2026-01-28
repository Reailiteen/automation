import { Task } from '@automation/types';
import {
  BaseAgent,
  BaseAgentOutput,
  PrioritizationInput,
  PrioritizationOutput,
  PriorityFactors,
  PrioritizedTask
} from './base-agent';
import { taskRepo, agentOutputRepo } from '@automation/data';
import { GeminiService } from '@automation/services';

export class PrioritizationAgent implements BaseAgent<PrioritizationInput, PrioritizationOutput> {
  type = 'prioritization';

  async process(input: PrioritizationInput): Promise<BaseAgentOutput> {
    const { user, tasks, currentContext } = input;
    const reasoning: string[] = [];

    try {
      // Use Gemini to prioritize tasks
      const geminiService = new GeminiService();
      const prompt = geminiService.generatePrompt('prioritization', { 
        tasks,
        currentContext
      });
      
      const geminiResponse = await geminiService.generateContent(prompt);
      const { tasks: geminiTasks } = JSON.parse(geminiResponse);
      
      // Convert Gemini response to our prioritized tasks
      const prioritizedTasks = await this.createPrioritizedTasksFromGeminiResponse(geminiTasks, tasks);
      
      // Sort tasks by priority score
      const sortedTasks = prioritizedTasks.sort((a, b) => b.priorityScore - a.priorityScore);
      
      reasoning.push(`Prioritized ${tasks.length} tasks using AI analysis`);
      reasoning.push(`Highest priority: ${sortedTasks[0]?.title || 'None'}`);
      reasoning.push(`Context consideration: ${currentContext ? 'Applied' : 'Not available'}`);

      // Record agent output for reflection
      await this.recordAgentOutput(input, { tasks: sortedTasks, reasoning });

      return {
        result: { tasks: sortedTasks, reasoning } as PrioritizationOutput,
        confidence: 0.9,
        metadata: { taskCount: tasks.length, contextConsidered: !!currentContext }
      };
    } catch (error) {
      console.error('Error in Prioritization agent:', error);
      
      // Fallback to rule-based prioritization
      const prioritizedTasks = await this.calculatePriorityScores(tasks, currentContext);
      const sortedTasks = prioritizedTasks.sort((a, b) => b.priorityScore - a.priorityScore);
      
      reasoning.push(`Used rule-based prioritization as fallback`);
      
      return {
        result: { tasks: sortedTasks, reasoning } as PrioritizationOutput,
        confidence: 0.6, // Lower confidence with fallback
        metadata: { taskCount: tasks.length, contextConsidered: !!currentContext }
      };
    }
  }

  private async calculatePriorityScores(
    tasks: Task[], 
    currentContext?: PrioritizationInput['currentContext']
  ): Promise<PrioritizedTask[]> {
    const prioritizedTasks: PrioritizedTask[] = [];

    for (const task of tasks) {
      const factors = await this.calculatePriorityFactors(task, currentContext);
      const priorityScore = this.combinePriorityFactors(factors);
      
      prioritizedTasks.push({
        ...task,
        priority: this.mapScoreToPriority(priorityScore),
        priorityScore,
        factors
      });
    }

    return prioritizedTasks;
  }

  private async calculatePriorityFactors(
    task: Task, 
    currentContext?: PrioritizationInput['currentContext']
  ): Promise<PriorityFactors> {
    const factors: PriorityFactors = {
      deadlineImportance: this.calculateDeadlineImportance(task),
      longTermValue: this.calculateLongTermValue(task),
      requiredFocus: this.mapFocusLevel(task.focusLevel),
      energyCost: this.mapEnergyRequirement(task.energyRequirement),
      dependencyComplexity: this.calculateDependencyComplexity(task),
      userPreference: 0.5 // Default, would be personalized with data
    };

    // Adjust factors based on current context
    if (currentContext) {
      // If user has low energy, lower priority for high-energy tasks
      if (currentContext.currentEnergy === 'low' && factors.energyCost > 0.6) {
        factors.userPreference -= 0.3;
      }
      
      // If limited time, prioritize shorter tasks
      if (currentContext.availableTime < task.estimatedTime * 1.5) {
        factors.deadlineImportance -= 0.2;
      }
      
      // If location-specific tasks match current location, boost priority
      if (task.context !== 'anywhere' && task.context === currentContext.location) {
        factors.userPreference += 0.2;
      }
    }

    return factors;
  }

  private calculateDeadlineImportance(task: Task): number {
    if (!task.dueDate) return 0.3; // No deadline = moderate importance
    
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue <= 0) return 1; // Overdue
    if (daysUntilDue <= 1) return 0.9; // Due today or tomorrow
    if (daysUntilDue <= 3) return 0.7; // Due this week
    if (daysUntilDue <= 7) return 0.5; // Due next week
    return 0.3; // More than a week away
  }

  private calculateLongTermValue(task: Task): number {
    // Simple heuristic based on priority and tags
    let value = 0.5;
    
    if (task.priority === 'urgent' || task.priority === 'high') value += 0.3;
    if (task.tags.includes('important') || task.tags.includes('strategic')) value += 0.3;
    if (task.tags.includes('maintenance') || task.tags.includes('admin')) value -= 0.2;
    
    return Math.min(1, Math.max(0, value));
  }

  private mapFocusLevel(focusLevel: Task['focusLevel']): number {
    switch (focusLevel) {
      case 'shallow': return 0.3;
      case 'medium': return 0.5;
      case 'deep': return 0.8;
      default: return 0.5;
    }
  }

  private mapEnergyRequirement(energy: Task['energyRequirement']): number {
    switch (energy) {
      case 'low': return 0.2;
      case 'medium': return 0.5;
      case 'high': return 0.8;
      default: return 0.5;
    }
  }

  private calculateDependencyComplexity(task: Task): number {
    const dependencyCount = task.dependencies.length + task.subtasks.length;
    
    if (dependencyCount === 0) return 0.1;
    if (dependencyCount === 1) return 0.3;
    if (dependencyCount <= 3) return 0.5;
    if (dependencyCount <= 5) return 0.7;
    return 0.9;
  }

  private combinePriorityFactors(factors: PriorityFactors): number {
    // Weighted combination of factors
    const weightedFactors = [
      { factor: factors.deadlineImportance, weight: 0.25 },
      { factor: factors.longTermValue, weight: 0.20 },
      { factor: factors.requiredFocus, weight: 0.15 },
      { factor: 1 - factors.energyCost, weight: 0.15 }, // Inverted because high cost is bad
      { factor: 1 - factors.dependencyComplexity, weight: 0.10 }, // Inverted because complex is bad
      { factor: factors.userPreference, weight: 0.15 }
    ];

    return weightedFactors.reduce((sum, { factor, weight }) => sum + factor * weight, 0);
  }

  private mapScoreToPriority(score: number): 'low' | 'medium' | 'high' | 'urgent' {
    if (score >= 0.8) return 'urgent';
    if (score >= 0.6) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
  }

  private async createPrioritizedTasksFromGeminiResponse(geminiTasks: any[], originalTasks: Task[]): Promise<PrioritizedTask[]> {
    const prioritizedTasks: PrioritizedTask[] = [];
    
    // Create a map for quick lookup
    const taskMap = new Map<string, Task>();
    for (const task of originalTasks) {
      taskMap.set(task.id, task);
    }
    
    // Convert Gemini response to our prioritized tasks
    for (const geminiTask of geminiTasks) {
      const originalTask = taskMap.get(geminiTask.id);
      if (!originalTask) continue;
      
      // Create priority factors for this task
      const factors: PriorityFactors = await this.calculatePriorityFactors(originalTask);
      
      prioritizedTasks.push({
        ...originalTask,
        priority: geminiTask.priority,
        priorityScore: geminiTask.priorityScore,
        factors
      });
    }
    
    // If any tasks weren't included in Gemini response, add them with default priority
    for (const task of originalTasks) {
      if (!prioritizedTasks.some(pt => pt.id === task.id)) {
        const factors: PriorityFactors = await this.calculatePriorityFactors(task);
        
        prioritizedTasks.push({
          ...task,
          priority: 'medium',
          priorityScore: 0.5,
          factors
        });
      }
    }

    return prioritizedTasks;
  }

  private async recordAgentOutput(
    input: PrioritizationInput,
    output: PrioritizationOutput
  ): Promise<void> {
    await agentOutputRepo.create({
      agentType: 'prioritizer',
      input: input,
      output: output,
      confidence: 0.9
    });
  }
}