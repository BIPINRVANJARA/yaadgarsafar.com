-- YaadgarSafar.com Production Supabase Schema Migration
-- Enables UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Admins and Team)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'content_manager')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DESTINATIONS
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  state_or_country TEXT NOT NULL,
  trip_type TEXT NOT NULL CHECK (trip_type IN ('domestic', 'international')),
  description TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  best_time TEXT NOT NULL,
  attractions TEXT[] DEFAULT ARRAY[]::TEXT[],
  activities TEXT[] DEFAULT ARRAY[]::TEXT[],
  travel_tips TEXT[] DEFAULT ARRAY[]::TEXT[],
  featured BOOLEAN DEFAULT false,
  package_count INT DEFAULT 0,
  starting_price NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PACKAGES
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
  destination_name TEXT NOT NULL,
  duration_days INT NOT NULL,
  duration_nights INT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  pricing_basis TEXT NOT NULL DEFAULT 'per person',
  category TEXT NOT NULL CHECK (category IN ('family', 'honeymoon', 'adventure', 'relaxation', 'pilgrimage', 'wildlife', 'cultural', 'group')),
  trip_type TEXT NOT NULL CHECK (trip_type IN ('domestic', 'international')),
  cover_image TEXT NOT NULL,
  gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
  inclusions TEXT[] DEFAULT ARRAY[]::TEXT[],
  exclusions TEXT[] DEFAULT ARRAY[]::TEXT[],
  faqs JSONB DEFAULT '[]'::JSONB,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  featured BOOLEAN DEFAULT false,
  badge TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PACKAGE ITINERARY
CREATE TABLE IF NOT EXISTS package_itinerary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  title TEXT NOT NULL,
  activities TEXT NOT NULL,
  meals TEXT,
  stay TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ENQUIRIES
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  destination TEXT NOT NULL,
  package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
  package_title TEXT,
  departure_city TEXT,
  departure_date DATE,
  return_date DATE,
  adults INT DEFAULT 1,
  children INT DEFAULT 0,
  budget_min NUMERIC,
  budget_max NUMERIC,
  travel_preferences TEXT[] DEFAULT ARRAY[]::TEXT[],
  accommodation_preference TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'follow_up', 'quotation_sent', 'confirmed', 'closed', 'cancelled')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ENQUIRY NOTES
CREATE TABLE IF NOT EXISTS enquiry_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id UUID NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  avatar_url TEXT,
  destination TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  travel_date TEXT NOT NULL,
  verified BOOLEAN DEFAULT true,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. GALLERY
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  location TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  brand_name TEXT NOT NULL DEFAULT 'YaadgarSafar.com',
  tagline TEXT NOT NULL DEFAULT 'Make Every Journey Memorable.',
  phone TEXT NOT NULL DEFAULT '+91 98765 43210',
  whatsapp_number TEXT NOT NULL DEFAULT '919876543210',
  email TEXT NOT NULL DEFAULT 'contact@yaadgarsafar.com',
  address TEXT NOT NULL DEFAULT '104, Royal Palms Business Center, MG Road, New Delhi, India',
  business_hours TEXT NOT NULL DEFAULT 'Monday - Saturday: 9:00 AM - 8:00 PM',
  social_links JSONB DEFAULT '{"facebook": "https://facebook.com", "instagram": "https://instagram.com", "youtube": "https://youtube.com"}'::JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_itinerary ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read published data
CREATE POLICY "Public can view published destinations" ON destinations FOR SELECT USING (true);
CREATE POLICY "Public can view published packages" ON packages FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view package itineraries" ON package_itinerary FOR SELECT USING (true);
CREATE POLICY "Public can submit enquiries" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view verified reviews" ON reviews FOR SELECT USING (verified = true);
CREATE POLICY "Public can view gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (true);

-- Authenticated Admin full access
CREATE POLICY "Admins full access destinations" ON destinations FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access packages" ON packages FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access package_itinerary" ON package_itinerary FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access enquiries" ON enquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access enquiry_notes" ON enquiry_notes FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access reviews" ON reviews FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access gallery" ON gallery FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access site_settings" ON site_settings FOR ALL TO authenticated USING (true);
