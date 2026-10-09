# John Yestin F. Cruz — Personal Portfolio & Admin Dashboard

A complete, responsive, and functional personal portfolio website with a full-featured Admin Dashboard for **John Yestin F. Cruz**, a fourth-year Computer Engineering student at ICCT Colleges in the Philippines.

Built with an editorial minimalist aesthetic, real image uploads, persistent storage (Supabase + local engine), project case study management, categorized competencies, and secure authentication.

---

## 📑 Table of Contents
1. [Visual & Technical Identity](#visual--technical-identity)
2. [Project Architecture](#project-architecture)
3. [Prerequisites](#prerequisites)
4. [Step-by-Step Installation & Local Setup](#step-by-step-installation--local-setup)
5. [How to Access the Website](#how-to-access-the-website)
6. [Configuring the Backend (Supabase Free Tier)](#configuring-the-backend-supabase-free-tier)
   - [Database & Storage Setup](#database--storage-setup)
   - [Row Level Security (RLS)](#row-level-security-rls)
   - [Creating the Administrator Account](#creating-the-administrator-account)
   - [Environment Variables (.env)](#environment-variables-env)
7. [Admin Dashboard Guide (/admin)](#admin-dashboard-guide-admin)
   - [Logging In](#logging-in)
   - [Uploading & Replacing Profile Picture](#uploading--replacing-profile-picture)
   - [Adding, Editing & Deleting Projects](#adding-editing--deleting-projects)
   - [Uploading Multiple Project Photographs & Reordering](#uploading-multiple-project-photographs--reordering)
   - [Managing Technical Skills](#managing-technical-skills)
   - [Updating Biography, Education & Contacts](#updating-biography-education--contacts)
   - [Reviewing Visitor Inquiries](#reviewing-visitor-inquiries)
8. [Automated Testing & Quality Assurance](#automated-testing--quality-assurance)
9. [Deployment Guide (Vercel / Netlify / Cloudflare)](#deployment-guide-vercel--netlify--cloudflare)
10. [Cost Breakdown & Free Quotas](#cost-breakdown--free-quotas)
11. [Troubleshooting Common Issues](#troubleshooting-common-issues)

---

## 1. Visual & Technical Identity

- **Design Philosophy:** Minimalist, premium editorial publication style tailored for authentic engineering projects.
- **Palette:**
  - Background: Warm White (`#FAFAF8`)
  - Main Text: Near-Black (`#171717`)
  - Secondary Text: Neutral Gray (`#666666`)
  - Accent: Restrained Electric Blue (`#315EFB`)
  - Subtle Borders: Light Gray (`#E5E5E5`)
- **Typography:** Modern sans-serif hierarchy (*Plus Jakarta Sans* / *JetBrains Mono*).
- **Integrity Guarantee:** Zero stock portraits, zero fabricated certifications, zero fake proficiency percentages, and zero fake testimonials.

---

## 2. Project Architecture

```
d:/sten/
├── dist/                     # Optimized production bundle
├── scripts/
│   └── test-workflows.mjs    # Automated validation test suite
├── supabase/
│   ├── schema.sql            # Full PostgreSQL DDL, RLS policies, Storage setup
│   └── seed.sql              # Initial baseline seed data (John Yestin F. Cruz)
├── src/
│   ├── admin/                # Secure Admin Dashboard components
│   │   ├── AdminLayout.tsx       # Sidebar, tab routing, user indicator
│   │   ├── AdminLogin.tsx        # Authentication interface
│   │   ├── AdminOverview.tsx     # Metrics, status monitors, quick actions
│   │   ├── ProfileEditor.tsx     # Bio & direct photo upload/crop
│   │   ├── ProjectsManager.tsx   # Project CRUD, case studies, multi-image upload
│   │   ├── SkillsManager.tsx     # Understated skill categorized cards
│   │   ├── EducationManager.tsx  # Academic program & laboratory focus
│   │   ├── ContactManager.tsx    # Channel links & visitor inbox
│   │   ├── SupabaseSettings.tsx  # Cloud connection tester & migration sync
│   │   └── Toast.tsx             # Accessible feedback notifications
│   ├── components/           # Public Portfolio components
│   │   ├── Navbar.tsx            # Sticky header with mobile drawer
│   │   ├── Hero.tsx              # 2-column editorial hero layout
│   │   ├── About.tsx             # Biography & academic summary table
│   │   ├── Projects.tsx          # 2-column project gallery
│   │   ├── ProjectModal.tsx      # Accessible case study modal with carousel
│   │   ├── Skills.tsx            # Categorized competencies
│   │   ├── Education.tsx         # ICCT Colleges Computer Engineering
│   │   ├── Contact.tsx           # Contact links, copy email, active message form
│   │   ├── Footer.tsx            # Minimal editorial footer
│   │   └── ImageWithFallback.tsx # Neutral architectural placeholders
│   ├── lib/
│   │   ├── defaultData.ts        # Official initial portfolio baseline
│   │   ├── supabase.ts           # Supabase client & health tester
│   │   ├── storage.ts            # Hybrid data engine (Supabase + Local fallback)
│   │   └── auth.ts               # Session management & security
│   ├── types/
│   │   └── index.ts              # TypeScript interface definitions
│   ├── App.tsx               # Main routing & state coordinator
│   ├── index.css             # Tailwind CSS & custom styling
│   ├── main.tsx              # Application entry point
│   └── vite-env.d.ts         # Environment variable type declarations
├── .env.example              # Template environment variables
├── package.json              # Project dependencies & scripts
├── tailwind.config.js        # Editorial color palette & typography setup
├── tsconfig.json             # TypeScript compiler configuration
└── vite.config.ts            # Bundler configuration with vendor chunking
```

---

## 3. Prerequisites

Before running the project locally, ensure you have:
1. **Node.js** (v18.0.0 or later, v24 LTS recommended)
2. **npm** (v9.0.0 or later)
3. A modern web browser (Google Chrome, Microsoft Edge, Firefox, or Safari)

---

## 4. Step-by-Step Installation & Local Setup

Open your terminal (PowerShell, Command Prompt, or bash) in the project directory:

```bash
# 1. Navigate to the project folder
cd d:\sten

# 2. Install all dependencies
npm install

# 3. Create your local environment file
copy .env.example .env
```

To start the local development server:
```bash
npm run dev
```

The terminal will display:
```
  VITE v6.x.x  ready in 250 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## 5. How to Access the Website

- **Public Portfolio:** Open `http://localhost:3000` in your web browser.
- **Admin Dashboard:** Open `http://localhost:3000/#admin` or click the lock icon in the top navigation bar / footer.

> **Offline/Local Mode:** If you haven't set up Supabase yet, the website runs out-of-the-box using the built-in browser engine. You can immediately upload photos, edit projects, and manage skills. Changes are saved locally in your browser!

---

## 6. Configuring the Backend (Supabase Free Tier)

To make your uploaded photos and project edits sync across all computers and smartphones, connect Supabase:

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and click **Start your project**.
2. Sign in with GitHub or your email.
3. Click **New Project**, choose a project name (e.g. `cruz-portfolio`), select a strong database password, and choose a region close to the Philippines (e.g. `Singapore - ap-southeast-1`).
4. Click **Create new project** (takes ~60 seconds to provision).

### Step 2: Database & Storage Setup
1. In your Supabase project dashboard, open the **SQL Editor** from the left sidebar.
2. Click **New query**.
3. Open `supabase/schema.sql` from this codebase, copy the entire content, paste it into the Supabase SQL editor, and click **Run** (green button).
   - This creates tables for `profile`, `projects`, `project_images`, `skills`, `education`, and `messages`.
   - It also enables Row Level Security (RLS) policies and configures the public `portfolio-images` Storage bucket.
4. Open another new query tab, paste the contents of `supabase/seed.sql`, and click **Run**. This populates your initial four engineering projects and academic data.

### Step 3: Create the Administrator Account
1. In the Supabase sidebar, click **Authentication** > **Users**.
2. Click **Add User** > **Create User**.
3. Enter your administrator email (e.g. `yestincruz471@gmail.com`) and a secure password.
4. Toggle on **Auto Confirm User** so you can log in immediately.
5. Click **Create user**.

### Step 4: Environment Variables (`.env`)
1. In the Supabase sidebar, go to **Project Settings** > **API**.
2. Copy your **Project URL** and your **anon public key**.
3. In `d:\sten\.env`, paste your credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
4. Restart your development server (`npm run dev`) so Vite loads the new variables.

---

## 7. Admin Dashboard Guide (`/admin`)

### Logging In
1. Navigate to `http://localhost:3000/#admin`.
2. When Supabase is configured: Enter your Supabase Admin email and password.
3. When running in Local Test Mode: Use the default offline credentials:
   - **Email:** `admin@cruz.engineering`
   - **Password:** `AdminPass2026!`
   *(Or click "Auto-fill" on the login screen).*

### Uploading & Replacing Profile Picture
1. Go to the **Profile & Bio** tab.
2. Under **Profile Photograph**, click **Choose Photo File** (or **Select New Photo**).
3. Select any JPG, JPEG, PNG, or WebP photo from your computer (max 5 MB).
4. An immediate preview will appear.
5. Click **Upload & Apply Photo**. The photograph is stored persistently and immediately appears on your homepage hero section.
6. To delete the photo, click **Remove Photo** to revert back to the neutral engineering blueprint placeholder.

### Adding, Editing & Deleting Projects
1. Go to the **Projects & Case Studies** tab.
2. **To Add a Project:**
   - Click **Add New Project**.
   - Fill in:
     - Project Title (e.g. *BEDGUARD: Bed Exit Alert System*)
     - Category (e.g. *Embedded Systems Prototype*)
     - Short Description
     - Objectives & Key Features
     - Engineering Contribution
     - Status
     - Technologies tags (type name and press Enter)
   - Click **Save Project Details**.
3. **To Edit a Project:**
   - Click **Edit & Photos** next to any project.
   - Update any field and click **Save Project Details**.
4. **To Delete a Project:**
   - Click **Delete**. A confirmation modal will appear. Confirm to permanently remove the project.

### Uploading Multiple Project Photographs & Reordering
1. Open any project by clicking **Edit & Photos**.
2. Scroll to the **Project Photographs** section.
3. Click **Upload Photos** and select one or multiple photos from your device.
4. Each photo will display in the grid:
   - **Set Main:** Click to choose which photograph displays as the primary card preview.
   - **Move Left / Move Right:** Use the arrow buttons to change the order in which images appear in the modal carousel.
   - **Delete:** Click the trash icon to remove an individual image.

### Managing Technical Skills
1. Go to the **Technical Skills** tab.
2. Add a skill: enter the skill name (e.g. *FreeRTOS*), select the category (e.g. *Hardware and Engineering*), and click **Add Skill**.
3. Edit or delete existing skills inline with single-click controls.

### Updating Biography, Education & Contacts
- **Profile & Bio Tab:** Edit your professional title, institution, and biography paragraph.
- **Education Info Tab:** Update degree program, year level, and laboratory focus notes.
- **Contact & Messages Tab:** Update your verified email, GitHub, Facebook, and Instagram URLs.

### Reviewing Visitor Inquiries
When a visitor fills out the direct message form in the public Contact section:
1. Open the **Contact & Messages** tab in `/admin`.
2. All messages appear with sender name, email, timestamp, subject, and message.
3. Click **Reply via Email** to respond, or mark as read / delete.

---

## 8. Automated Testing & Quality Assurance

This codebase includes an automated test suite verifying data integrity, validation rules, and schema definitions:

```bash
# Run the automated test suite
npm test
```

Expected output:
```
--- Starting Automated Test Suite for John Yestin F. Cruz Portfolio ---
✓ Profile baseline verified
✓ All 4 initial engineering projects verified
✓ Technical skills verified
✓ Education record verified
✓ Image format and size validation rules verified
✓ Supabase schema SQL verified
✓ Production build assets verified

======================================================
  ALL AUTOMATED TEST CHECKS PASSED SUCCESSFULLY (6/6)
======================================================
```

To build and type-check the production package:
```bash
npm run build
```

---

## 9. Deployment Guide (Vercel / Netlify / Cloudflare)

You can deploy this portfolio for free in under 5 minutes:

### Option A: Deploying to Vercel (Recommended)
1. Push your repository to GitHub.
2. Go to [https://vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your repository (`StenDotCom/portfolio`).
4. Framework Preset will automatically detect **Vite**.
5. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon public key
6. Click **Deploy**. Your portfolio will be live at `yourname.vercel.app`.

### Option B: Deploying to Netlify
1. Go to [https://netlify.com](https://netlify.com) and click **Add new site** > **Import an existing project**.
2. Set Build Command: `npm run build`
3. Set Publish Directory: `dist`
4. Add the same environment variables in Site settings > Environment variables.
5. Click **Deploy Site**.

---

## 10. Cost Breakdown & Free Quotas

This architecture is designed to cost **$0.00 / month (100% Free)**:

| Service | Free Tier Limit | Portfolio Usage | Cost |
| :--- | :--- | :--- | :--- |
| **Vercel / Netlify** | 100 GB bandwidth / month | ~1–2 GB / month | **$0.00** |
| **Supabase Database** | 500 MB Postgres storage | < 5 MB | **$0.00** |
| **Supabase Storage** | 1 GB file storage (~250 photos) | ~20–50 MB | **$0.00** |
| **Supabase Auth** | 50,000 monthly active users | 1 administrator | **$0.00** |

---

## 11. Troubleshooting Common Issues

### 1. "Photos don't save across different devices"
- **Cause:** Supabase is not connected, so the portfolio is using local browser storage.
- **Solution:** Follow Section 6 to create a free Supabase project, execute `schema.sql`, and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` into your `.env` file (or deployment dashboard).

### 2. "Invalid file format or size error on upload"
- **Cause:** The selected file is either larger than 5 MB or not a supported image format.
- **Solution:** Compress the image below 5 MB and ensure it is saved as JPG, PNG, or WebP.

### 3. "403 Forbidden or Row Level Security error on Supabase"
- **Cause:** Row Level Security is active and the user is not authenticated.
- **Solution:** Ensure you are logged into `/admin`. Public users can only read content; write permissions require signing in.

### 4. "White screen on page refresh in production"
- **Cause:** SPA routing needs fallback to `index.html`.
- **Solution:** The codebase uses URL hash navigation (`/#admin`) and standard paths, which work on static hosts without complex rewrites.

---

*Authored for John Yestin F. Cruz — Fourth-Year Computer Engineering Student, ICCT Colleges.*
