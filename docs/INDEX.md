# F&B AI Platform — Documentation Index

> **B2B F&B Commerce Network** | Web-Only Architecture | Last updated: February 2026

---

## 🎯 Quick Navigation

### 🚀 Start Here (Executives & PMs)
1. **[Consolidated System Design](CONSOLIDATED-SYSTEM-DESIGN.md)** ⭐ **START HERE** — Sole source of truth for platform architecture
2. **[User Journeys](user-journeys.md)** — Restaurant, Supplier, and Sales Rep journey maps (before/after)
3. **[System Specification](system-specification.md)** — Platform strategy, tech stack, personas, product modules

### 🏗️ Architecture (Engineers)
1. **[Architecture & Flows](architecture-and-flows.md)** — System architecture diagram, multi-agent workflow, ReAct pattern, core data flows
2. **[Agent Reference](agent-reference.md)** — Complete catalog of 9 AI agents with tool calls, guardrails, state machines
3. **[Complete Architecture Diagrams](complete-architecture-visual.md)** — Comprehensive visual overview of entire system
4. **[MedusaJS Architecture](medusajs-architecture.md)** — Backend framework & custom modules
5. **[Agentic Architecture](agentic-architecture.md)** — Multi-agent design patterns
6. **[Data Model](data-model.md)** — Database schema, Pydantic models, state machines
7. **[Deployment & Infrastructure](deployment-infrastructure.md)** — Cloud setup, security, DR

### 🔄 Implementation (Developers)
1. **[Detailed Flows](detailed-flows.md)** — Step-by-step: SKU normalization, smart cart, negotiation, invoice matching, flash deals, collections, attribution
2. **[Implementation Guide](IMPLEMENTATION-GUIDE.md)** — 7-step procurement journey, implementation roadmap

---

## 📊 Architecture Overview

### Frontend Layer (Web & Mobile)
- **Restaurant Web Dashboard** (Next.js + Shadcn/UI) — Smart Cart, Price Comparison, Invoice Matching, Kitchen Copilot
- **Supplier Web Portal** (Next.js + Shadcn/UI) — Sales Command Center, Agent Control, Catalog Management, Flash Deals
- **Sales Rep Territory Portal** (Next.js) — Territory Map, Attribution, Commission Tracker, Agent Takeover
- **Storekeeper Mobile App** (React Native + Expo) — GRN Scanner, Prep List, Stock Count

### Communication Channels
| Channel | Technology | Purpose |
|:---|:---|:---|
| Real-time Dashboard | WebSocket (Socket.io) | Live quotes, order status, negotiation badges |
| Mobile Push | Firebase Cloud Messaging | GRN alerts, flash deals, order confirmations |
| Email | Transactional (Resend) | Invoice delivery, payment reminders, reports |

> ⚠️ **No WhatsApp, Telegram, or SMS integration.** All user interactions are web-based or push notifications.

### AI Agent Mesh (LangGraph)

| Agent | Role | Model | Output Channel |
|:---|:---|:---|:---|
| **Planner** | Orchestrates multi-step tasks | GPT-4o | Internal (routes to sub-agents) |
| **Purchasing** | Generates AI Smart Carts | GPT-4o-mini | Dashboard notification badge |
| **Sales** | Autonomous negotiation & deals | GPT-4o | Dashboard + push notification |
| **Compliance** | 3-way invoice matching | GPT-4o-mini | Dashboard alert (green/red) |
| **Catalog** | SKU normalization & matching | GPT-4o-mini + ada-002 | Supplier Portal upload results |
| **Inventory** | Stock monitoring & reorder triggers | GPT-4o-mini | Internal (feeds Purchasing Agent) |
| **Kitchen Copilot** | Prep list generation | GPT-4o-mini | Mobile App checklist |
| **Collections** | Payment follow-up escalation | GPT-4o-mini | Dashboard + email |
| **Sourcing** | Supplier comparison & ranking | GPT-4o-mini | Internal (feeds Purchasing Agent) |

### Core Commerce (MedusaJS 2.0)
- Product & Pricing modules
- Order & Fulfillment workflows
- Cart with AI-suggested items
- Customer groups & spending limits
- GRN (Goods Received Notes)
- Invoice matching (3-way)

### Data Layer
- **PostgreSQL (Supabase)** — All relational data with Row-Level Security
- **Weaviate** — SKU embeddings (1536-dim) for semantic product matching
- **Redis (Upstash)** — Event bus, caching, rate limiting

