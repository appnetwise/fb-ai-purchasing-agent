from __future__ import annotations

from .agents.react_agent import run_react


def main() -> None:
    result = run_react(goal="Draft a suggested cart", sku_name="Fresh Apples Granny Smith 1kg")
    print("Plan:")
    for step in result.plan.steps:
        print(f"- {step.name}: {step.description}")

    print("\nTool logs:")
    for log in result.tool_logs:
        print(log.model_dump())

    print("\nSuggested cart:")
    print(result.suggestion.model_dump() if result.suggestion else "None")


if __name__ == "__main__":
    main()
