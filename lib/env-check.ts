/**
 * lib/env-check.ts
 * ============================================================================
 * STARTUP ENVIRONMENT VALIDATION
 * 
 * This module validates that all critical environment variables are present
 * at application startup. It should be imported early in the application
 * lifecycle (e.g., in a root layout or API middleware).
 * 
 * In production/CI, missing critical variables will cause the app to exit.
 * In development, it will log warnings but continue.
 */

interface EnvCheckResult {
  success: boolean;
  missing: string[];
  warnings: string[];
}

/**
 * Critical environment variables that MUST be present in production
 */
const CRITICAL_ENV_VARS = [
  'DATABASE_URL',
  'TRACKINGMORE_API_KEY',
  'SESSION_SECRET',
] as const;

/**
 * Optional but recommended environment variables
 */
const RECOMMENDED_ENV_VARS = [
  'MAMAN_USERNAME',
  'MAMAN_PASSWORD',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'NEXT_PUBLIC_SITE_URL',
] as const;

/**
 * Check if a specific environment variable is set and valid
 */
function isEnvVarValid(key: string): boolean {
  const value = process.env[key];
  
  // Check if exists and not empty
  if (!value || value.trim() === '') {
    return false;
  }
  
  // Check for placeholder values that should be replaced
  const placeholders = [
    'your_',
    'change_this',
    'replace_me',
    'example',
  ];
  
  const lowerValue = value.toLowerCase();
  if (placeholders.some(placeholder => lowerValue.includes(placeholder))) {
    return false;
  }
  
  return true;
}

/**
 * Validate all environment variables
 */
export function checkEnvironmentVariables(): EnvCheckResult {
  const missing: string[] = [];
  const warnings: string[] = [];
  
  // Check critical variables
  for (const envVar of CRITICAL_ENV_VARS) {
    if (!isEnvVarValid(envVar)) {
      missing.push(envVar);
    }
  }
  
  // Check recommended variables
  for (const envVar of RECOMMENDED_ENV_VARS) {
    if (!isEnvVarValid(envVar)) {
      warnings.push(envVar);
    }
  }
  
  return {
    success: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Display environment check results and exit if critical vars are missing
 */
export function validateEnvironmentOrExit(): void {
  // Skip validation in test environments or if explicitly disabled
  if (process.env.NODE_ENV === 'test' || process.env.SKIP_ENV_VALIDATION === 'true') {
    return;
  }
  
  const result = checkEnvironmentVariables();
  const isProduction = process.env.NODE_ENV === 'production';
  const isCI = process.env.CI === 'true';
  
  // Display missing critical variables
  if (result.missing.length > 0) {
    console.error('\n❌ CRITICAL: Missing required environment variables:');
    result.missing.forEach(envVar => {
      console.error(`   - ${envVar}`);
    });
    console.error('\n📝 Please check .env.example for required configuration.');
    
    // Exit in production or CI
    if (isProduction || isCI) {
      console.error('\n🛑 Exiting due to missing critical environment variables in production/CI.\n');
      process.exit(1);
    } else {
      console.warn('\n⚠️  WARNING: Application may not function correctly without these variables.\n');
    }
  }
  
  // Display warnings for recommended variables
  if (result.warnings.length > 0 && !isProduction) {
    console.warn('\n⚠️  Optional but recommended environment variables not set:');
    result.warnings.forEach(envVar => {
      console.warn(`   - ${envVar}`);
    });
    console.warn('\n📝 Some features may be limited. Check .env.example for details.\n');
  }
  
  // Success message
  if (result.missing.length === 0 && result.warnings.length === 0) {
    console.log('✅ All environment variables validated successfully');
  }
}

/**
 * Get a safe summary of environment configuration (for debugging)
 * Never logs actual values, only presence/absence
 */
export function getEnvironmentSummary(): Record<string, boolean> {
  const summary: Record<string, boolean> = {};
  
  [...CRITICAL_ENV_VARS, ...RECOMMENDED_ENV_VARS].forEach(envVar => {
    summary[envVar] = isEnvVarValid(envVar);
  });
  
  return summary;
}

/**
 * Export environment variable lists for documentation/testing
 */
export const ENV_VAR_LISTS = {
  critical: CRITICAL_ENV_VARS,
  recommended: RECOMMENDED_ENV_VARS,
} as const;

// Auto-validate on server-side import (but not during build)
if (typeof window === 'undefined' && !process.env.SKIP_ENV_VALIDATION) {
  // Only validate after Next.js build is complete
  // This prevents errors during `next build`
  if (process.env.NEXT_PHASE !== 'phase-production-build') {
    validateEnvironmentOrExit();
  }
}
