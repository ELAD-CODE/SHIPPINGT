/**
 * lib/validateEnv.ts
 * ============================================================================
 * STARTUP ENVIRONMENT VALIDATION
 * 
 * This module validates critical environment variables at startup.
 * If any required variable is missing in production, the application will
 * exit with code 1 to prevent running with misconfiguration.
 * 
 * Usage:
 *   Import this file early in your application startup (e.g., in next.config.js)
 *   or call validateEnvironment() explicitly.
 */

interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * List of critical environment variables required for production
 */
const REQUIRED_ENV_VARS_PRODUCTION = [
  'DATABASE_URL',
  'TRACKINGMORE_API_KEY',
  'SESSION_SECRET',
];

/**
 * List of environment variables that should not use default values in production
 */
const NO_DEFAULTS_IN_PRODUCTION = [
  { key: 'SESSION_SECRET', badValues: ['default-dev-secret-change-in-production'] },
];

/**
 * List of recommended but optional environment variables
 */
const RECOMMENDED_ENV_VARS = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'MAMAN_USERNAME',
  'SENTRY_DSN',
];

/**
 * Validates environment variables
 */
export function validateEnvironment(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const isProduction = process.env.NODE_ENV === 'production';

  // Check required variables in production
  if (isProduction) {
    for (const varName of REQUIRED_ENV_VARS_PRODUCTION) {
      if (!process.env[varName]) {
        errors.push(`❌ Missing required environment variable: ${varName}`);
      }
    }

    // Check for default values that shouldn't be used in production
    for (const { key, badValues } of NO_DEFAULTS_IN_PRODUCTION) {
      const value = process.env[key];
      if (value && badValues.includes(value)) {
        errors.push(
          `❌ ${key} is using a default development value. Please set a production secret!`
        );
      }
    }
  }

  // Check recommended variables (warnings only)
  for (const varName of RECOMMENDED_ENV_VARS) {
    if (!process.env[varName]) {
      warnings.push(`⚠️  Recommended environment variable not set: ${varName}`);
    }
  }

  // Validate DATABASE_URL format if present
  if (process.env.DATABASE_URL) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
      errors.push(
        `❌ DATABASE_URL must start with 'postgresql://' or 'postgres://', got: ${dbUrl.substring(0, 20)}...`
      );
    }
  }

  // Validate TRACKINGMORE_API_KEY format if present
  if (process.env.TRACKINGMORE_API_KEY) {
    const apiKey = process.env.TRACKINGMORE_API_KEY;
    if (apiKey.length < 10) {
      errors.push(`❌ TRACKINGMORE_API_KEY appears invalid (too short)`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates environment and exits if invalid in production
 */
export function validateEnvironmentOrExit(): void {
  // Skip validation during build or if explicitly disabled
  if (process.env.SKIP_ENV_VALIDATION === 'true') {
    console.log('ℹ️  Environment validation skipped (SKIP_ENV_VALIDATION=true)');
    return;
  }

  const result = validateEnvironment();

  // Always show warnings
  if (result.warnings.length > 0) {
    console.warn('\n⚠️  Environment Warnings:');
    result.warnings.forEach((warning) => console.warn(`  ${warning}`));
  }

  // Show errors and exit in production, or if there are critical errors
  if (!result.isValid) {
    console.error('\n❌ Environment Validation Failed:');
    result.errors.forEach((error) => console.error(`  ${error}`));

    if (process.env.NODE_ENV === 'production') {
      console.error('\n🚫 Cannot start application with invalid environment in production.');
      console.error('📝 Please check .env.example for required variables.\n');
      process.exit(1);
    } else {
      console.warn('\n⚠️  Running in development mode with invalid environment.');
      console.warn('📝 Some features may not work correctly.\n');
    }
  } else {
    console.log('✅ Environment validation passed');
  }
}

// Auto-validate on module load (server-side only, not during Next.js build)
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'test') {
  // Only validate if not in build process
  if (!process.env.NEXT_PHASE || process.env.NEXT_PHASE === 'phase-production-server') {
    validateEnvironmentOrExit();
  }
}

export default validateEnvironment;
