# 🚢 מעקב משלוחים בינלאומיים + שירותי יבוא/יצוא מקצועיים

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**שירות מקצועי למעקב משלוחים + טיפול מלא ביבוא, יצוא ושחרור סחורה מהמכס**

<p align="center">
  <img src="https://img.shields.io/badge/🚢-Shipping_Tracking-blue" alt="Shipping" />
  <img src="https://img.shields.io/badge/📦-Import_Export-green" alt="Import Export" />
  <img src="https://img.shields.io/badge/🏛️-Customs_Clearance-purple" alt="Customs" />
  <img src="https://img.shields.io/badge/💼-Professional_Service-orange" alt="Professional" />
</p>

## 💼 השירותים שלנו

### 🔍 מעקב משלוחים בזמן אמת
- מעקב אחר 1,200+ חברות שילוח בינלאומיות
- עדכונים מיידיים על מיקום הסחורה
- היסטוריית תנועה מפורטת

### 📦 טיפול מקצועי ביבוא/יצוא
- ייעוץ והכוונה בתהליך היבוא/יצוא
- ליווי מלא מרגע ההזמנה ועד קבלת הסחורה
- סיוע בבחירת שיטת משלוח אופטימלית
- תיאום עם ספקים וחברות שילוח

### 🏛️ שחרור סחורה מהמכס
- טיפול במסמכים ואישורים נדרשים
- ייצוג מול רשויות המכס
- חישוב מכס ומיסים מראש
- שחרור מהיר ויעיל של הסחורה

