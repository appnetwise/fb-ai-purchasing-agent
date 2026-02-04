# F&B AI Purchasing Agent (Procurement Manager)

Prototype for normalizing fragmented supplier catalogs, converting units/pack sizes, and enabling apples-to-apples price comparisons.

## What this MVP does
- Parses pack sizes like `10 x 1kg`, `5lb`, `12/500g`, etc.
- Normalizes units (kg, g, lb, oz) into a common base (kg).
- Normalizes SKU names to improve matching across suppliers.
- Groups similar items using fuzzy matching.
- Produces comparable $/kg pricing so chefs can compare fairly.

## Architecture & Design
- [Agentic architecture](docs/agentic-architecture.md): Multi-agent design with reasoning, function calling, and ReAct loops.
- [Architecture & flows](docs/architecture-and-flows.md): System diagrams, data flows, approval workflows.
- [Data model](docs/data-model.md): ER diagram, Pydantic schemas, state transitions.
- [MedusaJS architecture](docs/medusajs-architecture.md): Full MedusaJS 2.0 + LangGraph architecture with POS integrations, Vector DB, OCR, and deployment roadmap.
- [Detailed flows](docs/detailed-flows.md): Step-by-step flows for catalog upload, POS→AI cart, GRN→invoice match, and prep plan generation.

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