### External Integrations
- **POS:** Foodics API (OAuth 2.0, webhooks)
- **E-Invoicing:** UAE FTA Phase 2 (UBL 2.1 XML + PDF)
- **Push:** Firebase Cloud Messaging
- **OCR:** AWS Textract (invoice & document parsing)
- **Payments:** Telr (gateway, refunds, settlement)

---

## 🔄 Core Workflows

### Workflow 1: Restaurant Low Stock → AI Cart → Approval → PO

```
Low Stock Triggered (POS Webhook / Cron)
    ↓
Inventory Agent: Fetch current levels, par, lead times
    ↓
Catalog Agent: Normalize SKU names, search equivalents
    ↓
Sourcing Agent: Compare suppliers, rank by price + quality
    ↓
Purchasing Agent: Draft cart with quantities & reasoning
    ↓
Pydantic Validation: Ensure data integrity
    ↓
Dashboard Notification: "Cart Ready" badge
    ↓
Manager Approval: Reviews on Web Dashboard (can edit/reject)
    ↓
PO Created: Sent to Supplier Portal
    ↓
GRN Scheduled: Mobile App reminder set for delivery
```

> 📖 See: **[Detailed Flows — Smart Cart Generation](detailed-flows.md#2-smart-cart-generation-flow)**

### Workflow 2: Supplier Autonomous Sales Agent

```
Trigger Event:
  - Quote request from restaurant dashboard
  - Predictive order signal (POS depletion)
  - Flash deal opportunity (distressed inventory)
    ↓
Agent Perception: Intent classification, menu parsing
    ↓
Decision Engine: Price authority check, margin calculation
    ↓
Offer Generation:
  - Quote: <3 second response, within guardrails
  - Flash deal: Menu-matched, scarcity-driven
    ↓
Dashboard Notification: Offer pushed to Restaurant Dashboard
    ↓
Auto-Confirm PO: Reserve stock, generate E-Invoice
    ↓
Attribution: Revenue credited to territory owner (Sales Rep)
    ↓
Upsell Check: Bundle recommendations (protect margin)
```

> 📖 See: **[Detailed Flows — Quote & Negotiation](detailed-flows.md#3-quote--negotiation-flow)**

### Workflow 3: Invoice Reconciliation (3-Way Match)

```
Invoice Uploaded (PDF via Dashboard) + GRN Submitted (Mobile App)
    ↓
Compliance Agent: Compare PO vs GRN vs Invoice line items
    ↓
Match Result:
  ├─ ✅ All match → Auto-approve payment
  └─ ⚠️ Variance → Exception alert on Dashboard
    ↓
Resolution: Manager reviews in Sideover (approve/dispute)
    ↓
Audit Log: All steps recorded, immutable
```

> 📖 See: **[Detailed Flows — 3-Way Invoice Matching](detailed-flows.md#4-3-way-invoice-matching-flow)**

---

## 📚 Document Map

```
docs/
├── CONSOLIDATED-SYSTEM-DESIGN.md   ⭐ SOURCE OF TRUTH
│   └── Executive summary, user journeys, architecture, agent specs
├── user-journeys.md                👤 USER JOURNEYS
│   └── Restaurant, Supplier, Sales Rep journeys (before/after)
├── architecture-and-flows.md       🏗️ ARCHITECTURE
│   └── System diagram, multi-agent workflow, data flows
├── system-specification.md         📋 SPECIFICATION
│   └── Strategy, tech stack, personas, modules, security
├── agent-reference.md              🤖 AGENT REFERENCE
│   └── All 9 agents with tools, triggers, guardrails
├── detailed-flows.md               📝 IMPLEMENTATION FLOWS
│   └── Step-by-step: SKU normalization, cart, negotiation, matching
├── IMPLEMENTATION-GUIDE.md         🚀 ROADMAP
│   └── 7-step procurement journey, implementation phases
├── complete-architecture-visual.md 📊 VISUAL OVERVIEW
│   └── System layers, agents, integrations
├── medusajs-architecture.md        🏗️ BACKEND
│   └── MedusaJS 2.0, custom modules
├── agentic-architecture.md         🤖 AI PATTERNS
│   └── Multi-agent design, ReAct patterns
├── data-model.md                   💾 DATA MODEL
│   └── ER diagram, Pydantic schemas
└── deployment-infrastructure.md    ☁️ DEVOPS
    └── Cloud setup, security, DR
```

---

**Last Updated**: February 2026
**Platform Version**: 2.0 (Web-Only)
**Status**: Production-Ready Architecture
