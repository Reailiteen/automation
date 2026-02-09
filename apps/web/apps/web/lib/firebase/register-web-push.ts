import { attachForegroundMessageHandler, requestWebPushToken } from "@/lib/firebase/messaging";

const LAST_REGISTERED_TOKEN_KEY = "automation:last-registered-fcm-token";

export type RegisterPushResult =
  | { ok: true; token: string; skipped: boolean }
  | { ok: false; reason: string };

async function saveTokenToServer(token: string) {
  const response = await fetch("/api/notifications/fcm-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      platform: "web",
      userAgent: navigator.userAgent,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      typeof body?.error === "string"
        ? body.error
        : "Failed to register push token";
    throw new Error(message);
  }
}

export async function registerWebPush({
  force = false,
  userId,
}: { force?: boolean; userId?: string } = {}): Promise<RegisterPushResult> {
  const tokenResult = await requestWebPushToken();
  if (!tokenResult.ok) {
    return tokenResult;
  }

  const { token } = tokenResult;
  const storageKey = userId
    ? `${LAST_REGISTERED_TOKEN_KEY}:${userId}`
    : LAST_REGISTERED_TOKEN_KEY;

  if (typeof window !== "undefined") {
    await attachForegroundMessageHandler((payload) => {
      console.info("Foreground push payload:", payload);
    });
  }

  const previousToken =
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem(storageKey);

  if (!force && previousToken === token) {
    return { ok: true, token, skipped: true };
  }

  await saveTokenToServer(token);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, token);
  }

  return { ok: true, token, skipped: false };
}
