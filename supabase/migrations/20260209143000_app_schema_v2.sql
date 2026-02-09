begin;

-- ============================================================================
-- Automation Platform V2 Schema (core + advanced features)
-- - Multi-tenant workspaces
-- - Task/plan/project/schedule/reminder domain
-- - AI/agent execution logs and chat
-- - External integrations and sync bookkeeping
-- - Automation rules and semantic memory
-- ============================================================================

create extension if not exists pgcrypto;
create extension if not exists citext;
create extension if not exists btree_gist;

do $$
begin
  begin
    create extension if not exists vector;
  exception
    when others then
      raise notice 'vector extension unavailable: %', sqlerrm;
  end;
end;
$$;

create schema if not exists app;

-- --------------------------------------------------------------------------
-- Enum types
-- --------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'app' and t.typname = 'workspace_role'
  ) then
    create type app.workspace_role as enum ('owner', 'admin', 'member', 'viewer');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'app' and t.typname = 'task_kind'
  ) then
    create type app.task_kind as enum ('reminder', 'todo', 'habit', 'daily');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'app' and t.typname = 'task_status'
  ) then
    create type app.task_status as enum ('pending', 'in_progress', 'completed', 'cancelled');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'app' and t.typname = 'task_priority'
  ) then
    create type app.task_priority as enum ('low', 'medium', 'high', 'urgent');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'app' and t.typname = 'focus_level'
  ) then
    create type app.focus_level as enum ('shallow', 'medium', 'deep');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'app' and t.typname = 'energy_level'
  ) then
    create type app.energy_level as enum ('low', 'medium', 'high');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'app' and t.typname = 'plan_status'
  ) then
    create type app.plan_status as enum ('draft', 'active', 'completed', 'archived');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'app' and t.typname = 'schedule_entry_status'
  ) then
    create type app.schedule_entry_status as enum ('scheduled', 'in_progress', 'completed', 'skipped');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'app' and t.typname = 'reminder_status'
  ) then
    create type app.reminder_status as enum ('pending', 'sent', 'partial', 'cancelled', 'failed');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'app' and t.typname = 'reminder_channel'
  ) then
    create type app.reminder_channel as enum ('email', 'in_app', 'push');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'app' and t.typname = 'reminder_attempt_status'
  ) then
    create type app.reminder_attempt_status as enum ('sent', 'failed', 'skipped');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'app' and t.typname = 'agent_type'
  ) then
    create type app.agent_type as enum ('planner', 'prioritizer', 'scheduler', 'execution', 'reflection', 'router');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'app' and t.typname = 'chat_role'
  ) then
    create type app.chat_role as enum ('system', 'user', 'assistant', 'tool');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'app' and t.typname = 'device_platform'
  ) then
    create type app.device_platform as enum ('ios', 'android', 'web');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'app' and t.typname = 'integration_provider'
  ) then
    create type app.integration_provider as enum ('google_calendar', 'gmail', 'clickup', 'notion', 'slack', 'webhook');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'app' and t.typname = 'integration_status'
  ) then
    create type app.integration_status as enum ('active', 'paused', 'error', 'revoked');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'app' and t.typname = 'sync_state'
  ) then
    create type app.sync_state as enum ('ok', 'conflict', 'error');
  end if;
end;
$$;

-- --------------------------------------------------------------------------
-- Utility functions and triggers
-- --------------------------------------------------------------------------

create or replace function app.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function app.current_user_id()
returns uuid
language sql
stable
as $$
  select auth.uid();
$$;

-- --------------------------------------------------------------------------
-- Identity + tenancy
-- --------------------------------------------------------------------------

create table if not exists app.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email citext,
  timezone text not null default 'UTC',
  locale text not null default 'en-US',
  avatar_url text,
  default_workspace_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists app.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug citext,
  timezone text not null default 'UTC',
  is_personal boolean not null default false,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint workspaces_name_not_blank check (char_length(btrim(name)) > 0),
  constraint workspaces_slug_format check (
    slug is null or slug ~* '^[a-z0-9]+([_-][a-z0-9]+)*$'
  )
);

create unique index if not exists workspaces_slug_key on app.workspaces(slug) where slug is not null;
create index if not exists workspaces_owner_user_id_idx on app.workspaces(owner_user_id);

