module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/packages/agents/src/base-agent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/packages/data/src/storage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "agentOutputStorage",
    ()=>agentOutputStorage,
    "planStorage",
    ()=>planStorage,
    "projectStorage",
    ()=>projectStorage,
    "reminderStorage",
    ()=>reminderStorage,
    "scheduleStorage",
    ()=>scheduleStorage,
    "taskStorage",
    ()=>taskStorage,
    "userStorage",
    ()=>userStorage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
// Detect if we're in a serverless environment (Netlify Functions, AWS Lambda, etc.)
// In serverless, filesystem is read-only except for /tmp
function detectServerless() {
    const cwd = process.cwd();
    return !!(process.env.NETLIFY === 'true' || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL === '1' || process.env.LAMBDA_TASK_ROOT || cwd.includes('/var/task') || cwd === '/var/task' || cwd.startsWith('/tmp') || cwd.startsWith('/') && !cwd.includes('Desktop') && !cwd.includes('home') && !cwd.includes('Users'));
}
function getDataDir() {
    const isServerless = detectServerless();
    // Always use /tmp in serverless - it's the only writable location
    if (isServerless) {
        console.log('[STORAGE] Serverless environment detected, using /tmp for data storage');
        return __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join('/tmp', 'automation-data');
    }
    return __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'data');
}
const DATA_DIR = getDataDir();
const TASKS_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'tasks.json');
const PLANS_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'plans.json');
const PROJECTS_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'projects.json');
const USERS_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'users.json');
const SCHEDULES_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'schedules.json');
const AGENT_OUTPUTS_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'agent-outputs.json');
const REMINDERS_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'reminders.json');
// Initialize data directory and files
async function ensureDataDir() {
    const isServerless = detectServerless();
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(DATA_DIR, {
            recursive: true
        });
        // Create empty JSON files if they don't exist
        for (const file of [
            TASKS_FILE,
            PLANS_FILE,
            PROJECTS_FILE,
            USERS_FILE,
            SCHEDULES_FILE,
            AGENT_OUTPUTS_FILE,
            REMINDERS_FILE
        ]){
            try {
                await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(file);
            } catch  {
                await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(file, '[]');
            }
        }
    } catch (error) {
        // In serverless, if /tmp fails, log but don't throw - we'll handle gracefully
        if (isServerless && (error.code === 'EROFS' || error.message?.includes('read-only'))) {
            console.warn('Read-only filesystem detected in serverless environment.');
            console.warn('Data will not persist. Please migrate to Supabase for production storage.');
            // Return empty arrays for reads, and log writes (data won't persist)
            return;
        }
        console.error('Error ensuring data directory:', error);
        throw error;
    }
}
// Generic file operations
async function readFile(filePath) {
    await ensureDataDir();
    try {
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}
async function writeFile(filePath, data) {
    const isServerless = detectServerless();
    await ensureDataDir();
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        // Handle read-only filesystem in serverless
        if (error.code === 'EROFS' || error.message?.includes('read-only')) {
            const errorMsg = `[STORAGE] Cannot write to ${filePath}: Read-only filesystem. ` + `This is expected in serverless environments. Data will not persist between invocations. ` + `Please migrate to Supabase for persistent storage in production.`;
            console.warn(errorMsg);
            // Don't throw - allow the app to continue (data just won't persist)
            // In serverless, /tmp is writable but cleared between invocations
            return;
        }
        console.error('Error writing file:', error);
        throw error;
    }
}
const taskStorage = {
    getAll: ()=>readFile(TASKS_FILE),
    byId: async (id)=>{
        const tasks = await readFile(TASKS_FILE);
        return tasks.find((task)=>task.id === id);
    },
    byPlan: async (planId)=>{
        const plans = await readFile(PLANS_FILE);
        const plan = plans.find((p)=>p.id === planId);
        if (!plan) return [];
        const tasks = await readFile(TASKS_FILE);
        return tasks.filter((task)=>plan.tasks.includes(task.id));
    },
    save: async (task)=>{
        const tasks = await readFile(TASKS_FILE);
        const index = tasks.findIndex((t)=>t.id === task.id);
        if (index >= 0) {
            // Update existing task
            tasks[index] = task;
        } else {
            // Add new task
            tasks.push(task);
        }
        await writeFile(TASKS_FILE, tasks);
    },
    delete: async (id)=>{
        const tasks = await readFile(TASKS_FILE);
        const filtered = tasks.filter((task)=>task.id !== id);
        await writeFile(TASKS_FILE, filtered);
    }
};
const planStorage = {
    getAll: ()=>readFile(PLANS_FILE),
    byId: async (id)=>{
        const plans = await readFile(PLANS_FILE);
        return plans.find((plan)=>plan.id === id);
    },
    save: async (plan)=>{
        const plans = await readFile(PLANS_FILE);
        const index = plans.findIndex((p)=>p.id === plan.id);
        if (index >= 0) {
            plans[index] = plan;
        } else {
            plans.push(plan);
        }
        await writeFile(PLANS_FILE, plans);
    },
    delete: async (id)=>{
        const plans = await readFile(PLANS_FILE);
        const filtered = plans.filter((plan)=>plan.id !== id);
        await writeFile(PLANS_FILE, filtered);
    }
};
const projectStorage = {
    getAll: ()=>readFile(PROJECTS_FILE),
    byId: async (id)=>{
        const projects = await readFile(PROJECTS_FILE);
        return projects.find((p)=>p.id === id);
    },
    save: async (project)=>{
        const projects = await readFile(PROJECTS_FILE);
        const index = projects.findIndex((p)=>p.id === project.id);
        if (index >= 0) projects[index] = project;
        else projects.push(project);
        await writeFile(PROJECTS_FILE, projects);
    },
    delete: async (id)=>{
        const projects = await readFile(PROJECTS_FILE);
        await writeFile(PROJECTS_FILE, projects.filter((p)=>p.id !== id));
    }
};
const userStorage = {
    getAll: ()=>readFile(USERS_FILE),
    byId: async (id)=>{
        const users = await readFile(USERS_FILE);
        return users.find((user)=>user.id === id);
    },
    save: async (user)=>{
        const users = await readFile(USERS_FILE);
        const index = users.findIndex((u)=>u.id === user.id);
        if (index >= 0) {
            users[index] = user;
        } else {
            users.push(user);
        }
        await writeFile(USERS_FILE, users);
    }
};
const scheduleStorage = {
    getAll: ()=>readFile(SCHEDULES_FILE),
    byDate: async (date)=>{
        const schedules = await readFile(SCHEDULES_FILE);
        return schedules.find((schedule)=>new Date(schedule.date).toDateString() === date.toDateString());
    },
    save: async (schedule)=>{
        const schedules = await readFile(SCHEDULES_FILE);
        const index = schedules.findIndex((s)=>s.id === schedule.id);
        if (index >= 0) {
            schedules[index] = schedule;
        } else {
            schedules.push(schedule);
        }
        await writeFile(SCHEDULES_FILE, schedules);
    }
};
const agentOutputStorage = {
    getAll: ()=>readFile(AGENT_OUTPUTS_FILE),
    save: async (output)=>{
        const outputs = await readFile(AGENT_OUTPUTS_FILE);
        outputs.push(output);
        await writeFile(AGENT_OUTPUTS_FILE, outputs);
    }
};
const reminderStorage = {
    getAll: ()=>readFile(REMINDERS_FILE),
    byId: async (id)=>{
        const reminders = await readFile(REMINDERS_FILE);
        return reminders.find((reminder)=>reminder.id === id);
    },
    save: async (reminder)=>{
        const reminders = await readFile(REMINDERS_FILE);
        const index = reminders.findIndex((existing)=>existing.id === reminder.id);
        if (index >= 0) {
            reminders[index] = reminder;
        } else {
            reminders.push(reminder);
        }
        await writeFile(REMINDERS_FILE, reminders);
    },
    delete: async (id)=>{
        const reminders = await readFile(REMINDERS_FILE);
        const filtered = reminders.filter((reminder)=>reminder.id !== id);
        await writeFile(REMINDERS_FILE, filtered);
    }
};
}),
"[project]/packages/data/src/supabase-client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSupabase",
    ()=>getSupabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$93$2e$2$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+supabase-js@2.93.2/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
let supabase = null;
const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (supabaseUrl && supabaseKey) {
    supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$93$2e$2$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false
        }
    });
} else if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    // For environments that only provide the anon key (e.g., web)
    supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$93$2e$2$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(process.env.SUPABASE_URL.trim(), process.env.SUPABASE_ANON_KEY.trim());
}
function getSupabase() {
    return supabase;
}
}),
"[project]/packages/data/src/repositories.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "agentOutputRepo",
    ()=>agentOutputRepo,
    "planRepo",
    ()=>planRepo,
    "projectRepo",
    ()=>projectRepo,
    "reminderRepo",
    ()=>reminderRepo,
    "scheduleRepo",
    ()=>scheduleRepo,
    "taskRepo",
    ()=>taskRepo,
    "userRepo",
    ()=>userRepo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/data/src/storage.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/data/src/supabase-client.ts [app-route] (ecmascript)");
;
;
// Utility function to generate IDs
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
const supabaseClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabase"])();
const ensureArray = (value)=>{
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.length) {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) return parsed;
        } catch  {
            return value.split(',').map((it)=>it.trim()).filter(Boolean);
        }
    }
    return [];
};
const mapTaskRecord = (record)=>{
    const normalized = {
        ...record,
        estimatedTime: record.estimated_time ?? record.estimatedTime ?? 0,
        actualTime: record.actual_time ?? record.actualTime,
        focusLevel: record.focus_level ?? record.focusLevel ?? 'medium',
        dueDate: record.due_date ? new Date(record.due_date) : record.dueDate ? new Date(record.dueDate) : undefined,
        createdAt: record.created_at ? new Date(record.created_at) : record.createdAt ? new Date(record.createdAt) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : record.updatedAt ? new Date(record.updatedAt) : new Date(),
        parentTaskId: record.parent_task_id ?? record.parentTaskId,
        subtasks: ensureArray(record.subtasks ?? record.subtasks_json),
        dependencies: ensureArray(record.dependencies ?? record.dependencies_json),
        tags: ensureArray(record.tags ?? record.tags_json),
        energyRequirement: record.energy_requirement ?? record.energyRequirement ?? 'medium',
        context: record.context ?? record.location ?? 'anywhere',
        isRecurring: record.is_recurring ?? record.isRecurring,
        recurrencePattern: record.recurrence_pattern ?? record.recurrencePattern,
        kind: record.kind ?? 'todo',
        projectId: record.project_id ?? record.projectId,
        recurrencePerWeek: record.recurrence_per_week ?? record.recurrencePerWeek,
        userId: record.user_id ?? record.userId
    };
    return {
        id: normalized.id,
        title: normalized.title,
        description: normalized.description,
        status: normalized.status,
        priority: normalized.priority,
        estimatedTime: normalized.estimatedTime,
        actualTime: normalized.actualTime,
        focusLevel: normalized.focusLevel,
        dueDate: normalized.dueDate,
        createdAt: normalized.createdAt,
        updatedAt: normalized.updatedAt,
        parentTaskId: normalized.parentTaskId,
        subtasks: normalized.subtasks,
        dependencies: normalized.dependencies,
        tags: normalized.tags,
        energyRequirement: normalized.energyRequirement,
        context: normalized.context,
        isRecurring: normalized.isRecurring,
        recurrencePattern: normalized.recurrencePattern,
        kind: normalized.kind,
        projectId: normalized.projectId,
        recurrencePerWeek: normalized.recurrencePerWeek,
        userId: normalized.userId
    };
};
const buildTaskPayload = (task)=>({
        title: task.title,
        description: task.description ?? null,
        status: task.status,
        priority: task.priority,
        estimated_time: task.estimatedTime,
        actual_time: task.actualTime ?? null,
        focus_level: task.focusLevel,
        due_date: task.dueDate ? task.dueDate.toISOString() : null,
        parent_task_id: task.parentTaskId ?? null,
        subtasks: task.subtasks ?? [],
        dependencies: task.dependencies ?? [],
        tags: task.tags ?? [],
        energy_requirement: task.energyRequirement,
        context: task.context,
        is_recurring: task.isRecurring ?? false,
        recurrence_pattern: task.recurrencePattern ?? null,
        kind: task.kind ?? 'todo',
        project_id: task.projectId ?? null,
        recurrence_per_week: task.recurrencePerWeek ?? null,
        user_id: task.userId ?? null
    });
const buildTaskUpdatePayload = (updates)=>{
    const payload = {
        updated_at: new Date().toISOString()
    };
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.priority !== undefined) payload.priority = updates.priority;
    if (updates.estimatedTime !== undefined) payload.estimated_time = updates.estimatedTime;
    if (updates.actualTime !== undefined) payload.actual_time = updates.actualTime;
    if (updates.focusLevel !== undefined) payload.focus_level = updates.focusLevel;
    if (updates.dueDate !== undefined) payload.due_date = updates.dueDate ? updates.dueDate.toISOString() : null;
    if (updates.parentTaskId !== undefined) payload.parent_task_id = updates.parentTaskId;
    if (updates.subtasks !== undefined) payload.subtasks = updates.subtasks;
    if (updates.dependencies !== undefined) payload.dependencies = updates.dependencies;
    if (updates.tags !== undefined) payload.tags = updates.tags;
    if (updates.energyRequirement !== undefined) payload.energy_requirement = updates.energyRequirement;
    if (updates.context !== undefined) payload.context = updates.context;
    if (updates.isRecurring !== undefined) payload.is_recurring = updates.isRecurring;
    if (updates.recurrencePattern !== undefined) payload.recurrence_pattern = updates.recurrencePattern;
    if (updates.kind !== undefined) payload.kind = updates.kind;
    if (updates.projectId !== undefined) payload.project_id = updates.projectId;
    if (updates.recurrencePerWeek !== undefined) payload.recurrence_per_week = updates.recurrencePerWeek;
    if (updates.userId !== undefined) payload.user_id = updates.userId;
    return payload;
};
const parseJsonField = (value, fallback = null)=>{
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch  {
            return fallback;
        }
    }
    return value;
};
const normalizeScheduledTasks = (value)=>{
    const raw = Array.isArray(value) ? value : [];
    return raw.map((task)=>({
            taskId: task.taskId ?? task.task_id ?? '',
            scheduledStart: task.scheduledStart ? new Date(task.scheduledStart) : task.scheduled_start ? new Date(task.scheduled_start) : new Date(),
            scheduledEnd: task.scheduledEnd ? new Date(task.scheduledEnd) : task.scheduled_end ? new Date(task.scheduled_end) : new Date(),
            actualStart: task.actualStart ? new Date(task.actualStart) : task.actual_start ? new Date(task.actual_start) : undefined,
            actualEnd: task.actualEnd ? new Date(task.actualEnd) : task.actual_end ? new Date(task.actual_end) : undefined,
            status: task.status ?? 'scheduled',
            location: task.location ?? null,
            context: task.context ?? null
        }));
};
const serializeScheduledTasks = (tasks)=>tasks.map((task)=>({
            taskId: task.taskId,
            scheduledStart: task.scheduledStart.toISOString(),
            scheduledEnd: task.scheduledEnd.toISOString(),
            actualStart: task.actualStart ? task.actualStart.toISOString() : null,
            actualEnd: task.actualEnd ? task.actualEnd.toISOString() : null,
            status: task.status,
            location: task.location ?? null,
            context: task.context ?? null
        }));
const mapPlanRecord = (record)=>({
        id: record.id,
        title: record.title,
        description: record.description,
        status: record.status,
        tasks: ensureArray(record.tasks ?? record.task_ids),
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
        startDate: record.start_date ? new Date(record.start_date) : undefined,
        endDate: record.end_date ? new Date(record.end_date) : undefined,
        goal: record.goal ?? '',
        constraints: parseJsonField(record.constraints, {}),
        userId: record.user_id ?? undefined
    });
const buildPlanPayload = (plan)=>({
        title: plan.title,
        description: plan.description ?? null,
        status: plan.status,
        tasks: plan.tasks ?? [],
        start_date: plan.startDate ? plan.startDate.toISOString() : null,
        end_date: plan.endDate ? plan.endDate.toISOString() : null,
        goal: plan.goal,
        constraints: plan.constraints ?? {},
        user_id: plan.userId ?? null
    });
