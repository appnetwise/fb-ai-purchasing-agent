# System Architecture & Flows

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         F&B AI Purchasing Agent                     │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Restaurant  │     │   Supplier   │     │     POS      │
│     App      │     │      App     │     │   System     │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                     │
       │                    │                     │
       └────────────────────┼─────────────────────┘
                            │ API
                            ▼
     ┌──────────────────────────────────────────┐
     │        API Gateway & Auth Layer          │
     └──────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
    ┌────────────┐  ┌───────────────┐  ┌──────────────┐
    │  Ordering  │  │   Inventory   │  │ Invoicing &  │
    │   Module   │  │    Module     │  │   Payments   │
    └────┬───────┘  └───────┬───────┘  └──────┬───────┘
         │                  │                  │
         │  ┌───────────────┴──────────────────┤
         │  ▼                                  ▼
    ┌────────────────────────────────────────────────┐
    │      Multi-Agent Reasoning Layer               │
    │  (ReAct + Function Calling + Tool Calling)     │
    │                                                 │
    │  ┌──────────┐ ┌──────────┐ ┌────────────────┐ │
    │  │ Planner  │ │ Catalog  │ │ Purchasing     │ │
    │  │ Agent    │ │ Agent    │ │ Agent (AI Cart)│ │
    │  └──────────┘ └──────────┘ └────────────────┘ │
    │                                                 │
    │  ┌──────────┐ ┌──────────┐ ┌────────────────┐ │
    │  │Compliance│ │ Inventory│ │ Kitchen Copilot│ │
    │  │ Agent    │ │ Agent    │ │ Agent          │ │
    │  └──────────┘ └──────────┘ └────────────────┘ │
    └────────────────────────────────────────────────┘
         │                   │                │
         ├───────────────────┼────────────────┤
         ▼                   ▼                ▼
    ┌──────────┐      ┌──────────┐    ┌────────────┐
    │ Tools &  │      │ Vector   │    │ Guardrails │
    │ Function │      │   DB     │    │ & Schemas  │
    │ Calling  │      │(Chroma)  │    │(Pydantic)  │
    └─────┬────┘      └────┬─────┘    └────────────┘
          │                │
          └────────────────┼────────────────┐
                           ▼                ▼
     ┌─────────────────────────────────────────────┐
     │         Data & Persistence Layer            │
     │                                              │
     │  ┌──────────────────────────────────────┐   │
     │  │  PostgreSQL (Transactions, Audit)    │   │
     │  │  - Suppliers, SKUs, POs, GRNs        │   │
     │  │  - Invoices, Matches, Audit Logs    │   │
     │  └──────────────────────────────────────┘   │
     └─────────────────────────────────────────────┘
```

---

## Multi-Agent Workflow (End-to-End Procurement)

```
User Request (e.g., "Generate cart for next 3 days")
         │
         ▼
    ┌─────────────────────────────────┐
    │  Planner Agent (ReAct)          │
    │  - Break down task into steps   │
    │  - Define success criteria      │
    └──────────┬──────────────────────┘
               │
               ├─ Step 1: Fetch current inventory & lead times
               │           │
               │           ▼
               │      ┌──────────────────┐
               │      │ Inventory Agent  │
               │      │ Calls:           │
               │      │ - fetch_inventory│
               │      │ - get_par_levels │
               │      └────────┬─────────┘
               │               │ Result: {stock, par, lead_time}
               │               ▼
               │
               ├─ Step 2: Parse & normalize SKU info
               │           │
               │           ▼
               │      ┌──────────────────┐
               │      │ Catalog Agent    │
               │      │ Calls:           │
               │      │ - parse_pack()   │
               │      │ - normalize_name │
               │      │ - fetch_vector_db│
               │      └────────┬─────────┘
               │               │ Result: {normalized_sku, equiv_items}
               │               ▼
               │
               ├─ Step 3: Compare suppliers & prices
               │           │
               │           ▼
               │      ┌──────────────────┐
               │      │ Sourcing Agent   │
               │      │ Calls:           │
               │      │ - compare_quotes │
               │      │ - rank_suppliers │
               │      └────────┬─────────┘
               │               │ Result: {best_supplier, price_per_kg}
               │               ▼
               │
               ├─ Step 4: Generate AI cart suggestion
               │           │
               │           ▼
               │      ┌──────────────────┐
               │      │ Purchasing Agent │
               │      │ Calls:           │
               │      │ - calc_qty()     │
               │      │ - apply_rules()  │
               │      │ - validate_cart()│
               │      └────────┬─────────┘
               │               │ Result: SuggestedCart
               │               ▼
               │
               ├─ Step 5: Validate with guardrails
               │           │
               │           ▼
               │      ┌──────────────────┐
               │      │ Pydantic Schemas │
               │      │ Validate:        │
               │      │ - qty > 0        │
               │      │ - supplier ok    │
               │      │ - reasons clear  │
               │      └────────┬─────────┘
               │               │ Passes: ✓
               │               ▼
               │
               └─ Step 6: Log & return for approval
                          │
                          ▼
                    ┌──────────────────┐
                    │ Audit Log Entry  │
                    │ - agent name     │
                    │ - tool calls     │
                    │ - final suggestion
                    └────────┬─────────┘
                             │
                             ▼
                    Manager Approval
                    ✓ Approve → PO Created
                    ✗ Reject  → Return for edit
