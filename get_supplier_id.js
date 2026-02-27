import { createClient } from "https://esm.sh/@supabase/supabase-js@2"\;
const supabaseUrl = 'https://txllsqeqlsabcfnhzmhf.supabase.co'\;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseKey) { console.error("no key"); process.exit(1); }
const supabase = createClient(supabaseUrl, supabaseKey);
async function run() {
  const { data } = await supabase.from('suppliers').select('id, name').eq('name', 'EuroProduce').single();
  console.log("SUPPLIER_ID:", data.id);
}
run();
