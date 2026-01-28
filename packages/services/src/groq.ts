import Groq from 'groq-sdk';

export class GroqService {
  private client: Groq;

  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY || '',
    });
  }

  async transcribe(file: File | Blob): Promise<string> {
    try {
      // Groq SDK accepts File objects directly
      // If we have a Blob, convert it to a File
      let audioFile: File;
      if (file instanceof File) {
        audioFile = file;
      } else {
        // Convert Blob to File
        audioFile = new File([file], 'audio.webm', { 
          type: file.type || 'audio/webm' 
        });
      }

      // The Groq SDK for Node.js accepts File objects directly
      // It will handle the file reading internally
      const transcription = await this.client.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-large-v3-turbo',
        temperature: 0,
        response_format: 'verbose_json',
      });

      return transcription.text;
    } catch (error) {
      console.error('Error in Groq transcription service:', error);
      throw error;
    }
  }
}

export const groqService = new GroqService();
export default GroqService;
