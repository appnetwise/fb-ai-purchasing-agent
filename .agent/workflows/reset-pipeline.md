---
description: How to reset and re-run the SKU normalization pipeline
---

# SKU Normalization Pipeline — CLI Commands

## Prerequisites

Make sure you have the Supabase CLI installed and linked:

```bash
# Install (if not already)
npm install -g supabase

# Link to project (one-time)
npx supabase link --project-ref txllsqeqlsabcfnhzmhf
```

## Reset Pipeline (Clear All Normalized Data)

Run this SQL to clear all normalization results while keeping your raw catalog items:

```bash
# Reset normalization data only (keeps raw catalog items)
npx supabase db execute --project-ref txllsqeqlsabcfnhzmhf "
  DELETE FROM normalization_audit_log;
  DELETE FROM normalized_skus;
  DELETE FROM sku_equivalence_groups;
  UPDATE supplier_catalog_items SET normalization_status = 'pending', normalized_sku_id = NULL, updated_at = now();
"
```

## Full Reset (Clear Everything Including Raw Items)

```bash
# Nuclear reset — clears ALL data
npx supabase db execute --project-ref txllsqeqlsabcfnhzmhf "
  DELETE FROM normalization_audit_log;
  DELETE FROM normalized_skus;
  DELETE FROM sku_equivalence_groups;
  DELETE FROM supplier_catalog_items;
"
```

## Re-Run the Two-Pass Pipeline

After resetting, trigger the pipeline to process all pending items:

```bash
# Trigger the two-pass pipeline (normalize all → match all)
curl -s -X POST https://txllsqeqlsabcfnhzmhf.supabase.co/functions/v1/test-pipeline \
  -H "Content-Type: application/json" | jq .
```

## Check Pipeline Status

```bash
# Check current state of items
npx supabase db execute --project-ref txllsqeqlsabcfnhzmhf "
  SELECT normalization_status, count(*) 
  FROM supplier_catalog_items 
  GROUP BY normalization_status;
"

# Check equivalence groups
npx supabase db execute --project-ref txllsqeqlsabcfnhzmhf "
  SELECT seg.canonical_name, count(ns.id) as members
  FROM sku_equivalence_groups seg
  JOIN normalized_skus ns ON ns.equiv_group_id = seg.id
  GROUP BY seg.id, seg.canonical_name
  ORDER BY members DESC;
"
```

## Deploy Edge Functions

```bash
cd /home/faiza/dev/AppNetWise/fb-ai-purchasing-agent

# Deploy a specific function
npx supabase functions deploy catalog-upload --no-verify-jwt --project-ref txllsqeqlsabcfnhzmhf
npx supabase functions deploy match-skus --no-verify-jwt --project-ref txllsqeqlsabcfnhzmhf
npx supabase functions deploy normalize-sku --no-verify-jwt --project-ref txllsqeqlsabcfnhzmhf
npx supabase functions deploy test-pipeline --no-verify-jwt --project-ref txllsqeqlsabcfnhzmhf

# Deploy ALL functions at once
npx supabase functions deploy --project-ref txllsqeqlsabcfnhzmhf
```

## View Edge Function Logs

```bash
# Tail logs for a specific function
npx supabase functions logs catalog-upload --project-ref txllsqeqlsabcfnhzmhf

# Or check in the dashboard
# https://supabase.com/dashboard/project/txllsqeqlsabcfnhzmhf/functions
```
