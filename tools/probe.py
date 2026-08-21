"""Compare the ink bounding box of individual elements between a render and
its reference, so drift can be read in pixels instead of guessed from an overlay.

Usage: python tools/probe.py <rendered.png> <reference.jpg> <probes.json>
probes.json: [{"label":..,"x0":..,"x1":..,"y0":..,"y1":..}, ...] in design px.
"""
import json
import sys
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None


def load(p):
    im = Image.open(p).convert('L')
    if im.width != 1920:
        im = im.resize((1920, round(im.height * 1920 / im.width)), Image.LANCZOS)
    return np.asarray(im)


def ink(a, x0, x1, y0, y1, thr=95):
    s = a[y0:y1, x0:x1]
    m = s > thr
    c, r = m.any(axis=0), m.any(axis=1)
    if not c.any():
        return None
    i, j = np.where(c)[0], np.where(r)[0]
    return x0 + i[0], x0 + i[-1] + 1, y0 + j[0], y0 + j[-1] + 1


got, ref = load(sys.argv[1]), load(sys.argv[2])
probes = json.load(open(sys.argv[3], encoding='utf-8'))

print(f"{'label':<26}{'dx':>6}{'dy':>6}{'dw':>6}{'dh':>6}   {'ref box':<26}{'got box'}")
for p in probes:
    a = ink(ref, p['x0'], p['x1'], p['y0'], p['y1'])
    b = ink(got, p['x0'], p['x1'], p['y0'], p['y1'])
    if a is None or b is None:
        print(f"{p['label']:<26}  {'MISSING in ref' if a is None else 'MISSING in render'}")
        continue
    dx, dy = b[0] - a[0], b[2] - a[2]
    dw = (b[1] - b[0]) - (a[1] - a[0])
    dh = (b[3] - b[2]) - (a[3] - a[2])
    flag = '' if max(abs(dx), abs(dy), abs(dw), abs(dh)) <= 2 else '  <<'
    print(f"{p['label']:<26}{dx:>6}{dy:>6}{dw:>6}{dh:>6}   "
          f"{str(a):<26}{b}{flag}")
