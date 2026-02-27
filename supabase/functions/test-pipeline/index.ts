import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    let reqData = {};
    if (req.body) {
      try { reqData = await req.json(); } catch (e) { /* ignore empty body */ }
    }
    const limitParams = reqData.limit ? parseInt(reqData.limit) : 20;

    console.log(`Fetching pending catalog items (limit: ${limitParams})...`);

    // First figure out the total pending so frontend knows when to stop
    const { count: pendingCountTotal, error: countErr } = await supabase
      .from('supplier_catalog_items')
      .select('id', { count: 'exact', head: true })
      .in('normalization_status', ['pending', 'normalized']);

    if (countErr) throw new Error(`Error fetching total count: ${countErr.message}`);

    const { data: items, error } = await supabase
      .from('supplier_catalog_items')
      .select('id, name')
      .eq('normalization_status', 'pending')
      .limit(limitParams);

    if (error) throw new Error(`Error fetching items: ${error.message}`);

    const fetchedPendingCount = items?.length || 0;
    const remainingLimit = limitParams - fetchedPendingCount;

    let stuckItems = [];
    if (remainingLimit > 0) {
      console.log(`Fetching stuck normalized items (limit: ${remainingLimit})...`);
      const { data: stuckData, error: stuckErr } = await supabase
        .from('supplier_catalog_items')
        .select('id, name, normalized_sku_id')
        .eq('normalization_status', 'normalized')
        .not('normalized_sku_id', 'is', null)
        .limit(remainingLimit);

      if (stuckErr) throw new Error(`Error fetching stuck items: ${stuckErr.message}`);
      stuckItems = stuckData || [];
    }

    const totalToProcess = fetchedPendingCount + stuckItems.length;
    const itemsRemaining = Math.max(0, (pendingCountTotal || 0) - totalToProcess);

    console.log(`Found ${fetchedPendingCount} pending items and ${stuckItems.length} stuck items to process.`);
    if (totalToProcess === 0) {
      return new Response(JSON.stringify({
        success: true,
        processed: 0,
        results: [],
        message: "No items to process",
        remaining: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ═══════════════════════════════════════════════════════
    // PASS 1: Normalize ALL pending items first (create embeddings)
    // ═══════════════════════════════════════════════════════
    console.log("=== PASS 1: Normalizing all items ===");
    const normalizedItems: { id: string; name: string; normalized_sku_id: string; clean_name: string }[] = [];

    // First add the stuck ones to the second pass list directly
    for (const stuck of stuckItems) {
      normalizedItems.push({
        id: stuck.id,
        name: stuck.name,
        normalized_sku_id: stuck.normalized_sku_id,
        clean_name: stuck.name // Fallback for name since we already generated the embedding
      });
    }

    // Now process the pending ones
    for (const item of items) {
      console.log(`Normalizing: ${item.name}`);
      const normRes = await fetch(`${supabaseUrl}/functions/v1/normalize-sku`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseKey}` },
        body: JSON.stringify({ item_id: item.id })
      });

      const normText = await normRes.text();
      let normData;
      try { normData = JSON.parse(normText); } catch { normData = { error: normText }; }

      if (!normRes.ok || normData?.error) {
        console.error(`Normalization failed for ${item.name}: ${normData?.error}`);
        continue;
      }

      normalizedItems.push({
        id: item.id,
        name: item.name,
        normalized_sku_id: normData.normalized_sku_id,
        clean_name: normData.clean_name
      });
    }

    console.log(`Pass 1 complete: ${normalizedItems.length}/${totalToProcess} ready for matching`);

    // ═══════════════════════════════════════════════════════
    // PASS 2: Match ALL items (all embeddings now available)
    // ═══════════════════════════════════════════════════════
    console.log("=== PASS 2: Matching all items ===");
    const results = [];

    for (const nItem of normalizedItems) {
      console.log(`Matching: ${nItem.clean_name}`);
      const matchRes = await fetch(`${supabaseUrl}/functions/v1/match-skus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseKey}` },
        body: JSON.stringify({ normalized_sku_id: nItem.normalized_sku_id })
      });

      const matchText = await matchRes.text();
      let matchData;
      try { matchData = JSON.parse(matchText); } catch { matchData = { error: matchText }; }

      if (!matchRes.ok || matchData?.error) {
        results.push({ item: nItem.name, status: "Failed Matching", error: matchData?.error || matchText });
        continue;
      }

      results.push({
        item: nItem.name,
        clean_name: nItem.clean_name,
        action: matchData.action,
        similarity: matchData.similarity,
        equiv_group_id: matchData.equiv_group_id
      });
    }

    const autoMatched = results.filter(r => r.action === 'auto_matched').length;
    const newCreated = results.filter(r => r.action === 'new_created').length;
    const reviewQueued = results.filter(r => r.action === 'review_queued').length;

    return new Response(JSON.stringify({
      success: true,
      processed: totalToProcess,
      remaining: itemsRemaining,
      summary: { auto_matched: autoMatched, new_created: newCreated, review_queued: reviewQueued },
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