```

---

## ReAct (Reason + Act + Observe + Update) Loop

```
┌────────────────────────────────────────────────────────┐
│  Agent receives task: "Find cheapest apples supplier"  │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
          ┌───────────────────────────────┐
          │  REASON                       │
          │  - Current state: inventory   │
          │  - Goal: lowest $/kg apples   │
          │  - Constraints: lead time < 2 │
          │  - Plan: query, parse, rank   │
          └───────────────┬───────────────┘
                          │
                          ▼
          ┌───────────────────────────────┐
          │  ACT (Function Calling)       │
          │  - Call: search_catalog()     │
          │  - Call: normalize_name()     │
          │  - Call: parse_pack()         │
          │  - Call: compare_quotes()     │
          └───────────────┬───────────────┘
                          │
                          ▼
          ┌───────────────────────────────┐
          │  OBSERVE                      │
          │  - Results from tools:        │
          │    Supplier A: $5.2/kg        │
          │    Supplier B: $4.8/kg (lead: 1d)
          │    Supplier C: $6.0/kg        │
          └───────────────┬───────────────┘
                          │
                          ▼
          ┌───────────────────────────────┐
          │  UPDATE                       │
          │  - Rank by $/kg + lead time   │
          │  - Best: Supplier B           │
          │  - Log tool calls & output    │
          │  - Validate schema            │
          │  - Return recommendation      │
          └───────────────┬───────────────┘
                          │
                          ▼
          ┌───────────────────────────────┐
          │  LOOP?                        │
          │  - Need refinement? NO        │
          │  - Return final suggestion    │
          └───────────────────────────────┘
```

---

## Data Flow: POS → Normalization → Comparison → AI Cart

```
┌──────────────────────┐
│   POS System         │
│  (e.g., Foodics)     │
│                      │
│ Daily Sales:         │
│ - SKU_001: 10kg      │
│ - SKU_002: 25 units  │
│ - SKU_003: 5 cases   │
└──────────┬───────────┘
           │ API: fetch_sales()
           ▼
┌──────────────────────────────────────┐
│  Inventory Agent                     │
│  - Aggregate consumption             │
│  - Run-rate (kg/day)                 │
│  - Days of stock remaining           │
│  - Low stock threshold               │
└──────────┬───────────────────────────┘
           │ {sku_id, daily_rate, days_remaining}
           ▼
┌──────────────────────────────────────┐
│  Catalog/Normalization Agent         │
│  - Map POS SKU_ID → internal SKU    │
│  - Normalize name                    │
│  - Parse pack & unit                 │
│  - Convert to kg                     │
└──────────┬───────────────────────────┘
           │ {normalized_sku, qty_needed_kg, unit}
           ▼
┌──────────────────────────────────────┐
│  Vector DB Search                    │
│  Query: "Find apples suppliers"      │
│  Results:                            │
│  - Supplier A: $5.2/kg, lead 1d      │
│  - Supplier B: $4.8/kg, lead 2d      │
│  - Supplier C: $6.0/kg, lead same-day
└──────────┬───────────────────────────┘
           │ {suppliers, prices, lead_times}
           ▼
┌──────────────────────────────────────┐
│  Sourcing Agent                      │
│  - Rank by price + reliability       │
│  - Apply supplier preferences        │
│  - Check MOQ & payment terms         │
└──────────┬───────────────────────────┘
           │ {best_supplier, final_price}
           ▼
┌──────────────────────────────────────┐
│  Purchasing Agent (AI Cart)          │
│  - Calculate qty: run_rate × days    │
│  - Add safety stock buffer           │
│  - Account for existing stock        │
│  - Create line item                  │
└──────────┬───────────────────────────┘
           │ {qty, supplier, reason}
           ▼
