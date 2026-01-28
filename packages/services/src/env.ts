// Platform-agnostic environment variable access
// Works in both Node.js (web) and React Native (mobile)

let expoConstants: any = null;

// Try to import expo-constants if we're in React Native
try {
  expoConstants = require('expo-constants').default;
} catch (e) {
  // Not in React Native environment, will use process.env
}

export function getEnv(key: string): string | undefined {
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

export function requireEnv(key: string): string {
  const value = getEnv(key);
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}
