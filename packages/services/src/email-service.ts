export interface EmailDraft {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
}

export interface EmailSendOptions {
  confirmed: boolean; // must be true to actually send
  dryRun?: boolean; // when true, return payload only
}

/**
 * Email service stub that enforces explicit preview/confirmation before send.
 * Integrate with provider (e.g., Resend, SES) where indicated.
 */
export class EmailService {
  async preview(draft: EmailDraft) {
    return {
      draft,
      summary: `Ready to send to ${draft.to.join(', ')}`,
      requiresConfirmation: true,
    };
  }

  async send(draft: EmailDraft, options: EmailSendOptions) {
    if (!options.confirmed) {
      return {
        sent: false,
        requiresConfirmation: true,
        message: 'Confirmation required before sending email.',
        draft,
      };
    }

    // TODO: plug in real email provider here.
    if (options.dryRun) {
      return { sent: false, dryRun: true, payload: draft };
    }

    // Placeholder success response
    return { sent: true, id: `email_${Date.now()}`, draft };
  }
}

export const emailService = new EmailService();
