# AI Coding Agent Instructions for Shipment Tracking Israel

## Project Overview

**Shipment Tracking Israel** is a Next.js 14 SaaS application that combines international shipment tracking with professional import/export and customs clearance services. The dual-purpose design serves both B2C tracking needs and B2B service lead generation.

**Key Business Model:**
- Free shipment tracking (1,200+ couriers via TrackingMore API) as lead magnet
- Primary revenue: professional customs clearance + import/export consulting services
- Service contact: 052-842-0009 (prominently featured throughout)

---

## Architecture & Data Flow

### Core Stack
- **Framework**: Next.js 14 (App Router, server/client components)
- **Language**: TypeScript (enforce strict types across API boundaries)
- **Styling**: Tailwind CSS 3.4 + PostCSS
- **Database**: PostgreSQL via Prisma (currently configured in `schema.prisma`)
- **Tracking API**: TrackingMore v4 (`https://api.trackingmore.com/v4`)

### Data Flow

```
User Input (TrackingSearch.tsx)
    ↓
API Route: /api/track (POST) → TrackingMore Detect
    ↓
ShipmentType Detection (detectShipmentType.ts)
    ├─ AWB/Air Waybill (XXX-XXXXXXXX)
    ├─ Bill of Lading (MAEU/COSU/etc + 8-12 digits)
    ├─ Container Number (ABCD1234567)
    └─ Generic Tracking Number
    ↓
TrackingMore Get Tracking
    ↓
Response → TrackingResult.tsx
    ↓
CTA Trigger: Show lead form (LeadForm.tsx) → Database
```

### Key Database Models (Prisma)
- **TrackingSearch**: Log every search attempt + shipment type detected
- **Lead**: Capture customer service inquiries (customs issues, cost questions, general help)
- **Status tracking**: new → contacted → in_progress → completed/closed

---

## Critical Patterns & Conventions

### 1. Shipment Type Detection
**File**: [lib/detectShipmentType.ts](lib/detectShipmentType.ts)

This is the intelligence layer—regex-based pattern matching for multiple formats:
- **AWB** (Air Waybill): `\d{3}-?\d{8}` → Extract airline code from first 3 digits
- **Container**: `[A-Z]{4}\d{6}\d{1}` → Validate ISO 6346 check digit
- **B/L** (Bill of Lading): `[A-Z]{4}\d{8,12}` → Carrier-specific formats
- **Generic Tracking**: Express courier patterns (DHL/FedEx/UPS)

**When adding new patterns**: Always validate with test cases in `lib/detectShipmentType.test.ts`. Check-digit validation for containers is mandatory.

### 2. TrackingMore API Integration
**File**: [app/api/track/route.ts](app/api/track/route.ts)

Two-step process (required by TrackingMore v4):
1. **Detect**: POST to `/trackings/detect` with `tracking_number`
2. **Get**: GET to `/trackings/get` with `carrier_code` + `tracking_number`

**Important**:
- API Key from env var `TRACKINGMORE_API_KEY` (required for deployment)
- 10-second timeout enforced on all requests
- Always use `'Tracking-Api-Key'` header (case-sensitive)
- Error handling: No courier detected → 404 with support phone

### 3. Bilingual Content (Hebrew/English)
- UI text: Mix of Hebrew (primary) + English (technical terms)
- All error messages use `message_he` property
- Class names and variables: English only
- Phone number format: `052-842-0009` (display) / `9720528420009` (WhatsApp link)

### 4. Lead Generation Strategy
- **Automatic CTA trigger**: Post-search when shipment found
- **LeadForm.tsx**: Captures name, phone, email, issue type
- **Issue categories**: customs, documents, cost_inquiry, general
- **No payment required**: Free lead submission to drive sales calls

---

## Development Workflows

### Local Setup
```bash
npm install
cp .env.example .env.local
# Add: TRACKINGMORE_API_KEY=<your_100_daily_calls_key>
npm run dev  # http://localhost:3000
```

### Build & Deployment
```bash
npm run build      # Vercel-optimized build
npm start          # Production mode (local)
npm run lint       # TypeScript + ESLint
npm test           # Jest (detectShipmentType.test.ts)
npm run test:watch # Development TDD
```

### Database (Prisma)
```bash
npx prisma migrate dev --name <change_description>
npx prisma studio  # GUI to inspect/edit data
npx prisma generate # Update Prisma Client after schema changes
```

### Deployment Strategy
- **Default**: Vercel (Edge Runtime ready, NextJS native)
- **Env vars required**: `TRACKINGMORE_API_KEY`, `DATABASE_URL`
- **Zero-downtime migrations**: Use Prisma's managed service

---

## Project-Specific Conventions

