"""Render the Hungry Paws pet hotel reel (1080x1920, 30fps, ~14.5s).

Usage (from repo root):
    python3 reels/pet-hotel-promo/music.py /tmp/music.wav
    python3 reels/pet-hotel-promo/render.py /tmp/music.wav reels/pet-hotel-promo/hungry-paws-pet-hotel-reel.mp4
"""
import math
import os
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "..", "..", "assets")
W, H, FPS = 1080, 1920, 30
DUR = 14.5

PINK = (212, 79, 126)
PINK_DARK = (168, 46, 92)
BLUE = (11, 111, 196)
WHITE = (255, 255, 255)

BOLD = os.path.join(HERE, "fonts", "Fredoka-Bold.ttf")
SEMI = os.path.join(HERE, "fonts", "Fredoka-SemiBold.ttf")


def font(path, size):
    return ImageFont.truetype(path, size)


def ease_out_cubic(x):
    x = max(0.0, min(1.0, x))
    return 1 - (1 - x) ** 3


def ease_out_back(x):
    x = max(0.0, min(1.0, x))
    c1, c3 = 1.70158, 2.70158
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2


def ease_in_out(x):
    x = max(0.0, min(1.0, x))
    return 0.5 - 0.5 * math.cos(math.pi * x)


# ---------- reusable graphic pieces ----------

