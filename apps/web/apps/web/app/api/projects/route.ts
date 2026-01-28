import { NextRequest, NextResponse } from "next/server";
import { createServerClient as createClient } from "@automation/auth";
import { projectRepo } from "@automation/data";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await projectRepo.getAll();
    return NextResponse.json(projects);
  } catch (err) {
    console.error("Projects API error:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch projects",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, weeklyHours, taskIds } = body;

    if (!title || typeof weeklyHours !== "number" || weeklyHours < 0) {
      return NextResponse.json(
        { error: "title and weeklyHours (number >= 0) required" },
        { status: 400 }
      );
    }

    const project = await projectRepo.create({
      title,
      description: description ?? undefined,
      weeklyHours,
      taskIds: Array.isArray(taskIds) ? taskIds : [],
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error("Projects API error:", err);
    return NextResponse.json(
      {
        error: "Failed to create project",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
