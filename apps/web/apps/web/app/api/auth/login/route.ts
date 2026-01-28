import { NextRequest, NextResponse } from "next/server";
import { createServerClient as createClient } from "@automation/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      session: data.session,
      user: data.user,
    });
  } catch (err) {
    const cause = err instanceof Error ? err.cause : undefined;
    const isNetwork =
      (err instanceof Error && err.message === "fetch failed") ||
      (cause instanceof Error && "code" in cause && cause.code === "ENOTFOUND");

    const message = isNetwork
      ? "Could not reach Supabase. Your project may be paused—restore it at supabase.com/dashboard, or check NEXT_PUBLIC_SUPABASE_URL in .env.local."
      : err instanceof Error
        ? err.message
        : "Failed to sign in.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
