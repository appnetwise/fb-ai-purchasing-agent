# Requirements Traceability Matrix

> **Authority:** Maps the Stakeholder Document (`AI_Purchase_Manager_with_appendix.docx`, Jan 24, 2026) to the current platform execution (Docs, Dashboard UI, Website).
> **Objective:** Identify coverage and gaps as of Sprint 0 to prioritize Phase 1 delivery.

---

## 1. Core Pain Points

### Restaurant Pain Points
| Stakeholder Requirement | Status | Doc Coverage | Dashboard / Web Coverage | Notes |
| :--- | :---: | :--- | :--- | :--- |
| **1. Fragmented ordering (errors, delays)** | ✅ | `detailed-flows.md` | Dashboard (Smart Cart, Orders) | Fully covered by Smart Cart and PO approval flows. |
| **2. Poor price transparency & comparability** | ✅ | `detailed-flows.md` | Dashboard (Pricing Agent) | Handled by SKU Normalization engine. |
| **3. Manual back-office (LPOs, matching)** | ✅ | `detailed-flows.md` | Dashboard (Invoices) | 2/3-way matching and PO generation fully spec'd. |
| **4. Stockouts and overbuying (waste)** | ✅ | `detailed-flows.md` | Dashboard (Inventory) | Inventory module and auto-replenish alerts built. |
| **5. Low visibility into true food cost/variance** | ⚠️ | `IMPLEMENTATION-GUIDE.md` | None | Concepts defined, but **no step-by-step flow doc** and **no waste/insights dashboard panel**. |
| **6. Delivery tracking** | ❌ | None | None | **Critical Gap:** Completely missing from docs and dashboard UI. |

### Supplier Pain Points
| Stakeholder Requirement | Status | Doc Coverage | Dashboard / Web Coverage | Notes |
| :--- | :---: | :--- | :--- | :--- |
| **1. Multi-channel order intake** | ✅ | `user-journeys.md` | Dashboard (Incoming POs) | Addressed via supplier portal order intake. |
| **2. No unified sales/customer dashboard** | ✅ | `user-journeys.md` | Dashboard (Supplier Analytics)| High-level metrics built in dashboard. |
| **3. No sales rep commission structure** | ✅ | `user-journeys.md` | Dashboard (Sales Rep) | Commission tracking and attribution fully designed. |
| **4. Difficult inventory/demand planning** | ❌ | None | None | Supplier-side demand forecasting is missing from dashboard and flows. |
| **5. Manual promotions (WhatsApp groups)** | ✅ | `detailed-flows.md` | Dashboard (Flash Deals) | Flash Deals and Pricing Agent cover this. |
| **6. Payment friction and cashflow delays** | ✅ | `agent-reference.md` | Dashboard (Collections) | Collections Agent and Invoice tracking built. |

---

## 2. Target Personas & Journeys

| Persona | Status | Doc Coverage | Dashboard / Web Coverage | Notes |
| :--- | :---: | :--- | :--- | :--- |
| **Restaurant: Owner / GM** | ✅ | `user-journeys.md` | Dashboard (Role: Restaurant) | Covered via Approval workflows and Analytics. |
| **Restaurant: Ops Manager** | ✅ | `user-journeys.md` | Dashboard (Role: Restaurant) | Primary user of the main Restaurant Dashboard. |
| **Restaurant: Head Chef** | ✅ | `IMPLEMENTATION-GUIDE.md`| Dashboard (Kitchen Copilot) | Prep lists and daily forecast views. |
| **Restaurant: Receiver / Storekeeper** | ⚠️ | `detailed-flows.md` (GRN)| None | GRN flow exists, but **no dedicated persona journey map**. |
| **Restaurant: Finance / AP** | ✅ | `detailed-flows.md` (Flow 4)| Dashboard (Invoices) | Invoice matching and payments workflows. |
| **Supplier: Owner / GM** | ✅ | `user-journeys.md` | Dashboard (Role: Supplier) | Supplier dashboard overview tab. |
| **Supplier: Sales Rep** | ✅ | `user-journeys.md` | Dashboard (Role: Sales Rep) | Has dedicated user journey and 4 dashboard panels. |
| **Supplier: Dispatcher / Logistics** | ❌ | None | None | **Critical Gap:** No persona journey, no picking/dispatch dashboard panel. |
| **Supplier: Finance** | ✅ | `agent-reference.md` | Dashboard (Supplier Invoices) | Handled via Invoice and Collections Agent screens. |
| **Admin: Platform Admin** | ❌ | None | None | **Critical Gap:** No admin console UI or specs (for catalog QA, dispute res). |

