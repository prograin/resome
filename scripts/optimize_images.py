"""Create web-ready copies without changing the original artwork (requires Pillow)."""
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "assets" / "images"


def optimize(source, target, size, quality):
    if target.exists() and target.stat().st_mtime >= source.stat().st_mtime:
        return
    with Image.open(source) as image:
        # JPEG draft decoding avoids expanding huge originals at full resolution.
        image.draft("RGB", size)
        image = ImageOps.exif_transpose(image)
        image.thumbnail(size, Image.Resampling.LANCZOS)
        target.parent.mkdir(parents=True, exist_ok=True)
        image.save(target, "WEBP", quality=quality, method=6)
    print(f"{target.relative_to(ROOT)}: {target.stat().st_size:,} bytes")


if __name__ == "__main__":
    for source in sorted(IMAGES.glob("*-bg.jpg")):
        for width in (960, 1920):
            optimize(source, IMAGES / "optimized" / f"{source.stem}-{width}.webp",
                     (width, width), 80)
    for source in sorted((IMAGES / "clients").glob("*.png")):
        optimize(source, source.with_suffix(".webp"), (128, 128), 85)