create table if not exists app.workspace_members (
  workspace_id uuid not null references app.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role app.workspace_role not null default 'member',
  is_active boolean not null default true,
  invited_by_user_id uuid references auth.users(id) on delete set null,
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create index if not exists workspace_members_user_id_idx on app.workspace_members(user_id);
create index if not exists workspace_members_workspace_role_idx on app.workspace_members(workspace_id, role);

do $$
begin
  if not exists (
    select 1
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'app'
      and t.relname = 'profiles'
      and c.conname = 'profiles_default_workspace_fk'
  ) then
    alter table app.profiles
      add constraint profiles_default_workspace_fk
      foreign key (default_workspace_id)
      references app.workspaces(id)
      on delete set null;
  end if;
end;
$$;

create table if not exists app.user_preferences (
  user_id uuid primary key references app.profiles(user_id) on delete cascade,
  working_hours jsonb not null default '[]'::jsonb,
  energy_profile jsonb not null default '{"peakHours":[],"mediumHours":[],"lowHours":[],"recoveryTime":15}'::jsonb,
  task_breaking_preference text not null default 'automatic',
  scheduling_style text not null default 'flexible',
  notification_settings jsonb not null default '{"taskReminders":true,"scheduleChanges":true,"dailySummary":false}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint user_preferences_task_breaking_ck check (task_breaking_preference in ('automatic', 'manual')),
  constraint user_preferences_scheduling_style_ck check (scheduling_style in ('flexible', 'structured'))
);

-- --------------------------------------------------------------------------
-- Core planning domain
-- --------------------------------------------------------------------------

create table if not exists app.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references app.workspaces(id) on delete cascade,
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  title text not null,
  description text,
  weekly_hours numeric(6,2) not null default 0,
  status text not null default 'active',
  color text,
  start_date date,
  target_date date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint projects_title_not_blank check (char_length(btrim(title)) > 0),
  constraint projects_weekly_hours_ck check (weekly_hours >= 0 and weekly_hours <= 168),
  constraint projects_status_ck check (status in ('active', 'paused', 'completed', 'archived')),
  constraint projects_date_order_ck check (target_date is null or start_date is null or target_date >= start_date)
);

create index if not exists projects_workspace_idx on app.projects(workspace_id);
create index if not exists projects_owner_idx on app.projects(owner_user_id);
create index if not exists projects_status_idx on app.projects(workspace_id, status);

create table if not exists app.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references app.workspaces(id) on delete cascade,
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  assignee_user_id uuid references auth.users(id) on delete set null,
  project_id uuid references app.projects(id) on delete set null,
  parent_task_id uuid references app.tasks(id) on delete set null,
  title text not null,
  description text,
  kind app.task_kind not null default 'todo',
  status app.task_status not null default 'pending',
  priority app.task_priority not null default 'medium',
  focus_level app.focus_level not null default 'medium',
  energy_requirement app.energy_level not null default 'medium',
  context text not null default 'anywhere',
  estimated_minutes integer not null default 30,
  actual_minutes integer,
  start_at timestamptz,
  due_at timestamptz,
  completed_at timestamptz,
  is_recurring boolean not null default false,
  recurrence_rule text,
  recurrence_timezone text,
  recurrence_per_week smallint,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint tasks_title_not_blank check (char_length(btrim(title)) > 0),
  constraint tasks_estimated_minutes_ck check (estimated_minutes >= 0 and estimated_minutes <= 10080),
  constraint tasks_actual_minutes_ck check (actual_minutes is null or (actual_minutes >= 0 and actual_minutes <= 10080)),
  constraint tasks_date_order_ck check (due_at is null or start_at is null or due_at >= start_at),
  constraint tasks_recurrence_ck check (
    (is_recurring = false and recurrence_rule is null and recurrence_per_week is null)
    or
    (is_recurring = true and (recurrence_rule is not null or recurrence_per_week is not null))
  ),
  constraint tasks_recurrence_per_week_ck check (recurrence_per_week is null or (recurrence_per_week >= 1 and recurrence_per_week <= 21))
);

create unique index if not exists tasks_workspace_id_id_key on app.tasks(workspace_id, id);
create index if not exists tasks_workspace_owner_status_idx on app.tasks(workspace_id, owner_user_id, status);
create index if not exists tasks_workspace_due_idx on app.tasks(workspace_id, due_at);
create index if not exists tasks_workspace_project_idx on app.tasks(workspace_id, project_id);
create index if not exists tasks_parent_idx on app.tasks(parent_task_id);
create index if not exists tasks_created_at_idx on app.tasks(workspace_id, created_at desc);

