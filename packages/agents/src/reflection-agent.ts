import { Task } from '@automation/types';
import {
  BaseAgent,
  BaseAgentOutput,
  ReflectionInput,
  ReflectionOutput
} from './base-agent';
import { agentOutputRepo, userRepo } from '@automation/data';
import { GeminiService } from '@automation/services';

export class ReflectionAgent implements BaseAgent<ReflectionInput, ReflectionOutput> {
  type = 'reflection';

  async process(input: ReflectionInput): Promise<BaseAgentOutput> {
    const { user, tasks, completionHistory, userFeedback } = input;
    const reasoning: string[] = [];

    try {
      // Try using Gemini for reflection first
      const geminiService = new GeminiService();
      const prompt = geminiService.generatePrompt('reflection', {
        tasks,
        completionHistory,
        userFeedback
      });
      
      try {
        const geminiResponse = await geminiService.generateContent(prompt);
        const reflectionOutput = JSON.parse(geminiResponse);
        
        reasoning.push(`AI analyzed ${completionHistory.length} task completions`);
        reasoning.push(`Identified ${reflectionOutput.insights.patterns.length} behavioral patterns`);
        
        // Record agent output for future analysis
        await this.recordAgentOutput(input, reflectionOutput);

        return {
          result: {
            insights: reflectionOutput.insights,
            recommendations: reflectionOutput.recommendations
          } as ReflectionOutput,
          confidence: 0.9, // Higher confidence with AI assistance
          metadata: {
            patternsFound: reflectionOutput.insights.patterns.length,
            adjustmentsIdentified: reflectionOutput.insights.adjustments.length
          }
        };
      } catch (geminiError) {
        console.warn('Gemini reflection analysis failed, using fallback:', geminiError);
        
        // Fallback to rule-based analysis
        // Analyze completion patterns
        const patterns = this.analyzePatterns(completionHistory);
        
        // Generate insights and recommendations
        const insights = {
          patterns,
          adjustments: await this.identifyAdjustments(patterns, userFeedback, tasks)
        };
        
        const recommendations = this.generateRecommendations(patterns, insights.adjustments);
        
        reasoning.push(`Fallback analyzed ${completionHistory.length} task completions`);
        reasoning.push(`Identified ${patterns.length} behavioral patterns`);
        
        // Record agent output for future analysis
        await this.recordAgentOutput(input, { insights, recommendations });

        return {
          result: { insights, recommendations } as ReflectionOutput,
          confidence: 0.6, // Lower confidence with fallback
          metadata: {
            patternsFound: patterns.length,
            adjustmentsIdentified: insights.adjustments.length
          }
        };
      }
    } catch (error) {
      console.error('Error in Reflection agent:', error);
      return {
        result: null,
        confidence: 0,
        metadata: { error: error instanceof Error ? error.message : String(error) }
      };
    }
  }

  private analyzePatterns(completionHistory: ReflectionInput['completionHistory']): string[] {
    const patterns: string[] = [];
    
    // Check for time estimation patterns
    const timeAccuracy = completionHistory.map(h => h.actualTime / h.plannedTime);
    const avgTimeAccuracy = timeAccuracy.reduce((sum, accuracy) => sum + accuracy, 0) / timeAccuracy.length;
    
    if (avgTimeAccuracy > 1.5) {
      patterns.push('Consistently underestimates task duration');
    } else if (avgTimeAccuracy < 0.8) {
      patterns.push('Consistently overestimates task duration');
    } else {
      patterns.push('Generally accurate time estimation');
    }
    
    // Check for energy patterns
    const highEnergyTasks = completionHistory.filter(h => {
      // In a real implementation, would look up task quality
      return h.quality === 'excellent'; // High quality work tends to happen during peak energy
    });
    
    if (highEnergyTasks.length / completionHistory.length > 0.7) {
      patterns.push('Performs well on high-energy tasks');
    }
    
    // Check for task type patterns
    const tagGroups = this.groupByTags(completionHistory);
    for (const [tag, completions] of Object.entries(tagGroups)) {
      if (completions.length < 2) continue;
      
      const avgQuality = completions.reduce((sum, c) => sum + (c.quality === 'excellent' ? 2 : c.quality === 'good' ? 1 : 0), 0) / completions.length;
      const avgAccuracy = completions.reduce((sum, c) => sum + c.actualTime / c.plannedTime, 0) / completions.length;
      
      if (avgQuality > 1.5) {
        patterns.push(`Strong performer on ${tag} tasks`);
      }
      
      if (avgAccuracy > 1.3) {
        patterns.push(`Underestimates ${tag} task duration`);
      }
    }
    
    // Check for procrastination patterns
    const delayedTasks = completionHistory.filter(h => {
      // Would check if task was completed after due date
      return false; // Placeholder logic
    });
    
    if (delayedTasks.length / completionHistory.length > 0.3) {
      patterns.push('Frequently delays task completion');
    }
    
    return patterns;
  }

