import { parse } from "https://deno.land/std@0.168.0/encoding/csv.ts"\;
const csvText = `supplier,sku,name,pack,unit_price,currency
GlobalFoods,GFD-001,Fresh Apples Granny Smith,10 x 1kg,38.00,USD`;
const records = parse(csvText, { skipFirstRow: true });
console.log(records);
