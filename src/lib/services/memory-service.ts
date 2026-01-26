import { taskRepo, planRepo, agentOutputRepo } from '../repos/task-repo';
import { Task, Plan, AgentOutput } from '../models/task';
import GeminiService from './gemini';
import { parseJsonFromGemini } from '../utils';

export interface SimilarItem {
  item: Task | Plan;
  type: 'task' | 'plan';
  similarity: number;
  reason: string;
}

export interface UserContext {
  recentOutputs: AgentOutput[];
  existingPlans: Plan[];
  existingTasks: Task[];
  recentInputs: string[];
}

export class MemoryService {
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
  }

  /**
   * Get comprehensive user context for memory-aware processing
   */
  async getUserContext(userId: string): Promise<UserContext> {
    const [allPlans, allTasks, allOutputs] = await Promise.all([
      planRepo.getAll(),
      taskRepo.getAll(),
      agentOutputRepo.getAll(),
    ]);

    // Filter to user's data (for now, we'll use all data since we don't have user filtering yet)
    const userPlans = allPlans;
    const userTasks = allTasks;
    
    // Get last 50 agent outputs (most recent first)
    const recentOutputs = allOutputs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50);

    // Extract recent user inputs from agent outputs
    const recentInputs = recentOutputs
      .map(output => {
        if (output.input?.goals) {
          return Array.isArray(output.input.goals) 
            ? output.input.goals.join(' ') 
            : output.input.goals;
        }
        if (output.input?.message) {
          return output.input.message;
        }
        return null;
      })
      .filter((input): input is string => input !== null)
      .slice(0, 20);

    return {
      recentOutputs,
      existingPlans: userPlans,
      existingTasks: userTasks,
      recentInputs,
    };
  }

  /**
   * Find similar/duplicate items using semantic similarity
   */
  async findSimilarItems(
    input: string,
    userId: string,
    threshold: number = 0.7
  ): Promise<SimilarItem[]> {
    const context = await this.getUserContext(userId);
    const similarItems: SimilarItem[] = [];

    // Use Gemini to analyze similarity
    const prompt = `Analyze the following user input and compare it with existing plans and tasks to find duplicates or very similar items.

User Input: "${input}"

Existing Plans:
${context.existingPlans.map(plan => `- ID: ${plan.id}, Title: "${plan.title}", Description: "${plan.description}", Goal: "${plan.goal}"`).join('\n')}

Existing Tasks:
${context.existingTasks.map(task => `- ID: ${task.id}, Title: "${task.title}", Description: "${task.description || ''}"`).join('\n')}

For each existing item, determine:
1. Similarity score (0-1, where 1 is identical/duplicate, 0.7+ is very similar)
2. Reason for similarity

Return JSON array with format:
{
  "similarItems": [
    {
      "id": "item_id",
      "type": "plan" or "task",
      "similarity": 0.0-1.0,
      "reason": "brief explanation"
    }
  ]
}

Only include items with similarity >= ${threshold}.`;

    try {
      const response = await this.geminiService.generateContent(prompt);
      const result = parseJsonFromGemini(response) as { similarItems?: Array<{ id: string; type: 'plan' | 'task'; similarity: number; reason?: string }> };
      
      if (result.similarItems && Array.isArray(result.similarItems)) {
        for (const item of result.similarItems) {
          const existingItem = item.type === 'plan'
            ? context.existingPlans.find(p => p.id === item.id)
            : context.existingTasks.find(t => t.id === item.id);
          
          if (existingItem && item.similarity >= threshold) {
            similarItems.push({
              item: existingItem,
              type: item.type,
              similarity: item.similarity,
              reason: item.reason || 'Similar content found',
            });
          }
        }
      }
    } catch (error) {
      console.error('Error finding similar items:', error);
      // Fallback to simple text matching
      return this.fallbackSimilarityCheck(input, context, threshold);
    }

    // Sort by similarity (highest first)
    return similarItems.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Fallback similarity check using simple text matching
   */
  private fallbackSimilarityCheck(
    input: string,
    context: UserContext,
    threshold: number
  ): SimilarItem[] {
    const similarItems: SimilarItem[] = [];
    const inputLower = input.toLowerCase();
    const inputWords = inputLower.split(/\s+/);

    // Check plans
    for (const plan of context.existingPlans) {
      const planText = `${plan.title} ${plan.description} ${plan.goal}`.toLowerCase();
      const planWords = planText.split(/\s+/);
      
      // Calculate simple word overlap
      const commonWords = inputWords.filter(word => 
        word.length > 3 && planWords.includes(word)
      );
      const similarity = commonWords.length / Math.max(inputWords.length, planWords.length);
      
      if (similarity >= threshold) {
        similarItems.push({
          item: plan,
          type: 'plan',
          similarity,
          reason: `Shared ${commonWords.length} keywords: ${commonWords.slice(0, 3).join(', ')}`,
        });
      }
    }

    // Check tasks
    for (const task of context.existingTasks) {
      const taskText = `${task.title} ${task.description || ''}`.toLowerCase();
      const taskWords = taskText.split(/\s+/);
      
      const commonWords = inputWords.filter(word => 
        word.length > 3 && taskWords.includes(word)
      );
      const similarity = commonWords.length / Math.max(inputWords.length, taskWords.length);
      
      if (similarity >= threshold) {
        similarItems.push({
          item: task,
          type: 'task',
          similarity,
          reason: `Shared ${commonWords.length} keywords: ${commonWords.slice(0, 3).join(', ')}`,
        });
      }
    }

    return similarItems;
  }

  /**
   * Get contextually related items for enriching AI prompts
   */
  async getRelatedContext(
    input: string,
    userId: string
  ): Promise<{
    relatedPlans: Plan[];
    relatedTasks: Task[];
    relatedTags: string[];
  }> {
    const context = await this.getUserContext(userId);
    const inputLower = input.toLowerCase();
    const inputWords = inputLower.split(/\s+/).filter(w => w.length > 3);

    // Find plans with similar goals/tags
    const relatedPlans = context.existingPlans.filter(plan => {
      const planText = `${plan.title} ${plan.description} ${plan.goal}`.toLowerCase();
      return inputWords.some(word => planText.includes(word));
    });

    // Find tasks with similar descriptions/tags
    const relatedTasks = context.existingTasks.filter(task => {
      const taskText = `${task.title} ${task.description || ''} ${task.tags.join(' ')}`.toLowerCase();
      return inputWords.some(word => taskText.includes(word));
    });

    // Extract common tags
    const allTags = new Set<string>();
    relatedPlans.forEach(plan => {
      // Plans don't have tags in the model, but we can extract from related tasks
    });
    relatedTasks.forEach(task => {
      task.tags.forEach(tag => allTags.add(tag));
    });

    return {
      relatedPlans: relatedPlans.slice(0, 5), // Limit to top 5
      relatedTasks: relatedTasks.slice(0, 10), // Limit to top 10
      relatedTags: Array.from(allTags).slice(0, 10),
    };
  }
}

export const memoryService = new MemoryService();
