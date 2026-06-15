-- Inuvi home kit order integration
-- Run once against the Neon database

-- ─── Products: add Inuvi requirement code ──────────────────────────────────
-- The requirement code is agreed with Inuvi during onboarding (e.g. "AIWA-TEST-001")
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS inuvi_requirement_code TEXT;

-- ─── Inuvi Orders ──────────────────────────────────────────────────────────
-- Separate from clinic bookings: one record per home kit ordered via Inuvi
CREATE TABLE IF NOT EXISTS inuvi_orders (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id         UUID        NOT NULL REFERENCES products(id),

  -- Inuvi API response IDs (populated after successful API call)
  inuvi_order_id     TEXT,
  inuvi_exam_id      TEXT,

  -- Kit status (updated via Inuvi webhooks)
  status             TEXT        NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'submitted', 'kit_dispatched', 'sample_received', 'results_ready', 'cancelled')),
  inuvi_status_raw   TEXT,

  -- Delivery details captured at order time
  delivery_name      TEXT        NOT NULL,
  delivery_email     TEXT        NOT NULL,
  delivery_phone     TEXT        NOT NULL,
  delivery_address   TEXT        NOT NULL,
  date_of_birth      DATE,
  notes              TEXT,

  created_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inuvi_orders_patient  ON inuvi_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_inuvi_orders_exam_id  ON inuvi_orders(inuvi_exam_id);
