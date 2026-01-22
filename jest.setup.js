// jest.setup.js
import '@testing-library/jest-dom'

// Set test environment variables with obviously fake test-only values
process.env.SKIP_ENV_VALIDATION = 'true'
process.env.DATABASE_URL = 'postgresql://TEST_USER:TEST_PASS@localhost:5432/TEST_DB_DO_NOT_USE'
process.env.TRACKINGMORE_API_KEY = 'TEST_API_KEY_DO_NOT_USE_IN_PRODUCTION'
process.env.SESSION_SECRET = 'TEST_SESSION_SECRET_ONLY_FOR_TESTS_DO_NOT_USE'
process.env.NODE_ENV = 'test'