const buildPlanUpdatePayload = (updates)=>{
    const payload = {
        updated_at: new Date().toISOString()
    };
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.tasks !== undefined) payload.tasks = updates.tasks;
    if (updates.startDate !== undefined) payload.start_date = updates.startDate ? updates.startDate.toISOString() : null;
    if (updates.endDate !== undefined) payload.end_date = updates.endDate ? updates.endDate.toISOString() : null;
    if (updates.goal !== undefined) payload.goal = updates.goal;
    if (updates.constraints !== undefined) payload.constraints = updates.constraints;
    if (updates.userId !== undefined) payload.user_id = updates.userId;
    return payload;
};
const mapScheduleRecord = (record)=>({
        id: record.id,
        date: record.date ? new Date(record.date) : new Date(),
        tasks: normalizeScheduledTasks(parseJsonField(record.tasks, [])),
        notes: record.notes ?? '',
        energyProfile: parseJsonField(record.energy_profile, {
            peakHours: [],
            mediumHours: [],
            lowHours: [],
            recoveryTime: 0
        }),
        constraints: parseJsonField(record.constraints, {
            maxTasks: 0,
            maxDeepWorkSessions: 0
        }),
        validation: parseJsonField(record.validation, undefined),
        userId: record.user_id ?? undefined,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date()
    });
const buildSchedulePayload = (schedule)=>({
        date: schedule.date.toISOString(),
        tasks: serializeScheduledTasks(schedule.tasks ?? []),
        notes: schedule.notes ?? '',
        energy_profile: schedule.energyProfile ?? {},
        constraints: schedule.constraints ?? {},
        validation: schedule.validation ?? null,
        user_id: schedule.userId ?? null
    });
const normalizeReminderAttempts = (value)=>{
    const raw = Array.isArray(value) ? value : [];
    return raw.filter((attempt)=>attempt && typeof attempt === 'object').map((attempt)=>({
            channel: attempt.channel,
            status: attempt.status,
            message: attempt.message ?? '',
            timestamp: attempt.timestamp ? new Date(attempt.timestamp) : attempt.created_at ? new Date(attempt.created_at) : new Date()
        }));
};
const mapReminderRecord = (record)=>({
        id: record.id,
        userId: record.user_id ?? record.userId ?? '',
        title: record.title ?? '',
        message: record.message ?? '',
        dueAt: record.due_at ? new Date(record.due_at) : record.dueAt ? new Date(record.dueAt) : new Date(),
        channels: ensureArray(record.channels ?? record.channels_json),
        status: record.status ?? 'pending',
        lastSentAt: record.last_sent_at ? new Date(record.last_sent_at) : record.lastSentAt ? new Date(record.lastSentAt) : undefined,
        sentChannels: ensureArray(record.sent_channels ?? record.sentChannels),
        failedChannels: ensureArray(record.failed_channels ?? record.failedChannels),
        attempts: normalizeReminderAttempts(parseJsonField(record.attempts, [])),
        recipientEmail: record.recipient_email ?? record.recipientEmail ?? undefined,
        pushTokens: ensureArray(record.push_tokens ?? record.pushTokens),
        metadata: parseJsonField(record.metadata, {}),
        createdAt: record.created_at ? new Date(record.created_at) : record.createdAt ? new Date(record.createdAt) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : record.updatedAt ? new Date(record.updatedAt) : new Date()
    });
const buildReminderPayload = (reminder)=>({
        user_id: reminder.userId,
        title: reminder.title,
        message: reminder.message,
        due_at: reminder.dueAt.toISOString(),
        channels: reminder.channels ?? [],
        status: reminder.status,
        last_sent_at: reminder.lastSentAt ? reminder.lastSentAt.toISOString() : null,
        sent_channels: reminder.sentChannels ?? [],
        failed_channels: reminder.failedChannels ?? [],
        attempts: (reminder.attempts ?? []).map((attempt)=>({
                channel: attempt.channel,
                status: attempt.status,
                message: attempt.message,
                timestamp: attempt.timestamp.toISOString()
            })),
        recipient_email: reminder.recipientEmail ?? null,
        push_tokens: reminder.pushTokens ?? [],
        metadata: reminder.metadata ?? {}
    });
