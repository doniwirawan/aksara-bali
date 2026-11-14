"""Android launcher/splash artwork in the Tridatu look, from the same glyph as the web icon.
usage: python make_mobile_icons.py <NotoSansBalinese-Bold.ttf> <mobile-app/assets/icon>
Writes icon_app.png (1024, legacy/iOS), icon_fg.png (adaptive foreground, transparent),
logo.png (padded mark for the app bar and splash).
"""
import io, os, sys
import fitz
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from PIL import Image

font_path, out = sys.argv[1], sys.argv[2]
RED, PAPER, BLACK, BRAID_RED = '#B4232B', '#F7F6F2', '#17140F', '#D6343D'
font = TTFont(font_path)
gs = font.getGlyphSet()
g = font.getBestCmap()[0x1B33]  # ᬳ
pen = SVGPathPen(gs); gs[g].draw(pen)
bp = BoundsPen(gs); gs[g].draw(bp)
xmin, ymin, xmax, ymax = bp.bounds
gw, gh = xmax - xmin, ymax - ymin

def glyph(s, box, cy):
    scale = box * s / max(gw, gh)
    tx = s / 2 - (xmin + gw / 2) * scale
    ty = cy + (ymin + gh / 2) * scale
    return f'<path transform="translate({tx:.2f} {ty:.2f}) scale({scale:.5f} {-scale:.5f})" d="{pen.getCommands()}" fill="{PAPER}"/>'

def braid(s, band):
    y0 = s - band
    p = [f'<clipPath id="b"><rect x="0" y="{y0}" width="{s}" height="{band}"/></clipPath><g clip-path="url(#b)"><rect x="0" y="{y0}" width="{s}" height="{band}" fill="{BLACK}"/>']
    x, k, stripe = -band * 2, 0, band * 0.9
    while x < s + band * 2:
        p.append(f'<polygon points="{x},{s} {x + stripe},{s} {x + stripe + band * 0.55},{y0} {x + band * 0.55},{y0}" fill="{[BRAID_RED, PAPER, BLACK][k % 3]}"/>')
        x += stripe; k += 1
    return ''.join(p) + '</g>'

def render(svg, px, alpha=False):
    doc = fitz.open(stream=svg.encode(), filetype='svg')
    page = doc[0]
    pix = page.get_pixmap(matrix=fitz.Matrix(px / page.rect.width, px / page.rect.width), alpha=alpha)
    return Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGBA' if alpha else 'RGB')

S = 1024
band = round(S * 0.085)
full = f'<svg xmlns="http://www.w3.org/2000/svg" width="{S}" height="{S}"><rect width="{S}" height="{S}" fill="{RED}"/>{braid(S, band)}{glyph(S, 0.66, (S - band) / 2)}</svg>'
# Adaptive foreground: 108dp canvas, launchers show roughly the middle 72dp and
# may cut it to a circle, so the glyph stays well inside (about 46% of the width).
fg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{S}" height="{S}">{glyph(S, 0.46, S / 2)}</svg>'
mark = f'<svg xmlns="http://www.w3.org/2000/svg" width="{S}" height="{S}"><rect width="{S}" height="{S}" fill="{RED}"/>{glyph(S, 0.70, S / 2)}</svg>'

os.makedirs(out, exist_ok=True)
render(full, 1024).save(os.path.join(out, 'icon_app.png'), optimize=True)
render(fg, 1024, alpha=True).save(os.path.join(out, 'icon_fg.png'), optimize=True)
render(mark, 512).save(os.path.join(out, 'logo.png'), optimize=True)
print('ok')
