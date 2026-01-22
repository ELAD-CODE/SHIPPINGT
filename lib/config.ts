/**
 * lib/config.ts
 * ============================================================================
 * CENTRALIZED CONFIGURATION MANAGEMENT
 * 
 * This module:
 * 1. Validates all environment variables at startup
 * 2. Provides typed configuration object
 * 3. Applies defaults where appropriate
 * 4. Fails fast with clear errors if misconfigured
 * 5. Serves as single source of truth for all config
 * 
 * Usage:
 *   import { config } from '@/lib/config'
 *   const apiKey = config.trackingmore.apiKey
 */

// For production, consider using: npm install zod dotenv-cli
// import { z } from 'zod'

// For now, using manual validation (no external deps)
// In production, use Zod for strictness

class ConfigValidationError extends Error {
  constructor(message: string) {
    super(`❌ Configuration Error: ${message}`)
    this.name = 'ConfigValidationError'
  }
}

// Helper function to safely get and validate env vars
function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key]
  if (!value && defaultValue === undefined) {
    throw new ConfigValidationError(`Missing required environment variable: ${key}`)
  }
  return value || defaultValue || ''
}

function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key]
  if (!value) return defaultValue
  return value.toLowerCase() === 'true' || value === '1'
}

function getEnvNumber(key: string, defaultValue?: number): number {
  const value = process.env[key]
  if (!value) {
    if (defaultValue === undefined) {
      throw new ConfigValidationError(`Missing required environment variable: ${key}`)
    }
    return defaultValue
  }
  const num = parseInt(value, 10)
  if (isNaN(num)) {
    throw new ConfigValidationError(`${key} must be a valid number, got: ${value}`)
  }
  return num
}

// Validate DATABASE_URL format
function validateDatabaseUrl(url: string): void {
  if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
    throw new ConfigValidationError(
      `DATABASE_URL must start with 'postgresql://' or 'postgres://', got: ${url.substring(0, 20)}...`
    )
  }
}

// Validate URL format
function validateUrl(url: string, name: string): void {
  try {
    new URL(url)
  } catch {
    throw new ConfigValidationError(`${name} must be a valid URL, got: ${url}`)
  }
}

