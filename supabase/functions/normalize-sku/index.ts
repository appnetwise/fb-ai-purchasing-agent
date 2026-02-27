import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function parsePack(packStr: string) {
  if (!packStr) return { count: 1, size: 1, unit: 'unknown' };

  // Clean string: remove HTML entities like &nbsp;, normalize commas in numbers
  let cleanStr = packStr.replace(/&nbsp;/g, ' ')
    .replace(/(\d),(\d)/g, '$1$2')
    .trim();

  // Protect against delimiter collisions (e.g., Brand-A-10x5kg). We only want to parse the end of the string ideally.
  // Match NxM (e.g., 10 x 5kg, 12/900g, 4-2.5kg). The '-' is tricky without context, so we look for boundary or strictly x/X/×
  const matchNxM = cleanStr.match(/(?:^|\s)([\d.]+)\s*(?:x|X|×|\/)\s*([\d.]+)\s*([a-zA-Z]+)/);
  if (matchNxM) {
    return {
      count: parseFloat(matchNxM[1]),
      size: parseFloat(matchNxM[2]),
      unit: matchNxM[3].toLowerCase()
    };
  }

  // Fallback for tricky dash packs (e.g. 5-10kg) ONLY if not a product name collision
  const matchDash = cleanStr.match(/(?:^|\s)([\d.]+)\s*-\s*([\d.]+)\s*([a-zA-Z]+)$/);
  if (matchDash) {
    return {
      count: parseFloat(matchDash[1]),
      size: parseFloat(matchDash[2]),
      unit: matchDash[3].toLowerCase()
    };
  }

  // Matches "5lb", "10kg", "900g"
  const matchNunit = cleanStr.match(/([\d.]+)\s*([a-zA-Z]+)/);
  if (matchNunit) {
    return {
      count: 1,
      size: parseFloat(matchNunit[1]),
      unit: matchNunit[2].toLowerCase()
    };
  }

  return { count: 1, size: 1, unit: 'unknown' };
}

function toKg(size: number, unit: string) {
  switch (unit) {
    case 'kg': return size;
    case 'g':
    case 'gms': return size / 1000;
    case 'lb':
    case 'lbs': return size * 0.453592;
    case 'oz': return size * 0.0283495;
    case 'l':
    case 'liters':
    case 'liter': return size; // approx 1kg for water/liquids
    case 'ml': return size / 1000;
    default: return size;
  }
}

function extractLLMJson(rawText: string) {
  try {
    // Attempt parsing directly
    return JSON.parse(rawText);
  } catch (e) {
    // Fallback: strip markdown JSON block wrappers
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    throw new Error("Unable to parse expected JSON from LLM: " + rawText);
  }
}

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { item_id } = await req.json();
    if (!item_id) {
      throw new Error("item_id is required");
    }

    // 1. Fetch raw item
    const { data: item, error: fetchErr } = await supabaseClient
      .from('supplier_catalog_items')
      .select('*, suppliers(id)')
      .eq('id', item_id)
      .single();

    if (fetchErr || !item) throw new Error("Item not found");

    // 2. Parse Pack and Price
    const packInfo = parsePack(item.pack || '');
    let effectiveSize = packInfo.size || 1;
    let totalWeightKg = packInfo.count * toKg(effectiveSize, packInfo.unit);
    if (totalWeightKg === 0) totalWeightKg = 1; // Prevent division by zero
    const pricePerKg = item.unit_price / totalWeightKg;

    // 3. Clean Name with Gemini 2.5 Flash
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiKey) throw new Error("GEMINI_API_KEY not configured");

    const chatRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Extract the clean, canonical product name and general food category from this raw supplier string: "${item.name}". Return ONLY valid JSON: { "canonical_name": "string", "category": "string" }` }]
        }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!chatRes.ok) {
      const errText = await chatRes.text();
      throw new Error(`Gemini generateContent failed: ${chatRes.status} ${errText}`);
    }

    const chatData = await chatRes.json();
    const cleanJSONStr = chatData.candidates[0].content.parts[0].text;
    const cleanInfo = extractLLMJson(cleanJSONStr);

    const cleanName = cleanInfo.canonical_name;
    const category = cleanInfo.category;

    // 4. Generate Embedding with gemini-embedding-001
    const embedRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${geminiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/gemini-embedding-001",
        content: {
          parts: [{ text: `Product: ${cleanName}, Category: ${category}` }]
        },
        taskType: "SEMANTIC_SIMILARITY",
        outputDimensionality: 768
      })
    });

    if (!embedRes.ok) {
      const errText = await embedRes.text();
      throw new Error(`Gemini embedContent failed: ${embedRes.status} ${errText}`);
    }
    const embedData = await embedRes.json();
    const embeddingValues = embedData.embedding.values;

    // 5. Save to normalized_skus
    const { data: normalizedSku, error: insertErr } = await supabaseClient
      .from('normalized_skus')
      .insert({
        catalog_item_id: item.id,
        supplier_id: item.supplier_id,
        normalized_name: cleanName,
        pack_info: packInfo,
        total_weight_kg: totalWeightKg,
        price_per_kg: pricePerKg,
        currency: item.currency,
        embedding: `[${embeddingValues.join(',')}]`
      })
      .select('id')
      .single();

    if (insertErr) throw insertErr;

    // Update status to 'normalized' instead of 'pending'
    await supabaseClient
      .from('supplier_catalog_items')
      .update({ normalization_status: 'normalized', normalized_sku_id: normalizedSku.id })
      .eq('id', item.id);

    return new Response(JSON.stringify({
      success: true,
      normalized_sku_id: normalizedSku.id,
      clean_name: cleanName,
      price_per_kg: pricePerKg
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("normalize-sku error:", error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
