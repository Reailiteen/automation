const fs = require('fs');
const path = require('path');

// Load .env file from root directory (two levels up)
const envPath = path.join(__dirname, '../../.env');
const envConfig = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    // Skip comments and empty lines
    if (line.trim() && !line.trim().startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length) {
        const value = valueParts.join('=').trim();
        envConfig[key.trim()] = value;
      }
    }
  });
  console.log('✅ Loaded environment variables from .env');
} else {
  console.warn('⚠️  .env file not found at', envPath);
}

module.exports = {
  expo: {
    name: 'AI Task Manager',
    slug: 'automation-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#0a0a0a',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.automation.mobile',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#0a0a0a',
      },
      package: 'com.automation.mobile',
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      // Expose environment variables to the app
      GEMINI_API_KEY: envConfig.GEMINI_API_KEY,
      GROQ_API_KEY: envConfig.GROQ_API_KEY,
      NEXT_PUBLIC_SUPABASE_URL: envConfig.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: envConfig.SUPABASE_SERVICE_ROLE_KEY,
      CLICKUP_API_KEY: envConfig.CLICKUP_API_KEY,
    },
  },
};
