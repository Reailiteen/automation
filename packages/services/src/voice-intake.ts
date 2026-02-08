/**
 * Voice intake helper: chunks messy speech into logical units and classifies each
 * into intents (task, reminder, habit, note) with lightweight heuristics.
 * Designed to be paired with LLM refinement but provides deterministic fallbacks.
 */
import { geminiService } from './gemini';

export type VoiceChunkIntent = 'task' | 'reminder' | 'habit' | 'note' | 'unknown';

export interface VoiceChunk {
  raw: string;
  normalized: string;
  intent: VoiceChunkIntent;
  timeExpressions: string[];
  dueAt?: string | null;
}

export class VoiceIntakeService {
  /**
   * Processes a transcript using LLM for high-quality intent extraction and temporal normalization.
   * Falls back to deterministic heuristics if LLM fails or is unavailable.
   */
  async process(transcript: string, now: Date = new Date(), timeZone: string = 'UTC'): Promise<VoiceChunk[]> {
    try {
      const result = await geminiService.processVoiceTranscript(transcript, now, timeZone);
      if (result && Array.isArray(result.chunks)) {
        return result.chunks;
      }
    } catch (error) {
      console.error('LLM voice processing failed, falling back to heuristics:', error);
    }

    return this.splitAndClassifyHeuristic(transcript);
  }

  splitAndClassifyHeuristic(transcript: string): VoiceChunk[] {
    // Naive sentence segmentation; in production use a proper NLP splitter.
    const sentences = transcript
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(Boolean);

    return sentences.map(sentence => {
      const normalized = sentence.toLowerCase();
      const intent = this.detectIntent(normalized);
      const timeExpressions = this.extractTime(normalized);
      return { raw: sentence, normalized, intent, timeExpressions };
    });
  }

  private detectIntent(text: string): VoiceChunkIntent {
    if (text.includes('every day') || text.includes('daily')) return 'habit';
    if (text.startsWith('remind') || text.includes('remind me')) return 'reminder';
    if (text.includes('note') || text.startsWith('note to self')) return 'note';
    if (text.includes('task') || text.includes('todo') || text.includes('to do')) return 'task';
    return 'unknown';
  }

  private extractTime(text: string): string[] {
    const matches = text.match(/\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}(:\d{2})?\s?(am|pm)?|\d{4}-\d{2}-\d{2})\b/gi);
    return matches ? matches : [];
  }
}

export const voiceIntakeService = new VoiceIntakeService();
