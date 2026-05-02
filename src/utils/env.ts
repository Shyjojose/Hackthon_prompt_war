/**
 * Environment variable validation utility
 * Ensures required configuration is present at app startup
 * Fails fast if critical env vars are missing
 */

/**
 * Get required environment variable or throw error
 * @param key - Environment variable key
 * @returns The environment variable value
 * @throws Error if the variable is missing or contains placeholder text
 */
export const getRequiredEnv = (key: string): string => {
  const value = (import.meta.env as Record<string, string>)[key];
  
  if (!value) {
    throw new Error(
      `[Security] Required environment variable missing: ${key}. ` +
      `Please check your .env file and .env.example for required variables.`
    );
  }
  
  // Detect placeholder values
  if (typeof value === 'string' && (
    value.includes('placeholder') || 
    value.includes('your_') || 
    value === ''
  )) {
    throw new Error(
      `[Security] Environment variable has placeholder value: ${key}. ` +
      `Please set a real value in your .env file.`
    );
  }
  
  return value;
};

/**
 * Get optional environment variable or return default
 * @param key - Environment variable key
 * @param defaultValue - Default value if not found
 * @returns The environment variable value or default
 */
export const getOptionalEnv = (key: string, defaultValue: string = ''): string => {
  const value = (import.meta.env as Record<string, string>)[key];
  return (value && !String(value).includes('placeholder')) ? String(value) : defaultValue;
};

/**
 * Validate all critical Firebase variables on app startup
 * Call this from your main.tsx or App.tsx useEffect
 */
export const validateFirebaseConfig = (): void => {
  try {
    const required = ['VITE_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_AUTH_DOMAIN'];
    const missing: string[] = [];

    required.forEach(key => {
      try {
        getRequiredEnv(key);
      } catch {
        missing.push(key);
      }
    });

    if (missing.length > 0) {
      console.warn(
        `⚠️ [Config] Firebase environment incomplete. Demo mode will be used. ` +
        `Missing: ${missing.join(', ')}`
      );
    } else {
      console.info('✅ [Config] Firebase configuration validated');
    }
  } catch (error) {
    console.error('❌ [Config] Critical configuration error:', error);
    throw error;
  }
};

/**
 * Validate all critical API variables on app startup
 */
export const validateAPIConfig = (): void => {
  const apis = ['VITE_GEMINI_API_KEY', 'VITE_GOOGLE_MAPS_API_KEY'];
  const missing: string[] = [];

  apis.forEach(key => {
    try {
      getOptionalEnv(key);
    } catch {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    console.warn(
      `⚠️ [Config] External APIs not configured. ` +
      `App will use demo/fallback mode. Missing: ${missing.join(', ')}`
    );
  } else {
    console.info('✅ [Config] All API keys configured');
  }
};
