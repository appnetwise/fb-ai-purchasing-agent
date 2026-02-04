from __future__ import annotations

import csv
from pathlib import Path

from .compare import format_price, sort_by_price
from .matching import group_skus
from .models import NormalizedSKU, SupplierSKU
from .normalization import normalize_name, pack_to_kg, parse_pack


def load_catalog(path: Path) -> list[SupplierSKU]:
    items: list[SupplierSKU] = []
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            items.append(
                SupplierSKU(
                    supplier=row["supplier"].strip(),
                    sku=row["sku"].strip(),
                    name=row["name"].strip(),
                    pack=row["pack"].strip(),
                    unit_price=float(row["unit_price"]),
                    currency=row["currency"].strip(),
                )
            )
    return items


def normalize_items(items: list[SupplierSKU]) -> list[NormalizedSKU]:
    normalized: list[NormalizedSKU] = []
    for item in items:
        pack_info = parse_pack(item.pack)
        total_kg = pack_to_kg(pack_info) if pack_info else None
        price_per_kg = None
        if total_kg and total_kg > 0:
            price_per_kg = item.unit_price / total_kg
        normalized.append(
            NormalizedSKU(
                supplier_sku=item,
                normalized_name=normalize_name(item.name),
                pack_info=pack_info,
                price_per_kg=price_per_kg,
            )
        )
    return normalized


def main() -> None:
    data_path = Path(__file__).resolve().parents[1] / "data" / "suppliers.csv"
    items = load_catalog(data_path)
    normalized = normalize_items(items)
    groups = group_skus(normalized)

    for group in groups:
        print("\n===", group.key.upper(), "===")
        for sku in sort_by_price(group.items):
            item = sku.supplier_sku
            price = format_price(sku.price_per_kg, item.currency)
            print(
                f"{item.supplier:12} | {item.sku:10} | {item.name:35} | "
                f"{item.pack:12} | {item.unit_price:8.2f} | {price}"
            )


if __name__ == "__main__":
    main()