create table if not exists app.task_dependencies (
  workspace_id uuid not null,
  task_id uuid not null,
  depends_on_task_id uuid not null,
  created_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (task_id, depends_on_task_id),
  constraint task_dependencies_not_self check (task_id <> depends_on_task_id),
  constraint task_dependencies_task_fk foreign key (workspace_id, task_id)
    references app.tasks(workspace_id, id) on delete cascade,
  constraint task_dependencies_depends_fk foreign key (workspace_id, depends_on_task_id)
    references app.tasks(workspace_id, id) on delete cascade
);

create index if not exists task_dependencies_workspace_idx on app.task_dependencies(workspace_id);
create index if not exists task_dependencies_depends_on_idx on app.task_dependencies(depends_on_task_id);

create table if not exists app.labels (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references app.workspaces(id) on delete cascade,
  name citext not null,
  color text,
  created_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint labels_name_not_blank check (char_length(btrim(name::text)) > 0)
);

create unique index if not exists labels_workspace_name_key on app.labels(workspace_id, name);
create unique index if not exists labels_workspace_id_id_key on app.labels(workspace_id, id);

create table if not exists app.task_labels (
  workspace_id uuid not null,
  task_id uuid not null,
  label_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (task_id, label_id),
  constraint task_labels_task_fk foreign key (workspace_id, task_id)
    references app.tasks(workspace_id, id) on delete cascade,
  constraint task_labels_label_fk foreign key (workspace_id, label_id)
    references app.labels(workspace_id, id) on delete cascade
);

create index if not exists task_labels_workspace_idx on app.task_labels(workspace_id);
create index if not exists task_labels_label_idx on app.task_labels(label_id);

create table if not exists app.plans (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references app.workspaces(id) on delete cascade,
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  title text not null,
  description text not null default '',
  status app.plan_status not null default 'draft',
  goal text not null default '',
  constraints jsonb not null default '{}'::jsonb,
  start_date date,
  end_date date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint plans_title_not_blank check (char_length(btrim(title)) > 0),
  constraint plans_date_order_ck check (end_date is null or start_date is null or end_date >= start_date)
);

create unique index if not exists plans_workspace_id_id_key on app.plans(workspace_id, id);
create index if not exists plans_workspace_owner_status_idx on app.plans(workspace_id, owner_user_id, status);

create table if not exists app.plan_tasks (
  workspace_id uuid not null,
  plan_id uuid not null,
  task_id uuid not null,
  position integer not null default 0,
  is_required boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  primary key (plan_id, task_id),
  constraint plan_tasks_plan_fk foreign key (workspace_id, plan_id)
    references app.plans(workspace_id, id) on delete cascade,
  constraint plan_tasks_task_fk foreign key (workspace_id, task_id)
    references app.tasks(workspace_id, id) on delete cascade,
  constraint plan_tasks_position_ck check (position >= 0)
);

create unique index if not exists plan_tasks_plan_position_key on app.plan_tasks(plan_id, position);
create index if not exists plan_tasks_workspace_idx on app.plan_tasks(workspace_id);

create table if not exists app.schedule_days (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references app.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  schedule_date date not null,
  notes text not null default '',
  energy_profile jsonb not null default '{"peakHours":[],"mediumHours":[],"lowHours":[],"recoveryTime":15}'::jsonb,
  constraints jsonb not null default '{"maxTasks":0,"maxDeepWorkSessions":0}'::jsonb,
  validation jsonb,
  generated_by text not null default 'agent',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint schedule_days_generated_by_ck check (generated_by in ('manual', 'agent', 'imported')),
  constraint schedule_days_unique unique (workspace_id, user_id, schedule_date)
);

create unique index if not exists schedule_days_workspace_id_id_key on app.schedule_days(workspace_id, id);
create index if not exists schedule_days_lookup_idx on app.schedule_days(workspace_id, user_id, schedule_date);

