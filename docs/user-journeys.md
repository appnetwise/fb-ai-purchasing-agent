# F&B AI Platform — User Journeys (Web-Only)

> **Authority:** Aligned with the Stakeholder Document (AI_Purchase_Manager_with_appendix.docx) and the B2B Commerce Network positioning.
> **Interface:** Strictly Web Dashboard (Restaurant/Supplier) and Mobile App (Kitchen/Storekeeper). No WhatsApp.

---

## Table of Contents

1. [Restaurant Procurement Manager Journey](#1-restaurant-procurement-manager-journey)
2. [Supplier Sales Manager Journey](#2-supplier-sales-manager-journey)
3. [Sales Rep Journey](#3-sales-rep-journey)
4. [Supplier Dispatcher / Logistics Journey](#4-supplier-dispatcher--logistics-journey)
5. [Marketplace Transaction Lifecycle](#5-marketplace-transaction-lifecycle)
6. [Agent-to-Agent Autonomous Flow](#6-agent-to-agent-autonomous-flow)

---

# 1. Restaurant Procurement Manager Journey

## 1.1 Persona Snapshot

| Attribute | Detail |
|:---|:---|
| **Role** | Ops Manager / Head Chef (often the same person in SME restaurants) |
| **Daily Pain** | Juggling 5-8 supplier calls/emails, manual stock counts, price guessing |
| **Success Metric** | Food cost ≤ 30%, zero stockouts during service |
| **Tech Comfort** | Web-literate, basic Excel, POS-literate |

## 1.2 Current State (Before Platform)

```
 DAY IN THE LIFE — Restaurant Procurement Manager (No Platform)
 ═══════════════════════════════════════════════════════════════

 06:00  ┌─────────────────────────────────────────┐
 OPEN   │  MORNING PREP                           │
        │  Chef arrives → checks POS overnight    │
        │  sales → mental inventory estimate       │
        │                                         │
        │  ┌─ PAIN ──────────────────────────────┐│
        │  │ No real-time inventory visibility.   ││
        │  │ Relies on memory + walk-in check.    ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 07:00  ┌─────────────────────────────────────────┐
 ORDER  │  ORDERING WINDOW                        │
        │  Chef calls / emails suppliers → types  │
        │  order to 3 suppliers → waits for       │
        │  confirmation by phone or email          │
        │                                         │
        │  ┌─ PAIN ──────────────────────────────┐│
        │  │ No price comparison. No history.     ││
        │  │ Supplier may not reply for hours.    ││
        │  │ Duplicate items across suppliers.    ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 09:00  ┌─────────────────────────────────────────┐
 RECEIVE│  GOODS RECEIVING                        │
        │  Delivery arrives → storekeeper checks  │
        │  quantities against delivery note (DN)  │
        │  → signs paper DN → puts stock away      │
        │                                         │
        │  ┌─ PAIN ──────────────────────────────┐│
        │  │ No weight verification. No photo     ││
        │  │ evidence. Short deliveries go        ││
        │  │ unnoticed until month-end.           ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 14:00  ┌─────────────────────────────────────────┐
 PREP   │  AFTERNOON PREP                         │
        │  Chef preps for dinner service →        │
        │  discovers missing items → emergency    │
        │  call to supplier or sends runner to    │
        │  retail market                           │
        │                                         │
        │  ┌─ PAIN ──────────────────────────────┐│
        │  │ Emergency purchases at retail price  ││
        │  │ inflate food cost by 5-15%.          ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 22:00  ┌─────────────────────────────────────────┐
 CLOSE  │  END-OF-DAY                             │
        │  No reconciliation. Invoices pile up.   │
        │  Finance team chases paper at month-end.│
        │                                         │
        │  ┌─ PAIN ──────────────────────────────┐│
        │  │ Invoice ≠ DN ≠ PO mismatches found  ││
        │  │ weeks later. Margin leakage silent.  ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
```

## 1.3 Web Platform-Transformed Journey

```
 DAY IN THE LIFE — WITH WEB PLATFORM
 ═══════════════════════════════════════════════════

 06:00  ┌─────────────────────────────────────────┐
 OPEN   │  AI CART READY (Web Dashboard)          │
        │  System analyzed overnight POS data →   │
        │  depleted inventory → generated AI      │
        │  suggested reorder cart with best prices │
        │                                         │
        │  ┌─ VALUE ─────────────────────────────┐│
        │  │ Chef opens web dashboard → sees     ││
        │  │ pre-built cart → one-click approve  ││
        │  │ → done. Time: 30 sec vs 45 min.    ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 09:00  ┌─────────────────────────────────────────┐
 RECEIVE│  SMART GRN (Mobile App)                 │
        │  Storekeeper opens mobile app → views   │
        │  expected deliveries → taps to confirm  │
        │  or flag discrepancy → photo evidence   │
        │  auto-captured by camera                 │
        │                                         │
        │  ┌─ VALUE ─────────────────────────────┐│
        │  │ 3-way match (PO ↔ GRN ↔ Invoice)   ││
        │  │ happens automatically. Discrepancy   ││
        │  │ flagged in real-time on dashboard.   ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 14:00  ┌─────────────────────────────────────────┐
 PREP   │  KITCHEN COPILOT (Web Dashboard)        │
        │  AI-generated prep list based on        │
        │  tonight's forecast + current inventory │
        │  + expiry dates. No surprises.          │
        │                                         │
        │  ┌─ VALUE ─────────────────────────────┐│
        │  │ Zero emergency runs. Waste reduced  ││
        │  │ by prioritizing near-expiry stock   ││
        │  │ in today's prep.                    ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 22:00  ┌─────────────────────────────────────────┐
 CLOSE  │  AUTO-RECONCILIATION (Web Dashboard)    │
        │  All invoices matched. Payment          │
        │  scheduled. Food cost dashboard updated │
        │  in real-time.                          │
        │                                         │
        │  ┌─ VALUE ─────────────────────────────┐│
        │  │ Finance sees live P&L per outlet.   ││
        │  │ No month-end fire drills.           ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
```

## 1.4 Restaurant Step-by-Step Flow

| Step | User Action (Web/Mobile) | AI Action | Output |
|:---|:---|:---|:---|
| 1. **Login** | Chef opens React Web Dashboard | — | Home view with Smart Cart widget |
| 2. **Cart Review** | Click "Review Cart" sidebar | AI explains "Why this?" on hover (e.g., "Par 40kg, current 5kg, run-rate 15kg/day") | Items grouped by supplier |
| 3. **Modify & Approve** | Adjust quantities via +/- steppers, click "Approve Orders" | System splits into POs per supplier, triggers RFQ if needed | Purchase Orders created |
| 4. **GRN** | Storekeeper uses Mobile App → "Incoming Deliveries" | Scans items/ticks checkboxes, enters actuals if discrepancy | GRN linked to PO, dashboard updated |
| 5. **Invoice Match** | Finance views "Invoices" tab | AI highlights Matched (Green) vs Exception (Red) | 3-Way match (PO ↔ GRN ↔ Invoice) |
| 6. **Resolution** | Click exception to open detailed Sideover | — | Manual approve or dispute |

## 1.5 Key Touchpoint Metrics

| Touchpoint | Before Platform | With Platform | Improvement |
|:---|:---|:---|:---|
| Order Creation | 45 min/day | 30 sec (AI cart approval) | **98% time saved** |
| Price Comparison | Not done | Automatic (normalized SKUs) | **∞ → real-time** |
| GRN Accuracy | ~70% (manual) | ~99% (digital + photo) | **+29pp** |
| Invoice Reconciliation | 5 days/month | Real-time auto-match | **5 days → 0** |
| Emergency Purchases | 3-4x/week | Near-zero (predictive) | **~95% reduction** |

---

# 2. Supplier Sales Manager Journey

## 2.1 Persona Snapshot

| Attribute | Detail |
|:---|:---|
| **Role** | Sales Rep / Owner-Operator managing 50-200 restaurant accounts |
| **Daily Pain** | Chasing orders, manual quote creation, distressed stock write-offs |
| **Success Metric** | Revenue growth, customer retention, margin preservation |
| **Tech Comfort** | Web/mobile-literate, reluctant ERP user |

## 2.2 Current State (Before Platform)

```
 DAY IN THE LIFE — Supplier Sales Manager (No Platform)
 ═══════════════════════════════════════════════════════

 07:00  ┌─────────────────────────────────────────┐
 START  │  MORNING REVIEW                         │
        │  Sales rep checks email/phone for       │
        │  overnight orders → manually enters     │
        │  into ERP/Excel → builds delivery       │
        │  schedule                                │
        │                                         │
        │  ┌─ PAIN ──────────────────────────────┐│
        │  │ Orders scattered across channels.   ││
        │  │ Missed orders = lost revenue.        ││
        │  │ Manual entry = errors + delays.      ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 09:00  ┌─────────────────────────────────────────┐
 QUOTE  │  QUOTE REQUESTS                         │
        │  Chef asks "what's the price for 50kg   │
        │  salmon?" → Rep checks cost sheet →     │
        │  calculates margin → emails reply        │
        │                                         │
        │  ┌─ PAIN ──────────────────────────────┐│
        │  │ 2-4 hour response time typical.     ││
        │  │ Chef buys from whoever replies      ││
        │  │ first. Lost deal.                    ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 12:00  ┌─────────────────────────────────────────┐
 DISTRESS│ DISTRESSED INVENTORY                   │
        │  Warehouse flags 200kg mushrooms        │
        │  expiring in 72h → Rep mass-emails      │
        │  customer list → "fire sale please!"    │
        │                                         │
        │  ┌─ PAIN ──────────────────────────────┐│
        │  │ Untargeted blast. Low conversion.   ││
        │  │ Looks desperate. Brand damage.       ││
        │  │ 30-40% write-off rate.              ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 16:00  ┌─────────────────────────────────────────┐
 COLLECT│  COLLECTIONS & INVOICING                │
        │  Rep calls overdue accounts → manually  │
        │  creates invoices → no visibility on    │
        │  payment status                          │
        │                                         │
        │  ┌─ PAIN ──────────────────────────────┐│
        │  │ Avg DSO: 45-60 days.                ││
        │  │ Manual invoicing = compliance risk.  ││
        │  │ No automated reminders.             ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
```

## 2.3 Web Platform-Transformed Journey

```
 DAY IN THE LIFE — SUPPLIER WITH WEB PLATFORM
 ═══════════════════════════════════════════════════

 07:00  ┌─────────────────────────────────────────┐
 START  │  ORDERS PRE-LOADED (Supplier Portal)    │
        │  AI Cart orders from restaurants auto-  │
        │  converted to POs in supplier dashboard │
        │  → delivery schedule auto-generated      │
        │                                         │
        │  ┌─ VALUE ─────────────────────────────┐│
        │  │ Zero manual entry. Zero missed      ││
        │  │ orders. 150 restaurants serviced     ││
        │  │ by AI vs 50 by human rep.           ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 09:00  ┌─────────────────────────────────────────┐
 QUOTE  │  INSTANT-CLOSE AI AGENT (Web Portal)    │
        │  Chef requests quote → AI Agent         │
        │  responds in <3 seconds with binding    │
        │  offer within margin guardrails →        │
        │  Rep sees "Negotiation Active" badge     │
        │                                         │
        │  ┌─ VALUE ─────────────────────────────┐│
        │  │ Win rate: 35% (vs 15% human).       ││
        │  │ Basket-aware negotiation upsells.   ││
        │  │ Rep freed for relationship work.     ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 12:00  ┌─────────────────────────────────────────┐
 DISTRESS│ TARGETED FLASH DEALS (Dashboard)       │
        │  AI identifies 20 chefs with relevant   │
        │  menu items → sends push notification   │
        │  + dashboard alert → one-click accept    │
        │                                         │
        │  ┌─ VALUE ─────────────────────────────┐│
        │  │ Conversion: 25-40% (vs 5% blast).  ││
        │  │ Write-off reduced from 30% to 5%.   ││
        │  │ Brand protected — looks premium.    ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 16:00  ┌─────────────────────────────────────────┐
 COLLECT│  AUTO-INVOICING & SMART COLLECTIONS     │
        │  E-invoice generated at deal close →    │
        │  FTA-compliant XML+PDF → automated      │
        │  payment reminders with escalation      │
        │                                         │
        │  ┌─ VALUE ─────────────────────────────┐│
        │  │ DSO: 45 days → 20 days.             ││
        │  │ 100% e-invoicing compliance.        ││
        │  │ Collections on autopilot.           ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
```

## 2.4 Supplier Step-by-Step Flow

| Step | User Action (Web Portal) | AI Action | Output |
|:---|:---|:---|:---|
| 1. **Login** | Sales Rep opens Supplier Web Portal | — | Sales Command Center with live feed |
| 2. **Orders** | View "Incoming Orders" panel | Auto-converted POs from restaurant AI carts | Delivery schedule auto-generated |
| 3. **Negotiation** | Monitor "Negotiation Active" badge, optionally Takeover | AI Agent calculates margin, offers discount within guardrails | Binding quote sent to restaurant |
| 4. **Flash Deals** | Click "Distressed Inventory" → "Create Flash Deal" | AI matches items to relevant restaurants' menus | Push notifications + dashboard alerts sent |
| 5. **Invoicing** | View "Invoices" tab | Auto-generated FTA-compliant e-invoices (XML+PDF) | E-invoice sent to restaurant |
| 6. **Collections** | Monitor "Payments" dashboard | Automated reminders with escalation ladder | DSO tracking per account |

## 2.5 Key Touchpoint Metrics

| Touchpoint | Before Platform | With Platform | Improvement |
|:---|:---|:---|:---|
| Quote Response | 2-4 hours | <3 seconds (AI Agent) | **~99% faster** |
| Deal Win Rate | 15% (manual) | 35% (AI-assisted) | **+133%** |
| Distressed Inventory Write-off | 30-40% | ~5% (targeted Flash Deals) | **~85% reduction** |
| Days Sales Outstanding (DSO) | 45-60 days | ~20 days | **~60% improvement** |
| Manual Order Entry | 2 hours/day | Zero (auto-PO) | **100% eliminated** |

---

# 3. Sales Rep Journey

> **New persona** from the Stakeholder Document — Sales reps get attribution, territory mapping, and commission tracking.

## 3.1 Persona Snapshot

| Attribute | Detail |
|:---|:---|
| **Role** | Field Sales Representative managing a territory of 30-80 restaurant accounts |
| **Daily Pain** | No visibility into AI-closed deals, manual commission tracking, territory conflicts |
| **Success Metric** | Revenue per territory, new account acquisition, commission accuracy |
| **Tech Comfort** | Mobile-first, dashboard-literate |

## 3.2 Web Platform Journey

```
 DAY IN THE LIFE — Sales Rep WITH WEB PLATFORM
 ═══════════════════════════════════════════════════

 08:00  ┌─────────────────────────────────────────┐
 START  │  TERRITORY DASHBOARD (Web Portal)       │
        │  Rep logs in → sees territory map       │
        │  with account health (active, at-risk,  │
        │  churning) → AI Agent activity feed:    │
        │  "2 deals closed overnight in your      │
        │   territory (AED 3,200 total)"          │
        │                                         │
        │  ┌─ VALUE ─────────────────────────────┐│
        │  │ Full visibility into AI-closed      ││
        │  │ deals. Credit attributed properly.  ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 10:00  ┌─────────────────────────────────────────┐
 MANAGE │  TAKEOVER & NEGOTIATION CONTROL         │
        │  AI agent negotiating a bulk deal →      │
        │  Rep sees "Negotiation Active" badge →  │
        │  can click "Takeover" to handle          │
        │  personally for high-value accounts      │
        │                                         │
        │  ┌─ VALUE ─────────────────────────────┐│
        │  │ AI handles routine (80% of deals).  ││
        │  │ Rep focuses on relationship-         ││
        │  │ sensitive accounts (20%).            ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 14:00  ┌─────────────────────────────────────────┐
 TRACK  │  COMMISSION & PERFORMANCE               │
        │  Live commission tracker shows:          │
        │  - Direct sales: AED 12,000 (6%)        │
        │  - AI-attributed sales: AED 45,000 (2%)│
        │  - Flash deals: AED 3,500 (4%)          │
        │                                         │
        │  ┌─ VALUE ─────────────────────────────┐│
        │  │ Transparent attribution — AI deals  ││
        │  │ in your territory still earn you    ││
        │  │ commission (at reduced rate).        ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 17:00  ┌─────────────────────────────────────────┐
 REPORT │  EOD SUMMARY (Dashboard + Push)         │
        │  Auto-generated daily report:            │
        │  - Orders processed: 47                  │
        │  - Revenue: AED 18,200                   │
        │  - At-risk accounts flagged: 3           │
        │  - New prospects suggested: 5            │
        │                                         │
        │  ┌─ VALUE ─────────────────────────────┐│
        │  │ Data-driven territory management.   ││
        │  │ Churn risk flagged before it         ││
        │  │ becomes churn.                       ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
```

## 3.3 Sales Rep Step-by-Step Flow

| Step | User Action (Web Portal) | AI Action | Output |
|:---|:---|:---|:---|
| 1. **Territory View** | View territory map + account health | AI flags at-risk and churning accounts | Prioritized account list |
| 2. **Activity Feed** | Review overnight AI activity | AI logs all deals with decision rationale | Full attribution trail |
| 3. **Takeover** | Click "Takeover" on active negotiations | AI pauses and transfers context to rep | Seamless handoff with history |
| 4. **Commission** | View live commission tracker | AI calculates attribution (direct vs. AI-assisted) | Transparent pay breakdown |
| 5. **Prospects** | Review "Suggested Prospects" list | AI identifies restaurants matching supplier's product mix | Lead scoring + contact info |

---

# 4. Supplier Dispatcher / Logistics Journey

## 4.1 Persona Snapshot

| Attribute | Detail |
|:---|:---|
| **Role** | Dispatcher / Warehouse Manager / Logistics Lead |
| **Daily Pain** | Printing picking lists, driver routing chaos, handling on-the-fly substitutions, lost delivery notes |
| **Success Metric** | On-time delivery rate, zero mispicks, efficient vehicle capacity utilization |
| **Tech Comfort** | ERP/WMS literate, relies heavily on driver mobile apps and routing software |

## 4.2 Current State (Before Platform)

```
 DAY IN THE LIFE — Supplier Dispatcher (No Platform)
 ═══════════════════════════════════════════════════════

 04:00  ┌─────────────────────────────────────────┐
 START  │  MORNING SCRAMBLE                       │
        │  Prints 50 PDF orders received via      │
        │  email/WhatsApp overnight. Divides      │
        │  paper picking lists among warehouse    │
        │  staff.                                 │
        │                                         │
        │  ┌─ PAIN ──────────────────────────────┐│
        │  │ Paper-based picking is slow. Error  ││
        │  │ prone due to bad handwriting or     ││
        │  │ missed emails.                      ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 06:00  ┌─────────────────────────────────────────┐
 PICK   │  SUBSTITUTION CHAOS                     │
        │  Picker finds out they are out of       │
        │  10kg Rice. Runs to dispatcher.         │
        │  Dispatcher calls sales rep to call     │
        │  chef. Wait 45 mins for approval.       │
        │                                         │
        │  ┌─ PAIN ──────────────────────────────┐│
        │  │ High operational friction to handle ││
        │  │ simple substitutions. Delays truck  ││
        │  │ departures.                         ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 08:00  ┌─────────────────────────────────────────┐
 ROUTE  │  DRIVER DISPATCH                        │
        │  Drivers handed clipboard with delivery │
        │  notes (DNs). Route logic is entirely   │
        │  in the driver's head.                  │
        │                                         │
        │  ┌─ PAIN ──────────────────────────────┐│
        │  │ No visibility once truck leaves.    ││
        │  │ "Where is my order?" calls flood    ││
        │  │ the dispatcher's phone all morning. ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 16:00  ┌─────────────────────────────────────────┐
 RECON  │  END-OF-DAY RECONCILIATION              │
        │  Driver returns with crumpled,          │
        │  annotated delivery notes. Dispatcher   │
        │  spends hours manually typing returns/  │
        │  shorts into ERP for invoicing.         │
        │                                         │
        │  ┌─ PAIN ──────────────────────────────┐│
        │  │ Data entry nightmare. Risk of lost  ││
        │  │ or unbilled inventory.              ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
```

## 4.3 Web Platform-Transformed Journey

```
 DAY IN THE LIFE — DISPATCHER WITH WEB PLATFORM
 ═══════════════════════════════════════════════════

 04:00  ┌─────────────────────────────────────────┐
 START  │  AUTO-CONSOLIDATED PICK LISTS           │
        │  Orders auto-aggregated in Dashboard.   │
        │  Picking lists electronically beamed to │
        │  warehouse scanners/tablets by zone     │
        │  (Dry, Chiller, Freezer).               │
        │                                         │
        │  ┌─ VALUE ─────────────────────────────┐│
        │  │ Zero paper. Optimized warehouse     ││
        │  │ routing. Real-time pick progress.   ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 06:00  ┌─────────────────────────────────────────┐
 PICK   │  SMART SUBSTITUTIONS                    │
        │  Picker marks 10kg Rice as Out-of-Stock.│
        │  System instantly checks Chef's pre-    │
        │  approved sub rules. Auto-subs 2x 5kg.  │
        │  Notifies Chef immediately via App.     │
        │                                         │
        │  ┌─ VALUE ─────────────────────────────┐│
        │  │ No phone calls needed. Trucks leave ││
        │  │ on time. Chef is kept in the loop.  ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 08:00  ┌─────────────────────────────────────────┐
 ROUTE  │  AI ROUTE OPTIMIZATION                  │
        │  System groups orders by geography +    │
        │  delivery window + truck load capacity. │
        │  Pushes turn-by-turn route to Driver App│
        │                                         │
        │  ┌─ VALUE ─────────────────────────────┐│
        │  │ Reduced fuel/time costs. Restaurant ││
        │  │ gets live ETA tracking (reduces     ││
        │  │ inbound status calls to zero).      ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
                         │
                         ▼
 16:00  ┌─────────────────────────────────────────┐
 RECON  │  DIGITAL PROOF OF DELIVERY (POD)        │
        │  Driver completes digital GRN.          │
        │  Shortages/Returns instantly synced to  │
        │  central database. Auto-triggers e-     │
        │  invoice generation or credit note req. │
        │                                         │
        │  ┌─ VALUE ─────────────────────────────┐│
        │  │ Instant, paperless reconciliation.  ││
        │  │ 100% accurate billing data.         ││
        │  └──────────────────────────────────────┘│
        └─────────────────────────────────────────┘
```

## 4.4 Dispatcher Step-by-Step Flow

| Step | User Action (Web Portal/Mobile) | AI Action | Output |
|:---|:---|:---|:---|
| 1. **Batching** | Dispatcher clicks "Generate Pick Lists" | AI groups orders by warehouse zone and stock availability | Digital Pick Tickets sent to floor |
| 2. **Substitutions** | Warehouse selects out-of-stock item | AI recommends pre-approved alternatives or prompts manual substitution rule | Stock updated, Chef gets app notification |
| 3. **Routing** | Dispatcher selects "Optimize Routes" | AI maps out shortest distance vs. delivery time windows | Manifest loaded onto Driver App |
| 4. **Delivery** | Driver follows App, scans at delivery | System pulses ETA signals to Restaurant Dashboard | Live truck tracking enabled |
| 5. **POD Check** | Driver captures e-signature + photos | AI matches quantities delivered against PO (3-way match start) | Digital GRN closed, Invoice unblocked |

---

# 5. Marketplace Transaction Lifecycle

The platform operates as a **3-sided marketplace**: Restaurants buy, Suppliers sell, Sales Reps manage.

```
 MARKETPLACE TRANSACTION LIFECYCLE
 ═══════════════════════════════════════════════════

  ① LIST          ② OUTREACH       ③ QUOTE          ④ CONVERT
 ┌──────────┐   ┌──────────┐    ┌──────────┐    ┌──────────┐
 │ Supplier │   │ AI Agent │    │ AI Agent │    │ AI Agent │
 │ lists    │──►│ matches  │───►│ generates│───►│ auto-    │
 │ catalog  │   │ items to │    │ binding  │    │ closes   │
 │ + prices │   │ relevant │    │ quote    │    │ deal     │
 │ on portal│   │ menus    │    │ within   │    │ within   │
 │          │   │          │    │ margins  │    │ margins  │
 └──────────┘   └──────────┘    └──────────┘    └──────────┘
                                                      │
      ┌───────────────────────────────────────────────┘
      │
      ▼
  ⑤ REPEAT       ⑥ UPSELL        ⑦ COMMISSION     ⑧ SETTLE
 ┌──────────┐   ┌──────────┐    ┌──────────┐    ┌──────────┐
 │ AI learns│   │ AI spots │    │ System   │    │ Auto     │
 │ patterns │──►│ cross-   │───►│ attributes───►│ e-invoice│
 │ → auto-  │   │ sell and │    │ revenue  │    │ + smart  │
 │ reorder  │   │ upsell   │    │ to rep's │    │ collect- │
 │ carts    │   │ opportu- │    │ territory│    │ ions     │
 │          │   │ nities   │    │          │    │          │
 └──────────┘   └──────────┘    └──────────┘    └──────────┘
```

### Network Economics

| Participant | Value Received | Platform Capture |
|:---|:---|:---|
| **Restaurant** | AI-optimized procurement, 8-12% cost savings | SaaS subscription (AED 499/mo per outlet) |
| **Supplier** | 3x addressable accounts, <3s quote response | Revenue share on AI-closed deals |
| **Sales Rep** | Transparent attribution, AI handles routine | Commission on territory revenue |

---

# 6. Agent-to-Agent Autonomous Flow

### The "Tuesday Flour" Scenario

A complete walkthrough of how the Restaurant AI and Supplier AI interact autonomously via the web platform.

```
 AGENT-TO-AGENT FLOW — Predictive Reorder
 ═══════════════════════════════════════════════════

 RESTAURANT AGENT                    SUPPLIER AGENT
 (Buyer-Side AI)                     (Seller-Side AI)
       │                                   │
 ┌─────┴──────────────────┐                │
 │ TRIGGER                │                │
 │ Cron: Tuesday 10:00 AM │                │
 │ Pattern detected:      │                │
 │ "Chef orders 50kg      │                │
 │  Flour every Tuesday"  │                │
 │ No order exists today. │                │
 └─────┬──────────────────┘                │
       │                                   │
       │  ① Generate Smart Draft           │
       │  - 50kg Flour (Brand A)           │
       │  - Check inventory: OK            │
       │  - Check: Brand A out of stock    │
       │    at preferred supplier          │
       │  - Auto-swap → Brand B            │
       │    (same spec, verified sub,      │
       │     AED 2/kg cheaper)             │
       │                                   │
       │  ② Push to Dashboard              │
       │  Chef sees notification:          │
       │  "Your usual Tuesday order is     │
       │   ready. Swapped Brand A →        │
       │   Brand B (same spec, cheaper).   │
       │   Total: AED 450."               │
       │  [ Approve ] [ Edit ] [ Skip ]    │
       │                                   │
       │  ③ Chef clicks [Approve] ────────►│
       │                                   │
       │                             ┌─────┴──────────────────┐
       │                             │ SUPPLIER AGENT         │
       │                             │ RECEIVES PO            │
       │                             │                        │
       │                             │ ④ Validate:            │
       │                             │  - Stock: 500kg avail  │
       │                             │  - Credit: Chef Tier A │
       │                             │  - Margin: 22% (>15%)  │
       │                             │                        │
       │                             │ ⑤ Auto-Confirm PO      │
       │                             │  (within guardrails,   │
       │                             │   no human needed)     │
       │                             │                        │
       │                             │ ⑥ Upsell Check:        │
       │                             │  "Chef has deep-fried  │
       │                             │   items on menu but no │
       │                             │   Fryer Oil in cart"   │
       │                             │                        │
       │                             │ ⑦ Generate Upsell:     │
       │                             │  "Add 3 tins Fryer Oil │
       │                             │   → unlock 5% bundle   │
       │                             │   discount on Flour"   │
       │                             └─────┬──────────────────┘
       │                                   │
       │◄──── ⑧ Upsell Push Notification ──│
       │                                   │
       │  ⑨ Chef clicks [Add Oil] ────────►│
       │                                   │
       │                             ┌─────┴──────────────────┐
       │                             │ ⑩ FINAL PO CONFIRMED   │
       │                             │  Flour 50kg + Oil 3tin │
       │                             │  Total: AED 510        │
       │                             │  Margin: 24% ✓         │
       │                             │                        │
       │                             │ ⑪ E-Invoice Generated  │
       │                             │  FTA-Compliant XML+PDF │
       │                             │  Sent to dashboard     │
       │                             │                        │
       │                             │ ⑫ Delivery Scheduled   │
       │                             │  Route optimized with  │
       │                             │  3 other nearby orders │
       │                             └────────────────────────┘
       │
 ┌─────┴──────────────────┐
 │ AUDIT TRAIL             │
 │ Every step logged with: │
 │ - Timestamp             │
 │ - Decision rationale    │
 │ - Human override: None  │
 │ - Confidence scores     │
 └─────────────────────────┘
```

### Simulation Outcome Metrics

| Metric | Value |
|:---|:---|
| Total elapsed time (trigger → confirmed PO) | ~45 seconds |
| Human interventions required | 2 clicks (approve + add oil) |
| Upsell achieved | ✅ +AED 60 (Fryer Oil) |
| Supplier margin | 24% (above 15% floor) |
| E-Invoice generated | Instant, FTA-compliant |
| Sales Rep attribution | ✅ Credited to territory owner |
