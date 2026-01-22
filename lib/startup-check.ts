/**
 * lib/startup-check.ts
 * Validates required environment variables at application startup
 * Exits with code 1 if any critical variables are missing
 */

interface EnvCheck {
  name: string;
  required: boolean;
  description: string;
  validate?: (value: string) => boolean;
}

const REQUIRED_ENV_VARS: EnvCheck[] = [
  {
    name: 'DATABASE_URL',
    required: true,
    description: 'PostgreSQL connection string',
    validate: (value) => value.startsWith('postgresql://') || value.startsWith('postgres://'),
  },
  {
    name: 'TRACKINGMORE_API_KEY',
    required: true,
    description: 'TrackingMore API key for shipment tracking',
    validate: (value) => value.length >= 10,
  },
  {
    name: 'SESSION_SECRET',
    required: true,
    description: 'Secret for session encryption',
    validate: (value) => value.length >= 32,
  },
  {
    name: 'NODE_ENV',
    required: false,
    description: 'Application environment (development/production)',
  },
];

const OPTIONAL_ENV_VARS: EnvCheck[] = [
  {
    name: 'MAMAN_USERNAME',
    required: false,
    description: 'Maman Online API username (optional)',
  },
  {
    name: 'MAMAN_PASSWORD',
    required: false,
    description: 'Maman Online API password (optional)',
  },
  {
    name: 'AWS_ACCESS_KEY_ID',
    required: false,
    description: 'AWS access key for deployment (optional in dev)',
  },
  {
    name: 'AWS_SECRET_ACCESS_KEY',
    required: false,
    description: 'AWS secret key for deployment (optional in dev)',
  },
  {
    name: 'S3_BUCKET',
    required: false,
    description: 'S3 bucket for document storage (optional)',
  },
];

export class StartupCheckError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StartupCheckError';
  }
}

/**
 * Check if an environment variable is set and valid
 */
function checkEnvVar(check: EnvCheck): { valid: boolean; error?: string } {
  const value = process.env[check.name];

  if (!value || value.trim() === '') {
    if (check.required) {
      return {
        valid: false,
        error: `Missing required environment variable: ${check.name}`,
      };
    }
    return { valid: true }; // Optional and not set
  }

  // Run custom validation if provided
  if (check.validate && !check.validate(value)) {
    return {
      valid: false,
      error: `Invalid value for ${check.name}: validation failed`,
    };
  }

  return { valid: true };
}

/**
 * Perform startup environment checks
 * @param exitOnError If true, exits process on error. If false, throws error.
 */
export function performStartupChecks(exitOnError: boolean = true): void {
  console.log('🔍 Performing startup environment checks...\n');

  const errors: string[] = [];
  const warnings: string[] = [];
  const success: string[] = [];

  // Check required variables
  console.log('Required Environment Variables:');
  for (const check of REQUIRED_ENV_VARS) {
    const result = checkEnvVar(check);
    if (!result.valid) {
      errors.push(result.error!);
      console.log(`  ❌ ${check.name} - ${result.error}`);
    } else {
      success.push(check.name);
      console.log(`  ✅ ${check.name} - OK`);
    }
  }

  // Check optional variables (warnings only)
  console.log('\nOptional Environment Variables:');
  for (const check of OPTIONAL_ENV_VARS) {
    const value = process.env[check.name];
    if (!value || value.trim() === '') {
      warnings.push(`${check.name} not set (optional)`);
      console.log(`  ⚠️  ${check.name} - Not set (optional)`);
    } else {
      console.log(`  ✅ ${check.name} - OK`);
    }
  }

  // Production-specific checks
  if (process.env.NODE_ENV === 'production') {
    console.log('\n🔒 Production Environment Checks:');
    
    // In production, SESSION_SECRET must not be default
    const sessionSecret = process.env.SESSION_SECRET;
    if (sessionSecret === 'default-dev-secret-change-in-production') {
      errors.push('SESSION_SECRET must be changed in production');
      console.log('  ❌ SESSION_SECRET - Using default value in production!');
    }

    // Warn if AWS credentials are not set in production
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      warnings.push('AWS credentials not set in production');
      console.log('  ⚠️  AWS credentials - Not configured');
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Startup Check Summary:');
  console.log(`  ✅ Success: ${success.length} required variables OK`);
  console.log(`  ⚠️  Warnings: ${warnings.length} optional issues`);
  console.log(`  ❌ Errors: ${errors.length} critical issues`);
  console.log('='.repeat(60) + '\n');

  // Handle errors
  if (errors.length > 0) {
    const errorMessage = [
      '❌ STARTUP CHECK FAILED!',
      '',
      'Critical environment variables are missing or invalid:',
      ...errors.map(e => `  - ${e}`),
      '',
      'Please ensure all required environment variables are set.',
      'See .env.example for reference.',
      '',
      'Application cannot start.',
    ].join('\n');

    console.error(errorMessage);

    if (exitOnError) {
      process.exit(1);
    } else {
      throw new StartupCheckError(errorMessage);
    }
  }

  // Print warnings if any
  if (warnings.length > 0) {
    console.warn('⚠️  Warnings (non-critical):');
    warnings.forEach(w => console.warn(`  - ${w}`));
    console.warn('');
  }

  console.log('✅ Startup checks passed! Application can start.\n');
}

/**
 * Get status of all environment variables
 */
export function getEnvStatus(): {
  required: Record<string, boolean>;
  optional: Record<string, boolean>;
} {
  const required: Record<string, boolean> = {};
  const optional: Record<string, boolean> = {};

  for (const check of REQUIRED_ENV_VARS) {
    const value = process.env[check.name];
    required[check.name] = !!(value && value.trim() !== '');
  }

  for (const check of OPTIONAL_ENV_VARS) {
    const value = process.env[check.name];
    optional[check.name] = !!(value && value.trim() !== '');
  }

  return { required, optional };
}

// Run checks automatically when imported (server-side only)
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'test') {
  // Skip during Next.js build process
  if (!process.env.SKIP_ENV_VALIDATION) {
    performStartupChecks(true);
  }
}
