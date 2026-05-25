-- AiwasLabs Database Schema
-- Run once against the Neon database to create all tables

-- ─── Extensions ────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Users ─────────────────────────────────────────────────────────────────
-- Covers both admin and patient accounts via the role column
CREATE TABLE IF NOT EXISTS users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        UNIQUE NOT NULL,
  password_hash TEXT        NOT NULL,
  role          TEXT        NOT NULL CHECK (role IN ('admin', 'patient')),
  first_name    TEXT,
  last_name     TEXT,
  phone         TEXT,
  date_of_birth DATE,
  address       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Products ──────────────────────────────────────────────────────────────
-- Blood test products managed by admin
CREATE TABLE IF NOT EXISTS products (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT        NOT NULL,
  slug            TEXT        UNIQUE NOT NULL,
  description     TEXT        NOT NULL,
  price           NUMERIC(10,2) NOT NULL,
  biomarker_count INTEGER     NOT NULL DEFAULT 0,
  images          JSONB       NOT NULL DEFAULT '[]',
  category_tags   TEXT[]      NOT NULL DEFAULT '{}',
  product_type    TEXT        NOT NULL CHECK (product_type IN ('booking', 'ship')),
  badge           TEXT,
  available       BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FAQs ──────────────────────────────────────────────────────────────────
-- Per-product FAQ items, displayed as accordion on product page
CREATE TABLE IF NOT EXISTS faqs (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID    NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  question   TEXT    NOT NULL,
  answer     TEXT    NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ─── Bookings ──────────────────────────────────────────────────────────────
-- Patient bookings: clinic visits or home kit requests
CREATE TABLE IF NOT EXISTS bookings (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id    UUID        NOT NULL REFERENCES products(id),
  booking_date  DATE        NOT NULL,
  booking_time  TIME        NOT NULL,
  booking_type  TEXT        NOT NULL CHECK (booking_type IN ('clinic', 'home')),
  status        TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Cart Items ────────────────────────────────────────────────────────────
-- Logged-in patient cart. Guests use localStorage on the frontend
CREATE TABLE IF NOT EXISTS cart_items (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (patient_id, product_id)
);

-- ─── Reports ───────────────────────────────────────────────────────────────
-- Lab reports created by admin, linked to a patient and their booking
CREATE TABLE IF NOT EXISTS reports (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  UUID        NOT NULL REFERENCES products(id),
  booking_id  UUID        REFERENCES bookings(id),
  biomarkers  JSONB       NOT NULL DEFAULT '[]',
  pdf_url     TEXT,
  sample_date DATE,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_slug          ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_available     ON products(available);
CREATE INDEX IF NOT EXISTS idx_faqs_product_id        ON faqs(product_id);
CREATE INDEX IF NOT EXISTS idx_bookings_patient_id    ON bookings(patient_id);
CREATE INDEX IF NOT EXISTS idx_bookings_product_id    ON bookings(product_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date          ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_cart_items_patient_id  ON cart_items(patient_id);
CREATE INDEX IF NOT EXISTS idx_reports_patient_id     ON reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_reports_booking_id     ON reports(booking_id);
