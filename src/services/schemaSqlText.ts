export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- NATIONAL IDEAL COLLEGE - RAD DAY HSC 27
-- COMPLETE SUPABASE DATABASE & CMS SCHEMA
-- Project ID: eodwqvodokrfnnslppve
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/eodwqvodokrfnnslppve/sql
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Enums for Registration & Payment Status
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'registration_status_enum') THEN
    CREATE TYPE registration_status_enum AS ENUM ('pending', 'approved', 'rejected');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_enum') THEN
    CREATE TYPE payment_status_enum AS ENUM ('pending', 'verified', 'rejected');
  END IF;
END $$;

-- 3. Dedicated Sequence for Sequential Unique Registration Numbers (RD27-001, RD27-002...)
CREATE SEQUENCE IF NOT EXISTS public.rd27_reg_seq
  START WITH 1
  INCREMENT BY 1
  MINVALUE 1
  NO CYCLE;

-- 4. Student Registrations Table
CREATE TABLE IF NOT EXISTS public.registered_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  section TEXT NOT NULL,
  roll TEXT NOT NULL,
  student_id TEXT,
  contact_number TEXT NOT NULL,
  jersey_name TEXT NOT NULL,
  jersey_number TEXT NOT NULL,
  jersey_size TEXT NOT NULL,
  transaction_id TEXT NOT NULL UNIQUE,
  registration_number TEXT NOT NULL UNIQUE,
  photo_url TEXT,
  payment_method TEXT DEFAULT 'Bkash',
  group_name TEXT DEFAULT 'Science',
  payment_status payment_status_enum NOT NULL DEFAULT 'pending',
  registration_status registration_status_enum NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Trigger for Sequential RD27-001 Registration Numbers
CREATE OR REPLACE FUNCTION public.generate_registration_number()
RETURNS TRIGGER AS $$
DECLARE
  seq_val BIGINT;
  num_part BIGINT;
BEGIN
  IF NEW.registration_number IS NULL 
     OR trim(NEW.registration_number) = '' 
     OR NEW.registration_number = 'RD27-' 
     OR NEW.registration_number ILIKE '%auto%' THEN
    seq_val := nextval('public.rd27_reg_seq');
    NEW.registration_number := 'RD27-' || LPAD(seq_val::text, 3, '0');
  ELSE
    IF NEW.registration_number ~* '^RD27-[0-9]+$' THEN
      BEGIN
        num_part := substring(NEW.registration_number from 6)::BIGINT;
        PERFORM setval('public.rd27_reg_seq', GREATEST(num_part, (SELECT last_value FROM public.rd27_reg_seq)));
      EXCEPTION WHEN OTHERS THEN
      END;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_registration_number ON public.registered_students;
CREATE TRIGGER trigger_generate_registration_number
BEFORE INSERT ON public.registered_students
FOR EACH ROW
EXECUTE FUNCTION public.generate_registration_number();

-- 6. CMS TABLE: site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  college_name TEXT NOT NULL DEFAULT 'National Ideal College',
  batch_name TEXT NOT NULL DEFAULT 'HSC Batch 2027',
  event_date TEXT NOT NULL DEFAULT '27 February 2024',
  event_time TEXT NOT NULL DEFAULT '10:00 AM - 5:00 PM',
  event_venue TEXT NOT NULL DEFAULT 'NIC Campus',
  hero_top_quote TEXT NOT NULL DEFAULT 'Last Chapter → Brighter Tomorrow',
  hero_title TEXT NOT NULL DEFAULT 'RAD DAY',
  hero_subtitle TEXT NOT NULL DEFAULT 'HSC 27',
  hero_tagline TEXT NOT NULL DEFAULT 'MEMORIES NEVER FADE',
  quote_spark TEXT NOT NULL DEFAULT 'Start With A Spark',
  quote_mark TEXT NOT NULL DEFAULT 'End With A Mark',
  footer_quote TEXT NOT NULL DEFAULT 'Same People Different Destinations',
  copyright_text TEXT NOT NULL DEFAULT 'National Ideal College • HSC Batch 2027 • All Rights Reserved',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. CMS TABLE: site_assets
