# System Specification (Web-Only)

> **Authority:** Aligned with the Stakeholder Document and B2B Commerce Network positioning.
> **Constraint:** Strictly Web Dashboard + Mobile App. No WhatsApp API.

---

## Table of Contents

1. [Platform Strategy](#1-platform-strategy)
2. [Technology Stack](#2-technology-stack)
3. [User Personas & Interfaces](#3-user-personas--interfaces)
4. [Core Product Modules](#4-core-product-modules)
5. [Data Architecture](#5-data-architecture)
6. [Security & Compliance](#6-security--compliance)

---

## 1. Platform Strategy

### 1.1 Supplier-First Philosophy

The platform prioritizes **supplier value creation** over restaurant convenience. This is a deliberate strategic inversion:

| Traditional Platforms | Our Platform |
|:---|:---|
| Suppliers upload catalogs, wait for orders | Supplier's AI agent proactively sells |
| Price wars via comparison shopping | Basket-aware negotiation protects margins |
| Manual invoicing and collections | Auto e-invoicing + smart payment follow-up |
| No visibility into buyer behavior | Real-time demand intelligence from POS data |
| Sales reps handle everything manually | AI handles 80%+ of routine transactions |

### 1.2 Three-Sided Marketplace

```
 ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
 │ RESTAURANTS │   │  SUPPLIERS  │   │  SALES REPS │
 │             │   │             │   │             │
 │ Buy smarter │   │ Sell more   │   │ Earn more   │
 │ AI carts    │   │ AI agents   │   │ Attribution │
 │ 98% faster  │   │ 3x reach    │   │ Transparent │
 └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
        │                 │                 │
        └────────────┬────┴─────────────────┘
                     │
              ┌──────┴──────┐
              │  PLATFORM   │
              │  MedusaJS   │
              │  + AI Mesh  │
              │  + Web UI   │
              └─────────────┘
```

### 1.3 Web-Only Constraint

All user interactions happen through:

| Channel | Target User | Technology |
|:---|:---|:---|
| **Restaurant Web Dashboard** | Procurement Manager / Head Chef | Next.js + Shadcn/UI |
| **Supplier Web Portal** | Sales Rep / Owner-Operator | Next.js + Shadcn/UI |
| **Mobile App** | Storekeeper / Kitchen Staff | React Native |
| **Push Notifications** | All users | Firebase Cloud Messaging |
| **Email** | Finance / Admin | Transactional emails (Resend) |

> ⚠️ **No WhatsApp, no Telegram, no SMS.** All messaging is in-app notifications and email.

---

## 2. Technology Stack

### 2.1 Core Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| **Frontend** | Next.js 14 (App Router) | SSR, React Server Components |
| **UI Library** | Shadcn/UI + Tailwind CSS | Component library |
| **Mobile** | React Native (Expo) | Storekeeper/Kitchen mobile app |
| **Backend/Commerce** | MedusaJS 2.0 | Headless commerce engine |
| **AI Orchestration** | LangGraph (TypeScript) | Multi-agent state machine |
| **LLM** | GPT-4o (primary), GPT-4o-mini (tasks) | Agent reasoning |
| **Vector Database** | Weaviate | SKU normalization, semantic search |
| **Primary Database** | PostgreSQL (Supabase) | All relational data |
| **Cache / Events** | Redis (Upstash) | Pub/Sub, caching, rate limiting |
| **Auth** | Clerk | Authentication + RBAC |
| **Push Notifications** | Firebase Cloud Messaging | Real-time mobile alerts |
| **E-Invoicing** | Custom + FTA API | UAE Phase 2 compliance |
| **Hosting** | Vercel (Frontend) + Railway (Backend) | Deployment |

### 2.2 AI Agent Stack

```
 ┌────────────────────────────────────────────────────┐
 │                  LANGGRAPH RUNTIME                  │
 │                                                    │
 │   ┌────────────┐  ┌────────────┐  ┌────────────┐  │
 │   │ GPT-4o     │  │ ada-002    │  │ GPT-4o-mini│  │
 │   │ Reasoning  │  │ Embeddings │  │ Classify   │  │
 │   └────────────┘  └────────────┘  └────────────┘  │
 │                                                    │
 │   ┌──────────────────────────────────────────────┐ │
 │   │            TOOL REGISTRY                     │ │
 │   │  get_stock() | normalize_sku() | build_cart()│ │
 │   │  compare_quotes() | draft_quote() | ...      │ │
 │   └──────────────────────────────────────────────┘ │
 │                                                    │
 │   ┌──────────────────────────────────────────────┐ │
 │   │            GUARDRAILS                        │ │
 │   │  Pydantic validation | Budget limits |        │ │
 │   │  Margin floors | Human-approval thresholds    │ │
 │   └──────────────────────────────────────────────┘ │
 └────────────────────────────────────────────────────┘
```

---

## 3. User Personas & Interfaces

### 3.1 Restaurant Procurement Manager (Head Chef)

| Module | Web Dashboard Feature |
|:---|:---|
| **Smart Cart** | AI-generated daily reorder cart with "Why this?" explanations |
| **Price Comparison** | Normalized SKU comparison across suppliers (live pricing) |
| **GRN** | Digital goods receiving via mobile app (photo evidence, weight check) |
| **Invoice Matching** | 3-way match dashboard (PO ↔ GRN ↔ Invoice) with exception sideover |
| **Kitchen Copilot** | AI prep list based on forecast + inventory + expiry dates |
| **Analytics** | Food cost %, spend by category, price trend charts |

### 3.2 Supplier Sales Manager

| Module | Supplier Portal Feature |
|:---|:---|
| **Sales Command Center** | Live feed of AI-closed deals, pending quotes, territory revenue |
| **AI Agent Control** | View agent activity, set guardrails (min margin, max discount), takeover |
| **Catalog Management** | Drag-and-drop CSV/PDF upload → auto-normalized by Catalog Agent |
| **Flash Deals** | Create targeted distressed inventory campaigns (AI-matched to menus) |
| **Invoicing** | Auto-generated FTA-compliant e-invoices (XML + PDF) |
| **Collections** | Smart payment dashboard with automated reminder escalation |

### 3.3 Sales Rep

| Module | Sales Portal Feature |
|:---|:---|
| **Territory Map** | Geographic view of accounts (active, at-risk, churning) |
| **Attribution** | Transparent credit for AI-closed vs direct deals |
| **Commission Tracker** | Live earnings breakdown (direct 6%, AI-attributed 2%, flash deals 4%) |
| **Takeover** | One-click agent takeover for high-value negotiations |
| **Prospect List** | AI-generated leads based on supplier's product match to restaurant menus |

### 3.4 Storekeeper / Kitchen Staff

| Module | Mobile App Feature |
|:---|:---|
| **GRN Scanner** | Tap-to-confirm deliveries with photo capture and weight entry |
| **Prep List** | Kitchen prep checklist from Kitchen Copilot agent |
| **Stock Count** | Quick inventory count with barcode/manual input |
| **Alerts** | Push notifications for deliveries, discrepancies, expiry warnings |

---

## 4. Core Product Modules

### 4.1 Module Map

| Module | Owner Agent | Key Capabilities |
|:---|:---|:---|
| **Smart Cart** | Purchasing Agent | POS-driven forecast → draft cart → one-click approve |
| **Catalog Normalization** | Catalog Agent | CSV/PDF upload → SKU embedding → vector matching |
| **Autonomous Sales** | Sales Agent | Quote generation, basket-aware negotiation, upsell |
| **Compliance** | Compliance Agent | PO ↔ GRN ↔ Invoice 3-way match, FTA e-invoicing |
| **Collections** | Collections Agent | Payment reminders, escalation, DSO tracking |
| **Kitchen Copilot** | Kitchen Agent | Prep list generation, waste reduction, expiry alerts |
| **Flash Deals** | Sales Agent | Distressed inventory → targeted offers → one-click accept |
| **Attribution** | Attribution Engine | Revenue credit to territories, commission calculation |

### 4.2 Product Bundles (Pricing)

| Tier | Target | Price | Includes |
|:---|:---|:---|:---|
| **Starter** | Individual restaurants | Free | Smart Cart, basic GRN, 2 suppliers |
| **Pro** | Growing businesses | AED 499/mo per outlet | All modules, AI negotiation, unlimited suppliers |
| **Enterprise** | Chains & distributors | Custom | Multi-outlet, custom integrations, SLA guarantees |

---

## 5. Data Architecture

### 5.1 Core Entity Model

```
 ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
 │  Restaurant  │────►│   Order      │◄────│  Supplier    │
 │              │     │              │     │              │
 │  name        │     │  status      │     │  name        │
 │  outlets[]   │     │  items[]     │     │  catalog[]   │
 │  POS_config  │     │  total       │     │  guardrails  │
 └──────────────┘     └──────┬───────┘     └──────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
     │  GRN         │ │  Invoice     │ │  Payment     │
     │              │ │              │ │              │
     │  items[]     │ │  e-invoice   │ │  status      │
     │  photos[]    │ │  FTA XML     │ │  due_date    │
     │  discrepancy │ │  match_status│ │  amount      │
     └──────────────┘ └──────────────┘ └──────────────┘
```

### 5.2 Vector Search Schema (Weaviate)

| Class | Properties | Use Case |
|:---|:---|:---|
| `NormalizedSKU` | name, brand, origin, unit, weight, grade, pack_size, embedding | Cross-supplier SKU matching |
| `MenuIngredient` | dish_name, ingredient, quantity, recipe_id | Menu-to-ingredient mapping for upsell |
| `SupplierCatalogItem` | supplier_id, raw_name, normalized_sku_ref, price, MOQ | Supplier catalog items |

---

## 6. Security & Compliance

### 6.1 Authentication & Authorization

| Concern | Implementation |
|:---|:---|
| **Auth Provider** | Clerk (JWT + RBAC) |
| **Roles** | `restaurant_admin`, `restaurant_staff`, `supplier_admin`, `supplier_rep`, `sales_rep`, `platform_admin` |
| **Row-Level Security** | Supabase RLS — users only see their own organization's data |
| **API Keys** | Per-tenant API keys for POS webhooks |

### 6.2 UAE Compliance

| Requirement | Implementation |
|:---|:---|
| **E-Invoicing (FTA Phase 2)** | Auto-generated XML (UBL 2.1) + human-readable PDF |
| **Data Residency** | PostgreSQL hosted in UAE region (Supabase) |
| **VAT** | 5% VAT auto-calculated on all transactions |
| **Audit Trail** | Every agent decision logged with timestamp, rationale, confidence score |
