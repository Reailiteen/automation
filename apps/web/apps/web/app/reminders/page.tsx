"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Layout from "@/components/layout/layout";

type InAppReminder = {
  id: string;
  title: string;
  message: string;
  status: "unread" | "read" | "archived";
  deepLink?: string;
  createdAt: string;
  readAt?: string;
};

export default function RemindersPage() {
  const [items, setItems] = useState<InAppReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const loadReminders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/in-app-reminders");
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || "Failed to load reminders.");
      }
      const payload = await response.json();
      setItems(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reminders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReminders();
  }, [loadReminders]);

  const unreadCount = useMemo(
    () => items.filter((item) => item.status === "unread").length,
    [items]
  );

  const markRead = async (id: string) => {
    try {
      const response = await fetch(`/api/in-app-reminders/${id}/read`, {
        method: "POST",
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || "Failed to mark reminder as read.");
      }
      const updated = await response.json();
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark reminder as read.");
    }
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      const response = await fetch("/api/in-app-reminders/read-all", {
        method: "POST",
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || "Failed to mark all as read.");
      }
      await loadReminders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark all as read.");
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white">Reminder Center</h1>
            <p className="text-gray-400">Unread reminders: {unreadCount}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => void loadReminders()}
              className="px-4 py-2 rounded-md border border-gray-700 text-gray-200 hover:bg-gray-800"
            >
              Refresh
            </button>
            <button
              onClick={() => void markAllRead()}
              disabled={markingAll || unreadCount === 0}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
            >
              {markingAll ? "Marking..." : "Mark All Read"}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-700 bg-red-950/40 p-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-md border border-gray-800 bg-gray-900/40 p-6 text-gray-300">
            Loading reminders...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-md border border-gray-800 bg-gray-900/40 p-6 text-gray-300">
            No reminders yet.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`rounded-md border p-4 ${
                  item.status === "unread"
                    ? "border-blue-500/40 bg-blue-950/20"
                    : "border-gray-800 bg-gray-900/40"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                    <p className="text-gray-300">{item.message}</p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(item.createdAt).toLocaleString()}
                    </p>
                    {item.status === "read" && item.readAt && (
                      <p className="text-xs text-gray-500">
                        Read: {new Date(item.readAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {item.deepLink ? (
                      <Link
                        href={item.deepLink}
                        className="px-3 py-2 rounded-md border border-gray-700 text-gray-200 hover:bg-gray-800 text-sm"
                      >
                        Open
                      </Link>
                    ) : null}
                    {item.status === "unread" ? (
                      <button
                        onClick={() => void markRead(item.id)}
                        className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                      >
                        Mark Read
                      </button>
                    ) : (
                      <span className="px-3 py-2 rounded-md bg-gray-800 text-gray-300 text-sm">
                        Read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
