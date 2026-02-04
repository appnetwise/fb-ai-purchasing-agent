from __future__ import annotations

from dataclasses import dataclass

from .planner import Plan, make_plan
from ..guardrails.pydantic_validators import validate_suggested_cart
from ..schemas import SuggestedCart
from ..tools.normalization_tools import run_with_logging, tool_normalize_name


@dataclass
class ReActResult:
    plan: Plan
    tool_logs: list
    suggestion: SuggestedCart | None


def run_react(goal: str, sku_name: str) -> ReActResult:
    plan = make_plan(goal)
    tool_logs = []

    # Reason -> Act
    log = run_with_logging("normalize_name", tool_normalize_name, sku_name)
    tool_logs.append(log)

    # Observe -> Update (placeholder for real model output)
    normalized = log.output.get("normalized") if log.output else None
    if not normalized:
        return ReActResult(plan=plan, tool_logs=tool_logs, suggestion=None)

    # Finalize with guardrails (placeholder cart)
    suggestion = validate_suggested_cart(
        {
            "items": [
                {
                    "normalized_sku": normalized,
                    "quantity": 5.0,
                    "unit": "kg",
                    "reason": "Placeholder suggestion from ReAct stub",
                }
            ]
        }
    )
    return ReActResult(plan=plan, tool_logs=tool_logs, suggestion=suggestion)