┌──────────────────────────────────────┐
│  Suggested Cart (Pydantic validated) │
│  [                                   │
│    {sku: "apples", qty: 50kg,       │
│     supplier: "B", reason: "..."},   │
│    {sku: "chicken", qty: 100kg, ...}│
│  ]                                   │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Manager Approval Screen             │
│  ✓ Approve → Generate PO             │
│  ✗ Edit    → Modify & resubmit       │
│  ✗ Reject  → Discard                 │
└──────────────────────────────────────┘
```

---

## Invoice & GRN Reconciliation Flow (2-way / 3-way Match)

```
┌─────────────────────────┐
│  Purchase Order (PO)    │
│  - Date: 2026-02-04     │
│  - Supplier: Supplier B │
│  - Items:               │
│    - Apples: 50kg@$4.8  │
│    - Total: $240        │
└────────────┬────────────┘
             │
             ├──────────────────────────┐
             │                          │
             ▼                          ▼
    ┌──────────────┐          ┌──────────────────┐
    │  Delivery    │          │  Invoice Arrives │
    │  (GRN)       │          │  (OCR Extract)   │
    │              │          │                  │
    │ - Date       │          │  - Date          │
    │ - Items rcvd │          │  - Supplier      │
    │ - Qty        │          │  - Items charged │
    │ - Quality    │          │  - Amount        │
    │ - Photos     │          │  - Payment terms │
    │ - Signature  │          │                  │
    └────────┬─────┘          └────────┬─────────┘
             │                         │
             │    ┌────────────────────┘
             │    │
             ▼    ▼
    ┌─────────────────────────────────────┐
    │  2-Way Match: PO vs Invoice         │
    │  (Fast approval if PO=Invoice)      │
    │                                     │
    │  ✓ Qty match?    → PASS             │
    │  ✓ Price match?  → PASS             │
    │  ✗ Qty < PO?     → FLAG SHORT       │
    │  ✗ Price > PO?   → FLAG OVERCHARGE  │
    └────────────┬────────────────────────┘
                 │
                 ├─ If all PASS
                 │   │
                 │   └─→ [Approve & Pay]
                 │
                 └─ If any FAIL
                    │
                    ▼
        ┌───────────────────────────────┐
        │  3-Way Match: PO vs GRN vs   │
        │  Invoice (for disputes)       │
        │                               │
        │  Compare:                     │
        │  - Qty (PO vs GRN vs Invoice) │
        │  - Unit (normalized)          │
        │  - Price (invoice claim)      │
        │                               │
        │  Flag:                        │
        │  - Short delivery (GRN < PO)  │
        │  - Damage (GRN photos)        │
        │  - Overcharge (Invoice > PO)  │
        │  - Missing items              │
        └─────────────┬─────────────────┘
                      │
                      ▼
        ┌───────────────────────────────┐
        │  Dispute/Claims Workflow      │
        │  - Contact supplier           │
        │  - Request credit memo        │
        │  - Warehouse adjustment       │
        │  - Audit log                  │
        └───────────────────────────────┘
```

---

## Low Stock → Reorder Trigger Flow

```
┌──────────────────────────────┐
│  Inventory Agent (Running)   │
│  Checks par levels hourly    │
└──────────────┬───────────────┘
               │ fetch_inventory()
               ▼
    ┌──────────────────────────┐
    │  Current Stock:          │
    │  - Apples: 15kg          │
    │  - Chicken: 30kg         │
    │  - ...                   │
    └──────────┬───────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │  Check Against Par Levels:       │
    │  - Apples: 15kg < par 40kg? ✓    │
    │  - Chicken: 30kg < par 50kg? ✓   │
    │  - ...                           │
    └──────────┬─────────────────────────┘
               │ Low stock detected
               ▼
    ┌──────────────────────────────────┐
    │  Purchasing Agent: AI Reorder    │
    │  For each low-stock item:        │
    │  - Get run-rate (kg/day)         │
    │  - Get lead time (days)          │
    │  - Calc qty = rate × lead_time   │
    │    + safety stock buffer         │
    │  - Look up best supplier         │
    │  - Create suggested line item    │
    └──────────┬─────────────────────────┘
               │ SuggestedCart
               ▼
    ┌──────────────────────────────────┐
    │  AI Draft Cart:                  │
    │  [                               │
    │    {sku: "apples", qty: 75kg,    │
    │     supplier: "B", reason:       │
    │     "Lead 2d, rate 20kg/day"},   │
    │    {sku: "chicken", qty: 100kg,  │
    │     supplier: "A", reason: "..."}│
    │  ]                               │
    └──────────┬──────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │  Manager Approval                │
    │  (via app notification)          │
    │                                  │
    │  ✓ Approve → PO created          │
    │  ✗ Edit qty → Resubmit           │
    │  ✗ Change supplier → Resubmit    │
    │  ✗ Reject → Manual reorder later │
    └──────────┬──────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │  PO Created & Sent to Supplier   │
    │  - Logged in audit trail         │
    │  - Tracked in order status       │
    └──────────────────────────────────┘
