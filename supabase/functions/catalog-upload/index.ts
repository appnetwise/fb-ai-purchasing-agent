import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { parse } from "https://deno.land/std@0.168.0/encoding/csv.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ──────────────────────────────────────────────────────
// Extract catalog data from an image using Gemini Vision
// ──────────────────────────────────────────────────────
async function extractFromImage(fileBytes: Uint8Array, mimeType: string, geminiKey: string): Promise<any[]> {
  const b64 = base64Encode(fileBytes);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: b64
              }
            },
            {
              text: `You are a procurement data extraction expert. This image contains a supplier product catalog, price list, or invoice.

Extract ALL product items from this image into a JSON array. For each item, extract:
- "supplier": the supplier/company name (if visible, otherwise "Unknown")  
- "sku": the product code/SKU/item number (if visible, otherwise generate like "IMG-001")
- "name": the full product name/description
- "pack": the pack size/unit (e.g., "6x1kg", "12x500ml", "1x5L")
- "unit_price": the unit price as a number (0 if not visible)
- "currency": the currency code (USD, AED, EUR, etc. — default "USD")

Return ONLY a valid JSON array, no markdown or explanation. Example:
[{"supplier":"FreshCo","sku":"FC-001","name":"Chicken Breast Boneless","pack":"6x1kg","unit_price":12.50,"currency":"AED"}]`
            }
          ]
        }],
        generationConfig: { responseMimeType: "application/json" }
      })
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini Vision API error: ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates[0].content.parts[0].text;

  try {
    return JSON.parse(text);
  } catch {
    // Try extracting JSON from markdown code block
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) return JSON.parse(jsonMatch[1]);
    throw new Error("Could not parse Gemini response as JSON");
  }
}

// ──────────────────────────────────────────────────────
// Extract catalog data from a PDF using Gemini
// ──────────────────────────────────────────────────────
async function extractFromPDF(fileBytes: Uint8Array, geminiKey: string): Promise<any[]> {
  const b64 = base64Encode(fileBytes);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: b64
              }
            },
            {
              text: `You are a procurement data extraction expert. This PDF contains a supplier product catalog, price list, or invoice.

Extract ALL product items from this document into a JSON array. For each item, extract:
- "supplier": the supplier/company name (if visible, otherwise "Unknown")
- "sku": the product code/SKU/item number (if visible, otherwise generate like "PDF-001")
- "name": the full product name/description
- "pack": the pack size/unit (e.g., "6x1kg", "12x500ml", "1x5L")
- "unit_price": the unit price as a number (0 if not visible)
- "currency": the currency code (USD, AED, EUR, etc. — default "USD")

Return ONLY a valid JSON array, no markdown or explanation.`
            }
          ]
        }],
        generationConfig: { responseMimeType: "application/json" }
      })
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini PDF API error: ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates[0].content.parts[0].text;

  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) return JSON.parse(jsonMatch[1]);
    throw new Error("Could not parse Gemini response as JSON");
  }
}

// ──────────────────────────────────────────────────────
// Parse CSV text into records
// ──────────────────────────────────────────────────────
function parseCSV(csvText: string): any[] {
  const records = parse(csvText, { skipFirstRow: true });
  return records.map((record: any) => ({
    supplier: (record.supplier || record[0] || '').toString().trim(),
    sku: (record.sku || record[1] || '').toString().trim(),
    name: (record.name || record[2] || '').toString().trim(),
    pack: (record.pack || record[3] || '').toString().trim(),
    unit_price: parseFloat(record.unit_price || record[4] || '0'),
    currency: (record.currency || record[5] || 'USD').toString().trim(),
  }));
}

// ──────────────────────────────────────────────────────
// Detect file type from name and content-type
// ──────────────────────────────────────────────────────
function getFileType(fileName: string, mimeType: string): 'csv' | 'image' | 'pdf' | 'excel' | 'unknown' {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (ext === 'csv' || mimeType === 'text/csv') return 'csv';
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'heic'].includes(ext) || mimeType.startsWith('image/')) return 'image';
  if (ext === 'pdf' || mimeType === 'application/pdf') return 'pdf';
  if (['xlsx', 'xls'].includes(ext) || mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'excel';
  return 'unknown';
}

