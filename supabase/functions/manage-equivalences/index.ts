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

    const method = req.method;

    if (method === 'GET') {
      // List equivalence groups
      const { data, error } = await supabaseClient
        .from('sku_equivalence_groups')
        .select(`
          id, canonical_name, category, 
          normalized_skus ( id, price_per_kg, supplier_id )
        `);

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (method === 'POST') {
      const { action, normalized_sku_id, equiv_group_id, new_name } = await req.json();

      if (action === 'create_group') {
        const { data, error } = await supabaseClient
          .from('sku_equivalence_groups')
          .insert({ canonical_name: new_name })
          .select()
          .single();
        if (error) throw error;
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (action === 'link_sku') {
        // manually link a sku to a group
        const { error } = await supabaseClient
          .from('normalized_skus')
          .update({ equiv_group_id })
          .eq('id', normalized_sku_id);
        if (error) throw error;

        // update status to matched
        // first get catalog item id
        const { data: nSku } = await supabaseClient.from('normalized_skus').select('catalog_item_id').eq('id', normalized_sku_id).single();
        if (nSku) {
          await supabaseClient.from('supplier_catalog_items')
            .update({ normalization_status: 'matched' }).eq('id', nSku.catalog_item_id);
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    throw new Error("Method not supported or invalid action");

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
