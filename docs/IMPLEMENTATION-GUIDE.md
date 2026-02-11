# AI-Agentic Procurement System - Implementation Guide
## From "System of Record" to "System of Results"

> **Vision:** Transform reactive procurement into autonomous, intelligent orchestration with AI agents handling sourcing, negotiation, and reconciliation while humans provide strategic oversight.

---

## Table of Contents

1. [7-Step Procurement Journey (Operational Flow)](#1-seven-step-procurement-journey)
2. [Technical Architecture (Implementation-Ready)](#2-technical-architecture)
3. [Agent Design Patterns](#3-agent-design-patterns)
4. [UAE-Specific Compliance](#4-uae-specific-compliance)
5. [Integration Specifications](#5-integration-specifications)
6. [Business Impact Metrics](#6-business-impact-metrics)
7. [Implementation Roadmap](#7-implementation-roadmap)

---

## 1. Seven-Step Procurement Journey

### Overview: From Stock Monitoring to Invoice Match

```
┌─────────────────────────────────────────────────────────────────────┐
│  AUTONOMOUS PROCUREMENT CYCLE (AI-Driven with HITL)                 │
└─────────────────────────────────────────────────────────────────────┘

Step 1: Intelligent Intake & Forecast (Proactive)
   ↓
Step 2: SKU Normalization & Mapping (Data Quality)
   ↓
Step 3: Multi-Supplier Sourcing & Selection (Optimization)
   ↓
Step 4: Autonomous Negotiation [Optional] (Cost Reduction)
   ↓
Step 5: Human-in-the-Loop Approval (Strategic Oversight)
   ↓
Step 6: Receiving & GRN Tallying (Operational Control)
   ↓
Step 7: 3-Way Invoice Match (Financial Integrity)
```

---

### Step 1: Intelligent Intake & Forecast 📊

**Goal:** Move from reactive "we're out of stock!" to proactive "predicted reorder 3 days ahead"

**Process Flow:**

```python
# Forecasting Agent Workflow

1. Data Collection (Real-Time)
   ├─ POS Integration: Foodics API → fetch_sales_data(last_30_days)
   ├─ Inventory Levels: Oracle Simphony → get_current_stock()
   ├─ Historical Patterns: Query PostgreSQL → analyze_trends(sku, 90_days)
   └─ External Factors: Weather API, Local Events Calendar

2. AI Analysis (Forecasting Agent)
   ├─ Time Series Model: Prophet forecasts next 7-14 day demand
   ├─ Event Adjustments: +15% for upcoming weekend concert
   ├─ Seasonality: +20% seafood demand (fishing season)
   └─ Safety Stock: Calculate buffer based on lead time variance

3. Cart Generation (Procurement Agent)
   ├─ For each item below reorder point:
   │   ├─ Calculate order quantity: (Forecast - Current Stock) + Safety Stock
   │   ├─ Consider MOQ (Minimum Order Quantity) constraints
   │   └─ Validate against budget limits
   │
   └─ Output: "Suggested Cart" with 23 items, $2,340 total

4. Notification
   └─ Push to restaurant manager: "Smart Cart ready for review"
```

**Technical Implementation:**

```python
# src/agentic/agents/forecasting_agent.py

from langgraph.graph import StateGraph
from langchain_openai import ChatOpenAI
from prophet import Prophet
import pandas as pd

class ForecastingAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o", temperature=0)
        self.tools = [
            self.fetch_pos_sales,
            self.get_inventory_levels,
            self.analyze_seasonal_trends,
            self.check_local_events
        ]
    
    async def generate_forecast(self, restaurant_id: str) -> ForecastResult:
        """
        Step 1: Intelligent Intake & Forecast
        Returns predicted demand and suggested reorder quantities
        """
        # 1. Fetch sales data from POS
        sales_data = await self.fetch_pos_sales(
            restaurant_id=restaurant_id,
            days=90
        )
        
        # 2. Get current inventory levels
        inventory = await self.get_inventory_levels(restaurant_id)
        
        # 3. Run Prophet forecasting model
        forecast = self.run_prophet_forecast(sales_data)
        
        # 4. Adjust for external factors
        adjusted_forecast = await self.adjust_for_events(forecast)
        
        # 5. Calculate reorder quantities
        suggested_cart = self.calculate_reorder_quantities(
            forecast=adjusted_forecast,
            current_inventory=inventory,
            lead_times=self.get_supplier_lead_times()
        )
        
        return ForecastResult(
            forecast_period="7_days",
            suggested_items=suggested_cart,
            confidence_score=0.87,
            explanation="Based on 90-day history + upcoming holiday"
        )
    
    def run_prophet_forecast(self, sales_data: pd.DataFrame) -> pd.DataFrame:
        """Prophet time series forecasting"""
        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False
        )
        
        # Add regressors
        model.add_regressor('is_weekend')
        model.add_regressor('is_holiday')
        model.add_regressor('temperature')
        
        model.fit(sales_data)
        
        # Forecast next 14 days
        future = model.make_future_dataframe(periods=14)
        forecast = model.predict(future)
        
        return forecast
```

**Key Metrics:**
- **Forecast Accuracy:** Target 85%+ (measured as actual vs predicted)
- **Stockout Reduction:** From 2-3/month → <1/month
- **Lead Time:** 3-day advance notice (vs same-day reactive ordering)

---

### Step 2: SKU Normalization & Mapping 🏷️

**Goal:** Enable apples-to-apples comparison across fragmented supplier catalogs

**The Problem:**
```
Supplier A: "Chicken Breast Boneless 5kg Box Fresh"
Supplier B: "Fresh Boneless Chicken Breasts - 10lb Tray"
Supplier C: "Chicken Breast (5x1kg) Frozen"

→ Same category, but impossible to compare prices without normalization!
```

**Solution: Multi-Stage Normalization Pipeline**

```
┌─────────────────────────────────────────────────────────────────────┐
│  SKU NORMALIZATION ENGINE                                           │
└─────────────────────────────────────────────────────────────────────┘

INPUT: "Chicken Breast Boneless 5x2kg Frozen"

        ↓
┌───────────────────────────────────────────────────────────────────┐
│  STAGE 1: Text Preprocessing (Data Engine Agent)                 │
├───────────────────────────────────────────────────────────────────┤
│  • Lowercase: "chicken breast boneless 5x2kg frozen"              │
│  • Remove special chars: chicken breast boneless 5x2kg frozen     │
│  • Expand abbreviations: "kg" → "kilogram"                        │
│  • Tokenization: ["chicken", "breast", "boneless", "5x2kg"...]    │
└───────────────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────────────┐
│  STAGE 2: Entity Extraction (NER - Named Entity Recognition)     │
├───────────────────────────────────────────────────────────────────┤
│  Using LLM with structured output:                                │
│                                                                   │
│  {                                                                │
│    "product_type": "Chicken Breast",                             │
│    "attributes": ["Boneless", "Frozen"],                         │
│    "pack_format": "5x2kg",                                       │
│    "pack_count": 5,                                              │
│    "pack_size": "2kg"                                            │
│  }                                                                │
└───────────────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────────────┐
│  STAGE 3: Unit Normalization & Parsing                           │
├───────────────────────────────────────────────────────────────────┤
│  Pack Format Parser:                                              │
│  • "5x2kg" → 5 units × 2kg each = 10kg total                     │
│  • "10lb Tray" → 1 unit × 10lb = 4.54kg total                    │
│  • "12/500g" → 12 units × 500g each = 6kg total                  │
│                                                                   │
│  Convert to Base Unit (kg):                                       │
│  • 10kg → 10.000 kg (already in kg)                              │
│  • 10lb → 4.536 kg (1lb = 0.4536kg)                              │
│  • 5000g → 5.000 kg (1000g = 1kg)                                │
└───────────────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────────────┐
│  STAGE 4: Semantic Embedding (Vector Search)                     │
├───────────────────────────────────────────────────────────────────┤
│  Generate embedding using OpenAI text-embedding-3-large:          │
│                                                                   │
│  text = "chicken breast boneless frozen poultry meat"            │
│  embedding = openai.embed(text) → [0.23, -0.45, 0.12, ...]       │
│                                                                   │
│  Store in Weaviate:                                               │
│  - Collection: "normalized_skus"                                  │
│  - Vector: 1536-dimensional embedding                             │
│  - Metadata: {product, attributes, supplier, price}               │
└───────────────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────────────┐
│  STAGE 5: Master SKU Matching (Fuzzy Logic)                      │
├───────────────────────────────────────────────────────────────────┤
│  Query Weaviate for similar SKUs:                                 │
│  - Cosine similarity > 0.90 → Same product!                      │
│  - If match found: Link to existing master_sku_id                │
│  - If no match: Create new master SKU                            │
│                                                                   │
│  Master SKU Created:                                              │
│  {                                                                │
│    "master_sku_id": "SKU_CHICKEN_BREAST_BONELESS",               │
│    "normalized_name": "Chicken Breast Boneless",                 │
│    "category": "Poultry",                                        │
│    "attributes": ["Boneless", "Frozen"],                         │
│    "base_unit": "kg"                                             │
│  }                                                                │
└───────────────────────────────────────────────────────────────────┘
        ↓
OUTPUT: Normalized SKU ready for price comparison across suppliers

{
  "master_sku_id": "SKU_CHICKEN_BREAST_BONELESS",
  "supplier_sku_id": "SUP_A_CB_001",
  "supplier_name": "Premium Poultry Co.",
  "total_weight_kg": 10.0,
  "pack_format": "5x2kg",
  "price_total": 82.00,
  "price_per_kg": 8.20,  ← COMPARABLE!
  "attributes": ["Boneless", "Frozen"],
  "lead_time_days": 1,
  "moq": 10  // Minimum Order Quantity in kg
}
```

**Technical Implementation:**

```python
# src/normalization.py (ENHANCED VERSION)

from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Weaviate
from pydantic import BaseModel
import re

class PackInfo(BaseModel):
    """Parsed pack size information"""
    pack_count: int
    pack_size_value: float
    pack_size_unit: str
    total_weight_kg: float

class NormalizedSKU(BaseModel):
    """Normalized SKU output"""
    master_sku_id: str
    normalized_name: str
    category: str
    attributes: list[str]
    total_weight_kg: float
    pack_format: str
    price_per_kg: float
    supplier_id: str
    confidence_score: float

class SKUNormalizationAgent:
    def __init__(self, weaviate_client, llm):
        self.weaviate = weaviate_client
        self.llm = llm
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
    
    def normalize(self, raw_sku: str, supplier_id: str, price: float) -> NormalizedSKU:
        """
        Step 2: SKU Normalization & Mapping
        Main entry point for normalization pipeline
        """
        # Stage 1: Preprocessing
        cleaned_text = self._preprocess(raw_sku)
        
        # Stage 2: Entity extraction using LLM
        entities = self._extract_entities_with_llm(cleaned_text)
        
        # Stage 3: Parse pack size and unit conversion
        pack_info = self._parse_pack_size(entities['pack_format'])
        
        # Stage 4: Generate semantic embedding
        embedding_text = self._create_embedding_text(entities)
        embedding = self.embeddings.embed_query(embedding_text)
        
        # Stage 5: Find or create master SKU
        master_sku = self._find_or_create_master_sku(
            entities=entities,
            embedding=embedding,
            similarity_threshold=0.90
        )
        
        # Calculate price per kg
        price_per_kg = price / pack_info.total_weight_kg
        
        return NormalizedSKU(
            master_sku_id=master_sku.id,
            normalized_name=entities['product_name'],
            category=entities['category'],
            attributes=entities['attributes'],
            total_weight_kg=pack_info.total_weight_kg,
            pack_format=entities['pack_format'],
            price_per_kg=price_per_kg,
            supplier_id=supplier_id,
            confidence_score=0.92
        )
    
    def _preprocess(self, text: str) -> str:
        """Stage 1: Text preprocessing"""
        text = text.lower()
        text = re.sub(r'[^\w\s/x-]', ' ', text)  # Remove special chars except /x-
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    def _extract_entities_with_llm(self, text: str) -> dict:
        """Stage 2: Extract structured entities using LLM"""
        prompt = f"""
        Extract product information from: "{text}"
        
        Return JSON with:
        - product_name: Main product (e.g., "Chicken Breast")
        - category: Food category (Poultry, Produce, Dairy, etc.)
        - attributes: List of attributes (e.g., ["Boneless", "Frozen"])
        - pack_format: Pack size string (e.g., "5x2kg", "10lb", "12/500g")
        """
        
        response = self.llm.with_structured_output(
            schema={
                "product_name": str,
                "category": str,
                "attributes": list[str],
                "pack_format": str
            }
        ).invoke(prompt)
        
        return response
    
    def _parse_pack_size(self, pack_format: str) -> PackInfo:
        """Stage 3: Parse pack format and convert to kg"""
        # Pattern 1: "5x2kg" or "5 x 2kg"
        pattern1 = r'(\d+)\s*[xX×]\s*(\d+\.?\d*)\s*(kg|g|lb|oz)'
        # Pattern 2: "10kg" or "5lb"
        pattern2 = r'(\d+\.?\d*)\s*(kg|g|lb|oz)'
        # Pattern 3: "12/500g" (case notation)
        pattern3 = r'(\d+)/(\d+\.?\d*)\s*(kg|g|lb|oz)'
        
        match = re.search(pattern1, pack_format)
        if match:
            pack_count = int(match.group(1))
            pack_size = float(match.group(2))
            unit = match.group(3)
        else:
            match = re.search(pattern3, pack_format)
            if match:
                pack_count = int(match.group(1))
                pack_size = float(match.group(2))
                unit = match.group(3)
            else:
                match = re.search(pattern2, pack_format)
                if match:
                    pack_count = 1
                    pack_size = float(match.group(1))
                    unit = match.group(2)
                else:
                    raise ValueError(f"Cannot parse pack format: {pack_format}")
        
        # Convert to kg
        total_kg = pack_count * pack_size * self._unit_to_kg(unit)
        
        return PackInfo(
            pack_count=pack_count,
            pack_size_value=pack_size,
            pack_size_unit=unit,
            total_weight_kg=total_kg
        )
    
    def _unit_to_kg(self, unit: str) -> float:
        """Convert unit to kg multiplier"""
        conversions = {
            'kg': 1.0,
            'g': 0.001,
            'lb': 0.453592,
            'oz': 0.0283495
        }
        return conversions.get(unit.lower(), 1.0)
    
    def _find_or_create_master_sku(
        self, 
        entities: dict, 
        embedding: list[float],
        similarity_threshold: float = 0.90
    ) -> MasterSKU:
        """Stage 5: Find existing or create new master SKU"""
        # Query Weaviate for similar SKUs
        results = self.weaviate.similarity_search_by_vector(
            embedding=embedding,
            k=5
        )
        
        # Check if any result exceeds similarity threshold
        for result in results:
            if result.similarity > similarity_threshold:
                # Match found! Return existing master SKU
                return result.master_sku
        
        # No match - create new master SKU
        master_sku_id = self._generate_master_sku_id(entities['product_name'])
        
        new_master = MasterSKU(
            id=master_sku_id,
            name=entities['product_name'],
            category=entities['category'],
            embedding=embedding
        )
        
        # Store in Weaviate
        self.weaviate.add_documents([new_master])
        
        return new_master
```

**Key Benefits:**
- **Price Comparison:** Enables instant comparison across suppliers ($/kg basis)
- **Discovery:** Restaurants find products even with different naming conventions
- **Data Quality:** Builds master product catalog over time
- **Scalability:** New supplier catalogs auto-normalized

---

### Step 3: Multi-Supplier Sourcing & Selection 🔍

**Goal:** Automatically query multiple suppliers and select optimal source for each item

**Sourcing Algorithm:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  SOURCING AGENT DECISION LOGIC                                      │
└─────────────────────────────────────────────────────────────────────┘

For each item in Suggested Cart:

1. Query all suppliers for normalized SKU
   ├─ Supplier A: $8.20/kg, Lead time: 1 day, In stock ✅
   ├─ Supplier B: $7.95/kg, Lead time: 3 days, In stock ✅
   ├─ Supplier C: $8.50/kg, Lead time: 1 day, Out of stock ❌
   └─ Supplier D: $7.80/kg, Lead time: 5 days, In stock ✅

2. Apply Decision Criteria (Weighted Scoring):
   
   Score = (Price_Weight × Price_Score) +
           (Reliability_Weight × Reliability_Score) +
           (Lead_Time_Weight × Lead_Time_Score) +
           (Quality_Weight × Quality_Score)
   
   Default Weights:
   - Price: 40%
   - Reliability: 30% (historical on-time delivery, quality)
   - Lead Time: 20%
   - Quality Rating: 10%

3. Calculate Scores:
   
   Supplier A:
   - Price: (8.20-7.80)/(8.50-7.80) = 0.43 → Score: 57/100
   - Reliability: 95% on-time → Score: 95/100
   - Lead Time: 1 day (best) → Score: 100/100
   - Quality: 4.5/5 stars → Score: 90/100
   - TOTAL: 0.4×57 + 0.3×95 + 0.2×100 + 0.1×90 = 80.3
   
   Supplier B:
   - Price: Best ($7.95) → Score: 79/100
   - Reliability: 88% on-time → Score: 88/100
   - Lead Time: 3 days → Score: 60/100
   - Quality: 4.2/5 stars → Score: 84/100
   - TOTAL: 0.4×79 + 0.3×88 + 0.2×60 + 0.1×84 = 76.6
   
   Supplier D:
   - Price: Best ($7.80) → Score: 100/100
   - Reliability: 75% on-time → Score: 75/100
   - Lead Time: 5 days (worst) → Score: 20/100
   - Quality: 4.0/5 stars → Score: 80/100
   - TOTAL: 0.4×100 + 0.3×75 + 0.2×20 + 0.1×80 = 74.5

4. Decision: Select Supplier A (highest total score)
   
   Explanation: "Supplier A selected despite 5% higher price due to:
   - Excellent reliability (95% on-time delivery)
   - Fastest lead time (1 day vs 3-5 days)
   - High quality rating (4.5/5 stars)
   - Cost difference: Only $4 more for 10kg order"

5. Handle Edge Cases:
   ├─ If MOQ not met: Suggest bundling with other items or skip
   ├─ If out of stock: Move to next best supplier
   └─ If urgent need: Prioritize lead time over price
```

**Technical Implementation:**

```python
# src/agentic/agents/sourcing_agent.py

from typing import List
from pydantic import BaseModel

class SupplierQuote(BaseModel):
    supplier_id: str
    supplier_name: str
    price_per_kg: float
    total_price: float
    lead_time_days: int
    in_stock: bool
    moq_kg: float
    reliability_score: float  # 0-1
    quality_rating: float  # 0-5

class SourcingDecision(BaseModel):
    selected_supplier_id: str
    selected_supplier_name: str
    price: float
    total_score: float
    explanation: str
    alternatives: List[SupplierQuote]

class SourcingAgent:
    def __init__(self, llm, db):
        self.llm = llm
        self.db = db
        
        # Decision weights (configurable per restaurant)
        self.weights = {
            'price': 0.40,
            'reliability': 0.30,
            'lead_time': 0.20,
            'quality': 0.10
        }
    
    async def source_item(
        self, 
        master_sku_id: str, 
        quantity_kg: float,
        urgency: str = "normal"  # "urgent", "normal", "flexible"
    ) -> SourcingDecision:
        """
        Step 3: Multi-Supplier Sourcing & Selection
        Query all suppliers and select optimal source
        """
        # 1. Query all suppliers for this SKU
        quotes = await self._query_all_suppliers(master_sku_id, quantity_kg)
        
        # 2. Filter by MOQ and stock availability
        viable_quotes = self._filter_viable_quotes(quotes, quantity_kg)
        
        if not viable_quotes:
            raise NoSuppliersAvailable(f"No suppliers can fulfill {quantity_kg}kg")
        
        # 3. Adjust weights based on urgency
        weights = self._adjust_weights_for_urgency(urgency)
        
        # 4. Score each supplier
        scored_quotes = []
        for quote in viable_quotes:
            score = self._calculate_supplier_score(quote, viable_quotes, weights)
            scored_quotes.append((quote, score))
        
        # 5. Sort by score (descending)
        scored_quotes.sort(key=lambda x: x[1], reverse=True)
        
        # 6. Select best supplier
        best_quote, best_score = scored_quotes[0]
        
        # 7. Generate explanation
        explanation = self._generate_explanation(
            selected=best_quote,
            alternatives=viable_quotes,
            weights=weights
        )
        
        return SourcingDecision(
            selected_supplier_id=best_quote.supplier_id,
            selected_supplier_name=best_quote.supplier_name,
            price=best_quote.total_price,
            total_score=best_score,
            explanation=explanation,
            alternatives=[q for q, _ in scored_quotes[1:4]]  # Top 3 alternatives
        )
    
    def _calculate_supplier_score(
        self, 
        quote: SupplierQuote, 
        all_quotes: List[SupplierQuote],
        weights: dict
    ) -> float:
        """Calculate weighted score for supplier"""
        # Normalize metrics to 0-100 scale
        prices = [q.price_per_kg for q in all_quotes]
        lead_times = [q.lead_time_days for q in all_quotes]
        
        # Price score (inverse - lower is better)
        price_score = self._inverse_normalize(quote.price_per_kg, prices)
        
        # Reliability score (0-1 → 0-100)
        reliability_score = quote.reliability_score * 100
        
        # Lead time score (inverse - lower is better)
        lead_time_score = self._inverse_normalize(quote.lead_time_days, lead_times)
        
        # Quality score (0-5 → 0-100)
        quality_score = (quote.quality_rating / 5.0) * 100
        
        # Weighted total
        total_score = (
            weights['price'] * price_score +
            weights['reliability'] * reliability_score +
            weights['lead_time'] * lead_time_score +
            weights['quality'] * quality_score
        )
        
        return total_score
    
    def _inverse_normalize(self, value: float, all_values: List[float]) -> float:
        """Normalize metric where lower is better (returns 0-100)"""
        min_val = min(all_values)
        max_val = max(all_values)
        if max_val == min_val:
            return 100
        # Invert: best (min) gets 100, worst (max) gets 0
        return 100 * (1 - (value - min_val) / (max_val - min_val))
    
    def _adjust_weights_for_urgency(self, urgency: str) -> dict:
        """Adjust decision weights based on urgency"""
        if urgency == "urgent":
            # Prioritize lead time heavily
            return {
                'price': 0.20,
                'reliability': 0.25,
                'lead_time': 0.45,  # Increased!
                'quality': 0.10
            }
        elif urgency == "flexible":
            # Prioritize price
            return {
                'price': 0.60,  # Increased!
                'reliability': 0.20,
                'lead_time': 0.10,
                'quality': 0.10
            }
        else:
            # Normal balanced approach
            return self.weights
    
    def _generate_explanation(
        self, 
        selected: SupplierQuote,
        alternatives: List[SupplierQuote],
        weights: dict
    ) -> str:
        """Generate human-readable explanation for selection"""
        # Find cheapest alternative for comparison
        cheapest = min(alternatives, key=lambda q: q.price_per_kg)
        
        if selected.supplier_id == cheapest.supplier_id:
            return f"{selected.supplier_name} selected - lowest price at ${selected.price_per_kg:.2f}/kg"
        
        price_diff = selected.price_per_kg - cheapest.price_per_kg
        price_diff_pct = (price_diff / cheapest.price_per_kg) * 100
        
        reasons = []
        
        if selected.reliability_score > cheapest.reliability_score + 0.10:
            rel_diff = (selected.reliability_score - cheapest.reliability_score) * 100
            reasons.append(f"Better reliability (+{rel_diff:.0f}%)")
        
        if selected.lead_time_days < cheapest.lead_time_days:
            days_faster = cheapest.lead_time_days - selected.lead_time_days
            reasons.append(f"Faster delivery ({days_faster} day{'s' if days_faster > 1 else ''} sooner)")
        
        if selected.quality_rating > cheapest.quality_rating + 0.3:
            reasons.append(f"Higher quality ({selected.quality_rating:.1f}/5 vs {cheapest.quality_rating:.1f}/5)")
        
        reason_text = ", ".join(reasons)
        
        return (
            f"{selected.supplier_name} selected despite {price_diff_pct:.1f}% higher price "
            f"(${selected.price_per_kg:.2f} vs ${cheapest.price_per_kg:.2f}/kg) due to: {reason_text}"
        )
```

**Key Decision Factors:**
| Factor | Weight | Impact |
|--------|--------|--------|
| **Price** | 40% | $/kg comparison (normalized SKU) |
| **Reliability** | 30% | Historical on-time delivery, quality consistency |
| **Lead Time** | 20% | Days to delivery (adjustable for urgency) |
| **Quality Rating** | 10% | Restaurant ratings + quality scores |

**Business Impact:**
- **Cost Optimization:** Balances price with reliability (reduces hidden costs)
- **Transparency:** Clear explanation for every sourcing decision
- **Learning:** System improves over time as it collects performance data

---

### Step 4: Autonomous Negotiation [Optional] 🤝

**Goal:** AI agent negotiates with suppliers for "tail-spend" or uncontracted items

**When to Trigger:**
- Item not on contracted price list
- Large order (>$500) with negotiation potential
- Supplier has indicated "flexible pricing" in settings

**Negotiation Workflow:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  AUTONOMOUS NEGOTIATION VIA WHATSAPP API                            │
└─────────────────────────────────────────────────────────────────────┘

Restaurant needs: 50kg Tomatoes (not on contract)

1. AI Agent → Supplier (WhatsApp Message):
   "Hi! We need 50kg Roma Tomatoes. Current market price we're 
    seeing is $2.40/kg. Can you match or beat this price?"

2. Supplier Response (within 5 min):
   "Best I can do is $2.50/kg for 50kg"

3. AI Agent Decision Logic:
   ├─ Check threshold: $2.50 vs target $2.40 = 4.1% over
   ├─ If <5% over target → AUTO-ACCEPT ✅
   ├─ If 5-10% over → COUNTER-OFFER
   └─ If >10% over → ESCALATE to human

4. AI Agent → Supplier:
   "Great! We accept $2.50/kg for 50kg = $125 total.
    Can you deliver tomorrow by 7 AM?"

5. Supplier → Confirms:
   "Confirmed! Delivery tomorrow 7 AM. PO?"

6. AI Agent:
   "PO #12347 sent to your portal. Thanks!"

┌─────────────────────────────────────────────────────────────────────┐
│  RESULT: $125 order negotiated and confirmed in <10 minutes         │
│  (vs 2-4 hours with manual back-and-forth)                          │
└─────────────────────────────────────────────────────────────────────┘
```

**Negotiation Guardrails:**

```python
# src/agentic/agents/negotiation_agent.py

class NegotiationGuardrails:
    """Safety constraints for autonomous negotiation"""
    
    MAX_DISCOUNT_REQUEST = 0.15  # Max 15% discount request
    AUTO_ACCEPT_THRESHOLD = 0.05  # Auto-accept if within 5% of target
    ESCALATION_THRESHOLD = 0.10   # Escalate to human if >10% over target
    MAX_NEGOTIATION_ROUNDS = 3    # Max 3 back-and-forth rounds
    
    APPROVED_PHRASES = [
        "Can you match this price?",
        "What's your best price for [quantity]?",
        "We're seeing $X/kg from other suppliers",
        "Can you deliver by [date]?"
    ]
    
    PROHIBITED_PHRASES = [
        # Never commit to exclusivity
        "we'll only buy from you",
        # Never share competitor details
        "Supplier X charges...",
        # Never make long-term commitments
        "annual contract"
    ]
```

**Business Impact:**
- **Tail-Spend Savings:** 12-15% savings on uncontracted items
- **Speed:** 10-minute negotiation vs 2-4 hour manual process
- **Consistency:** Always negotiates within approved parameters

---

### Step 5: Human-in-the-Loop (HITL) Approval 👤

**Goal:** Strategic oversight - AI proposes, humans decide

**Approval Workflow:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  APPROVAL INTERFACE (Mobile App / Web Dashboard)                    │
└─────────────────────────────────────────────────────────────────────┘

Notification: "Smart Cart ready for approval"

┌───────────────────────────────────────────────────────────────────┐
│  📋 PROPOSED ORDER #12348                                         │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  23 items • $2,340 total                                          │
│  Budget: ✅ Within weekly limit ($2,500)                          │
│  Delivery: Tomorrow 6-8 AM                                        │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Item: Tomatoes (Roma) - 50kg                                │ │
│  │  Supplier: Fresh Farms UAE                                   │ │
│  │  Price: $2.50/kg = $125                                      │ │
│  │  Reason: "10% cheaper than usual supplier + faster delivery" │ │
│  │  [Edit Qty] [Change Supplier] [✓ Approve]                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Item: Chicken Breast - 20kg                                 │ │
│  │  Supplier: Premium Poultry                                   │ │
│  │  Price: $8.20/kg = $164                                      │ │
│  │  Reason: "Same supplier as last 3 orders (reliable)"         │ │
│  │  [Edit Qty] [Change Supplier] [✓ Approve]                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ... (21 more items)                                              │
│                                                                   │
│  🤖 AI Confidence: 92%                                            │
│  ⚠️ Flags: None                                                   │
│                                                                   │
│  [✓ Approve All 23 Items] [📝 Review Each] [❌ Reject]           │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

Manager Actions:
├─ Swipe to approve all (15 seconds)
├─ Edit specific items (2 min)
└─ Add custom instructions (30 seconds)

Total Time: <3 minutes (vs 2 hours manual ordering)
```

**Approval Levels:**

```python
class ApprovalPolicy:
    """Defines when human approval is required"""
    
    def requires_approval(self, order: Order) -> ApprovalLevel:
        if order.total > 5000:
            return ApprovalLevel.SENIOR_MANAGER  # Large orders
        elif order.total > 2000:
            return ApprovalLevel.PROCUREMENT_MANAGER
        elif order.has_new_supplier:
            return ApprovalLevel.PROCUREMENT_MANAGER  # First-time supplier
        elif order.outside_normal_range:
            return ApprovalLevel.PROCUREMENT_MANAGER  # Unusual quantities
        elif order.total < 500:
            return ApprovalLevel.AUTO_APPROVE  # Small orders auto-approved
        else:
            return ApprovalLevel.PROCUREMENT_MANAGER  # Default
```

**Key Principles:**
- ✅ **AI proposes, human decides:** Never auto-execute large financial decisions
- ✅ **Transparency:** Always explain WHY each supplier was selected
- ✅ **Learning:** System learns from manager's corrections over time
- ✅ **Speed:** Reduce approval time from 2 hours → 3 minutes

---

### Step 6: Receiving & GRN Tallying 📦

**Goal:** Eliminate the 10% food cost leakage from receiving discrepancies

**Problem:** Traditional receiving process

```
❌ TRADITIONAL PROCESS (Manual):
1. Delivery arrives
2. Kitchen staff manually counts items
3. Signs delivery note without verification
4. Discovers shortages later (too late to claim)
5. Invoice arrives - no way to dispute

Result: ~10% leakage (short deliveries, wrong items, damaged goods)
```

**Solution:** Digital GRN with mobile app

```
┌─────────────────────────────────────────────────────────────────────┐
│  DIGITAL GRN WORKFLOW (Mobile App)                                  │
└─────────────────────────────────────────────────────────────────────┘

Supplier truck arrives with delivery:

STEP 1: Scan QR Code
├─ Delivery note has QR code
├─ Staff scans with mobile app
└─ System loads: PO #12348 (23 items expected)

STEP 2: Auto-Recognition (Computer Vision)
├─ Staff takes photo of delivered goods
├─ AI OCR extracts:
│   ├─ Item names from packaging
│   ├─ Quantities from labels
│   └─ Batch/expiry dates
└─ Pre-fills GRN form (95% accurate)

STEP 3: Manual Verification
├─ Staff reviews auto-filled GRN
├─ Corrects any mistakes
└─ Confirms quantities item-by-item:

    ┌───────────────────────────────────────────────────────────────┐
    │  PO Line 1: Tomatoes 50kg                                     │
    │  Expected: 50.0 kg                                            │
    │  Received: [48.5] kg  ← Staff enters actual weight            │
    │  Status: ⚠️ SHORT (1.5kg)                                     │
    │  Action: [Accept Partial] [Reject] [Call Supplier]           │
    │  Note: "2 tomatoes damaged, rest OK"                          │
    └───────────────────────────────────────────────────────────────┘

STEP 4: Auto-Calculate Adjustments
├─ System calculates:
│   ├─ Expected payment: 50kg × $2.50 = $125.00
│   ├─ Actual delivered: 48.5kg × $2.50 = $121.25
│   └─ Adjustment: -$3.75
│
└─ Flags discrepancy for invoice matching

STEP 5: Capture Evidence
├─ Take photos of damaged items
├─ Get driver signature on mobile device
└─ All evidence stored with GRN

STEP 6: Real-Time Inventory Update
└─ Inventory automatically updated:
    Tomatoes: 120kg → 168.5kg (+48.5kg received)

STEP 7: Supplier Notification
└─ Supplier portal updated:
    "GRN completed - 48.5kg received (1.5kg short)"
    Driver acknowledged discrepancy ✓
```

**Technical Implementation:**

```python
# src/agentic/agents/grn_agent.py

from typing import List
from pydantic import BaseModel
import cv2  # OpenCV for image processing

class GRNLine(BaseModel):
    po_line_id: str
    product_name: str
    expected_qty_kg: float
    received_qty_kg: float
    status: str  # "matched", "short", "over", "damaged"
    notes: str
    photo_urls: List[str]

class GRN(BaseModel):
    grn_id: str
    po_id: str
    supplier_id: str
    delivery_date: str
    lines: List[GRNLine]
    driver_signature: str
    receiver_signature: str
    total_discrepancies: int

class GRNAgent:
    def __init__(self, ocr_service, db):
        self.ocr = ocr_service  # AWS Textract or Google Document AI
        self.db = db
    
    async def create_grn_from_photo(
        self, 
        po_id: str,
        delivery_photo: bytes,
        supplier_invoice_pdf: bytes = None
    ) -> GRN:
        """
        Step 6: Receiving & GRN Tallying
        Process delivery photo and create GRN
        """
        # 1. Load expected PO data
        po = await self.db.get_purchase_order(po_id)
        
        # 2. OCR extract from delivery note/invoice
        if supplier_invoice_pdf:
            extracted_data = await self.ocr.extract_invoice_data(supplier_invoice_pdf)
        else:
            extracted_data = await self.ocr.extract_from_photo(delivery_photo)
        
        # 3. Match extracted lines to PO lines
        grn_lines = []
        for po_line in po.lines:
            # Try to find matching line in extracted data
            extracted_line = self._match_line(po_line, extracted_data)
            
            if extracted_line:
                # Compare quantities
                status = self._calculate_status(
                    expected=po_line.quantity_kg,
                    received=extracted_line.quantity_kg
                )
                
                grn_line = GRNLine(
                    po_line_id=po_line.id,
                    product_name=po_line.product_name,
                    expected_qty_kg=po_line.quantity_kg,
                    received_qty_kg=extracted_line.quantity_kg,
                    status=status,
                    notes="",
                    photo_urls=[]
                )
            else:
                # Item not found in delivery - flag as missing
                grn_line = GRNLine(
                    po_line_id=po_line.id,
                    product_name=po_line.product_name,
                    expected_qty_kg=po_line.quantity_kg,
                    received_qty_kg=0.0,
                    status="missing",
                    notes="Item not found in delivery",
                    photo_urls=[]
                )
            
            grn_lines.append(grn_line)
        
        # 4. Create GRN record
        grn = GRN(
            grn_id=self._generate_grn_id(),
            po_id=po_id,
            supplier_id=po.supplier_id,
            delivery_date=datetime.now().isoformat(),
            lines=grn_lines,
            driver_signature="",
            receiver_signature="",
            total_discrepancies=sum(1 for line in grn_lines if line.status != "matched")
        )
        
        # 5. Save to database
        await self.db.save_grn(grn)
        
        # 6. Update inventory in real-time
        await self._update_inventory(grn)
        
        # 7. Notify supplier of discrepancies
        if grn.total_discrepancies > 0:
            await self._notify_supplier_of_discrepancies(grn)
        
        return grn
    
    def _calculate_status(self, expected: float, received: float) -> str:
        """Determine GRN line status"""
        tolerance = 0.02  # 2% tolerance for weight variations
        
        if abs(received - expected) / expected <= tolerance:
            return "matched"
        elif received < expected:
            return "short"
        elif received > expected:
            return "over"
        else:
            return "matched"
    
    async def _update_inventory(self, grn: GRN):
        """Update inventory levels in real-time"""
        for line in grn.lines:
            await self.db.increment_inventory(
                product_id=line.po_line_id,
                quantity_kg=line.received_qty_kg,
                grn_reference=grn.grn_id
            )
```

**Key Benefits:**
- **Accuracy:** 95%+ with OCR + manual verification
- **Speed:** 2 minutes per delivery (vs 15 minutes manual)
- **Cost Recovery:** Identify and dispute shortages immediately
- **Evidence:** Photos + signatures for disputes
- **Real-Time:** Inventory updated instantly

**Impact on Food Cost Leakage:**
- **Before:** 10% leakage ($1,500/month for avg restaurant)
- **After:** <2% leakage ($300/month)
- **Savings:** $1,200/month = $14,400/year 🎉

---

### Step 7: 3-Way Invoice Match (PO ↔ GRN ↔ Invoice) ✅

**Goal:** Automate financial reconciliation and prevent overcharges

**The 3-Way Match:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  3-WAY MATCH RECONCILIATION ENGINE                                  │
└─────────────────────────────────────────────────────────────────────┘

Document 1: PURCHASE ORDER (What was ordered)
├─ PO #12348
├─ Line 1: Tomatoes 50kg @ $2.50/kg = $125.00
└─ Total: $125.00

Document 2: GOODS RECEIPT NOTE (What was received)
├─ GRN #5678
├─ Line 1: Tomatoes 48.5kg @ $2.50/kg = $121.25
└─ Total: $121.25 (adjusted for shortage)

Document 3: SUPPLIER INVOICE (What supplier is charging)
├─ Invoice #INV-2024-789
├─ Line 1: Tomatoes 50kg @ $2.50/kg = $125.00 ❌
└─ Total: $125.00

AI Reconciliation Agent Analysis:
┌───────────────────────────────────────────────────────────────────┐
│  🚨 DISCREPANCY DETECTED                                          │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Line Item: Tomatoes                                              │
│                                                                   │
│  PO Quantity:      50.0 kg                                        │
│  GRN Quantity:     48.5 kg  ← Actually received                   │
│  Invoice Quantity: 50.0 kg  ← Supplier charging for full amount  │
│                                                                   │
│  Overcharge: $3.75 (1.5kg × $2.50/kg)                            │
│                                                                   │
│  Recommendation: DISPUTE INVOICE                                  │
│  Evidence: GRN #5678 with driver signature acknowledging shortage│
│                                                                   │
│  [Auto-Dispute] [Accept Anyway] [Contact Supplier]               │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

Auto-Dispute Flow:
1. AI generates dispute message:
   "Invoice #INV-2024-789 overcharged by $3.75.
    GRN #5678 shows 48.5kg received (driver confirmed).
    Please issue credit note."

2. Sent to supplier via platform + email

3. Supplier options:
   ├─ Issue credit note (-$3.75)
   ├─ Dispute claim (escalate to manager)
   └─ Ignore (auto-escalates after 48 hours)

4. Resolution tracked in system
```

**Match Types:**

```python
class MatchType(Enum):
    """3-way match result types"""
    
    PERFECT_MATCH = "perfect_match"
    # PO = GRN = Invoice → Auto-approve payment
    
    ACCEPTABLE_VARIANCE = "acceptable_variance"
    # Within 2% tolerance → Auto-approve with note
    
    QUANTITY_MISMATCH = "quantity_mismatch"
    # GRN < PO but Invoice = PO → Dispute
    
    PRICE_MISMATCH = "price_mismatch"
    # Invoice price ≠ PO price → Dispute
    
    MISSING_GRN = "missing_grn"
    # Invoice received but no GRN → Hold payment
    
    MISSING_INVOICE = "missing_invoice"
    # GRN completed but no invoice → Follow up with supplier
```

**Technical Implementation:**

```python
# src/agentic/agents/reconciliation_agent.py

from typing import List, Tuple
from enum import Enum

class MatchResult(BaseModel):
    match_type: MatchType
    variance_amount: float
    requires_human_review: bool
    explanation: str
    recommended_action: str
    evidence: List[str]

class ReconciliationAgent:
    TOLERANCE_PERCENTAGE = 0.02  # 2% tolerance
    
    def __init__(self, ocr_service, db, llm):
        self.ocr = ocr_service
        self.db = db
        self.llm = llm
    
    async def perform_3way_match(
        self,
        po_id: str,
        grn_id: str,
        invoice_pdf: bytes
    ) -> MatchResult:
        """
        Step 7: 3-Way Invoice Match
        Compare PO → GRN → Invoice and flag discrepancies
        """
        # 1. Load PO and GRN from database
        po = await self.db.get_purchase_order(po_id)
        grn = await self.db.get_grn(grn_id)
        
        # 2. Extract invoice data using OCR
        invoice_data = await self.ocr.extract_invoice_data(invoice_pdf)
        
        # 3. Match line items across all three documents
        discrepancies = []
        
        for po_line in po.lines:
            grn_line = self._find_matching_line(po_line, grn.lines)
            invoice_line = self._find_matching_line(po_line, invoice_data.lines)
            
            if not grn_line:
                discrepancies.append({
                    "type": "missing_grn",
                    "item": po_line.product_name,
                    "message": f"No GRN record for {po_line.product_name}"
                })
                continue
            
            if not invoice_line:
                discrepancies.append({
                    "type": "missing_invoice_line",
                    "item": po_line.product_name,
                    "message": f"{po_line.product_name} not on invoice"
                })
                continue
            
            # Compare quantities: PO vs GRN vs Invoice
            if not self._quantities_match(po_line, grn_line, invoice_line):
                variance = self._calculate_variance(grn_line, invoice_line)
                
                discrepancies.append({
                    "type": "quantity_mismatch",
                    "item": po_line.product_name,
                    "po_qty": po_line.quantity_kg,
                    "grn_qty": grn_line.received_qty_kg,
                    "invoice_qty": invoice_line.quantity_kg,
                    "variance_amount": variance,
                    "message": (
                        f"GRN shows {grn_line.received_qty_kg}kg received, "
                        f"but invoice charges for {invoice_line.quantity_kg}kg"
                    )
                })
            
            # Compare prices: PO vs Invoice
            if not self._prices_match(po_line, invoice_line):
                discrepancies.append({
                    "type": "price_mismatch",
                    "item": po_line.product_name,
                    "po_price": po_line.price_per_kg,
                    "invoice_price": invoice_line.price_per_kg,
                    "message": (
                        f"Invoice price ${invoice_line.price_per_kg:.2f}/kg "
                        f"differs from PO ${po_line.price_per_kg:.2f}/kg"
                    )
                })
        
        # 4. Determine match result
        if len(discrepancies) == 0:
            return MatchResult(
                match_type=MatchType.PERFECT_MATCH,
                variance_amount=0.0,
                requires_human_review=False,
                explanation="All line items match perfectly across PO, GRN, and Invoice",
                recommended_action="auto_approve_payment",
                evidence=[]
            )
        
        # Calculate total variance
        total_variance = sum(d.get('variance_amount', 0) for d in discrepancies)
        variance_pct = abs(total_variance / po.total_amount)
        
        if variance_pct <= self.TOLERANCE_PERCENTAGE:
            return MatchResult(
                match_type=MatchType.ACCEPTABLE_VARIANCE,
                variance_amount=total_variance,
                requires_human_review=False,
                explanation=f"Variance ${total_variance:.2f} within {self.TOLERANCE_PERCENTAGE*100}% tolerance",
                recommended_action="auto_approve_with_note",
                evidence=[]
            )
        
        # Significant discrepancy - escalate
        explanation = self._generate_discrepancy_explanation(discrepancies)
        
        return MatchResult(
            match_type=MatchType.QUANTITY_MISMATCH,
            variance_amount=total_variance,
            requires_human_review=True,
            explanation=explanation,
            recommended_action="dispute_invoice",
            evidence=[grn_id, f"photos_{grn_id}"]
        )
    
    def _calculate_variance(self, grn_line: GRNLine, invoice_line: InvoiceLine) -> float:
        """Calculate monetary variance between GRN and Invoice"""
        grn_amount = grn_line.received_qty_kg * invoice_line.price_per_kg
        invoice_amount = invoice_line.quantity_kg * invoice_line.price_per_kg
        return invoice_amount - grn_amount
    
    def _generate_discrepancy_explanation(self, discrepancies: List[dict]) -> str:
        """Generate human-readable explanation of discrepancies"""
        if len(discrepancies) == 1:
            d = discrepancies[0]
            return d['message']
        
        summary = f"Found {len(discrepancies)} discrepancies:\n"
        for i, d in enumerate(discrepancies, 1):
            summary += f"{i}. {d['item']}: {d['message']}\n"
        
        return summary
    
    async def auto_dispute_invoice(self, match_result: MatchResult, invoice_id: str):
        """Automatically generate and send dispute to supplier"""
        dispute_message = f"""
        Invoice Dispute - {invoice_id}
        
        We have identified discrepancies between the invoice and our GRN:
        
        {match_result.explanation}
        
        Variance Amount: ${match_result.variance_amount:.2f}
        
        Evidence: GRN #{match_result.evidence[0]} with driver signature
        
        Please review and issue a credit note for the difference.
        
        Regards,
        AI Procurement System
        """
        
        # Send via platform messaging + email
        await self.db.create_dispute(
            invoice_id=invoice_id,
            amount=match_result.variance_amount,
            reason=match_result.explanation,
            status="open"
        )
        
        await self.send_supplier_notification(dispute_message)
```

**Automation Rates:**
| Match Type | Frequency | Action taken |
|------------|-----------|--------------|
| **Perfect Match** | 75% | Auto-approve payment |
| **Acceptable Variance** | 15% | Auto-approve with note |
| **Requires Review** | 10% | Escalate to finance manager |

**Business Impact:**
- **Time Savings:** 95% of invoices auto-processed (vs 100% manual)
- **Error Detection:** Catch 100% of overcharges (vs ~40% manually)
- **Dispute Resolution:** 48-hour turnaround (vs 2-week manual follow-up)
- **Cost Recovery:** $800/month average (from caught discrepancies)

---

## 2. Technical Architecture

### 2.1 Modular Headless Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     TECHNICAL STACK OVERVIEW                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 1: COMMERCE FRAMEWORK                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🛍️ MedusaJS 2.0 (Headless E-Commerce Backend)                             │
│  ├─ Multi-Vendor B2B Logic                                                  │
│  ├─ Company Accounts + Employee Sub-Accounts                                │
│  ├─ RFQ (Request for Quote) Workflows                                       │
│  ├─ Spending Limits & Approval Workflows                                    │
│  ├─ Order Management & Fulfillment                                          │
│  └─ Payment Processing Integration                                          │
│                                                                             │
│  📦 Custom Medusa Modules (Our IP):                                         │
│  ├─ SKU Normalization Module                                                │
│  ├─ AI Suggested Cart Module                                                │
│  ├─ GRN (Goods Received) Module                                             │
│  ├─ Invoice Matching Module                                                 │
│  ├─ Forecasting Module                                                      │
│  └─ Waste & Variance Tracking Module                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                       ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 2: AGENTIC BRAIN (Multi-Agent Orchestration)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🧠 LangGraph (State Machine Orchestration)                                 │
│  ├─ Agent Graph Definition                                                  │
│  ├─ State Management (checkpointing, persistence)                           │
│  ├─ Tool Calling Infrastructure                                             │
│  └─ Human-in-the-Loop Integration                                           │
│                                                                             │
│  🤖 AI Agents (Specialized Roles):                                          │
│  ├─ Forecasting Agent (Prophet + LLM reasoning)                             │
│  ├─ Data Engine Agent (SKU normalization)                                   │
│  ├─ Sourcing Agent (Multi-supplier comparison)                              │
│  ├─ Negotiation Agent (WhatsApp API integration)                            │
│  ├─ GRN Agent (OCR + Computer Vision)                                       │
│  └─ Reconciliation Agent (3-way match logic)                                │
│                                                                             │
│  🔧 Tools (Function Calling):                                               │
│  ├─ parse_pack_size(text) → PackInfo                                       │
│  ├─ normalize_sku(raw) → NormalizedSKU                                     │
│  ├─ compare_suppliers(item) → RankedQuotes                                 │
│  ├─ generate_po(cart) → PurchaseOrder                                      │
│  ├─ match_invoice(po, grn, invoice) → MatchResult                          │
│  ├─ fetch_pos_sales(period) → SalesData                                    │
│  └─ save_audit_log(entry) → AuditLog                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                       ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 3: INTELLIGENCE ENGINE (Vector DB + ML Models)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🔍 Weaviate / Chroma (Vector Database)                                     │
│  ├─ SKU Embeddings (semantic similarity search)                             │
│  ├─ Supplier Metadata (reliability scores, lead times)                      │
│  ├─ Product Catalog (normalized master SKUs)                                │
│  └─ Policy Documents (approval rules, substitutions)                        │
│                                                                             │
│  📊 ML Models:                                                              │
│  ├─ Prophet: Time series forecasting (demand prediction)                    │
│  ├─ Scikit-Learn: Anomaly detection (variance alerts)                       │
│  ├─ OpenAI GPT-4o: Reasoning, explanation generation                        │
│  └─ OpenAI Embeddings: Text → vector for semantic search                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                       ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 4: INTEGRATION LAYER (External Systems)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🏪 POS Integration:                                                        │
│  ├─ Foodics API (UAE market leader)                                         │
│  ├─ Oracle Simphony / Oracle MICROS                                         │
│  ├─ Toast POS (for international expansion)                                 │
│  └─ Square POS                                                              │
│                                                                             │
│  💬 WhatsApp Business API:                                                  │
│  ├─ Two-way messaging with suppliers                                        │
│  ├─ Automated negotiation workflows                                         │
│  └─ Delivery notifications                                                  │
│                                                                             │
│  📄 Document Processing:                                                    │
│  ├─ AWS Textract (OCR for invoices, GRNs)                                  │
│  ├─ Google Document AI (alternative OCR)                                    │
│  └─ Computer Vision (delivery photo analysis)                               │
│                                                                             │
│  🇦🇪 UAE Compliance:                                                        │
│  ├─ Poppel API (E-Invoicing to UAE Federal Tax Authority)                  │
│  ├─ Ne'ma API (Food waste reporting compliance)                            │
│  └─ Foodwatch Integration (Regulatory compliance)                           │
│                                                                             │
│  💳 Payment Gateways:                                                       │
│  ├─ Network International (UAE/GCC leader)                                  │
│  ├─ PayTabs (Middle East)                                                   │
│  └─ Stripe (International backup)                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                       ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 5: DATA & PERSISTENCE                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🗄️ PostgreSQL (Transactional Data):                                       │
│  ├─ Companies, Users, Employees                                             │
│  ├─ Orders, POs, GRNs, Invoices                                             │
│  ├─ Products, Suppliers, Catalogs                                           │
│  ├─ SKU Normalization Mappings                                              │
│  └─ Audit Logs (full trail)                                                 │
│                                                                             │
│  📦 MongoDB (Document Store):                                               │
│  ├─ Agent Conversation Logs                                                 │
│  ├─ Supplier Catalogs (raw JSON)                                            │
│  └─ Unstructured Data                                                       │
│                                                                             │
│  ⚡ Redis (Cache + Queue):                                                  │
│  ├─ Session Management                                                      │
│  ├─ Cart State (real-time)                                                  │
│  └─ Job Queue (BullMQ for background tasks)                                 │
│                                                                             │
│  ☁️ S3 / Cloud Storage:                                                     │
│  ├─ Invoice PDFs                                                            │
│  ├─ GRN Photos                                                              │
│  ├─ Product Images                                                          │
│  └─ Audit Documents                                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                       ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 6: INFRASTRUCTURE & DevOps                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ☁️ Cloud: AWS / GCP (Multi-region: UAE + Europe)                          │
│  🐳 Containers: Docker + Kubernetes (EKS / GKE)                             │
│  📡 Event Bus: Kafka / AWS EventBridge (real-time events)                  │
│  📊 Monitoring: Datadog / Sentry / CloudWatch                               │
│  🔒 Security: SSL/TLS, VPC, IAM, Secrets Manager                           │
│  📦 CI/CD: GitHub Actions → Docker → K8s                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Details

| Layer | Component | Technology | Purpose | Why This Choice |
|-------|-----------|------------|---------|-----------------|
| **Commerce** | MedusaJS 2.0 | Node.js/TypeScript | B2B e-commerce backend | Headless, extensible, built for multi-vendor B2B |
| **Agentic** | LangGraph | Python | Multi-agent orchestration | State management, checkpointing, HITL support |
| **Intelligence** | Weaviate/Chroma | Vector DB | SKU semantic search | Fast similarity search at scale |
| **Intelligence** | Prophet | Python/Stan | Time series forecasting | Proven for seasonality, easy to explain |
| **Intelligence** | GPT-4o | OpenAI API | Reasoning + explanation | Best-in-class reasoning, function calling |
| **Integration** | Foodics API | REST API | POS data (UAE market) | Market leader in UAE F&B |
| **Integration** | AWS Textract | AWS Service | Invoice OCR | High accuracy, handles Arabic + English |
| **Integration** | WhatsApp Business | Meta API | Supplier communication | Universal in UAE, official API |
| **Compliance** | Poppel | REST API | UAE e-invoicing | Official partner of UAE FTA |
| **Compliance** | Ne'ma | REST API | Food waste reporting | UAE government mandate |
| **Data** | PostgreSQL | RDBMS | Transactional data | ACID compliance, mature ecosystem |
| **Data** | Redis | In-memory | Cache + queue | Sub-millisecond latency for cart state |
| **Infrastructure** | AWS/GCP | Cloud | Hosting | Multi-region, UAE data residency |

---

## 3. Agent Design Patterns

### 3.1 ReAct Pattern (Reason + Act)

```python
# Agent Loop: Reason → Act → Observe → Update

from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

class AgentState(TypedDict):
    """Shared state across agent workflow"""
    objective: str
    observations: List[str]
    actions_taken: List[str]
    current_plan: str
    result: Any
    iteration: int

def reasoning_step(state: AgentState) -> AgentState:
    """
    REASON: Analyze current state and decide next action
    """
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    
    prompt = f"""
    Objective: {state['objective']}
    
    Observations so far:
    {chr(10).join(state['observations'])}
    
    Actions taken:
    {chr(10).join(state['actions_taken'])}
    
    What should I do next? Provide:
    1. Analysis of current situation
    2. Next action to take (with tool name)
    3. Expected outcome
    """
    
    reasoning = llm.invoke(prompt)
    state['current_plan'] = reasoning.content
    return state

def action_step(state: AgentState) -> AgentState:
    """
    ACT: Execute the planned action using tools
    """
    # Parse plan to extract tool call
    tool_name, tool_args = parse_plan(state['current_plan'])
    
    # Execute tool
    if tool_name == "fetch_pos_sales":
        result = fetch_pos_sales(**tool_args)
    elif tool_name == "normalize_sku":
        result = normalize_sku(**tool_args)
    # ... other tools
    
    state['actions_taken'].append(f"{tool_name}({tool_args})")
    state['result'] = result
    return state

def observation_step(state: AgentState) -> AgentState:
    """
    OBSERVE: Record results from action
    """
    observation = f"Action: {state['actions_taken'][-1]} → Result: {state['result']}"
    state['observations'].append(observation)
    state['iteration'] += 1
    return state

def should_continue(state: AgentState) -> str:
    """
    UPDATE: Decide if we're done or need another iteration
    """
    if state['iteration'] >= 10:
        return "end"  # Max iterations reached
    
    # Check if objective is met
    if objective_achieved(state):
        return "end"
    else:
        return "continue"

# Build ReAct workflow graph
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("reason", reasoning_step)
workflow.add_node("act", action_step)
workflow.add_node("observe", observation_step)

# Add edges
workflow.set_entry_point("reason")
workflow.add_edge("reason", "act")
workflow.add_edge("act", "observe")
workflow.add_conditional_edges(
    "observe",
    should_continue,
    {
        "continue": "reason",
        "end": END
    }
)

# Compile
app = workflow.compile()

# Run
result = app.invoke({
    "objective": "Generate suggested cart for Restaurant #123",
    "observations": [],
    "actions_taken": [],
    "current_plan": "",
    "result": None,
    "iteration": 0
})
```

---

## 4. UAE-Specific Compliance

### 4.1 E-Invoicing (EIS - Electronic Invoice System)

**UAE Mandate:** All B2B transactions must submit e-invoices to Federal Tax Authority (FTA)

**Poppel Integration:**

```python
# src/integrations/poppel_einvoicing.py

from pydantic import BaseModel
import httpx

class PoppelInvoice(BaseModel):
    """Poppel-compliant invoice format"""
    invoice_number: str
    invoice_date: str
    supplier_tax_id: str
    buyer_tax_id: str
    line_items: List[dict]
    subtotal: float
    vat_amount: float  # 5% UAE VAT
    total_amount: float
    currency: str = "AED"

class PoppelClient:
    """Integration with Poppel E-Invoicing API"""
    
    BASE_URL = "https://api.poppel.ae/v1"
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = httpx.AsyncClient()
    
    async def submit_invoice(self, invoice: PoppelInvoice) -> dict:
        """
        Submit invoice to UAE FTA via Poppel
        Returns: FTA acknowledgment + Invoice UUID
        """
        payload = {
            "invoice_number": invoice.invoice_number,
            "invoice_date": invoice.invoice_date,
            "seller": {
                "tax_id": invoice.supplier_tax_id,
                "name": "Supplier Name",
                "address": "..."
            },
            "buyer": {
                "tax_id": invoice.buyer_tax_id,
                "name": "Restaurant Name",
                "address": "..."
            },
            "line_items": invoice.line_items,
            "tax_subtotal": {
                "taxable_amount": invoice.subtotal,
                "tax_amount": invoice.vat_amount,
                "tax_category": "S",  # Standard rate (5%)
                "percent": 5.0
            },
            "total_amount": invoice.total_amount,
            "currency_code": "AED"
        }
        
        response = await self.client.post(
            f"{self.BASE_URL}/invoices",
            json=payload,
            headers={"Authorization": f"Bearer {self.api_key}"}
        )
        
        response.raise_for_status()
        return response.json()
    
    async def get_invoice_status(self, invoice_uuid: str) -> str:
        """
        Check FTA approval status
        Returns: "approved", "rejected", "pending"
        """
        response = await self.client.get(
            f"{self.BASE_URL}/invoices/{invoice_uuid}/status",
            headers={"Authorization": f"Bearer {self.api_key}"}
        )
        
        return response.json()['status']
```

**Compliance Workflow:**
```
Invoice Generated → Validate VAT (5%) → Submit to Poppel → FTA Approval → Store Audit Trail
```

---

### 4.2 Ne'ma (Food Waste Reduction Initiative)

**UAE Mandate:** Hotels and restaurants must report food waste monthly

**Integration:**

```python
# src/integrations/nema_waste_reporting.py

class NemaReport(BaseModel):
    """Monthly food waste report for UAE Ne'ma initiative"""
    establishment_license: str
    reporting_month: str
    total_food_waste_kg: float
    waste_by_category: dict  # {"produce": 45.2, "meat": 23.1, ...}
    waste_diverted_kg: float  # Donated or composted
    waste_reduction_initiatives: List[str]

class NemaClient:
    """Integration with Ne'ma API"""
    
    async def submit_monthly_report(self, report: NemaReport) -> dict:
        """Submit monthly food waste report to UAE authorities"""
        # API endpoint (hypothetical - actual depends on Ne'ma rollout)
        response = await httpx.post(
            "https://api.nema.ae/v1/reports",
            json=report.dict()
        )
        
        return response.json()
```

**Platform Benefit:**
- **Auto-calculated waste:** Track inventory loss → auto-generate Ne'ma reports
- **Zero manual effort:** Compliance on autopilot

---

## 5. Integration Specifications

### 5.1 Foodics POS Integration

```python
# src/integrations/foodics_pos.py

class FoodicsClient:
    """Integration with Foodics POS API"""
    
    BASE_URL = "https://api.foodics.com/v5"
    
    async def fetch_sales_data(
        self, 
        restaurant_id: str, 
        start_date: str, 
        end_date: str
    ) -> List[SaleTransaction]:
        """
        Fetch sales transactions from Foodics POS
        Returns: List of transactions with item-level detail
        """
        response = await self.client.get(
            f"{self.BASE_URL}/orders",
            params={
                "branch": restaurant_id,
                "created_at[from]": start_date,
                "created_at[to]": end_date,
                "include": "products"
            },
            headers={"Authorization": f"Bearer {self.api_token}"}
        )
        
        orders = response.json()['data']
        
        # Parse into SaleTransaction format
        transactions = []
        for order in orders:
            for product in order['products']:
                transactions.append(SaleTransaction(
                    sku=product['sku'],
                    product_name=product['name'],
                    quantity_sold=product['quantity'],
                    unit=product['unit'],
                    timestamp=order['created_at'],
                    branch_id=restaurant_id
                ))
        
        return transactions
    
    async def get_current_inventory(self, restaurant_id: str) -> dict:
        """
        Fetch current inventory levels from Foodics
        """
        response = await self.client.get(
            f"{self.BASE_URL}/inventory",
            params={"branch": restaurant_id},
            headers={"Authorization": f"Bearer {self.api_token}"}
        )
        
        return response.json()['data']
```

---

## 6. Business Impact Metrics

### 6.1 Cost Reduction

```
┌─────────────────────────────────────────────────────────────────────┐
│  COST SAVINGS BREAKDOWN (per restaurant/month)                      │
└─────────────────────────────────────────────────────────────────────┘

1. Food Cost Reduction (1-4% of total food spend)
   ├─ Better pricing: $1,800/month
   ├─ Reduced leakage (GRN matching): $1,200/month
   └─ Waste reduction (AI forecasting): $2,400/month
   Subtotal: $5,400/month

2. Labor Efficiency (procurement manager time savings)
   ├─ 15 hours/week saved × $20/hour = $1,200/month
   
3. Tail-Spend Optimization (uncontracted items)
   ├─ 12-15% savings on 20% of items = $600/month

4. Faster Decision-Making
   ├─ Reduced stockouts: $800/month (lost revenue prevented)
   ├─ Caught flash deals: $200/month

┌─────────────────────────────────────────────────────────────────────┐
│  TOTAL SAVINGS: $8,200/month = $98,400/year per restaurant 🎉      │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Decision Velocity

**Time Compression:**
- **RFQ → Contract:** Weeks → **Minutes** (40% faster)
- **Order Creation:** 2 hours → **3 minutes** (97% faster)
- **GRN Processing:** 15 min → **2 minutes** (87% faster)
- **Invoice Reconciliation:** 3 hours → **10 minutes** (94% faster)

### 6.3 Operational Transparency

**Before (Manual):**
- ❌ No visibility into supplier performance
- ❌ Price trends tracked in spreadsheets (if at all)
- ❌ Variance discovered weeks after delivery

**After (AI Platform):**
- ✅ Real-time supplier scorecards (reliability, pricing, quality)
- ✅ Automated variance alerts (theoretical vs actual consumption)
- ✅ Predictive analytics (price trends, demand forecasts)
- ✅ Complete audit trail (who ordered what, when, why)

---

## 7. Implementation Roadmap

### Phase 1: Foundation (Months 1-3)
**Goal:** Core procurement + SKU normalization

```
Week 1-4: Infrastructure Setup
├─ MedusaJS 2.0 deployment
├─ PostgreSQL + Redis setup
├─ Basic supplier onboarding

Week 5-8: SKU Normalization Engine
├─ Pack size parser
├─ Unit conversion
├─ Weaviate vector DB
├─ Basic price comparison

Week 9-12: Manual Ordering MVP
├─ Restaurant can browse catalogs
├─ Place orders manually
├─ Suppliers receive orders
└─ Basic GRN (manual entry)

KPIs: 10 restaurants, 5 suppliers, 100 orders
```

### Phase 2: AI Layer (Months 4-6)
**Goal:** Add forecasting + smart cart

```
Week 13-16: POS Integration
├─ Foodics API connector
├─ Sales data ingestion
├─ Inventory sync

Week 17-20: Forecasting Agent
├─ Prophet model training
├─ LangGraph orchestration
├─ Smart cart generation

Week 21-24: Sourcing Agent
├─ Multi-supplier comparison
├─ Decision scoring algorithm
└─ Human approval workflow

KPIs: 50 restaurants, 70% use AI suggestions
```

### Phase 3: Automation (Months 7-9)
**Goal:** GRN + invoice matching

```
Week 25-28: Digital GRN
├─ Mobile app (React Native)
├─ AWS Textract OCR
├─ Photo capture + verification

Week 29-32: 3-Way Match
├─ Reconciliation agent
├─ Automated dispute generation
└─ Variance alerts

Week 33-36: WhatsApp Integration
├─ Two-way messaging
├─ Negotiation agent
└─ Flash deal notifications

KPIs: 150 restaurants, 95% auto-matched invoices
```

### Phase 4: Compliance (Months 10-12)
**Goal:** UAE-ready production system

```
Week 37-40: E-Invoicing
├─ Poppel integration
├─ VAT validation
├─ FTA submission

Week 41-44: Ne'ma Reporting
├─ Waste tracking
├─ Auto-report generation

Week 45-48: Scale & Optimize
├─ Performance tuning
├─ User feedback implementation
└─ Marketing push

KPIs: 300 restaurants, 100% compliance, profitability
```

---

## Success Criteria

### Technical Acceptance

✅ **SKU Normalization:** 95%+ accuracy in matching similar products  
✅ **Forecast Accuracy:** 85%+ (actual vs predicted demand)  
✅ **3-Way Match:** 95%+ auto-processed without human review  
✅ **System Uptime:** 99.9% availability  
✅ **Response Time:** <200ms API latency (p95)  

### Business Acceptance

✅ **Cost Reduction:** 1-4% of food spend (validated by customers)  
✅ **Time Savings:** 80%+ reduction in procurement admin time  
✅ **Compliance:** 100% e-invoicing submission rate  
✅ **User Satisfaction:** NPS >50 (restaurants), >60 (suppliers)  
✅ **Adoption:** 70%+ of orders use AI suggestions after 3 months  

---

## 🚀 Summary: System of Results

This implementation transforms F&B procurement from a **manual, reactive operation** into an **autonomous, proactive system** where:

1. **AI predicts needs** before stockouts occur
2. **Agents source optimally** across multiple suppliers
3. **Negotiations happen automatically** within guardrails
4. **Humans approve strategically** in <3 minutes
5. **Receiving is verified digitally** with zero leakage
6. **Invoices reconcile automatically** with dispute generation

**The Result:** 
- 40% faster decision-making
- 1-4% food cost reduction  
- 80%+ time savings for procurement managers
- 100% compliance with UAE regulations
- **System that delivers results, not just records transactions** ✅

---

*Implementation Guide Version 1.0*  
*Last Updated: February 11, 2026*  
*Ready for Technical Review & Stakeholder Sign-Off*
