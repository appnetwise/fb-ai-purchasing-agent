-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- 1. Suppliers
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT DEFAULT 'UAE',
  lead_time_days INT DEFAULT 1,
  moq NUMERIC DEFAULT 0,
  payment_terms TEXT DEFAULT 'net 30',
  rating NUMERIC(2,1) DEFAULT 0.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Raw supplier catalog items (as-uploaded)
CREATE TABLE supplier_catalog_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,                    -- supplier's own SKU code
  name TEXT NOT NULL,                   -- raw product name
  pack TEXT,                            -- raw pack string: "10 x 1kg", "5lb", "12/900g"
  unit_price NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  normalized_sku_id UUID,              -- linked after normalization
  normalization_status TEXT DEFAULT 'pending', -- pending | matched | review | new
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(supplier_id, sku)
);

-- 3. Equivalence groups (same product across suppliers)
CREATE TABLE sku_equivalence_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_name TEXT NOT NULL,         -- "Apples Granny Smith"
  category TEXT,                        -- "Fresh Produce"
  attributes JSONB DEFAULT '{}',        -- {grade, origin, organic, brand}
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Normalized SKUs (the canonical representation)
CREATE TABLE normalized_skus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_item_id UUID REFERENCES supplier_catalog_items(id),
  supplier_id UUID REFERENCES suppliers(id),
  equiv_group_id UUID REFERENCES sku_equivalence_groups(id),
  normalized_name TEXT NOT NULL,
  pack_info JSONB NOT NULL,             -- {count, size, unit}
  total_weight_kg NUMERIC(10,4) NOT NULL,
  price_per_kg NUMERIC(10,4) NOT NULL,
  currency TEXT DEFAULT 'USD',
  embedding extensions.vector(768),                -- Gemini gemini-embedding-001 (768 dim)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Audit log for normalization decisions
CREATE TABLE normalization_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_item_id UUID REFERENCES supplier_catalog_items(id),
  action TEXT NOT NULL,                  -- 'auto_matched' | 'review_queued' | 'new_created' | 'manual_linked'
  similarity_score NUMERIC(5,4),
  matched_sku_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- HNSW index for fast similarity search
CREATE INDEX idx_normalized_skus_embedding
  ON normalized_skus
  USING hnsw (embedding extensions.vector_cosine_ops)
  WITH (m = 16, ef_construction = 200);
