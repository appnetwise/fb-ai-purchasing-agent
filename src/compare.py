from __future__ import annotations

from typing import Iterable, List

from .models import NormalizedSKU


def sort_by_price(items: Iterable[NormalizedSKU]) -> List[NormalizedSKU]:
    return sorted(
        items,
        key=lambda sku: (
            sku.price_per_kg is None,
            sku.price_per_kg if sku.price_per_kg is not None else float("inf"),
        ),
    )


def format_price(price: float | None, currency: str) -> str:
    if price is None:
        return "n/a"
    return f"{currency} {price:.2f}/kg"
