#!/usr/bin/env python3
"""Build stickman.zip from skills/stickman, then prove every file in it matches the folder."""
import hashlib, zipfile
from pathlib import Path

root = Path(__file__).resolve().parent.parent; src = root / "skills" / "stickman"; out = root / "stickman.zip"
files = sorted(p for p in src.rglob("*") if p.is_file() and "__pycache__" not in p.parts and p.name != ".DS_Store")
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for p in files:
        info = zipfile.ZipInfo(f"stickman/{p.relative_to(src).as_posix()}", (2026, 1, 1, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED; info.external_attr = 0o644 << 16
        z.writestr(info, p.read_bytes())
with zipfile.ZipFile(out) as z:
    names = z.namelist(); bad = [n for n in names if z.read(n) != (src / n.split("/", 1)[1]).read_bytes()]
assert len(names) == len(files) and not bad, bad
print(len(names), "files,", out.stat().st_size // 1024, "KB, sha256", hashlib.sha256(out.read_bytes()).hexdigest())
