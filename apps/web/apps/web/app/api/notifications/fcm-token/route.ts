import { NextRequest, NextResponse } from "next/server";
import { createServerClient as createClient } from "@automation/auth";

type StoredToken = {
  token: string;
  platform: "web" | "app";
  deviceId?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
};

const ALLOWED_PLATFORMS: StoredToken["platform"][] = ["web", "app"];

function parseStoredTokens(input: unknown): StoredToken[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((item): item is StoredToken => {
      return (
        !!item &&
        typeof item === "object" &&
        typeof (item as StoredToken).token === "string" &&
        ALLOWED_PLATFORMS.includes((item as StoredToken).platform) &&
        typeof (item as StoredToken).createdAt === "string" &&
        typeof (item as StoredToken).updatedAt === "string"
      );
    })
    .slice(0, 20);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    const platform =
      typeof body?.platform === "string" && ALLOWED_PLATFORMS.includes(body.platform)
        ? (body.platform as StoredToken["platform"])
        : "web";
    const deviceId =
      typeof body?.deviceId === "string" ? body.deviceId.trim() : undefined;
    const userAgent =
      typeof body?.userAgent === "string" ? body.userAgent.trim() : undefined;

    if (!token) {
      return NextResponse.json({ error: "Missing FCM token." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const now = new Date().toISOString();
    const metadata =
      user.user_metadata && typeof user.user_metadata === "object"
        ? user.user_metadata
        : {};
    const existingTokens = parseStoredTokens((metadata as Record<string, unknown>).fcmTokens);
    const existingEntry = existingTokens.find((item) => item.token === token);

    const nextTokenEntry: StoredToken = {
      token,
      platform,
      deviceId,
      userAgent,
      createdAt: existingEntry?.createdAt ?? now,
      updatedAt: now,
    };

    const dedupedTokens = [
      nextTokenEntry,
      ...existingTokens.filter((item) => item.token !== token),
    ].slice(0, 20);

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        ...metadata,
        fcmTokens: dedupedTokens,
        fcmTokensUpdatedAt: now,
      },
    });

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Failed to persist FCM token." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      tokenCount: dedupedTokens.length,
      platformBreakdown: dedupedTokens.reduce<Record<string, number>>((acc, item) => {
        acc[item.platform] = (acc[item.platform] || 0) + 1;
        return acc;
      }, {}),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to register FCM token.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token.trim() : "";

    if (!token) {
      return NextResponse.json({ error: "Missing FCM token." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const metadata =
      user.user_metadata && typeof user.user_metadata === "object"
        ? user.user_metadata
        : {};
    const existingTokens = parseStoredTokens((metadata as Record<string, unknown>).fcmTokens);
    const nextTokens = existingTokens.filter((item) => item.token !== token);

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        ...metadata,
        fcmTokens: nextTokens,
        fcmTokensUpdatedAt: new Date().toISOString(),
      },
    });

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Failed to remove FCM token." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, tokenCount: nextTokens.length });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to remove FCM token.",
      },
      { status: 500 }
    );
  }
}
