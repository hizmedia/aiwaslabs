-- Run in Neon query editor
-- Drops the old CHECK constraint and adds one that also allows 'both'

DO $$
DECLARE
  c TEXT;
BEGIN
  SELECT conname INTO c
  FROM pg_constraint
  WHERE conrelid = 'products'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%product_type%';

  IF c IS NOT NULL THEN
    EXECUTE 'ALTER TABLE products DROP CONSTRAINT ' || quote_ident(c);
  END IF;
END $$;

ALTER TABLE products
  ADD CONSTRAINT products_product_type_check
  CHECK (product_type IN ('booking', 'ship', 'both'));