// ══════════════════════════════════════════════════════
// MAIN HANDLER
// ══════════════════════════════════════════════════════
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const geminiKey = Deno.env.get('GEMINI_API_KEY') ?? '';
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    let records: any[] = [];
    let fileFormat = 'csv';
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file');

      if (!(file instanceof File)) throw new Error('No valid file found in form data');

      const fileName = file.name;
      const fileMimeType = file.type;
      const fileType = getFileType(fileName, fileMimeType);
      fileFormat = fileType;

      console.log(`File: ${fileName}, MIME: ${fileMimeType}, detected type: ${fileType}`);

      switch (fileType) {
        case 'csv': {
          const csvText = await file.text();
          records = parseCSV(csvText);
          break;
        }
        case 'image': {
          if (!geminiKey) throw new Error('GEMINI_API_KEY is required for image processing');
          const bytes = new Uint8Array(await file.arrayBuffer());
          records = await extractFromImage(bytes, fileMimeType || 'image/jpeg', geminiKey);
          break;
        }
        case 'pdf': {
          if (!geminiKey) throw new Error('GEMINI_API_KEY is required for PDF processing');
          const bytes = new Uint8Array(await file.arrayBuffer());
          records = await extractFromPDF(bytes, geminiKey);
          break;
        }
        case 'excel': {
          if (!geminiKey) throw new Error('GEMINI_API_KEY is required for Excel processing');
          const bytes = new Uint8Array(await file.arrayBuffer());
          records = await extractFromPDF(bytes, geminiKey);
          break;
        }
        default:
          throw new Error(`Unsupported file type: ${fileName}. Supported: CSV, Images (JPG/PNG/WebP), PDF, Excel (XLSX/XLS)`);
      }
    } else {
      // JSON body fallback
      const clonedReq = req.clone();
      try {
        const jsonBody = await clonedReq.json();
        if (jsonBody.csv_text) records = parseCSV(jsonBody.csv_text);
      } catch {
        const text = await req.text();
        if (text.trim()) records = parseCSV(text);
      }
    }

    if (records.length === 0) throw new Error('No records extracted from file');

    console.log(`Extracted ${records.length} records via ${fileFormat}`);

    // ═══════════════════════════════════════════════════════
    // Auto-detect and auto-create suppliers from file data
    // ═══════════════════════════════════════════════════════
    const supplierNames = [...new Set(
      records.map((r: any) => (r.supplier || '').toString().trim()).filter(Boolean)
    )];

    // If no supplier names found in data, use a default
    if (supplierNames.length === 0) {
      supplierNames.push('Unknown Supplier');
      records = records.map((r: any) => ({ ...r, supplier: 'Unknown Supplier' }));
    }

    // Lookup existing suppliers
    const { data: existingSuppliers, error: suppliersErr } = await supabaseClient
      .from('suppliers').select('id, name').in('name', supplierNames);
    if (suppliersErr) throw suppliersErr;
    const supplierMap = new Map((existingSuppliers || []).map(s => [s.name, s.id]));

    // Auto-create any suppliers that don't exist yet
    const newSupplierNames = supplierNames.filter(n => !supplierMap.has(n));
    if (newSupplierNames.length > 0) {
      const { data: created, error: createErr } = await supabaseClient
        .from('suppliers')
        .insert(newSupplierNames.map(name => ({ name })))
        .select('id, name');
      if (createErr) throw createErr;
      for (const s of (created || [])) {
        supplierMap.set(s.name, s.id);
      }
      console.log(`Auto-created ${newSupplierNames.length} new supplier(s): ${newSupplierNames.join(', ')}`);
    }

    const itemsToInsert = records.map((record: any) => {
      const sName = (record.supplier || 'Unknown Supplier').toString().trim();
      return {
        supplier_id: supplierMap.get(sName),
        sku: (record.sku || '').toString().trim(),
        name: (record.name || '').toString().trim(),
        pack: (record.pack || '').toString().trim(),
        unit_price: parseFloat(record.unit_price || '0') || 0,
        currency: (record.currency || 'USD').toString().trim(),
        normalization_status: 'pending'
      };
    }).filter((item: any) => item.sku !== '' && item.name !== '' && item.supplier_id);

    if (itemsToInsert.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid records extracted from file' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Upsert into supplier_catalog_items
    const { data, error } = await supabaseClient
      .from('supplier_catalog_items')
      .upsert(itemsToInsert, { onConflict: 'supplier_id,sku' })
      .select('id, name');
    if (error) throw error;

    const insertedItems = data || [];
    console.log(`Upserted ${insertedItems.length} items successfully.`);

    return new Response(JSON.stringify({
      success: true,
      format: fileFormat,
      message: `Extracted ${itemsToInsert.length} items from ${fileFormat.toUpperCase()}`,
      count: itemsToInsert.length,
      pending_ai_pipeline: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("catalog-upload error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
