from __future__ import annotations

from pydantic import BaseModel, Field


class ToolCallLog(BaseModel):
    tool_name: str
    input: dict
    output: dict | None = None
    error: str | None = None


class SuggestedCartItem(BaseModel):
    normalized_sku: str
    quantity: float = Field(gt=0)
    unit: str = "kg"
    supplier: str | None = None
    reason: str


class SuggestedCart(BaseModel):
    items: list[SuggestedCartItem]