create table if not exists app.schedule_entries (
  id uuid primary key default gen_random_uuid(),
  schedule_day_id uuid not null references app.schedule_days(id) on delete cascade,
  workspace_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid references app.tasks(id) on delete set null,
  title text not null,
  scheduled_start timestamptz not null,
  scheduled_end timestamptz not null,
  actual_start timestamptz,
  actual_end timestamptz,
  status app.schedule_entry_status not null default 'scheduled',
  location text,
  context text,
  source text not null default 'manual',
  metadata jsonb not null default '{}'::jsonb,
  time_range tstzrange generated always as (tstzrange(scheduled_start, scheduled_end, '[)')) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint schedule_entries_title_not_blank check (char_length(btrim(title)) > 0),
  constraint schedule_entries_scheduled_range_ck check (scheduled_end > scheduled_start),
  constraint schedule_entries_actual_range_ck check (actual_end is null or actual_start is null or actual_end >= actual_start),
  constraint schedule_entries_source_ck check (source in ('manual', 'agent', 'imported')),
  constraint schedule_entries_day_fk foreign key (workspace_id, schedule_day_id)
    references app.schedule_days(workspace_id, id) on delete cascade
);

create index if not exists schedule_entries_day_idx on app.schedule_entries(schedule_day_id);
create index if not exists schedule_entries_workspace_user_time_idx on app.schedule_entries(workspace_id, user_id, scheduled_start);
create index if not exists schedule_entries_time_range_gist_idx on app.schedule_entries using gist (time_range);
create index if not exists schedule_entries_task_idx on app.schedule_entries(task_id);

create table if not exists app.reminders (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references app.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid references app.tasks(id) on delete set null,
  title text not null,
  message text not null,
  due_at timestamptz not null,
  status app.reminder_status not null default 'pending',
  recipient_email citext,
  last_sent_at timestamptz,
  cancelled_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reminders_title_not_blank check (char_length(btrim(title)) > 0),
  constraint reminders_message_not_blank check (char_length(btrim(message)) > 0)
);

create unique index if not exists reminders_workspace_id_id_key on app.reminders(workspace_id, id);
create index if not exists reminders_due_lookup_idx on app.reminders(workspace_id, status, due_at);
create index if not exists reminders_user_idx on app.reminders(workspace_id, user_id);

create table if not exists app.reminder_channels (
  reminder_id uuid not null references app.reminders(id) on delete cascade,
  channel app.reminder_channel not null,
  enabled boolean not null default true,
  channel_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  primary key (reminder_id, channel)
);

create index if not exists reminder_channels_channel_idx on app.reminder_channels(channel);

create table if not exists app.reminder_push_tokens (
  reminder_id uuid not null references app.reminders(id) on delete cascade,
  token text not null,
  created_at timestamptz not null default now(),
  primary key (reminder_id, token)
);

create table if not exists app.reminder_attempts (
  id bigint generated by default as identity primary key,
  reminder_id uuid not null references app.reminders(id) on delete cascade,
  channel app.reminder_channel not null,
  attempt_status app.reminder_attempt_status not null,
  message text not null,
  provider text,
  provider_message_id text,
  provider_response jsonb,
  attempted_at timestamptz not null default now()
);

create index if not exists reminder_attempts_reminder_time_idx on app.reminder_attempts(reminder_id, attempted_at desc);

create table if not exists app.notification_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid references app.workspaces(id) on delete set null,
  platform app.device_platform not null,
  token text not null,
  device_identifier text,
  app_version text,
  is_active boolean not null default true,
  last_seen_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists notification_devices_user_token_key on app.notification_devices(user_id, token);
create index if not exists notification_devices_workspace_idx on app.notification_devices(workspace_id);

-- --------------------------------------------------------------------------
-- AI + chat + memory
-- --------------------------------------------------------------------------

create table if not exists app.agent_runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references app.workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  agent_type app.agent_type not null,
  model text,
  request_payload jsonb not null,
  response_payload jsonb,
  reasoning text[] not null default '{}'::text[],
  confidence numeric(4,3),
  prompt_tokens integer,
  completion_tokens integer,
  latency_ms integer,
  status text not null default 'success',
  error_message text,
  created_at timestamptz not null default now(),
  constraint agent_runs_confidence_ck check (confidence is null or (confidence >= 0 and confidence <= 1)),
  constraint agent_runs_status_ck check (status in ('success', 'failed', 'cancelled'))
);

create index if not exists agent_runs_workspace_agent_time_idx on app.agent_runs(workspace_id, agent_type, created_at desc);

create table if not exists app.chat_threads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references app.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  channel text not null default 'web',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint chat_threads_channel_ck check (channel in ('web', 'mobile', 'api'))
);

create unique index if not exists chat_threads_workspace_id_id_key on app.chat_threads(workspace_id, id);
create index if not exists chat_threads_workspace_user_idx on app.chat_threads(workspace_id, user_id, created_at desc);

