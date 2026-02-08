import { differenceInMinutes } from 'date-fns';

interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  priority?: 'normal' | 'high';
}

interface NotificationContext {
  lastSentAt?: Date;
  minIntervalMinutes?: number;
  channel?: 'task' | 'schedule' | 'summary' | 'system';
}

export class NotificationGuard {
  /**
   * Validate and annotate a push notification before sending.
   * Enforces “explicit, meaningful, non-spammy” rules from App_system.
   */
  validate(payload: NotificationPayload, ctx: NotificationContext = {}) {
    const issues: string[] = [];

    if (!payload.title || !payload.body) {
      issues.push('Notification must include title and body.');
    }

    // Semantic quality checks
    if (payload.body.length < 8) {
      issues.push('Notification body is too short to be meaningful.');
    }

    // Rate limiting
    const minInterval = ctx.minIntervalMinutes ?? 15;
    if (ctx.lastSentAt) {
      const minutesSinceLast = differenceInMinutes(new Date(), ctx.lastSentAt);
      if (minutesSinceLast < minInterval) {
        issues.push(`Last notification sent ${minutesSinceLast}m ago; wait at least ${minInterval}m to avoid spam.`);
      }
    }

    return {
      ok: issues.length === 0,
      issues,
      recommendation: 'Send only after user-visible confirmation for high-priority or back-to-back messages.',
    };
  }
}

export const notificationGuard = new NotificationGuard();
