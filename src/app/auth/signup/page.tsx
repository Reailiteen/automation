"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, LogIn, Sparkles } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
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

      setSuccess(true);
      if (data.session) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(
        msg === "Failed to fetch"
          ? "Could not reach the server. Check your connection, restart the dev server, and ensure Supabase env vars are set."
          : msg
      );
    } finally {
      setLoading(false);
    }
  };

  if (success && !error) {
    return (
      <Card className="w-full max-w-md bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 border-2 border-blue-500/30">
        <CardHeader className="text-center">
          <div className="inline-flex p-3 rounded-full bg-white/10 mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Check your email
          </CardTitle>
          <CardDescription className="text-white/80">
            We sent a confirmation link to <strong className="text-white">{email}</strong>.
            Click it to verify your account, then sign in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/auth/login" className="block">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Go to Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 border-2 border-blue-500/30">
      <CardHeader className="text-center">
        <div className="inline-flex p-3 rounded-full bg-white/10 mb-4">
          <UserPlus className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">
          Create account
        </CardTitle>
        <CardDescription className="text-white/80">
          Sign up to use your voice-first planning assistant.
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
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full rounded-md border border-gray-600 bg-gray-900/50 px-3 py-2 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-white/90 mb-1">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Same as above"
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
            <UserPlus className="mr-2 h-5 w-5" />
            Create account
          </Button>
        </form>
        <p className="text-center text-sm text-white/70">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