create table if not exists app.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references app.chat_threads(id) on delete cascade,
  workspace_id uuid not null,
  user_id uuid references auth.users(id) on delete set null,
  role app.chat_role not null,
  content text not null,
  tool_name text,
  tool_payload jsonb,
  token_count integer,
  message_index integer,
  created_at timestamptz not null default now(),
  constraint chat_messages_content_not_blank check (char_length(btrim(content)) > 0),
  constraint chat_messages_thread_fk foreign key (workspace_id, thread_id)
    references app.chat_threads(workspace_id, id) on delete cascade
);

create unique index if not exists chat_messages_thread_message_index_key on app.chat_messages(thread_id, message_index) where message_index is not null;
create index if not exists chat_messages_thread_time_idx on app.chat_messages(thread_id, created_at);

create table if not exists app.knowledge_entries (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references app.workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  source_type text not null default 'note',
  source_ref text,
  title text,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint knowledge_entries_source_type_ck check (source_type in ('note', 'task', 'plan', 'chat', 'import', 'system'))
);

create index if not exists knowledge_entries_workspace_source_idx on app.knowledge_entries(workspace_id, source_type, created_at desc);

-- Optional vector table created only when extension exists.
do $$
begin
  if exists (select 1 from pg_extension where extname = 'vector') then
    execute $exec$
      create table if not exists app.knowledge_embeddings (
        entry_id uuid primary key references app.knowledge_entries(id) on delete cascade,
        model text not null,
        embedding vector(1536) not null,
        created_at timestamptz not null default now()
      )
    $exec$;

    execute $exec$
      create index if not exists knowledge_embeddings_vector_idx
      on app.knowledge_embeddings
      using ivfflat (embedding vector_cosine_ops)
      with (lists = 100)
    $exec$;
  end if;
end;
$$;

-- --------------------------------------------------------------------------
-- Integrations + sync + automations
-- --------------------------------------------------------------------------

create table if not exists app.integration_connections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references app.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider app.integration_provider not null,
  external_account_id text not null,
  display_name text,
  status app.integration_status not null default 'active',
  scopes text[] not null default '{}'::text[],
  access_token_ref text,
  refresh_token_ref text,
  token_expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, user_id, provider, external_account_id)
);

create index if not exists integration_connections_workspace_provider_idx
  on app.integration_connections(workspace_id, provider, status);

create table if not exists app.integration_sync_runs (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references app.integration_connections(id) on delete cascade,
  workspace_id uuid not null references app.workspaces(id) on delete cascade,
  direction text not null default 'bidirectional',
  status text not null default 'running',
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  items_read integer not null default 0,
  items_written integer not null default 0,
  items_failed integer not null default 0,
  details jsonb not null default '{}'::jsonb,
  error_message text,
  constraint integration_sync_runs_direction_ck check (direction in ('import', 'export', 'bidirectional')),
  constraint integration_sync_runs_status_ck check (status in ('running', 'success', 'partial', 'failed')),
  constraint integration_sync_runs_counts_ck check (items_read >= 0 and items_written >= 0 and items_failed >= 0)
);

create index if not exists integration_sync_runs_connection_time_idx
  on app.integration_sync_runs(connection_id, started_at desc);

create table if not exists app.external_links (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references app.workspaces(id) on delete cascade,
  provider app.integration_provider not null,
  external_id text not null,
  external_url text,
  entity_type text not null,
  entity_id uuid not null,
  sync_state app.sync_state not null default 'ok',
  last_synced_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint external_links_entity_type_ck check (
    entity_type in ('task', 'project', 'plan', 'schedule_entry', 'reminder', 'chat_thread')
  ),
  unique (workspace_id, provider, external_id)
);

create index if not exists external_links_entity_lookup_idx
  on app.external_links(workspace_id, entity_type, entity_id);

create table if not exists app.automation_rules (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references app.workspaces(id) on delete cascade,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  trigger_kind text not null,
  trigger_config jsonb not null default '{}'::jsonb,
  action_config jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  last_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint automation_rules_name_not_blank check (char_length(btrim(name)) > 0),
  constraint automation_rules_trigger_kind_ck check (trigger_kind in ('schedule', 'event', 'manual', 'webhook'))
);

create index if not exists automation_rules_workspace_active_idx
  on app.automation_rules(workspace_id, is_active);

create table if not exists app.automation_runs (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid not null references app.automation_rules(id) on delete cascade,
  workspace_id uuid not null references app.workspaces(id) on delete cascade,
  status text not null default 'running',
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  result jsonb,
  error_message text,
  constraint automation_runs_status_ck check (status in ('running', 'success', 'partial', 'failed', 'cancelled'))
);

