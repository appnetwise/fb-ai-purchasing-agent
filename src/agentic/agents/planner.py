from __future__ import annotations

from dataclasses import dataclass


@dataclass
class PlanStep:
    name: str
    description: str


@dataclass
class Plan:
    goal: str
    steps: list[PlanStep]


def make_plan(goal: str) -> Plan:
    return Plan(
        goal=goal,
        steps=[
            PlanStep(name="analyze", description="Review inputs and constraints"),
            PlanStep(name="retrieve", description="Pull relevant supplier/catalog/policy data"),
            PlanStep(name="act", description="Call tools to compute or fetch data"),
            PlanStep(name="validate", description="Validate with guardrails/schema"),
            PlanStep(name="finalize", description="Prepare recommendation for approval"),
        ],
    )
