#!/usr/bin/env python3
"""Update data/links.yaml with a new short link entry."""

from __future__ import annotations

import argparse
from datetime import datetime
from pathlib import Path
from typing import Any
import re

try:
    import yaml
except ImportError as exc:
    raise SystemExit("PyYAML is required; install it with `pip install pyyaml`.") from exc


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Add or update a shortener link in data/links.yaml")
    parser.add_argument("code", help="The slug to expose (e.g., meu-link)")
    parser.add_argument("target", help="The target URL (https://example.com)")
    parser.add_argument("--title", help="Optional human-friendly title")
    parser.add_argument("--author", help="Who added the entry (default: current user)")
    parser.add_argument(
        "--path",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "data" / "links.yaml",
        help="Location of the YAML file",
    )
    return parser.parse_args()


def load_links(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8") as fh:
        data = yaml.safe_load(fh) or []
    if not isinstance(data, list):
        raise SystemExit(f"Expected a YAML list at {path}, got {type(data).__name__}")
    return data


def save_links(path: Path, entries: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as fh:
        yaml.dump(entries, fh, sort_keys=False)


def find_entry(entries: list[dict[str, Any]], code: str) -> dict[str, Any] | None:
    for entry in entries:
        if entry.get("code") == code:
            return entry
    return None


def main() -> None:
    args = parse_args()
    code = args.code.strip()
    if not re.fullmatch(r"[A-Za-z0-9-]+", code):
        raise SystemExit("Code must be alphanumeric and may include hyphens.")
    target = args.target.strip()
    if not target:
        raise SystemExit("Target URL is required.")
    entries = load_links(args.path)
    existing = find_entry(entries, code)
    timestamp = datetime.utcnow().isoformat() + "Z"
    defaults = {"code": code, "target": target, "created_at": timestamp}
    if args.title:
        defaults["title"] = args.title
    author = args.author or "vibe-shortener"
    defaults["author"] = author
    if existing:
        existing.update(defaults)
        message = f"Updated {code} -> {target}"
    else:
        entries.append(defaults)
        message = f"Added {code} -> {target}"
    entries.sort(key=lambda item: item["code"])
    save_links(args.path, entries)
    print(message)


if __name__ == "__main__":
    main()
