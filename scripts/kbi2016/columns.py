"""Re-read the Kamus Bali-Indonesia 2016 text layer column by column.

The OCR text layer is fine word-by-word, but its reading order interleaves the
two columns. Using word boxes, split each page at its column gutter and emit
left column lines, then right column lines.
usage: python columns.py <pdf> <out.txt> [first] [last]
"""
import sys
import fitz  # PyMuPDF

pdf, out = sys.argv[1], sys.argv[2]
doc = fitz.open(pdf)
first = int(sys.argv[3]) if len(sys.argv) > 3 else 1
last = int(sys.argv[4]) if len(sys.argv) > 4 else doc.page_count

with open(out, 'w', encoding='utf-8') as f:
    for pno in range(first - 1, last):
        page = doc[pno]
        words = page.get_text('words')  # x0, y0, x1, y1, text, block, line, wordno
        if not words:
            continue
        mid = page.rect.width / 2
        cols = [[], []]
        for w in words:
            cx = (w[0] + w[2]) / 2
            cols[0 if cx < mid else 1].append(w)
        f.write(f'\n=== page {pno + 1}\n')
        for col in cols:
            # group into lines by y centre
            col.sort(key=lambda w: ((w[1] + w[3]) / 2, w[0]))
            lines, cur, cy = [], [], None
            for w in col:
                y = (w[1] + w[3]) / 2
                if cy is None or abs(y - cy) <= 3.5:
                    cur.append(w)
                    cy = y if cy is None else (cy + y) / 2
                else:
                    lines.append(cur); cur = [w]; cy = y
            if cur:
                lines.append(cur)
            for ln in lines:
                ln.sort(key=lambda w: w[0])
                x0 = ln[0][0]
                text = ' '.join(w[4] for w in ln)
                f.write(f'{round(x0)}\t{text}\n')
print('pages', doc.page_count)
