import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Make sure to set SUPABASE_URL and SUPABASE_ANON_KEY env variables before running
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
    Deno.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runPipeline() {
    console.log("Fetching pending catalog items...");
    const { data: items, error } = await supabase
        .from('supplier_catalog_items')
        .select('id, name')
        .eq('normalization_status', 'pending');

    if (error) {
        console.error("Error fetching items:", error);
        return;
    }

    console.log(`Found ${items.length} items to process.`);

    for (const item of items) {
        console.log(`\nProcessing: ${item.name} (ID: ${item.id})`);

        // 1. Normalize
        const { data: normData, error: normErr } = await supabase.functions.invoke('normalize-sku', {
            body: { item_id: item.id }
        });

        if (normErr || normData.error) {
            console.error("Normalization failed:", normErr || normData.error);
            continue;
        }

        console.log(`Normalized to: ${normData.clean_name}`);

        // 2. Match
        const { data: matchData, error: matchErr } = await supabase.functions.invoke('match-skus', {
            body: { normalized_sku_id: normData.normalized_sku_id }
        });

        if (matchErr || matchData.error) {
            console.error("Matching failed:", matchErr || matchData.error);
            continue;
        }

        console.log(`Match Result: ${matchData.action} (Similarity: ${matchData.similarity.toFixed(3)}) -> Group ID: ${matchData.equiv_group_id}`);
    }

    console.log("\nPipeline complete!");
}

runPipeline();
