import { NextRequest, NextResponse } from "next/server";
import { createServerClient as createClient } from "@automation/auth";

const FCM_LEGACY_ENDPOINT = "https://fcm.googleapis.com/fcm/send";

export async function POST(request: NextRequest) {
  try {
    const serverKey = process.env.FIREBASE_CLOUD_MESSAGING_SERVER_KEY?.trim();
    if (!serverKey) {
      return NextResponse.json(
        {
          error:
            "Missing FIREBASE_CLOUD_MESSAGING_SERVER_KEY. Add it in apps/web/apps/web/.env.local for server-side test sends.",
        },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    const title =
      typeof body?.title === "string" && body.title.trim()
        ? body.title.trim()
        : "FCM test notification";
    const message =
      typeof body?.body === "string" && body.body.trim()
        ? body.body.trim()
        : "Your push setup is working.";
    const url =
      typeof body?.url === "string" && body.url.trim() ? body.url.trim() : "/push";

    if (!token) {
      return NextResponse.json({ error: "Missing target token." }, { status: 400 });
    }

    const pushResponse = await fetch(FCM_LEGACY_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `key=${serverKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title,
          body: message,
        },
        data: {
          url,
        },
      }),
    });

    const responseBody = await pushResponse.json().catch(() => ({}));
    if (!pushResponse.ok) {
      return NextResponse.json(
        {
          error: "FCM send failed.",
          details: responseBody,
        },
        { status: pushResponse.status }
      );
    }

    return NextResponse.json({
      ok: true,
      providerResponse: responseBody,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send test push.",
      },
      { status: 500 }
    );
  }
}
