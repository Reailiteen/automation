import { NextResponse } from "next/server";

/**
 * GET /api/auth/debug
 * Hit this once to verify Supabase env vars load.
 * Check your terminal for the logged URL (server-side only).
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const keySet = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Log only presence, never values (avoids secrets scanner / log exposure)
  console.log("[auth/debug] NEXT_PUBLIC_SUPABASE_URL:", url?.trim() ? "set" : "missing");

  const raw = (url ?? "").trim();
  const hasHttps = raw.startsWith("https://");
  const hasSupabase = raw.includes(".supabase.co");
  const noTrailingSlash = !raw.endsWith("/");
  const formatOk = hasHttps && hasSupabase && noTrailingSlash && raw.length > 20;

  let message: string;
  if (!url || !url.trim()) {
    message =
      "NEXT_PUBLIC_SUPABASE_URL is missing. Check .env.local, then rm -rf .next && npm run dev.";
  } else if (!formatOk) {
    const issues: string[] = [];
    if (!hasHttps) issues.push("must start with https://");
    if (!hasSupabase) issues.push("must contain .supabase.co");
    if (!noTrailingSlash) issues.push("no trailing slash");
    message = `URL format issue: ${issues.join("; ")}. Copy Project URL from Dashboard → Settings → API.`;
  } else if (!keySet) {
    message = "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Add it to .env.local.";
  } else {
    message =
      "Env looks good. If you still get ENOTFOUND, project may be paused—restore at supabase.com/dashboard.";
  }

  return NextResponse.json({
    urlSet: !!url?.trim(),
    keySet,
    formatOk,
    message,
  });
}