def outlined_text(text, size, fill=WHITE, stroke=BLUE, stroke_w=10, path=BOLD, shadow=True):
    f = font(path, size)
    l, t, r, b = f.getbbox(text, stroke_width=stroke_w)
    pad = 24
    img = Image.new("RGBA", (r - l + pad * 2, b - t + pad * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    pos = (pad - l, pad - t)
    if shadow:
        sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
        ImageDraw.Draw(sh).text((pos[0], pos[1] + 8), text, font=f, fill=(0, 0, 0, 110),
                                stroke_width=stroke_w, stroke_fill=(0, 0, 0, 110))
        img = Image.alpha_composite(img, sh.filter(ImageFilter.GaussianBlur(6)))
        d = ImageDraw.Draw(img)
    d.text(pos, text, font=f, fill=fill, stroke_width=stroke_w, stroke_fill=stroke)
    return img


def pill(text, size, bg=PINK, fg=WHITE, path=BOLD, pad_x=44, pad_y=22, icon=None):
    f = font(path, size)
    l, t, r, b = f.getbbox(text)
    tw, th = r - l, b - t
    icon_w = int(size * 0.9) + 18 if icon else 0
    w, h = tw + pad_x * 2 + icon_w, th + pad_y * 2
    img = Image.new("RGBA", (w + 20, h + 20), (0, 0, 0, 0))
    sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle((10, 16, w + 10, h + 16), radius=h // 2, fill=(0, 0, 0, 90))
    img = Image.alpha_composite(img, sh.filter(ImageFilter.GaussianBlur(7)))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((10, 10, w + 10, h + 10), radius=h // 2, fill=bg)
    x = 10 + pad_x
    if icon == "phone":
        draw_phone(d, x, 10 + h // 2, int(size * 0.9), fg)
        x += icon_w
    d.text((x - l, 10 + pad_y - t), text, font=f, fill=fg)
    return img


def draw_phone(d, x, cy, s, color):
    # simple handset glyph
    w = s * 0.55
    d.rounded_rectangle((x + s * 0.2, cy - s / 2, x + s * 0.2 + w, cy + s / 2), radius=int(s * 0.12), fill=color)
    d.rounded_rectangle((x + s * 0.28, cy - s / 2 + s * 0.14, x + s * 0.12 + w, cy + s / 2 - s * 0.2),
                        radius=3, fill=WHITE if color != WHITE else BLUE)


def draw_pin(size, color):
    img = Image.new("RGBA", (size, int(size * 1.3)), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse((0, 0, size, size), fill=color)
    d.polygon([(size * 0.12, size * 0.7), (size * 0.88, size * 0.7), (size / 2, size * 1.3)], fill=color)
    r = size * 0.2
    d.ellipse((size / 2 - r, size / 2 - r, size / 2 + r, size / 2 + r), fill=PINK)
    return img


def paw(d, cx, cy, s, color):
    d.ellipse((cx - s * 0.5, cy - s * 0.15, cx + s * 0.5, cy + s * 0.6), fill=color)
    for dx, dy in ((-0.55, -0.35), (-0.2, -0.65), (0.2, -0.65), (0.55, -0.35)):
        r = s * 0.17
        d.ellipse((cx + dx * s - r, cy + dy * s - r * 1.2, cx + dx * s + r, cy + dy * s + r * 1.2), fill=color)


def round_logo(size):
    logo = Image.open(os.path.join(ASSETS, "logo.jpg")).convert("RGB")
    # the pink disc sits at centre (750,750), radius ~716 in the 1500px source
    disc = logo.crop((34, 34, 1466, 1466)).resize((size, size), Image.LANCZOS)
    mask = Image.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=255)
    mask = mask.resize((size, size), Image.LANCZOS)
    ring = int(size * 0.035)
    out = Image.new("RGBA", (size + ring * 2 + 30, size + ring * 2 + 30), (0, 0, 0, 0))
    sh = Image.new("RGBA", out.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).ellipse((15, 25, 15 + size + ring * 2, 25 + size + ring * 2), fill=(0, 0, 0, 120))
    out = Image.alpha_composite(out, sh.filter(ImageFilter.GaussianBlur(10)))
    ImageDraw.Draw(out).ellipse((15, 15, 15 + size + ring * 2, 15 + size + ring * 2), fill=WHITE)
    out.paste(disc, (15 + ring, 15 + ring), mask)
    return out


def scaled(img, s):
    if abs(s - 1) < 1e-3:
        return img
    w, h = max(1, int(img.width * s)), max(1, int(img.height * s))
    return img.resize((w, h), Image.BICUBIC)


def with_alpha(img, a):
    if a >= 0.999:
        return img
    r, g, b, al = img.split()
    al = al.point(lambda v: int(v * a))
    return Image.merge("RGBA", (r, g, b, al))


def place(canvas, img, cx, cy, alpha=1.0, scale=1.0):
    if alpha <= 0.001:
        return
    im = with_alpha(scaled(img, scale), alpha)
    canvas.alpha_composite(im, (int(cx - im.width / 2), int(cy - im.height / 2)))


def place_left(canvas, img, x, cy, alpha=1.0, dy=0.0):
    if alpha <= 0.001:
        return
    im = with_alpha(img, alpha)
    canvas.alpha_composite(im, (int(x), int(cy - im.height / 2 + dy)))


# ---------- photo scenes ----------

class Photo:
    def __init__(self, name, cx0, cx1, z0, z1, cy=0.5):
        self.img = Image.open(os.path.join(ASSETS, name)).convert("RGB")
        self.cx0, self.cx1, self.z0, self.z1, self.cy = cx0, cx1, z0, z1, cy

    def frame(self, p):
        iw, ih = self.img.size
        e = ease_in_out(p)
        z = self.z0 + (self.z1 - self.z0) * e
        ch = ih / z
        cw = ch * W / H
        cx = self.cx0 + (self.cx1 - self.cx0) * e
        cx = min(max(cx, cw / 2), iw - cw / 2)
        cy = min(max(ih * self.cy, ch / 2), ih - ch / 2)
        box = (cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2)
        return self.img.resize((W, H), Image.BICUBIC, box=box).convert("RGBA")


def gradient_overlay():
    g = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    px = g.load()
    for y in range(H):
        a = 0
        if y > H * 0.48:
            a = int(175 * ((y - H * 0.48) / (H * 0.52)) ** 1.2)
        elif y < 330:
            a = int(90 * (1 - y / 330))
        for x in range(W):
            px[x, y] = (20, 10, 30, a)
    return g


GRAD = gradient_overlay()
LOGO_BADGE = round_logo(150)

# scene timings (seconds)
SCENES = [
    # photo, start, end
    (Photo("grooming-room.jpg", 1350, 450, 1.02, 1.26, cy=0.48), 0.0, 3.0),
    (Photo("reception.jpg", 1260, 1260, 1.18, 1.0), 3.0, 5.6),
    (Photo("pet-hotel.jpg", 1480, 1530, 1.0, 1.15, cy=0.45), 5.6, 8.2),
    (Photo("grooming-tools.jpg", 1000, 900, 1.15, 1.02), 8.2, 10.4),
]
END_START = 10.4
XFADE = 0.25

# text per scene: list of (image, start offset, kind)
TEXT_X = 70
scene_text = [
    [
        (outlined_text("Going out", 128), 0.15, 560),
        (outlined_text("of town?", 128), 0.30, 705),
        (pill("We'll watch your fur baby", 50), 0.75, 850),
    ],
    [
        (pill("PET HOTEL & BOARDING", 60, bg=BLUE), 0.10, 1240),
        (outlined_text("Cozy, clean", 112), 0.30, 1380),
        (outlined_text("suites", 112), 0.45, 1510),
    ],
    [
        (pill("PET DAY CARE", 60, bg=BLUE), 0.10, 1240),
        (outlined_text("Play, love &", 112), 0.30, 1380),
        (outlined_text("cuddles all day", 112), 0.45, 1510),
    ],
    [
        (outlined_text("Caring hands,", 112), 0.10, 1300),
        (outlined_text("happy tails", 112, stroke=PINK), 0.28, 1435),
    ],
]


def render_photo_scene(i, t):
    photo, s, e = SCENES[i]
    p = (t - s) / (e - s)
    frame = photo.frame(p)
    frame.alpha_composite(GRAD)
    local = t - s
    for img, t0, cy in scene_text[i]:
        a = ease_out_cubic((local - t0) / 0.35)
        dy = (1 - a) * 60
        # fade text out just before cut
        out = 1 - ease_out_cubic((local - (e - s - 0.2)) / 0.2)
        place_left(frame, img, TEXT_X, cy, alpha=a * out, dy=dy)
    frame.alpha_composite(LOGO_BADGE, (W - LOGO_BADGE.width - 40, 70))
    return frame


# ---------- end card ----------

def end_background():
    bg = Image.new("RGBA", (W, H), PINK + (255,))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse((-200, 200, W + 200, 1300), fill=(240, 120, 160, 160))
    bg = Image.alpha_composite(bg, glow.filter(ImageFilter.GaussianBlur(160)))
    paws = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(paws)
    for cx, cy, s in [(120, 260, 70), (960, 360, 55), (80, 1120, 60), (1000, 1060, 75),
                      (160, 1750, 65), (930, 1780, 60), (540, 160, 45), (520, 1860, 40)]:
        paw(d, cx, cy, s, (255, 255, 255, 38))
    bg = Image.alpha_composite(bg, paws)
    bottom = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(bottom).rectangle((0, 1560, W, H), fill=PINK_DARK + (255,))
    return Image.alpha_composite(bg, bottom.filter(ImageFilter.GaussianBlur(40)))


END_BG = end_background()
BIG_LOGO = round_logo(520)
SERVICES = outlined_text("PET DAY CARE  •  PET HOTEL & BOARDING", 46, stroke=PINK_DARK, stroke_w=0, path=SEMI)
HEAD1 = outlined_text("Book your fur baby's", 88)
HEAD2 = outlined_text("stay today!", 88)
PHONE = pill("0976 436 6128", 74, bg=WHITE, fg=BLUE, icon="phone", pad_x=50, pad_y=26)
CALL_LABEL = outlined_text("CALL OR TEXT", 36, stroke_w=0, path=SEMI, shadow=False)


def address_block():
    f = font(SEMI, 38)
    lines = ["2nd Floor, Dian Plaza, 1805 Dian cor", "Enrique St, Palanan, Makati"]
    pin = draw_pin(40, WHITE)
    lh = 52
    widths = [f.getbbox(t)[2] for t in lines]
    w = max(widths) + 70
    img = Image.new("RGBA", (w, lh * 2 + 20), (0, 0, 0, 0))
    img.alpha_composite(pin, (0, 12))
    d = ImageDraw.Draw(img)
    for k, t in enumerate(lines):
        d.text((70, 6 + k * lh), t, font=f, fill=WHITE)
    return img


ADDRESS = address_block()


def render_end(t):
    local = t - END_START
    frame = END_BG.copy()
    s = ease_out_back(local / 0.55)
    # gentle float after it lands
    bob = math.sin(max(0, local - 0.6) * 2.4) * 8
    place(frame, BIG_LOGO, W / 2, 560 + bob, alpha=min(1, local / 0.2), scale=max(0.01, s))
    items = [
        (SERVICES, 0.45, 905),
        (HEAD1, 0.65, 1020),
        (HEAD2, 0.80, 1125),
        (CALL_LABEL, 1.05, 1255),
        (PHONE, 1.10, 1345),
        (ADDRESS, 1.35, 1490),
    ]
    for img, t0, cy in items:
        a = ease_out_cubic((local - t0) / 0.35)
        sc = 0.85 + 0.15 * ease_out_back((local - t0) / 0.4)
        if img is PHONE and local > 1.8:
            sc *= 1 + 0.035 * math.sin((local - 1.8) * 6)  # pulse the CTA
        place(frame, img, W / 2, cy + (1 - a) * 40, alpha=a, scale=sc)
    return frame


def render(t):
    if t >= END_START:
        frame = render_end(t)
        if t < END_START + XFADE:
            prev = render_photo_scene(len(SCENES) - 1, min(t, SCENES[-1][2] - 1e-3))
            frame = Image.blend(prev, frame, (t - END_START) / XFADE)
        return frame
    for i, (_, s, e) in enumerate(SCENES):
        if s <= t < e:
            frame = render_photo_scene(i, t)
            if i > 0 and t < s + XFADE:
                prev = render_photo_scene(i - 1, SCENES[i - 1][2] - 1e-3)
                # quick white flash-blend for a punchy cut
                k = (t - s) / XFADE
                flash = Image.new("RGBA", (W, H), (255, 255, 255, 255))
                mid = Image.blend(prev, flash, 0.35 * (1 - abs(2 * k - 1)))
                frame = Image.blend(mid, frame, ease_out_cubic(k))
            return frame
    raise ValueError(t)


def main():
    music, out = sys.argv[1], sys.argv[2]
    n = int(DUR * FPS)
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-i", music,
        "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
        "-profile:v", "high", "-c:a", "aac", "-b:a", "192k", "-shortest",
        "-movflags", "+faststart", out,
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    cover_path = os.path.splitext(out)[0] + "-cover.jpg"
    for k in range(n):
        t = k / FPS
        frame = render(t).convert("RGB")
        if k == int(13.0 * FPS):
            frame.save(cover_path, quality=92)
        proc.stdin.write(frame.tobytes())
    proc.stdin.close()
    proc.wait()


if __name__ == "__main__":
    if len(sys.argv) == 4 and sys.argv[1] == "--still":
        render(float(sys.argv[2])).convert("RGB").save(sys.argv[3])
    else:
        main()
