from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List

from rapidfuzz import fuzz

from .models import NormalizedSKU


@dataclass
class GroupedSKUs:
    key: str
    items: List[NormalizedSKU]


def group_skus(items: Iterable[NormalizedSKU], threshold: int = 86) -> List[GroupedSKUs]:
    groups: List[GroupedSKUs] = []

    for item in items:
        placed = False
        for group in groups:
            score = fuzz.ratio(item.normalized_name, group.key)
            if score >= threshold:
                group.items.append(item)
                placed = True
                break
        if not placed:
            groups.append(GroupedSKUs(key=item.normalized_name, items=[item]))

    return groups
