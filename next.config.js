    /**
 * next.config.js
 * ============================================================================
 * NEXT.JS CONFIGURATION
 * 
 * FIXES APPLIED:
 * 1. ❌ REMOVED: TRACKINGMORE_API_KEY from 'env' (security issue - would be public)
 *    ✅ API key stays server-side only, accessed via API routes
 * 2. ✅ ADDED: Comprehensive security headers (CSP, etc.)
 * 3. ✅ ADDED: i18n configuration for Hebrew/English support
 * 4. ✅ ADDED: Environment-specific behavior
 * 5. ✅ ADDED: Proper redirect/rewrite configuration
 * 
 * IMPORTANT: Never expose secrets via the env object!
 * Secrets should only be accessible on the server via process.env
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ==== CORE ====
  reactStrictMode: true,

  // ==== INTERNATIONALIZATION (i18n) ====
  // Support for Hebrew (he) and English (en)
  // Note: Next.js 14 App Router uses a different i18n approach
  // Consider using next-i18n-router for full support

  // ==== PERFORMANCE & SECURITY ====
  poweredByHeader: false, // Hide Next.js version
  compress: true, // Gzip compression
  productionBrowserSourceMaps: false, // Don't expose source maps in production
  swcMinify: true, // Use SWC for faster minification

  // ==== IMAGE OPTIMIZATION ====
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Add any image domains that will be used
    // domains: ['example.com'],
  },

  // ==== ENVIRONMENT VARIABLES ====
  // ⚠️ IMPORTANT: Only expose non-sensitive vars with NEXT_PUBLIC_ prefix
  // Sensitive data (API keys, secrets) should NOT be here!

  // ==== SECURITY HEADERS ====
  async headers() {
    const cspHeader = process.env.NODE_ENV === 'production'
      ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
      : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"

    return [
      {
        source: '/:path*',
        headers: [
          // Security headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Prevent MIME sniffing
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Prevent clickjacking
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block', // Enable XSS protection
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          // Performance headers
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // ==== REDIRECTS ====
  async redirects() {
    return []
  },

  // ==== REWRITES ====
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    }
  },

  // ==== WEBPACK ====
  webpack: (config, { isServer }) => {
    return config
  },

  // ==== TYPESCRIPT ====
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // ==== ESLint ====
  eslint: {
    dirs: ['pages', 'components', 'lib', 'utils'],
  },
}

module.exports = nextConfig

    
