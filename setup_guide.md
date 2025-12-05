# Nice Diaries - Setup Guide

## Phase 1: Core Setup (Current)

### Step 1: Create Next.js Project

```bash
npx create-next-app@latest nice-diaries
# Choose:
# ✅ TypeScript
# ✅ ESLint
# ✅ Tailwind CSS
# ✅ App Router
# ❌ src/ directory
# ✅ import alias (@/*)

cd nice-diaries
```

### Step 2: Install Dependencies

```bash
npm install next-auth @supabase/supabase-js framer-motion lucide-react
```

### Step 3: Setup Supabase

1. Follow instructions in `DATABASE_SETUP.md`
2. Get your Supabase URL and Keys
3. Create all database tables

### Step 4: Setup Environment Variables

Create `.env.local` in root directory:

```bash
# Copy from .env.local template
# Fill in your actual values
```

### Step 5: Get OAuth Credentials

#### Google OAuth:
1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. For production add: `https://nicediaries.vercel.app/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env.local`

#### Discord OAuth:
1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Go to OAuth2 → Add Redirect: `http://localhost:3000/api/auth/callback/discord`
4. For production add: `https://nicediaries.vercel.app/api/auth/callback/discord`
5. Copy Client ID and Client Secret to `.env.local`

### Step 6: Generate NextAuth Secret

```bash
# Run this command:
openssl rand -base64 32

# Or use this online: https://generate-secret.vercel.app/32
# Add the result to NEXTAUTH_SECRET in .env.local
```

### Step 7: Project Structure

Create this folder structure:

```
nice-diaries/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HamburgerMenu.tsx
│   ├── DarkModeToggle.tsx
│   ├── ThemeProvider.tsx
│   └── SessionProvider.tsx
├── .env.local
├── package.json
└── tailwind.config.js
```

### Step 8: Copy All Files

Copy all the code from the artifacts I created into their respective files.

### Step 9: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 - You should see the homepage!

### Step 10: Test Authentication

1. Try signing up with email/password
2. Try logging in
3. Test Google OAuth (if credentials are set up)
4. Test Discord OAuth (if credentials are set up)

---

## Deploy to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Phase 1 complete"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Add Environment Variables (copy from .env.local)
5. Click "Deploy"

### Step 3: Update OAuth Redirect URIs

Once deployed, add production URLs to:
- Google Console: `https://nicediaries.vercel.app/api/auth/callback/google`
- Discord Developer Portal: `https://nicediaries.vercel.app/api/auth/callback/discord`

### Step 4: Update NEXTAUTH_URL

In Vercel Environment Variables, change:
```
NEXTAUTH_URL=https://nicediaries.vercel.app
```

---

## Next Steps (Phase 2)

After Phase 1 is working, we'll build:
- Browse page with search and filters
- Dashboard for creating diaries
- Profile page (private and public)
- Settings page

Let me know when Phase 1 is working and we'll continue! 🚀
