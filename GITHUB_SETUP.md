# 📤 העלאה ל-GitHub - מדריך צעד-אחר-צעד

מדריך מפורט להעלאת הפרויקט ל-GitHub ופריסתו ל-Vercel.

## ✅ לפני שמתחילים

וודא שיש לך:
- [x] חשבון GitHub (חינם)
- [x] Git מותקן במחשב
- [x] הקוד על המחשב שלך

## 🔧 בדיקת Git

פתח Terminal/CMD ובדוק:

```bash
git --version
```

אם לא מותקן, הורד מ-[git-scm.com](https://git-scm.com/)

## 📝 שלב 1: הגדרת Git (פעם ראשונה)

אם זה הפעם הראשונה שלך עם Git:

```bash
git config --global user.name "השם שלך"
git config --global user.email "your-email@example.com"
```

## 🌐 שלב 2: יצירת Repository ב-GitHub

### דרך האתר (מומלץ):

1. **היכנס ל-GitHub.com**
2. **לחץ על ה-+ בפינה הימנית העליונה**
3. **בחר "New repository"**

### הגדרות Repository:

| שדה | ערך מומלץ |
|-----|----------|
| **Repository name** | `shipment-tracking-israel` |
| **Description** | `מערכת מעקב משלוחים בינלאומיים - Next.js 14` |
| **Visibility** | Public (או Private) |
| **Initialize** | ❌ אל תסמן שום דבר! |

4. **לחץ "Create repository"**

## 💻 שלב 3: העלאת הקוד

פתח Terminal בתיקיית הפרויקט:

```bash
cd shipment-tracking-israel
```

### אתחול Git

```bash
# אתחול git בתיקייה
git init

# הוספת כל הקבצים
git add .

# בדיקה מה הוסף
git status
```

### Commit ראשון

```bash
git commit -m "🚀 Initial commit - Shipment Tracking System v2.0"
```

### חיבור ל-GitHub

GitHub יציג לך פקודות אחרי יצירת הrepo. העתק את השורות האלה:

```bash
# החלף YOUR_USERNAME בשם המשתמש שלך
git remote add origin https://github.com/YOUR_USERNAME/shipment-tracking-israel.git

# בדיקה שהחיבור תקין
git remote -v
```

### Push הקוד

```bash
git branch -M main
git push -u origin main
```

**אם נדרש login:**
- שם משתמש: YOUR_USERNAME
- סיסמה: **Personal Access Token** (לא הסיסמה הרגילה!)

### 🔑 יצירת Personal Access Token

אם GitHub מבקש Token:

1. GitHub.com → Settings (הפרופיל שלך)
2. Developer settings (בתחתית)
3. Personal access tokens → Tokens (classic)
4. Generate new token
5. סמן: `repo` (כל התיבות)
6. Generate token
7. **העתק את הToken - לא תראה אותו שוב!**
8. השתמש בו במקום סיסמה

## ✅ אימות העלאה

רענן את דף הGitHub - אתה אמור לראות:
- ✅ כל הקבצים
- ✅ README.md מוצג בדף הראשי
- ✅ הCommit שלך

## 🚀 שלב 4: Deploy ל-Vercel

### אופציה A: דרך הממשק (קל יותר)

1. **היכנס ל-[Vercel.com](https://vercel.com)**
2. **Sign up with GitHub** (התחבר עם GitHub)
3. **לחץ "Add New..." → Project**
4. **Import Git Repository**
   - בחר את `shipment-tracking-israel`
   - לחץ Import

5. **Configure Project:**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   ```

6. **Environment Variables** (חשוב מאוד!):
   ```
   Name: TRACKINGMORE_API_KEY
   Value: [הדבק את המפתח שלך]
   ```

7. **לחץ Deploy**

⏳ המתן 1-2 דקות...

✅ **אתר חי!** תקבל URL: `https://shipment-tracking-israel.vercel.app`

### אופציה B: דרך CLI (למתקדמים)

```bash
# התקנה
npm i -g vercel

# התחברות
vercel login

# Deploy
vercel

# הוסף Environment Variable
vercel env add TRACKINGMORE_API_KEY production
# הדבק את המפתח

# Production Deploy
vercel --prod
```

## 🌐 שלב 5: חיבור דומיין משלך (אופציונלי)

אם יש לך דומיין כמו `shipmenttracking.net`:

### ב-Vercel:

1. לחץ על הפרויקט שלך
2. Settings → Domains
3. Add Domain: `shipmenttracking.net`
4. Vercel יראה לך הוראות DNS

### אצל ספק הדומיין:

**לדומיין Apex** (shipmenttracking.net):
```
Type: A
Name: @
Value: 76.76.21.21
```

**ל-www**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

⏰ **זמן המתנה**: 10-30 דקות (לפעמים עד 24 שעות)

## 🔄 עדכונים עתידיים

אחרי שינויים בקוד:

```bash
# הוספת השינויים
git add .

# Commit עם תיאור
git commit -m "תיאור השינוי"

# Push ל-GitHub
git push

# Vercel יעשה Deploy אוטומטי! 🎉
```

## 🎛️ ניהול Environment Variables ב-Vercel

### הוספת משתנה חדש:

1. Vercel Dashboard
2. בחר את הפרויקט
3. Settings → Environment Variables
4. Add New
5. Name + Value
6. Select Environments (Production, Preview, Development)
7. Save

### עדכון משתנה קיים:

1. מצא את המשתנה
2. לחץ על ה-... → Edit
3. שנה את הValue
4. Save
5. **חשוב**: Redeploy הפרויקט!
   - Deployments → לחץ על ה-... → Redeploy

## 🐛 פתרון בעיות נפוצות

### בעיה: "Permission denied (publickey)"

**פתרון:**
```bash
# בדוק אם יש SSH key
ls -al ~/.ssh

# אם לא, צור אחד:
ssh-keygen -t ed25519 -C "your-email@example.com"

# הוסף ל-GitHub:
# Settings → SSH and GPG keys → New SSH key
# הדבק את התוכן של: ~/.ssh/id_ed25519.pub
```

או השתמש ב-HTTPS במקום SSH:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/shipment-tracking-israel.git
```

### בעיה: "Failed to connect to GitHub"

**פתרון:**
```bash
# בדוק חיבור
ping github.com

# בדוק firewall/proxy
```

### בעיה: Deploy נכשל ב-Vercel

**פתרון:**
1. בדוק Logs: Deployments → לחץ על ה-Deploy הכושל
2. שגיאות נפוצות:
   - חסר Environment Variable
   - שגיאת build בTypeScript
   - חסר dependency ב-package.json

```bash
# בדיקה לוקאלית לפני Push:
npm run build
```

### בעיה: "API Key not configured"

**פתרון:**
1. Vercel → Settings → Environment Variables
2. ודא: `TRACKINGMORE_API_KEY` קיים
3. ודא שהוא ב-Production
4. Redeploy

## 📋 Checklist סופי

לפני שסוגר - ודא:

- [ ] הקוד ב-GitHub
- [ ] README.md נראה טוב
- [ ] Deploy ב-Vercel עובד
- [ ] Environment Variable מוגדר
- [ ] האתר פתוח ועובד
- [ ] חיפוש משלוח עובד
- [ ] כפתור WhatsApp עובד
- [ ] מספר הטלפון נכון (052-842-0009)

## 🎉 סיימת!

עכשיו יש לך:
✅ קוד מגובה ב-GitHub  
✅ אתר חי באינטרנט  
✅ Deploy אוטומטי בכל Push  
✅ תשתית מקצועית  

## 📚 משאבים נוספים

- [GitHub Docs](https://docs.github.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

**צריך עזרה?** פתח [Issue](https://github.com/YOUR_USERNAME/shipment-tracking-israel/issues) 🐛