create index if not exists automation_runs_rule_time_idx
  on app.automation_runs(rule_id, started_at desc);

-- --------------------------------------------------------------------------
-- Updated-at triggers
-- --------------------------------------------------------------------------

drop trigger if exists set_profiles_updated_at on app.profiles;
create trigger set_profiles_updated_at before update on app.profiles
for each row execute procedure app.set_updated_at();

drop trigger if exists set_workspaces_updated_at on app.workspaces;
create trigger set_workspaces_updated_at before update on app.workspaces
for each row execute procedure app.set_updated_at();

drop trigger if exists set_workspace_members_updated_at on app.workspace_members;
create trigger set_workspace_members_updated_at before update on app.workspace_members
for each row execute procedure app.set_updated_at();

drop trigger if exists set_user_preferences_updated_at on app.user_preferences;
create trigger set_user_preferences_updated_at before update on app.user_preferences
for each row execute procedure app.set_updated_at();

drop trigger if exists set_projects_updated_at on app.projects;
create trigger set_projects_updated_at before update on app.projects
for each row execute procedure app.set_updated_at();

drop trigger if exists set_tasks_updated_at on app.tasks;
create trigger set_tasks_updated_at before update on app.tasks
for each row execute procedure app.set_updated_at();

drop trigger if exists set_labels_updated_at on app.labels;
create trigger set_labels_updated_at before update on app.labels
for each row execute procedure app.set_updated_at();

drop trigger if exists set_plans_updated_at on app.plans;
create trigger set_plans_updated_at before update on app.plans
for each row execute procedure app.set_updated_at();

drop trigger if exists set_schedule_days_updated_at on app.schedule_days;
create trigger set_schedule_days_updated_at before update on app.schedule_days
for each row execute procedure app.set_updated_at();

drop trigger if exists set_schedule_entries_updated_at on app.schedule_entries;
create trigger set_schedule_entries_updated_at before update on app.schedule_entries
for each row execute procedure app.set_updated_at();

drop trigger if exists set_reminders_updated_at on app.reminders;
create trigger set_reminders_updated_at before update on app.reminders
for each row execute procedure app.set_updated_at();

drop trigger if exists set_notification_devices_updated_at on app.notification_devices;
create trigger set_notification_devices_updated_at before update on app.notification_devices
for each row execute procedure app.set_updated_at();

drop trigger if exists set_chat_threads_updated_at on app.chat_threads;
create trigger set_chat_threads_updated_at before update on app.chat_threads
for each row execute procedure app.set_updated_at();

drop trigger if exists set_knowledge_entries_updated_at on app.knowledge_entries;
create trigger set_knowledge_entries_updated_at before update on app.knowledge_entries
for each row execute procedure app.set_updated_at();

drop trigger if exists set_integration_connections_updated_at on app.integration_connections;
create trigger set_integration_connections_updated_at before update on app.integration_connections
for each row execute procedure app.set_updated_at();

drop trigger if exists set_external_links_updated_at on app.external_links;
create trigger set_external_links_updated_at before update on app.external_links
for each row execute procedure app.set_updated_at();

drop trigger if exists set_automation_rules_updated_at on app.automation_rules;
create trigger set_automation_rules_updated_at before update on app.automation_rules
for each row execute procedure app.set_updated_at();

-- --------------------------------------------------------------------------
-- Tenancy helper functions for RLS
-- --------------------------------------------------------------------------

