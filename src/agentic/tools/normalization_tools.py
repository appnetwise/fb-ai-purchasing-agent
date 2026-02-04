from __future__ import annotations

from typing import Optional

from ...normalization import normalize_name, pack_to_kg, parse_pack
from ..schemas import ToolCallLog


def tool_parse_pack(pack_text: str) -> dict:
    pack_info = parse_pack(pack_text)
    if not pack_info:
        return {"pack_info": None}
    return {"pack_info": pack_info.__dict__}


def tool_convert_to_kg(pack_info: dict) -> dict:
    if not pack_info:
        return {"kg": None}
    from ...models import PackInfo

    info = PackInfo(**pack_info)
    return {"kg": pack_to_kg(info)}


def tool_normalize_name(name: str) -> dict:
    return {"normalized": normalize_name(name)}


def run_with_logging(tool_name: str, fn, *args, **kwargs) -> ToolCallLog:
    try:
        output = fn(*args, **kwargs)
        return ToolCallLog(tool_name=tool_name, input={"args": args, "kwargs": kwargs}, output=output)
    except Exception as exc:
        return ToolCallLog(tool_name=tool_name, input={"args": args, "kwargs": kwargs}, error=str(exc))
