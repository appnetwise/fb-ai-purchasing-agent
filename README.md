# F&B AI Purchasing Agent (Procurement Manager)

Prototype for normalizing fragmented supplier catalogs, converting units/pack sizes, and enabling apples-to-apples price comparisons.

## What this MVP does
- Parses pack sizes like `10 x 1kg`, `5lb`, `12/500g`, etc.
- Normalizes units (kg, g, lb, oz) into a common base (kg).
- Normalizes SKU names to improve matching across suppliers.
- Groups similar items using fuzzy matching.
- Produces comparable $/kg pricing so chefs can compare fairly.

## Architecture & Design

> 🎯 **[📖 Complete Documentation Index](docs/INDEX.md)** — Quick navigation to all diagrams, flows, and specifications

### � Implementation-Ready Guides

- **[Implementation Guide](docs/IMPLEMENTATION-GUIDE.md)** ⭐ **[NEW: SYSTEM OF RESULTS]**
  - **7-Step Procurement Journey:** Intelligent Intake → SKU Normalization → Multi-Supplier Sourcing → Autonomous Negotiation → HITL Approval → GRN Tallying → 3-Way Invoice Match
  - **Technical Stack:** MedusaJS 2.0, LangGraph, Weaviate/Chroma, Foodics POS, WhatsApp API, AWS Textract
  - **UAE Compliance:** Poppel E-Invoicing, Ne'ma food waste reporting
  - **Business Impact:** 40% faster decisions, 1-4% food cost reduction, 80% time savings
  - **Agent Patterns:** ReAct loops, Human-in-the-Loop, autonomous negotiation guardrails

### 📊 Visual Architecture (START HERE!)
- **[Complete Architecture Diagrams](docs/complete-architecture-visual.md)** ⭐ **[FLAGSHIP]**
  - System-wide layered architecture (8 layers)
  - Restaurant AI agent mesh (Procurement, Inventory, Kitchen Copilot)
  - Supplier Autonomous Sales Agent (Instant-Close, Upsell, Flash Deals)
  - External API integrations (POS, Payment Gateway, Poppel E-Invoicing, WhatsApp)
  - Event-driven real-time flows
  - Dashboard & observability

- **[Deployment & Infrastructure](docs/deployment-infrastructure.md)** ⭐ **[NEW]**
  - Cloud infrastructure (AWS + GCP)
  - Containerized services & Kubernetes orchestration
  - Database clustering & backup strategy
  - Security & compliance (UAE E-Invoicing, GDPR, PCI-DSS)
  - Disaster recovery & high availability
  - Monitoring with Datadog

### 📚 Detailed Technical Docs
- [Agentic architecture](docs/agentic-architecture.md): Multi-agent design with reasoning, function calling, and ReAct loops.
- [Architecture & flows](docs/architecture-and-flows.md): System diagrams, data flows, approval workflows.
- [Data model](docs/data-model.md): ER diagram, Pydantic schemas, state transitions.
- [MedusaJS architecture](docs/medusajs-architecture.md): Full MedusaJS 2.0 + LangGraph architecture with POS integrations, Vector DB, OCR.
- [Autonomous Sales Agent](docs/autonomous_sales_agent.md): Supplier-side AI agent capabilities (instant quotes, basket-aware negotiation, liquidation).
- [Detailed flows](docs/detailed-flows.md): Step-by-step flows for catalog upload, POS→AI cart, GRN→invoice match.
- [System Design Deep-Dive](docs/system-design-deep-dive.md): Journey mapping, technical logic, matching algorithms, channel strategy.
- [System Specification](docs/system-specification.md): Executive summary, platform strategy, value propositions.

## Quick start
1. Install deps
   - `pip install -r requirements.txt`
2. Run
   - `python -m src.app`

## Agentic scaffold (ReAct + tools)
Run the scaffolded multi-agent runner:
- `python -m src.agentic.runner`

Environment variables live in [.env.example](.env.example).

## Data
Edit [data/suppliers.csv](data/suppliers.csv) to add suppliers, prices, and pack info.

## Next steps
- Add currency conversion.
- Enrich name normalization with ingredient taxonomy.
- Add a web UI and API for live use.
