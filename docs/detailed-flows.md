# Detailed Data Flows (Web-Only)

> **Authority:** Aligned with the Stakeholder Document and B2B Commerce Network positioning.
> **Interface:** All flows terminate in Web Dashboard, Supplier Portal, or Mobile App.

---

## Table of Contents

1. [SKU Normalization Flow](#1-sku-normalization-flow)
2. [Smart Cart Generation Flow](#2-smart-cart-generation-flow)
3. [Quote & Negotiation Flow](#3-quote--negotiation-flow)
4. [3-Way Invoice Matching Flow](#4-3-way-invoice-matching-flow)
5. [Flash Deal Flow](#5-flash-deal-flow)
6. [Smart Collections Flow](#6-smart-collections-flow)
7. [Sales Attribution Flow](#7-sales-attribution-flow)
8. [Delivery Tracking Flow](#8-delivery-tracking-flow)
9. [Waste & Variance Logging Flow](#9-waste--variance-logging-flow)
10. [Restaurant-Initiated RFQ Flow](#10-restaurant-initiated-rfq-flow)
11. [Forecasting & Prep Plan Flow](#11-forecasting--prep-plan-flow)

---

## 1. SKU Normalization Flow

**Trigger:** Supplier uploads CSV or PDF via Supplier Portal drag-and-drop.

```
 STEP-BY-STEP: SKU NORMALIZATION
 ═══════════════════════════════════════════════════

 ① Supplier drags CSV/PDF onto Portal upload zone
    │
    ▼
 ② Parser Router identifies format
    │  CSV → Column mapper  
    │  PDF → AWS Textract OCR
    │
    ▼
 ③ Raw items extracted as JSON array
    │  Example: {"name": "Fresh Salmon Fillet, Norwegian, 1kg pack"}
    │
    ▼
 ④ Cleaning Agent (GPT-4o-mini)
    │  - Remove marketing text
    │  - Fix unit aliases ("kilo" → "kg")
    │  - Standardize formatting
    │
    ▼
 ⑤ Attribute Extraction (GPT-4)
    │  Input: "Fresh Salmon Fillet, Norwegian, 1kg pack"
    │  Output: {
    │    "product": "Salmon Fillet",
    │    "brand": null,
    │    "origin": "Norway",
    │    "unit": "kg",
    │    "weight": 1.0,
    │    "grade": "Fresh",
    │    "pack_size": "1kg"
    │  }
    │
    ▼
 ⑥ Embedding Generation (ada-002)
    │  "Salmon Fillet Norway Fresh 1kg" → [0.023, -0.118, ..., 0.045] (1536-dim)
    │
    ▼
 ⑦ Weaviate Vector Search
    │  Search top-5 nearest neighbors:
    │
    │  cosine > 0.92  → AUTO-MATCH to existing SKU
    │  0.80-0.92      → FLAG for human review (Supplier Portal card)
    │  < 0.80         → CREATE new normalized SKU
    │
    ▼
 ⑧ Result displayed on Supplier Portal:
    ┌───────────────────────────────────────────────────────────┐
    │  CATALOG UPLOAD RESULTS                                   │
    │                                                           │
    │  ✅ 45 items auto-matched to existing SKUs                │
    │  ⚠️  8 items need your review (click to resolve)         │
    │  🆕 3 new SKUs created                                    │
    │                                                           │
    │  [ View Details ] [ Approve All Matches ]                 │
    └───────────────────────────────────────────────────────────┘
```

### Extracted Attributes Schema

| Attribute | Type | Example | Source |
|:---|:---|:---|:---|
| `product` | string | "Salmon Fillet" | GPT-4 extraction |
| `brand` | string / null | "Royal Greenland" | GPT-4 extraction |
| `origin` | string / null | "Norway" | GPT-4 extraction |
| `unit` | enum | "kg", "ltr", "pc", "tin", "case" | Standardized |
| `weight` | float | 1.0 | GPT-4 extraction |
| `grade` | string / null | "Fresh", "Frozen", "Grade A" | GPT-4 extraction |
| `pack_size` | string | "1kg", "6x500g" | GPT-4 extraction |

---

## 2. Smart Cart Generation Flow

**Trigger:** Cron schedule (daily, 5:00 AM) or POS webhook (`sale.completed`).

```
 STEP-BY-STEP: SMART CART GENERATION
 ═══════════════════════════════════════════════════

 ① POS data webhook fires (sale.completed)
    │  Payload: { restaurant_id, items_sold, timestamp }
    │
    ▼
 ② Consumption Engine processes sale
    │  - Map sold menu items → raw ingredient BOM
    │  - Calculate: "2x Margherita = -600g Mozzarella, -400g Flour..."
    │  - Update run-rate: "Mozzarella: 15kg/day average"
    │
    ▼
 ③ Inventory Agent checks stock levels
    │  For each ingredient:
    │    current_stock vs par_level vs run_rate
    │  Flag items where: current < par_level OR days_of_stock < lead_time + buffer
    │
    ▼
 ④ Sourcing Agent compares suppliers
    │  For each required SKU:
    │  - Find all suppliers offering this normalized SKU
    │  - Get current prices + historical trends
    │  - Check delivery windows
    │  - Score: price (40%) + lead_time (25%) + quality (20%) + reliability (15%)
    │
    ▼
 ⑤ Purchasing Agent builds optimized cart
    │  - Group items by best supplier
    │  - Check MOQ for each supplier
    │  - Consolidate deliveries
    │  - Calculate total cost
    │
    ▼
 ⑥ Pydantic Validation
    │  ┌──────────────────────────────────────────┐
    │  │ CartDraft                                │
    │  │   restaurant_id: str ✓                   │
    │  │   items: List[CartItem] ✓                │
    │  │     each: qty > 0, supplier valid        │
    │  │   total: Decimal ✓                       │
    │  │   reasoning: str ✓ (non-empty)           │
    │  │   budget_check: within_limit ✓           │
    │  └──────────────────────────────────────────┘
    │
    ▼
 ⑦ Emit to Web Dashboard
    │  Event: "cart.draft_ready"
    │  → Notification badge appears on Dashboard
    │  → Chef clicks → sees cart with "Why this?" on each item
    │
    ▼
 ⑧ Chef Reviews on Dashboard
    │  ┌───────────────────────────────────────────────────────┐
    │  │  🛒 SMART CART — Tuesday Feb 20                       │
    │  │                                                       │
    │  │  ┌─ Supplier A (Al Rawdah) ───────────────────────┐  │
    │  │  │  Flour 50kg     AED 150   ⓘ "Par: 40, stock: 5" │  │
    │  │  │  Sugar 25kg     AED 75    ⓘ "3-day run-rate"     │  │
    │  │  │  Subtotal:      AED 225                          │  │
    │  │  └────────────────────────────────────────────────┘  │
    │  │                                                       │
    │  │  ┌─ Supplier B (Fresh Foods) ─────────────────────┐  │
    │  │  │  Salmon 20kg    AED 800   ⓘ "Cheapest offer"   │  │
    │  │  │  Subtotal:      AED 800                          │  │
    │  │  └────────────────────────────────────────────────┘  │
    │  │                                                       │
    │  │  Total: AED 1,025                                     │
    │  │  [ ✓ Approve All ] [ ✏️ Edit ] [ ✗ Skip ]            │
    │  └───────────────────────────────────────────────────────┘
    │
    ▼
 ⑨ Chef clicks [Approve All]
    │  → System creates PO per supplier
    │  → POs emitted to Supplier Portal as incoming orders
    │  → Sales Agent starts processing on supplier side
```

---

## 3. Quote & Negotiation Flow

**Trigger:** Restaurant requests a quote via Dashboard, or Sourcing Agent triggers RFQ.

```
 STEP-BY-STEP: QUOTE & NEGOTIATION
 ═══════════════════════════════════════════════════

 ① Restaurant requests quote (Dashboard button: "Request Quote")
    │  Items: 50kg Salmon, 20kg Shrimp
    │
    ▼
 ② Sales Agent receives quote request
    │  Check: Can I auto-respond?
    │  - Authority limit: AED 5,000 → YES (order = AED 3,200)
    │  - Margin floor: 15% → Check cost...
    │
    ▼
 ③ Calculate pricing
    │  Cost: AED 2,200 → Price: AED 3,200 → Margin: 31% ✓
    │  Customer tier: "Gold" → eligible for 5% volume discount
    │  Adjusted: AED 3,040 → Margin: 28% ✓ (above floor)
    │
    ▼
 ④ Upsell analysis
    │  Menu scan: Chef has "Lobster Bisque" → no lobster in cart
    │  Suggestion: "Add 10kg Lobster Tail @ AED 180/kg → 3% bundle discount"
    │
    ▼
 ⑤ Generate binding quote (< 3 seconds total)
    │  → Push to Restaurant Dashboard as notification
    │  ┌──────────────────────────────────────────────────┐
    │  │  💬 QUOTE FROM AL RAWDAH SEAFOOD                  │
    │  │                                                    │
    │  │  Salmon 50kg      AED 2,100 (5% Gold discount)   │
    │  │  Shrimp 20kg      AED 940                         │
    │  │  ──────────────────────────────                    │
    │  │  Subtotal:        AED 3,040                        │
    │  │                                                    │
    │  │  💡 ADD: Lobster 10kg → unlock 3% bundle discount  │
    │  │                                                    │
    │  │  [ Accept ] [ Counter ] [ Decline ]                │
    │  │  Valid for: 24 hours                                │
    │  └──────────────────────────────────────────────────┘
    │
    ▼
 ⑥ Restaurant clicks [Accept]
    │  → PO auto-created
    │  → E-Invoice generated (FTA-compliant)
    │  → Supplier Portal shows "Deal Closed ✓"
    │  → Sales Rep sees attribution credit in territory dashboard
```

---

## 4. 3-Way Invoice Matching Flow

**Trigger:** `grn.created` + `invoice.uploaded` events.

```
 STEP-BY-STEP: 3-WAY MATCH
 ═══════════════════════════════════════════════════

 ① GRN submitted (Storekeeper Mobile App)
    │  Items received: Flour 48kg, Oil 3 tins
    │  Photo evidence: ✓ captured
    │  Discrepancy: Flour short by 2kg
    │
    ▼
 ② Invoice uploaded (Finance via Dashboard or auto-imported)
    │  Invoice claims: Flour 50kg, Oil 3 tins
    │  Total: AED 510
    │
    ▼
 ③ Compliance Agent runs 3-way match
    │
    │  ┌──────────────────────────────────────────────┐
    │  │  PO          GRN          INVOICE     STATUS │
    │  │  ─────────   ─────────    ─────────   ────── │
    │  │  Flour 50kg  Flour 48kg   Flour 50kg   ⚠️   │
    │  │  Oil 3 tin   Oil 3 tin    Oil 3 tin    ✅    │
    │  └──────────────────────────────────────────────┘
    │
    │  Tolerance: 2% (configurable)
    │  Flour variance: 4% → EXCEEDS tolerance → Exception flagged
    │
    ▼
 ④ Dashboard Alert
    │  ┌──────────────────────────────────────────────────┐
    │  │  ⚠️ INVOICE EXCEPTION — PO #4521                 │
    │  │                                                    │
    │  │  Flour: PO says 50kg, received 48kg, billed 50kg  │
    │  │  Overpayment risk: AED 6.00                        │
    │  │                                                    │
    │  │  Photo evidence: [View GRN Photo]                  │
    │  │                                                    │
    │  │  [ Accept As-Is ] [ Request Credit Note ]          │
    │  └──────────────────────────────────────────────────┘
    │
    ▼
 ⑤ Manager clicks [Request Credit Note]
    │  → System generates credit note request
    │  → Supplier Portal shows "Credit Note Required"
    │  → Auto-adjusts invoice amount to AED 504
```

---

## 5. Flash Deal Flow

**Trigger:** Supplier uploads distressed inventory via Supplier Portal.

```
 STEP-BY-STEP: FLASH DEAL
 ═══════════════════════════════════════════════════

 ① Supplier flags distressed inventory on Portal
    │  Item: Mushrooms 200kg, expiring in 72h
    │  Discount: 40% off list price
    │
    ▼
 ② Sales Agent runs menu intelligence
    │  Scan all connected restaurants' menus via Weaviate
    │  Query: "Which restaurants use mushrooms?"
    │  Result: 20 restaurants with mushroom dishes
    │
    ▼
 ③ Rank by relevance
    │  - Purchase frequency (how often they buy mushrooms)
    │  - Current stock level (are they running low?)
    │  - Relationship tier (loyalty score)
    │  Top 20 ranked and segmented
    │
    ▼
 ④ Generate personalized offers
    │  Each restaurant gets a tailored deal:
    │  "Based on your Mushroom Risotto menu item and
    │   current stock of 5kg (3-day supply), here's
    │   a 40% discount on 20kg fresh mushrooms."
    │
    ▼
 ⑤ Push to Restaurant Dashboard
    │  → Dashboard notification: "🔥 Flash Deal Available"
    │  → Push notification via FCM to mobile
    │  ┌──────────────────────────────────────────────────┐
    │  │  🔥 FLASH DEAL — Al Rawdah Trading               │
    │  │                                                    │
    │  │  Fresh Mushrooms 20kg @ AED 12/kg (was AED 20)    │
    │  │  Expires: 72 hours                                 │
    │  │  Relevance: "You use 15kg/week for Risotto"        │
    │  │                                                    │
    │  │  [ ✓ Add to Cart ] [ Skip ]                        │
    │  └──────────────────────────────────────────────────┘
    │
    ▼
 ⑥ Chef clicks [Add to Cart]
    │  → Item added to next cart
    │  → PO created → E-Invoice generated
    │  → Supplier sees "Flash Deal: 8/20 accepted (40%)" on Portal
    │  → Sales Rep sees commission credit in territory
```

---

## 6. Smart Collections Flow

**Trigger:** Invoice due date reached (cron) or payment received (webhook).

```
 STEP-BY-STEP: SMART COLLECTIONS
 ═══════════════════════════════════════════════════

 ① Invoice due date approaching
    │  Collections Agent checks all invoices with:
    │  due_date <= today + 3 days AND status != "paid"
    │
    ▼
 ② Day 0 (Due date): Gentle reminder
    │  → Dashboard notification: "Invoice #4521 is due today"
    │  → Email to finance contact with invoice PDF attached
    │
    ▼
 ③ Day +3: Firm reminder
    │  → Dashboard notification (highlighted): "Invoice #4521 overdue"
    │  → Email with "Please remit payment at your earliest convenience"
    │
    ▼
 ④ Day +7: Escalate to Sales Rep
    │  → Push notification to Sales Rep: "Account overdue — intervene"
    │  → Territory dashboard shows account flagged yellow
    │  → Rep can click to see full payment history
    │
    ▼
 ⑤ Day +14: Flag as at-risk
    │  → Account marked "At Risk" in territory dashboard (red)
    │  → Manager report includes this account
    │  → Future AI-closed deals for this account may require prepayment
    │
    ▼
 ⑥ Payment received (webhook from payment provider)
    │  → Invoice marked "Paid"
    │  → DSO updated for this account
    │  → Account health restored to green
    │  → Dashboard shows "Payment received ✓"
```

---

## 7. Sales Attribution Flow

**Trigger:** Deal closed (by AI Agent or manually by Sales Rep).

```
 STEP-BY-STEP: SALES ATTRIBUTION
 ═══════════════════════════════════════════════════

 ① Deal closed (AI auto-close or Rep manual close)
    │
    ▼
 ② Attribution Engine determines credit
    │
    │  Decision tree:
    │  ┌────────────────────────────────────────────────┐
    │  │ WHO CLOSED?          ATTRIBUTION     RATE     │
    │  │ ──────────          ───────────     ────      │
    │  │ AI Agent alone      → Territory Rep   2%     │
    │  │ Rep (Takeover)      → Rep (direct)    6%     │
    │  │ Flash Deal          → Territory Rep   4%     │
    │  │ New Account (Rep)   → Rep (direct)    8%     │
    │  └────────────────────────────────────────────────┘
    │
    ▼
 ③ Territory mapping
    │  - Lookup: Which rep owns this restaurant's territory?
    │  - If disputed: escalate to Sales Manager
    │
    ▼
 ④ Commission calculated and posted
    │  → Sales Rep Dashboard shows live earnings update
    │  → Monthly commission report auto-generated
    │  → Finance dashboard shows total commission liability
```

---

## 8. Delivery Tracking Flow

**Trigger:** Supplier dispatch confirms order routing and driver departs.

```
 STEP-BY-STEP: DELIVERY TRACKING (RESTAURANT VIEW)
 ═══════════════════════════════════════════════════

 ① Dispatcher flags PO as "Out for Delivery"
    │  Mobile App: Driver selects route
    │  System calculates ETA based on live traffic
    │
    ▼
 ② Restaurant Dashboard Update
    │  Dashboard widget "Incoming Deliveries" updates
    │  Status changes: Confirmed → Dispatched
    │  Displays: Driver Name, Vehicle, ETA
    │
    ▼
 ③ Push Notification (Approaching)
    │  Trigger: Driver is 15 minutes away
    │  Alert to Storekeeper: "Get ready, delivery is arriving soon."
    │
    ▼
 ④ Live Tracking Map (Dashboard & Mobile)
    │  Clicking "Track" shows real-time driver ping
    │  Status updates continuously:
    │  - "Next Stop"
    │  - "Arriving in 5 mins"
    │
    ▼
 ⑤ Arrival & Handover
    │  Driver arrives → flags "Arrived" on Provider app
    │  Initiates GRN flow (Step 4 of User Journey)
```

---

## 9. Waste & Variance Logging Flow

**Trigger:** Chef or Storekeeper logs a waste event, or periodic inventory count completes.

```
 STEP-BY-STEP: WASTE & VARIANCE ENGINE
 ═══════════════════════════════════════════════════

 ① Waste Logged (Mobile/Dashboard)
    │  Chef enters: "5kg Tomatoes spoiled"
    │  Selects Reason Code: "Overripe/Spoilage"
    │
    ▼
 ② Variance Engine (Theoretical vs. Actual)
    │  End of Day / Week:
    │  Actual Stock = (Starting Stock + Purchases) - Ending Stock
    │  Theoretical Stock = starting + purchases - POS consumption
    │  Variance = Actual Stock - Theoretical Stock
    │
    ▼
 ③ Root Cause Analysis (AI)
    │  AI detects anomaly: "Tomatoes variance is 15% (normal < 5%)"
    │  Correlates with Reason Codes and Delivery Quality notes
    │  Identifies: Over-ordering vs. Recipe Drift
    │
    ▼
 ④ Recommended Corrective Actions
    │  AI surfaces alerts on Kitchen Copilot Dashboard:
    │  - "Reduce Tomato Par Level by 10%"
    │  - "Review Pesto recipe portions (variance drift detected)"
    │  - "Ask Supplier B for riper tomatoes"
    │
    ▼
 ⑤ Manager Action
    │  Manager clicks [Apply Adjustment] to update Par Level
```

---

## 10. Restaurant-Initiated RFQ Flow

**Trigger:** Restaurant builds a custom requirement basket and requests bids from multiple suppliers.

```
 STEP-BY-STEP: RESTAURANT-INITIATED RFQ
 ═══════════════════════════════════════════════════

 ① Basket Creation
    │  Chef adds items to RFQ Basket
    │  Inputs: Item Name, Unit, Quantity
    │  Optional Flags: Current Consumption (run-rate), Target Price
    │
    ▼
 ② Send to Marketplace
    │  Selects: "Send to Preferred Suppliers" OR "Broadcast to Category"
    │  System anonymizes (if broadcast) and sends
    │
    ▼
 ③ Suppliers Respond (Manual or AI Auto-Quote)
    │  Prices entered by suppliers (Subject to their margin rules)
    │  Responses returned with lead times
    │
    ▼
 ④ Normalized Comparison (Dashboard)
    │  AI Normalization Engine compares Apples-to-Apples
    │  Displays matrix: Supplier A vs Supplier B vs Target Price
    │  Highlights: "Supplier B meets target price, Supplier A has faster lead time"
    │
    ▼
 ⑤ Selection & PO
    │  Chef clicks [Award] to Supplier B
    │  PO automatically generated for Supplier B
    │  Other suppliers notified: "Bid Unsuccessful"
```

---

## 11. Forecasting & Prep Plan Flow

**Trigger:** Start of daily operations or weekly planning cycle.

```
 STEP-BY-STEP: FORECASTING & PREP PLAN
 ═══════════════════════════════════════════════════

 ① Demand Forecasting (Nightly Cron)
    │  Ingests POS historicals, day of week, seasonality, local events
    │  Predicts: "Tomorrow: 150 Burgers, 50 Salads, 80 Pizzas"
    │
    ▼
 ② Explode Recipes to Prep Needs
    │  Translates predicted dish sales to intermediate prep stages:
    │  - 150 Burgers → 15kg Ground Beef Prep, 150 Buns
    │  - 50 Salads → 5kg Washed Lettuce, 2L Vinaigrette
    │
    ▼
 ③ Inventory Check & Expiry Prioritization
    │  Checks Stock on Hand and Expiry dates
    │  Flags: "5kg Tomatoes expiring tomorrow — prioritize in prep"
    │
    ▼
 ④ Kitchen Copilot: Daily Prep List Generator
    │  Generates highly specific instructions:
    │  ┌─────────────────────────────────────────────────────┐
    │  │ 📋 TODAY'S PREP LIST (Tuesday)                      │
    │  │ - Batch 1 (08:00): Wash & cut 5kg Tomatoes (URGENT) │
    │  │ - Batch 2 (09:00): Portion 15kg Ground Beef         │
    │  │ - Batch 3 (10:00): Make 2L Vinaigrette              │
    │  └─────────────────────────────────────────────────────┘
    │
    ▼
 ⑤ Surplus Inspiration (Chef Review)
    │  AI: "You have 10kg excess chicken nearing expiry."
    │  Suggestion: "Run a 'Chicken Wrap' Lunch Special."
    │  Chef clicks [Create Special] to inform FOH
```
