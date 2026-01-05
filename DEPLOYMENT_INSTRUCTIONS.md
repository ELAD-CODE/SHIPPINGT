# 🚀 הוראות העלאה ל-Vercel

## שלב 1: הכנת הקבצים

1. **הורד את כל הקבצים** שיצרתי לך:
   - `api/track.js` - Backend function
   - `index-api.html` - עמוד הבית המשופר
   - `script-api.js` - JavaScript עם חיבור API
   - `vercel.json` - הגדרות Vercel
   - `.env.example` - דוגמה למשתני סביבה

2. **צור תיקייה חדשה** במחשב שלך בשם `shipment-tracking`

3. **העתק את כל הקבצים** לתיקייה:
   ```
   shipment-tracking/
   ├── api/
   │   └── track.js
   ├── index.html (שנה את השם מ-index-api.html)
   ├── about.html (הקבצים הקיימים שלך)
   ├── contact.html
   ├── style.css
   ├── script.js (שנה את השם מ-script-api.js)
   └── vercel.json
   ```

---

## שלב 2: הרשמה ל-Vercel

1. **גלוש ל:** https://vercel.com

2. **לחץ על "Sign Up"**

3. **התחבר עם GitHub** (הכי קל - משתמש בחשבון GitHub שלך)

4. **אשר את ההרשאות**

---

## שלב 3: יצירת Repository ב-GitHub

### אופציה A: דרך GitHub Desktop (קל יותר)

1. **פתח GitHub Desktop**

2. **File** → **New Repository**
   - Name: `shipment-tracking-vercel`
   - Local Path: בחר את התיקייה שיצרת
   - לחץ **"Create Repository"**

3. **Publish Repository:**
   - לחץ **"Publish repository"**
   - הסר סימון מ-"Keep this code private" (צריך Public)
   - לחץ **"Publish"**

### אופציה B: דרך אתר GitHub

1. **GitHub.com** → **New Repository**

2. **שם:** `shipment-tracking-vercel`

3. **Public**

4. **לא** תסמן README (יש לך כבר קבצים)

5. **Create repository**

6. **העלה את כל הקבצים:**
   - לחץ "uploading an existing file"
   - גרור את כל הקבצים והתיקיות
   - Commit

---

## שלב 4: חיבור Vercel ל-GitHub

1. **חזור ל-Vercel.com**

2. **לחץ "Add New"** → **"Project"**

3. **Import Git Repository:**
   - תראה את הרשימה של Repositories שלך
   - בחר **"shipment-tracking-vercel"**
   - לחץ **"Import"**

4. **Configure Project:**
   - Framework Preset: **"Other"** (או השאר ריק)
   - Root Directory: `./` (root)
   - Build Command: השאר ריק
   - Output Directory: השאר ריק
   - Install Command: השאר ריק

5. **⚠️ חשוב! הוסף Environment Variable:**
   - לחץ **"Environment Variables"**
   - Name: `TRACKINGMORE_API_KEY`
   - Value: `8vgcjgcw-jyr7-omsx-kp5y-8nwsy4x7pepx` (ה-API Key שלך)
   - לחץ **"Add"**

6. **לחץ "Deploy"** 🚀

---

## שלב 5: המתן ל-Deployment

1. **Vercel יבנה את הפרויקט** (1-2 דקות)

2. **תראה:**
   ```
   Building...
   Deploying...
   ✅ Ready!
   ```

3. **תקבל URL:**
   ```
   https://shipment-tracking-vercel.vercel.app
   ```

---

## שלב 6: בדיקה

1. **פתח את ה-URL** שקיבלת

2. **נסה לחפש משלוח:**
   - הזן מספר מעקב (דוגמה: `1234567890`)
   - לחץ "חפש"
   - אמור לעבוד! 🎉

---

## שלב 7: חיבור Domain מותאם אישית

1. **ב-Vercel Dashboard:**
   - בחר את הפרויקט
   - **Settings** → **Domains**

2. **Add Domain:**
   - הזן: `shipmenttracking.net`
   - לחץ **"Add"**

3. **Vercel ייתן לך הוראות DNS:**
   - תצטרך לעדכן ב-GoDaddy
   - הסר את רשומות ה-A הישנות
   - הוסף רשומת CNAME חדשה

4. **ב-GoDaddy:**
   - DNS Management
   - הוסף CNAME: `@` → `cname.vercel-dns.com`
   - (Vercel ייתן לך את הכתובת המדויקת)

5. **המתן 24-48 שעות**

---

## 🎯 סיכום מהיר:

1. ✅ הורד קבצים
2. ✅ צור תיקייה
3. ✅ הירשם ל-Vercel (עם GitHub)
4. ✅ צור Repository ב-GitHub
5. ✅ חבר Vercel ל-GitHub
6. ✅ הוסף API Key ב-Environment Variables
7. ✅ Deploy!

---

## ⚠️ בעיות נפוצות:

**בעיה: "API Key not configured"**
- פתרון: בדוק שהוספת את `TRACKINGMORE_API_KEY` ב-Environment Variables

**בעיה: "CORS error"**
- פתרון: וודא שה-API function מחזיר headers נכונים (כבר מטופל בקוד)

**בעיה: "404 Not Found"**
- פתרון: וודא שהתיקייה `api/` קיימת ובה `track.js`

---

## 📞 צריך עזרה?

אם משהו לא עובד:
1. בדוק את ה-Logs ב-Vercel (Functions → View Logs)
2. צלם screenshot ושלח לי
3. אני אעזור לתקן!

---

**מוכן? בוא נתחיל! 🚀**
