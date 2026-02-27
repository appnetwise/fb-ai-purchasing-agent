import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function extractLLMJson(rawText: string) {
  try {
    return JSON.parse(rawText);
  } catch {
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    throw new Error("Unable to parse JSON from LLM: " + rawText);
  }
}

async function confirmMatchWithLLM(
  itemName: string,
  candidateName: string,
  geminiKey: string
): Promise<{ is_same: boolean; confidence: number }> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a food procurement expert comparing supplier catalog items.

Are these two product names referring to the SAME product (just from different suppliers with different naming)?

Product A: "${itemName}"
Product B: "${candidateName}"

Consider:
- Ignore brand/supplier differences
- "Basmati Rice" and "Basmati Rice Long Grain" = SAME
- "Jasmine Rice" and "Basmati Rice" = DIFFERENT (different rice types)
- "Tomato Passata" and "Italian Tomato Sauce" = SAME (passata is a type of tomato sauce)
- "Salmon Fillet" and "Salmon Fillets" = SAME
- "Mozzarella Cheese" and "Mozzarella Ball" = SAME

Return ONLY JSON: { "is_same": true/false, "confidence": 0.0-1.0 }`
            }]
          }],
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );

    if (!res.ok) return { is_same: false, confidence: 0 };
    const data = await res.json();
    const text = data.candidates[0].content.parts[0].text;
    return extractLLMJson(text);
  } catch {
    return { is_same: false, confidence: 0 };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const geminiKey = Deno.env.get('GEMINI_API_KEY') ?? '';
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    const { normalized_sku_id } = await req.json();
    if (!normalized_sku_id) {
      throw new Error("normalized_sku_id is required");
    }

    // 1. Fetch normalized item
    const { data: item, error: fetchErr } = await supabaseClient
      .from('normalized_skus')
      .select('*, supplier_catalog_items(id, name, sku)')
      .eq('id', normalized_sku_id)
      .single();

    if (fetchErr || !item) throw new Error("Item not found");

    if (item.equiv_group_id) {
      return new Response(JSON.stringify({ message: "Already matched", equiv_group_id: item.equiv_group_id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Query matches using V2 RPC — matches against ALL normalized_skus
    const { data: matches, error: rpcErr } = await supabaseClient
      .rpc('match_sku_embedding_v2', {
        query_embedding: item.embedding,
        query_sku_id: normalized_sku_id,
        match_threshold: 0.75,
        match_count: 5
      });

    if (rpcErr) throw rpcErr;

    const bestMatch = matches && matches.length > 0 ? matches[0] : null;

    let action = '';
    let finalEquivGroupId = null;
    let matchSimilarity = bestMatch ? bestMatch.similarity : 0;

    if (bestMatch && bestMatch.similarity >= 0.92) {
      // High confidence — auto match
      action = 'auto_matched';
      if (bestMatch.equiv_group_id) {
        finalEquivGroupId = bestMatch.equiv_group_id;
      } else {
        // Peer has no group yet — create one and link both
        const { data: newGroup, error: groupErr } = await supabaseClient
          .from('sku_equivalence_groups')
          .insert({
            canonical_name: item.normalized_name,
            category: 'General'
          })
          .select('id')
          .single();
        if (groupErr) throw groupErr;
        finalEquivGroupId = newGroup.id;

        // Also link the peer to this new group
        await supabaseClient
          .from('normalized_skus')
          .update({ equiv_group_id: newGroup.id })
          .eq('id', bestMatch.normalized_sku_id);

        // Update peer's catalog item status
        const { data: peerSku } = await supabaseClient.from('normalized_skus')
          .select('catalog_item_id').eq('id', bestMatch.normalized_sku_id).single();
        if (peerSku) {
          await supabaseClient.from('supplier_catalog_items')
            .update({ normalization_status: 'matched' })
            .eq('id', peerSku.catalog_item_id);
        }
      }
    } else if (bestMatch && bestMatch.similarity >= 0.78) {
      // Medium confidence — use LLM to confirm
      if (geminiKey) {
        const llmResult = await confirmMatchWithLLM(
          item.normalized_name,
          bestMatch.normalized_name,
          geminiKey
        );

        if (llmResult.is_same && llmResult.confidence >= 0.7) {
          action = 'auto_matched';
          matchSimilarity = Math.max(bestMatch.similarity, llmResult.confidence);

          if (bestMatch.equiv_group_id) {
            finalEquivGroupId = bestMatch.equiv_group_id;
          } else {
            // Create group and link both
            const { data: newGroup, error: groupErr } = await supabaseClient
              .from('sku_equivalence_groups')
              .insert({
                canonical_name: item.normalized_name,
                category: 'General'
              })
              .select('id')
              .single();
            if (groupErr) throw groupErr;
            finalEquivGroupId = newGroup.id;

            await supabaseClient
              .from('normalized_skus')
              .update({ equiv_group_id: newGroup.id })
              .eq('id', bestMatch.normalized_sku_id);

            const { data: peerSku } = await supabaseClient.from('normalized_skus')
              .select('catalog_item_id').eq('id', bestMatch.normalized_sku_id).single();
            if (peerSku) {
              await supabaseClient.from('supplier_catalog_items')
                .update({ normalization_status: 'matched' })
                .eq('id', peerSku.catalog_item_id);
            }
          }
        } else {
          action = 'review_queued';
        }
      } else {
        action = 'review_queued';
      }
    } else {
      // No good match found — create a new group
      action = 'new_created';
      const { data: newGroup, error: groupErr } = await supabaseClient
        .from('sku_equivalence_groups')
        .insert({
          canonical_name: item.normalized_name,
          category: 'General'
        })
        .select('id')
        .single();

      if (groupErr) throw groupErr;
      finalEquivGroupId = newGroup.id;
    }

    // 3. Update normalized_sku if we found/created a group
    if (finalEquivGroupId) {
      await supabaseClient
        .from('normalized_skus')
        .update({ equiv_group_id: finalEquivGroupId })
        .eq('id', normalized_sku_id);
    }

    // Update catalog item status
    await supabaseClient
      .from('supplier_catalog_items')
      .update({ normalization_status: action === 'review_queued' ? 'review' : 'matched' })
      .eq('id', item.catalog_item_id);

    // 4. Log Audit
    await supabaseClient
      .from('normalization_audit_log')
      .insert({
        catalog_item_id: item.catalog_item_id,
        action: action,
        similarity_score: matchSimilarity,
        matched_sku_id: normalized_sku_id,
        details: {
          best_match_group_id: bestMatch?.equiv_group_id,
          best_match_name: bestMatch?.normalized_name,
          best_match_similarity: bestMatch?.similarity
        }
      });

    return new Response(JSON.stringify({
      success: true,
      action,
      similarity: matchSimilarity,
      equiv_group_id: finalEquivGroupId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("match-skus error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
