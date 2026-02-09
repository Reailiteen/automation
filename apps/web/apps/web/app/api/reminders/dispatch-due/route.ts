import { NextRequest, NextResponse } from 'next/server';
import { createServerClient as createClient } from '@automation/auth';
import { reminderRepo } from '@automation/data';
import { emailService, notificationGuard } from '@automation/services';
import { Reminder, ReminderChannel, ReminderStatus } from '@automation/types';

const FCM_LEGACY_ENDPOINT = 'https://fcm.googleapis.com/fcm/send';
const INVALID_FCM_TOKEN_ERRORS = new Set(['InvalidRegistration', 'NotRegistered']);

type DispatchAttempt = Reminder['attempts'][number];

function createAttempt(
  channel: ReminderChannel,
  status: DispatchAttempt['status'],
  message: string
): DispatchAttempt {
  return {
    channel,
    status,
    message,
    timestamp: new Date(),
  };
}

async function sendPushToTokens(params: {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
}) {
  const serverKey = process.env.FIREBASE_CLOUD_MESSAGING_SERVER_KEY?.trim();
  if (!serverKey) {
    return {
      ok: false,
      message: 'Missing FIREBASE_CLOUD_MESSAGING_SERVER_KEY.',
      successCount: 0,
      failureCount: params.tokens.length,
      invalidTokens: [] as string[],
    };
  }

  const response = await fetch(FCM_LEGACY_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `key=${serverKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      registration_ids: params.tokens,
      notification: {
        title: params.title,
        body: params.body,
      },
      data: params.data ?? {},
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      ok: false,
      message: `FCM request failed with ${response.status}.`,
      successCount: 0,
      failureCount: params.tokens.length,
      invalidTokens: [] as string[],
      providerResponse: payload,
    };
  }

  const results = Array.isArray(payload?.results) ? payload.results : [];
  let successCount = 0;
  let failureCount = 0;
  const invalidTokens: string[] = [];

  results.forEach((result: any, index: number) => {
    if (result?.message_id) {
      successCount += 1;
      return;
    }
    failureCount += 1;
    const errorCode = typeof result?.error === 'string' ? result.error : '';
    if (INVALID_FCM_TOKEN_ERRORS.has(errorCode)) {
      invalidTokens.push(params.tokens[index]);
    }
  });

  return {
    ok: successCount > 0,
    message: `FCM send complete. success=${successCount}, failure=${failureCount}.`,
    successCount,
    failureCount,
    invalidTokens,
    providerResponse: payload,
  };
}

async function dispatchReminder(reminder: Reminder) {
  const sentChannels = new Set<ReminderChannel>(reminder.sentChannels);
  const failedChannels = new Set<ReminderChannel>(reminder.failedChannels);
  const attempts: DispatchAttempt[] = [...reminder.attempts];
  let pushTokens = [...reminder.pushTokens];

  for (const channel of reminder.channels) {
    if (channel === 'inApp') {
      sentChannels.add('inApp');
      failedChannels.delete('inApp');
      attempts.push(
        createAttempt(
          'inApp',
          'sent',
          'In-app reminder queued (reminder center delivery wiring is next phase).'
        )
      );
      continue;
    }

    if (channel === 'email') {
      if (!reminder.recipientEmail) {
        failedChannels.add('email');
        attempts.push(createAttempt('email', 'failed', 'recipientEmail is missing.'));
        continue;
      }

      const emailResult = await emailService.send(
        {
          to: [reminder.recipientEmail],
          subject: reminder.title,
          body: reminder.message,
        },
        { confirmed: true }
      );

      if ((emailResult as { sent?: boolean }).sent) {
        sentChannels.add('email');
        failedChannels.delete('email');
        attempts.push(createAttempt('email', 'sent', `Email sent to ${reminder.recipientEmail}.`));
      } else {
        failedChannels.add('email');
        attempts.push(createAttempt('email', 'failed', 'Email provider send failed.'));
      }
      continue;
    }

    if (channel === 'push') {
      if (pushTokens.length === 0) {
        failedChannels.add('push');
        attempts.push(createAttempt('push', 'failed', 'No push tokens available.'));
        continue;
      }

      const pushGuard = notificationGuard.validate(
        { title: reminder.title, body: reminder.message },
        { channel: 'task', lastSentAt: reminder.lastSentAt, minIntervalMinutes: 1 }
      );
      if (!pushGuard.ok) {
        failedChannels.add('push');
        attempts.push(createAttempt('push', 'failed', pushGuard.issues.join(' | ')));
        continue;
      }

      const pushResult = await sendPushToTokens({
        tokens: pushTokens,
        title: reminder.title,
        body: reminder.message,
        data: {
          reminderId: reminder.id,
          userId: reminder.userId,
          url:
            typeof reminder.metadata?.url === 'string'
              ? reminder.metadata.url
              : '/push',
        },
      });

      if (pushResult.ok) {
        sentChannels.add('push');
        failedChannels.delete('push');
        attempts.push(createAttempt('push', 'sent', pushResult.message));
      } else {
        failedChannels.add('push');
        attempts.push(createAttempt('push', 'failed', pushResult.message));
      }

      if (pushResult.invalidTokens.length > 0) {
        const invalidSet = new Set(pushResult.invalidTokens);
        pushTokens = pushTokens.filter((token) => !invalidSet.has(token));
        attempts.push(
          createAttempt(
            'push',
            'skipped',
            `Removed ${pushResult.invalidTokens.length} invalid FCM token(s).`
          )
        );
      }
    }
  }

  let status: ReminderStatus = 'failed';
  if (sentChannels.size === reminder.channels.length) {
    status = 'sent';
  } else if (sentChannels.size > 0) {
    status = 'partial';
  }

  const lastSentAt = sentChannels.size > 0 ? new Date() : reminder.lastSentAt;
  const updated = await reminderRepo.update(reminder.id, {
    status,
    lastSentAt,
    sentChannels: Array.from(sentChannels),
    failedChannels: Array.from(failedChannels),
    attempts,
    pushTokens,
  });

  return {
    reminderId: reminder.id,
    userId: reminder.userId,
    status: updated?.status ?? status,
    sentChannels: Array.from(sentChannels),
    failedChannels: Array.from(failedChannels),
    attemptsAdded: attempts.length - reminder.attempts.length,
  };
}

export async function POST(request: NextRequest) {
  try {
    const configuredSecret = process.env.REMINDER_DISPATCH_SECRET?.trim();
    const providedSecret = request.headers.get('x-reminder-dispatch-secret')?.trim();
    const authorizedSystemDispatch =
      !!configuredSecret && !!providedSecret && configuredSecret === providedSecret;

    let userId: string | undefined;

    if (!authorizedSystemDispatch) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json(
          { error: 'Unauthorized. Sign in or provide x-reminder-dispatch-secret.' },
          { status: 401 }
        );
      }
      userId = user.id;
    }

    const now = new Date();
    const dueReminders = await reminderRepo.getDue(now, { userId });

    const results = [];
    for (const reminder of dueReminders) {
      results.push(await dispatchReminder(reminder));
    }

    return NextResponse.json({
      ok: true,
      mode: authorizedSystemDispatch ? 'system' : 'user',
      dueCount: dueReminders.length,
      dispatchedCount: results.length,
      results,
      dispatchedAt: now.toISOString(),
    });
  } catch (error) {
    console.error('Error dispatching due reminders:', error);
    return NextResponse.json(
      {
        error: 'Failed to dispatch reminders.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
