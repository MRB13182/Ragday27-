-- ==============================================================================
-- RAD DAY HSC 27 - COMPLETE SUPABASE DATABASE SCHEMA
-- Project ID: eodwqvodokrfnnslppve
-- Table: registered_students
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/eodwqvodokrfnnslppve/sql
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Custom Enums for Registration & Payment Status
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
-- Rules:
-- - Starts at 1 (RD27-001)
-- - Increments monotonically
-- - Atomic sequence ensures 100+ concurrent registrations never duplicate
-- - Deleting records NEVER resets or rolls back the numbering
CREATE SEQUENCE IF NOT EXISTS public.rd27_registration_seq
  START WITH 1
  INCREMENT BY 1
  MINVALUE 1
  NO CYCLE;

-- RPC Function to safely fetch next registration number
CREATE OR REPLACE FUNCTION public.get_next_registration_number()
RETURNS TEXT AS $$
DECLARE
  seq_val BIGINT;
BEGIN
  seq_val := nextval('public.rd27_registration_seq');
  RETURN 'RD27-' || LPAD(seq_val::text, 3, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create Main Table: registered_students
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

-- 5. Database-Level Trigger for Automatic Registration Number Generation (RD27-001, RD27-002...)
CREATE OR REPLACE FUNCTION public.generate_registration_number()
RETURNS TRIGGER AS $$
DECLARE
  seq_val BIGINT;
  num_part BIGINT;
BEGIN
  -- If registration_number is null, empty, or placeholder, assign sequential number from sequence
  IF NEW.registration_number IS NULL 
     OR trim(NEW.registration_number) = '' 
     OR NEW.registration_number = 'RD27-' 
     OR NEW.registration_number ILIKE '%auto%'
     OR NEW.registration_number ILIKE '%pending%' THEN
    seq_val := nextval('public.rd27_registration_seq');
    NEW.registration_number := 'RD27-' || LPAD(seq_val::text, 3, '0');
  ELSE
    -- If an explicit RD27-XXX is provided, ensure sequence stays strictly ahead
    IF NEW.registration_number ~* '^RD27-[0-9]+$' THEN
      BEGIN
        num_part := substring(NEW.registration_number from 6)::BIGINT;
        PERFORM setval('public.rd27_registration_seq', GREATEST(num_part, (SELECT last_value FROM public.rd27_registration_seq)));
      EXCEPTION WHEN OTHERS THEN
        -- proceed safely
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

-- 6. Create Optimized Indexes for Fast Searching & Filtering
CREATE INDEX IF NOT EXISTS idx_reg_students_roll ON public.registered_students (roll);
CREATE INDEX IF NOT EXISTS idx_reg_students_student_id ON public.registered_students (student_id);
CREATE INDEX IF NOT EXISTS idx_reg_students_reg_no ON public.registered_students (registration_number);
CREATE INDEX IF NOT EXISTS idx_reg_students_tx_id ON public.registered_students (transaction_id);
CREATE INDEX IF NOT EXISTS idx_reg_students_reg_status ON public.registered_students (registration_status);
CREATE INDEX IF NOT EXISTS idx_reg_students_payment_status ON public.registered_students (payment_status);
CREATE INDEX IF NOT EXISTS idx_reg_students_section ON public.registered_students (section);
CREATE INDEX IF NOT EXISTS idx_reg_students_group ON public.registered_students (group_name);
CREATE INDEX IF NOT EXISTS idx_reg_students_created_at ON public.registered_students (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reg_students_status_roll ON public.registered_students (registration_status, roll);

-- 7. Trigger for Automatically Updating updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_registered_students_updated_at ON public.registered_students;
CREATE TRIGGER trigger_registered_students_updated_at
BEFORE UPDATE ON public.registered_students
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- 8. Stored Procedures / Functions for Admin Approval & Rejection Workflow
-- APPROVE WORKFLOW:
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

-- REJECT WORKFLOW:
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

-- 9. SQL Views for Admin Dashboard
CREATE OR REPLACE VIEW public.view_pending_students AS
SELECT * FROM public.registered_students
WHERE registration_status = 'pending'
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW public.view_approved_students AS
SELECT * FROM public.registered_students
WHERE registration_status = 'approved'
ORDER BY roll ASC;

CREATE OR REPLACE VIEW public.view_rejected_students AS
SELECT * FROM public.registered_students
WHERE registration_status = 'rejected'
ORDER BY updated_at DESC;

-- 10. Export System Views
CREATE OR REPLACE VIEW public.view_approved_students_export AS
SELECT 
  full_name AS "Name",
  section AS "Section",
  roll AS "Roll",
  student_id AS "ID",
  contact_number AS "Contact",
  jersey_name AS "Jersey Name",
  jersey_number AS "Jersey Number",
  jersey_size AS "Size",
  registration_number AS "Reg No",
  transaction_id AS "Transaction ID"
FROM public.registered_students
WHERE registration_status = 'approved'
ORDER BY roll ASC;

CREATE OR REPLACE VIEW public.view_rejected_students_export AS
SELECT 
  full_name AS "Name",
  section AS "Section",
  roll AS "Roll",
  student_id AS "ID",
  contact_number AS "Contact",
  jersey_name AS "Jersey Name",
  jersey_number AS "Jersey Number",
  jersey_size AS "Size",
  registration_number AS "Reg No",
  transaction_id AS "Transaction ID"
FROM public.registered_students
WHERE registration_status = 'rejected'
ORDER BY updated_at DESC;

CREATE OR REPLACE VIEW public.view_all_students_export AS
SELECT 
  full_name AS "Name",
  section AS "Section",
  roll AS "Roll",
  student_id AS "ID",
  contact_number AS "Contact",
  jersey_name AS "Jersey Name",
  jersey_number AS "Jersey Number",
  jersey_size AS "Size",
  registration_status AS "Registration Status",
  payment_status AS "Payment Status",
  registration_number AS "Reg No",
  transaction_id AS "Transaction ID"
FROM public.registered_students
ORDER BY roll ASC;

-- 11. Row Level Security (RLS) Configuration
ALTER TABLE public.registered_students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.registered_students;
CREATE POLICY "Allow public read access" 
ON public.registered_students 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow public insert registration" ON public.registered_students;
CREATE POLICY "Allow public insert registration" 
ON public.registered_students 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin update access" ON public.registered_students;
CREATE POLICY "Allow admin update access" 
ON public.registered_students 
FOR UPDATE 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin delete access" ON public.registered_students;
CREATE POLICY "Allow admin delete access" 
ON public.registered_students 
FOR DELETE 
USING (true);

-- 12. Table & Sequence Grants for Direct Client & Admin Operations
GRANT ALL ON TABLE public.registered_students TO anon;
GRANT ALL ON TABLE public.registered_students TO authenticated;
GRANT ALL ON TABLE public.registered_students TO service_role;

GRANT ALL ON SEQUENCE public.rd27_registration_seq TO anon;
GRANT ALL ON SEQUENCE public.rd27_registration_seq TO authenticated;
GRANT ALL ON SEQUENCE public.rd27_registration_seq TO service_role;

-- 13. Function Execution Grants
GRANT EXECUTE ON FUNCTION public.approve_student(UUID) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.reject_student(UUID) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_next_registration_number() TO anon, authenticated, service_role;


