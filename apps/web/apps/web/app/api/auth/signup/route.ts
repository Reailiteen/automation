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
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const origin = request.nextUrl.origin;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${origin}/` },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data?.user?.identities?.length === 0) {
      return NextResponse.json(
        { error: "An account with this email already exists. Try signing in." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      session: data.session ?? null,
      user: data.user ?? null,
      needsEmailConfirmation: !data.session && !!data.user,
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
        : "Failed to create account.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
