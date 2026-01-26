"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(
        msg === "Failed to fetch"
          ? "Could not reach the server. Check your connection and restart the dev server."
          : msg
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 border-2 border-blue-500/30">
      <CardHeader className="text-center">
        <div className="inline-flex p-3 rounded-full bg-white/10 mb-4">
          <LogIn className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">
          Sign in
        </CardTitle>
        <CardDescription className="text-white/80">
          Welcome back to your voice-first planning assistant.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-500/20 border border-red-500/50 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-md border border-gray-600 bg-gray-900/50 px-3 py-2 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your password"
              className="w-full rounded-md border border-gray-600 bg-gray-900/50 px-3 py-2 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            loading={loading}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign in
          </Button>
        </form>
        <p className="text-center text-sm text-white/70">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">
            Create account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
