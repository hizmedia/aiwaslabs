-- Add test_info JSONB column to products table
-- Stores the "Know What You're Taking" section data:
-- {
--   what: { introTitle, intro, measures: [{ title, desc, bullets[] }] },
--   prepare: [{ title, detail, important }],
--   limits: { poctNotes[], cautions[], factors: [{ factor, desc }] }
-- }

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS test_info JSONB;
