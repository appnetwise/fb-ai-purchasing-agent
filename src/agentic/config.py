from __future__ import annotations

import os

from dotenv import load_dotenv

load_dotenv()


def env(key: str, default: str | None = None) -> str | None:
    return os.getenv(key, default)
