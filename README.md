# Shipment Tracking Israel 🚚

מערכת מעקב משלוחים בינלאומיים - שירות מקצועי לעסקים ויחידים

## 🌟 Features

- **Real-time Tracking**: Track shipments from 1,200+ carriers worldwide via TrackingMore API
- **Multi-format Support**: AWB (Air Waybill), B/L (Bill of Lading), Container numbers, and tracking numbers
- **Redis Caching**: Optional Redis support for improved performance and reduced API calls
- **Professional Services**: Import/export consulting and customs clearance services
- **Bilingual Interface**: Hebrew and English support
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- (Optional) Redis server for caching

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/ELAD-CODE/SHIPPINGT.git
cd SHIPPINGT
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and configure it:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Required: TrackingMore API Key
TRACKINGMORE_API_KEY=your_trackingmore_api_key_here

# Optional: Redis for caching (improves performance)
REDIS_URL=redis://localhost:6379

# Optional: Database URL (if using Prisma)
DATABASE_URL=postgresql://user:password@localhost:5432/shipment_tracking
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `TRACKINGMORE_API_KEY` | API key from TrackingMore | Get from [TrackingMore.com](https://www.trackingmore.com/) |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_URL` | Redis connection URL for caching | Falls back to in-memory cache if not set |
| `DATABASE_URL` | PostgreSQL database URL | - |
| `NODE_ENV` | Environment (development/production) | `development` |

## 🗄️ Redis Setup

Redis is **optional** but **recommended** for production to:
- Reduce API calls to TrackingMore
- Improve response times
- Share cache across multiple server instances

### Local Redis Setup

#### Using Docker:

```bash
docker run -d --name redis -p 6379:6379 redis:alpine
```

#### Using Redis directly:

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis
```

### Configure Redis URL

Add to your `.env.local`:

```env
REDIS_URL=redis://localhost:6379
```

For Redis with authentication:

```env
REDIS_URL=redis://username:password@host:port
```

### Vercel Redis Setup

If deploying to Vercel, you can use [Upstash Redis](https://upstash.com/) or [Redis Labs](https://redis.com/):

1. Create a Redis database
2. Copy the connection URL
3. Add to Vercel environment variables:
   ```
   REDIS_URL=rediss://default:xxx@xxx.upstash.io:6379
   ```

**Note**: The system automatically falls back to in-memory caching if Redis is unavailable.

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |

## 🧪 Testing

The project uses Jest for testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/) and sign in with GitHub
3. Import your repository
4. Configure environment variables:
   - `TRACKINGMORE_API_KEY` (required)
   - `REDIS_URL` (optional, recommended)
5. Click Deploy

#### Using Vercel CLI:

```bash
npm i -g vercel
vercel login
vercel

# Add environment variables
vercel env add TRACKINGMORE_API_KEY production
vercel env add REDIS_URL production

# Deploy to production
vercel --prod
```

### Environment Variables on Vercel

Go to Project Settings → Environment Variables and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `TRACKINGMORE_API_KEY` | Your API key | Production, Preview, Development |
| `REDIS_URL` | Your Redis URL | Production, Preview |

## 🏗️ Architecture

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **Database**: PostgreSQL via Prisma (optional)
- **Cache**: Redis via ioredis (optional, with in-memory fallback)
- **API**: TrackingMore API v4

### Project Structure

```
SHIPPINGT/
├── app/
│   ├── api/              # API routes
│   │   ├── carriers/     # Get carriers list (cached)
│   │   ├── track/        # Track shipments
│   │   └── ...
│   ├── components/       # React components
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── lib/
│   ├── cache/
│   │   └── redis.ts      # Redis cache helper
│   ├── detectShipmentType.ts  # Shipment type detection
│   └── prisma.ts         # Prisma client
├── .github/
│   └── workflows/
│       └── ci.yml        # CI/CD pipeline
├── prisma/
│   └── schema.prisma     # Database schema
└── types/                # TypeScript types
```

## 🔄 CI/CD

GitHub Actions automatically runs on:
- Pull requests to `main`
- Pushes to `main` branch

The CI pipeline:
1. Sets up Node.js 18
2. Installs dependencies
3. Runs linter
4. Runs tests
5. Builds the project

## 📊 Caching Strategy

The `/api/carriers` endpoint implements a two-tier caching strategy:

1. **Redis Cache** (if available):
   - TTL: 24 hours
   - Shared across all server instances
   - Automatic fallback if unavailable

2. **In-Memory Cache** (fallback):
   - TTL: 24 hours
   - Per-instance cache
   - Used when Redis is not configured

This ensures optimal performance while maintaining reliability.

## 🛠️ Development Tips

### Running with Redis

```bash
# Start Redis in Docker
docker run -d --name redis -p 6379:6379 redis:alpine

# Set REDIS_URL in .env.local
echo "REDIS_URL=redis://localhost:6379" >> .env.local

# Start development server
npm run dev
```

### Running without Redis

Simply omit `REDIS_URL` from `.env.local`. The system will use in-memory caching automatically.

### Testing API Endpoints

```bash
# Test carriers endpoint
curl http://localhost:3000/api/carriers

# Test tracking endpoint
curl -X POST http://localhost:3000/api/track \
  -H "Content-Type: application/json" \
  -d '{"trackingNumber": "157-12345678"}'
```

## 📞 Contact Information

- **Phone**: 052-842-0009
- **WhatsApp**: [Send Message](https://wa.me/9720528420009)
- **Services**: Professional import/export and customs clearance

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔒 Security

- Never commit API keys or secrets to the repository
- Use `.env.local` for local development secrets
- Store production secrets in Vercel environment variables
- Redis connections use TLS in production (rediss://)

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TrackingMore API Docs](https://www.trackingmore.com/api-docs)
- [Redis Documentation](https://redis.io/docs/)
- [Vercel Deployment Guide](https://vercel.com/docs)

---

**Built with ❤️ for professional logistics services**

שירות מקצועי ליבוא/יצוא | 052-842-0009
