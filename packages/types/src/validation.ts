export type ValidationSeverity = 'error' | 'warn' | 'info';

export interface ValidationIssue {
  code: string;
  message: string;
  severity: ValidationSeverity;
  details?: string;
  relatedIds?: string[];
}

export interface ValidationResult {
  ok: boolean;
  requiresConfirmation: boolean;
  issues: ValidationIssue[];
  summary: string[];
}

export interface ValidationContext {
  timezone?: string;
  now?: Date;
}