  private groupByTags(completionHistory: ReflectionInput['completionHistory']): Record<string, typeof completionHistory> {
    const groups: Record<string, typeof completionHistory> = {};
    
    // This is a simplified version - would need to look up actual task details
    // For now, we'll create some example groups
    
    const researchTasks = completionHistory.slice(0, Math.floor(completionHistory.length / 3));
    const implementationTasks = completionHistory.slice(
      Math.floor(completionHistory.length / 3),
      Math.floor(completionHistory.length * 2 / 3)
    );
    const otherTasks = completionHistory.slice(Math.floor(completionHistory.length * 2 / 3));
    
    if (researchTasks.length > 0) groups['research'] = researchTasks;
    if (implementationTasks.length > 0) groups['implementation'] = implementationTasks;
    if (otherTasks.length > 0) groups['other'] = otherTasks;
    
    return groups;
  }

  private async identifyAdjustments(
    patterns: string[], 
    userFeedback?: ReflectionInput['userFeedback'], 
    tasks?: Task[]
  ): Promise<ReflectionOutput['insights']['adjustments']> {
    const adjustments: ReflectionOutput['insights']['adjustments'] = [];
    
    // Time estimation adjustments
    if (patterns.includes('Consistently underestimates task duration')) {
      adjustments.push({
        type: 'time',
        before: 'Current time estimation approach',
        after: 'Increase estimate by 50% and track actual vs planned time',
        reason: 'Tasks consistently take longer than expected'
      });
    }
    
    if (patterns.includes('Consistently overestimates task duration')) {
      adjustments.push({
        type: 'time',
        before: 'Current time estimation approach',
        after: 'Reduce estimate by 25% and break into smaller milestones',
        reason: 'Tasks consistently completed faster than expected'
      });
    }
    
    // Energy-related adjustments
    if (patterns.includes('Performs well on high-energy tasks')) {
      adjustments.push({
        type: 'energy',
        before: 'Mixed task scheduling',
        after: 'Schedule high-focus work during peak energy hours and low-focus tasks elsewhere',
        reason: 'Performance is better when matching task energy requirements to personal energy levels'
      });
    }
    
    // Priority adjustments
    if (userFeedback && userFeedback.some(feedback => feedback.difficulty === 'too-hard')) {
      adjustments.push({
        type: 'priority',
        before: 'Current task prioritization',
        after: 'Break complex tasks earlier and give more time for preparation',
        reason: 'Some tasks are perceived as too difficult without proper preparation'
      });
    }
    
    // Process adjustments
    if (patterns.includes('Frequently delays task completion')) {
      adjustments.push({
        type: 'process',
        before: 'Current planning process',
        after: 'Add more frequent check-ins and break large tasks into smaller steps',
        reason: 'Delaying completion suggests tasks seem overwhelming or not urgent enough'
      });
    }
    
    return adjustments;
  }

  private generateRecommendations(patterns: string[], adjustments: ReflectionOutput['insights']['adjustments']): string[] {
    const recommendations: string[] = [];
    
    if (patterns.includes('Consistently underestimates task duration')) {
      recommendations.push('Start tracking actual vs. planned time for all tasks to improve estimation');
      recommendations.push('Add 20-50% buffer time to all task estimates');
    }
    
    if (patterns.includes('Performs well on high-energy tasks')) {
      recommendations.push('Schedule your most challenging work during your peak energy hours');
      recommendations.push('Save low-energy tasks for when your energy is lower');
    }
    
    if (patterns.includes('Frequently delays task completion')) {
      recommendations.push('Break down complex tasks into smaller, more manageable chunks');
      recommendations.push('Set up regular check-ins to stay on track');
    }
    
    if (adjustments.some(adj => adj.type === 'priority')) {
      recommendations.push('Re-evaluate your task prioritization method');
      recommendations.push('Consider using the Eisenhower matrix (urgent/important) for better focus');
    }
    
    // General recommendations
    recommendations.push('Review your task completion patterns weekly');
    recommendations.push('Adjust your planning approach based on actual completion data');
    
    return recommendations;
  }

  private async recordAgentOutput(
    input: ReflectionInput,
    output: ReflectionOutput
  ): Promise<void> {
    await agentOutputRepo.create({
      agentType: 'reflection',
      input: input,
      output: output,
      confidence: 0.85
    });
  }
}