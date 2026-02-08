// Export all services
export { GeminiService } from './gemini';
export { memoryService, MemoryService } from './memory-service';
export { computePressure, getWeekBounds } from './pressure-service';
export type { PressureResult } from './pressure-service';
export type { SimilarItem, UserContext } from './memory-service';
export { validationService, ValidationService } from './validation-service';
export { notificationGuard, NotificationGuard } from './notification-guard';
export { voiceIntakeService, VoiceIntakeService } from './voice-intake';
export { emailService, EmailService } from './email-service';
export { clickUpService, ClickUpService } from './clickup-service';

// Export environment utilities
export { getEnv, requireEnv } from './env';

// Re-export groq if needed
export * from './groq';
