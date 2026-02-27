-- Fix unindexed foreign keys flagged by Supabase advisor
CREATE INDEX IF NOT EXISTS idx_normalization_audit_log_catalog_item_id
  ON normalization_audit_log(catalog_item_id);

CREATE INDEX IF NOT EXISTS idx_normalized_skus_catalog_item_id
  ON normalized_skus(catalog_item_id);

CREATE INDEX IF NOT EXISTS idx_normalized_skus_equiv_group_id
  ON normalized_skus(equiv_group_id);

CREATE INDEX IF NOT EXISTS idx_normalized_skus_supplier_id
  ON normalized_skus(supplier_id);

-- Useful lookup indexes
CREATE INDEX IF NOT EXISTS idx_supplier_catalog_items_status
  ON supplier_catalog_items(normalization_status);

CREATE INDEX IF NOT EXISTS idx_supplier_catalog_items_normalized_sku_id
  ON supplier_catalog_items(normalized_sku_id);
