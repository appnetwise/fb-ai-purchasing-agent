// test-pipeline.js
// Run this with Node.js 18+ (which has native fetch)
// usage: node test-pipeline.js

// Replace these with your actual Supabase project URL and keys if needed
const supabaseUrl = 'https://txllsqeqlsabcfnhzmhf.supabase.co';

// Note: To test the pipeline, we invoke the 'test-pipeline' edge function directly.
// This function internally orchestrates calling 'normalize-sku' and 'match-skus'
// for any records in 'supplier_catalog_items' that have normalization_status = 'pending'.

async function runPipeline() {
    console.log("Triggering the Supabase test-pipeline Edge Function...");

    try {
        const response = await fetch(`${supabaseUrl}/functions/v1/test-pipeline`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // If the edge function requires auth, you would pass the Bearer token here:
                // 'Authorization': `Bearer YOUR_ANON_OR_SERVICE_KEY`
                // But our test-pipeline is set up to bypass JWT for internal testing (--no-verify-jwt)
            }
        });

        const resultText = await response.text();
        let result;
        try {
            result = JSON.parse(resultText);
        } catch (e) {
            console.error("Failed to parse JSON response. Raw text:", resultText);
            return;
        }

        if (!response.ok) {
            console.error("Pipeline Error:", result.error || result);
            return;
        }

        console.log("Pipeline Execution Successful!\n");
        console.log("Processed Items:", result.processed);

        if (result.results && result.results.length > 0) {
            console.log("\nDetails:");
            result.results.forEach(r => {
                console.log(`- ${r.item} -> Cleaned as: ${r.clean_name} | Action: ${r.action} (Similarity: ${r.similarity})`);
            });
        } else {
            console.log("No pending items found to normalize.");
        }

        console.log("\nTo test with new data:");
        console.log("1. Go to Supabase Dashboard > Table Editor > supplier_catalog_items");
        console.log("2. Insert a new row (e.g., 'Red Apples', pack: '1 box', unit_price: 15.00, status: 'pending')");
        console.log("3. Run this script again: node test-pipeline.js");

    } catch (err) {
        console.error("Network error:", err);
    }
}

runPipeline();