```

---

## Approval Workflow (Human-in-the-Loop)

```
AI Agent Recommendation
         │
         ▼
    ┌─────────────────────────────┐
    │  Notification to Manager    │
    │  - App push                 │
    │  - Email                    │
    │  - SMS (optional)           │
    └─────────────────────────────┘
         │
         ▼
    ┌─────────────────────────────┐
    │  Approval Screen:           │
    │  ┌───────────────────────┐  │
    │  │ Suggested Cart        │  │
    │  │ Item 1: Apples 75kg   │  │
    │  │ Item 2: Chicken 100kg │  │
    │  │ Item 3: ...           │  │
    │  └───────────────────────┘  │
    │  ┌───────────────────────┐  │
    │  │ AI Reasoning:         │  │
    │  │ "Apples: 2-day lead,  │  │
    │  │  20kg/day run-rate,   │  │
    │  │  1kg safety buffer    │  │
    │  │  → 75kg suggested"    │  │
    │  └───────────────────────┘  │
    │  ┌───────────────────────┐  │
    │  │ Best Supplier:        │  │
    │  │ Supplier B: $4.8/kg   │  │
    │  │ (vs A: $5.2, C: $6.0) │  │
    │  └───────────────────────┘  │
    └─────────────────────────────┘
         │
         ├─ ✓ Approve
         ├─ ✗ Edit & resubmit
         └─ ✗ Reject
         │
         ├─→ [Action: Approve]
         │   ├─ Log edit feedback
         │   ├─ Create PO
         │   └─ Send to supplier
         │
         ├─→ [Action: Edit]
         │   ├─ Change qty, supplier
         │   ├─ Revalidate
         │   └─ Resubmit
         │
         └─→ [Action: Reject]
             ├─ Log rejection reason
             └─ Alert for manual reorder
```

---

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Agentic Orchestration Layer                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Reasoning Agent                         │   │
│  │  (Task: Goal splitting, sequencing, state tracking)     │   │
│  └──────────┬───────────────────────────────────────────────┘   │
│             │                                                    │
│   ┌─────────┼────────────────────────────────────────┐          │
│   │         │                                        │          │
│   ▼         ▼                                        ▼          │
│┌────────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
││ Catalog Agent  │  │Sourcing Agent│  │Purchasing Agent      │  │
││                │  │              │  │(AI Cart, Approval)   │  │
││- Normalize     │  │- Compare     │  │                      │  │
││- Parse         │  │- Rank        │  │- Calculate qty       │  │
││- Vector search │  │- Validate    │  │- Apply rules         │  │
│└────────────────┘  └──────────────┘  └──────────────────────┘  │
│   │         │                                        │          │
│   └─────────┼────────────────────────────────────────┘          │
│             │                                                    │
│  ┌──────────┴────────────────────────────────────────┐          │
│  │         Tool Calling Interface                    │          │
│  │  - Tool Registry                                 │          │
│  │  - Logging & Error Handling                      │          │
│  │  - State Management                              │          │
│  └──────────┬────────────────────────────────────────┘          │
│             │                                                    │
└─────────────┼────────────────────────────────────────────────────┘
              │
    ┌─────────┼─────────────┬──────────────┬────────────┐
    │         │             │              │            │
    ▼         ▼             ▼              ▼            ▼
┌───────┐ ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│Vector │ │Normalize  │ │POS API   │ │Database  │ │Guardrails│
│  DB   │ │Tools      │ │Connector │ │(Postgres)│ │(Pydantic)│
│(Chroma)│ │(parse,    │ │          │ │          │ │          │
│       │ │ convert)  │ │(sales,   │ │(PO,GRN,  │ │Schemas   │
└───────┘ └───────────┘ │ inventory)│ │Invoice)  │ │Validation│
                        └──────────┘ └──────────┘ └──────────┘
```

---

## Key Decision Points & Guard Rails

```
Before AI creates any suggestion:
│
├─ Is supplier in approved list?
│  └─ NO → Flag exception, use fallback
│
├─ Is calculated qty > 0 and reasonable?
│  └─ NO → Reject, log error
│
├─ Is lead time compatible with par level?
│  └─ NO → Warn, offer manual alternatives
│
├─ Does total cost exceed monthly budget?
│  └─ NO (maybe) → Flag for CFO review
│
├─ Are there active quality issues with supplier?
│  └─ YES → Suggest alternative, log reason
│
└─ Is this a repeat order (no new variations)?
   └─ NO → Verify human before auto-PO
```

These diagrams provide a visual blueprint for understanding the multi-agent system, data flows, and approval workflows.
