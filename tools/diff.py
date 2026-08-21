"""Compare a rendered page against its Figma reference render.

Usage: python tools/diff.py <rendered.png> <reference.jpg> <out_prefix> [ymin] [ymax]

The references in screenshots/ are 2x renders of a 1920px-wide design, so they
are downscaled to 1920 before comparing. Emits a score plus a side-by-side and
a red/blue overlay that makes misplacement obvious at a glance.
"""
import sys
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None


def load(path, width=1920):
    im = Image.open(path).convert('L')
    if im.width != width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    return im


def main():
    got_p, ref_p, out = sys.argv[1], sys.argv[2], sys.argv[3]
    y0 = int(sys.argv[4]) if len(sys.argv) > 4 else 0
    y1 = int(sys.argv[5]) if len(sys.argv) > 5 else 0

    got, ref = load(got_p), load(ref_p)
    h = min(got.height, ref.height) if not y1 else y1
    if y1:
        got, ref = got.crop((0, y0, 1920, y1)), ref.crop((0, y0, 1920, y1))
        h = y1 - y0
    else:
        got, ref = got.crop((0, 0, 1920, h)), ref.crop((0, 0, 1920, h))

    a = np.asarray(got).astype(np.int16)
    b = np.asarray(ref).astype(np.int16)
    d = np.abs(a - b)

    print(f"height  rendered={Image.open(got_p).height * 1920 // Image.open(got_p).width}  "
          f"reference={Image.open(ref_p).height * 1920 // Image.open(ref_p).width}")
    print(f"compared band y={y0}..{y0 + h}")
    print(f"mean abs diff : {d.mean():6.2f} / 255")
    print(f"pixels >32    : {(d > 32).mean() * 100:6.2f}%")
    print(f"pixels >64    : {(d > 64).mean() * 100:6.2f}%")

    # Per-band breakdown so it is obvious *where* the drift is.
    band = 200
    print("\nworst bands (y, %>32):")
    scores = []
    for i in range(0, h, band):
        seg = d[i:i + band]
        scores.append((y0 + i, (seg > 32).mean() * 100))
    for y, s in sorted(scores, key=lambda t: -t[1])[:12]:
        print(f"  y={y:6d}  {s:6.2f}%")

    # Overlay: reference in red, render in cyan. Grey where they agree.
    rgb = np.zeros((h, 1920, 3), dtype=np.uint8)
    rgb[..., 0] = b
    rgb[..., 1] = a
    rgb[..., 2] = a
    Image.fromarray(rgb).save(f"{out}_overlay.png")

    sbs = Image.new('RGB', (1920, h * 2 + 8), (0, 0, 60))
    sbs.paste(ref.convert('RGB'), (0, 0))
    sbs.paste(got.convert('RGB'), (0, h + 8))
    sbs.save(f"{out}_sbs.png")
    print(f"\nwrote {out}_overlay.png (ref=red, render=cyan) and {out}_sbs.png")


main()
