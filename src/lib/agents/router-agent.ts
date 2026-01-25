import { BaseAgent, AgentOutput, BaseAgentInput } from './base-agent';
import GeminiService from '../services/gemini';

export type InputType = 'task' | 'plan' | 'note' | 'reminder' | 'question';

export interface RouterInput extends BaseAgentInput {
  input: string;
}

export interface RouterOutput {
  type: InputType;
  confidence: number;
  reasoning: string;
  suggestedAction?: string;
}

export class RouterAgent implements BaseAgent<RouterInput, RouterOutput> {
  type = 'router';
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
  }

  async process(input: RouterInput): Promise<AgentOutput> {
    const { input: userInput } = input;

    try {
      const classification = await this.classifyInput(userInput);
      
      return {
        result: classification,
        confidence: classification.confidence,
        metadata: {
          inputType: classification.type,
          reasoning: classification.reasoning,
        },
      };
    } catch (error) {
      console.error('Error in Router agent:', error);
      return {
        result: {
          type: 'question',
          confidence: 0.5,
          reasoning: 'Failed to classify input, defaulting to question',
        } as RouterOutput,
        confidence: 0.5,
        metadata: { error: error.message },
      };
    }
  }

  private async classifyInput(input: string): Promise<RouterOutput> {
    const prompt = `Analyze the following user input and classify it into one of these categories:
1. "task" - A single actionable item (e.g., "Buy groceries", "Call John", "Finish report")
2. "plan" - A multi-step goal or project (e.g., "Build a website", "Plan a vacation", "Learn Spanish")
3. "note" - Information to remember (e.g., "John's phone number is 555-1234", "Meeting moved to Friday")
4. "reminder" - A time-based alert (e.g., "Remind me to call mom tomorrow", "Set reminder for dentist appointment")
5. "question" - A question that needs an answer (e.g., "What tasks do I have today?", "How do I prioritize?")

User Input: "${input}"

Analyze the intent and content. Consider:
- Single action vs multiple steps
- Time references (reminders)
- Question words (what, how, when, why)
- Information storage vs action items

Return your response as JSON:
{
  "type": "task" | "plan" | "note" | "reminder" | "question",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation of classification",
  "suggestedAction": "what should happen next"
}`;

    try {
      const response = await this.geminiService.generateContent(prompt);
      const result = JSON.parse(response);
      
      return {
        type: result.type || 'question',
        confidence: result.confidence || 0.5,
        reasoning: result.reasoning || 'Classification completed',
        suggestedAction: result.suggestedAction,
      };
    } catch (error) {
      console.error('Error classifying input:', error);
      // Fallback classification
      return this.fallbackClassification(input);
    }
  }

  private fallbackClassification(input: string): RouterOutput {
    const inputLower = input.toLowerCase();
    
    // Check for question words
    if (/\b(what|how|when|where|why|who|which|can|could|should|would|is|are|do|does|did)\b/i.test(input)) {
      return {
        type: 'question',
        confidence: 0.7,
        reasoning: 'Contains question words',
        suggestedAction: 'Route to chat agent',
      };
    }

    // Check for reminder keywords
    if (/\b(remind|reminder|alert|notify|remember to)\b/i.test(input)) {
      return {
        type: 'reminder',
        confidence: 0.8,
        reasoning: 'Contains reminder keywords',
        suggestedAction: 'Create reminder',
      };
    }

    // Check for plan indicators (multiple steps, project words)
    if (/\b(plan|project|build|create|develop|learn|study|prepare|organize)\b/i.test(input) ||
        input.split(/\s+/).length > 10) {
      return {
        type: 'plan',
        confidence: 0.7,
        reasoning: 'Contains plan indicators or is lengthy',
        suggestedAction: 'Route to planner agent',
      };
    }

    // Check for note indicators
    if (/\b(note|remember|save|store|info|information|phone|email|address)\b/i.test(input)) {
      return {
        type: 'note',
        confidence: 0.7,
        reasoning: 'Contains note indicators',
        suggestedAction: 'Store as note',
      };
    }

    // Default to task
    return {
      type: 'task',
      confidence: 0.6,
      reasoning: 'Single actionable item',
      suggestedAction: 'Create task',
    };
  }
}