const buildReminderUpdatePayload = (updates)=>{
    const payload = {
        updated_at: new Date().toISOString()
    };
    if (updates.userId !== undefined) payload.user_id = updates.userId;
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.message !== undefined) payload.message = updates.message;
    if (updates.dueAt !== undefined) payload.due_at = updates.dueAt.toISOString();
    if (updates.channels !== undefined) payload.channels = updates.channels;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.lastSentAt !== undefined) {
        payload.last_sent_at = updates.lastSentAt ? updates.lastSentAt.toISOString() : null;
    }
    if (updates.sentChannels !== undefined) payload.sent_channels = updates.sentChannels;
    if (updates.failedChannels !== undefined) payload.failed_channels = updates.failedChannels;
    if (updates.attempts !== undefined) {
        payload.attempts = updates.attempts.map((attempt)=>({
                channel: attempt.channel,
                status: attempt.status,
                message: attempt.message,
                timestamp: attempt.timestamp.toISOString()
            }));
    }
    if (updates.recipientEmail !== undefined) payload.recipient_email = updates.recipientEmail;
    if (updates.pushTokens !== undefined) payload.push_tokens = updates.pushTokens;
    if (updates.metadata !== undefined) payload.metadata = updates.metadata;
    return payload;
};
const taskRepo = {
    getAll: async (options)=>{
        if (supabaseClient) {
            try {
                let query = supabaseClient.from('tasks').select('*');
                if (options?.userId) {
                    query = query.eq('user_id', options.userId);
                }
                const { data, error } = await query;
                if (error) {
                    console.warn('Supabase task fetch error:', error.message);
                } else if (data) {
                    return data.map(mapTaskRecord);
                }
            } catch (error) {
                console.warn('[taskRepo] Supabase getAll failed:', error);
            }
        }
        return await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["taskStorage"].getAll();
    },
    getById: async (id)=>{
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.from('tasks').select('*').eq('id', id).single();
                if (!error && data) {
                    return mapTaskRecord(data);
                }
            } catch (error) {
                console.warn('[taskRepo] Supabase getById failed:', error);
            }
        }
        const task = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["taskStorage"].byId(id);
        return task || null;
    },
    create: async (taskData)=>{
        if (supabaseClient) {
            try {
                const payload = {
                    ...buildTaskPayload(taskData),
                    id: generateId(),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                const { data, error } = await supabaseClient.from('tasks').insert(payload).select('*').single();
                if (!error && data) {
                    return mapTaskRecord(data);
                }
            } catch (error) {
                console.warn('[taskRepo] Supabase create failed:', error);
            }
        }
        const now = new Date();
        const task = {
            ...taskData,
            id: generateId(),
            createdAt: now,
            updatedAt: now
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["taskStorage"].save(task);
        return task;
    },
    update: async (id, updates)=>{
        if (supabaseClient) {
            try {
                const payload = buildTaskUpdatePayload(updates);
                const { data, error } = await supabaseClient.from('tasks').update(payload).eq('id', id).select('*').single();
                if (!error && data) {
                    return mapTaskRecord(data);
                }
            } catch (error) {
                console.warn('[taskRepo] Supabase update failed:', error);
            }
        }
        const task = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["taskStorage"].byId(id);
        if (!task) return null;
        const updatedTask = {
            ...task,
            ...updates,
            updatedAt: new Date()
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["taskStorage"].save(updatedTask);
        return updatedTask;
    },
    delete: async (id)=>{
        if (supabaseClient) {
            try {
                const { error } = await supabaseClient.from('tasks').delete().eq('id', id);
                if (!error) {
                    return true;
                }
            } catch (error) {
                console.warn('[taskRepo] Supabase delete failed:', error);
            }
        }
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["taskStorage"].delete(id);
            return true;
        } catch (error) {
            console.error('Error deleting task:', error);
            return false;
        }
    },
    getByPlan: async (planId)=>{
        return await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["taskStorage"].byPlan(planId);
    },
    // Find tasks that are due soon
    getByDueDate: async (startDate, endDate)=>{
        const tasks = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["taskStorage"].getAll();
        return tasks.filter((task)=>{
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            return dueDate >= startDate && dueDate <= endDate;
        });
    },
    // Find tasks with specific tags
    getByTags: async (tags)=>{
        const tasks = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["taskStorage"].getAll();
        return tasks.filter((task)=>tags.some((tag)=>task.tags.includes(tag)));
    },
    // Get tasks with specific status
    getByStatus: async (status)=>{
        const tasks = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["taskStorage"].getAll();
        return tasks.filter((task)=>task.status === status);
    },
    getByProject: async (projectId)=>{
        const tasks = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["taskStorage"].getAll();
        return tasks.filter((task)=>task.projectId === projectId);
    },
    getByKind: async (kind)=>{
        const tasks = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["taskStorage"].getAll();
        return tasks.filter((task)=>(task.kind ?? 'todo') === kind);
    }
};
const planRepo = {
    getAll: async (options)=>{
        if (supabaseClient) {
            try {
                let query = supabaseClient.from('plans').select('*');
                if (options?.userId) {
                    query = query.eq('user_id', options.userId);
                }
                const { data, error } = await query;
                if (error) {
                    console.warn('[planRepo] Supabase getAll error:', error.message);
                } else if (data) {
                    return data.map(mapPlanRecord);
                }
            } catch (error) {
                console.warn('[planRepo] Supabase getAll failed:', error);
            }
        }
        return await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["planStorage"].getAll();
    },
    getById: async (id)=>{
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.from('plans').select('*').eq('id', id).single();
                if (!error && data) {
                    return mapPlanRecord(data);
                }
            } catch (error) {
                console.warn('[planRepo] Supabase getById failed:', error);
            }
        }
        const plan = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["planStorage"].byId(id);
        return plan || null;
    },
    create: async (planData)=>{
        if (supabaseClient) {
            try {
                const payload = {
                    id: generateId(),
                    ...buildPlanPayload(planData),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                const { data, error } = await supabaseClient.from('plans').insert(payload).select('*').single();
                if (!error && data) {
                    return mapPlanRecord(data);
                }
            } catch (error) {
                console.warn('[planRepo] Supabase create failed:', error);
            }
        }
        const now = new Date();
        const plan = {
            ...planData,
            id: generateId(),
            createdAt: now,
            updatedAt: now
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["planStorage"].save(plan);
        return plan;
    },
    update: async (id, updates)=>{
        if (supabaseClient) {
            try {
                const payload = buildPlanUpdatePayload(updates);
                const { data, error } = await supabaseClient.from('plans').update(payload).eq('id', id).select('*').single();
                if (!error && data) {
                    return mapPlanRecord(data);
                }
            } catch (error) {
                console.warn('[planRepo] Supabase update failed:', error);
            }
        }
        const plan = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["planStorage"].byId(id);
        if (!plan) return null;
        const updatedPlan = {
            ...plan,
            ...updates,
            updatedAt: new Date()
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["planStorage"].save(updatedPlan);
        return updatedPlan;
    },
    delete: async (id)=>{
        if (supabaseClient) {
            try {
                const { error } = await supabaseClient.from('plans').delete().eq('id', id);
                if (!error) {
                    return true;
                }
            } catch (error) {
                console.warn('[planRepo] Supabase delete failed:', error);
            }
        }
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["planStorage"].delete(id);
            return true;
        } catch (error) {
            console.error('Error deleting plan:', error);
            return false;
        }
    },
    getByStatus: async (status, options)=>{
        const plans = await planRepo.getAll(options);
        return plans.filter((plan)=>plan.status === status);
    }
};
const projectRepo = {
    getAll: async ()=>await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["projectStorage"].getAll(),
    getById: async (id)=>{
        const p = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["projectStorage"].byId(id);
        return p ?? null;
    },
    create: async (data)=>{
        const now = new Date();
        const project = {
            ...data,
            id: generateId(),
            taskIds: data.taskIds || [],
            createdAt: now,
            updatedAt: now
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["projectStorage"].save(project);
        return project;
    },
    update: async (id, updates)=>{
        const project = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["projectStorage"].byId(id);
        if (!project) return null;
        const updated = {
            ...project,
            ...updates,
            updatedAt: new Date()
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["projectStorage"].save(updated);
        return updated;
    },
    delete: async (id)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["projectStorage"].delete(id);
            return true;
        } catch  {
            return false;
        }
    }
};
const userRepo = {
    getAll: async ()=>{
        return await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userStorage"].getAll();
    },
    getById: async (id)=>{
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userStorage"].byId(id);
        return user || null;
    },
    create: async (userData, id)=>{
        const now = new Date();
        const user = {
            ...userData,
            id: id || generateId(),
            createdAt: now,
            updatedAt: now
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userStorage"].save(user);
        return user;
    },
    update: async (id, updates)=>{
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userStorage"].byId(id);
        if (!user) return null;
        const updatedUser = {
            ...user,
            ...updates,
            updatedAt: new Date()
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userStorage"].save(updatedUser);
        return updatedUser;
    }
};
const scheduleRepo = {
    getAll: async (options)=>{
        if (supabaseClient) {
            try {
                let query = supabaseClient.from('schedules').select('*');
                if (options?.userId) {
                    query = query.eq('user_id', options.userId);
                }
                const { data, error } = await query;
                if (error) {
                    console.warn('[scheduleRepo] Supabase getAll error:', error.message);
                } else if (data) {
                    return data.map(mapScheduleRecord);
                }
            } catch (error) {
                console.warn('[scheduleRepo] Supabase getAll failed:', error);
            }
        }
        return await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scheduleStorage"].getAll();
    },
    getByDate: async (date, options)=>{
        if (supabaseClient) {
            try {
                let query = supabaseClient.from('schedules').select('*').eq('date', date.toISOString().split('T')[0]);
                if (options?.userId) {
                    query = query.eq('user_id', options.userId);
                }
                const { data, error } = await query;
                if (!error && data && data.length) {
                    return mapScheduleRecord(data[0]);
                }
            } catch (error) {
                console.warn('[scheduleRepo] Supabase getByDate failed:', error);
            }
        }
        const schedule = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scheduleStorage"].byDate(date);
        return schedule || null;
    },
    create: async (scheduleData)=>{
        if (supabaseClient) {
            try {
                const payload = {
                    id: generateId(),
                    ...buildSchedulePayload(scheduleData),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                const { data, error } = await supabaseClient.from('schedules').insert(payload).select('*').single();
                if (!error && data) {
                    return mapScheduleRecord(data);
                }
            } catch (error) {
                console.warn('[scheduleRepo] Supabase create failed:', error);
            }
        }
        const now = new Date();
        const schedule = {
            ...scheduleData,
            id: generateId(),
            createdAt: now,
            updatedAt: now
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scheduleStorage"].save(schedule);
        return schedule;
    },
    update: async (id, updates)=>{
        if (supabaseClient) {
            try {
                const payload = {
                    updated_at: new Date().toISOString()
                };
                if (updates.date !== undefined) payload.date = updates.date.toISOString();
                if (updates.tasks !== undefined) payload.tasks = updates.tasks;
                if (updates.notes !== undefined) payload.notes = updates.notes;
                if (updates.energyProfile !== undefined) payload.energy_profile = updates.energyProfile;
                if (updates.constraints !== undefined) payload.constraints = updates.constraints;
                if (updates.validation !== undefined) payload.validation = updates.validation;
                if (updates.userId !== undefined) payload.user_id = updates.userId;
                const { data, error } = await supabaseClient.from('schedules').update(payload).eq('id', id).select('*').single();
                if (!error && data) {
                    return mapScheduleRecord(data);
                }
            } catch (error) {
                console.warn('[scheduleRepo] Supabase update failed:', error);
            }
        }
        const schedules = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scheduleStorage"].getAll();
        const schedule = schedules.find((s)=>s.id === id);
        if (!schedule) return null;
        const updatedSchedule = {
            ...schedule,
            ...updates,
            updatedAt: new Date()
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scheduleStorage"].save(updatedSchedule);
        return updatedSchedule;
    },
    getByDateRange: async (startDate, endDate, options)=>{
        if (supabaseClient) {
            try {
                let query = supabaseClient.from('schedules').select('*').gte('date', startDate.toISOString().split('T')[0]).lte('date', endDate.toISOString().split('T')[0]);
                if (options?.userId) {
                    query = query.eq('user_id', options.userId);
                }
                const { data, error } = await query;
                if (!error && data) {
                    return data.map(mapScheduleRecord);
                }
            } catch (error) {
                console.warn('[scheduleRepo] Supabase getByDateRange failed:', error);
            }
        }
        const schedules = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scheduleStorage"].getAll();
        return schedules.filter((schedule)=>{
            const scheduleDate = new Date(schedule.date);
            return scheduleDate >= startDate && scheduleDate <= endDate;
        });
    }
};
const agentOutputRepo = {
    getAll: async ()=>{
        return await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentOutputStorage"].getAll();
    },
    create: async (outputData)=>{
        const output = {
            ...outputData,
            timestamp: new Date()
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentOutputStorage"].save(output);
        return output;
    },
    getByAgentType: async (agentType)=>{
        const outputs = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentOutputStorage"].getAll();
        return outputs.filter((output)=>output.agentType === agentType);
    }
};
const reminderRepo = {
    getAll: async (options)=>{
        if (supabaseClient) {
            try {
                let query = supabaseClient.from('reminders').select('*');
                if (options?.userId) {
                    query = query.eq('user_id', options.userId);
                }
                if (options?.status) {
                    query = query.eq('status', options.status);
                }
                const { data, error } = await query;
                if (!error && data) {
                    return data.map(mapReminderRecord);
                }
                if (error) {
                    console.warn('[reminderRepo] Supabase getAll error:', error.message);
                }
            } catch (error) {
                console.warn('[reminderRepo] Supabase getAll failed:', error);
            }
        }
        const reminders = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reminderStorage"].getAll();
        return reminders.filter((reminder)=>{
            if (options?.userId && reminder.userId !== options.userId) return false;
            if (options?.status && reminder.status !== options.status) return false;
            return true;
        });
    },
    getById: async (id)=>{
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.from('reminders').select('*').eq('id', id).single();
                if (!error && data) {
                    return mapReminderRecord(data);
                }
            } catch (error) {
                console.warn('[reminderRepo] Supabase getById failed:', error);
            }
        }
        const reminder = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reminderStorage"].byId(id);
        return reminder || null;
    },
    create: async (reminderData)=>{
        if (supabaseClient) {
            try {
                const payload = {
                    id: generateId(),
                    ...buildReminderPayload(reminderData),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                const { data, error } = await supabaseClient.from('reminders').insert(payload).select('*').single();
                if (!error && data) {
                    return mapReminderRecord(data);
                }
            } catch (error) {
                console.warn('[reminderRepo] Supabase create failed:', error);
            }
        }
        const now = new Date();
        const reminder = {
            ...reminderData,
            id: generateId(),
            createdAt: now,
            updatedAt: now
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reminderStorage"].save(reminder);
        return reminder;
    },
    update: async (id, updates)=>{
        if (supabaseClient) {
            try {
                const payload = buildReminderUpdatePayload(updates);
                const { data, error } = await supabaseClient.from('reminders').update(payload).eq('id', id).select('*').single();
                if (!error && data) {
                    return mapReminderRecord(data);
                }
            } catch (error) {
                console.warn('[reminderRepo] Supabase update failed:', error);
            }
        }
        const reminder = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reminderStorage"].byId(id);
        if (!reminder) return null;
        const updatedReminder = {
            ...reminder,
            ...updates,
            updatedAt: new Date()
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reminderStorage"].save(updatedReminder);
        return updatedReminder;
    },
    delete: async (id)=>{
        if (supabaseClient) {
            try {
                const { error } = await supabaseClient.from('reminders').delete().eq('id', id);
                if (!error) {
                    return true;
                }
            } catch (error) {
                console.warn('[reminderRepo] Supabase delete failed:', error);
            }
        }
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reminderStorage"].delete(id);
            return true;
        } catch (error) {
            console.error('[reminderRepo] local delete failed:', error);
            return false;
        }
    },
    getDue: async (now, options)=>{
        if (supabaseClient) {
            try {
                let query = supabaseClient.from('reminders').select('*').eq('status', 'pending').lte('due_at', now.toISOString());
                if (options?.userId) {
                    query = query.eq('user_id', options.userId);
                }
                const { data, error } = await query;
                if (!error && data) {
                    return data.map(mapReminderRecord);
                }
            } catch (error) {
                console.warn('[reminderRepo] Supabase getDue failed:', error);
            }
        }
        const reminders = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reminderStorage"].getAll();
        return reminders.filter((reminder)=>{
            if (reminder.status !== 'pending') return false;
            if (options?.userId && reminder.userId !== options.userId) return false;
            return new Date(reminder.dueAt) <= now;
        });
    }
};
}),
"[project]/packages/data/src/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Export storage layer
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/data/src/storage.ts [app-route] (ecmascript)");
// Export repositories
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/data/src/repositories.ts [app-route] (ecmascript)");
;
;
}),
"[project]/packages/services/src/env.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getEnv",
    ()=>getEnv,
    "requireEnv",
    ()=>requireEnv
]);
// Platform-agnostic environment variable access
// Works in both Node.js (web) and React Native (mobile)
let expoConstants = null;
// Try to import expo-constants if we're in React Native
try {
    expoConstants = __turbopack_context__.r("[project]/node_modules/.pnpm/expo-constants@17.0.8_expo@54.0.32_@babel+core@7.28.6_react-native@0.81.5_@babel+core@7.28.6__xbmy6isdgwp5yfxxitzmp6o6ti/node_modules/expo-constants/build/Constants.server.js [app-route] (ecmascript)").default;
} catch (e) {
// Not in React Native environment, will use process.env
}
function getEnv(key) {
    // React Native: use Expo Constants
    if (expoConstants?.expoConfig?.extra) {
        return expoConstants.expoConfig.extra[key];
    }
    // Node.js: use process.env
    if (typeof process !== 'undefined' && process.env) {
        return process.env[key];
    }
    return undefined;
}
function requireEnv(key) {
    const value = getEnv(key);
    if (!value) {
        throw new Error(`Required environment variable ${key} is not set`);
    }
    return value;
}
}),
"[project]/packages/utils/src/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "normalizeFuzzyTime",
    ()=>normalizeFuzzyTime,
    "parseJsonFromGemini",
    ()=>parseJsonFromGemini,
    "toTimeZone",
    ()=>toTimeZone
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$2$2e$6$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@2.6.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-route] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$2$2e$6$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function parseJsonFromGemini(raw) {
    const trimmed = raw.trim();
    const codeBlock = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = codeBlock ? codeBlock[1].trim() : trimmed;
    return JSON.parse(jsonStr);
}
function toTimeZone(date, timeZone) {
    const iso = date.toLocaleString('en-US', {
        timeZone
    });
    return new Date(iso);
}
function normalizeFuzzyTime(phrase, now, timeZone) {
    const lower = phrase.toLowerCase().trim();
    const base = toTimeZone(now, timeZone);
    if ([
        'today',
        'tonight'
    ].includes(lower)) return base;
    if (lower === 'tomorrow') {
        const d = new Date(base);
        d.setDate(d.getDate() + 1);
        return d;
    }
    if (lower.match(/^in \\d+ (minutes|min)$/)) {
        const mins = parseInt(lower.match(/\\d+/)?.[0] || '0', 10);
        const d = new Date(base);
        d.setMinutes(d.getMinutes() + mins);
        return d;
    }
    if (lower.match(/^in \\d+ (hours|hrs|hour)$/)) {
        const hrs = parseInt(lower.match(/\\d+/)?.[0] || '0', 10);
        const d = new Date(base);
        d.setHours(d.getHours() + hrs);
        return d;
    }
    return null;
}
}),
"[project]/packages/services/src/gemini.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GeminiService",
    ()=>GeminiService
]);
// Gemini AI service for agent operations
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$google$2b$generative$2d$ai$40$0$2e$21$2e$0$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@google+generative-ai@0.21.0/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/env.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$utils$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/utils/src/index.ts [app-route] (ecmascript)");
;
;
;
class GeminiService {
    apiKey;
    genAI = null;
    constructor(){
        this.apiKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEnv"])('GEMINI_API_KEY') || '';
        // Remove any surrounding quotes that might have been included
        if (this.apiKey) {
            this.apiKey = this.apiKey.trim().replace(/^["']|["']$/g, '');
        }
        if (!this.apiKey) {
            console.error('GEMINI_API_KEY is not set in environment variables');
        } else {
            console.log('Gemini API key loaded, length:', this.apiKey.length);
            try {
                this.genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$google$2b$generative$2d$ai$40$0$2e$21$2e$0$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](this.apiKey);
            } catch (error) {
                console.error('Failed to initialize Google Generative AI:', error);
            }
        }
    }
    async generateContent(prompt, modelName = 'gemini-2.0-flash') {
        if (!this.genAI) {
            throw new Error('Google Generative AI not initialized. Check your API key.');
        }
        // Try multiple model names in order of preference
        // Reverting to gemini-2.0-flash as it was confirmed to exist (returned 403, not 404)
        const modelNames = [
            'gemini-2.5-flash' // Standard fallback
        ];
        // Allow override via environment variable or parameter
        const preferredModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEnv"])('GEMINI_MODEL') || modelName;
        if (preferredModel && modelNames.includes(preferredModel)) {
            modelNames.unshift(preferredModel);
        }
        let lastError = null;
        let attemptedModels = [];
        for (const model of modelNames){
            try {
                const genModel = this.genAI.getGenerativeModel({
                    model
                });
                const result = await genModel.generateContent(prompt);
                const response = await result.response;
                const text = response.text();
                // Silently succeed - no logging needed for normal operation
                return text;
            } catch (error) {
                // Silently skip 404 errors (model not available) - these are expected when trying fallbacks
                // Only track non-404 errors as they might indicate real problems
                if (!error.message?.includes('404') && !error.message?.includes('Not Found')) {
                    console.warn(`Error with model ${model}:`, error.message);
                }
                attemptedModels.push(model);
                lastError = error;
                continue;
            }
        }
        // If we get here, all models failed - log all attempted models
        const errorMessage = `Failed to generate content with any available Gemini model. Attempted: ${attemptedModels.join(', ')}. Please check your API key and model availability.`;
        console.error(errorMessage);
        throw lastError || new Error(errorMessage);
    }
    generatePrompt(agentType, context) {
        switch(agentType){
            case 'planner':
                return this.generatePlannerPrompt(context);
            case 'prioritization':
                return this.generatePrioritizationPrompt(context);
            case 'scheduler':
                return this.generateSchedulerPrompt(context);
            case 'execution':
                return this.generateExecutionPrompt(context);
            case 'reflection':
                return this.generateReflectionPrompt(context);
            default:
                throw new Error(`Unknown agent type: ${agentType}`);
        }
    }
    generatePlannerPrompt(context) {
        const memoryContext = context.memoryContext || {};
        const similarItems = context.similarItems || [];
        const originalInput = context.originalInput || context.goals.join(', ');
        let memorySection = '';
        if (memoryContext.existingPlans && memoryContext.existingPlans.length > 0) {
            memorySection += `\n\nExisting Plans (for context, avoid duplication):\n${memoryContext.existingPlans.slice(0, 5).map((plan)=>`- "${plan.title}": ${plan.description} (Goal: ${plan.goal})`).join('\n')}`;
        }
        if (memoryContext.relatedTasks && memoryContext.relatedTasks.length > 0) {
            memorySection += `\n\nRelated Tasks (for context):\n${memoryContext.relatedTasks.slice(0, 5).map((task)=>`- "${task.title}": ${task.description || 'No description'}`).join('\n')}`;
        }
        let duplicateWarning = '';
        if (similarItems.length > 0) {
            duplicateWarning = `\n\n⚠️ DUPLICATE DETECTION: Similar items found:\n${similarItems.map((item)=>`- ${item.type === 'plan' ? 'Plan' : 'Task'}: "${item.item.title}" (${(item.similarity * 100).toFixed(0)}% similar) - ${item.reason}`).join('\n')}\n\nIMPORTANT: If creating a new plan, ensure it's meaningfully different from the above. Consider merging or updating existing items instead.`;
        }
        return `You are a task planning AI assistant. Your job is to help users break down their goals into actionable tasks.

User Input: "${originalInput}"
User goals: ${context.goals.join(', ')}
Time constraints: ${JSON.stringify(context.constraints)}
Expected timeframe: ${context.timeframe ? `${context.timeframe.start} to ${context.timeframe.end}` : 'not specified'}${memorySection}${duplicateWarning}

FIRST, generate a meaningful plan title and description from the user input:
- Title: Should be concise (under 60 characters), descriptive, and capture the essence of the goal
- Description: Should be a brief summary (under 200 characters) explaining what this plan aims to achieve

THEN, break down these goals into specific, actionable tasks. For each task, provide:
1. A clear title (under 60 characters)
2. A brief description (under 150 characters)
3. Estimated time to complete (in minutes)
4. Required focus level (shallow, medium, or deep)
5. Energy requirement (low, medium, or high)
6. Appropriate context (home, work, or anywhere)
7. Relevant tags (max 3)
8. kind: one of "reminder" (one-off time-based), "todo" (general actionable item), "habit" (recurring, no fixed time), "daily" (recurring daily)
9. recurrencePerWeek: 1 for reminder/todo, 7 for daily, 3 for habit (times per week)

Return ONLY valid JSON. Do not wrap in markdown code blocks (no \`\`\`).
Use this structure:
{
  "planTitle": "generated title from user input",
  "planDescription": "generated description from user input",
  "tasks": [
    {
      "title": "string",
      "description": "string",
      "estimatedTime": number,
      "focusLevel": "shallow|medium|deep",
      "energyRequirement": "low|medium|high",
      "context": "home|work|anywhere",
      "tags": ["tag1", "tag2"],
      "kind": "reminder|todo|habit|daily",
      "recurrencePerWeek": number
    }
  ]
}`;
    }
    generatePrioritizationPrompt(context) {
        return `You are a task prioritization AI assistant. Your goal is to translate user priorities into a structured ranking while respecting temporal feasibility and human limitations.

Philosophy:
- AI as a translator, not an authority.
- Trust is preserved by predictability, not cleverness.
- Explain your reasoning.

Current Context:
${context.currentContext ? `
- Available time: ${context.currentContext.availableTime} minutes
- Current energy level: ${context.currentContext.currentEnergy}
- Current location: ${context.currentContext.location}
- Available tools: ${context.currentContext.toolsAvailable.join(', ')}` : 'No specific context provided'}

Please analyze these tasks and rank them by priority. Consider:
1. Deadline importance
2. Long-term value
3. Required focus level
4. Energy cost
5. Dependency complexity
6. User preferences based on context

Tasks to prioritize:
${JSON.stringify(context.tasks, null, 2)}

Return your response as JSON with an array of prioritized tasks and a brief summary of your reasoning:
{
  "tasks": [
    {
      "id": "task_id",
      "priorityScore": number,
      "priority": "low|medium|high|urgent",
      "reasoning": "brief explanation of priority score"
    }
  ],
  "reasoning": ["point 1", "point 2"]
}`;
    }
    generateSchedulerPrompt(context) {
        return `You are a task scheduling AI assistant. Your goal is to translate user goals into a realistic, temporally feasible schedule.

Philosophy:
- Time is the governing dimension of the system.
- Prefer fewer commitments and realistic schedules.
- Always explain what you are about to do.
- AI is a translator, not an authority.

Date to schedule: ${context.date.toLocaleDateString()}
Energy profile: ${JSON.stringify(context.energyProfile)}
${context.existingEvents ? `Existing events: ${JSON.stringify(context.existingEvents)}` : ''}
${context.constraints ? `Constraints: ${JSON.stringify(context.constraints)}` : ''}

Tasks to schedule:
${JSON.stringify(context.tasks, null, 2)}

Please create a Schedule for this date. Consider:
1. User's energy profile (when their focus is strongest/weakest)
2. Deep work session limits (max 2-3 sessions per day)
3. Break time between deep work sessions (at least 15 minutes)
4. Task focus levels and energy requirements
5. Conflicts with existing events

Return your response as JSON with a schedule and reasoning:
{
  "schedule": {
    "date": "${context.date.toISOString()}",
    "tasks": [
      {
        "taskId": "task_id",
        "title": "task_title",
        "scheduledStart": "ISO_datetime",
        "scheduledEnd": "ISO_datetime",
        "status": "scheduled"
      }
    ],
    "reasoning": ["point 1", "point 2"]
  }
}`;
    }
    generateExecutionPrompt(context) {
        return `You are a task execution AI assistant. Your goal is to help users work on their current task by translating intent into concrete steps and identifying potential blockers.

Philosophy:
- AI as a translator, not an authority.
- Trust is preserved by predictability and clarity.
- Reduce cognitive load by providing focused instructions.

Current task: ${JSON.stringify(context.currentTask, null, 2)}
${context.progress ? `Current progress: ${JSON.stringify(context.progress)}` : ''}
${context.nextSteps ? `Next steps: ${context.nextSteps.join(', ')}` : ''}

Please provide:
1. The absolute next step the user should take
2. Clear instructions on how to complete this step
3. Estimated time to complete this step
4. Relevant context about related tasks and potential blockers
5. Helpful suggestions for effective execution

Return your response as JSON:
{
  "nextStep": {
    "action": "string",
    "instructions": "string",
    "estimatedTime": number,
  },
  "context": {
    "relatedTasks": ["task_id1", "task_id2"],
    "blockers": ["blocker1", "blocker2"],
    "resources": ["resource1", "resource2"]
  },
  "suggestions": ["suggestion1", "suggestion2"]
}`;
    }
    generateReflectionPrompt(context) {
        return `You are a task reflection AI assistant. Your goal is to help users learn from their task completion patterns by providing non-authoritative advisory warnings and insights.

Philosophy:
- Behavioral insights should be advisory, not authoritative.
- Labels and warnings must be clear and skippable.
- Focus on reducing cognitive load and increasing clarity.

Tasks being reflected on: ${JSON.stringify(context.tasks, null, 2)}
${context.completionHistory.length > 0 ? `Task completion history: ${JSON.stringify(context.completionHistory, null, 2)}` : ''}
${context.userFeedback && context.userFeedback.length > 0 ? `User feedback: ${JSON.stringify(context.userFeedback, null, 2)}` : ''}

Please analyze this data and provide:

1. Behavioral patterns in task completion (time estimation accuracy, procrastination tendencies, etc.)
2. Specific adjustments the user should make to their process
3. Personalized recommendations for better task management

Return your response as JSON:
{
  "insights": {
    "patterns": ["pattern1", "pattern2"],
    "adjustments": [
      {
        "type": "time|energy|priority|process",
        "before": "current approach",
        "after": "suggested approach",
        "reason": "why this change would help"
      }
    ]
  },
  "recommendations": ["recommendation1", "recommendation2"]
}`;
    }
    async processVoiceTranscript(transcript, now, timeZone) {
        const prompt = `You are a voice-to-intent translator for a productivity system.
Your goal is to split a messy voice transcript into logical chunks and classify each chunk.

Philosophy:
- AI as a translator, not an authority.
- Be conservative with intent detection.
- Time is a first-class constraint. Normalize all time expressions relative to "now".

Current "Now": ${now.toISOString()}
Current Timezone: ${timeZone}

Transcript: "${transcript}"

Split the transcript into logical chunks. For each chunk, determine:
1. "intent": 'task' | 'reminder' | 'habit' | 'note' | 'unknown'
2. "normalized": A cleaner version of the raw text.
3. "timeExpressions": Array of normalized ISO-8601 timestamps found in the chunk, or relative time offsets.
4. "dueAt": A single ISO-8601 timestamp representing the primary deadline or reminder time, if any.

Return your response as JSON with an array of chunks:
{
  "chunks": [
    {
      "raw": "original segment",
      "normalized": "clean version",
      "intent": "task|reminder|habit|note|unknown",
      "timeExpressions": ["ISO_timestamp"],
      "dueAt": "ISO_timestamp or null"
    }
  ]
}`;
        const response = await this.generateContent(prompt, 'gemini-1.5-flash');
        try {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$utils$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseJsonFromGemini"])(response);
        } catch (error) {
            console.error('Failed to parse Gemini response for voice transcript:', error);
            return {
                chunks: []
            };
        }
    }
}
}),
"[project]/packages/services/src/memory-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MemoryService",
    ()=>MemoryService,
    "memoryService",
    ()=>memoryService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/data/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/data/src/repositories.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/gemini.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$utils$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/utils/src/index.ts [app-route] (ecmascript)");
