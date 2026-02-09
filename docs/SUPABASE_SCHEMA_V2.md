# Supabase Schema V2 (Scalable, Precise, Feature-Complete)

## 1. Why this redesign

Your current app code uses core entities (`tasks`, `plans`, `schedules`, `reminders`) but the effective storage model is still partially flat and permissive. That creates issues in production:

- weak data ownership guarantees (projects and other records can leak cross-user)
- arrays used where relations should exist (dependencies, tags, plan-task links)
- limited delivery/audit traceability for reminders
- no first-class workspace/team model
- no robust schema support for AI execution logs, integrations, chat memory, or automations

This V2 schema introduces normalized relational tables, tenant isolation, strict constraints, and RLS policies for scale.

## 2. What was added

### Core tenancy and identity

- `app.profiles`
- `app.workspaces`
- `app.workspace_members`
- `app.user_preferences`

### Planning and execution domain

- `app.projects`
- `app.tasks`
- `app.task_dependencies`
- `app.labels`
- `app.task_labels`
- `app.plans`
- `app.plan_tasks`
- `app.schedule_days`
- `app.schedule_entries`

### Reminders and notifications

- `app.reminders`
- `app.reminder_channels`
- `app.reminder_push_tokens`
- `app.reminder_attempts`
- `app.notification_devices`

### AI and product intelligence

- `app.agent_runs`
- `app.chat_threads`
- `app.chat_messages`
- `app.knowledge_entries`
- optional `app.knowledge_embeddings` (`pgvector` enabled)

### Integrations and automation

- `app.integration_connections`
- `app.integration_sync_runs`
- `app.external_links`
- `app.automation_rules`
- `app.automation_runs`

## 3. Security model

RLS is enabled on all app tables.

Main policy pattern:

- user can read/write rows only if they are an active member of the row’s workspace
- owner/admin semantics enforced for workspace and membership administration
- profile/preferences and notification device rows are restricted to `auth.uid()`

Helper functions:

- `app.is_workspace_member(workspace_id)`
- `app.is_workspace_admin(workspace_id)`

## 4. Data quality and scalability improvements

- enum-backed statuses and roles (prevents invalid values)
- check constraints for schedule ranges, recurrence rules, hour limits, etc.
- normalized many-to-many relations for tags, dependencies, and plan-task membership
- extensive indexes for common query paths:
  - due reminders
  - per-user/per-workspace task filtering
  - schedule lookup by date
  - high-volume agent and sync logs
- `updated_at` trigger standardization across mutable tables
- optional vector index for semantic memory retrieval at scale

## 5. Compatibility layer

To support incremental migration, read views were added:

- `public.legacy_projects_v2`
- `public.legacy_tasks_v2`
- `public.legacy_plans_v2`
- `public.legacy_schedules_v2`
- `public.legacy_reminders_v2`

These expose legacy-shaped columns while sourcing from normalized V2 tables.

## 6. Migration files

- `supabase/migrations/20260209143000_app_schema_v2.sql`
- `supabase/migrations/20260209143100_legacy_compat_views.sql`

## 7. Rollout plan (safe)

1. Apply V2 migrations in a staging Supabase project.
2. Backfill existing data into `app.*` tables.
3. Point read paths to `legacy_*_v2` views first.
4. Update write paths to V2 tables (recommended via repository-level refactor).
5. Validate RLS behavior with authenticated user tests.
6. Cut over production after query/perf checks.

## 8. Required app updates to fully leverage V2

Your repository layer currently assumes:

- denormalized arrays (`subtasks`, `dependencies`, `tags`, `tasks`, `channels`, `attempts`)
- direct writes into flat top-level tables
- mixed auth assumptions in some agent routes

To fully adopt V2, update the data layer to:

- write to normalized relation tables (`task_dependencies`, `task_labels`, `plan_tasks`, `reminder_channels`, etc.)
- always provide `workspace_id`
- pass authenticated user id consistently (avoid nullable ownership)
- map `in-progress` ↔ `in_progress` and `inApp` ↔ `in_app` consistently in one adapter

## 9. Notes on non-trivial future features now supported

- multi-user collaboration (workspace membership roles)
- robust reminder dispatch observability (attempt logs + per-channel outcomes)
- integration-safe external mapping (`external_links`)
- automation pipelines with run history
- AI traceability (`agent_runs`, `chat_messages`) and vector memory support

