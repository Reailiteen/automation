import { Task } from '@automation/types';
import {
  BaseAgent,
  BaseAgentOutput,
  ExecutionInput,
  ExecutionOutput
} from './base-agent';
import { taskRepo, agentOutputRepo } from '@automation/data';
import { GeminiService } from '@automation/services';

export class ExecutionAgent implements BaseAgent<ExecutionInput, ExecutionOutput> {
  type = 'execution';

  async process(input: ExecutionInput): Promise<BaseAgentOutput> {
    const { user, currentTask, progress, nextSteps } = input;
    const reasoning: string[] = [];

    try {
      // Try using Gemini for guidance first
      const geminiService = new GeminiService();
      const prompt = geminiService.generatePrompt('execution', {
        currentTask,
        progress,
        nextSteps
      });
      
      try {
        const geminiResponse = await geminiService.generateContent(prompt);
        const executionOutput = JSON.parse(geminiResponse);
        
        // Find related tasks that might provide context
        const relatedTasks = await this.findRelatedTasks(currentTask);
        
        reasoning.push(`AI analyzed task: ${currentTask.title}`);
        reasoning.push(`Next step: ${executionOutput.nextStep.action} (${executionOutput.nextStep.estimatedTime} minutes)`);
        
        // Record agent output for reflection
        await this.recordAgentOutput(input, {
          nextStep: executionOutput.nextStep,
          context: executionOutput.context,
          suggestions: executionOutput.suggestions
        });

        return {
          result: {
            nextStep: executionOutput.nextStep,
            context: executionOutput.context,
            suggestions: executionOutput.suggestions
          } as ExecutionOutput,
          confidence: 0.85, // Higher confidence with AI assistance
          metadata: {
            taskId: currentTask.id,
            blockersFound: executionOutput.context.blockers.length,
            relatedTasksFound: executionOutput.context.relatedTasks.length
          }
        };
      } catch (geminiError) {
        console.warn('Gemini execution guidance failed, using fallback:', geminiError);
        
        // Fallback to rule-based guidance
        // Find related tasks that might provide context
        const relatedTasks = await this.findRelatedTasks(currentTask);
        
        // Identify blockers
        const blockers = await this.identifyBlockers(currentTask);
        
        // Determine the next step
        const nextStep = this.determineNextStep(currentTask, progress, nextSteps);
        
        // Get resources that might be helpful
        const resources = this.identifyResources(currentTask, blockers);

        reasoning.push(`Analyzed task: ${currentTask.title}`);
        reasoning.push(`Used fallback guidance`);
        
        // Record agent output for reflection
        await this.recordAgentOutput(input, {
          nextStep,
          context: { relatedTasks, blockers, resources },
          suggestions: this.generateSuggestions(currentTask, blockers)
        });

        return {
          result: {
            nextStep,
            context: { relatedTasks, blockers, resources },
            suggestions: this.generateSuggestions(currentTask, blockers)
          } as ExecutionOutput,
          confidence: nextStep ? 0.6 : 0.3, // Lower confidence with fallback
          metadata: {
            taskId: currentTask.id,
            blockersFound: blockers.length,
            relatedTasksFound: relatedTasks.length
          }
        };
      }
    } catch (error) {
      console.error('Error in Execution agent:', error);
      return {
        result: null,
        confidence: 0,
        metadata: { error: error instanceof Error ? error.message : String(error) }
      };
    }
  }

  private async findRelatedTasks(currentTask: Task): Promise<Task[]> {
    // Find tasks with similar tags, same parent/child relationships, or dependencies
    const allTasks = await taskRepo.getAll();
    
    return allTasks.filter(task => {
      // Skip the current task itself
      if (task.id === currentTask.id) return false;
      
      // Check for shared tags
      const hasSharedTags = task.tags.some(tag => currentTask.tags.includes(tag));
      
      // Check for dependencies
      const hasDependency = 
        task.dependencies.includes(currentTask.id) ||
        currentTask.dependencies.includes(task.id);
      
      // Check for parent/child relationships
      const hasRelationship = 
        task.parentTaskId === currentTask.id ||
        currentTask.parentTaskId === task.id;
      
      return hasSharedTags || hasDependency || hasRelationship;
    });
  }