// Main config object
export const config = {
  // ==== Application Core ====
  app: {
    name: 'Shipment Tracking Israel',
    version: '2.0.0',
    env: (process.env.NODE_ENV || 'development') as 'development' | 'production',
    siteUrl: (() => {
      const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      validateUrl(url, 'NEXT_PUBLIC_SITE_URL')
      return url
    })(),
    appEnv: (process.env.NEXT_PUBLIC_APP_ENV || 'development') as 'development' | 'production',
    port: getEnvNumber('PORT', 3000),
    isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },

  // ==== Database ====
  database: {
    url: (() => {
      const url = getEnv('DATABASE_URL')
      validateDatabaseUrl(url)
      return url
    })(),
    connectionTimeout: getEnvNumber('DATABASE_CONNECTION_TIMEOUT', 30000),
    poolMin: getEnvNumber('DATABASE_POOL_MIN', 2),
    poolMax: getEnvNumber('DATABASE_POOL_MAX', 20),
  },

  // ==== TrackingMore API ====
  trackingmore: {
    apiKey: (() => {
      const key = getEnv('TRACKINGMORE_API_KEY')
      if (key.length < 10) {
        throw new ConfigValidationError('TRACKINGMORE_API_KEY seems invalid (too short)')
      }
      return key
    })(),
    timeout: getEnvNumber('TRACKINGMORE_API_TIMEOUT', 10000),
    retries: getEnvNumber('TRACKINGMORE_API_RETRIES', 2),
    rateLimitDelay: getEnvNumber('TRACKINGMORE_RATE_LIMIT_DELAY', 100),
    baseUrl: 'https://api.trackingmore.com', // Could be env var for flexibility
  },

  // ==== SeaRates Maritime API (Optional) ====
  searates: {
    enabled: getEnvBoolean('FEATURE_MARITIME_TRACKING', true),
    apiKey: getEnv('SEARATES_API_KEY', ''),
    timeout: getEnvNumber('SEARATES_API_TIMEOUT', 15000),
    retries: getEnvNumber('SEARATES_API_RETRIES', 2),
    baseUrl: 'https://api.searates.com',
  },

  // ==== Redis (Optional, for caching & rate limiting) ====
  redis: {
    enabled: getEnvBoolean('FEATURE_REDIS_ENABLED', false),
    restUrl: getEnv('UPSTASH_REDIS_REST_URL', ''),
    restToken: getEnv('UPSTASH_REDIS_REST_TOKEN', ''),
    cacheTtlDefault: getEnvNumber('REDIS_CACHE_TTL_DEFAULT', 3600),
    cacheTtlTracking: getEnvNumber('REDIS_CACHE_TTL_TRACKING', 1800),
  },

  // ==== Rate Limiting ====
  rateLimit: {
    requestsPerMinute: getEnvNumber('RATE_LIMIT_REQUESTS_PER_MINUTE', 60),
    burstSize: getEnvNumber('RATE_LIMIT_BURST_SIZE', 100),
    windowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 60000),
  },

  // ==== Logging & Monitoring ====
  logging: {
    level: (process.env.LOG_LEVEL || 'info') as 'error' | 'warn' | 'info' | 'debug' | 'trace',
    sentryDsn: process.env.SENTRY_DSN || '',
    sentryEnvironment: process.env.SENTRY_ENVIRONMENT || 'development',
    sentryTracingSampleRate: parseFloat(process.env.SENTRY_TRACING_SAMPLE_RATE || '0.1'),
  },

  // ==== Security ====
  security: {
    sessionSecret: (() => {
      const secret = getEnv('SESSION_SECRET', 'dev-secret-do-not-use-in-production-replace-me')
      const isProduction = process.env.NODE_ENV === 'production'
      if (isProduction && (secret === 'dev-secret-do-not-use-in-production-replace-me' || secret.includes('REPLACE_WITH'))) {
        throw new ConfigValidationError('SESSION_SECRET must be set to a real value in production')
      }
      return secret
    })(),
    allowedOrigins: (() => {
      const origins = process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001'
      return origins.split(',').map(o => o.trim())
    })(),
    webhookSecret: getEnv('WEBHOOK_SECRET', ''),
  },

  // ==== Feature Flags ====
  features: {
    hebrewUi: getEnvBoolean('FEATURE_HEBREW_UI', true),
    terminalStorageCalc: getEnvBoolean('FEATURE_TERMINAL_STORAGE_CALC', true),
    awbAutoDetection: getEnvBoolean('FEATURE_AWB_AUTO_DETECTION', true),
    maritimeTracking: getEnvBoolean('FEATURE_MARITIME_TRACKING', true),
    analytics: getEnvBoolean('FEATURE_ANALYTICS', false),
  },

  // ==== Analytics ====
  analytics: {
    enabled: getEnvBoolean('NEXT_PUBLIC_ANALYTICS_ENABLED', false),
    id: process.env.NEXT_PUBLIC_ANALYTICS_ID || '',
  },

  // ==== Email ====
  email: {
    from: process.env.EMAIL_FROM || 'noreply@shipmenttracking.net',
    // Add SMTP config if needed
  },
}

// Validate critical config on load
export function validateConfig(): void {
  try {
    // Force evaluation of all getters
    const checks = [
      config.app.siteUrl,
      config.database.url,
      config.trackingmore.apiKey,
      config.security.sessionSecret,
    ]
    console.log('✅ Configuration validated successfully')
  } catch (error) {
    if (error instanceof ConfigValidationError) {
      console.error(error.message)
      process.exit(1)
    }
    throw error
  }
}

// Export type for type safety
export type Config = typeof config

// Validate on module load if not in build process
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'test') {
  // Only validate on server side, not during Next.js build
  if (!process.env.SKIP_ENV_VALIDATION) {
    validateConfig()
  }
}

export default config
