# YaadgarSafar.com
## Modern Travel Agency & Tour Management Platform

Official Brand Identity: **Yaadgar [LOGO] Safar.com**  
Tagline: *"Make Every Journey Memorable."*

---

## 🌟 Highlights & Key Features

- **Cinematic Discovery Experience:** Editorial-style design with immersive destination photography, custom animated flight paths inspired by the official logo, and parallax aesthetics.
- **Brand Wordmark:** Complies strictly with the PRD specification placing the uploaded official logo between *Yaadgar* and *Safar.com*.
- **Smart Tour Search:** Autocomplete destination discovery, trip type tabs (Domestic Incredible India vs. International), travel style dropdowns, duration filters, and interactive traveller counters syncing with URL parameters.
- **Dynamic Tour Packages (`/packages` & `/packages/[slug]`):**
  - Advanced sidebar filters (duration, price range slider, category, trip type).
  - Multiple sorting modes (recommended, price asc/desc, duration, recently added).
  - Day-wise expandable itinerary accordions with meal and stay specifications.
  - Inclusions, exclusions, FAQs, related packages, and sticky enquiry card.
- **Curated Destination Guides (`/destinations` & `/destinations/[slug]`):**
  - Domestic & international tabs with attractions, best times to visit, insider travel tips, and associated packages.
- **Custom Trip Planner (`/custom-trip`):**
  - Step-by-step bespoke travel planning form.
  - Generates unique tracking reference (e.g. `YS-2026-XXXX`).
  - Confetti celebratory micro-interaction on submission.
- **Direct WhatsApp Integration:**
  - One-click enquiry buttons on all packages pre-filling package names and pricing.
  - Sticky floating WhatsApp action button with tooltip.
- **Comprehensive Public Pages:**
  - `/services`, `/gallery` (with keyboard-navigable image lightbox), `/reviews` (with submission modal), `/about`, `/contact`, `/privacy-policy`, `/terms`.
- **Administrative Portal (`/admin`):**
  - `/admin/login`: Password authentication with demo credentials provided.
  - `/admin/dashboard`: Metrics for total enquiries, active packages, destinations, conversion status pipeline, and recent submissions.
  - `/admin/enquiries`: Search, destination and status filtering, stage update workflow (`new` ➔ `contacted` ➔ `quotation_sent` ➔ `confirmed` ➔ `closed`), internal staff notes, and **CSV export**.
  - `/admin/packages`: Add new package modal, status toggle (published/draft), and delete.
  - `/admin/destinations`: Add, manage, and delete destinations.
  - `/admin/gallery`: Manage photo assets.
  - `/admin/reviews`: Moderate customer feedback and verify genuine testimonials.
  - `/admin/settings`: Live update agency contact numbers, business hours, and social media links.
- **Dual Database Architecture:**
  - Supabase PostgreSQL schema with Row-Level Security (RLS) policies in `supabase/migrations/01_initial_schema.sql`.
  - Fallback data persistence layer providing flawless out-of-the-box operation both with and without active Supabase credentials.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Admin Access
Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login):
- **Email:** `admin@yaadgarsafar.com`
- **Password:** `admin123`

---

## 📂 Project Structure

```
yaadgar-safar/
├── public/
│   └── logo/
│       └── yaadgar-logo.png          # Official brand logo
├── src/
│   ├── app/
│   │   ├── (website)/                # Public website pages
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── packages/             # Tour package listings & details
│   │   │   ├── destinations/         # Destination guides & details
│   │   │   ├── custom-trip/          # Custom trip planner
│   │   │   ├── services/             # Travel services
│   │   │   ├── gallery/              # Interactive photo lightbox gallery
│   │   │   ├── reviews/              # Testimonials & review form
│   │   │   ├── about/                # Brand story & mission
│   │   │   ├── contact/              # Contact info & form
│   │   │   ├── privacy-policy/
│   │   │   └── terms/
│   │   ├── admin/                    # Admin portal
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── packages/
│   │   │   ├── destinations/
│   │   │   ├── enquiries/
│   │   │   ├── gallery/
│   │   │   ├── reviews/
│   │   │   └── settings/
│   │   ├── api/                      # REST API endpoints
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/                   # Modular UI components
│   │   ├── navigation/               # BrandWordmark, Header, Footer, WhatsAppFloat
│   │   ├── hero/                     # HeroSection with SVG Flight Path
│   │   ├── search/                   # SmartTourSearch
│   │   ├── packages/                 # PackageCard
│   │   ├── destinations/             # DestinationCard
│   │   └── home/                     # WhyChooseUs, TravelExperience, etc.
│   ├── lib/
│   │   ├── supabase/client.ts
│   │   ├── data/mockData.ts
│   │   └── utils.ts
│   ├── services/
│   │   └── travelService.ts
│   └── types/
│       └── index.ts
└── supabase/
    └── migrations/
        └── 01_initial_schema.sql
```

---

## 🛡️ Supabase Database Setup

When linking your live Supabase project:
1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL statements inside `supabase/migrations/01_initial_schema.sql` in the Supabase SQL Editor.
3. Copy your project URL and Anon key into `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```