  private async identifyBlockers(currentTask: Task): Promise<string[]> {
    const blockers: string[] = [];
    
    // Check if task depends on incomplete tasks
    if (currentTask.dependencies.length > 0) {
      for (const depId of currentTask.dependencies) {
        const depTask = await taskRepo.getById(depId);
        if (depTask && depTask.status !== 'completed') {
          blockers.push(`Dependency task not completed: ${depTask.title}`);
        }
      }
    }
    
    // Check if task is blocked by context (e.g., requires being at work)
    if (currentTask.context === 'work') {
      blockers.push('This task requires being at work');
    }
    
    // Check if task requires resources that might not be available
    if (currentTask.tags.includes('collaboration')) {
      blockers.push('This task requires collaboration - make sure team members are available');
    }
    
    if (currentTask.focusLevel === 'deep' && currentTask.estimatedTime > 120) {
      blockers.push('This task requires a long deep work session - ensure you have focused time');
    }
    
    return blockers;
  }

  private determineNextStep(
    task: Task, 
    progress?: ExecutionInput['progress'], 
    nextSteps?: string[]
  ): ExecutionOutput['nextStep'] {
    // If task hasn't started, first step is to begin
    if (task.status === 'pending') {
      return {
        action: 'Start working on this task',
        instructions: `Begin with ${this.getFirstStep(task)}`,
        estimatedTime: Math.min(15, task.estimatedTime)
      };
    }
    
    // If task is in progress and we have predefined steps
    if (task.status === 'in-progress' && nextSteps && nextSteps.length > 0) {
      const completedSteps = progress?.completedSteps || [];
      const remainingSteps = nextSteps.filter(step => !completedSteps.includes(step));
      
      if (remainingSteps.length > 0) {
        const nextStep = remainingSteps[0];
        return {
          action: `Continue with: ${nextStep}`,
          instructions: `Focus on completing ${nextStep}`,
          estimatedTime: Math.min(30, task.estimatedTime / remainingSteps.length)
        };
      }
    }
    
    // If all steps completed or no steps defined, suggest completing the task
    return {
      action: 'Finish and mark task as complete',
      instructions: 'Review your work and mark the task as complete',
      estimatedTime: 5
    };
  }

  private getFirstStep(task: Task): string {
    // Simple heuristic for first step based on task type
    if (task.tags.includes('research')) {
      return 'research and information gathering';
    }
    
    if (task.tags.includes('implementation')) {
      return 'setting up your development environment';
    }
    
    if (task.tags.includes('writing')) {
      return 'outlining your main points';
    }
    
    return 'setting up your workspace';
  }

  private identifyResources(task: Task, blockers: string[]): string[] {
    const resources: string[] = [];
    
    // Add context-specific resources
    if (task.tags.includes('research')) {
      resources.push('Note-taking tool', 'Reference materials', 'Bookmark tool');
    }
    
    if (task.tags.includes('implementation') || task.tags.includes('coding')) {
      resources.push('Code editor', 'Documentation', 'Version control');
    }
    
    if (task.tags.includes('collaboration')) {
      resources.push('Communication tool', 'Shared workspace', 'Meeting scheduler');
    }
    
    if (task.focusLevel === 'deep') {
      resources.push('Focus app/website blocker', 'Noise-cancelling headphones');
    }
    
    // Add resources for blockers
    blockers.forEach(blocker => {
      if (blocker.includes('collaboration')) {
        resources.push('Team contact list');
      }
      
      if (blocker.includes('deep_work')) {
        resources.push('Time blocking tool');
      }
    });
    
    return [...new Set(resources)]; // Remove duplicates
  }

  private generateSuggestions(task: Task, blockers: string[]): string[] {
    const suggestions: string[] = [];
    
    if (task.status === 'pending') {
      suggestions.push('Start with a small, concrete step to build momentum');
    }
    
    if (blockers.length > 0) {
      suggestions.push('Address any blockers before continuing');
      suggestions.push('Consider if the task can be simplified to avoid blockers');
    }
    
    if (task.estimatedTime > 120) {
      suggestions.push('Consider breaking this into smaller subtasks');
      suggestions.push('schedule multiple sessions for this task');
    }
    
    if (task.focusLevel === 'deep') {
      suggestions.push('Make sure you have adequate time and low interruption for this task');
      suggestions.push('Consider scheduling during your peak energy hours');
    }
    
    return suggestions;
  }

  private async recordAgentOutput(
    input: ExecutionInput,
    output: ExecutionOutput
  ): Promise<void> {
    await agentOutputRepo.create({
      agentType: 'execution',
      input: input,
      output: output,
      confidence: 0.75
    });
  }
}