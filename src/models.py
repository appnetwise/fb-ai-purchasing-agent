from __future__ import annotations

from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class SupplierSKU:
    supplier: str
    sku: str
    name: str
    pack: str
    unit_price: float
    currency: str


@dataclass(frozen=True)
class PackInfo:
    count: int
    size: float
    unit: str


@dataclass(frozen=True)
class NormalizedSKU:
    supplier_sku: SupplierSKU
    normalized_name: str
    pack_info: Optional[PackInfo]
    price_per_kg: Optional[float]
