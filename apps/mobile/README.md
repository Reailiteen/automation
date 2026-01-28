# Mobile App - React Native

React Native mobile app for the AI Task Manager that shares ALL business logic with the web app.

## Architecture

This mobile app uses a **monorepo architecture** where all business logic, types, and services are shared between web and mobile:

```
/packages/
  ├── @automation/types      - Shared TypeScript types (Task, Project, Plan, etc.)
  ├── @automation/data       - Data storage layer (repositories, storage)
  ├── @automation/agents     - AI agents (PlannerAgent, SchedulerAgent, etc.)
  ├── @automation/services   - External services (Gemini AI, memory, pressure)
  ├── @automation/auth       - Supabase authentication
  └── @automation/utils      - Utility functions

/apps/
  ├── web/                   - Next.js web app (UI only)
  └── mobile/                - React Native app (UI only)
```

## Key Benefits

1. **Zero Code Duplication**: All business logic is in `/packages` and imported by both apps
2. **Type Safety**: Shared TypeScript types ensure consistency
3. **Same Data**: Both apps use the same repositories and storage layer
4. **Same AI**: Both apps use the same AI agents and services
5. **Easy Maintenance**: Fix bugs once, benefits both platforms

## Development

```bash
# From root directory
pnpm install

# Start mobile app
cd apps/mobile
pnpm start

# Run on iOS
pnpm ios

# Run on Android
pnpm android
```

## How It Works

The mobile app imports shared packages just like the web app:

```typescript
import { Task } from '@automation/types';
import { taskRepo } from '@automation/data';
import { PlannerAgent } from '@automation/agents';

// Use the exact same business logic as web app
const tasks = await taskRepo.getAll();
const agent = new PlannerAgent();
const result = await agent.process(input);
```

## What's Shared

- **Types**: Task, Project, Plan, User, Schedule, EnergyProfile, etc.
- **Data Layer**: taskRepo, projectRepo, planRepo, userRepo, etc.
- **AI Agents**: PlannerAgent, SchedulerAgent, PrioritizationAgent, etc.
- **Services**: GeminiService, memoryService, pressureService
- **Auth**: Supabase authentication
- **Utils**: Utility functions like parseJsonFromGemini

## What's Different

Only the UI layer is platform-specific:
- **Web**: Next.js, React, Tailwind CSS
- **Mobile**: React Native, Expo, native components

Everything else is 100% shared!

## Next Steps

1. Add React Navigation for multi-screen app
2. Create mobile-specific UI components
3. Add voice input capability
4. Implement push notifications
5. Add offline support
6. Mirror web app features in mobile UI
