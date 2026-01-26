# 🚀 מדריך התקנה מהיר - 5 דקות

## שלב 1️⃣: הורדה וביצוע

```bash
# פתח Terminal/CMD

# עבור לתיקיית הפרויקט
cd shipment-tracking

# התקן את כל התלויות
npm install
```

⏱️ **זה יקח 2-3 דקות** ☕

---

## שלב 2️⃣: קבל API Key

1. **הכנס ל:** https://www.trackingmore.com
2. **רשום/התחבר** (חינמי!)
3. **לך ל:** Settings → API
4. **העתק את ה-API Key**

---

## שלב 3️⃣: הגדר .env.local

צור קובץ חדש: `.env.local`

```env
TRACKINGMORE_API_KEY=PASTE_YOUR_KEY_HERE
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

💡 **חשוב:** אל תשתף את ה-API Key!

---

## שלב 4️⃣: הרץ את הפרויקט

```bash
npm run dev
```

**פתח בדפדפן:** http://localhost:3000 🎉

---

## 🧪 בדיקה מהירה

### מספרי מעקב לבדיקה:
- UPS: `1Z999AA10123456789`
- FedEx: `794629625000`
- DHL: `1088259710`

### בדיקת API עם cURL:

```bash
curl "http://localhost:3000/api/carriers"
```

תגיד לי אם קיבלת רשימת ספקים! 🎯

---

## ❌ בעיות ופתרונות

### ❌ "API Key is undefined"
✅ **פתרון:**
- בדוק ש-.env.local קיים בתיקיית הראשית
- בדוק שה-Key לא ריק
- אתחל את ה-server: `npm run dev`

### ❌ "Cannot find module"
✅ **פתרון:**
```bash
rm -rf node_modules
npm install
```

### ❌ "Port 3000 already in use"
✅ **פתרון:**
```bash
npm run dev -- -p 3001
```

---

## 🚀 Build and Deploy

### Local Build Test:
```bash
npm run build
npm start
```

### Deploy ל-Vercel:
```bash
npm install -g vercel
vercel
```

---

## 📞 צריך עזרה?

- **טלפון:** 052-8420009
- **וואטסאפ:** https://wa.me/972528420009
- **README מלא:** אתפתח בפרויקט

---

**🎉 כל הכלים מוכנים ותא לעלות ל-GitHub!**
