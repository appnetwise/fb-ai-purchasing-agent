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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { equiv_group_id } = await req.json();

    if (!equiv_group_id) {
      throw new Error("equiv_group_id is required");
    }

    // Fetch the equivalence group and all normalized SKUs linked to it
    const { data: group, error: groupErr } = await supabaseClient
      .from('sku_equivalence_groups')
      .select(`
        id, 
        canonical_name, 
        category,
        normalized_skus!inner(
          id,
          normalized_name,
          pack_info,
          total_weight_kg,
          price_per_kg,
          currency,
          supplier_catalog_items!inner(sku, name, pack, unit_price),
          suppliers!inner(id, name, lead_time_days, moq, rating, country)
        )
      `)
      .eq('id', equiv_group_id)
      .single();

    if (groupErr || !group) {
      throw new Error("Equivalence group not found");
    }

    // Sort the normalized SKUs by price_per_kg ascending
    const sortedSkus = group.normalized_skus.sort((a, b) => a.price_per_kg - b.price_per_kg);

    const result = {
      product: group.canonical_name,
      category: group.category,
      suppliers: sortedSkus.map(sku => ({
        supplier_name: sku.suppliers.name,
        supplier_rating: sku.suppliers.rating,
        lead_time_days: sku.suppliers.lead_time_days,
        supplier_id: sku.suppliers.id,
        original_sku: sku.supplier_catalog_items.sku,
        original_name: sku.supplier_catalog_items.name,
        original_pack: sku.supplier_catalog_items.pack,
        original_price: sku.supplier_catalog_items.unit_price,
        normalized_pack: sku.pack_info,
        total_weight_kg: sku.total_weight_kg,
        price_per_kg: sku.price_per_kg,
        currency: sku.currency
      }))
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
