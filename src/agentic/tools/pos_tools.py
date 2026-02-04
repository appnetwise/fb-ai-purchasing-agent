from __future__ import annotations

import requests

from ..config import env


class POSClient:
    def __init__(self) -> None:
        self.base_url = (env("POS_BASE_URL") or "").rstrip("/")
        self.api_key = env("POS_API_KEY") or ""

    def _headers(self) -> dict:
        return {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}

    def fetch_sales(self, start_date: str, end_date: str) -> dict:
        if not self.base_url:
            return {"error": "POS_BASE_URL not set"}
        url = f"{self.base_url}/sales?start={start_date}&end={end_date}"
        response = requests.get(url, headers=self._headers(), timeout=20)
        response.raise_for_status()
        return response.json()

    def fetch_inventory(self) -> dict:
        if not self.base_url:
            return {"error": "POS_BASE_URL not set"}
        url = f"{self.base_url}/inventory"
        response = requests.get(url, headers=self._headers(), timeout=20)
        response.raise_for_status()
        return response.json()
