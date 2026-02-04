from __future__ import annotations

import re
from typing import Optional

from pint import UnitRegistry

from .models import PackInfo

ureg = UnitRegistry()

UNIT_ALIASES = {
    "kg": "kilogram",
    "kilogram": "kilogram",
    "kilograms": "kilogram",
    "g": "gram",
    "gram": "gram",
    "grams": "gram",
    "lb": "pound",
    "lbs": "pound",
    "pound": "pound",
    "pounds": "pound",
    "oz": "ounce",
    "ounce": "ounce",
    "ounces": "ounce",
}

UNIT_PATTERN = r"kg|kilogram|kilograms|g|gram|grams|lb|lbs|pound|pounds|oz|ounce|ounces"

PACK_PATTERNS = [
    re.compile(rf"(?P<count>\d+)\s*[xX]\s*(?P<size>[\d\.\/]+)\s*(?P<unit>{UNIT_PATTERN})"),
    re.compile(rf"(?P<size>[\d\.\/]+)\s*(?P<unit>{UNIT_PATTERN})\s*[xX]\s*(?P<count>\d+)"),
    re.compile(rf"(?P<count>\d+)\s*\/\s*(?P<size>[\d\.\/]+)\s*(?P<unit>{UNIT_PATTERN})"),
    re.compile(rf"(?P<size>[\d\.\/]+)\s*(?P<unit>{UNIT_PATTERN})"),
]

REMOVE_TOKENS = re.compile(
    rf"\b\d+(?:\.\d+)?\s*(?:{UNIT_PATTERN}|ct|count|pcs|pc|pack|case)\b",
    re.IGNORECASE,
)


def _parse_number(value: str) -> Optional[float]:
    value = value.strip()
    if "/" in value:
        parts = value.split("/")
        if len(parts) == 2 and parts[0] and parts[1]:
            return float(parts[0]) / float(parts[1])
        return None
    try:
        return float(value)
    except ValueError:
        return None


def normalize_unit(unit: str) -> Optional[str]:
    unit = unit.strip().lower()
    return UNIT_ALIASES.get(unit)


def parse_pack(pack: str) -> Optional[PackInfo]:
    if not pack:
        return None

    text = pack.strip().lower()
    for pattern in PACK_PATTERNS:
        match = pattern.search(text)
        if not match:
            continue
        count = match.groupdict().get("count") or "1"
        size = match.groupdict().get("size")
        unit = match.groupdict().get("unit")
        if not size or not unit:
            continue
        size_value = _parse_number(size)
        if size_value is None:
            continue
        count_value = int(count)
        normalized_unit = normalize_unit(unit)
        if not normalized_unit:
            continue
        return PackInfo(count=count_value, size=size_value, unit=normalized_unit)

    return None


def pack_to_kg(pack: PackInfo) -> Optional[float]:
    try:
        qty = pack.count * pack.size * ureg(pack.unit)
        return qty.to("kilogram").magnitude
    except Exception:
        return None


def normalize_name(name: str) -> str:
    text = name.lower().strip()
    text = text.replace("&", "and")
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = REMOVE_TOKENS.sub(" ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()
