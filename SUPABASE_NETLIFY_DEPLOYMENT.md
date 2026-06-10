# POAF Cloud Ledger System: Supabase & Netlify Deployment Guide
This guide provides the exact technical blueprints, SQL schemas, and deployment workflows to migrate the **Pan-African Orchid Association Foundation (POAF)** ledger system to a production environment using **Supabase** (Database) and **Netlify / Server Platforms** (Hosting).

---

## 1. System Architecture Overview

POAF uses a **full-stack React/Vite + Express server** architecture. For production deployments:
1. **Frontend (Client)**: Built via SPA React + Vite, served statically (compiles into the `/dist` directory). Great for hosting on **Netlify**, **Vercel**, or **GitHub Pages**.
2. **Backend (Server)**: A fast Express server (`server.ts`) that handles security PIN validations, clearance logic, Gemini AI interactions, and acts as a secure proxy to Supabase (preventing exposure of database keys).
3. **Database (Supabase)**: A secure cloud PostgreSQL database that persists all club modules, member registries, chats, and records.

### Production Hosting Recommendation
Because Netlify is primarily optimized for Static Site Hosting, you have two highly stable paths to host POAF:
* **The Unified Path (Highly Recommended)**: Deploy the entire full-stack app directly to a container platform like **Railway**, **Render**, or **Google Cloud Run**. These services build from your `package.json` and run the Express app on port `3000` automatically, handling both frontend and database routing flawlessly.
* **The Split Path**: Deploy the static frontend client to **Netlify**, and deploy the server API (`server.ts`) to a free/low-cost tier on **Render** / **Railway**. You then point Netlify's requests to that API URL using redirects.

---

## 2. Supabase Database Schema (SQL Blueprint)

