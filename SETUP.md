# 🚀 SETUP GUIDE - SHIPMENT TRACKING ISRAEL

## Quick Start (Developer Setup)

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- PostgreSQL database (local or cloud)
- TrackingMore API key (100 free calls/day)

### Step 1: Environment Configuration

Create `.env.local` at project root:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/shipment_tracking"

# API Integration
TRACKINGMORE_API_KEY="your_api_key_here"

# Optional: Rate Limiting (if using Upstash)
# UPSTASH_REDIS_REST_URL="your_redis_url"
# UPSTASH_REDIS_REST_TOKEN="your_redis_token"

# Environment
NODE_ENV="development"
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected output:**
```
added 551 packages, and audited 551 packages in 2m
```

### Step 3: Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Open Prisma Studio (verify database connection)
npx prisma studio
```

**Expected:** Browser opens to http://localhost:5555
Shows empty Lead, TrackingSearch, User tables

### Step 4: Run Development Server

```bash
npm run dev
```

**Expected output:**
```
 ▲ Next.js 14.2.35
 - Local:        http://localhost:3000
 - Environments: .env.local
```

### Step 5: Verify Application

Open http://localhost:3000 in browser

**Test flow:**
1. Enter tracking number: `157-12345678`
2. Click "חפש משלוח"
3. Should see tracking result (or API error if TRACKINGMORE_API_KEY invalid)
4. Click form to test lead submission
5. Check Prisma Studio to verify lead was saved

---

## Troubleshooting

### ❌ "DATABASE_URL is not set"
```
Error: Cannot find environment variable DATABASE_URL
```

**Fix:**
1. Verify .env.local exists in project root
2. Restart dev server: `npm run dev`
3. Check that DATABASE_URL is not indented

### ❌ "Cannot find PrismaClient"
```
Cannot find module '@prisma/client'
```

**Fix:**
```bash
npx prisma generate
npm install
```

### ❌ "Connection refused" (Database)
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Fix:**
1. Verify PostgreSQL is running
2. Verify connection string in .env.local
3. Create database if missing: `createdb shipment_tracking`

### ❌ "API returned 404"
```
❌ לא זוהתה חברת שילוח
```

**Fix:**
1. Verify TRACKINGMORE_API_KEY is valid
2. Try different tracking number
3. Check API quota (100 free calls/day)
4. Log request in browser DevTools (Network tab)

### ❌ "Form submission fails"
```
❌ שגיאה בשמירת הפרטים
```

**Fix:**
1. Verify database is connected (npx prisma studio)
2. Check browser console for errors
3. Verify database tables exist
4. Check lead phone number format (05XXXXXXXX)

---

## Database Options

### Local PostgreSQL (Development)

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb shipment_tracking
```

**Windows (PostgreSQL installer):**
1. Download from postgresql.org
2. Install with pgAdmin
3. Create database via pgAdmin GUI or psql:
```bash
psql -U postgres
CREATE DATABASE shipment_tracking;
```

**Linux (Ubuntu):**
```bash
sudo apt install postgresql
sudo su - postgres
createdb shipment_tracking
psql shipment_tracking  # Verify
```

### Cloud Database (Easier)

**Option A: Vercel Postgres**
```bash
vercel env pull  # Pulls DATABASE_URL automatically
```

**Option B: Supabase**
1. Create project at supabase.com
2. Copy connection string
3. Add to .env.local

**Option C: Railway**
1. Create project at railway.app
2. Add PostgreSQL plugin
3. Copy DATABASE_URL

---

## Getting TrackingMore API Key

1. Visit https://www.trackingmore.com
2. Sign up for free account
3. Navigate to Integrations → API
4. Copy your API Key (free tier: 100 calls/day)
5. Add to .env.local

**Test API Key:**
```bash
curl -X POST https://api.trackingmore.com/v4/trackings/detect \
  -H "Tracking-Api-Key: YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{"tracking_number":"157-12345678"}'
```

Expected response:
```json
{
  "meta": { "success": true },
  "data": [
    { "code": "emirates", "name": "Emirates" }
  ]
}
```

---

## Running Tests

```bash
# Run all tests once
npm test

# Watch mode (re-run on changes)
npm run test:watch
```

**Expected:** Tests related to detectShipmentType should pass

---

## Build for Production

```bash
npm run build
```

**Expected output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (12/12)
✓ Finalizing page optimization
```

If build fails, check error messages and ensure:
1. No TypeScript errors: `npm run lint`
2. .env.local exists with required vars
3. Database initialized: `npx prisma migrate deploy`

---

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import to Vercel (vercel.com)
3. Set environment variables:
   - DATABASE_URL (Vercel Postgres)
   - TRACKINGMORE_API_KEY
4. Deploy

### Self-Hosted

```bash
# Build
npm run build

# Start server
npm start
```

### Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t shipment-tracking .
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e TRACKINGMORE_API_KEY="..." \
  shipment-tracking
```

---

## Monitoring & Debugging

### Prisma Studio
```bash
npx prisma studio
```
Open http://localhost:5555 to view/edit database

### Next.js Debug Mode
```bash
DEBUG=* npm run dev
```

### Browser DevTools
- Network tab: Check API calls
- Console: Check JavaScript errors
- Application tab: Check localStorage

### Log Output
Set environment variable:
```bash
NODE_ENV=development npm run dev
```

Shows:
- SQL queries (Prisma logger)
- API requests/responses
- Build warnings

---

## Common Tasks

### Add New Field to Lead Model
1. Edit [prisma/schema.prisma](prisma/schema.prisma)
2. Run: `npx prisma migrate dev --name add_field_name`
3. Restart dev server

### Reset Database
```bash
# ⚠️ WARNING: Deletes all data
npx prisma migrate reset
```

### View Database Schema
```bash
npx prisma studio
# OR
npx prisma db pull  # Generate from existing DB
```

### Generate Seed Data
Create `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lead = await prisma.lead.create({
    data: {
      fullName: 'Test User',
      phone: '0501234567',
      email: 'test@example.com',
      trackingNumber: '157-12345678',
      shipmentType: 'air_waybill'
    }
  });
  console.log('Created lead:', lead);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
```

Run: `npx prisma db seed`

---

## Questions?

**Phone Support:** 052-842-0009

**Documentation:** See [REVIEW_REPORT.md](REVIEW_REPORT.md) for detailed code review

**Issues:** Check [GitHub Issues](if using GitHub) or README.md