### 💬 שירות אישי ומקצועי
- **טלפון**: [052-842-0009](tel:+9720528420009)
- **WhatsApp**: [שלח הודעה](https://wa.me/9720528420009?text=שלום, אני מעוניין בשירותי יבוא/יצוא)
- זמינים לייעוץ ללא עלות
- תגובה מהירה לכל שאלה

## ✨ למה לבחור בנו?

### 💼 ניסיון וידע
- **שנות ניסיון** בתחום היבוא/יצוא והמכס
- **מומחיות מקומית** - מכירים את השוק הישראלי לעומק
- **קשרים בתעשייה** - עבודה עם כל חברות השילוח הגדולות

### ⚡ שירות מהיר ויעיל
- **זמינות** - מענה מהיר לכל פניה
- **שקיפות** - עדכונים שוטפים על מצב הסחורה
- **מקצועיות** - טיפול בכל התהליך מקצה לקצה

### 💰 חיסכון בזמן וכסף
- **מניעת עיכובים** - טיפול נכון במסמכים מראש
- **אופטימיזציה** - בחירת מסלול ושיטת משלוח הטובים ביותר
- **הפחתת עלויות** - ייעוץ על דרכים לחסוך במכס ומיסים

### 🛡️ אמינות ובטיחות
- **ביטחון** - הסחורה שלכם בידיים מקצועיות
- **אחריות** - מלווים אתכם עד סיום התהליך
- **תמיכה** - זמינים לכל שאלה בכל שלב

## 🛠️ טכנולוגיות

| טכנולוגיה | גרסה | תיאור |
|-----------|------|--------|
| **Next.js** | 14.2 | Framework React עם App Router |
| **TypeScript** | 5.x | Type safety מלא |
| **Tailwind CSS** | 3.4 | עיצוב utility-first |
| **TrackingMore API** | v4 | מעקב משלוחים |
| **Lucide React** | 0.263 | אייקונים |
| **Vercel** | - | Deploy + Edge Runtime |

## 📦 התקנה מהירה

### דרישות מקדימות

- Node.js 18+ 
- npm או yarn
- API Key מ-TrackingMore (חינם: 100 קריאות/יום)

### שלבי התקנה

```bash
# 1. Clone הפרויקט
git clone https://github.com/YOUR_USERNAME/shipment-tracking-israel.git
cd shipment-tracking-israel

# 2. התקנת תלויות
npm install

# 3. הגדרת Environment Variables
cp .env.example .env.local

# ערוך את .env.local והוסף:
# TRACKINGMORE_API_KEY=your_key_here

# 4. הרצה לוקאלית
npm run dev
```

פתח דפדפן ב-`http://localhost:3000` 🎉

## 🔑 קבלת TrackingMore API Key

1. היכנס ל-[TrackingMore.com](https://www.trackingmore.com/)
2. צור חשבון (חינם!)
3. קבל **100 קריאות ליום בחינם**
4. העתק את ה-API Key
5. הדבק ב-`.env.local`

## 🚀 Deploy ל-Vercel

### אופציה 1: דרך GitHub (מומלץ)

```bash
# 1. צור repository ב-GitHub
# 2. Push הקוד
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shipment-tracking-israel.git
git push -u origin main

# 3. Import ב-Vercel
# - היכנס ל-vercel.com
# - לחץ "Import Project"
# - בחר את הrepo שלך
# - הוסף Environment Variable: TRACKINGMORE_API_KEY
# - Deploy!
```

### אופציה 2: דרך Vercel CLI

```bash
# התקנה
npm i -g vercel

# Deploy
vercel login
vercel

# הוסף API Key
vercel env add TRACKINGMORE_API_KEY production
# הדבק את המפתח

# Production Deploy
vercel --prod
```

## 📂 מבנה הפרויקט

```
shipment-tracking-israel/
├── app/
│   ├── api/
│   │   └── track/
│   │       └── route.ts          # API Route - מעקב משלוחים
│   ├── layout.tsx                 # Root Layout + Header/Footer
│   ├── page.tsx                   # Home Page + Hero + CTAs
│   └── globals.css                # סטיילינג גלובלי
├── components/
│   ├── SearchForm.tsx             # טופס חיפוש
│   ├── TrackingResults.tsx        # תצוגת תוצאות
│   └── WhatsAppButton.tsx         # כפתור וואטסאפ צף
├── lib/
│   ├── carriers.ts                # זיהוי ספקים + תרגומים
│   ├── trackingApis.ts            # חיבור ל-TrackingMore API
│   └── cache.ts                   # מערכת Cache
├── types/
│   └── tracking.ts                # TypeScript Types
├── public/                        # קבצים סטטיים
├── .env.example                   # דוגמה למשתני סביבה
├── .gitignore                     # קבצים להתעלם
└── README.md                      # אתה כאן! 📍
```

## 🎯 ספקים נתמכים

### 🚢 ספנות (Container Tracking)
- **ZIM** - צים (ZIMU + 7 ספרות)
- **Maersk** (MAEU, MSKU)
- **MSC** (MSCU, MEDU)
- **CMA CGM** (CMAU, CGMU)
- **Hapag-Lloyd** (HLCU, HLXU)
- **COSCO** (COSU, OOCU)
- **Evergreen** (EISU, EGHU)

### ✈️ תעופה
- **אל על קרגו**
- **DHL** (10-11 ספרות)
- **FedEx** (12/14/20 ספרות)
- **UPS** (1Z + 16 תווים)

### 📮 דואר
- **דואר ישראל** (EL/EA/RR + IL)
- **USPS** (94/92 + ספרות)
- **China Post** (L/R/C + CN)

### 🚚 לוגיסטיקה ישראלית
- **Lionwheel** - ליונוהיל
- **Chita Express** - צ'יטה אקספרס

## 🔧 שימוש ב-API

### Endpoint

```
GET /api/track?trackingNumber=XXXX&carrier=auto
```

### פרמטרים

| פרמטר | סוג | חובה | תיאור |
|-------|-----|------|--------|
| `trackingNumber` | string | ✅ | מספר המעקב |
| `carrier` | string | ❌ | קוד הספק או 'auto' |

### דוגמאות

```bash
# זיהוי אוטומטי
curl "https://yoursite.com/api/track?trackingNumber=ZIMU1234567"

# ספק ספציפי
curl "https://yoursite.com/api/track?trackingNumber=ZIMU1234567&carrier=zim"
```

### תגובה (Success)

```json
{
  "success": true,
  "tracking_number": "ZIMU1234567",
  "carrier": {
    "code": "zim",
    "name": "ZIM",
    "nameHebrew": "צים"
  },
  "status": {
    "code": "InTransit",
    "text": "🌊 בהובלה"
  },
  "events": [...]
}
```

## 💬 התאמה אישית - מספר הוואטסאפ

הפרויקט מוגדר עם מספר הטלפון: **052-842-0009**

### איפה לשנות?

1. **Layout (Header + Footer)**
   ```typescript
   // app/layout.tsx
   href="https://wa.me/9720528420009?text=..."
   // שנה ל-972XXXXXXXXX
   ```

2. **WhatsApp Button**
   ```typescript
   // components/WhatsAppButton.tsx
   href="https://wa.me/9720528420009?text=..."
   ```

3. **Home Page CTAs**
   ```typescript
   // app/page.tsx
   href="https://wa.me/9720528420009?text=..."
   ```

**חיפוש גלובלי:**
```bash
grep -r "0528420009" .
# יראה את כל המקומות שצריך לשנות
```

## 🐛 פתרון בעיות

### "API Key not configured"

**פתרון:**
1. ודא ש-`.env.local` קיים
2. המשתנה נקרא: `TRACKINGMORE_API_KEY`
3. עשה restart לשרת
4. ב-Vercel: Settings → Environment Variables

### "404 Not Found" על /api/track

**פתרון:**
```bash
# נקה build
rm -rf .next
npm run dev
```

### Cache לא עובד

**פתרון:**
```javascript
// בקונסול הדפדפן
localStorage.clear()
```

## 📈 שדרוגים אפשריים

- [ ] **Database** - Vercel Postgres לשמירת משלוחים
- [ ] **Webhooks** - עדכונים אוטומטיים
- [ ] **User Accounts** - התחברות ומעקב אישי
- [ ] **Email Notifications** - התראות במייל
- [ ] **Analytics** - גרפים של זמני הגעה
- [ ] **Multi-language** - תמיכה בשפות נוספות
- [ ] **PDF Reports** - הדפסת תוצאות

## 💼 תחומי התמחות

- **ספנות (Sea Freight)** - Containers, LCL, FCL
- **תעופה (Air Freight)** - משלוחים אוויריים מהירים
- **דואר בינלאומי** - חבילות קטנות ובינוניות
- **מכס ישראלי** - שחרור סחורה, מילוי טפסים, ייצוג
- **רגולציה** - ייבוא מוצרים מוסדרים, אישורים נדרשים
- **לוגיסטיקה** - תיאום הובלות מקומיות

## 📞 צור קשר

**מעוניין בשירותים שלנו? נשמח לעזור!**

### 📱 דרכי התקשרות

- **טלפון**: [052-842-0009](tel:+9720528420009)
- **WhatsApp**: [שלח הודעה](https://wa.me/9720528420009?text=שלום, אני מעוניין בשירותי יבוא/יצוא)

### ⏰ זמינות

- זמינים לשאלות ייעוץ בכל עת
- מענה מהיר תוך מספר שעות
- שירות מקצועי ואישי

### 💬 על מה אפשר לפנות אלינו?

- שאלות על תהליך יבוא/יצוא
- בדיקת עלויות ומשך זמן משלוח
- סיוע בבחירת שיטת משלוח
- טיפול במכס ושחרור סחורה
- ליווי מלא בתהליך
- **ייעוץ ראשוני ללא עלות!**

## 📄 רישיון

MIT License - ראה [LICENSE](LICENSE) לפרטים

## 📧 דרכי התקשרות נוספות

**צריך עזרה או יש שאלה?**

- 📱 **טלפון**: [052-842-0009](tel:+9720528420009) - התקשר עכשיו
- 💬 **WhatsApp**: [שלח הודעה](https://wa.me/9720528420009?text=שלום, אני מעוניין במידע על יבוא/יצוא) - מענה מהיר
- 🐛 **בעיות טכניות באתר**: [GitHub Issues](https://github.com/YOUR_USERNAME/shipment-tracking-israel/issues)

**שעות פעילות**: זמינים לשאלות בכל עת - נחזור אליך במהירות!

---

## 🎯 תהליך העבודה שלנו

1. **📞 יצירת קשר** - צרו קשר בטלפון או בוואטסאפ
2. **📋 הערכת צרכים** - נבין את הצרכים שלכם
3. **💰 הצעת מחיר** - תקבלו הצעת מחיר שקופה ומפורטת
4. **🚢 תיאום משלוח** - נטפל בכל ההיבטים הלוגיסטיים
5. **🏛️ טיפול במכס** - נדאג לשחרור מהיר ויעיל
6. **✅ אספקה** - הסחורה מגיעה אליכם

---

---

<p align="center">
  Made with ❤️ in Israel 🇮🇱
  <br />
  <strong>מעקב משלוחים בינלאומיים</strong>
</p>
