from __future__ import annotations

from ..schemas import SuggestedCart


def validate_suggested_cart(data: dict) -> SuggestedCart:
    return SuggestedCart.model_validate(data)
