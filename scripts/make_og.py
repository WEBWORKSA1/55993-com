"""Generates assets/img/og.png (1200x630 social preview). Requires Pillow."""
import os
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
W, H = 1200, 630
im = Image.new("RGB", (W, H)); d = ImageDraw.Draw(im)
a, b, c = (79, 70, 229), (124, 58, 237), (6, 182, 212)
for x in range(W):
    t = x / W
    col = tuple(int(a[i] + (b[i] - a[i]) * t * 2) for i in range(3)) if t < .5 else tuple(int(b[i] + (c[i] - b[i]) * (t - .5) * 2) for i in range(3))
    d.line([(x, 0), (x, H)], fill=col)
def font(sz):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"]:
        try: return ImageFont.truetype(p, sz)
        except Exception: pass
    return ImageFont.load_default(size=sz)
d.text((80, 170), "55993", font=font(190), fill="white")
d.text((86, 400), "Numbers, Solved.", font=font(64), fill="white")
d.text((86, 490), "Free calculators · Number Explorer · Daily puzzles", font=font(34), fill=(230, 232, 255))
os.makedirs(os.path.join(ROOT, "assets/img"), exist_ok=True)
im.save(os.path.join(ROOT, "assets/img/og.png"), optimize=True)
print("og.png written")
