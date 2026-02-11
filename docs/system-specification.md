# F&B AI Platform — Unified System Specification

> **Version:** 1.0  
> **Date:** February 2026  
> **Prepared for:** Client Meeting — Platform Strategy & Architecture Review  
> **Prepared by:** AppNetWise Engineering

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Platform Strategy](#2-platform-strategy)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [User Persona Integration](#5-user-persona-integration)
6. [Autonomous Sales Agent](#6-autonomous-sales-agent)
7. [Core Data Flows](#7-core-data-flows)
8. [UAE E-Invoicing Compliance](#8-uae-e-invoicing-compliance)
9. [Strategic Value Propositions](#9-strategic-value-propositions)

---

## 1. Executive Summary

The F&B AI Platform is a **supplier-first** B2B commerce system designed for the UAE food & beverage industry. It replaces fragmented, manual procurement workflows — phone calls, WhatsApp messages, PDF invoices, spreadsheet inventory — with an AI-powered platform that makes suppliers' lives dramatically easier while giving restaurants unprecedented operational intelligence.

### The Core Thesis

> **Make the supplier's life so easy that the platform becomes indispensable.**

Traditional F&B procurement platforms treat suppliers as passive catalog holders. Our platform inverts this by giving suppliers an **autonomous AI sales agent** — a tireless digital sales rep that negotiates, closes deals, liquidates distressed inventory, and collects payments 24/7 within guardrails the supplier controls.

### What We're Building

```
┌─────────────────────────────────────────────────────────────────────┐
│                     F&B AI Platform                                 │
│                                                                     │
│   ┌──────────────────┐     ┌──────────────────┐                     │
│   │  Restaurant Side │     │  Supplier Side    │                    │
│   │                  │     │                   │                    │
│   │  • AI-Suggested  │     │  • Autonomous     │                    │
│   │    Smart Carts   │◄───►│    Sales Agent    │                    │
│   │  • Auto Reorder  │     │  • Flash Deals    │                    │
│   │  • GRN + 3-Way   │     │  • Smart Pricing  │                    │
│   │    Match         │     │  • E-Invoicing    │                    │
│   │  • Kitchen       │     │  • Smart          │                    │
│   │    Copilot       │     │    Collections    │                    │
│   └──────────────────┘     └──────────────────┘                     │
│                     ▲                                               │
│                     │                                               │
│            ┌────────┴────────┐                                      │
│            │  Multi-Agent    │                                      │
│            │  AI Layer       │                                      │
│            │  (LangGraph)    │                                      │
│            └─────────────────┘                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Platform Strategy

### 2.1 Supplier-First Philosophy

The platform prioritizes **supplier value creation** over restaurant convenience. This is a deliberate strategic inversion:

| Traditional Platforms | Our Platform |
|---|---|
| Suppliers upload catalogs, wait for orders | Supplier's AI agent proactively sells |
| Price wars via comparison shopping | Basket-aware negotiation protects margins |
| Manual invoicing and collections | Auto e-invoicing + smart payment follow-up |
| No visibility into buyer behavior | Real-time demand intelligence from POS data |
| Sales reps handle everything manually | AI handles 80%+ of routine transactions |

### 2.2 Revenue Model

The platform captures value at multiple points in the transaction lifecycle:

1. **Transaction Fees** — Small percentage on completed orders
2. **Premium Supplier Tools** — Advanced analytics, priority placement, Flash Deal features
3. **Financial Services** — Invoice factoring, credit facilitation
4. **Data & Intelligence** — Market insights, demand forecasting reports

### 2.3 Network Effects

```
  More Restaurants ──► More Data ──► Smarter AI ──► More Value for Suppliers
       ▲                                                     │
       └─────────────────────────────────────────────────────┘
                    More Suppliers → Better Selection
```

---

## 3. Technology Stack

### 3.1 Stack Overview

| Layer | Technology | Why |
|---|---|---|
| **Commerce Core** | MedusaJS 2.0 (Node.js, TypeScript) | Open-source, headless, extensible B2B commerce |
| **Frontend** | Next.js 14+ (React, TypeScript) | SSR, App Router, mobile-responsive |
| **Database** | PostgreSQL 15+ | ACID compliance, JSONB for flexible schemas |
| **Cache & Queue** | Redis + BullMQ | Real-time operations, background job processing |
| **Vector DB** | Weaviate | SKU normalization via semantic similarity |
| **AI Orchestration** | LangGraph + LangChain | Multi-agent workflows with state + human-in-the-loop |
| **LLM** | OpenAI GPT-4 (primary), Claude (fallback) | Reasoning, attribute extraction, negotiation |
| **Embeddings** | OpenAI text-embedding-ada-002 | Catalog and SKU vectorization |
| **OCR** | AWS Textract / Google Document AI | Invoice and delivery note digitization |
| **POS Integration** | Foodics API, Oracle Simphony STSG2 | Real-time sales and inventory data |
| **Storage** | AWS S3 | Documents, images, invoice PDFs |
| **Hosting** | AWS ECS/EKS (or GCP Cloud Run) | Container orchestration, auto-scaling |
| **CI/CD** | GitHub Actions | Automated testing, staging, deployment |
| **Monitoring** | Datadog / New Relic | APM, log aggregation, alerting |

### 3.2 Why MedusaJS 2.0

MedusaJS was chosen over alternatives (Shopify, WooCommerce, custom-built) for specific reasons:

- **Headless & Open-Source** — Full control over frontend and backend, no vendor lock-in
- **Module Architecture** — Custom modules (AI, Procurement, Compliance) plug in without forking core
- **B2B-Ready** — Native support for price lists, customer groups, custom workflows
- **Event-Driven** — Built-in event bus integrates seamlessly with LangGraph agent orchestration
- **TypeScript-First** — Type safety across the entire stack

### 3.3 Architecture Diagram

```
┌───────────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                                 │
│                                                                       │
│   ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐    │
│   │ Restaurant App  │  │ Supplier Portal │  │ Admin Dashboard  │    │
│   │ (Next.js)       │  │ (Next.js)       │  │ (Next.js)        │    │
│   │                 │  │                 │  │                  │    │
│   │ • Smart Cart    │  │ • Guardrails    │  │ • Tenant Mgmt    │    │
│   │ • GRN Module    │  │ • Performance   │  │ • SKU Review     │    │
│   │ • Prep Plans    │  │ • Flash Deals   │  │ • System Health  │    │
│   │ • Approvals     │  │ • Collections   │  │ • Compliance     │    │
│   └────────┬────────┘  └────────┬────────┘  └────────┬─────────┘    │
└────────────┼────────────────────┼────────────────────┼───────────────┘
             │                    │                    │
             ▼                    ▼                    ▼
┌───────────────────────────────────────────────────────────────────────┐
│                     API GATEWAY LAYER                                 │
│   • Authentication (JWT + RBAC)                                       │
│   • Rate Limiting                                                     │
│   • Request Validation                                                │
│   • API Versioning                                                    │
└──────────────────────────────┬────────────────────────────────────────┘
                               │
                               ▼
┌───────────────────────────────────────────────────────────────────────┐
│                    MEDUSAJS 2.0 CORE                                  │
│                                                                       │
│   ┌─────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │
│   │ B2B Commerce│  │ Custom AI    │  │ Compliance Module        │   │
│   │ Module      │  │ Module       │  │                          │   │
│   │             │  │              │  │ • UAE E-Invoicing (FTA)  │   │
│   │ • Products  │  │ • AI Cart    │  │ • PINT AE Format        │   │
│   │ • Orders    │  │ • Agent Mgmt │  │ • ASP Integration       │   │
│   │ • Customers │  │ • Predictions│  │ • Tax Calculations      │   │
│   │ • Pricing   │  │ • Guardrails │  │ • Audit Trail           │   │
│   │ • Inventory │  │              │  │                          │   │
│   └──────┬──────┘  └──────┬───────┘  └───────────┬──────────────┘   │
│          │                │                      │                   │
│          ▼                ▼                      ▼                   │
│   ┌─────────────────────────────────────────────────────────────┐    │
│   │                     EVENT BUS (Redis)                       │    │
│   │  catalog.uploaded │ inventory.low_stock │ order.created     │    │
│   │  grn.completed    │ invoice.uploaded    │ payment.due       │    │
│   └────────┬────────────────────┬───────────────────┬───────────┘    │
└────────────┼────────────────────┼───────────────────┼────────────────┘
             │                    │                   │
             ▼                    ▼                   ▼
┌───────────────────────────────────────────────────────────────────────┐
│               LANGGRAPH MULTI-AGENT AI LAYER                         │
│                                                                       │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│   │ Planner  │  │ Catalog  │  │Purchasing│  │ Autonomous Sales │   │
│   │ Agent    │  │ Agent    │  │ Agent    │  │ Agent            │   │
│   │          │  │          │  │          │  │                  │   │
│   │ Decomposes│ │Normalizes│  │Drafts    │  │ Negotiates,      │   │
│   │ tasks,   │  │SKUs,     │  │smart     │  │ liquidates,      │   │
│   │ routes to│  │matches   │  │carts,    │  │ upsells, closes  │   │
│   │ agents   │  │products  │  │compares  │  │ deals on behalf  │   │
│   │          │  │          │  │suppliers │  │ of supplier      │   │
│   └──────────┘  └──────────┘  └──────────┘  └──────────────────┘   │
│                                                                       │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                          │
│   │Compliance│  │Inventory │  │ Kitchen  │                          │
│   │Agent     │  │Agent     │  │ Copilot  │                          │
│   │          │  │          │  │          │                          │
│   │Validates │  │Monitors  │  │Generates │                          │
│   │invoices, │  │stock,    │  │daily prep│                          │
│   │3-way     │  │triggers  │  │plans from│                          │
│   │match,    │  │reorders, │  │POS data &│                          │
│   │e-invoice │  │tracks    │  │inventory │                          │
│   │generation│  │par levels│  │          │                          │
│   └──────────┘  └──────────┘  └──────────┘                          │
└───────────────────────────────────────────────────────────────────────┘
             │                    │                   │
             ▼                    ▼                   ▼
┌───────────────────────────────────────────────────────────────────────┐
│                    DATA & PERSISTENCE LAYER                           │
│                                                                       │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│   │ PostgreSQL   │  │ Weaviate     │  │ AWS S3                   │  │
│   │              │  │ (Vector DB)  │  │                          │  │
│   │ • Orders     │  │              │  │ • Catalogs (CSV)         │  │
│   │ • Inventory  │  │ • SKU        │  │ • Invoices (PDF)         │  │
│   │ • Invoices   │  │   Embeddings │  │ • GRN Photos             │  │
│   │ • Users      │  │ • Semantic   │  │ • Prep Plan PDFs         │  │
│   │ • Audit Logs │  │   Search     │  │                          │  │
│   │ • GRNs       │  │              │  │                          │  │
│   └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 4. System Architecture

### 4.1 Multi-Agent Design (ReAct Pattern)

Every agent follows the **ReAct** (Reasoning + Acting) loop — a structured pattern where the AI reasons about the situation, decides on an action, executes it via a tool call, observes the result, and repeats until the task is complete.

```
┌────────────────────────────────────────────────────┐
│                  ReAct Loop                         │
│                                                     │
│   ┌─────────┐     ┌──────────┐     ┌────────────┐ │
│   │ THOUGHT │────►│  ACTION  │────►│ OBSERVATION│ │
│   │         │     │          │     │            │ │
│   │ "Chicken│     │ Call:    │     │ Returns:   │ │
│   │  is low,│     │ search   │     │ 3 suppliers│ │
│   │  need to│     │ suppliers│     │ with prices│ │
│   │  reorder│     │ (sku)    │     │ & ratings  │ │
│   │  ~18kg" │     │          │     │            │ │
│   └─────────┘     └──────────┘     └─────┬──────┘ │
│       ▲                                   │        │
│       └───────────────────────────────────┘        │
│                  (loop until done)                   │
└────────────────────────────────────────────────────┘
```

### 4.2 Agent Roles

| Agent | Purpose | Key Tools |
|---|---|---|
| **Planner** | Decomposes user requests, routes to specialized agents | `classify_intent()`, `route_to_agent()` |
| **Catalog / Normalization** | Normalizes supplier SKUs across vendors via embeddings | `generate_embedding()`, `similarity_search()`, `extract_attributes()` |
| **Sourcing / Comparison** | Finds best supplier for each SKU by price, lead time, rating | `search_suppliers()`, `compare_prices()`, `check_reliability()` |
| **Purchasing** | Drafts smart carts, creates POs, handles approvals | `create_cart_line()`, `validate_cart()`, `create_po()` |
| **Compliance** | Validates invoices, performs 3-way matching, generates e-invoices | `parse_invoice()`, `three_way_match()`, `generate_e_invoice()` |
| **Inventory / POS** | Monitors stock levels, depletes on sales, triggers reorders | `fetch_inventory()`, `deplete_stock()`, `check_par_levels()` |
| **Kitchen Copilot** | Generates daily prep plans from forecasted demand | `fetch_sales_history()`, `expand_bom()`, `generate_prep_plan()` |
| **Autonomous Sales** | Negotiates, closes deals, liquidates inventory for suppliers | `check_guardrails()`, `calculate_margin()`, `draft_offer()` |

### 4.3 LangGraph State Machine

All agent workflows are implemented as **LangGraph state graphs** — each node is a function or agent, edges define transitions, and the state is persisted in PostgreSQL for durability and human-in-the-loop interrupts.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Procurement │     │   Sourcing   │     │  Cart Draft  │
│    Agent     │────►│    Agent     │────►│    Agent     │
│              │     │              │     │              │
│ calc run-rate│     │ compare 3    │     │ build cart   │
│ calc lead-   │     │ suppliers    │     │ with prices  │
│ time buffer  │     │ rank by      │     │ & reasoning  │
│              │     │ score        │     │              │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │   INTERRUPT   │
                                          │  Human        │
                                          │  Approval     │
                                          │              │
                                          │ Manager sees  │
                                          │ cart + reason │
                                          │ Approve/Edit/ │
                                          │ Reject        │
                                          └──────┬───────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │  Create PO   │
                                          │  Agent       │
                                          │              │
                                          │ Submit order  │
                                          │ Notify       │
                                          │ supplier     │
                                          │ Schedule GRN │
                                          └──────────────┘
```

### 4.4 Guardrails & Safety

Every AI action is bound by guardrails — pre-configured rules that prevent the system from making harmful decisions:

| Guardrail | Rule | Enforcement |
|---|---|---|
| **Max Order Value** | No single PO exceeds tenant-defined limit | Hard block + escalation |
| **Price Deviation** | Flag if price deviates >5% from 30-day average | Warning to manager |
| **Supplier Lock** | Prevent switching from preferred supplier without approval | Human-in-the-loop |
| **Budget Cap** | Weekly/monthly spend limits per category | Hard block when reached |
| **Margin Floor** | Supplier sets minimum margin per SKU or basket | Agent cannot go below |
| **Discount Ceiling** | Maximum discount the agent can authorize | Escalation above limit |
| **Credit Exposure** | Maximum outstanding receivables per buyer | Block new orders when exceeded |

---

## 5. User Persona Integration

The platform serves **four distinct user groups**, each with purpose-built interfaces and capabilities.

### 5.1 Restaurant-Side Personas

```
┌─────────────────────────────────────────────────────────────────────┐
│                    RESTAURANT ORGANIZATION                           │
│                                                                     │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────┐ ┌─────────────┐  │
│  │ Owner / GM  │ │ Ops Manager  │ │ Head Chef  │ │ Storekeeper │  │
│  │             │ │              │ │            │ │             │  │
│  │ • Dashboard │ │ • Approve    │ │ • Kitchen  │ │ • GRN       │  │
│  │   overview  │ │   smart      │ │   Copilot  │ │   receiving │  │
│  │ • Budget    │ │   carts      │ │ • Prep     │ │ • Quality   │  │
│  │   controls  │ │ • Supplier   │ │   plans    │ │   check     │  │
│  │ • P&L       │ │   perfor-    │ │ • Recipe   │ │ • Inventory │  │
│  │   reports   │ │   mance      │ │   costing  │ │   counts    │  │
│  │ • Set       │ │ • Override   │ │ • Waste    │ │ • Photo     │  │
│  │   guardrails│ │   AI recs    │ │   tracking │ │   capture   │  │
│  └─────────────┘ └──────────────┘ └────────────┘ └─────────────┘  │
│                                                                     │
│  ┌──────────────────┐                                               │
│  │ Finance / AP     │                                               │
│  │                  │                                               │
│  │ • Invoice review │                                               │
│  │ • 3-way match    │                                               │
│  │   exceptions     │                                               │
│  │ • Payment        │                                               │
│  │   scheduling     │                                               │
│  │ • Spend analytics│                                               │
│  └──────────────────┘                                               │
└─────────────────────────────────────────────────────────────────────┘
```

#### Key Interactions by Persona

| Persona | Primary Workflow | AI Touchpoint |
|---|---|---|
| **Owner / GM** | Set budgets and guardrails, review P&L impact | Dashboard shows AI savings vs manual |
| **Ops Manager** | Approve/reject AI-suggested carts, manage suppliers | Reviews AI reasoning before approval |
| **Head Chef** | Receive daily prep plans, manage recipes | Kitchen Copilot generates prep from POS data |
| **Storekeeper** | Receive deliveries, complete GRN, count inventory | Mobile GRN app triggers 3-way match automatically |
| **Finance / AP** | Review invoice match exceptions, schedule payments | AI handles clean matches; humans handle exceptions |

### 5.2 Supplier-Side Personas

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SUPPLIER ORGANIZATION                             │
│                                                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────┐ ┌────────────┐  │
│  │ Owner / GM   │ │ Sales Rep    │ │ Dispatcher │ │ Finance    │  │
│  │              │ │              │ │            │ │            │  │
│  │ • Set AI     │ │ • Monitor AI │ │ • Delivery │ │ • Invoice  │  │
│  │   guardrails │ │   agent      │ │   tracking │ │   upload   │  │
│  │ • Margin     │ │   performance│ │ • Route    │ │ • Payment  │  │
│  │   policies   │ │ • Handle     │ │   planning │ │   tracking │  │
│  │ • Flash Deal │ │   escalations│ │ • GRN      │ │ • Credit   │  │
│  │   budgets    │ │ • Market     │ │   sign-off │ │   memo     │  │
│  │ • Revenue    │ │   intelligence│ │            │ │   handling │  │
│  │   dashboards │ │              │ │            │ │            │  │
│  └──────────────┘ └──────────────┘ └────────────┘ └────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

> **Critical Insight:** This is a **supplier-first** platform. The Sales Rep's role transforms from "person who calls restaurants and takes orders" into **"manager of an AI agent that sells for them."** Every platform capability is designed to amplify the supplier Sales Rep, not replace them.

#### 5.2.1 Sales Rep ↔ System Integration (Deep Dive)

Because we are a supplier-first platform, the Sales Rep persona is the most deeply integrated user in the system. They touch every major subsystem — from guardrails configuration to agent supervision to receivables collection. This section details exactly how.

```
┌──────────────────────────────────────────────────────────────────────┐
│               SALES REP — SYSTEM TOUCHPOINTS                          │
│                                                                       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │ CONFIGURE   │  │ SUPERVISE    │  │ ACT ON       │                │
│  │             │  │              │  │              │                │
│  │ Guardrails  │  │ AI Agent     │  │ Intelligence │                │
│  │ Dashboard   │  │ Activity     │  │ & Insights   │                │
│  │             │  │ Feed         │  │              │                │
│  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘                │
│         │                │                 │                         │
│         ▼                ▼                 ▼                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │ MANAGE      │  │ HANDLE       │  │ TRACK        │                │
│  │             │  │              │  │              │                │
│  │ Flash Deals │  │ Escalations  │  │ Collections  │                │
│  │ & Promos    │  │ & Overrides  │  │ & Payments   │                │
│  │             │  │              │  │              │                │
│  └─────────────┘  └──────────────┘  └──────────────┘                │
└──────────────────────────────────────────────────────────────────────┘
```

**A. Guardrails Configuration — The Sales Rep as "AI Trainer"**

The Sales Rep doesn't just "use" the AI — they **train** it by setting the commercial rules it operates within:

| Guardrail | What the Sales Rep Configures | System Effect |
|---|---|---|
| **Floor Price per SKU** | Minimum acceptable price per product | Agent cannot offer below this in negotiations |
| **Volume Discount Tiers** | Break-points (e.g., 5+ cases = -5%) | Agent auto-applies correct tier during negotiation |
| **Basket Margin Floor** | Minimum acceptable margin for entire cart | Agent uses cross-sell to protect overall margin |
| **Credit Limit per Buyer** | Maximum outstanding receivables per restaurant | Agent blocks new orders if limit exceeded |
| **Discount Budget** | Weekly/monthly discount allocation | Agent tracks spend against budget in real-time |
| **Account Priority** | Flag VIP accounts, set custom rules | Agent applies preferential pricing / priority fulfillment |

> The Sales Rep sets these once and refines over time. The AI operates within these boundaries 24/7 — effectively giving the Sales Rep "24/7 coverage" of all accounts.

**B. AI Agent Supervision — Real-Time Activity Feed**

The Sales Rep's primary daily interface is the **Agent Activity Feed** — a live view of everything the AI is doing on their behalf:

```
┌──────────────────────────────────────────────────────────────────┐
│              SALES REP — AGENT ACTIVITY FEED                      │
│                                                                   │
│  09:14  ✅ Auto-closed: Al Baik Kitchen — AED 4,200              │
│         Basket: Chicken 50kg, Oil 20L, Spices assorted           │
│         Margin: 21% (above 15% floor) — No discount applied     │
│                                                                   │
│  09:22  🔄 Negotiation in progress: Zafran Restaurant            │
│         Buyer requested 10% off on Lamb Rack                     │
│         Agent counter-offered: 6% off + free delivery            │
│         Awaiting buyer response...                                │
│                                                                   │
│  09:31  ⚠️  ESCALATION: Marina Grill — Price below floor        │
│         Buyer insists on AED 38/kg for Tenderloin                │
│         Floor price: AED 42/kg | Buyer is VIP (18 months)       │
│         [APPROVE EXCEPTION]  [COUNTER-OFFER]  [DECLINE]          │
│                                                                   │
│  09:45  📦 Flash Deal sent: Salmon 200kg (3-day expiry)          │
│         Targeted: 12 restaurants with salmon menu items           │
│         Accepted so far: 4 restaurants, 85kg claimed             │
│                                                                   │
│  10:02  💰 Payment reminder sent: Golden Spoon — AED 12,400     │
│         Invoice #INV-2849, due 3 days ago                        │
│         Auto-scheduled follow-up in 48h if unpaid                │
└──────────────────────────────────────────────────────────────────┘
```

**C. Flash Deal Management**

The Sales Rep manages distressed inventory liquidation through Flash Deals — an AI-powered system that matches near-expiry stock with restaurants whose menus use those items:

| Step | Sales Rep Action | System Action |
|---|---|---|
| **Flag inventory** | Marks items as distressed (or system auto-detects via shelf-life rules) | Calculates optimal discount based on remaining shelf life & margin floor |
| **Set deal parameters** | Approves discount depth, quantity caps, and target radius | AI identifies matching restaurants via POS menu data |
| **Monitor uptake** | Watches real-time acceptance dashboard | AI sends targeted notifications, tracks remaining stock |
| **Close deal** | One-tap close or auto-close when stock depleted | Generates POs, schedules delivery, creates e-invoices |

**D. Smart Collections — AI-Powered Receivables**

The Sales Rep tracks payment health across their portfolio. The AI handles routine collection activities while the Sales Rep handles relationship-sensitive cases:

```
┌──────────────────────────────────────────────────────────────────┐
│              SMART COLLECTIONS — SALES REP VIEW                   │
│                                                                   │
│  PORTFOLIO HEALTH                                                │
│  ──────────────                                                  │
│  Total Outstanding:  AED 284,000                                 │
│  Current (< 30d):    AED 198,000  ████████████████░░  70%        │
│  Overdue (30-60d):   AED  62,000  ████████░░░░░░░░░░  22%        │
│  At Risk (> 60d):    AED  24,000  ███░░░░░░░░░░░░░░░   8%        │
│                                                                   │
│  AI ACTIONS (last 7 days):                                       │
│  • 14 payment reminders sent automatically                       │
│  • 3 partial payment confirmations received                      │
│  • AED 47,000 collected via automated follow-ups                 │
│                                                                   │
│  REQUIRES YOUR ATTENTION:                                        │
│  ⚠️  Golden Spoon — AED 24,000 overdue 65 days                  │
│      AI recommends: Offer 2% early-payment discount              │
│      [CALL BUYER]  [SEND AI OFFER]  [ESCALATE TO FINANCE]       │
└──────────────────────────────────────────────────────────────────┘
```

**E. Buyer Intelligence Dashboard**

The Sales Rep gains deep visibility into every account's behavior, powered by POS and ordering data:

| Intelligence | Source | Sales Rep Benefit |
|---|---|---|
| **Purchase Frequency** | Order history | Detect declining accounts before they churn |
| **Menu Composition** | POS menu data feed | Identify upsell opportunities by product category |
| **Price Sensitivity** | Negotiation history | Know exactly how far to discount per account |
| **Seasonal Patterns** | Historical order data | Pre-position inventory for demand spikes |
| **Competitor Risk** | Order gaps + declining volumes | Trigger retention offers proactively |
| **Basket Expansion** | Cross-reference menu vs orders | Suggest products the buyer needs but orders elsewhere |

**F. Escalation Handling — When the Human Steps In**

The AI escalates to the Sales Rep in precisely defined scenarios:

```
┌──────────────────────────────────────────────────────────────────┐
│              ESCALATION MATRIX                                    │
│                                                                   │
│  Trigger                      │ Agent Action        │ Rep Action │
│  ─────────────────────────────┼─────────────────────┼────────────│
│  Price below floor            │ Pause negotiation   │ Approve /  │
│                               │ Present context     │ Counter /  │
│                               │                     │ Decline    │
│                               │                     │            │
│  Credit limit exceeded        │ Block new order     │ Review     │
│                               │ Notify rep          │ account    │
│                               │                     │ health     │
│                               │                     │            │
│  Discount budget exhausted    │ Switch to list      │ Replenish  │
│                               │ price only          │ budget or  │
│                               │                     │ approve    │
│                               │                     │ one-off    │
│                               │                     │            │
│  New VIP account request      │ Flag for review     │ Configure  │
│                               │                     │ custom     │
│                               │                     │ guardrails │
│                               │                     │            │
│  Buyer complaint / dispute    │ Pause + preserve    │ Personal   │
│                               │ context             │ outreach   │
└──────────────────────────────────────────────────────────────────┘
```

**G. A Day in the Life — Sales Rep on the Platform**

| Time | Activity | System Involvement |
|---|---|---|
| **8:00 AM** | Review overnight activity feed | AI processed 12 orders, closed 9, escalated 3 |
| **8:30 AM** | Handle escalations | Review 3 requests, approve 2 exceptions, counter 1 |
| **9:00 AM** | Check Flash Deal performance | Yesterday's salmon deal cleared 180/200kg |
| **9:30 AM** | Review buyer intelligence alerts | 2 accounts showing declining order frequency |
| **10:00 AM** | Adjust guardrails for Q2 pricing | Update volume tiers for 8 high-demand SKUs |
| **11:00 AM** | Strategic outreach to at-risk accounts | AI pre-prepared context: order history, margin, preferences |
| **2:00 PM** | Review collections dashboard | AI collected AED 47k this week; 1 account needs personal follow-up |
| **3:00 PM** | Set up new Flash Deal | 150kg of shrimp nearing shelf-life threshold |
| **4:00 PM** | Review daily performance summary | AI closed AED 85k in orders today, 21% avg margin, 2 new accounts activated |

> **Key Metric:** A Sales Rep who manually managed 30-50 accounts can now effectively manage **200+ accounts** — the AI handles routine interactions while the rep focuses on relationship-building, escalations, and strategic decisions.

#### 5.2.2 Supplier Owner / GM

| Responsibility | System Feature | How It Works |
|---|---|---|
| Set financial guardrails | Guardrails Dashboard | Define floor prices, margin floors, discount budgets for all reps |
| Approve Flash Deal budgets | Flash Deal Management | Set max discount depth and weekly deal budget per category |
| Revenue oversight | Revenue Analytics Dashboard | Real-time revenue, margin, and AI agent ROI tracking |
| Sales team performance | Team Performance View | Compare AI-assisted vs manual rep performance |

#### 5.2.3 Dispatcher

| Responsibility | System Feature | How It Works |
|---|---|---|
| Delivery tracking | Dispatch Module | View confirmed POs, plan routes, update delivery status |
| Route optimization | AI-suggested routes | System suggests optimal delivery sequences |
| GRN coordination | Mobile GRN App | Mark deliveries as completed, capture buyer signatures |

#### 5.2.4 Supplier Finance

| Responsibility | System Feature | How It Works |
|---|---|---|
| Invoice management | Auto E-Invoicing | AI generates compliant invoices on order close |
| Payment tracking | Collections Dashboard | Real-time aging report, AI-managed reminders |
| Credit memo handling | 3-Way Match Engine | Auto-generates credit notes on GRN discrepancies |
| Compliance reporting | FTA Submission Logs | Audit trail of all e-invoice submissions |

### 5.3 Platform / Internal Personas

| Persona | Responsibilities |
|---|---|
| **Admin & Support** | Tenant onboarding, SKU review/merge, system monitoring, dispute arbitration |

### 5.4 RBAC Model

```
                    Platform Admin
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
      Restaurant     Supplier      Support
       Tenant        Tenant        Staff
         │              │
    ┌────┴────┐    ┌────┴────┐
    ▼         ▼    ▼         ▼
  Owner    Staff  Owner    Staff
  (Admin)  (User) (Admin)  (User)
    │                │
    ├─ Ops Manager   ├─ Sales Rep
    ├─ Head Chef     ├─ Dispatcher
    ├─ Storekeeper   └─ Finance
    └─ Finance/AP
```

Each role maps to specific API permissions and UI views, enforced at the API Gateway layer via JWT claims.

---

## 6. Autonomous Sales Agent

### 6.1 The Innovation: "Permission, Not Process"

Traditional B2B sales follows a slow loop: Inquiry → Quote → Negotiate → Approve → Close. Our Autonomous Sales Agent collapses this into **instant-close authority** — the AI has pre-approved financial guardrails and can negotiate and close deals without human intervention.

```
┌─────────────────────────────────────────────────────────────────────┐
│                  TRADITIONAL SALES                                   │
│                                                                     │
│  Buyer → Message → Sales Rep reads → Sales Rep thinks →            │
│  Sales Rep replies → Buyer thinks → Counter-offer →                │
│  Sales Rep checks with manager → Reply ...                          │
│                                                                     │
│  Average Response Time: 2-4 HOURS                                   │
│  Average Deal Cycle: 1-3 DAYS                                       │
└─────────────────────────────────────────────────────────────────────┘

                            vs.

┌─────────────────────────────────────────────────────────────────────┐
│                  AUTONOMOUS SALES AGENT                              │
│                                                                     │
│  Buyer adds to cart → Agent checks guardrails → Agent offers        │
│  optimized price → Buyer accepts → Order created → Invoice sent    │
│                                                                     │
│  Average Response Time: < 3 SECONDS                                 │
│  Average Deal Cycle: INSTANT CLOSE                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Pricing Authority Stack

The supplier pre-configures a **guardrails hierarchy** that gives the AI financial decision-making authority:

```
┌──────────────────────────────────────────────────────────────┐
│                   PRICING AUTHORITY STACK                      │
│                                                               │
│  Level 4: CATALOG PRICE (public list price)                   │
│    │  ▲ Agent starts here                                     │
│    ▼                                                          │
│  Level 3: VOLUME DISCOUNT (bulk tiers)                        │
│    │  5+ cases: -5%  │  20+ cases: -8%  │  50+ cases: -12%   │
│    ▼                                                          │
│  Level 2: BASKET OPTIMIZER (total cart margin)                 │
│    │  Cross-sell upsell: give discount on X if buying Y       │
│    ▼                                                          │
│  Level 1: FLOOR PRICE (absolute minimum)                      │
│    │  Agent CANNOT go below this                              │
│    ▼                                                          │
│  Level 0: ESCALATE TO HUMAN                                   │
│    │  Buyer demands price below floor → human sales rep       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 6.3 Capability Modules

#### Module 1: Basket-Aware Negotiator

Unlike simple per-item discounting, this module optimizes **total cart margin**. It can give a deeper discount on one item if the overall basket still meets the supplier's target margin.

**Example:**
> Buyer adds "Chicken Breast 20kg" to cart.  
> Agent analyzes the cart: total margin is 22%.  
> Agent offers: *"Add 5 cases of cooking oil and I'll knock 8% off the chicken — your total saves AED 180."*  
> Basket margin stays at 19% (above supplier's 15% floor).  
> **Result:** Larger order, protected margin, happy buyer.

#### Module 2: Distressed Inventory Liquidator

When supplier inventory is approaching expiry, shelf-life thresholds, or overstock, the AI sends **targeted Flash Deals** to restaurants whose menus use those exact items.

```
┌─────────────────────────────────────────────────────────────┐
│              DISTRESSED INVENTORY FLOW                        │
│                                                              │
│  Supplier has:                                               │
│  200kg Salmon, Best Before: 3 days                           │
│                                                              │
│  Agent identifies:                                           │
│  15 restaurants with salmon on their menu (via POS data)     │
│                                                              │
│  Agent sends Flash Deal:                                     │
│  "Fresh Salmon — 25% off, same-day delivery, 200kg avail"   │
│                                                              │
│  Restaurant sees deal in-app:                                │
│  ✓ Matches their menu items                                  │
│  ✓ Significant discount                                      │
│  ✓ One-tap accept                                            │
│                                                              │
│  Result:                                                     │
│  • Supplier avoids AED 8,000 write-off                       │
│  • Restaurant gets 25% savings                               │
│  • Zero food waste                                           │
└─────────────────────────────────────────────────────────────┘
```

#### Module 3: Smart-Draft (Retention Engine)

The AI learns purchasing patterns and proactively creates draft orders before the restaurant even realizes they need to reorder. If a regular item is missing from a buyer's usual order, the agent auto-suggests it.

**How it works:**
1. Analyze 90 days of order history for each buyer
2. Detect weekly/bi-weekly patterns (e.g., "Always orders chicken on Monday")
3. On expected order day, pre-draft a cart based on historical patterns
4. Send notification: *"Your usual Tuesday order is ready — Chicken 20kg, Lettuce 5kg, Tomatoes 8kg. One tap to confirm."*
5. If an item is missing: *"Noticed you didn't add Cooking Oil this week — you usually order 5L every 2 weeks. Need it?"*

### 6.4 Agent Cognitive Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    AGENT COGNITIVE ARCHITECTURE                    │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              PERCEPTION LAYER                               │  │
│  │                                                             │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │  │
│  │  │ LLM         │  │ Vector DB    │  │ Context          │  │  │
│  │  │ (GPT-4)     │  │ (Weaviate)   │  │ Retrieval        │  │  │
│  │  │             │  │              │  │                  │  │  │
│  │  │ Understands │  │ Matches SKUs │  │ Buyer history,   │  │  │
│  │  │ intent and  │  │ and finds    │  │ menu data,       │  │  │
│  │  │ context     │  │ similar      │  │ seasonal trends  │  │  │
│  │  │             │  │ products     │  │                  │  │  │
│  │  └─────────────┘  └──────────────┘  └──────────────────┘  │  │
│  └────────────────────────────┬─────────────────────────────┘  │
│                               │                                  │
│                               ▼                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              DECISION ENGINE (LangGraph)                    │  │
│  │                                                             │  │
│  │  State Graph:                                               │  │
│  │  analyze_request → check_guardrails → calculate_offer →   │  │
│  │  present_deal → [accept/reject/counter] → finalize        │  │
│  │                                                             │  │
│  │  Guardrails checked at EVERY decision point:                │  │
│  │  • Margin ≥ floor?  • Credit OK?  • Within authority?      │  │
│  └────────────────────────────┬─────────────────────────────┘  │
│                               │                                  │
│                               ▼                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              ACTION LAYER (Tools)                           │  │
│  │                                                             │  │
│  │  • create_order()      • send_whatsapp_message()           │  │
│  │  • generate_invoice()  • update_inventory()                │  │
│  │  • apply_discount()    • escalate_to_human()               │  │
│  │  • create_flash_deal() • schedule_followup()               │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### 6.5 Performance Dashboard

The AI agent's performance is tracked against human benchmarks:

| Metric | Human Baseline | AI Target |
|---|---|---|
| Response Time | 2-4 hours | < 3 seconds |
| Win Rate (quotes → orders) | 30-40% | 60%+ |
| Revenue from Liquidation | Near zero | 15%+ of distressed inventory recovered |
| Upsell Conversion | 5-10% | 20%+ |
| Order Accuracy | 92% | 99%+ |
| Operating Hours | 8h/day, 5d/week | 24/7/365 |

---

## 7. Core Data Flows

### 7.1 Flow Summary

The platform handles **five major data flows**, each implemented as a LangGraph state machine:

| # | Flow | Trigger | Output |
|---|---|---|---|
| 1 | Catalog Upload → SKU Normalization | Supplier uploads CSV | Normalized, matched SKU database |
| 2 | POS Sale → Inventory → AI Reorder | Foodics webhook (order.created) | AI-suggested smart cart → PO |
| 3 | GRN → Invoice Match → Payment | Storekeeper submits GRN | 3-way match result, payment schedule |
| 4 | Kitchen Copilot — Daily Prep Plan | Daily cron (5:00 AM) | PDF prep plan with FIFO batch tracking |
| 5 | Flash Deal — Distressed Inventory | Supplier flags nearing-expiry stock | Targeted deals to matching restaurants |

### 7.2 SKU Normalization Engine

This is a critical differentiator. Suppliers describe the same product differently — "Chicken Breast Boneless Fresh 10x1kg", "Boneless Chicken B/less 10kg", "Fresh Poultry Breast No Bone 10×1Kg". The normalization engine creates a **universal product language** using vector embeddings:

```
Supplier A: "Chicken Breast Boneless 10x1kg"  ──┐
Supplier B: "B/less Chicken Breast 10 Kilo"   ──┤──► NORM-SKU-001
Supplier C: "Fresh Poultry Breast No Bone"    ──┘    "Chicken Breast Boneless"
                                                       Category: Poultry
                                                       Pack: 10 × 1kg
                                                       Price/kg: comparable
```

**Process:**
1. **Parse** — Clean CSV rows, extract fields
2. **Embed** — Generate vector embedding for product name + pack description
3. **Match** — Cosine similarity search in Weaviate (threshold: 0.85)
   - **>0.90:** Auto-match
   - **0.85–0.90:** Suggest for admin review
   - **<0.85:** Create new normalized SKU
4. **Extract Attributes** — LLM extracts category, grade, origin, organic status
5. **Parse Pack** — Regex + LLM to decompose "10x1kg" → {count: 10, size: 1, unit: kg}
6. **Calculate Price/kg** — Normalize all prices to per-kg basis for comparison

### 7.3 POS → AI Cart → Purchase Order

```
POS Sale ──► Webhook ──► Deplete Inventory ──► Check Par Level
                                                     │
                                               Below Par?
                                                     │
                                              ┌──────┴──────┐
                                              │             │
                                             YES           NO
                                              │             │
                                              ▼          (done)
                                     Trigger AI Reorder
                                              │
                                    ┌─────────┼──────────┐
                                    ▼         ▼          ▼
                              Procurement  Sourcing   Cart Draft
                              Agent        Agent      Agent
                              (calc qty)   (compare)  (build cart)
                                    │         │          │
                                    └─────────┼──────────┘
                                              │
                                              ▼
                                      HUMAN APPROVAL
                                      (INTERRUPT node)
                                              │
                                              ▼
                                    Create PO + Notify
                                       Supplier
```

### 7.4 3-Way Match (PO ↔ GRN ↔ Invoice)

The compliance engine performs automated invoice reconciliation:

| Check | Compare | Tolerance | Action |
|---|---|---|---|
| **2-Way Match** | PO qty × price vs Invoice total | Exact match | Auto-approve |
| **3-Way Match** | PO vs GRN vs Invoice quantities | ±2% or ±0.5kg | Auto-approve within tolerance |
| **Exception** | GRN qty ≠ Invoice qty | Above tolerance | Flag for finance review |
| **Price Mismatch** | PO price ≠ Invoice price | > 1% deviation | Flag + suggest adjustment |

---

## 8. UAE E-Invoicing Compliance

### 8.1 Regulatory Context

The UAE's Federal Tax Authority (FTA) is mandating electronic invoicing via a **Decentralized Continuous Transaction Control & Exchange (DCTCE)** model using a **5-Corner architecture**. All B2B transactions must use structured, machine-readable invoices exchanged through Accredited Service Providers (ASPs).

### 8.2 The 5-Corner Model

```
┌─────────────────────────────────────────────────────────────────────┐
│                      FTA 5-CORNER MODEL                              │
│                                                                     │
│  Corner 1            Corner 3             Corner 2                  │
│  ┌──────────┐       ┌──────────┐         ┌──────────┐              │
│  │ SUPPLIER │──────►│ SUPPLIER │────────►│ BUYER    │              │
│  │          │       │ ASP      │         │ ASP      │              │
│  │ (Seller) │       │          │         │          │──────┐       │
│  └──────────┘       └────┬─────┘         └─────┬────┘      │       │
│                          │                     │           │       │
│                          │   Corner 5          │           ▼       │
│                          │  ┌──────────┐       │     ┌──────────┐  │
│                          └─►│   FTA    │◄──────┘     │  BUYER   │  │
│                             │ (Tax     │             │(Restaurant│  │
│                             │Authority)│             │          │  │
│                             └──────────┘             └──────────┘  │
│                                                                     │
│  Corner 4 = Supplier       Corner 5 = FTA                           │
│  Corner 3 = Supplier ASP   Corner 2 = Buyer ASP                    │
│  Corner 1 = Seller         (ASP = Accredited Service Provider)      │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.3 Mandatory Invoice Fields (6 Blocks)

The FTA requires ~50 fields organized into 6 blocks for every compliant e-invoice:

| Block | Name | Key Fields |
|---|---|---|
| **Block 1** | Invoice Identity & Control | Invoice number, issue date, type code (380/381/386), currency (AED), reference to original invoice (for credit/debit notes) |
| **Block 2** | Seller Details | Legal name, TRN (VAT registration number), address, city, emirate, country code (AE) |
| **Block 3** | Buyer Details | Legal name, TRN, delivery address, contact |
| **Block 4** | Invoice Totals | Line extension amount, allowances, charges, tax-exclusive total, VAT total, payable amount |
| **Block 5** | Tax Breakdown | Per-rate VAT breakdown (5% standard, 0% zero-rated), taxable amount, tax amount |
| **Block 6** | Invoice Line Items | Per-line: description, quantity, unit price, net amount, VAT rate, VAT amount, item classification (UNSPSC) |

### 8.4 Platform Implementation

```
┌──────────────────────────────────────────────────────────────────┐
│                 E-INVOICING IN THE PLATFORM                       │
│                                                                   │
│  Order Closed (PO confirmed)                                      │
│       │                                                           │
│       ▼                                                           │
│  Compliance Agent generates structured invoice data               │
│       │                                                           │
│       ├──► Store in PostgreSQL (invoices table)                   │
│       │     • All 6 blocks as structured JSONB                    │
│       │     • Linked to PO, GRN                                   │
│       │                                                           │
│       ├──► Generate PINT AE format (XML/JSON)                    │
│       │     • PINT = PEPPOL International                         │
│       │     • AE = UAE country extension                          │
│       │                                                           │
│       ├──► Submit to ASP (API integration)                       │
│       │     • ASP validates format                                │
│       │     • ASP routes to buyer's ASP                           │
│       │     • ASP reports to FTA (Corner 5)                       │
│       │                                                           │
│       └──► Audit Trail                                            │
│             • Hash of invoice content                             │
│             • Submission timestamp                                │
│             • ASP acknowledgment reference                        │
│             • FTA clearance status                                │
└──────────────────────────────────────────────────────────────────┘
```

### 8.5 Compliance Automation Benefits

| Manual Process | Platform Automation |
|---|---|
| Accountant manually creates invoices in accounting software | AI auto-generates compliant invoices on order close |
| Manually exports and uploads to FTA portal | API integration with ASP for real-time submission |
| Risk of missing fields or format errors | Schema validation ensures 100% field compliance |
| No link between PO, delivery, and invoice | 3-way match automatically links PO ↔ GRN ↔ Invoice |
| Credit notes created manually | Auto-generated when 3-way match detects discrepancy |

---

## 9. Strategic Value Propositions

### 9.1 For the Procurement Manager (Restaurant Side)

The platform transforms procurement from a reactive, manual task into a proactive, data-driven function:

| Pain Point | Platform Solution | Impact |
|---|---|---|
| **Hours on phone/WhatsApp** placing orders | AI suggests smart carts; one-tap approve | **Save 15+ hours/week** |
| **No price benchmarking** across suppliers | Real-time price comparison per normalized SKU | **8-12% cost reduction** |
| **Over-ordering** leads to waste | POS-based demand forecasting drives precise quantities | **Reduce waste 20-30%** |
| **Invoice disputes** take days | Automated 3-way match catches discrepancies instantly | **95% faster resolution** |
| **Supplier reliability unknown** | Historical delivery data + quality scores per supplier | **Informed switching decisions** |
| **Stockouts** cause menu blackouts | Par-level monitoring + lead-time-aware reordering | **Near-zero stockouts** |

### 9.2 For the Sales Manager (Supplier Side)

The platform's autonomous sales agent is a force multiplier for supplier sales teams:

| Pain Point | Platform Solution | Impact |
|---|---|---|
| **Sales reps maxed out** at 30-50 accounts | AI agent handles unlimited accounts 24/7 | **10x account coverage** |
| **Slow response** loses deals to competitors | < 3-second response with instant-close authority | **2x win rate** |
| **Price war** erodes margins | Basket-aware negotiation optimizes total margin | **Margin protected** |
| **Food waste** from expiring inventory | Targeted Flash Deals to restaurants who need those items | **Recover 15%+ of at-risk inventory** |
| **Collections** are awkward and slow | Smart Collections: AI sends payment reminders, tracks aging | **Reduce DSO by 30%** |
| **No visibility** into buyer needs | POS data reveals real-time consumption patterns | **Predictive selling** |

### 9.3 Waste Management as a System-Level Feature

Food waste isn't a standalone feature — it's an **emergent property** of the system working correctly:

```
┌──────────────────────────────────────────────────────────────────┐
│              WASTE REDUCTION SYSTEM EFFECTS                       │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │ 1. ACCURATE FORECASTING                                  │     │
│  │    POS data → AI forecast → Order only what you'll sell  │     │
│  │    Impact: Prevent over-ordering at the source           │     │
│  └─────────────────────────────────────────────────────────┘     │
│                           │                                       │
│                           ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │ 2. OPTIMIZED ORDERING                                    │     │
│  │    Run-rate calc + lead-time buffer → precise quantities │     │
│  │    Impact: Right amount at right time                    │     │
│  └─────────────────────────────────────────────────────────┘     │
│                           │                                       │
│                           ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │ 3. FIFO ENFORCEMENT                                      │     │
│  │    Kitchen Copilot assigns oldest batches first          │     │
│  │    Impact: Reduce expiry-driven waste                    │     │
│  └─────────────────────────────────────────────────────────┘     │
│                           │                                       │
│                           ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │ 4. DISTRESSED INVENTORY LIQUIDATION                      │     │
│  │    Supplier's near-expiry stock → Flash Deals to buyers  │     │
│  │    Impact: Recover revenue, eliminate waste on both ends  │     │
│  └─────────────────────────────────────────────────────────┘     │
│                                                                   │
│  Combined effect: 20-30% reduction in food waste across the      │
│  entire supply chain — supplier warehouse to restaurant kitchen  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Appendix A: Data Model Summary

### Core Entities

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│   Supplier     │     │ Supplier       │     │ Normalized SKU │
│                │────►│ Catalog Item   │────►│                │
│ name           │     │                │     │ canonical_name │
│ trn            │     │ raw_name       │     │ category       │
│ payment_terms  │     │ raw_pack       │     │ grade          │
│ rating         │     │ price          │     │ origin         │
│ address        │     │ embedding      │     │ pack_count     │
└────────────────┘     └────────────────┘     │ pack_unit      │
                                               │ embedding      │
                                               └────────────────┘

┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│ Purchase Order │     │   GRN          │     │   Invoice      │
│                │────►│                │────►│                │
│ po_number      │     │ grn_number     │     │ invoice_number │
│ supplier_id    │     │ po_id          │     │ po_id          │
│ status         │     │ received_by    │     │ grn_id         │
│ line_items[]   │     │ qty_received   │     │ match_status   │
│ total_amount   │     │ quality_status │     │ total_amount   │
│ approved_by    │     │ photos[]       │     │ fta_status     │
│ created_by     │     │ signatures     │     │ pint_ae_xml    │
└────────────────┘     └────────────────┘     └────────────────┘

┌────────────────┐     ┌────────────────┐
│  Inventory     │     │  Audit Log     │
│                │     │                │
│ normalized_sku │     │ action         │
│ branch_id      │     │ entity_type    │
│ qty_on_hand    │     │ entity_id      │
│ par_level      │     │ performed_by   │
│ reorder_point  │     │ ai_reasoning   │
│ unit           │     │ guardrails_    │
│ batch_id       │     │   checked      │
│ expiry_date    │     │ timestamp      │
└────────────────┘     └────────────────┘
```

### Key State Transitions

**Purchase Order:**
`DRAFT → PENDING_APPROVAL → CONFIRMED → SHIPPED → DELIVERED → COMPLETED`

**Invoice Match:**
`PENDING → 2WAY_MATCHED → 3WAY_MATCHED → EXCEPTION → APPROVED → PAID`

---

## Appendix B: Key Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Commerce engine | MedusaJS 2.0 | Open-source, modular, B2B-ready, event-driven |
| AI orchestration | LangGraph | Stateful workflows, human-in-the-loop, persistence |
| Vector database | Weaviate | OSS, GraphQL API, hybrid search capabilities |
| SKU matching strategy | Embedding similarity | Handles messy supplier data without rigid schemas |
| POS integration | Webhook-based | Real-time, event-driven, decoupled |
| E-invoice format | PINT AE (PEPPOL) | UAE FTA mandated standard |
| Agent authority model | Permission-based guardrails | Enables instant-close while maintaining control |
| Invoice reconciliation | 3-way match | Industry standard: PO ↔ GRN ↔ Invoice |
| Deployment | Containerized (ECS/EKS) | Scalable, reproducible, CI/CD friendly |

---

*This document synthesizes specifications from: architecture-and-flows.md, autonomous_sales_agent.md, medusajs-architecture.md, agentic-architecture.md, data-model.md, detailed-flows.md, and UAE E-Invoicing requirements.*
