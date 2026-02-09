begin;

-- ============================================================================
-- Legacy-compatible read views (V2 -> old shape)
--
-- These views are intentionally read-oriented and mirror the data contract used
-- by the current repository layer while data is stored in app.* tables.
-- ============================================================================

create or replace view public.legacy_projects_v2 as
select
  p.id,
  p.workspace_id,
  p.owner_user_id as user_id,
  p.title,
  p.description,
  p.weekly_hours,
  p.status,
  p.color,
  p.start_date,
  p.target_date,
  coalesce(
    (
      select array_agg(t.id::text order by t.created_at)
      from app.tasks t
      where t.project_id = p.id and t.deleted_at is null
    ),
    '{}'::text[]
  ) as task_ids,
  p.metadata,
  p.created_at,
  p.updated_at,
  p.archived_at
from app.projects p;
alter view public.legacy_projects_v2 set (security_invoker = true);

create or replace view public.legacy_tasks_v2 as
select
  t.id,
  t.workspace_id,
  t.owner_user_id as user_id,
  t.title,
  t.description,
  case
    when t.status = 'in_progress' then 'in-progress'
    else t.status::text
  end as status,
  t.priority::text as priority,
  t.estimated_minutes as estimated_time,
  t.actual_minutes as actual_time,
  t.focus_level::text as focus_level,
  t.due_at as due_date,
  t.start_at,
  t.completed_at,
  t.parent_task_id,
  coalesce(
    (
      select array_agg(child.id::text order by child.created_at)
      from app.tasks child
      where child.parent_task_id = t.id and child.deleted_at is null
    ),
    '{}'::text[]
  ) as subtasks,
  coalesce(
    (
      select array_agg(td.depends_on_task_id::text order by td.depends_on_task_id)
      from app.task_dependencies td
      where td.task_id = t.id
    ),
    '{}'::text[]
  ) as dependencies,
  coalesce(
    (
      select array_agg(l.name::text order by l.name::text)
      from app.task_labels tl
      join app.labels l on l.id = tl.label_id
      where tl.task_id = t.id
    ),
    '{}'::text[]
  ) as tags,
  t.energy_requirement::text as energy_requirement,
  t.context,
  t.is_recurring,
  t.recurrence_rule as recurrence_pattern,
  t.recurrence_per_week,
  t.kind::text as kind,
  t.project_id,
  t.metadata,
  t.created_at,
  t.updated_at,
  t.deleted_at
from app.tasks t
where t.deleted_at is null;
alter view public.legacy_tasks_v2 set (security_invoker = true);

create or replace view public.legacy_plans_v2 as
select
  p.id,
  p.workspace_id,
  p.owner_user_id as user_id,
  p.title,
  p.description,
  p.status::text as status,
  coalesce(
    (
      select array_agg(pt.task_id::text order by pt.position)
      from app.plan_tasks pt
      where pt.plan_id = p.id
    ),
    '{}'::text[]
  ) as tasks,
  p.goal,
  p.constraints,
  p.start_date,
  p.end_date,
  p.metadata,
  p.created_at,
  p.updated_at,
  p.archived_at
from app.plans p;
alter view public.legacy_plans_v2 set (security_invoker = true);

create or replace view public.legacy_schedules_v2 as
select
  sd.id,
  sd.workspace_id,
  sd.user_id,
  sd.schedule_date as date,
  coalesce(
    jsonb_agg(
      jsonb_build_object(
        'taskId', se.task_id,
        'title', se.title,
        'scheduledStart', se.scheduled_start,
        'scheduledEnd', se.scheduled_end,
        'actualStart', se.actual_start,
        'actualEnd', se.actual_end,
        'status', case
          when se.status = 'in_progress' then 'in-progress'
          else se.status::text
        end,
        'location', se.location,
        'context', se.context,
        'source', se.source
      )
      order by se.scheduled_start
    ) filter (where se.id is not null),
    '[]'::jsonb
  ) as tasks,
  sd.notes,
  sd.energy_profile,
  sd.constraints,
  sd.validation,
  sd.generated_by,
  sd.created_at,
  sd.updated_at
from app.schedule_days sd
left join app.schedule_entries se
  on se.schedule_day_id = sd.id
group by
  sd.id,
  sd.workspace_id,
  sd.user_id,
  sd.schedule_date,
  sd.notes,
  sd.energy_profile,
  sd.constraints,
  sd.validation,
  sd.generated_by,
  sd.created_at,
  sd.updated_at;
alter view public.legacy_schedules_v2 set (security_invoker = true);

create or replace view public.legacy_reminders_v2 as
select
  r.id,
  r.workspace_id,
  r.user_id,
  r.task_id,
  r.title,
  r.message,
  r.due_at,
  r.status::text as status,
  r.last_sent_at,
  r.recipient_email,
  coalesce(
    (
      select array_agg(
        case
          when rc.channel = 'in_app' then 'inApp'
          else rc.channel::text
        end
        order by rc.channel::text
      )
      from app.reminder_channels rc
      where rc.reminder_id = r.id and rc.enabled = true
    ),
    '{}'::text[]
  ) as channels,
  coalesce(
    (
      select array_agg(distinct case
        when ra.channel = 'in_app' then 'inApp'
        else ra.channel::text
      end)
      from app.reminder_attempts ra
      where ra.reminder_id = r.id and ra.attempt_status = 'sent'
    ),
    '{}'::text[]
  ) as sent_channels,
  coalesce(
    (
      select array_agg(distinct case
        when ra.channel = 'in_app' then 'inApp'
        else ra.channel::text
      end)
      from app.reminder_attempts ra
      where ra.reminder_id = r.id and ra.attempt_status = 'failed'
    ),
    '{}'::text[]
  ) as failed_channels,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'channel', case
            when ra.channel = 'in_app' then 'inApp'
            else ra.channel::text
          end,
          'status', ra.attempt_status::text,
          'message', ra.message,
          'timestamp', ra.attempted_at
        )
        order by ra.attempted_at
      )
      from app.reminder_attempts ra
      where ra.reminder_id = r.id
    ),
    '[]'::jsonb
  ) as attempts,
  coalesce(
    (
      select array_agg(rpt.token order by rpt.created_at)
      from app.reminder_push_tokens rpt
      where rpt.reminder_id = r.id
    ),
    '{}'::text[]
  ) as push_tokens,
  r.metadata,
  r.cancelled_at,
  r.created_at,
  r.updated_at
from app.reminders r;
alter view public.legacy_reminders_v2 set (security_invoker = true);

grant select on public.legacy_projects_v2 to authenticated;
grant select on public.legacy_tasks_v2 to authenticated;
grant select on public.legacy_plans_v2 to authenticated;
grant select on public.legacy_schedules_v2 to authenticated;
grant select on public.legacy_reminders_v2 to authenticated;

comment on view public.legacy_tasks_v2 is
  'Legacy-compatible task shape sourced from app.tasks and related normalized tables.';

comment on view public.legacy_plans_v2 is
  'Legacy-compatible plan shape sourced from app.plans and app.plan_tasks.';

comment on view public.legacy_schedules_v2 is
  'Legacy-compatible schedule shape sourced from app.schedule_days and app.schedule_entries.';

comment on view public.legacy_reminders_v2 is
  'Legacy-compatible reminder shape sourced from app.reminders and reminder delivery tables.';

commit;
