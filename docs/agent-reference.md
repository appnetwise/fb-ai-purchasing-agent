# AI Agent Reference (Web-Only)

> **Authority:** Aligned with the Stakeholder Document and B2B Commerce Network positioning.
> **Interface:** All agent interactions surface through Web Dashboard, Supplier Portal, or Mobile App.

---

## Table of Contents

1. [Agent Mesh Overview](#1-agent-mesh-overview)
2. [Planner Agent (Orchestrator)](#2-planner-agent-orchestrator)
3. [Purchasing Agent](#3-purchasing-agent)
4. [Autonomous Sales Agent](#4-autonomous-sales-agent)
5. [Compliance Agent](#5-compliance-agent)
6. [Catalog Normalization Agent](#6-catalog-normalization-agent)
7. [Kitchen Copilot Agent](#7-kitchen-copilot-agent)
8. [Collections Agent](#8-collections-agent)
9. [Inventory Agent](#9-inventory-agent)
10. [Sourcing Agent](#10-sourcing-agent)
11. [Guardrails & Governance](#11-guardrails--governance)

---

## 1. Agent Mesh Overview

```
 AI AGENT MESH (LangGraph)
 ═══════════════════════════════════════════════════

              ┌───────────────────────┐
              │  PLANNER AGENT        │
              │  (Orchestrator)       │
              │  Model: GPT-4o       │
              │  Pattern: ReAct loop  │
              └───────────┬───────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
 ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
 │ Purchasing   │ │ Sales        │ │ Compliance   │
 │ Agent        │ │ Agent        │ │ Agent        │
 │              │ │              │ │              │
 │ GPT-4o-mini  │ │ GPT-4o       │ │ GPT-4o-mini  │
 └──────────────┘ └──────────────┘ └──────────────┘
        │                 │                 │
        ▼                 ▼                 ▼
 ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
 │ Catalog      │ │ Kitchen      │ │ Collections  │
 │ Agent        │ │ Copilot      │ │ Agent        │
 │              │ │              │ │              │
 │ GPT-4o-mini  │ │ GPT-4o-mini  │ │ GPT-4o-mini  │
 │ + ada-002    │ │              │ │              │
 └──────────────┘ └──────────────┘ └──────────────┘
        │
        ▼
 ┌──────────────┐ ┌──────────────┐
 │ Inventory    │ │ Sourcing     │
 │ Agent        │ │ Agent        │
 │              │ │              │
 │ GPT-4o-mini  │ │ GPT-4o-mini  │
 └──────────────┘ └──────────────┘
```

### Agent Communication

| Method | Use Case |
|:---|:---|
| **Redis EventBus** | Async event-driven communication (`po.confirmed`, `cart.draft_ready`) |
| **Direct Tool Call** | Planner invokes sub-agents via LangGraph state machine |
| **Shared State** | LangGraph `AgentState` object passed between nodes |

---

## 2. Planner Agent (Orchestrator)

| Property | Value |
|:---|:---|
| **Model** | GPT-4o |
| **Pattern** | ReAct (Reason → Act → Observe → Update) |
| **Trigger** | User request via Web Dashboard or scheduled cron |
| **Output** | Delivers result to Web Dashboard via WebSocket |

### Tool Calls

| Tool | Description |
|:---|:---|
| `decompose_task(request)` | Break user request into sub-steps |
| `delegate_to_agent(agent, task)` | Route sub-task to specialist agent |
| `validate_output(schema, result)` | Pydantic validation on agent output |
| `emit_to_dashboard(event, payload)` | Push result to user's Web Dashboard |

---

## 3. Purchasing Agent

| Property | Value |
|:---|:---|
| **Model** | GPT-4o-mini |
| **Trigger** | POS webhook (`sale.completed`), cron schedule, manual request |
| **Output** | Draft cart → Web Dashboard notification badge |

### Tool Calls

| Tool | Description |
|:---|:---|
| `get_stock(restaurant_id)` | Fetch current inventory levels |
| `get_consumption_rate(sku, days)` | Calculate run-rate from POS data |
| `calculate_par_level(sku)` | Determine reorder threshold |
| `build_cart(items, suppliers)` | Generate optimized cart grouped by supplier |
| `check_MOQ(supplier_id, sku, qty)` | Verify minimum order quantity |
| `optimize_delivery(cart)` | Consolidate deliveries, check lead times |
| `push_draft_cart(restaurant_id, cart)` | Push to Web Dashboard as "Cart Ready" |

### State Machine

```
 PURCHASING AGENT STATE MACHINE
 ═══════════════════════════════════════

 ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
 │ ANALYZE │───►│ SOURCE  │───►│  BUILD  │───►│  EMIT   │
 │         │    │         │    │         │    │         │
 │ POS data│    │ Compare │    │ Draft   │    │ Push to │
 │ Stock   │    │ prices  │    │ cart    │    │ Web UI  │
 │ Run-rate│    │ History │    │ Group   │    │ Badge   │
 └─────────┘    └─────────┘    └─────────┘    └─────────┘
```

---

## 4. Autonomous Sales Agent

| Property | Value |
|:---|:---|
| **Model** | GPT-4o (complex negotiation requires strong reasoning) |
| **Trigger** | Incoming quote request, flash deal creation, upsell opportunity |
| **Output** | Binding quote → Restaurant Dashboard + Supplier Portal notification |

### Tool Calls

| Tool | Description |
|:---|:---|
| `validate_authority(supplier_config, order_value)` | Can agent approve this deal? |
| `check_stock(sku, qty)` | Verify inventory availability |
| `calculate_margin(cost, price)` | Meets margin floor? |
| `apply_discount_authority(customer_tier, discount_pct)` | Within discount limits? |
| `draft_binding_quote(items, prices, validity)` | Create offer with expiry |
| `analyze_menu_for_upsell(chef_id, cart)` | Find cross-sell opportunities |
| `create_po_auto_confirm(quote)` | Convert to order (within guardrails) |
| `push_notification(user_id, payload)` | Dashboard notification + FCM push |

### Negotiation Guardrails

```
 NEGOTIATION DECISION TREE
 ═══════════════════════════════════════

 Quote Request Received
        │
        ▼
 ┌──────────────┐     NO      ┌──────────────┐
 │ Margin ≥     │────────────►│ ESCALATE to  │
 │ Floor (15%)? │             │ Sales Rep    │
 └──────┬───────┘             │ (Web Alert)  │
        │ YES                 └──────────────┘
        ▼
 ┌──────────────┐     NO      ┌──────────────┐
 │ Order ≤      │────────────►│ ESCALATE to  │
 │ Auto-Approve │             │ Sales Rep    │
 │ Limit?       │             │ (Web Alert)  │
 └──────┬───────┘             └──────────────┘
        │ YES
        ▼
 ┌──────────────┐     NO      ┌──────────────┐
 │ Customer     │────────────►│ ADJUST       │
 │ in Good      │             │ Terms        │
 │ Standing?    │             │ (Prepay)     │
 └──────┬───────┘             └──────────────┘
        │ YES
        ▼
 ┌──────────────┐
 │ AUTO-CLOSE   │
 │ Generate PO  │
 │ Send Invoice │
 │ Notify Rep   │
 └──────────────┘
```

### Takeover Protocol

When a Sales Rep clicks "Takeover" on the Supplier Portal:

1. AI Agent **pauses** the current negotiation
2. Full context transferred to Rep (conversation history, margin data, customer profile)
3. Rep handles the negotiation manually via Portal
4. Rep can click "Resume AI" to hand back control
5. Attribution: Deal credited to Rep at direct-sale commission rate (6%)

---

## 5. Compliance Agent

| Property | Value |
|:---|:---|
| **Model** | GPT-4o-mini |
| **Trigger** | `po.confirmed`, `grn.created`, `invoice.uploaded` events |
| **Output** | Match status → Web Dashboard (Green = matched, Red = exception) |

### Tool Calls

| Tool | Description |
|:---|:---|
| `match_po_grn(po_id, grn_id)` | Compare PO line items to GRN actuals |
| `match_grn_invoice(grn_id, invoice_id)` | Compare GRN to invoice amounts |
| `flag_variance(match_result, threshold)` | If variance > threshold%, flag as exception |
| `generate_einvoice(order_id)` | Create FTA-compliant XML (UBL 2.1) + PDF |
| `send_dashboard_alert(user_id, exception)` | Push exception to Web Dashboard sideover |

---

## 6. Catalog Normalization Agent

| Property | Value |
|:---|:---|
| **Model** | GPT-4o-mini + ada-002 (embeddings) |
| **Trigger** | Supplier uploads catalog via Web Portal (CSV/PDF drag-and-drop) |
| **Output** | Normalized SKUs in Weaviate → Supplier sees mapping confirmation in Portal |

### Tool Calls

| Tool | Description |
|:---|:---|
| `parse_catalog(file, format)` | Extract raw product data from uploaded file |
| `clean_text(raw_item)` | Remove noise, fix encoding, standardize units |
| `extract_attributes(cleaned)` | GPT-4 extracts: name, brand, origin, unit, weight, grade, pack_size |
| `generate_embedding(attributes)` | ada-002 produces 1536-dim vector |
| `search_similar(embedding, threshold)` | Weaviate cosine search: >0.92=match, 0.80-0.92=review, <0.80=new |
| `create_sku(attributes, embedding)` | Insert new normalized SKU |
| `link_supplier_item(supplier_id, sku_id)` | Map supplier's raw item to normalized SKU |

---

## 7. Kitchen Copilot Agent

| Property | Value |
|:---|:---|
| **Model** | GPT-4o-mini |
| **Trigger** | Daily cron (pre-service), POS data update |
| **Output** | Prep list → Mobile App notification |

### Tool Calls

| Tool | Description |
|:---|:---|
| `get_forecast(restaurant_id, date)` | Predict covers and menu mix for the day |
| `get_expiring_stock(restaurant_id, days)` | Items expiring within N days |
| `generate_prep_list(forecast, stock, expiry)` | AI-optimized prep list prioritizing near-expiry |
| `push_to_mobile(staff_id, prep_list)` | Push prep list to Mobile App |

---

## 8. Collections Agent

| Property | Value |
|:---|:---|
| **Model** | GPT-4o-mini |
| **Trigger** | `invoice.created` event, payment due date cron |
| **Output** | Payment reminders via dashboard notification + email escalation |

### Tool Calls

| Tool | Description |
|:---|:---|
| `check_payment_status(invoice_id)` | Is payment received/pending/overdue? |
| `calculate_dso(customer_id)` | Days Sales Outstanding per account |
| `send_reminder(customer_id, level)` | Level 1=gentle, 2=firm, 3=escalate to rep |
| `flag_at_risk(customer_id)` | Mark account as at-risk in rep's territory dashboard |

### Escalation Ladder

| Day | Action | Channel |
|:---|:---|:---|
| Due date | Gentle reminder | Dashboard notification + Email |
| +3 days | Firm reminder | Dashboard notification + Email |
| +7 days | Escalate to Sales Rep | Dashboard alert + Push notification |
| +14 days | Flag account as at-risk | Territory dashboard + Manager report |

---

## 9. Inventory Agent

| Property | Value |
|:---|:---|
| **Model** | GPT-4o-mini |
| **Trigger** | POS webhook, GRN event, stock count submission |
| **Output** | Updated stock levels → Smart Cart input |

### Tool Calls

| Tool | Description |
|:---|:---|
| `get_stock(location_id)` | Current inventory by location |
| `get_lead_times(supplier_ids)` | Delivery lead times per supplier |
| `calculate_reorder_point(sku, run_rate, lead_time)` | When to trigger reorder |
| `update_stock(location_id, sku, delta)` | Adjust stock after GRN or consumption |

---

## 10. Sourcing Agent

| Property | Value |
|:---|:---|
| **Model** | GPT-4o-mini |
| **Trigger** | Cart build request from Purchasing Agent |
| **Output** | Ranked suppliers per SKU with price, lead time, quality score |

### Tool Calls

| Tool | Description |
|:---|:---|
| `query_suppliers(sku, location)` | Find all suppliers offering this SKU |
| `get_price_history(supplier_id, sku, days)` | Historical pricing trends |
| `check_delivery_windows(supplier_id)` | Next available delivery slot |
| `score_supplier(supplier_id, sku)` | Composite score: price + lead time + quality + reliability |
| `apply_target_price_logic(sku, quotes)` | Calculate target price from market data |

---

## 11. Guardrails & Governance

### 11.1 Agent Guardrails

| Guardrail | Enforcement | Set By |
|:---|:---|:---|
| **Minimum Margin** | Agent rejects deals below floor (default 15%) | Supplier Admin |
| **Maximum Discount** | Agent cannot offer > X% off list price | Supplier Admin |
| **Auto-Approve Limit** | Deals above threshold require human approval | Supplier Admin |
| **Budget Limit** | Restaurant cart cannot exceed daily/weekly budget | Restaurant Admin |
| **Upsell Cap** | Max 2 upsell items per transaction | Platform default |

### 11.2 Governance

| Concern | Implementation |
|:---|:---|
| **Audit Trail** | Every agent decision logged: timestamp, rationale, confidence score, tools used |
| **Human Override** | Any user can override AI decision from Web Dashboard with reason |
| **Transparency** | Agent provides "Why this?" explanations for every recommendation |
| **Confidence Threshold** | If agent confidence < 70%, escalate to human |
| **Rate Limiting** | Max 100 agent actions per minute per tenant |