;
;
;
class MemoryService {
    geminiService;
    constructor(){
        this.geminiService = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GeminiService"]();
    }
    /**
   * Get comprehensive user context for memory-aware processing
   */ async getUserContext(userId) {
        const [allPlans, allTasks, allOutputs] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["planRepo"].getAll(),
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["taskRepo"].getAll(),
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentOutputRepo"].getAll()
        ]);
        // Filter to user's data (for now, we'll use all data since we don't have user filtering yet)
        const userPlans = allPlans;
        const userTasks = allTasks;
        // Get last 50 agent outputs (most recent first)
        const recentOutputs = allOutputs.sort((a, b)=>new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 50);
        // Extract recent user inputs from agent outputs
        const recentInputs = recentOutputs.map((output)=>{
            if (output.input?.goals) {
                return Array.isArray(output.input.goals) ? output.input.goals.join(' ') : output.input.goals;
            }
            if (output.input?.message) {
                return output.input.message;
            }
            return null;
        }).filter((input)=>input !== null).slice(0, 20);
        return {
            recentOutputs,
            existingPlans: userPlans,
            existingTasks: userTasks,
            recentInputs
        };
    }
    /**
   * Find similar/duplicate items using semantic similarity
   */ async findSimilarItems(input, userId, threshold = 0.7) {
        const context = await this.getUserContext(userId);
        const similarItems = [];
        // Use Gemini to analyze similarity
        const prompt = `Analyze the following user input and compare it with existing plans and tasks to find duplicates or very similar items.

User Input: "${input}"

Existing Plans:
${context.existingPlans.map((plan)=>`- ID: ${plan.id}, Title: "${plan.title}", Description: "${plan.description}", Goal: "${plan.goal}"`).join('\n')}

Existing Tasks:
${context.existingTasks.map((task)=>`- ID: ${task.id}, Title: "${task.title}", Description: "${task.description || ''}"`).join('\n')}

For each existing item, determine:
1. Similarity score (0-1, where 1 is identical/duplicate, 0.7+ is very similar)
2. Reason for similarity

Return JSON array with format:
{
  "similarItems": [
    {
      "id": "item_id",
      "type": "plan" or "task",
      "similarity": 0.0-1.0,
      "reason": "brief explanation"
    }
  ]
}

Only include items with similarity >= ${threshold}.`;
        try {
            const response = await this.geminiService.generateContent(prompt);
            const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$utils$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseJsonFromGemini"])(response);
            if (result.similarItems && Array.isArray(result.similarItems)) {
                for (const item of result.similarItems){
                    const existingItem = item.type === 'plan' ? context.existingPlans.find((p)=>p.id === item.id) : context.existingTasks.find((t)=>t.id === item.id);
                    if (existingItem && item.similarity >= threshold) {
                        similarItems.push({
                            item: existingItem,
                            type: item.type,
                            similarity: item.similarity,
                            reason: item.reason || 'Similar content found'
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error finding similar items:', error);
            // Fallback to simple text matching
            return this.fallbackSimilarityCheck(input, context, threshold);
        }
        // Sort by similarity (highest first)
        return similarItems.sort((a, b)=>b.similarity - a.similarity);
    }
    /**
   * Fallback similarity check using simple text matching
   */ fallbackSimilarityCheck(input, context, threshold) {
        const similarItems = [];
        const inputLower = input.toLowerCase();
        const inputWords = inputLower.split(/\s+/);
        // Check plans
        for (const plan of context.existingPlans){
            const planText = `${plan.title} ${plan.description} ${plan.goal}`.toLowerCase();
            const planWords = planText.split(/\s+/);
            // Calculate simple word overlap
            const commonWords = inputWords.filter((word)=>word.length > 3 && planWords.includes(word));
            const similarity = commonWords.length / Math.max(inputWords.length, planWords.length);
            if (similarity >= threshold) {
                similarItems.push({
                    item: plan,
                    type: 'plan',
                    similarity,
                    reason: `Shared ${commonWords.length} keywords: ${commonWords.slice(0, 3).join(', ')}`
                });
            }
        }
        // Check tasks
        for (const task of context.existingTasks){
            const taskText = `${task.title} ${task.description || ''}`.toLowerCase();
            const taskWords = taskText.split(/\s+/);
            const commonWords = inputWords.filter((word)=>word.length > 3 && taskWords.includes(word));
            const similarity = commonWords.length / Math.max(inputWords.length, taskWords.length);
            if (similarity >= threshold) {
                similarItems.push({
                    item: task,
                    type: 'task',
                    similarity,
                    reason: `Shared ${commonWords.length} keywords: ${commonWords.slice(0, 3).join(', ')}`
                });
            }
        }
        return similarItems;
    }
    /**
   * Get contextually related items for enriching AI prompts
   */ async getRelatedContext(input, userId) {
        const context = await this.getUserContext(userId);
        const inputLower = input.toLowerCase();
        const inputWords = inputLower.split(/\s+/).filter((w)=>w.length > 3);
        // Find plans with similar goals/tags
        const relatedPlans = context.existingPlans.filter((plan)=>{
            const planText = `${plan.title} ${plan.description} ${plan.goal}`.toLowerCase();
            return inputWords.some((word)=>planText.includes(word));
        });
        // Find tasks with similar descriptions/tags
        const relatedTasks = context.existingTasks.filter((task)=>{
            const taskText = `${task.title} ${task.description || ''} ${task.tags.join(' ')}`.toLowerCase();
            return inputWords.some((word)=>taskText.includes(word));
        });
        // Extract common tags
        const allTags = new Set();
        relatedPlans.forEach((plan)=>{
        // Plans don't have tags in the model, but we can extract from related tasks
        });
        relatedTasks.forEach((task)=>{
            task.tags.forEach((tag)=>allTags.add(tag));
        });
        return {
            relatedPlans: relatedPlans.slice(0, 5),
            relatedTasks: relatedTasks.slice(0, 10),
            relatedTags: Array.from(allTags).slice(0, 10)
        };
    }
}
const memoryService = new MemoryService();
}),
"[project]/packages/services/src/pressure-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computePressure",
    ()=>computePressure,
    "getWeekBounds",
    ()=>getWeekBounds
]);
const KINDS = [
    "reminder",
    "todo",
    "habit",
    "daily"
];
function defaultRecurrencePerWeek(kind) {
    switch(kind){
        case "daily":
            return 7;
        case "habit":
            return 3;
        case "reminder":
        case "todo":
        default:
            return 1;
    }
}
function getWeekBounds() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(now);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return {
        start,
        end
    };
}
function inWeek(d, start, end) {
    const t = new Date(d).getTime();
    return t >= start.getTime() && t <= end.getTime();
}
function computePressure(tasks, projects) {
    const { start, end } = getWeekBounds();
    const byKind = {
        reminder: {
            count: 0,
            hours: 0
        },
        todo: {
            count: 0,
            hours: 0
        },
        habit: {
            count: 0,
            hours: 0
        },
        daily: {
            count: 0,
            hours: 0
        }
    };
    let nonProjectMinutes = 0;
    let nonProjectItemCount = 0;
    for (const t of tasks){
        if (t.status === "cancelled") continue;
        const kind = t.kind ?? "todo";
        if (!KINDS.includes(kind)) continue;
        if (t.projectId) continue;
        const perWeek = t.recurrencePerWeek ?? defaultRecurrencePerWeek(kind);
        const minutes = t.estimatedTime * perWeek;
        byKind[kind].hours += minutes / 60;
        byKind[kind].count += 1;
        nonProjectMinutes += minutes;
        nonProjectItemCount += 1;
    }
    let projectHours = 0;
    for (const p of projects){
        projectHours += p.weeklyHours;
    }
    const nonProjectHours = nonProjectMinutes / 60;
    const totalHours = nonProjectHours + projectHours;
    const itemCount = nonProjectItemCount + projects.length;
    let fragmentation = "low";
    if (totalHours > 0) {
        const itemsPer10h = itemCount / (totalHours / 10);
        if (itemsPer10h >= 8 || itemCount >= 25) fragmentation = "high";
        else if (itemsPer10h >= 4 || itemCount >= 12) fragmentation = "medium";
    }
    return {
        totalHours,
        projectHours,
        nonProjectHours,
        itemCount,
        fragmentation,
        byKind,
        projects: projects.map((p)=>({
                id: p.id,
                title: p.title,
                weeklyHours: p.weeklyHours
            }))
    };
}
}),
"[project]/packages/services/src/validation-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ValidationService",
    ()=>ValidationService,
    "validationService",
    ()=>validationService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$3$2e$6$2e$0$2f$node_modules$2f$date$2d$fns$2f$differenceInMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/differenceInMinutes.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$3$2e$6$2e$0$2f$node_modules$2f$date$2d$fns$2f$isAfter$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/isAfter.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$3$2e$6$2e$0$2f$node_modules$2f$date$2d$fns$2f$isBefore$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/isBefore.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$pressure$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/pressure-service.ts [app-route] (ecmascript)");
