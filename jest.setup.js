// jest.setup.js
import '@testing-library/jest-dom'

// Set test environment variables
process.env.SKIP_ENV_VALIDATION = 'true'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'
process.env.TRACKINGMORE_API_KEY = 'test_key_for_tests_only'
process.env.SESSION_SECRET = 'test_secret_for_tests_only'
process.env.NODE_ENV = 'test'
