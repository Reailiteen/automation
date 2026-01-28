# Environment Variables Fix - React Native

## Problem

React Native doesn't automatically load `.env` files or provide `process.env` access like Node.js does. The error appeared:
```
ERROR  GEMINI_API_KEY is not set in environment variables
```

## Solution

Created a **platform-agnostic environment variable system** that works across both web and mobile:

### 1. Created `app.config.js` for Mobile
Loads environment variables from root `.env` file and exposes them via Expo Constants:

```javascript
// apps/mobile/app.config.js
const envPath = path.join(__dirname, '../../.env');
// Reads .env file and parses it
// Exposes vars via expo.extra
```

### 2. Created Platform-Agnostic Env Helper
`packages/services/src/env.ts` provides unified API:

```typescript
export function getEnv(key: string): string | undefined {
  // React Native: uses Expo Constants
  if (expoConstants?.expoConfig?.extra) {
    return expoConstants.expoConfig.extra[key];
  }
  // Node.js: uses process.env
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
}
```

### 3. Updated Services to Use Env Helper
Changed `packages/services/src/gemini.ts`:

**Before:**
```typescript
this.apiKey = process.env.GEMINI_API_KEY || '';
```

**After:**
```typescript
import { getEnv } from './env';
this.apiKey = getEnv('GEMINI_API_KEY') || '';
```

### 4. Installed Dependencies
```bash
pnpm add expo-constants
```

## How It Works

### Web App (Next.js)
- Reads `.env` file automatically via Next.js
- `process.env.GEMINI_API_KEY` works natively
- Services use `getEnv()` which falls back to `process.env`

### Mobile App (React Native)
- `app.config.js` reads root `.env` at build time
- Exposes vars via `expo.extra` config
- Services use `getEnv()` which reads from `expo-constants`

## Environment Variables Exposed

All vars from `.env` are now available in mobile:
- `GEMINI_API_KEY` - Google Gemini AI API key
- `GROQ_API_KEY` - Groq API key
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `CLICKUP_API_KEY` - ClickUp integration key

## Using Environment Variables

### In Any Package
```typescript
import { getEnv, requireEnv } from '@automation/services';

// Optional variable
const apiKey = getEnv('GEMINI_API_KEY');

// Required variable (throws if not set)
const requiredKey = requireEnv('GEMINI_API_KEY');
```

### In Mobile-Specific Code
```typescript
import Constants from 'expo-constants';

const apiKey = Constants.expoConfig?.extra?.GEMINI_API_KEY;
```

## Security Notes

1. **Never commit `.env` to git** - It's in `.gitignore`
2. **Mobile builds include env vars** - They're bundled in the app
3. **Use Supabase RLS** - Protect sensitive operations server-side
4. **Rotate keys regularly** - Especially for production apps

## Testing

The mobile app should now:
- ✅ Load Gemini API key from .env
- ✅ Initialize GeminiService successfully
- ✅ Use AI agents (PlannerAgent, etc.)
- ✅ Create plans and tasks via chat

Try it:
```bash
cd apps/mobile
pnpm start
# Press 'i' for iOS or 'a' for Android
# Try creating a task via chat!
```

## Troubleshooting

### "Environment variable not found"
1. Check `.env` file exists in project root
2. Restart Metro bundler (`pnpm start`)
3. Clear cache: `expo start --clear`

### "Failed to read .env"
- Ensure `.env` is two levels up from mobile app: `../../.env`
- Check file permissions

### Variables not updating
- Restart Expo dev server after changing `.env`
- Rebuild app if using native build

## Architecture Diagram

```
┌────────────────────────────────────┐
│        Root /.env File             │
│  GEMINI_API_KEY=xxx                │
│  GROQ_API_KEY=yyy                  │
└────────────┬───────────────────────┘
             │
      ┌──────┴──────┐
      │             │
  Web App      Mobile App
      │             │
process.env   app.config.js
      │       (reads .env)
      │             │
      │      expo.extra
      │             │
      └──────┬──────┘
             │
    @automation/services
         getEnv()
             │
    ┌────────┴────────┐
    │                 │
Gemini Service   Other Services
```

## Benefits

1. **Single Source of Truth** - One `.env` file for all apps
2. **Type Safe** - TypeScript support via helper functions
3. **Platform Agnostic** - Same API works everywhere
4. **Development Friendly** - Easy to update and test
5. **Secure** - Keys not hardcoded in source

## Future Improvements

1. Use environment-specific configs (dev, staging, prod)
2. Implement secure key storage (Expo SecureStore)
3. Load from remote config service (Firebase Remote Config)
4. Add runtime env var validation with Zod

## Conclusion

Environment variables now work seamlessly across web and mobile platforms with a unified API!
