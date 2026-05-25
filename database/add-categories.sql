-- Run this in Neon query editor (one-off migration)

CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  sort_order  INT  NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories (sort_order);

-- Seed the five existing hardcoded categories
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Best Sellers',      'best-sellers',  1),
  ('Men''s Health',     'mens-health',   2),
  ('Women''s Health',   'womens-health', 3),
  ('Same-Day Results',  'same-day',      4),
  ('Advanced Packages', 'advanced',      5)
ON CONFLICT (slug) DO NOTHING;
