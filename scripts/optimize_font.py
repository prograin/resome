"""Keep Persian/Arabic, Latin and punctuation in the local variable font.

Requires: python -m pip install 'fonttools[woff]'
The original font and OFL license are preserved.
"""
from pathlib import Path
from fontTools import subset

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / "assets/fonts/Vazirmatn-Variable.woff2"
target = ROOT / "assets/fonts/Vazirmatn-fa-latin.woff2"
options = subset.Options()
options.flavor = "woff2"
options.layout_features = ["*"]
font = subset.load_font(str(source), options)
subsetter = subset.Subsetter(options=options)
ranges = [(0x0000, 0x00FF), (0x0600, 0x06FF), (0x2000, 0x206F)]
unicodes = {code for start, end in ranges for code in range(start, end + 1)}
for path in (ROOT / "src").rglob("*"):
    if path.suffix in {".js", ".html"}:
        unicodes.update(map(ord, path.read_text(encoding="utf-8")))
# GSUB closure preserves contextual Arabic shaping and ligatures automatically.
subsetter.populate(unicodes=sorted(unicodes))
subsetter.subset(font)
font.flavor = "woff2"
font.save(str(target))
print(f"Font: {source.stat().st_size:,} -> {target.stat().st_size:,} bytes")