;
;
class ValidationService {
    /**
   * Validate a proposed schedule before persistence.
   * Returns blocking errors, warnings, and a human-friendly summary.
   */ validateSchedule(params) {
        const issues = [];
        const events = params.events ?? [];
        const user = params.user;
        // Hard conflicts: overlap between scheduled tasks and existing events
        for (const taskBlock of params.scheduled){
            const conflict = events.find((evt)=>this.overlaps(taskBlock, evt));
            if (conflict) {
                issues.push({
                    code: 'hard_conflict',
                    severity: 'error',
                    message: `Task ${taskBlock.taskId} overlaps ${conflict.type} (${this.rangeLabel(conflict)})`,
                    relatedIds: [
                        taskBlock.taskId
                    ],
                    details: 'Hard overlap detected'
                });
            }
        }
        // Hard conflicts: overlapping scheduled tasks
        const sorted = [
            ...params.scheduled
        ].sort((a, b)=>a.scheduledStart.getTime() - b.scheduledStart.getTime());
        for(let i = 0; i < sorted.length - 1; i++){
            if (this.overlaps(sorted[i], sorted[i + 1])) {
                issues.push({
                    code: 'task_overlap',
                    severity: 'error',
                    message: `Tasks ${sorted[i].taskId} and ${sorted[i + 1].taskId} overlap (${this.rangeLabel(sorted[i])})`,
                    relatedIds: [
                        sorted[i].taskId,
                        sorted[i + 1].taskId
                    ]
                });
            }
        }
        // Semantic conflicts: deep work late night or beyond workday
        for (const block of params.scheduled){
            const task = params.tasks.find((t)=>t.id === block.taskId);
            if (!task) continue;
            const hour = block.scheduledStart.getHours();
            if (task.focusLevel === 'deep' && (hour < 8 || hour >= 18)) {
                issues.push({
                    code: 'semantic_energy_mismatch',
                    severity: 'warn',
                    message: `Deep work task "${task.title}" is scheduled outside typical focus hours`,
                    relatedIds: [
                        task.id
                    ]
                });
            }
            // Unrealistic duration check
            const duration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$3$2e$6$2e$0$2f$node_modules$2f$date$2d$fns$2f$differenceInMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["differenceInMinutes"])(block.scheduledEnd, block.scheduledStart);
            if (duration > 240) {
                issues.push({
                    code: 'duration_exceeds_4h',
                    severity: 'warn',
                    message: `Task "${task.title}" is scheduled for ${duration} minutes; recommend splitting`,
                    relatedIds: [
                        task.id
                    ]
                });
            }
        }
        // Cognitive load: total scheduled minutes vs. work window
        const totalMinutes = params.scheduled.reduce((sum, t)=>sum + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$3$2e$6$2e$0$2f$node_modules$2f$date$2d$fns$2f$differenceInMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["differenceInMinutes"])(t.scheduledEnd, t.scheduledStart), 0);
        const workWindowMinutes = 8 * 60;
        if (totalMinutes > workWindowMinutes) {
            issues.push({
                code: 'cognitive_overload',
                severity: 'warn',
                message: `Total scheduled time (${totalMinutes}m) exceeds standard work window (${workWindowMinutes}m).`
            });
        }
        // Physical feasibility: travel time/transition time (Semantic)
        for(let i = 0; i < sorted.length - 1; i++){
            const first = sorted[i];
            const second = sorted[i + 1];
            const gap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$3$2e$6$2e$0$2f$node_modules$2f$date$2d$fns$2f$differenceInMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["differenceInMinutes"])(second.scheduledStart, first.scheduledEnd);
            if (gap < 5 && gap >= 0) {
                issues.push({
                    code: 'insufficient_transition',
                    severity: 'warn',
                    message: `Back-to-back tasks without transition time: ${this.rangeLabel(first)} and ${this.rangeLabel(second)}`,
                    relatedIds: [
                        first.taskId,
                        second.taskId
                    ]
                });
            }
            // Check for location changes (if location is available in metadata or context)
            if (first.location && second.location && first.location !== second.location && gap < 30) {
                issues.push({
                    code: 'location_conflict_travel',
                    severity: 'warn',
                    message: `Infeasible travel time between ${first.location} and ${second.location} (${gap}m gap)`,
                    relatedIds: [
                        first.taskId,
                        second.taskId
                    ]
                });
            }
        }
        // Time sanity: start before end
        for (const block of params.scheduled){
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$3$2e$6$2e$0$2f$node_modules$2f$date$2d$fns$2f$isBefore$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isBefore"])(block.scheduledStart, block.scheduledEnd)) {
                issues.push({
                    code: 'invalid_time_range',
                    severity: 'error',
                    message: `Task ${block.taskId} has an invalid time range`,
                    relatedIds: [
                        block.taskId
                    ]
                });
            }
        }
        const blocking = issues.some((i)=>i.severity === 'error');
        const requiresConfirmation = issues.length > 0;
        return {
            ok: !blocking,
            requiresConfirmation,
            issues,
            summary: this.buildSummary(issues, user)
        };
    }
    /**
   * Validate task input before creation/update.
   * Enforces time presence, duration sanity, and dependency sanity.
   */ validateTaskInput(params) {
        const { task, existing = [], projects = [] } = params;
        const issues = [];
        // Time is required for actionable items (todo/reminder). Habits/dailies can rely on recurrence.
        const kind = task.kind ?? 'todo';
        if (!task.dueDate && kind !== 'habit' && kind !== 'daily') {
            issues.push({
                code: 'time_missing',
                severity: 'error',
                message: 'A concrete time (due date or schedule) is required before committing the task.'
            });
        }
        // Weekly Pressure Check
        if (existing.length > 0) {
            const currentPressure = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$pressure$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computePressure"])(existing, projects);
            if (currentPressure.totalHours > 40) {
                issues.push({
                    code: 'weekly_overload',
                    severity: 'warn',
                    message: `Weekly workload is high (${currentPressure.totalHours.toFixed(1)}h). Consider deferring this task.`
                });
            }
        }
        // Estimated time sanity
        if (typeof task.estimatedTime === 'number' && task.estimatedTime <= 0) {
            issues.push({
                code: 'invalid_estimate',
                severity: 'error',
                message: 'Estimated time must be greater than zero minutes.'
            });
        }
        if (typeof task.estimatedTime === 'number' && task.estimatedTime > 480) {
            issues.push({
                code: 'estimate_exceeds_day',
                severity: 'warn',
                message: 'Estimated time exceeds a full workday; consider splitting the task.'
            });
        }
        // Dependency sanity
        if (task.dependencies && task.dependencies.length) {
            const missing = task.dependencies.filter((dep)=>!existing.find((t)=>t.id === dep));
            if (missing.length) {
                issues.push({
                    code: 'dependency_missing',
                    severity: 'error',
                    message: `Dependencies not found: ${missing.join(', ')}`,
                    relatedIds: missing
                });
            }
        }
        return {
            ok: !issues.some((i)=>i.severity === 'error'),
            requiresConfirmation: issues.length > 0,
            issues,
            summary: this.buildSummary(issues)
        };
    }
    overlaps(a, b) {
        const startA = 'scheduledStart' in a ? a.scheduledStart : a.start;
        const endA = 'scheduledEnd' in a ? a.scheduledEnd : a.end;
        const startB = 'scheduledStart' in b ? b.scheduledStart : b.start;
        const endB = 'scheduledEnd' in b ? b.scheduledEnd : b.end;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$3$2e$6$2e$0$2f$node_modules$2f$date$2d$fns$2f$isBefore$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isBefore"])(startA, endB) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$3$2e$6$2e$0$2f$node_modules$2f$date$2d$fns$2f$isAfter$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAfter"])(endA, startB);
    }
    buildSummary(issues, user) {
        if (!issues.length) return [
            'Validation passed – no conflicts detected'
        ];
        const blocking = issues.filter((i)=>i.severity === 'error').length;
        const warnings = issues.filter((i)=>i.severity === 'warn').length;
        const summary = [
            `${blocking} blocking issue(s), ${warnings} warning(s) detected`
        ];
        const top = issues.slice(0, 5).map((i)=>`${i.severity.toUpperCase()}: ${i.message}`);
        summary.push(...top);
        if (user?.preferences?.notificationSettings?.scheduleChanges) {
            summary.push('User notifications enabled: schedule changes should be summarized before send.');
        }
        return summary;
    }
    rangeLabel(block) {
        const start = 'scheduledStart' in block ? block.scheduledStart : block.start;
        const end = 'scheduledEnd' in block ? block.scheduledEnd : block.end;
        return `${start.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })}–${end.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    }
}
const validationService = new ValidationService();
}),
"[project]/packages/services/src/notification-guard.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationGuard",
    ()=>NotificationGuard,
    "notificationGuard",
    ()=>notificationGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$3$2e$6$2e$0$2f$node_modules$2f$date$2d$fns$2f$differenceInMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/differenceInMinutes.mjs [app-route] (ecmascript)");
;
class NotificationGuard {
    /**
   * Validate and annotate a push notification before sending.
   * Enforces “explicit, meaningful, non-spammy” rules from App_system.
   */ validate(payload, ctx = {}) {
        const issues = [];
        if (!payload.title || !payload.body) {
            issues.push('Notification must include title and body.');
        }
        // Semantic quality checks
        if (payload.body.length < 8) {
            issues.push('Notification body is too short to be meaningful.');
        }
        // Rate limiting
        const minInterval = ctx.minIntervalMinutes ?? 15;
        if (ctx.lastSentAt) {
            const minutesSinceLast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$3$2e$6$2e$0$2f$node_modules$2f$date$2d$fns$2f$differenceInMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["differenceInMinutes"])(new Date(), ctx.lastSentAt);
            if (minutesSinceLast < minInterval) {
                issues.push(`Last notification sent ${minutesSinceLast}m ago; wait at least ${minInterval}m to avoid spam.`);
            }
        }
        return {
            ok: issues.length === 0,
            issues,
            recommendation: 'Send only after user-visible confirmation for high-priority or back-to-back messages.'
        };
    }
}
const notificationGuard = new NotificationGuard();
}),
"[project]/packages/services/src/voice-intake.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VoiceIntakeService",
    ()=>VoiceIntakeService,
    "voiceIntakeService",
    ()=>voiceIntakeService
]);
/**
 * Voice intake helper: chunks messy speech into logical units and classifies each
 * into intents (task, reminder, habit, note) with lightweight heuristics.
 * Designed to be paired with LLM refinement but provides deterministic fallbacks.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/gemini.ts [app-route] (ecmascript)");
;
class VoiceIntakeService {
    geminiService = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GeminiService"]();
    /**
   * Processes a transcript using LLM for high-quality intent extraction and temporal normalization.
   * Falls back to deterministic heuristics if LLM fails or is unavailable.
   */ async process(transcript, now = new Date(), timeZone = 'UTC') {
        try {
            const result = await this.geminiService.processVoiceTranscript(transcript, now, timeZone);
            if (result && Array.isArray(result.chunks)) {
                return result.chunks;
            }
        } catch (error) {
            console.error('LLM voice processing failed, falling back to heuristics:', error);
        }
        return this.splitAndClassifyHeuristic(transcript);
    }
    splitAndClassifyHeuristic(transcript) {
        // Naive sentence segmentation; in production use a proper NLP splitter.
        const sentences = transcript.split(/(?<=[.!?])\s+/).map((s)=>s.trim()).filter(Boolean);
        return sentences.map((sentence)=>{
            const normalized = sentence.toLowerCase();
            const intent = this.detectIntent(normalized);
            const timeExpressions = this.extractTime(normalized);
            return {
                raw: sentence,
                normalized,
                intent,
                timeExpressions
            };
        });
    }
    detectIntent(text) {
        if (text.includes('every day') || text.includes('daily')) return 'habit';
        if (text.startsWith('remind') || text.includes('remind me')) return 'reminder';
        if (text.includes('note') || text.startsWith('note to self')) return 'note';
        if (text.includes('task') || text.includes('todo') || text.includes('to do')) return 'task';
        return 'unknown';
    }
    extractTime(text) {
        const matches = text.match(/\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}(:\d{2})?\s?(am|pm)?|\d{4}-\d{2}-\d{2})\b/gi);
        return matches ? matches : [];
    }
}
const voiceIntakeService = new VoiceIntakeService();
}),
"[project]/packages/services/src/email-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EmailService",
    ()=>EmailService,
    "emailService",
    ()=>emailService
]);
class EmailService {
    async preview(draft) {
        return {
            draft,
            summary: `Ready to send to ${draft.to.join(', ')}`,
            requiresConfirmation: true
        };
    }
    async send(draft, options) {
        if (!options.confirmed) {
            return {
                sent: false,
                requiresConfirmation: true,
                message: 'Confirmation required before sending email.',
                draft
            };
        }
        // TODO: plug in real email provider here.
        if (options.dryRun) {
            return {
                sent: false,
                dryRun: true,
                payload: draft
            };
        }
        // Placeholder success response
        return {
            sent: true,
            id: `email_${Date.now()}`,
            draft
        };
    }
}
const emailService = new EmailService();
}),
"[project]/packages/services/src/clickup-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClickUpService",
    ()=>ClickUpService,
    "clickUpService",
    ()=>clickUpService
]);
class ClickUpService {
    mapTaskToClickUp(task) {
        return {
            name: task.title,
            description: task.description,
            status: task.status,
            priority: this.mapPriority(task.priority),
            due_date: task.dueDate ? new Date(task.dueDate).getTime() : undefined,
            time_estimate: task.estimatedTime ? task.estimatedTime * 60000 : undefined,
            tags: task.tags
        };
    }
    async previewSync(task) {
        const payload = this.mapTaskToClickUp(task);
        return {
            payload,
            requiresConfirmation: true,
            summary: `Will create/update ClickUp task: "${payload.name}" with priority ${payload.priority || 'default'}.`,
            note: 'AI is a translator; review this mapping before it becomes an authority in ClickUp.'
        };
    }
    async syncTask(task, options = {}) {
        const payload = this.mapTaskToClickUp(task);
        if (!options.allowOverride) {
            return {
                synced: false,
                requiresConfirmation: true,
                message: 'ClickUp sync requires explicit user confirmation (Philosophy 2.1).',
                payload
            };
        }
        if (options.dryRun) {
            return {
                synced: false,
                dryRun: true,
                payload
            };
        }
        // TODO: call ClickUp API here
        return {
            synced: true,
            payload,
            id: `clickup_${Date.now()}`
        };
    }
    mapPriority(priority) {
        switch(priority){
            case 'urgent':
                return 1;
            case 'high':
                return 2;
            case 'medium':
                return 3;
            case 'low':
                return 4;
            default:
                return undefined;
        }
    }
}
const clickUpService = new ClickUpService();
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:stream/web [external] (node:stream/web, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream/web", () => require("node:stream/web"));

module.exports = mod;
}),
"[project]/packages/services/src/groq.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GroqService",
    ()=>GroqService,
    "default",
    ()=>__TURBOPACK__default__export__,
    "groqService",
    ()=>groqService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$groq$2d$sdk$40$0$2e$7$2e$0$2f$node_modules$2f$groq$2d$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/groq-sdk@0.7.0/node_modules/groq-sdk/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/env.ts [app-route] (ecmascript)");
;
;
class GroqService {
    client;
    constructor(){
        this.client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$groq$2d$sdk$40$0$2e$7$2e$0$2f$node_modules$2f$groq$2d$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
            apiKey: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEnv"])('GROQ_API_KEY') || ''
        });
    }
    async transcribe(file) {
        try {
            // Groq SDK accepts File objects directly
            // If we have a Blob, convert it to a File
            let audioFile;
            if (file instanceof File) {
                audioFile = file;
            } else {
                // Convert Blob to File
                audioFile = new File([
                    file
                ], 'audio.webm', {
                    type: file.type || 'audio/webm'
                });
            }
            // The Groq SDK for Node.js accepts File objects directly
            // It will handle the file reading internally
            const transcription = await this.client.audio.transcriptions.create({
                file: audioFile,
                model: 'whisper-large-v3-turbo',
                temperature: 0,
                response_format: 'verbose_json'
            });
            return transcription.text;
        } catch (error) {
            console.error('Error in Groq transcription service:', error);
            throw error;
        }
    }
}
const groqService = new GroqService();
const __TURBOPACK__default__export__ = GroqService;
}),
"[project]/packages/services/src/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Export all services
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/gemini.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$memory$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/memory-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$pressure$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/pressure-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$validation$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/validation-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$notification$2d$guard$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/notification-guard.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$voice$2d$intake$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/voice-intake.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$email$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/email-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$clickup$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/clickup-service.ts [app-route] (ecmascript)");
// Export environment utilities
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/env.ts [app-route] (ecmascript)");
// Re-export groq if needed
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$groq$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/groq.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
}),
"[project]/packages/agents/src/planner-agent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PlannerAgent",
    ()=>PlannerAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/data/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/data/src/repositories.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/services/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/gemini.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$memory$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/memory-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$validation$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/validation-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$utils$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/utils/src/index.ts [app-route] (ecmascript)");
;
;
;
class PlannerAgent {
    type = 'planner';
    async process(input) {
        const { user, goals, constraints, timeframe } = input;
        const reasoning = [];
        const originalInput = goals.join(' ');
        const forceCreate = input.forceCreate || false;
        try {
            // Step 1: Load memory context
            const memoryContext = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$memory$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["memoryService"].getUserContext(user.id);
            reasoning.push(`Loaded context: ${memoryContext.existingPlans.length} plans, ${memoryContext.existingTasks.length} tasks`);
            // Step 2: Check for duplicates/similar items (skip if forceCreate is true)
            let similarItems = [];
            if (!forceCreate) {
                similarItems = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$memory$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["memoryService"].findSimilarItems(originalInput, user.id, 0.7);
            }
            if (similarItems.length > 0) {
                const highestSimilarity = similarItems[0].similarity;
                reasoning.push(`Found ${similarItems.length} similar items (highest similarity: ${(highestSimilarity * 100).toFixed(0)}%)`);
                // If very similar (>= 0.9), suggest merge/update
                if (highestSimilarity >= 0.9) {
                    return {
                        result: {
                            plan: null,
                            tasks: [],
                            reasoning: [
                                `Duplicate detected: ${similarItems[0].item.title} (${(highestSimilarity * 100).toFixed(0)}% similar)`
                            ],
                            duplicateItems: similarItems,
                            requiresConfirmation: true
                        },
                        confidence: 0.9,
                        metadata: {
                            duplicateDetected: true,
                            similarItems: similarItems.map((item)=>({
                                    id: item.item.id,
                                    type: item.type,
                                    title: item.item.title,
                                    similarity: item.similarity,
                                    reason: item.reason
                                }))
                        }
                    };
                }
            }
            // Step 3: Get related context for enrichment
            const relatedContext = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$memory$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["memoryService"].getRelatedContext(originalInput, user.id);
            reasoning.push(`Found ${relatedContext.relatedPlans.length} related plans, ${relatedContext.relatedTasks.length} related tasks`);
            // Step 4: Use Gemini to generate plan title, description, and tasks
            const geminiService = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GeminiService"]();
            const prompt = geminiService.generatePrompt('planner', {
                goals,
                constraints,
                originalInput,
                timeframe: timeframe ? {
                    start: timeframe.start.toISOString(),
                    end: timeframe.end.toISOString()
                } : undefined,
                memoryContext: {
                    existingPlans: memoryContext.existingPlans.slice(0, 5),
                    relatedTasks: relatedContext.relatedTasks
                },
                similarItems: similarItems.slice(0, 3)
            });
            const geminiResponse = await geminiService.generateContent(prompt);
            let parsedResponse;
            try {
                parsedResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$utils$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseJsonFromGemini"])(geminiResponse);
            } catch (parseError) {
                console.error('Failed to parse Gemini response:', geminiResponse);
                throw new Error('Failed to parse AI response. Please try again.');
            }
            const { planTitle, planDescription, tasks: geminiTasks } = parsedResponse;
            if (!geminiTasks || !Array.isArray(geminiTasks)) {
                console.error('Invalid Gemini response structure:', parsedResponse);
                throw new Error('AI returned invalid task structure. Please try again.');
            }
            // Step 5: Build draft tasks (no persistence yet)
            const taskDrafts = this.buildTaskDraftsFromGemini(geminiTasks, goals, timeframe);
            // Step 6: Validate drafts pre-commit
            const validationResults = taskDrafts.map((draft)=>({
                    draft,
                    validation: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$validation$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validationService"].validateTaskInput({
                        task: draft,
                        existing: memoryContext.existingTasks,
                        projects: memoryContext.existingPlans
                    })
                }));
            const mergedValidation = this.mergeValidation(validationResults.map((v)=>v.validation));
            const hasBlocking = mergedValidation.issues.some((issue)=>issue.severity === 'error');
            const needsConfirmation = mergedValidation.requiresConfirmation || !input.confirm;
            if (hasBlocking || needsConfirmation) {
                reasoning.push(hasBlocking ? 'Validation blocked plan creation' : 'Validation requires user confirmation');
                return {
                    result: {
                        plan: null,
                        tasks: [],
                        reasoning,
                        requiresConfirmation: true,
                        validation: mergedValidation,
                        draftTasks: taskDrafts
                    },
                    confidence: hasBlocking ? 0.2 : 0.55,
                    metadata: {
                        validation: mergedValidation,
                        similarItemsFound: similarItems.length,
                        draftTaskCount: taskDrafts.length
                    }
                };
            }
            // Step 7: Persist plan and tasks after validation & confirmation
            const planId = await this.createPlan(user.id, goals, constraints, timeframe, planTitle || `${goals[0]} - Generated Plan`, planDescription || `Plan to achieve: ${goals.join(', ')}`);
            const plan = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["planRepo"].getById(planId);
            if (!plan) {
                return {
                    result: null,
                    confidence: 0,
                    metadata: {
                        error: 'Failed to create plan'
                    }
                };
            }
            const tasks = await this.createTasksFromDrafts(taskDrafts, plan.id);
            // Update plan with task IDs
            const taskIds = tasks.map((task)=>task.id);
            await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["planRepo"].update(plan.id, {
                tasks: taskIds
            });
            reasoning.push(`Generated plan title: "${plan.title}"`);
            reasoning.push(`Generated plan description: "${plan.description}"`);
            reasoning.push(`Analyzed ${goals.length} goals and created ${tasks.length} tasks using AI`);
            reasoning.push(`Estimated total effort: ${tasks.reduce((sum, task)=>sum + task.estimatedTime, 0)} minutes`);
            // Record agent output for reflection
            await this.recordAgentOutput(input, {
                plan,
                tasks,
                reasoning
            });
            return {
                result: {
                    plan,
                    tasks,
                    reasoning
                },
                confidence: 0.85,
                metadata: {
                    planId: plan.id,
                    taskCount: tasks.length,
                    similarItemsFound: similarItems.length,
                    validation: mergedValidation
                }
            };
        } catch (error) {
            console.error('Error in Planner agent:', error);
            console.error('Error stack:', error?.stack);
            console.error('Error message:', error?.message);
            return {
                result: null,
                confidence: 0,
                metadata: {
                    error: error?.message || 'Unknown error in planner agent',
                    errorDetails: error?.stack
                }
            };
        }
    }
    async createPlan(userId, goals, constraints, timeframe, title, description) {
        const plan = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["planRepo"].create({
            title: title || `${goals[0]} - Generated Plan`,
            description: description || `Plan to achieve: ${goals.join(', ')}`,
            status: 'draft',
            tasks: [],
            goal: goals[0],
            constraints: constraints || {},
            startDate: timeframe?.start,
            endDate: timeframe?.end
        });
        return plan.id;
    }
    buildTaskDraftsFromGemini(geminiTasks, goals, timeframe) {
        return geminiTasks.map((geminiTask, idx)=>({
                title: geminiTask.title || `Task ${idx + 1} for ${goals[0]}`,
                description: geminiTask.description || '',
                status: 'pending',
                priority: geminiTask.priority || 'medium',
                estimatedTime: geminiTask.estimatedTime || 30,
                focusLevel: geminiTask.focusLevel || 'medium',
                energyRequirement: geminiTask.energyRequirement || 'medium',
                context: geminiTask.context || '',
                subtasks: [],
                dependencies: geminiTask.dependencies || [],
                tags: geminiTask.tags || [],
                parentTaskId: undefined,
                kind: geminiTask.kind || 'todo',
                projectId: geminiTask.projectId ?? undefined,
                recurrencePerWeek: geminiTask.recurrencePerWeek ?? undefined,
                dueDate: geminiTask.dueDate ? new Date(geminiTask.dueDate) : timeframe?.end,
                isRecurring: geminiTask.isRecurring ?? undefined,
                recurrencePattern: geminiTask.recurrencePattern ?? undefined
            }));
    }
    async createTasksFromDrafts(drafts, planId) {
        const tasks = [];
        for (const draft of drafts){
            const task = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["taskRepo"].create({
                ...draft,
                parentTaskId: planId
            });
            tasks.push(task);
        }
        return tasks;
    }
    mergeValidation(validations) {
        if (!validations.length) {
            return {
                ok: true,
                requiresConfirmation: false,
                issues: [],
                summary: [
                    'Validation passed'
                ]
            };
        }
        const issues = validations.flatMap((v)=>v.issues || []);
        const ok = !issues.some((i)=>i.severity === 'error');
        const requiresConfirmation = issues.length > 0;
        const summary = validations.flatMap((v)=>v.summary || []);
        return {
            ok,
            requiresConfirmation,
            issues,
            summary
        };
    }
    async recordAgentOutput(input, output) {
        // Would store the agent output for reflection
        const { agentOutputRepo } = await __turbopack_context__.A("[project]/packages/data/src/index.ts [app-route] (ecmascript, async loader)");
        await agentOutputRepo.create({
            agentType: 'planner',
            input: input,
            output: output,
            confidence: 0.8
        });
    }
}
}),
"[project]/packages/agents/src/scheduler-agent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SchedulerAgent",
    ()=>SchedulerAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/data/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/data/src/repositories.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/services/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/gemini.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$validation$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/validation-service.ts [app-route] (ecmascript)");
;
;
class SchedulerAgent {
    type = 'scheduler';
    async process(input) {
        const { user, tasks, date, existingEvents, constraints } = input;
        const reasoning = [];
        try {
            // Try using Gemini for scheduling first
            const geminiService = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GeminiService"]();
            const prompt = geminiService.generatePrompt('scheduler', {
                date,
                energyProfile: user.preferences.energyProfile,
                existingEvents: existingEvents || [],
                constraints
            });
            try {
                const geminiResponse = await geminiService.generateContent(prompt);
                const { schedule: geminiSchedule } = JSON.parse(geminiResponse);
                // Convert Gemini response to our schedule
                const scheduledTasks = await this.createScheduledTasksFromGeminiResponse(geminiSchedule.tasks, tasks);
                // Pre-execution validation before persisting anything
                const validation = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$validation$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validationService"].validateSchedule({
                    tasks,
                    scheduled: scheduledTasks,
                    events: existingEvents || [],
                    user,
                    date
                });
                // Philosophy 2.1 & 5: Always summarize and require confirmation if issues or not explicitly confirmed
                const requiresConfirmation = validation.requiresConfirmation || !input.context?.confirmed;
                if (!validation.ok || requiresConfirmation && !input.context?.confirmed) {
                    reasoning.push(validation.ok ? 'Schedule requires user review' : 'Validation blocked schedule creation');
                    return {
                        result: {
                            schedule: null,
                            reasoning,
                            validation,
                            requiresConfirmation: true,
                            draftScheduledTasks: scheduledTasks,
                            summary: `Proposed schedule for ${date.toLocaleDateString()} with ${scheduledTasks.length} tasks. ${validation.issues.length} points for review.`
                        },
                        confidence: validation.ok ? 0.6 : 0.25,
                        metadata: {
                            validation,
                            scheduleId: null,
                            taskCount: scheduledTasks.length
                        }
                    };
                }
                const schedule = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scheduleRepo"].create({
                    date,
                    tasks: scheduledTasks,
                    notes: `AI scheduled on ${new Date().toLocaleDateString()}`,
                    energyProfile: user.preferences.energyProfile,
                    constraints: {
                        maxTasks: constraints?.maxDeepWorkSessions || 3,
                        maxDeepWorkSessions: constraints?.maxDeepWorkSessions || 2
                    },
                    validation,
                    userId: user.id
                });
                reasoning.push(`AI scheduled ${scheduledTasks.length} tasks for ${date.toLocaleDateString()}`);
                reasoning.push(`Total estimated work time: ${this.calculateTotalTime(scheduledTasks)} minutes`);
                if (validation.requiresConfirmation) {
                    reasoning.push('User confirmation recommended before committing schedule');
                }
                // Record agent output for reflection
                await this.recordAgentOutput(input, {
                    schedule,
                    reasoning
                });
                return {
                    result: {
                        schedule,
                        reasoning,
                        validation
                    },
                    confidence: 0.9,
                    metadata: {
                        scheduleId: schedule.id,
                        taskCount: scheduledTasks.length,
                        validation
                    }
                };
            } catch (geminiError) {
                console.warn('Gemini scheduling failed, using fallback:', geminiError);
                // Fallback to rule-based scheduling
                const scheduledTasks = await this.scheduleTasks(tasks, date, existingEvents || [], constraints);
                const validation = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$validation$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validationService"].validateSchedule({
                    tasks,
                    scheduled: scheduledTasks,
                    events: existingEvents || [],
                    user,
                    date
                });
                if (!validation.ok) {
                    reasoning.push('Validation blocked schedule creation');
                    return {
                        result: {
                            schedule: null,
                            reasoning,
                            validation
                        },
                        confidence: 0.25,
                        metadata: {
                            validation,
                            scheduleId: null,
                            taskCount: scheduledTasks.length
                        }
                    };
                }
                const schedule = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scheduleRepo"].create({
                    date,
                    tasks: scheduledTasks,
                    notes: `Fallback scheduled on ${new Date().toLocaleDateString()}`,
                    energyProfile: user.preferences.energyProfile,
                    constraints: {
                        maxTasks: constraints?.maxDeepWorkSessions || 3,
                        maxDeepWorkSessions: constraints?.maxDeepWorkSessions || 2
                    },
                    validation,
                    userId: user.id
                });
                reasoning.push(`Fallback scheduled ${scheduledTasks.length} tasks for ${date.toLocaleDateString()}`);
                reasoning.push(`Total estimated work time: ${this.calculateTotalTime(scheduledTasks)} minutes`);
                if (validation.requiresConfirmation) {
                    reasoning.push('User confirmation recommended before committing schedule');
                }
                return {
                    result: {
                        schedule,
                        reasoning
                    },
                    confidence: 0.6,
                    metadata: {
                        scheduleId: schedule.id,
                        taskCount: scheduledTasks.length,
                        validation
                    }
                };
            }
        } catch (error) {
            console.error('Error in Scheduler agent:', error);
            return {
                result: null,
                confidence: 0,
                metadata: {
                    error: error instanceof Error ? error.message : String(error)
                }
            };
        }
    }
    async scheduleTasks(tasks, date, existingEvents, constraints) {
        const scheduledTasks = [];
        // Sort tasks by priority
        const sortedTasks = tasks.sort((a, b)=>{
            const priorityOrder = {
                urgent: 0,
                high: 1,
                medium: 2,
                low: 3
            };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        let currentTime = this.getWorkStartTime(date);
        const workEndTime = this.getWorkEndTime(date);
        let deepWorkSessions = 0;
        const maxDeepWorkSessions = constraints?.maxDeepWorkSessions || 2;
        for (const task of sortedTasks){
            // Check if we can fit this task
            const taskEndTime = new Date(currentTime.getTime() + task.estimatedTime * 60000);
            if (taskEndTime > workEndTime) {
                continue;
            }
            // Check for deep work limit
            if (task.focusLevel === 'deep' && deepWorkSessions >= maxDeepWorkSessions) {
                continue;
            }
            // Check for conflicts with existing events
            if (this.hasConflict(currentTime, taskEndTime, existingEvents)) {
                // Find next available slot
                const nextSlot = this.findNextAvailableSlot(taskEndTime, workEndTime, existingEvents);
                if (!nextSlot) continue;
                currentTime = nextSlot;
            }
            if (task.focusLevel === 'deep') {
                deepWorkSessions++;
            }
            scheduledTasks.push({
                taskId: task.id,
                scheduledStart: new Date(currentTime),
                scheduledEnd: taskEndTime,
                status: 'scheduled'
            });
            // Add break time after task
            const breakTime = task.focusLevel === 'deep' ? 15 : 5;
            currentTime = new Date(taskEndTime.getTime() + breakTime * 60000);
        }
        return scheduledTasks;
    }
    getWorkStartTime(date) {
        const start = new Date(date);
        start.setHours(9, 0, 0, 0);
        return start;
    }
    getWorkEndTime(date) {
        const end = new Date(date);
        end.setHours(17, 0, 0, 0);
        return end;
    }
    hasConflict(start, end, events) {
        return events.some((event)=>start < new Date(event.end) && end > new Date(event.start));
    }
    findNextAvailableSlot(currentTime, workEndTime, events) {
        let slotStart = currentTime;
        while(slotStart < workEndTime){
            const conflict = events.find((event)=>slotStart < new Date(event.end) && slotStart > new Date(event.start));
            if (!conflict) return slotStart;
            slotStart = new Date(conflict.end);
        }
        return null;
    }
    calculateTotalTime(scheduledTasks) {
        return scheduledTasks.reduce((total, task)=>{
            const duration = task.scheduledEnd.getTime() - task.scheduledStart.getTime();
            return total + Math.ceil(duration / 60000);
        }, 0);
    }
    async createScheduledTasksFromGeminiResponse(geminiTasks, originalTasks) {
        const scheduledTasks = [];
        // Create a map for quick lookup
        const taskMap = new Map();
        for (const task of originalTasks){
            taskMap.set(task.id, task);
        }
        // Convert Gemini response to our scheduled tasks
        for (const geminiTask of geminiTasks){
            const scheduledTask = {
                taskId: geminiTask.taskId,
                scheduledStart: new Date(geminiTask.scheduledStart),
                scheduledEnd: new Date(geminiTask.scheduledEnd),
                status: 'scheduled'
            };
            scheduledTasks.push(scheduledTask);
        }
        return scheduledTasks;
    }
    async recordAgentOutput(input, output) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentOutputRepo"].create({
            agentType: 'scheduler',
            input: input,
            output: output,
            confidence: 0.85
        });
    }
}
}),
"[project]/packages/agents/src/prioritization-agent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PrioritizationAgent",
    ()=>PrioritizationAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/data/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/data/src/repositories.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/services/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/gemini.ts [app-route] (ecmascript)");
;
;
class PrioritizationAgent {
    type = 'prioritization';
    async process(input) {
        const { user, tasks, currentContext } = input;
        const reasoning = [];
        try {
            // Use Gemini to prioritize tasks
            const geminiService = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GeminiService"]();
            const prompt = geminiService.generatePrompt('prioritization', {
                tasks,
                currentContext
            });
            const geminiResponse = await geminiService.generateContent(prompt);
            let parsedResponse;
            try {
                parsedResponse = JSON.parse(geminiResponse);
            } catch (e) {
                // Handle markdown code blocks if present
                const { parseJsonFromGemini } = await __turbopack_context__.A("[project]/packages/utils/src/index.ts [app-route] (ecmascript, async loader)");
                parsedResponse = parseJsonFromGemini(geminiResponse);
            }
            const { tasks: geminiTasks, reasoning: geminiReasoning } = parsedResponse;
            // Convert Gemini response to our prioritized tasks
            const prioritizedTasks = await this.createPrioritizedTasksFromGeminiResponse(geminiTasks, tasks);
            const validation = this.validatePriorities(prioritizedTasks);
            // Philosophy 5: Pre-Execution Validation Layer
            const requiresConfirmation = validation.requiresConfirmation || !input.context?.confirmed;
            if (validation.issues.some((i)=>i.severity === 'error')) {
                return {
                    result: {
                        tasks: [],
                        reasoning: [
                            validation.summary[0]
                        ],
                        validation,
                        requiresConfirmation: true
                    },
                    confidence: 0.3,
                    metadata: {
                        validation,
                        taskCount: tasks.length
                    }
                };
            }
            // Sort tasks by priority score
            const sortedTasks = prioritizedTasks.sort((a, b)=>b.priorityScore - a.priorityScore);
            if (geminiReasoning) reasoning.push(...Array.isArray(geminiReasoning) ? geminiReasoning : [
                geminiReasoning
            ]);
            reasoning.push(`Prioritized ${tasks.length} tasks using AI analysis`);
            reasoning.push(`Highest priority: ${sortedTasks[0]?.title || 'None'}`);
            reasoning.push(`Context consideration: ${currentContext ? 'Applied' : 'Not available'}`);
            // Record agent output for reflection
            await this.recordAgentOutput(input, {
                tasks: sortedTasks,
                reasoning
            });
            // Ensure confirmation is required if issues exist, even if not explicitly confirmed
            const finalRequiresConfirmation = requiresConfirmation || validation.requiresConfirmation;
            return {
                result: {
                    tasks: sortedTasks,
                    reasoning,
                    validation,
                    requiresConfirmation: finalRequiresConfirmation,
                    summary: `Prioritized ${tasks.length} tasks. Top task: "${sortedTasks[0]?.title}".`
                },
                confidence: 0.9,
                metadata: {
                    taskCount: tasks.length,
                    contextConsidered: !!currentContext,
                    validation
                }
            };
        } catch (error) {
            console.error('Error in Prioritization agent:', error);
            // Fallback to rule-based prioritization
            const prioritizedTasks = await this.calculatePriorityScores(tasks, currentContext);
            const validation = this.validatePriorities(prioritizedTasks);
            if (!validation.ok) {
                return {
                    result: {
                        tasks: [],
                        reasoning,
                        validation
                    },
                    confidence: 0.25,
                    metadata: {
                        validation,
                        taskCount: tasks.length,
                        contextConsidered: !!currentContext
                    }
                };
            }
            const sortedTasks = prioritizedTasks.sort((a, b)=>b.priorityScore - a.priorityScore);
            reasoning.push(`Used rule-based prioritization as fallback`);
            return {
                result: {
                    tasks: sortedTasks,
                    reasoning
                },
                confidence: 0.6,
                metadata: {
                    taskCount: tasks.length,
                    contextConsidered: !!currentContext,
                    validation
                }
            };
        }
    }
    async calculatePriorityScores(tasks, currentContext) {
        const prioritizedTasks = [];
        for (const task of tasks){
            const factors = await this.calculatePriorityFactors(task, currentContext);
            const priorityScore = this.combinePriorityFactors(factors);
            prioritizedTasks.push({
                ...task,
                priority: this.mapScoreToPriority(priorityScore),
                priorityScore,
                factors
            });
        }
        return prioritizedTasks;
    }
    async calculatePriorityFactors(task, currentContext) {
        const factors = {
            deadlineImportance: this.calculateDeadlineImportance(task),
            longTermValue: this.calculateLongTermValue(task),
            requiredFocus: this.mapFocusLevel(task.focusLevel),
            energyCost: this.mapEnergyRequirement(task.energyRequirement),
            dependencyComplexity: this.calculateDependencyComplexity(task),
            userPreference: 0.5 // Default, would be personalized with data
        };
        // Adjust factors based on current context
        if (currentContext) {
            // If user has low energy, lower priority for high-energy tasks
            if (currentContext.currentEnergy === 'low' && factors.energyCost > 0.6) {
                factors.userPreference -= 0.3;
            }
            // If limited time, prioritize shorter tasks
            if (currentContext.availableTime < task.estimatedTime * 1.5) {
                factors.deadlineImportance -= 0.2;
            }
            // If location-specific tasks match current location, boost priority
            if (task.context !== 'anywhere' && task.context === currentContext.location) {
                factors.userPreference += 0.2;
            }
        }
        return factors;
    }
    calculateDeadlineImportance(task) {
        if (!task.dueDate) return 0.3; // No deadline = moderate importance
        const now = new Date();
        const dueDate = new Date(task.dueDate);
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilDue <= 0) return 1; // Overdue
        if (daysUntilDue <= 1) return 0.9; // Due today or tomorrow
        if (daysUntilDue <= 3) return 0.7; // Due this week
        if (daysUntilDue <= 7) return 0.5; // Due next week
        return 0.3; // More than a week away
    }
    calculateLongTermValue(task) {
        // Simple heuristic based on priority and tags
        let value = 0.5;
        if (task.priority === 'urgent' || task.priority === 'high') value += 0.3;
        if (task.tags.includes('important') || task.tags.includes('strategic')) value += 0.3;
        if (task.tags.includes('maintenance') || task.tags.includes('admin')) value -= 0.2;
        return Math.min(1, Math.max(0, value));
    }
    mapFocusLevel(focusLevel) {
        switch(focusLevel){
            case 'shallow':
                return 0.3;
            case 'medium':
                return 0.5;
            case 'deep':
                return 0.8;
            default:
                return 0.5;
        }
    }
    mapEnergyRequirement(energy) {
        switch(energy){
            case 'low':
                return 0.2;
            case 'medium':
                return 0.5;
            case 'high':
                return 0.8;
            default:
                return 0.5;
        }
    }
    calculateDependencyComplexity(task) {
        const dependencyCount = task.dependencies.length + task.subtasks.length;
        if (dependencyCount === 0) return 0.1;
        if (dependencyCount === 1) return 0.3;
        if (dependencyCount <= 3) return 0.5;
        if (dependencyCount <= 5) return 0.7;
        return 0.9;
    }
    combinePriorityFactors(factors) {
        // Weighted combination of factors
        const weightedFactors = [
            {
                factor: factors.deadlineImportance,
                weight: 0.25
            },
            {
                factor: factors.longTermValue,
                weight: 0.20
            },
            {
                factor: factors.requiredFocus,
                weight: 0.15
            },
            {
                factor: 1 - factors.energyCost,
                weight: 0.15
            },
            {
                factor: 1 - factors.dependencyComplexity,
                weight: 0.10
            },
            {
                factor: factors.userPreference,
                weight: 0.15
            }
        ];
        return weightedFactors.reduce((sum, { factor, weight })=>sum + factor * weight, 0);
    }
    mapScoreToPriority(score) {
        if (score >= 0.8) return 'urgent';
        if (score >= 0.6) return 'high';
        if (score >= 0.4) return 'medium';
        return 'low';
    }
    validatePriorities(tasks) {
        // Warn if tasks lack due dates or if urgent tasks exceed 6 per day
        const issues = [];
        const urgentCount = tasks.filter((t)=>t.priority === 'urgent').length;
        if (urgentCount > 6) {
            issues.push({
                code: 'too_many_urgent',
                severity: 'warn',
                message: `There are ${urgentCount} urgent tasks; this may be unrealistic.`
            });
        }
        tasks.forEach((t)=>{
            if (!t.dueDate) {
                issues.push({
                    code: 'missing_due_date',
                    severity: 'warn',
                    message: `Task "${t.title}" has no due date; prioritize with caution.`,
                    relatedIds: [
                        t.id
                    ]
                });
            }
        });
        const ok = !issues.some((i)=>i.severity === 'error');
        const summary = issues.length ? [
            `${issues.filter((i)=>i.severity === 'warn').length} warning(s) detected`
        ] : [
            'Validation passed'
        ];
        return {
            ok,
            requiresConfirmation: issues.length > 0,
            issues,
            summary
        };
    }
    async createPrioritizedTasksFromGeminiResponse(geminiTasks, originalTasks) {
        const prioritizedTasks = [];
        // Create a map for quick lookup
        const taskMap = new Map();
        for (const task of originalTasks){
            taskMap.set(task.id, task);
        }
        // Convert Gemini response to our prioritized tasks
        for (const geminiTask of geminiTasks){
            const originalTask = taskMap.get(geminiTask.id);
            if (!originalTask) continue;
            // Create priority factors for this task
            const factors = await this.calculatePriorityFactors(originalTask);
            prioritizedTasks.push({
                ...originalTask,
                priority: geminiTask.priority,
                priorityScore: geminiTask.priorityScore,
                factors
            });
        }
        // If any tasks weren't included in Gemini response, add them with default priority
        for (const task of originalTasks){
            if (!prioritizedTasks.some((pt)=>pt.id === task.id)) {
                const factors = await this.calculatePriorityFactors(task);
                prioritizedTasks.push({
                    ...task,
                    priority: 'medium',
                    priorityScore: 0.5,
                    factors
                });
            }
        }
        return prioritizedTasks;
    }
    async recordAgentOutput(input, output) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentOutputRepo"].create({
            agentType: 'prioritizer',
            input: input,
            output: output,
            confidence: 0.9
        });
    }
}
}),
"[project]/packages/agents/src/execution-agent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExecutionAgent",
    ()=>ExecutionAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/data/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/data/src/repositories.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/services/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/gemini.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$validation$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/validation-service.ts [app-route] (ecmascript)");
;
;
class ExecutionAgent {
    type = 'execution';
    async process(input) {
        const { user, currentTask, progress, nextSteps } = input;
        const reasoning = [];
        try {
            // Pre-flight: ensure task has time context
            const validation = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$validation$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validationService"].validateTaskInput({
                task: currentTask,
                existing: await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["taskRepo"].getAll()
            });
            if (!validation.ok) {
                return {
                    result: {
                        nextStep: null,
                        context: {
                            relatedTasks: [],
                            blockers: [],
                            resources: []
                        },
                        suggestions: validation.summary ?? []
                    },
                    confidence: 0.2,
                    metadata: {
                        validation
                    }
                };
            }
            // Try using Gemini for guidance first
            const geminiService = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GeminiService"]();
            const prompt = geminiService.generatePrompt('execution', {
                currentTask,
                progress,
                nextSteps
            });
            try {
                const geminiResponse = await geminiService.generateContent(prompt);
                let executionOutput;
                try {
                    executionOutput = JSON.parse(geminiResponse);
                } catch (e) {
                    const { parseJsonFromGemini } = await __turbopack_context__.A("[project]/packages/utils/src/index.ts [app-route] (ecmascript, async loader)");
                    executionOutput = parseJsonFromGemini(geminiResponse);
                }
                // Philosophy 2.1: Explain consequences and identifying blockers
                reasoning.push(`AI analyzed task: ${currentTask.title}`);
                reasoning.push(`Identified ${executionOutput.context?.blockers?.length || 0} potential blockers`);
                reasoning.push(`Next step: ${executionOutput.nextStep?.action || 'Review task'} (${executionOutput.nextStep?.estimatedTime || 0} minutes)`);
                // Record agent output for reflection
                await this.recordAgentOutput(input, {
                    nextStep: executionOutput.nextStep,
                    context: executionOutput.context,
                    suggestions: executionOutput.suggestions
                });
                return {
                    result: {
                        nextStep: executionOutput.nextStep,
                        context: executionOutput.context,
                        suggestions: executionOutput.suggestions,
                        summary: `Translating intent for "${currentTask.title}": Next action is ${executionOutput.nextStep?.action}.`
                    },
                    confidence: 0.85,
                    metadata: {
                        taskId: currentTask.id,
                        blockersFound: executionOutput.context?.blockers?.length || 0,
                        relatedTasksFound: executionOutput.context?.relatedTasks?.length || 0
                    }
                };
            } catch (geminiError) {
                console.warn('Gemini execution guidance failed, using fallback:', geminiError);
                // Fallback to rule-based guidance
                // Find related tasks that might provide context
                const relatedTasks = await this.findRelatedTasks(currentTask);
                // Identify blockers
                const blockers = await this.identifyBlockers(currentTask);
                // Determine the next step
                const nextStep = this.determineNextStep(currentTask, progress, nextSteps);
                // Get resources that might be helpful
                const resources = this.identifyResources(currentTask, blockers);
                reasoning.push(`Analyzed task: ${currentTask.title}`);
                reasoning.push(`Used fallback guidance`);
                // Record agent output for reflection
                await this.recordAgentOutput(input, {
                    nextStep,
                    context: {
                        relatedTasks,
                        blockers,
                        resources
                    },
                    suggestions: this.generateSuggestions(currentTask, blockers)
                });
                return {
                    result: {
                        nextStep,
                        context: {
                            relatedTasks,
                            blockers,
                            resources
                        },
                        suggestions: this.generateSuggestions(currentTask, blockers)
                    },
                    confidence: nextStep ? 0.6 : 0.3,
                    metadata: {
                        taskId: currentTask.id,
                        blockersFound: blockers.length,
                        relatedTasksFound: relatedTasks.length
                    }
                };
            }
        } catch (error) {
            console.error('Error in Execution agent:', error);
            return {
                result: null,
                confidence: 0,
                metadata: {
                    error: error instanceof Error ? error.message : String(error)
                }
            };
        }
    }
    async findRelatedTasks(currentTask) {
        // Find tasks with similar tags, same parent/child relationships, or dependencies
        const allTasks = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["taskRepo"].getAll();
        return allTasks.filter((task)=>{
            // Skip the current task itself
            if (task.id === currentTask.id) return false;
            // Check for shared tags
            const hasSharedTags = task.tags.some((tag)=>currentTask.tags.includes(tag));
            // Check for dependencies
            const hasDependency = task.dependencies.includes(currentTask.id) || currentTask.dependencies.includes(task.id);
            // Check for parent/child relationships
            const hasRelationship = task.parentTaskId === currentTask.id || currentTask.parentTaskId === task.id;
            return hasSharedTags || hasDependency || hasRelationship;
        });
    }
    async identifyBlockers(currentTask) {
        const blockers = [];
        // Check if task depends on incomplete tasks
        if (currentTask.dependencies.length > 0) {
            for (const depId of currentTask.dependencies){
                const depTask = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["taskRepo"].getById(depId);
                if (depTask && depTask.status !== 'completed') {
                    blockers.push(`Dependency task not completed: ${depTask.title}`);
                }
            }
        }
        // Check if task is blocked by context (e.g., requires being at work)
        if (currentTask.context === 'work') {
            blockers.push('This task requires being at work');
        }
        // Check if task requires resources that might not be available
        if (currentTask.tags.includes('collaboration')) {
            blockers.push('This task requires collaboration - make sure team members are available');
        }
        if (currentTask.focusLevel === 'deep' && currentTask.estimatedTime > 120) {
            blockers.push('This task requires a long deep work session - ensure you have focused time');
        }
        return blockers;
    }
    determineNextStep(task, progress, nextSteps) {
        // If task hasn't started, first step is to begin
        if (task.status === 'pending') {
            return {
                action: 'Start working on this task',
                instructions: `Begin with ${this.getFirstStep(task)}`,
                estimatedTime: Math.min(15, task.estimatedTime)
            };
        }
        // If task is in progress and we have predefined steps
        if (task.status === 'in-progress' && nextSteps && nextSteps.length > 0) {
            const completedSteps = progress?.completedSteps || [];
            const remainingSteps = nextSteps.filter((step)=>!completedSteps.includes(step));
            if (remainingSteps.length > 0) {
                const nextStep = remainingSteps[0];
                return {
                    action: `Continue with: ${nextStep}`,
                    instructions: `Focus on completing ${nextStep}`,
                    estimatedTime: Math.min(30, task.estimatedTime / remainingSteps.length)
                };
            }
        }
        // If all steps completed or no steps defined, suggest completing the task
        return {
            action: 'Finish and mark task as complete',
            instructions: 'Review your work and mark the task as complete',
            estimatedTime: 5
        };
    }
    getFirstStep(task) {
        // Simple heuristic for first step based on task type
        if (task.tags.includes('research')) {
            return 'research and information gathering';
        }
        if (task.tags.includes('implementation')) {
            return 'setting up your development environment';
        }
        if (task.tags.includes('writing')) {
            return 'outlining your main points';
        }
        return 'setting up your workspace';
    }
    identifyResources(task, blockers) {
        const resources = [];
        // Add context-specific resources
        if (task.tags.includes('research')) {
            resources.push('Note-taking tool', 'Reference materials', 'Bookmark tool');
        }
        if (task.tags.includes('implementation') || task.tags.includes('coding')) {
            resources.push('Code editor', 'Documentation', 'Version control');
        }
        if (task.tags.includes('collaboration')) {
            resources.push('Communication tool', 'Shared workspace', 'Meeting scheduler');
        }
        if (task.focusLevel === 'deep') {
            resources.push('Focus app/website blocker', 'Noise-cancelling headphones');
        }
        // Add resources for blockers
        blockers.forEach((blocker)=>{
            if (blocker.includes('collaboration')) {
                resources.push('Team contact list');
            }
            if (blocker.includes('deep_work')) {
                resources.push('Time blocking tool');
            }
        });
        return [
            ...new Set(resources)
        ]; // Remove duplicates
    }
    generateSuggestions(task, blockers) {
        const suggestions = [];
        if (task.status === 'pending') {
            suggestions.push('Start with a small, concrete step to build momentum');
        }
        if (blockers.length > 0) {
            suggestions.push('Address any blockers before continuing');
            suggestions.push('Consider if the task can be simplified to avoid blockers');
        }
        if (task.estimatedTime > 120) {
            suggestions.push('Consider breaking this into smaller subtasks');
            suggestions.push('schedule multiple sessions for this task');
        }
        if (task.focusLevel === 'deep') {
            suggestions.push('Make sure you have adequate time and low interruption for this task');
            suggestions.push('Consider scheduling during your peak energy hours');
        }
        return suggestions;
    }
    async recordAgentOutput(input, output) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentOutputRepo"].create({
            agentType: 'execution',
            input: input,
            output: output,
            confidence: 0.75
        });
    }
}
}),
"[project]/packages/agents/src/reflection-agent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReflectionAgent",
    ()=>ReflectionAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/data/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/data/src/repositories.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/services/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/gemini.ts [app-route] (ecmascript)");
;
;
class ReflectionAgent {
    type = 'reflection';
    async process(input) {
        const { user, tasks, completionHistory, userFeedback } = input;
        const reasoning = [];
        try {
            // Try using Gemini for reflection first
            const geminiService = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GeminiService"]();
            const prompt = geminiService.generatePrompt('reflection', {
                tasks,
                completionHistory,
                userFeedback
            });
            try {
                const geminiResponse = await geminiService.generateContent(prompt);
                let reflectionOutput;
                try {
                    reflectionOutput = JSON.parse(geminiResponse);
                } catch (e) {
                    const { parseJsonFromGemini } = await __turbopack_context__.A("[project]/packages/utils/src/index.ts [app-route] (ecmascript, async loader)");
                    reflectionOutput = parseJsonFromGemini(geminiResponse);
                }
                reasoning.push(`AI analyzed ${completionHistory.length} task completions`);
                reasoning.push(`Identified ${reflectionOutput.insights?.patterns?.length || 0} behavioral patterns`);
                // Record agent output for future analysis
                await this.recordAgentOutput(input, reflectionOutput);
                return {
                    result: {
                        insights: reflectionOutput.insights,
                        recommendations: reflectionOutput.recommendations,
                        summary: `Reflection complete: Identified ${reflectionOutput.insights?.patterns?.length || 0} patterns and ${reflectionOutput.recommendations?.length || 0} advisory recommendations.`
                    },
                    confidence: 0.9,
                    metadata: {
                        patternsFound: reflectionOutput.insights?.patterns?.length || 0,
                        adjustmentsIdentified: reflectionOutput.insights?.adjustments?.length || 0
                    }
                };
            } catch (geminiError) {
                console.warn('Gemini reflection analysis failed, using fallback:', geminiError);
                // Fallback to rule-based analysis
                // Analyze completion patterns
                const patterns = this.analyzePatterns(completionHistory);
                // Generate insights and recommendations
                const insights = {
                    patterns,
                    adjustments: await this.identifyAdjustments(patterns, userFeedback, tasks)
                };
                const recommendations = this.generateRecommendations(patterns, insights.adjustments);
                reasoning.push(`Fallback analyzed ${completionHistory.length} task completions`);
                reasoning.push(`Identified ${patterns.length} behavioral patterns`);
                // Record agent output for future analysis
                await this.recordAgentOutput(input, {
                    insights,
                    recommendations
                });
                return {
                    result: {
                        insights,
                        recommendations
                    },
                    confidence: 0.6,
                    metadata: {
                        patternsFound: patterns.length,
                        adjustmentsIdentified: insights.adjustments.length
                    }
                };
            }
        } catch (error) {
            console.error('Error in Reflection agent:', error);
            return {
                result: null,
                confidence: 0,
                metadata: {
                    error: error instanceof Error ? error.message : String(error)
                }
            };
        }
    }
    analyzePatterns(completionHistory) {
        const patterns = [];
        // Check for time estimation patterns
        const timeAccuracy = completionHistory.map((h)=>h.actualTime / h.plannedTime);
        const avgTimeAccuracy = timeAccuracy.reduce((sum, accuracy)=>sum + accuracy, 0) / timeAccuracy.length;
        if (avgTimeAccuracy > 1.5) {
            patterns.push('Consistently underestimates task duration');
        } else if (avgTimeAccuracy < 0.8) {
            patterns.push('Consistently overestimates task duration');
        } else {
            patterns.push('Generally accurate time estimation');
        }
        // Check for energy patterns
        const highEnergyTasks = completionHistory.filter((h)=>{
            // In a real implementation, would look up task quality
            return h.quality === 'excellent'; // High quality work tends to happen during peak energy
        });
        if (highEnergyTasks.length / completionHistory.length > 0.7) {
            patterns.push('Performs well on high-energy tasks');
        }
        // Check for task type patterns
        const tagGroups = this.groupByTags(completionHistory);
        for (const [tag, completions] of Object.entries(tagGroups)){
            if (completions.length < 2) continue;
            const avgQuality = completions.reduce((sum, c)=>sum + (c.quality === 'excellent' ? 2 : c.quality === 'good' ? 1 : 0), 0) / completions.length;
            const avgAccuracy = completions.reduce((sum, c)=>sum + c.actualTime / c.plannedTime, 0) / completions.length;
            if (avgQuality > 1.5) {
                patterns.push(`Strong performer on ${tag} tasks`);
            }
            if (avgAccuracy > 1.3) {
                patterns.push(`Underestimates ${tag} task duration`);
            }
        }
        // Check for procrastination patterns
        const delayedTasks = completionHistory.filter((h)=>{
            // Would check if task was completed after due date
            return false; // Placeholder logic
        });
        if (delayedTasks.length / completionHistory.length > 0.3) {
            patterns.push('Frequently delays task completion');
        }
        return patterns;
    }
    groupByTags(completionHistory) {
        const groups = {};
        // This is a simplified version - would need to look up actual task details
        // For now, we'll create some example groups
        const researchTasks = completionHistory.slice(0, Math.floor(completionHistory.length / 3));
        const implementationTasks = completionHistory.slice(Math.floor(completionHistory.length / 3), Math.floor(completionHistory.length * 2 / 3));
        const otherTasks = completionHistory.slice(Math.floor(completionHistory.length * 2 / 3));
        if (researchTasks.length > 0) groups['research'] = researchTasks;
        if (implementationTasks.length > 0) groups['implementation'] = implementationTasks;
        if (otherTasks.length > 0) groups['other'] = otherTasks;
        return groups;
    }
    async identifyAdjustments(patterns, userFeedback, tasks) {
        const adjustments = [];
        // Time estimation adjustments
        if (patterns.includes('Consistently underestimates task duration')) {
            adjustments.push({
                type: 'time',
                before: 'Current time estimation approach',
                after: 'Increase estimate by 50% and track actual vs planned time',
                reason: 'Tasks consistently take longer than expected'
            });
        }
        if (patterns.includes('Consistently overestimates task duration')) {
            adjustments.push({
                type: 'time',
                before: 'Current time estimation approach',
                after: 'Reduce estimate by 25% and break into smaller milestones',
                reason: 'Tasks consistently completed faster than expected'
            });
        }
        // Energy-related adjustments
        if (patterns.includes('Performs well on high-energy tasks')) {
            adjustments.push({
                type: 'energy',
                before: 'Mixed task scheduling',
                after: 'Schedule high-focus work during peak energy hours and low-focus tasks elsewhere',
                reason: 'Performance is better when matching task energy requirements to personal energy levels'
            });
        }
        // Priority adjustments
        if (userFeedback && userFeedback.some((feedback)=>feedback.difficulty === 'too-hard')) {
            adjustments.push({
                type: 'priority',
                before: 'Current task prioritization',
                after: 'Break complex tasks earlier and give more time for preparation',
                reason: 'Some tasks are perceived as too difficult without proper preparation'
            });
        }
        // Process adjustments
        if (patterns.includes('Frequently delays task completion')) {
            adjustments.push({
                type: 'process',
                before: 'Current planning process',
                after: 'Add more frequent check-ins and break large tasks into smaller steps',
                reason: 'Delaying completion suggests tasks seem overwhelming or not urgent enough'
            });
        }
        return adjustments;
    }
    generateRecommendations(patterns, adjustments) {
        const recommendations = [];
        if (patterns.includes('Consistently underestimates task duration')) {
            recommendations.push('Start tracking actual vs. planned time for all tasks to improve estimation');
            recommendations.push('Add 20-50% buffer time to all task estimates');
        }
        if (patterns.includes('Performs well on high-energy tasks')) {
            recommendations.push('Schedule your most challenging work during your peak energy hours');
            recommendations.push('Save low-energy tasks for when your energy is lower');
        }
        if (patterns.includes('Frequently delays task completion')) {
            recommendations.push('Break down complex tasks into smaller, more manageable chunks');
            recommendations.push('Set up regular check-ins to stay on track');
        }
        if (adjustments.some((adj)=>adj.type === 'priority')) {
            recommendations.push('Re-evaluate your task prioritization method');
            recommendations.push('Consider using the Eisenhower matrix (urgent/important) for better focus');
        }
        // General recommendations
        recommendations.push('Review your task completion patterns weekly');
        recommendations.push('Adjust your planning approach based on actual completion data');
        return recommendations;
    }
    async recordAgentOutput(input, output) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentOutputRepo"].create({
            agentType: 'reflection',
            input: input,
            output: output,
            confidence: 0.85
        });
    }
}
}),
"[project]/packages/agents/src/router-agent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RouterAgent",
    ()=>RouterAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/services/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/services/src/gemini.ts [app-route] (ecmascript)");
;
class RouterAgent {
    type = 'router';
    geminiService;
    constructor(){
        this.geminiService = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$services$2f$src$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GeminiService"]();
    }
    async process(input) {
        const { input: userInput } = input;
        try {
            const classification = await this.classifyInput(userInput);
            return {
                result: classification,
                confidence: classification.confidence,
                metadata: {
                    inputType: classification.type,
                    reasoning: classification.reasoning
                }
            };
        } catch (error) {
            console.error('Error in Router agent:', error);
            return {
                result: {
                    type: 'question',
                    confidence: 0.5,
                    reasoning: 'Failed to classify input, defaulting to question'
                },
                confidence: 0.5,
                metadata: {
                    error: error instanceof Error ? error.message : String(error)
                }
            };
        }
    }
    async classifyInput(input) {
        const prompt = `You are a intent classification AI for a productivity system. Your goal is to translate user input into the correct system operation.

Philosophy:
- AI as a translator, not an authority.
- Identify intent accurately to preserve trust.
- Be conservative if ambiguous and classify as "question" to trigger clarification.

Analyze the following user input and classify it into one of these categories:
1. "task" - A single actionable item (e.g., "Buy groceries", "Call John", "Finish report")
2. "plan" - A multi-step goal or project (e.g., "Build a website", "Plan a vacation", "Learn Spanish")
3. "note" - Information to remember (e.g., "John's phone number is 555-1234", "Meeting moved to Friday")
4. "reminder" - A time-based alert (e.g., "Remind me to call mom tomorrow", "Set reminder for dentist appointment")
5. "question" - A question or ambiguous command that needs clarification (e.g., "What tasks do I have today?", "How do I prioritize?")

User Input: "${input}"

Analyze the intent and content. Consider:
- Single action vs multiple steps
- Time references (reminders)
- Question words (what, how, when, why)
- Information storage vs action items

Return your response as JSON:
{
  "type": "task" | "plan" | "note" | "reminder" | "question",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation of classification",
  "suggestedAction": "what should happen next"
}`;
        try {
            const response = await this.geminiService.generateContent(prompt);
            let result;
            try {
                result = JSON.parse(response);
            } catch (e) {
                const { parseJsonFromGemini } = await __turbopack_context__.A("[project]/packages/utils/src/index.ts [app-route] (ecmascript, async loader)");
                result = parseJsonFromGemini(response);
            }
            return {
                type: result.type || 'question',
                confidence: result.confidence || 0.5,
                reasoning: result.reasoning || 'Classification completed',
                suggestedAction: result.suggestedAction
            };
        } catch (error) {
            console.error('Error classifying input:', error);
            // Fallback classification
            return this.fallbackClassification(input);
        }
    }
    fallbackClassification(input) {
        const inputLower = input.toLowerCase();
        // Check for question words
        if (/\b(what|how|when|where|why|who|which|can|could|should|would|is|are|do|does|did)\b/i.test(input)) {
            return {
                type: 'question',
                confidence: 0.7,
                reasoning: 'Contains question words',
                suggestedAction: 'Route to chat agent'
            };
        }
        // Check for reminder keywords
        if (/\b(remind|reminder|alert|notify|remember to)\b/i.test(input)) {
            return {
                type: 'reminder',
                confidence: 0.8,
                reasoning: 'Contains reminder keywords',
                suggestedAction: 'Create reminder'
            };
        }
        // Check for plan indicators (multiple steps, project words)
        if (/\b(plan|project|build|create|develop|learn|study|prepare|organize)\b/i.test(input) || input.split(/\s+/).length > 10) {
            return {
                type: 'plan',
                confidence: 0.7,
                reasoning: 'Contains plan indicators or is lengthy',
                suggestedAction: 'Route to planner agent'
            };
        }
        // Check for note indicators
        if (/\b(note|remember|save|store|info|information|phone|email|address)\b/i.test(input)) {
            return {
                type: 'note',
                confidence: 0.7,
                reasoning: 'Contains note indicators',
                suggestedAction: 'Store as note'
            };
        }
        // Default to task
        return {
            type: 'task',
            confidence: 0.6,
            reasoning: 'Single actionable item',
            suggestedAction: 'Create task'
        };
    }
}
}),
"[project]/packages/agents/src/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Export base agent types
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$agents$2f$src$2f$base$2d$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/agents/src/base-agent.ts [app-route] (ecmascript)");
// Export all agent implementations
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$agents$2f$src$2f$planner$2d$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/agents/src/planner-agent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$agents$2f$src$2f$scheduler$2d$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/agents/src/scheduler-agent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$agents$2f$src$2f$prioritization$2d$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/agents/src/prioritization-agent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$agents$2f$src$2f$execution$2d$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/agents/src/execution-agent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$agents$2f$src$2f$reflection$2d$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/agents/src/reflection-agent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$agents$2f$src$2f$router$2d$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/agents/src/router-agent.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
}),
"[project]/apps/web/apps/web/app/api/agents/planner/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$6_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.28.6_babel-plugin-react-compiler@1.0.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$agents$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/agents/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$agents$2f$src$2f$planner$2d$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/agents/src/planner-agent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/data/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/data/src/repositories.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        const { goals, constraints, timeframe, forceCreate } = await request.json();
        // Get or create default user
        const userId = request.headers.get('x-user-id') || 'default-user';
        let user = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userRepo"].getById(userId);
        // Create default user if doesn't exist
        if (!user) {
            // Create default user with fixed ID
            user = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$data$2f$src$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userRepo"].create({
                name: 'Default User',
                email: 'user@example.com',
                preferences: {
                    workingHours: [],
                    energyProfile: {
                        peakHours: [],
                        mediumHours: [],
                        lowHours: [],
                        recoveryTime: 15
                    },
                    taskBreakingPreference: 'automatic',
                    schedulingStyle: 'flexible',
                    notificationSettings: {
                        taskReminders: true,
                        scheduleChanges: true,
                        dailySummary: true
                    }
                }
            }, userId); // Use the userId as the ID
        }
        const plannerAgent = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$agents$2f$src$2f$planner$2d$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PlannerAgent"]();
        const result = await plannerAgent.process({
            user,
            goals,
            constraints,
            timeframe: timeframe ? {
                start: new Date(timeframe.start),
                end: new Date(timeframe.end)
            } : undefined,
            forceCreate: forceCreate || false
        });
        // If duplicate detected, return with metadata for frontend handling
        if (result.metadata?.duplicateDetected) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$6_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ...result,
                requiresConfirmation: true
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$6_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result);
    } catch (error) {
        console.error('Error in planner agent API:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$6_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error?.message || 'Internal server error',
            details: error?.stack
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3481542b._.js.map