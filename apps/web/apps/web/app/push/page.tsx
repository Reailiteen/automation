"use client";

import { useState } from "react";
import Layout from "@/components/layout/layout";
import { useAuth } from "@/components/auth/auth-provider";
import { registerWebPush } from "@/lib/firebase/register-web-push";

type Status = {
  kind: "idle" | "ok" | "error";
  message: string;
};

export default function PushPage() {
  const { user, loading } = useAuth();
  const [token, setToken] = useState("");
  const [appTokenInput, setAppTokenInput] = useState("");
  const [appDeviceId, setAppDeviceId] = useState("");
  const [status, setStatus] = useState<Status>({
    kind: "idle",
    message: "Ready",
  });
  const [sending, setSending] = useState(false);
  const [savingAppToken, setSavingAppToken] = useState(false);

  const setupPush = async (force = false) => {
    if (!user) {
      setStatus({ kind: "error", message: "Please sign in first." });
      return;
    }

    setStatus({ kind: "idle", message: "Requesting permission and token..." });
    const result = await registerWebPush({ force, userId: user.id });

    if (!result.ok) {
      setStatus({
        kind: "error",
        message: `Push setup skipped: ${result.reason}`,
      });
      return;
    }

    setToken(result.token);
    setStatus({
      kind: "ok",
      message: result.skipped
        ? "Push already configured for this browser."
        : "Push token registered successfully.",
    });
  };

  const sendTestPush = async () => {
    if (!token) {
      setStatus({
        kind: "error",
        message: "No token available. Run setup first.",
      });
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/notifications/test-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          title: "Automation Push Test",
          body: "FCM web push is connected.",
          url: "/push",
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus({
          kind: "error",
          message: payload?.error || "Push test failed.",
        });
        return;
      }

      setStatus({
        kind: "ok",
        message: "Push test sent. Check browser notifications.",
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "Push test failed.",
      });
    } finally {
      setSending(false);
    }
  };

  const saveAppToken = async () => {
    if (!user) {
      setStatus({ kind: "error", message: "Please sign in first." });
      return;
    }
    const normalized = appTokenInput.trim();
    if (!normalized) {
      setStatus({ kind: "error", message: "Enter an app FCM token first." });
      return;
    }

    setSavingAppToken(true);
    try {
      const response = await fetch("/api/notifications/fcm-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: normalized,
          platform: "app",
          deviceId: appDeviceId.trim() || undefined,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus({
          kind: "error",
          message: payload?.error || "Failed to save app token.",
        });
        return;
      }

      setStatus({
        kind: "ok",
        message: "App FCM token saved for this user.",
      });
      setAppTokenInput("");
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "Failed to save app token.",
      });
    } finally {
      setSavingAppToken(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white">Push Notifications</h1>

        {loading ? (
          <p className="text-gray-400">Checking authentication...</p>
        ) : !user ? (
          <p className="text-red-400">Please sign in to configure push.</p>
        ) : (
          <>
            <p className="text-gray-300">
              Configure web push, persist token in your account metadata, and
              send a test notification.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => void setupPush(false)}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
              >
                Setup Push
              </button>
              <button
                onClick={() => void setupPush(true)}
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Refresh Token
              </button>
              <button
                onClick={() => void sendTestPush()}
                disabled={sending}
                className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Test Push"}
              </button>
            </div>

            <div className="rounded-md border border-gray-700 bg-gray-900/60 p-4 space-y-2">
              <p
                className={
                  status.kind === "error"
                    ? "text-red-400"
                    : status.kind === "ok"
                      ? "text-emerald-400"
                      : "text-gray-300"
                }
              >
                {status.message}
              </p>
              <p className="text-xs text-gray-400 break-all">
                Token: {token || "Not generated yet"}
              </p>
            </div>

            <div className="rounded-md border border-gray-700 bg-gray-900/60 p-4 space-y-3">
              <h2 className="text-lg font-semibold text-white">
                Register App Token (Mobile FCM)
              </h2>
              <p className="text-sm text-gray-400">
                Paste your mobile app FCM token here to enable push delivery to app devices.
              </p>
              <input
                value={appTokenInput}
                onChange={(event) => setAppTokenInput(event.target.value)}
                placeholder="App FCM token"
                className="w-full px-3 py-2 rounded-md bg-gray-950 border border-gray-700 text-gray-200 text-sm"
              />
              <input
                value={appDeviceId}
                onChange={(event) => setAppDeviceId(event.target.value)}
                placeholder="Optional device label (e.g. iphone-15-pro)"
                className="w-full px-3 py-2 rounded-md bg-gray-950 border border-gray-700 text-gray-200 text-sm"
              />
              <button
                onClick={() => void saveAppToken()}
                disabled={savingAppToken}
                className="px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-60"
              >
                {savingAppToken ? "Saving..." : "Save App Token"}
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
