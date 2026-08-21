"""Extract a Figma-exported logo lockup into one standalone SVG file.

The exporter emits a lockup as several absolutely-positioned sibling <svg>
elements inside a wrapper div. This flattens them into a single SVG whose
viewBox is the wrapper's box, with each child wrapped in a translate().

Usage: python tools/extract_logo.py <page.html> <wrapperWidth> <wrapperHeight> <out.svg> [occurrence]
"""
import re
import sys

page, wrap_w, wrap_h, out = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
occurrence = int(sys.argv[5]) if len(sys.argv) > 5 else 0

s = open(page, encoding='utf-8').read()


def spans(html, tag):
    """Yield (start, end) of every balanced <tag ...>...</tag>."""
    i = 0
    while True:
        a = html.find(f'<{tag}', i)
        if a < 0:
            return
        depth, j = 0, a
        while True:
            na, nb = html.find(f'<{tag}', j + 1), html.find(f'</{tag}>', j + 1)
            if nb < 0:
                return
            if 0 <= na < nb:
                depth += 1
                j = na
            elif depth == 0:
                j = nb + len(tag) + 3
                break
            else:
                depth -= 1
                j = nb
        yield a, j
        # Advance by one so nested elements are visited too.
        i = a + 1


def style_of(tag_html):
    m = re.search(r'style="([^"]*)"', tag_html)
    d = {}
    for part in (m.group(1) if m else '').split(';'):
        if ':' in part:
            k, v = part.split(':', 1)
            d[k.strip()] = v.strip()
    return d


# Find the wrapper div whose style declares the requested width/height.
hits = [(a, b) for a, b in spans(s, 'div')
        if style_of(s[a:s.find('>', a)]).get('width') == f'{wrap_w}px'
        and style_of(s[a:s.find('>', a)]).get('height') == f'{wrap_h}px']
if not hits:
    sys.exit(f'no wrapper {wrap_w}x{wrap_h} in {page}')
a, b = hits[occurrence]
block = s[a:b]

parts = []
consumed = 0
for sa, sb in spans(block, 'svg'):
    if sa < consumed:      # nested inside one already taken
        continue
    consumed = sb
    svg = block[sa:sb]
    st = style_of(svg[:svg.find('>')])
    x = float(st.get('left', '0px').rstrip('px'))
    y = float(st.get('top', '0px').rstrip('px'))
    w = float(st.get('width', '0px').rstrip('px'))
    h = float(st.get('height', '0px').rstrip('px'))
    vb = re.search(r'viewBox="([^"]+)"', svg)
    inner = svg[svg.find('>') + 1:svg.rfind('</svg>')]
    vbw, vbh = (float(v) for v in vb.group(1).split()[2:4]) if vb else (w, h)
    sx, sy = (w / vbw if vbw else 1), (h / vbh if vbh else 1)
    parts.append(f'<g transform="translate({x} {y}) scale({sx:.6f} {sy:.6f})">{inner}</g>')

# The export nests one <svg> inside another for masked groups; keep only the
# outermost run by dropping any part whose geometry is already contained.
doc = (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
       f'viewBox="0 0 {wrap_w} {wrap_h}" width="{wrap_w}" height="{wrap_h}" fill="none">'
       + ''.join(parts) + '</svg>')
doc = re.sub(r'\s+', ' ', doc)
open(out, 'w', encoding='utf-8').write(doc)
print(f'{out}  {len(parts)} groups, {doc.count("<path")} paths, {len(doc)} bytes')