### 1. Component Location & Responsibility
- **UI Components** (`app/components/`): Presentational, no API calls
  - `TrackingSearch.tsx`: Input form + validation
  - `TrackingResult.tsx`: Display tracking results
  - `LeadForm.tsx`: Service inquiry capture
- **Pages** (`app/page.tsx`): State management + API orchestration
- **API Routes** (`app/api/track/`, etc.): Single responsibility per route

### 2. Styling Convention
- Tailwind CSS **only** (no CSS modules or styled-components)
- Responsive breakpoints: mobile-first design
- Color scheme: Purple gradient (667eea → 764ba2) is primary brand
- Inline styles acceptable for animations/dynamic values only

### 3. Error Handling
- **API errors**: Return `{ success: false, message_he: '...' }` with appropriate HTTP status
- **Client-side**: Display error UI with retry button (see page.tsx error state)
- **Timeout errors**: Include support phone in response (e.g., "חבר בעזרה: 052-842-0009")

### 4. Naming Conventions
- **Types**: PascalCase (`TrackingResult`, `DetectionResult`)
- **Functions**: camelCase (`detectShipmentType`, `getCarrierByCode`)
- **Constants**: UPPER_SNAKE_CASE (`TRACKINGMORE_API`, `API_TIMEOUT`)
- **CSS classes**: kebab-case (Tailwind native)
- **Database fields**: snake_case in schema (`tracking_number`, `shipment_type`)

---

## Integration Points & External Dependencies

### TrackingMore API
- **Purpose**: Detect carrier + fetch real-time tracking
- **Rate limit**: Free tier = 100 calls/day (upgrade for production)
- **Endpoint versions**: Detect (v4), Get (v3) — DO NOT mix versions
- **Fallback**: If API fails, show support contact instead of blank state

### Prisma (Database)
- **URL format**: `postgresql://user:password@host:port/database`
- **Provider**: PostgreSQL (configurable to SQLite for dev)
- **Key tables**: `TrackingSearch`, `Lead` (see schema for full context)
- **Usage**: Create server-side API routes for database mutations

### Vercel Edge Runtime
- **Next.js API routes**: Already compatible
- **Limitation**: No long-running processes, no arbitrary node modules
- **Optimization**: Cache tracking results per carrier+number combo

---

## Testing & Debugging

### Test Files
- [lib/detectShipmentType.test.ts](lib/detectShipmentType.test.ts): Pattern validation

### Test Sample Tracking Numbers
```
AWB:       157-12345678, 074-99999999
Container: MSCU1234567, TEMU9876543
B/L:       MAEU123456789, COSU12345678
Generic:   1234567890 (DHL-like), 1Z1234567890123456 (UPS)
```

### Debugging Tips
1. **TrackingMore issues**: Log detection response in `/api/track` before carrier lookup
2. **Form validation**: Check TrackingSearch.tsx input regex against detectShipmentType patterns
3. **Database issues**: Use `npx prisma studio` to inspect Lead/TrackingSearch tables
4. **Type errors**: Ensure all TrackingMore response fields are mapped to TypeScript interfaces

---

## Files to Always Reference When...

| Task | Primary Files |
|------|---------------|
| **Add new shipment format** | [lib/detectShipmentType.ts](lib/detectShipmentType.ts), [lib/detectShipmentType.test.ts](lib/detectShipmentType.test.ts) |
| **Modify API response** | [app/api/track/route.ts](app/api/track/route.ts), [types/tracking.ts](types/tracking.ts) |
| **Change UI styling** | [app/globals.css](app/globals.css), Tailwind config |
| **Update service offerings** | [SERVICES.md](SERVICES.md), [app/page.tsx](app/page.tsx) |
| **Lead form fields** | [app/components/LeadForm.tsx](app/components/LeadForm.tsx), `prisma/schema.prisma` |
| **Phone number** | Search repo for `0528420009` (7 locations) or use workspace Find+Replace |

---

## Known Limitations & TODOs

1. **Database**: Currently Prisma schema defined but no migrations active (setup needed)
2. **Tests**: Only `detectShipmentType.test.ts` exists; API routes lack test coverage
3. **Internationalization**: Manual i18n (no i18n library); Hebrew hardcoded in components
4. **Performance**: No caching layer for TrackingMore responses yet
5. **Analytics**: No event tracking for CTA conversions (Leads table is foundation)

---

## Quick Reference: Key Constants

| Constant | Value | Usage |
|----------|-------|-------|
| `TRACKINGMORE_API` | `https://api.trackingmore.com/v4` | Detect endpoint |
| `TRACKINGMORE_API_GET` | `https://api.trackingmore.com/v3` | Get endpoint (v3!) |
| `API_TIMEOUT` | `10000` (ms) | All API calls |
| `SUPPORT_PHONE` | `052-8420009` | Error responses |
| `WHATSAPP_LINK` | `https://wa.me/9720528420009` | WhatsApp CTA |