---

## 3. Platform Scope Modules (A-H)

| Module | Status | Doc Coverage | Dashboard / Web Coverage | Notes |
| :--- | :---: | :--- | :--- | :--- |
| **A) Marketplace & Discovery** | ⚠️ | `detailed-flows.md` | None | RFQ flows exist for AI, but **no restaurant-initiated marketplace/RFQ dashboard UI**. |
| **B) Ordering, Tracking, GRN** | ⚠️ | `detailed-flows.md` | Dashboard (Orders) | POs and GRN covered, but **Delivery Tracking** is missing. |
| **C) Invoices, Matching, Payables** | ✅ | `detailed-flows.md` | Dashboard (Invoices) | 3-way matching and OCR extraction well documented. |
| **D) Payments & Credit** | ⚠️ | `architecture-and-flows.md`| None | High-level architecture only. Third-party integrations TBD. |
| **E) Inventory + Reorder System** | ⚠️ | `detailed-flows.md` | Dashboard (Inventory) | Stock transfers missing. Basic inventory depletion UI present. |
| **F) Waste & Variance Intelligence** | ❌ | `IMPLEMENTATION-GUIDE.md`| None | Conceptual only. **No detailed flow doc, no dashboard panel.** Waste mgmt integrations missing. |
| **G) Forecasting + Kitchen Planning** | ⚠️ | `IMPLEMENTATION-GUIDE.md`| Dashboard (Kitchen Copilot) | Prep lists exist, but **Forecast UI** and detailed flow doc are missing. |
| **H) Overseas Supplier Gateway** | ❌ | `medusajs-architecture.md`| None | Minimal architecture mention. No flows, no portal specs, no UAE matchmaking logic. |

---

## 4. AI Engines

| Engine | Status | Doc Coverage | Dashboard / Web Coverage | Notes |
| :--- | :---: | :--- | :--- | :--- |
| **1: SKU Normalization** | ✅ | `detailed-flows.md` | Dashboard (Pricing Agent) | Handled. |
| **2: AI Autopilot Purchasing** | ✅ | `detailed-flows.md` | Dashboard (Smart Cart) | Fully covered. |
| **3: Waste Intelligence** | ❌ | `agent-reference.md` | None | **Critical Gap:** No step-by-step flow or dashboard panel. |
| **4: Kitchen Copilot** | ⚠️ | `agent-reference.md` | Dashboard (Kitchen Copilot) | Needs expanded forecasting UI. |
| **Supplier AI** | ⚠️ | `agent-reference.md` | Dashboard (Supplier Analytics) | Missing churn risk alerts and route consolidation features. |

---

## 5. UX Blueprint Screens

| Screen (from doc) | Status | Dashboard Panel | Notes |
| :--- | :---: | :--- | :--- |
| **Restaurant Home** | ✅ | `buildRestaurantDashboard()` | Complete. |
| **Marketplace (search, supplier pages)** | ❌ | None | **Gap:** Missing screen suite. |
| **RFQ/Quotes (basket, compare, decide)** | ❌ | None | **Gap:** Missing screen suite. |
| **Orders (tracking timeline)** | ⚠️ | `buildOrders()` | Missing actual tracking view (only shows statuses). |
| **Receiving (GRN, photos, discrepancy)** | ❌ | None | Mentioned in flows, but no UI panel exists. |
| **Invoices & Payments** | ✅ | `buildInvoicesMatch()` | Complete 3-way match visualization. |
| **Inventory** | ✅ | `buildInventory()` | Complete. |
| **Waste & Insights** | ❌ | None | **Gap:** Missing waste log and variance dashboard. |
| **Forecast & Prep** | ⚠️ | `buildKitchenCopilot()` | Prep list shown, but no forecast visualization. |
| **Supplier Home / Dashboard** | ✅ | `buildSupplierDashboard()`| Complete. |
| **Supplier Catalog** | ❌ | None | **Gap:** Missing catalog management panel for suppliers. |
| **Supplier Quotes** | ✅ | `buildPricingAgent()` | AI handles quotes, shown in Pricing Agent logs. |
| **Supplier Orders & Dispatch** | ⚠️ | `buildIncomingPOs()` | Shows orders but no picking list or delivery schedules. |
| **Supplier Analytics** | ✅ | `buildSupplierAnalytics()`| Complete. |