To set up your active Supabase database, log into your [Supabase Dashboard](https://supabase.com), create a new project, navigate to the **SQL Editor**, and run the following exact Postgres DDL scripts. 

These definitions are 100% matched with the POAF translation engines and include support for both camelCase and snake_case column lookups:

```sql
-- Disable row leveling locks or enable RLS if policies are desired.
-- Standard tables setup:

-- 1. MEMBERS Table
CREATE TABLE IF NOT EXISTS members (
    id VARCHAR(100) PRIMARY KEY,
    fullName TEXT,
    full_name TEXT,
    gender VARCHAR(50),
    country VARCHAR(100),
    school TEXT,
    email TEXT UNIQUE,
    phone VARCHAR(50),
    department VARCHAR(100),
    skills TEXT,
    essay TEXT,
    photo TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    joinDate VARCHAR(100),
    join_date VARCHAR(100),
    expiryDate VARCHAR(100),
    expiry_date VARCHAR(100),
    cardGenerated BOOLEAN DEFAULT FALSE,
    card_generated BOOLEAN DEFAULT FALSE,
    certGenerated BOOLEAN DEFAULT FALSE,
    cert_generated BOOLEAN DEFAULT FALSE,
    certNumber VARCHAR(100),
    cert_number VARCHAR(100),
    leadership VARCHAR(100),
    leadershipId VARCHAR(100),
    leadership_id VARCHAR(100),
    awards TEXT DEFAULT '[]',
    isFounder BOOLEAN DEFAULT FALSE,
    is_founder BOOLEAN DEFAULT FALSE,
    biography TEXT,
    poafRoleAspiration TEXT,
    poaf_role_aspiration TEXT,
    universityTrack TEXT,
    university_track TEXT,
    grade VARCHAR(50),
    major TEXT,
    age VARCHAR(50),
    roleCategory VARCHAR(100) DEFAULT 'Member',
    role_category VARCHAR(100) DEFAULT 'Member',
    pin VARCHAR(50) NOT NULL DEFAULT '1234'
);

-- 2. PROJECTS Table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(100) PRIMARY KEY,
    name TEXT,
    department TEXT,
    country VARCHAR(100),
    description TEXT,
    submittedBy TEXT,
    submitted_by TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    photo TEXT
);

-- 3. EVENTS Table
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(100) PRIMARY KEY,
    name TEXT,
    date VARCHAR(100),
    startTime VARCHAR(50),
    start_time VARCHAR(50),
    endTime VARCHAR(50),
    end_time VARCHAR(50),
    department TEXT,
    description TEXT,
    photo TEXT,
    status VARCHAR(50) DEFAULT 'Pending'
);

-- 4. CLUBS Table
CREATE TABLE IF NOT EXISTS clubs (
    id VARCHAR(100) PRIMARY KEY,
    school TEXT,
    country VARCHAR(100),
    clubName TEXT,
    club_name TEXT,
    contactEmail TEXT,
    contact_email TEXT,
    contactPhone VARCHAR(50),
    contact_phone VARCHAR(50),
    writtenProposal TEXT,
    written_proposal TEXT,
    status VARCHAR(50) DEFAULT 'Pending'
);

-- 5. PARTNERSHIPS Table
CREATE TABLE IF NOT EXISTS partnerships (
    id VARCHAR(100) PRIMARY KEY,
    organization TEXT,
    country VARCHAR(100),
    contactEmail TEXT,
    contact_email TEXT,
    contactPhone VARCHAR(50),
    contact_phone VARCHAR(50),
    writtenProposal TEXT,
    written_proposal TEXT,
    status VARCHAR(50) DEFAULT 'Pending'
);

-- 6. AWARDS Table
CREATE TABLE IF NOT EXISTS awards (
    id VARCHAR(100) PRIMARY KEY,
    category TEXT DEFAULT 'Student of the Month',
    memberId VARCHAR(100),
    member_id VARCHAR(100),
    memberName TEXT,
    member_name TEXT,
    memberCountry VARCHAR(100),
    member_country VARCHAR(100),
    date VARCHAR(100),
    title TEXT,
    description TEXT,
    photo TEXT
);

-- 7. LEADERSHIP APPLICATIONS Table
CREATE TABLE IF NOT EXISTS leadership_applications (
    id VARCHAR(100) PRIMARY KEY,
    memberId VARCHAR(100),
    member_id VARCHAR(100),
    fullName TEXT,
    full_name TEXT,
    department TEXT,
    position TEXT,
    country VARCHAR(100),
    motivation TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    dateSubmitted VARCHAR(100),
    date_submitted VARCHAR(100)
);

-- 8. MEMBERS CHAT Table
CREATE TABLE IF NOT EXISTS members_chat (
    id VARCHAR(100) PRIMARY KEY,
    senderId VARCHAR(100),
    sender_id VARCHAR(100),
    senderName TEXT,
    sender_name TEXT,
    senderRole TEXT,
    sender_role TEXT,
    message TEXT,
    timestamp VARCHAR(100),
    channel VARCHAR(100) DEFAULT 'members',
    isBroadcast BOOLEAN DEFAULT FALSE,
    is_broadcast BOOLEAN DEFAULT FALSE
);

-- 9. LEADERS CHAT Table
CREATE TABLE IF NOT EXISTS leaders_chat (
    id VARCHAR(100) PRIMARY KEY,
    senderId VARCHAR(100),
    sender_id VARCHAR(100),
    senderName TEXT,
    sender_name TEXT,
    senderRole TEXT,
    sender_role TEXT,
    message TEXT,
    timestamp VARCHAR(100),
    channel VARCHAR(100) DEFAULT 'leaders',
    isBroadcast BOOLEAN DEFAULT FALSE,
    is_broadcast BOOLEAN DEFAULT FALSE
);
```

---

## 3. Seed Data & System Clearance Configuration
The system automatically handles setting up configuration keys, founder profiles, and sample members during its boot sequence. However, to ensure they reside in your cloud database immediately, run this SQL insert seed script:

```sql
-- Seed Core Admins and System Config Variables
INSERT INTO members (id, fullName, full_name, email, pin, isFounder, is_founder, status, roleCategory, role_category, skills)
VALUES 
('POAF-00001', 'Ezra Michael Jofe', 'Ezra Michael Jofe', 'Ezra.Michael.official@gmail.com', '8255', TRUE, TRUE, 'Approved', 'Founder', 'Founder', 'All'),
('POAF-11111', 'Chidera Okafor', 'Chidera Okafor', 'chidera.okafor@gmail.com', '1111', FALSE, FALSE, 'Approved', 'Member', 'Member', 'STEM, Advocacy'),
('POAF-22222', 'Fatoumata Diallo', 'Fatoumata Diallo', 'fatoumata.diallo@gmail.com', '2222', FALSE, FALSE, 'Approved', 'Member', 'Member', 'Agritech, Logistics'),
('SYSTEM_CONFIG_PINS', 'System Clearance Config Pins', 'System Clearance Config Pins', 'system_pins@poaf.org', '0000', FALSE, FALSE, 'Approved', 'System', 'System', '{"founder":"8255","cabinet":"4444","regional":"5555"}'),
('SYSTEM_CONFIG_NEXTID', 'System Config NextId State', 'System Config NextId State', 'system_id@poaf.org', '0000', FALSE, FALSE, 'Approved', 'System', 'System', '4')
ON CONFLICT (id) DO NOTHING;
```

---

## 4. Setting Environment Variables

In your production hosting provider's dashboard (Netlify, Railway, Render, etc.), go to **Environment Variables** / **Secrets** and add:

| Key | Value Note | Required For |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Your Supabase Project API URL (under settings -> API) | Cloud Sync Database |
| `SUPABASE_ANON_KEY` | Public system anonymous code | Cloud Sync Database |
| `GEMINI_API_KEY` | Google Gemini API key | Active AI Chat & Automated Feedback |
| `APP_URL` | The dynamic URL of your hosted instance | Navigation & Asset links |

---

## 5. Deployment Step-by-Step

### Option A: Unified Container Deployment (Render / Railway / Cloud Run)
Since your project is fully defined with custom Node build-compiled rules in `package.json`, this is the easiest path.

1. Connect your GitHub repository to your host (e.g. [Railway.app](https://railway.app)).
2. Add your environment variables in the variables tab (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GEMINI_API_KEY`).
3. Deploy! Railway reads `package.json` scripts, builds the static front-end bundle inside `/dist`, compiles `server.ts` into a CommonJS server, and runs the application over high-speed native Node.

### Option B: Netlify Front-End + Offloaded API Server split
If you prefer classic Netlify hosting:

1. **Deploy Frontend on Netlify**:
   * Create a site on [Netlify](https://www.netlify.com).
   * Link your repository.
   * **Build command**: `npm run build`
   * **Publish directory**: `dist`
2. **Deploy the Express Server**:
   * Deploy the repo to [Render](https://render.com) or [Railway](https://railway.app) as a Web Service.
   * Host it under a service URL, e.g., `https://poaf-api.onrender.com`.
3. **Configure Redirections**:
   * In your code, update your client fetch endpoints (or set up a routing rewrite in Netlify using a `_redirects` file in `public`) to proxy calls from `/api/*` to your hosted backend API URL:
   ```text
   /api/*  https://poaf-api.onrender.com/api/:splat  200
   ```

---

## 6. Verification & Self-Healing Diagnostics

Your POAF ledger has built-in **Self-Healing Diagnostics**. 
* On startup, the Express Server dynamically queries your tables over Supabase.
* If it detects missing columns in any of your custom table builds, it **automatically runs a safe dynamic column-pruning filter** (`selfHealingUpsert`), removing incompatible parameters and forcing data to write successfully without crashing the runtime!
* The client records active ledger synchronization live in the developer console (`F12`), outputting clean log visual indicators (`🟢 [POAF Cloud Ledger System] Real-time continental records synchronized`).
