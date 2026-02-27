CREATE OR REPLACE FUNCTION match_sku_embedding(query_embedding extensions.vector(768), match_threshold float, match_count int)
RETURNS TABLE (
  equiv_group_id UUID,
  similarity float
)
LANGUAGE sql STABLE
SET search_path = public, extensions
AS $$
  SELECT 
    ns.equiv_group_id,
    1 - (ns.embedding <=> query_embedding) AS similarity
  FROM normalized_skus ns
  WHERE 1 - (ns.embedding <=> query_embedding) > match_threshold
    AND ns.equiv_group_id IS NOT NULL
  ORDER BY ns.embedding <=> query_embedding
  LIMIT match_count;
$$;
