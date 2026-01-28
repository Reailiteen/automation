# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Task Manager / Voice-First Planning Assistant - transforms casual voice input into structured, actionable items (tasks, reminders, habits) using AI agents. Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, Supabase (auth + PostgreSQL), and Google Generative AI (Gemini).

## Development Commands

```bash
npm run dev    # Development server at localhost:3000
npm run build  # Production build
npm run lint   # Run ESLint
```

## Architecture

### Multi-Agent System
Located in `src/lib/agents/`:
- **PlannerAgent**: Creates structured tasks from voice input
- **SchedulerAgent**: Creates daily/weekly schedules respecting energy levels
- **PrioritizationAgent**: Ranks tasks by importance/urgency
- **ExecutionAgent**: Provides guidance during task execution
- **ReflectionAgent**: Analyzes completion patterns
- **RouterAgent**: Routes requests to appropriate agents

All agents implement `BaseAgent<TInput, TOutput>` interface with a `process()` method.

### Key Directories
- `src/app/api/agents/` - Agent API endpoints (planner, scheduler, prioritization, etc.)
- `src/app/api/tasks/` - Task CRUD operations
- `src/lib/models/task.ts` - Core TypeScript interfaces (Task, Project, Plan, User, Schedule, EnergyProfile)
- `src/lib/services/` - External service integrations (gemini.ts, groq.ts, memory-service.ts)
- `src/lib/supabase/` - Supabase clients (client.ts for browser, server.ts for server)
- `src/components/ui/` - Reusable UI components (voice-input, energy-gauge, schedule-time-block)
- `data/` - Local JSON storage for development (tasks.json, plans.json, projects.json)

### Storage Strategy
- **Local Development**: JSON files in `/data` directory
- **Production**: Supabase PostgreSQL with row-level security
- **Serverless Detection**: Auto-uses `/tmp` for Netlify/Vercel/AWS Lambda environments

### Authentication
Supabase Auth with SSR support via `@supabase/ssr`. AuthProvider context wraps the app in `src/app/layout.tsx`. Debug auth status at `/api/auth/debug`.

### AI Services
- **Primary**: Google Generative AI (Gemini 2.0/2.5 Flash)
- **Fallback**: Groq SDK
- Services configured in `src/lib/services/`

## Data Models

Core task properties (defined in `src/lib/models/task.ts`):
- `kind`: "reminder" | "todo" | "habit" | "daily"
- `priority`: 1-4 (1 = urgent/important)
- `focusLevel`: "deep" | "shallow"
- `energyRequirement`: "high" | "medium" | "low"
- `status`: "pending" | "in-progress" | "completed" | "cancelled"

## Environment Variables

Required (see `.env.example`):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
```

Optional: `OPENAI_API_KEY`, `GROQ_API_KEY`, `CLICKUP_API_KEY`

## Deployment

Deployed on Netlify. Configuration in `netlify.toml`.

## Design Documentation

Additional architecture details in:
- `Uno.md` - Deep technical architecture
- `Dos.md` - System architecture overview
- `Tres.md` - Frontend implementation plan