create or replace function app.is_workspace_member(p_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = app, public
as $$
  select exists (
    select 1
    from app.workspace_members wm
    where wm.workspace_id = p_workspace_id
      and wm.user_id = auth.uid()
      and wm.is_active = true
  );
$$;

create or replace function app.is_workspace_admin(p_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = app, public
as $$
  select exists (
    select 1
    from app.workspace_members wm
    where wm.workspace_id = p_workspace_id
      and wm.user_id = auth.uid()
      and wm.is_active = true
      and wm.role in ('owner', 'admin')
  );
$$;

-- --------------------------------------------------------------------------
-- RLS policies
-- --------------------------------------------------------------------------

alter table app.profiles enable row level security;
alter table app.workspaces enable row level security;
alter table app.workspace_members enable row level security;
alter table app.user_preferences enable row level security;
alter table app.projects enable row level security;
alter table app.tasks enable row level security;
alter table app.task_dependencies enable row level security;
alter table app.labels enable row level security;
alter table app.task_labels enable row level security;
alter table app.plans enable row level security;
alter table app.plan_tasks enable row level security;
alter table app.schedule_days enable row level security;
alter table app.schedule_entries enable row level security;
alter table app.reminders enable row level security;
alter table app.reminder_channels enable row level security;
alter table app.reminder_push_tokens enable row level security;
alter table app.reminder_attempts enable row level security;
alter table app.notification_devices enable row level security;
alter table app.agent_runs enable row level security;
alter table app.chat_threads enable row level security;
alter table app.chat_messages enable row level security;
alter table app.knowledge_entries enable row level security;
alter table app.integration_connections enable row level security;
alter table app.integration_sync_runs enable row level security;
alter table app.external_links enable row level security;
alter table app.automation_rules enable row level security;
alter table app.automation_runs enable row level security;

-- Profiles and preferences: own rows only.
drop policy if exists profiles_select_own on app.profiles;
create policy profiles_select_own on app.profiles
for select using (user_id = auth.uid());

drop policy if exists profiles_insert_own on app.profiles;
create policy profiles_insert_own on app.profiles
for insert with check (user_id = auth.uid());

drop policy if exists profiles_update_own on app.profiles;
create policy profiles_update_own on app.profiles
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists user_preferences_rw_own on app.user_preferences;
create policy user_preferences_rw_own on app.user_preferences
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Workspaces and membership.
drop policy if exists workspaces_select_member on app.workspaces;
create policy workspaces_select_member on app.workspaces
for select using (app.is_workspace_member(id));

drop policy if exists workspaces_insert_owner on app.workspaces;
create policy workspaces_insert_owner on app.workspaces
for insert with check (owner_user_id = auth.uid());

drop policy if exists workspaces_update_admin on app.workspaces;
create policy workspaces_update_admin on app.workspaces
for update using (app.is_workspace_admin(id)) with check (app.is_workspace_admin(id));

drop policy if exists workspaces_delete_owner on app.workspaces;
create policy workspaces_delete_owner on app.workspaces
for delete using (owner_user_id = auth.uid());

drop policy if exists workspace_members_select_member on app.workspace_members;
create policy workspace_members_select_member on app.workspace_members
for select using (app.is_workspace_member(workspace_id));

drop policy if exists workspace_members_insert_admin on app.workspace_members;
create policy workspace_members_insert_admin on app.workspace_members
for insert with check (app.is_workspace_admin(workspace_id));

drop policy if exists workspace_members_update_admin on app.workspace_members;
create policy workspace_members_update_admin on app.workspace_members
for update using (app.is_workspace_admin(workspace_id)) with check (app.is_workspace_admin(workspace_id));

drop policy if exists workspace_members_delete_admin on app.workspace_members;
create policy workspace_members_delete_admin on app.workspace_members
for delete using (app.is_workspace_admin(workspace_id));

-- Generic workspace-scoped table policies.
drop policy if exists projects_rw_member on app.projects;
create policy projects_rw_member on app.projects
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

drop policy if exists tasks_rw_member on app.tasks;
create policy tasks_rw_member on app.tasks
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

drop policy if exists task_dependencies_rw_member on app.task_dependencies;
create policy task_dependencies_rw_member on app.task_dependencies
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

drop policy if exists labels_rw_member on app.labels;
create policy labels_rw_member on app.labels
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

drop policy if exists task_labels_rw_member on app.task_labels;
create policy task_labels_rw_member on app.task_labels
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

drop policy if exists plans_rw_member on app.plans;
create policy plans_rw_member on app.plans
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

drop policy if exists plan_tasks_rw_member on app.plan_tasks;
create policy plan_tasks_rw_member on app.plan_tasks
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

drop policy if exists schedule_days_rw_member on app.schedule_days;
create policy schedule_days_rw_member on app.schedule_days
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

drop policy if exists schedule_entries_rw_member on app.schedule_entries;
create policy schedule_entries_rw_member on app.schedule_entries
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

drop policy if exists reminders_rw_member on app.reminders;
create policy reminders_rw_member on app.reminders
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

drop policy if exists reminder_channels_select_member on app.reminder_channels;
create policy reminder_channels_select_member on app.reminder_channels
for select using (
  exists (
    select 1
    from app.reminders r
    where r.id = reminder_channels.reminder_id
      and app.is_workspace_member(r.workspace_id)
  )
);

drop policy if exists reminder_channels_mutate_member on app.reminder_channels;
create policy reminder_channels_mutate_member on app.reminder_channels
for all using (
  exists (
    select 1
    from app.reminders r
    where r.id = reminder_channels.reminder_id
      and app.is_workspace_member(r.workspace_id)
  )
)
with check (
  exists (
    select 1
    from app.reminders r
    where r.id = reminder_channels.reminder_id
      and app.is_workspace_member(r.workspace_id)
  )
);

drop policy if exists reminder_push_tokens_select_member on app.reminder_push_tokens;
create policy reminder_push_tokens_select_member on app.reminder_push_tokens
for select using (
  exists (
    select 1
    from app.reminders r
    where r.id = reminder_push_tokens.reminder_id
      and app.is_workspace_member(r.workspace_id)
  )
);

drop policy if exists reminder_push_tokens_mutate_member on app.reminder_push_tokens;
create policy reminder_push_tokens_mutate_member on app.reminder_push_tokens
for all using (
  exists (
    select 1
    from app.reminders r
    where r.id = reminder_push_tokens.reminder_id
      and app.is_workspace_member(r.workspace_id)
  )
)
with check (
  exists (
    select 1
    from app.reminders r
    where r.id = reminder_push_tokens.reminder_id
      and app.is_workspace_member(r.workspace_id)
  )
);

drop policy if exists reminder_attempts_rw_member on app.reminder_attempts;
create policy reminder_attempts_rw_member on app.reminder_attempts
for all using (
  exists (
    select 1
    from app.reminders r
    where r.id = reminder_attempts.reminder_id
      and app.is_workspace_member(r.workspace_id)
  )
)
with check (
  exists (
    select 1
    from app.reminders r
    where r.id = reminder_attempts.reminder_id
      and app.is_workspace_member(r.workspace_id)
  )
);

drop policy if exists notification_devices_rw_own on app.notification_devices;
create policy notification_devices_rw_own on app.notification_devices
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists agent_runs_rw_member on app.agent_runs;
create policy agent_runs_rw_member on app.agent_runs
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

drop policy if exists chat_threads_rw_member on app.chat_threads;
create policy chat_threads_rw_member on app.chat_threads
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

drop policy if exists chat_messages_rw_member on app.chat_messages;
create policy chat_messages_rw_member on app.chat_messages
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

drop policy if exists knowledge_entries_rw_member on app.knowledge_entries;
create policy knowledge_entries_rw_member on app.knowledge_entries
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

drop policy if exists integration_connections_rw_member on app.integration_connections;
create policy integration_connections_rw_member on app.integration_connections
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

drop policy if exists integration_sync_runs_rw_member on app.integration_sync_runs;
create policy integration_sync_runs_rw_member on app.integration_sync_runs
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

drop policy if exists external_links_rw_member on app.external_links;
create policy external_links_rw_member on app.external_links
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

drop policy if exists automation_rules_rw_member on app.automation_rules;
create policy automation_rules_rw_member on app.automation_rules
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

drop policy if exists automation_runs_rw_member on app.automation_runs;
create policy automation_runs_rw_member on app.automation_runs
for all using (app.is_workspace_member(workspace_id)) with check (app.is_workspace_member(workspace_id));

-- --------------------------------------------------------------------------
-- User provisioning trigger (profile + personal workspace bootstrap)
-- --------------------------------------------------------------------------

create or replace function app.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = app, public
as $$
declare
  v_workspace_id uuid;
  v_display_name text;
begin
  v_display_name := coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1));

  insert into app.profiles (user_id, display_name, email)
  values (new.id, v_display_name, new.email)
  on conflict (user_id) do nothing;

  insert into app.workspaces (owner_user_id, name, is_personal, timezone)
  values (new.id, coalesce(v_display_name, 'My Workspace'), true, coalesce(new.raw_user_meta_data ->> 'timezone', 'UTC'))
  returning id into v_workspace_id;

  insert into app.workspace_members (workspace_id, user_id, role, is_active)
  values (v_workspace_id, new.id, 'owner', true)
  on conflict (workspace_id, user_id) do nothing;

  update app.profiles
  set default_workspace_id = v_workspace_id
  where user_id = new.id;

  insert into app.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_app on auth.users;
create trigger on_auth_user_created_app
  after insert on auth.users
  for each row execute procedure app.handle_new_auth_user();

commit;
