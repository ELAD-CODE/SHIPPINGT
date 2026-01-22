/**
 * Environment Variables Validation
 * Checks that all critical environment variables are present
 * Fails fast with exit(1) if any required var is missing
 */

require('dotenv').config();

const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'TRACKINGMORE_API_KEY',
  'SESSION_SECRET'
];

const OPTIONAL_ENV_VARS = [
  'MAMAN_USERNAME',
  'MAMAN_PASSWORD',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'S3_BUCKET',
  'NODE_ENV',
  'PORT'
];

function validateEnvironment() {
  console.log('🔍 Validating environment variables...');
  
  const missing = [];
  const warnings = [];

  // Check required variables
  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      missing.push(varName);
    } else {
      console.log(`  ✓ ${varName}`);
    }
  }

  // Check optional variables (warnings only)
  for (const varName of OPTIONAL_ENV_VARS) {
    if (!process.env[varName]) {
      warnings.push(varName);
    }
  }

  // Report results
  if (missing.length > 0) {
    console.error('\n❌ CRITICAL: Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`  ✗ ${varName}`);
    });
    console.error('\nPlease set these variables in your .env file.');
    console.error('See .env.example for reference.\n');
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  Optional environment variables not set:');
    warnings.forEach(varName => {
      console.warn(`  - ${varName}`);
    });
    console.warn('Some features may not be available.\n');
  }

  console.log('✅ Environment validation passed!\n');
  return true;
}

// Run validation
if (require.main === module) {
  validateEnvironment();
}

module.exports = { validateEnvironment };
