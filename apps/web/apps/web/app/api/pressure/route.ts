import { NextRequest, NextResponse } from "next/server";
import { createServerClient as createClient } from "@automation/auth";
import { taskRepo, projectRepo } from "@automation/data";
import { computePressure } from "@automation/services";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [tasks, projects] = await Promise.all([
      taskRepo.getAll(),
      projectRepo.getAll(),
    ]);

    const pressure = computePressure(tasks, projects);
    return NextResponse.json(pressure);
  } catch (err) {
    console.error("Pressure API error:", err);
    return NextResponse.json(
      {
        error: "Failed to compute pressure",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