---

## 6. Appendices & General Features

| Feature | Status | Doc Coverage | Dashboard / Web Coverage | Notes |
| :--- | :---: | :--- | :--- | :--- |
| **A1) 72-Hour Demo Access** | ⚠️ | `architecture-and-flows.md`| Website (`index.html`) | Mentioned conceptually, but **no clear flow or CTA layout on the site**. |
| **A2) KYC Flow (Demo to Live)** | ⚠️ | `detailed-flows.md` | Website (`index.html`) | Mentioned, but **no step-by-step visual or UI flow**. |
| **A3) Item Inputs (Consumption + Target Price)** | ❌ | None | None | **Critical Gap:** Not accounted for in UI or detailed data flows. |
| **A4) Sales Exec Mapping & Attribution** | ✅ | `user-journeys.md` | Dashboard (Sales Rep) | Handled thoroughly. |
| **Product Bundles (Starter/Pro/Enterprise)** | ❌ | None | Website (`index.html`) | **Critical Gap:** Missing from pricing/features section on the website. |
| **Onboarding Flow (7 Steps)** | ⚠️ | `architecture-and-flows.md`| Website (`index.html`) | Flow exists in architecture, but website doesn't tell the story clearly. |

---

## 7. Delivery Roadmap Alignment

| Stakeholder Phase | Our Coverage Status | Notes |
| :--- | :---: | :--- |
| **Sprint 0:** Foundation | ✅ Ready | Core data models, PRDs, and architectures are complete. |
| **Phase 1:** Marketplace + RFQ + Orders | ⚠️ Partial | Docs are ready, but **Dashboard UI is missing Marketplace & RFQ suites**. |
| **Phase 2:** Receiving + Invoices + Disputes | ✅ Ready | Flow docs and Invoice Matching UI are complete. |
| **Phase 3:** Inventory + Low Stock Triggers | ✅ Ready | Complete. |
| **Phase 4:** AI Purchase Manager v1 | ✅ Ready | Smart Cart AI UI and data flows are complete. |
| **Phase 5:** Waste + Forecast + Copilot | ⚠️ Partial | Conceptual docs exist; **Detailed Flow docs and Waste Dashboard UI missing**. |
| **Phase 6:** Payments/Credit + Overseas | ⚠️ Minimal | Phase 6 is out of scope for MVP1; architecture outlines exist. |

---

## 🎯 Gap Summary & Priority Recommendations

### **High Priority (Must Fix Before Meeting)**
1. **Delivery Tracking** — Create a flow doc and add a "Delivery Tracking timeline" module to the Restaurant Dashboard.
2. **Waste & Insights Dashboard Panel** — Add the "Waste & Variance" UI to the Restaurant Dashboard.
3. **Marketplace & RFQ UI** — Add the marketplace search and RFQ comparison screen to the Restaurant Dashboard. It is the core of MVP1.
4. **Website Updates** — Update `index.html` to clearly show the 3 Product Bundles (Starter/Pro/Enterprise) and the 72-hour Demo → KYC onboarding sequence.

### **Medium Priority**
5. **Detailed Flow Docs** — Write `detailed-flows.md` entries for Waste Logging, Delivery Tracking, and Restaurant-initiated RFQs.
6. **Dispatcher & Admin Personas** — Add a Dispatcher user journey to `user-journeys.md`, and create a bare-bones Admin Console dashboard tab.
7. **Target Price UI** — Ensure the RFQ dashboard mockups include "Consumption" and "Target Price" fields.
