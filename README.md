# 🚀 Shipment Tracking - מערכת מעקב משלוחים בינלאומית

Advanced international shipment tracking platform with support for 1,200+ carriers worldwide using the TrackingMore API.

---

## ✨ Features

- ✅ **Automatic Carrier Detection** - זיהוי אוטומטי של ספק השילוח
- ✅ **1,200+ Carriers Support** - תמיכה בעל 1200 ספקי שילוח בינלאומיים
- ✅ **Real-time Tracking** - מעקב בזמן אמת
- ✅ **Multi-language** - עברית ו英文 (RTL Support)
- ✅ **Responsive Design** - עיצוב ממוסדר לכל גדלי המסכנים
- ✅ **Fast & Reliable** - מהיר וموثוق

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: TrackingMore v3
- **Icons**: Lucide React
- **Runtime**: Node.js 18+

---

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn
- TrackingMore API Key (free tier available)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd shipment-tracking
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Copy `.env.example` to `.env.local` and add your TrackingMore API key:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
TRACKINGMORE_API_KEY=your_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

**Get your API Key:**
1. Sign up at [TrackingMore](https://www.trackingmore.com)
2. Go to Settings → API
3. Copy your API Key
4. Paste into `.env.local`

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
shipment-tracking/
├── app/
│   ├── api/
│   │   ├── track/route.ts          # Main tracking endpoint
│   │   └── carriers/route.ts       # Carriers list endpoint
│   ├── components/
│   │   ├── SearchForm.tsx          # Search form component
│   │   └── TrackingResults.tsx     # Results display component
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Home page
├── lib/
│   ├── carriers.ts                 # Carrier detection logic
│   └── trackingmore.ts             # TrackingMore API client
├── styles/
│   └── globals.css                 # Global styles
├── types/
│   └── index.ts                    # TypeScript types
├── public/                         # Static assets
├── .env.example                    # Environment variables template
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 🔌 API Routes

### GET /api/track

**Track a shipment**

```bash
curl "http://localhost:3000/api/track?trackingNumber=1Z999AA10123456784&carrier=ups"
```

**Parameters:**
- `trackingNumber` (required): Tracking number
- `carrier` (optional): Carrier code (auto-detect if not provided)

**Response:**

```json
{
  "success": true,
  "tracking_number": "1Z999AA10123456784",
  "carrier": {
    "code": "ups",
    "name": "United Parcel Service",
    "nameHebrew": "יופס"
  },
  "status": {
    "code": "delivered",
    "text": "הגיע ליעד",
    "lastUpdate": "2025-01-26T10:30:00Z"
  },
  "events": [...],
  "estimated_delivery": "2025-01-26"
}
```

### GET /api/carriers

**Get list of supported carriers**

```bash
curl "http://localhost:3000/api/carriers"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "code": "ups",
      "name": "United Parcel Service",
      "nameHebrew": "יופס"
    },
    ...
  ]
}
```

---

## 🧪 Testing

### Test with Sample Tracking Numbers

```
UPS: 1Z999AA10123456789
FedEx: 794629625000
DHL: 1088259710
```

### Manual API Testing (Postman/cURL)

```bash
# Detect carrier
curl -X POST https://api.trackingmore.com/v3/trackings/detect \
  -H "Tracking-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"tracking_number": "1Z999AA10123456789"}'

# Get tracking details
curl -X POST https://api.trackingmore.com/v3/trackings/get \
  -H "Tracking-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"tracking_number": "1Z999AA10123456789", "courier_code": "ups"}'
```

---

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variable in Vercel dashboard:
# TRACKINGMORE_API_KEY = your_api_key
```

### Deploy to Other Platforms

**Using Docker:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

---

## 🔧 Development

### Format Code

```bash
npm run format
```

### Type Check

```bash
npm run type-check
```

### Run Tests

```bash
npm run test
```

---

## 📱 Supported Carriers

**Maritime:**
- ZIM, Maersk, MSC, CMA CGM, Hapag-Lloyd, COSCO, Evergreen

**Parcel:**
- UPS, FedEx, DHL, and 1,190+ more

[Full carrier list](https://www.trackingmore.com/api-carriers.html)

---

## 🐛 Troubleshooting

### "API Key not configured"

- Check `.env.local` has `TRACKINGMORE_API_KEY`
- Verify API key is valid and not expired
- Restart dev server: `npm run dev`

### "Tracking not found"

- Verify tracking number is correct
- Check carrier code matches the actual carrier
- Some carriers may have delivery delays

### CORS Errors

- Next.js API routes handle CORS automatically
- No additional configuration needed

### Build Fails

```bash
# Clean and rebuild
rm -rf .next
npm run build
```

---

## 📞 Support

- **Phone**: 052-8420009
- **WhatsApp**: [Send message](https://wa.me/972528420009)
- **Email**: support@shipmenttracking.com

---

## 📄 License

This project is private and proprietary.

---

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

---

## 📝 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TRACKINGMORE_API_KEY` | ✅ | - | TrackingMore API Key |
| `NEXT_PUBLIC_SITE_URL` | ❌ | `http://localhost:3000` | Site URL |
| `NODE_ENV` | ❌ | `development` | Environment |

---

## 🚀 Performance Tips

1. **Cache API Results** - Results are cached for 5 minutes
2. **Optimize Images** - Use Next.js Image component
3. **Minify CSS** - Tailwind handles this automatically
4. **Code Splitting** - Next.js App Router does this automatically

---

## 📊 API Rate Limits

- **Free Tier**: 100 calls/day
- **Basic Tier**: 2,000 calls/month
- **Pro Tier**: Unlimited calls

[Pricing details](https://www.trackingmore.com/pricing.html)

---

## 🔐 Security

- API key stored in `.env.local` (never committed)
- All API calls made from server-side only
- Input validation on all endpoints
- HTTPS enforced in production

---

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

**Last updated: 2025-01-26**

Made with ❤️ for international shipment tracking
