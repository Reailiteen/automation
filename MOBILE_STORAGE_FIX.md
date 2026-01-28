# Mobile Storage Fix - React Native AsyncStorage

## Problem

React Native cannot use Node.js `fs` module (file system), which caused the error:
```
You attempted to import the Node standard library module "fs" from "packages/data/src/storage.ts"
```

## Solution

Created a **platform-specific storage adapter** that uses:
- **Node.js `fs`** for web app (server-side)
- **AsyncStorage** for mobile app (React Native)

Both implementations provide the **exact same API**, so repositories and agents work identically on both platforms!

## What Was Created

### 1. `packages/data/src/storage.native.ts`
- React Native storage implementation using AsyncStorage
- Matches the exact API of `storage.ts` (Node.js version)
- Methods: `getAll()`, `byId()`, `save()`, `delete()`, etc.

### 2. Updated `packages/data/package.json`
Added React Native resolution:
```json
{
  "react-native": {
    "./src/storage": "./src/storage.native"
  },
  "peerDependencies": {
    "@react-native-async-storage/async-storage": "*"
  }
}
```

This tells React Native bundlers to use `storage.native.ts` instead of `storage.ts`.

### 3. Updated `apps/mobile/package.json`
Added AsyncStorage dependency:
```json
{
  "dependencies": {
    "@react-native-async-storage/async-storage": "^2.1.0"
  }
}
```

## How It Works

### Automatic Platform Detection
The React Native bundler (Metro) automatically detects the platform and uses the right storage:

**Web App (Next.js):**
```typescript
import { taskStorage } from '@automation/data';
// Uses: packages/data/src/storage.ts (Node.js fs)
```

**Mobile App (React Native):**
```typescript
import { taskStorage } from '@automation/data';
// Uses: packages/data/src/storage.native.ts (AsyncStorage)
```

### Same API, Different Implementation

Both storage implementations expose identical APIs:

```typescript
// taskStorage API (works on both platforms)
taskStorage.getAll()           // Get all tasks
taskStorage.byId(id)           // Get task by ID
taskStorage.save(task)         // Save/update task
taskStorage.delete(id)         // Delete task
taskStorage.byPlan(planId)     // Get tasks by plan
```

### Data Storage Locations

**Web App:**
- Development: `data/tasks.json`, `data/plans.json`, etc.
- Serverless: `/tmp/automation-data/`
- Production: Supabase (future)

**Mobile App:**
- All environments: AsyncStorage
- Keys: `@automation:tasks`, `@automation:plans`, etc.
- Persistent across app restarts
- Separate from web app data

## Benefits

1. **Zero Code Changes**: Repositories and agents work unchanged
2. **Type Safety**: Same TypeScript types across platforms
3. **Consistent API**: Same method signatures everywhere
4. **Platform Optimized**: Uses best storage for each platform
5. **Testable**: Easy to mock for testing

## Testing

The mobile app should now:
- ✅ Load without fs module error
- ✅ Create and save tasks
- ✅ Use PlannerAgent to create plans
- ✅ Store data in AsyncStorage
- ✅ Persist data across app restarts

Try running:
```bash
cd apps/mobile
pnpm start
# Press 'i' for iOS or 'a' for Android
```

## Future: Shared Storage

If you want web and mobile to share the same data, you can:
1. Implement Supabase storage adapter (for both platforms)
2. Or sync AsyncStorage with web backend via API

Both options work with the current architecture - just create a new storage implementation!

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│         @automation/data Package            │
├─────────────────────────────────────────────┤
│                                             │
│  storage.ts          storage.native.ts      │
│  (Node.js fs)        (AsyncStorage)         │
│       │                     │               │
│       └──────┬──────────────┘               │
│              │                              │
│         repositories.ts                     │
│  (taskRepo, planRepo, etc.)                 │
│              │                              │
└──────────────┼──────────────────────────────┘
               │
      ┌────────┴────────┐
      │                 │
  Web App          Mobile App
  (uses fs)     (uses AsyncStorage)
```

## Conclusion

The data layer is now **truly platform-agnostic**! Same business logic, same repositories, same agents - just different storage backends based on the platform.
