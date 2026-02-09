import { getEnv } from './env';

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

type ProviderResult = {
  ok: boolean;
  provider: 'sendgrid' | 'postmark' | 'none';
  id?: string;
  error?: string;
};

function normalizeRecipients(input: string[]): string[] {
  return Array.from(
    new Set(
      input
        .filter((value) => typeof value === 'string')
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

async function sendWithSendGrid(draft: EmailDraft): Promise<ProviderResult> {
  const apiKey = getEnv('SENDGRID_API_KEY')?.trim();
  const fromEmail = getEnv('EMAIL_FROM_ADDRESS')?.trim();
  if (!apiKey || !fromEmail) {
    return {
      ok: false,
      provider: 'sendgrid',
      error: 'Missing SENDGRID_API_KEY or EMAIL_FROM_ADDRESS.',
    };
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: draft.to.map((email) => ({ email })),
          cc: draft.cc?.map((email) => ({ email })),
          bcc: draft.bcc?.map((email) => ({ email })),
        },
      ],
      from: { email: fromEmail },
      subject: draft.subject,
      content: [
        { type: 'text/plain', value: draft.body },
        { type: 'text/html', value: `<p>${draft.body.replace(/\n/g, '<br/>')}</p>` },
      ],
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => '');
    return {
      ok: false,
      provider: 'sendgrid',
      error: `SendGrid error (${response.status}): ${details || 'request failed'}`,
    };
  }

  return {
    ok: true,
    provider: 'sendgrid',
    id: response.headers.get('x-message-id') ?? undefined,
  };
}

async function sendWithPostmark(draft: EmailDraft): Promise<ProviderResult> {
  const token = getEnv('POSTMARK_SERVER_TOKEN')?.trim();
  const fromEmail = getEnv('EMAIL_FROM_ADDRESS')?.trim();
  if (!token || !fromEmail) {
    return {
      ok: false,
      provider: 'postmark',
      error: 'Missing POSTMARK_SERVER_TOKEN or EMAIL_FROM_ADDRESS.',
    };
  }

  const response = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': token,
    },
    body: JSON.stringify({
      From: fromEmail,
      To: draft.to.join(','),
      Cc: draft.cc?.join(','),
      Bcc: draft.bcc?.join(','),
      Subject: draft.subject,
      TextBody: draft.body,
      HtmlBody: `<p>${draft.body.replace(/\n/g, '<br/>')}</p>`,
      MessageStream: getEnv('POSTMARK_MESSAGE_STREAM') || 'outbound',
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    Message?: string;
    MessageID?: string;
  };
  if (!response.ok) {
    return {
      ok: false,
      provider: 'postmark',
      error: `Postmark error (${response.status}): ${payload?.Message || 'request failed'}`,
    };
  }

  return {
    ok: true,
    provider: 'postmark',
    id: payload?.MessageID,
  };
}

async function sendViaConfiguredProvider(draft: EmailDraft): Promise<ProviderResult> {
  const preferredProvider = (getEnv('EMAIL_PROVIDER') || '').trim().toLowerCase();

  if (preferredProvider === 'sendgrid') {
    return sendWithSendGrid(draft);
  }
  if (preferredProvider === 'postmark') {
    return sendWithPostmark(draft);
  }

  const sendGridResult = await sendWithSendGrid(draft);
  if (sendGridResult.ok) return sendGridResult;

  const postmarkResult = await sendWithPostmark(draft);
  if (postmarkResult.ok) return postmarkResult;

  return {
    ok: false,
    provider: 'none',
    error: sendGridResult.error || postmarkResult.error || 'No email provider configured.',
  };
}

/**
 * Email service stub that enforces explicit preview/confirmation before send.
 * Integrate with provider (e.g., Resend, SES) where indicated.
 */
export class EmailService {
  async preview(draft: EmailDraft) {
    const normalizedDraft: EmailDraft = {
      ...draft,
      to: normalizeRecipients(draft.to),
      cc: draft.cc ? normalizeRecipients(draft.cc) : undefined,
      bcc: draft.bcc ? normalizeRecipients(draft.bcc) : undefined,
    };

    return {
      draft: normalizedDraft,
      summary: `Ready to send to ${normalizedDraft.to.join(', ')}`,
      requiresConfirmation: true,
    };
  }

  async send(draft: EmailDraft, options: EmailSendOptions) {
    if (!options.confirmed) {
      return {
        sent: false,
        requiresConfirmation: true,
        message: 'Confirmation required before sending email.',
        draft: {
          ...draft,
          to: normalizeRecipients(draft.to),
          cc: draft.cc ? normalizeRecipients(draft.cc) : undefined,
          bcc: draft.bcc ? normalizeRecipients(draft.bcc) : undefined,
        },
      };
    }

    // TODO: plug in real email provider here.
    if (options.dryRun) {
      return { sent: false, dryRun: true, payload: draft };
    }

    const normalizedDraft: EmailDraft = {
      ...draft,
      to: normalizeRecipients(draft.to),
      cc: draft.cc ? normalizeRecipients(draft.cc) : undefined,
      bcc: draft.bcc ? normalizeRecipients(draft.bcc) : undefined,
    };

    if (normalizedDraft.to.length === 0) {
      return {
        sent: false,
        error: 'No recipients provided.',
        draft: normalizedDraft,
      };
    }

    const providerResult = await sendViaConfiguredProvider(normalizedDraft);
    if (!providerResult.ok) {
      return {
        sent: false,
        error: providerResult.error,
        provider: providerResult.provider,
        draft: normalizedDraft,
      };
    }

    return {
      sent: true,
      id: providerResult.id || `email_${Date.now()}`,
      provider: providerResult.provider,
      draft: normalizedDraft,
    };
  }
}

export const emailService = new EmailService();
