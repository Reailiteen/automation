import { MessagePayload, getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import { getFirebaseApp } from "@/lib/firebase/client";

export type WebPushTokenResult =
  | { ok: true; token: string }
  | { ok: false; reason: string };

let foregroundHandlerAttached = false;

async function getServiceWorkerRegistration() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  return navigator.serviceWorker.register("/firebase-messaging-sw.js");
}

export async function requestWebPushToken(): Promise<WebPushTokenResult> {
  if (typeof window === "undefined") {
    return { ok: false, reason: "browser-only" };
  }

  const supported = await isSupported().catch(() => false);
  if (!supported) {
    return { ok: false, reason: "messaging-not-supported" };
  }

  if (Notification.permission === "denied") {
    return { ok: false, reason: "notifications-denied" };
  }

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    return { ok: false, reason: "missing-vapid-key" };
  }

  const permission =
    Notification.permission === "granted"
      ? "granted"
      : await Notification.requestPermission();
  if (permission !== "granted") {
    return { ok: false, reason: "notifications-not-granted" };
  }

  const registration = await getServiceWorkerRegistration();
  if (!registration) {
    return { ok: false, reason: "service-worker-unavailable" };
  }

  const messaging = getMessaging(getFirebaseApp());
  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: registration,
  });

  if (!token) {
    return { ok: false, reason: "empty-token" };
  }

  return { ok: true, token };
}

export async function attachForegroundMessageHandler(
  onPayload?: (payload: MessagePayload) => void
) {
  if (foregroundHandlerAttached) {
    return;
  }

  const supported = await isSupported().catch(() => false);
  if (!supported) {
    return;
  }

  foregroundHandlerAttached = true;
  const messaging = getMessaging(getFirebaseApp());

  onMessage(messaging, (payload) => {
    onPayload?.(payload);
  });
}
