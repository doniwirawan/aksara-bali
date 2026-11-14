"""Aksara Bali app icon: the letter ᬳ (ha, first of the hanacaraka) in white on a flat bang-red square,
with the braided red-white-black tridatu thread along the bottom edge.
Glyph outlines come from Noto Sans Balinese Bold, so no font is needed to view it.
usage: python make_icon.py <font.ttf> <outdir>
"""
import io, os, sys
import fitz
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from PIL import Image

font_path, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
RED, PAPER, BLACK = '#B4232B', '#F7F6F2', '#17140F'

font = TTFont(font_path)
gs = font.getGlyphSet()
gname = font.getBestCmap()[0x1B33]          # ᬳ  BALINESE LETTER HA
pen = SVGPathPen(gs); gs[gname].draw(pen)
bp = BoundsPen(gs); gs[gname].draw(bp)
xmin, ymin, xmax, ymax = bp.bounds
gw, gh = xmax - xmin, ymax - ymin

def svg(size=512, thread=True, glyph_box=0.62):
    """glyph_box: share of the icon the glyph's larger side may take (keeps it
    inside the maskable safe zone, the central 80%)."""
    s = size
    band = round(s * 0.085) if thread else 0
    scale = glyph_box * s / max(gw, gh)
    # centre the glyph in the area above the thread
    cx, cy = s / 2, (s - band) / 2
    tx = cx - (xmin + gw / 2) * scale
    ty = cy + (ymin + gh / 2) * scale       # font y-axis points up
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{s}" height="{s}" viewBox="0 0 {s} {s}">',
             f'<rect width="{s}" height="{s}" fill="{RED}"/>']
    if thread:
        # three-strand braid as repeated diagonal stripes, clipped to the band
        y0 = s - band
        parts.append(f'<clipPath id="b"><rect x="0" y="{y0}" width="{s}" height="{band}"/></clipPath><g clip-path="url(#b)"><rect x="0" y="{y0}" width="{s}" height="{band}" fill="{BLACK}"/>')
        stripe = band * 0.9
        x = -band * 2
        k = 0
        while x < s + band * 2:
            col = ['#D6343D', PAPER, BLACK][k % 3]
            parts.append(f'<polygon points="{x},{s} {x + stripe},{s} {x + stripe + band * 0.55},{y0} {x + band * 0.55},{y0}" fill="{col}"/>')
            x += stripe; k += 1
        parts.append('</g>')
    parts.append(f'<path transform="translate({tx:.2f} {ty:.2f}) scale({scale:.5f} {-scale:.5f})" d="{pen.getCommands()}" fill="{PAPER}"/>')
    parts.append('</svg>')
    return ''.join(parts)

def png(svg_text, px):
    doc = fitz.open(stream=svg_text.encode(), filetype='svg')
    page = doc[0]
    zoom = px / page.rect.width
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    return Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB')

full = svg(512, thread=True, glyph_box=0.66)
small = svg(512, thread=False, glyph_box=0.94)  # favicons: no braid, glyph edge to edge
open(os.path.join(out, 'icon.svg'), 'w', encoding='utf-8').write(full)
open(os.path.join(out, 'favicon.svg'), 'w', encoding='utf-8').write(small)

targets = {
    'android-chrome-512x512.png': (full, 512),
    'android-chrome-192x192.png': (full, 192),
    'apple-touch-icon.png': (full, 180),
    'favicon-32x32.png': (small, 32),
    'favicon-16x16.png': (small, 16),
}
for name, (src, px) in targets.items():
    png(src, px).save(os.path.join(out, name), optimize=True)
png(small, 256).save(os.path.join(out, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)])
png(full, 1024).save(os.path.join(out, 'preview-1024.png'))
print('glyph', gname, 'bounds', bp.bounds)