CREATE TABLE IF NOT EXISTS public.site_assets (
  id TEXT PRIMARY KEY DEFAULT 'current',
  college_logo TEXT NOT NULL DEFAULT '/logo/college-logo.png',
  header_logo TEXT NOT NULL DEFAULT '/logo/college-logo.png',
  footer_logo TEXT NOT NULL DEFAULT '/logo/college-logo.png',
  favicon TEXT NOT NULL DEFAULT '/logo/favicon.png',
  jersey_front TEXT NOT NULL DEFAULT '/jersey/jersey-front.png',
  jersey_back TEXT NOT NULL DEFAULT '/jersey/jersey-back.png',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. CMS TABLE: jersey_fonts
CREATE TABLE IF NOT EXISTS public.jersey_fonts (
  font_key TEXT PRIMARY KEY, -- font_0, font_1, ... font_9
  digit INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. CMS TABLE: website_banners
CREATE TABLE IF NOT EXISTS public.website_banners (
  id TEXT PRIMARY KEY DEFAULT 'current',
  rad_day_main_banner TEXT NOT NULL DEFAULT '/banner/main-banner.jpg',
  quote_banner TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1200&auto=format&fit=crop&q=80',
  motivation_banner TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
  footer_banner TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. CMS TABLE: social_links
CREATE TABLE IF NOT EXISTS public.social_links (
  id TEXT PRIMARY KEY DEFAULT 'current',
  facebook_link TEXT NOT NULL DEFAULT 'https://facebook.com',
  instagram_link TEXT NOT NULL DEFAULT 'https://instagram.com',
  youtube_link TEXT NOT NULL DEFAULT 'https://youtube.com',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. CMS TABLE: registration_settings
CREATE TABLE IF NOT EXISTS public.registration_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  registration_fee NUMERIC NOT NULL DEFAULT 1050,
  extra_charge_4xl NUMERIC NOT NULL DEFAULT 50,
  payment_number TEXT NOT NULL DEFAULT '01712345678',
  nagad_number TEXT NOT NULL DEFAULT '01812345678',
  payment_instructions TEXT NOT NULL DEFAULT 'Send Money (Personal) to the official bKash or Nagad number above. Keep your Transaction ID ready.',
  is_open BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Seed Default Records
INSERT INTO public.site_settings (id) VALUES ('current') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.site_assets (id) VALUES ('current') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.website_banners (id) VALUES ('current') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.social_links (id) VALUES ('current') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.registration_settings (id) VALUES ('current') ON CONFLICT (id) DO NOTHING;

-- 13. Enable RLS and Permissive Policies
ALTER TABLE public.registered_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jersey_fonts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_settings ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['registered_students', 'site_settings', 'site_assets', 'jersey_fonts', 'website_banners', 'social_links', 'registration_settings'])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public select on %I" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public select on %I" ON public.%I FOR SELECT USING (true)', tbl, tbl);

    EXECUTE format('DROP POLICY IF EXISTS "Public insert on %I" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public insert on %I" ON public.%I FOR INSERT WITH CHECK (true)', tbl, tbl);

    EXECUTE format('DROP POLICY IF EXISTS "Public update on %I" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public update on %I" ON public.%I FOR UPDATE USING (true) WITH CHECK (true)', tbl, tbl);

    EXECUTE format('DROP POLICY IF EXISTS "Public delete on %I" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public delete on %I" ON public.%I FOR DELETE USING (true)', tbl, tbl);
  END LOOP;
END $$;

-- 14. Admin Functions for Approve / Reject
CREATE OR REPLACE FUNCTION public.approve_student(student_record_id UUID)
RETURNS public.registered_students AS $$
DECLARE
  updated_student public.registered_students;
BEGIN
  UPDATE public.registered_students
  SET 
    registration_status = 'approved',
    payment_status = 'verified',
    updated_at = timezone('utc'::text, now())
  WHERE id = student_record_id
  RETURNING * INTO updated_student;

  RETURN updated_student;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.reject_student(student_record_id UUID)
RETURNS public.registered_students AS $$
DECLARE
  updated_student public.registered_students;
BEGIN
  UPDATE public.registered_students
  SET 
    registration_status = 'rejected',
    payment_status = 'rejected',
    updated_at = timezone('utc'::text, now())
  WHERE id = student_record_id
  RETURNING * INTO updated_student;

  RETURN updated_student;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;
