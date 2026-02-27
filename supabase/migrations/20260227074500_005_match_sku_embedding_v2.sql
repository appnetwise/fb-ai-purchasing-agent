-- V2: Match against ALL normalized_skus (not just those with groups)
-- Returns both the normalized_sku_id and equiv_group_id so the caller can
-- create groups from peer matches
CREATE OR REPLACE FUNCTION match_sku_embedding_v2(
  query_embedding extensions.vector(768),
  query_sku_id uuid,
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  normalized_sku_id UUID,
  equiv_group_id UUID,
  normalized_name TEXT,
  similarity float
)
LANGUAGE sql STABLE
SET search_path = public, extensions
AS $$
  SELECT 
    ns.id AS normalized_sku_id,
    ns.equiv_group_id,
    ns.normalized_name,
    1 - (ns.embedding <=> query_embedding) AS similarity
  FROM normalized_skus ns
  WHERE ns.id != query_sku_id  -- exclude self
    AND 1 - (ns.embedding <=> query_embedding) > match_threshold
  ORDER BY ns.embedding <=> query_embedding
  LIMIT match_count;
$$;
