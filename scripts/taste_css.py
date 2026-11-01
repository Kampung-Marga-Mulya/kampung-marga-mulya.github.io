# Sekali pakai: menyesuaikan style.css dengan aturan taste-skill
# (tanpa bayangan diam, gradien, kaca, garis tipis, label kapital kecil, sudut membulat lembut).
import re, sys

SRC = sys.argv[1]
css = open(SRC, encoding="utf-8").read()

# ---------- 1. pecah menjadi blok tingkat atas ----------
def blocks(text):
    out, i, n = [], 0, len(text)
    while i < n:
        j = text.find("{", i)
        if j == -1:
            out.append(("raw", text[i:], None)); break
        sel = text[i:j]
        depth, k = 1, j + 1
        while k < n and depth:
            if text[k] == "{": depth += 1
            elif text[k] == "}": depth -= 1
            k += 1
        out.append(("rule", sel, text[j + 1:k - 1]))
        i = k
    return out

DROP = re.compile(r"^\s*(?:#v-beranda|\.hero|\.collab|\.facts?(?:\b|__)|\.quick|\.explore|\.xcard|\.foot|\.news|\.ncard|\.social--foot)")

def keep_sel(sel):
    parts = [p.strip() for p in sel.split(",")]
    # buang aturan bila SEMUA pemilihnya milik komponen lama beranda/footer
    return not all(DROP.match(p) for p in parts if p)

def render(bl):
    res = []
    for kind, sel, body in bl:
        if kind == "raw":
            res.append(sel); continue
        s = sel.strip()
        if s.startswith("@media") or s.startswith("@supports"):
            inner = render([b for b in blocks(body) if b[0] == "raw" or keep_sel(b[1])])
            if re.search(r"\{", inner):
                res.append(sel + "{" + inner + "}")
            else:
                res.append(re.sub(r"\S.*$", "", sel, flags=re.S))
        else:
            # komentar di depan pemilih ikut terbawa di 'sel'
            m = re.match(r"(\s*(?:/\*.*?\*/\s*)*)(.*)", sel, re.S)
            lead, real = m.group(1), m.group(2)
            if keep_sel(real):
                res.append(sel + "{" + body + "}")
            else:
                res.append(lead)
    return "".join(res)

css = render(blocks(css))

# ---------- 2. aturan per deklarasi ----------
FLOAT = re.compile(r"\.modal\b|\.toast\b|\.draftnote\b|\.mk\b|\.mk--|\.pin__dot|\.map__north|\.map__tag|\.leaflet")

def fix_rule(m):
    sel, body = m.group(1), m.group(2)
    floating = bool(FLOAT.search(sel))
    is_table = bool(re.search(r"\btbl\b|\btable\b|\bth\b|\btd\b|\btr\b|tablewrap|input|select|textarea|\.kal\b", sel))
    b = body
    # bayangan: hanya untuk yang mengambang
    if floating:
        b = re.sub(r"(box-shadow:[^;}]+;?)", r"\1 /* taste-skill-ignore */", b)
    else:
        b = re.sub(r"\s*box-shadow:[^;}]+;?", "", b)
    # kaca
    if ".topbar" not in sel:
        b = re.sub(r"\s*-webkit-backdrop-filter:[^;}]+;?", "", b)
        b = re.sub(r"\s*backdrop-filter:[^;}]+;?", "", b)
    # gradien
    b = re.sub(r"background:\s*repeating-linear-gradient\([^;}]*\)", "background: var(--soft)", b)
    b = re.sub(r"background:\s*linear-gradient\([^;}]*\)", "background: var(--blue)", b)
    # bayangan teks: hanya label peta (halo agar terbaca di atas citra)
    if "tetangga" in sel:
        b = re.sub(r"(text-shadow:[^;}]+;?)", r"\1 /* taste-skill-ignore */", b)
    else:
        b = re.sub(r"\s*text-shadow:[^;}]+;?", "", b)
    # label kapital kecil berjarak
    b = re.sub(r"\s*letter-spacing:\s*\.\d+em;?", "", b)
    b = re.sub(r"\s*text-transform:\s*uppercase;?", "", b)
    # garis putus-putus
    b = re.sub(r"border(-style)?:\s*1px dashed [^;}]+", "border: 0", b)
    b = re.sub(r"border-style:\s*dashed;?", "", b)
    # kotak bergaris 1px -> bidang berisi satu langkah nada
    if not is_table and not floating:
        if re.search(r"border:\s*1px solid var\(--line\)", b):
            b = re.sub(r"border:\s*1px solid var\(--line\)", "border: 0", b)
            if re.search(r"background:\s*(#fff|#ffffff|#FFFFFF|white)\b", b):
                b = re.sub(r"background:\s*(#fff|#ffffff|#FFFFFF|white)\b", "background: var(--soft)", b)
            elif "background" not in b:
                b = b.rstrip().rstrip(";") + "; background: var(--soft)"
        b = re.sub(r"\s*border-(top|bottom|left|right):\s*1px solid [^;}]+;?", "", b)
        b = re.sub(r"border:\s*1px solid rgba\([^)]*\)", "border: 0", b)
        b = re.sub(r"border:\s*1\.5px solid", "border: 2px solid", b)
    # sudut: satu radius untuk semuanya (persegi); lingkaran dan pin tetap
    b = re.sub(r"border-radius:\s*(\d+(?:\.\d+)?)px(\s+\d+px)*", "border-radius: 0", b)
    # tidak ada huruf di bawah 13px
    def fs(mm):
        v = float(mm.group(1))
        return "font-size: .8125rem" if v < 0.8125 else mm.group(0)
    b = re.sub(r"font-size:\s*(\d*\.\d+)rem", fs, b)
    b = re.sub(r"font:\s*(\d{3})\s+(\.\d+)rem", lambda mm: "font: %s %srem" % (mm.group(1), ".8125" if float(mm.group(2)) < .8125 else mm.group(2)), b)
    # hover yang mengangkat kartu -> perubahan nada
    if ":hover" in sel:
        b = re.sub(r"\s*transform:\s*translateY\(-?\d+px\);?", "", b)
        b = re.sub(r"border-color:\s*var\(--blue-mid\);?", "background-color: var(--blue-pale);", b)
    b = re.sub(r";\s*;", ";", b)
    return sel + "{" + b + "}"

css = re.sub(r"([^{}]+)\{([^{}]*)\}", fix_rule, css)
open(SRC, "w", encoding="utf-8").write(css)
print("ok", len(css))
