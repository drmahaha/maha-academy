#!/usr/bin/env python3
"""
يجمع اللعبة في ملف HTML واحد يعمل دون إنترنت (الخطوط والصور والسكربتات مضمّنة).
التشغيل من داخل هذا المجلد:  python3 build.py
الناتج: ../Grade8_Islamic_Platformer.html
"""
import base64, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "Grade8_Islamic_Platformer.html")
MIME = {".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2"}

def data_uri(path):
    ext = os.path.splitext(path)[1].lower()
    with open(path, "rb") as f:
        return "data:%s;base64,%s" % (MIME[ext], base64.b64encode(f.read()).decode())

def read(rel):
    with open(os.path.join(HERE, rel), encoding="utf-8") as f:
        return f.read()

def inline_assets(text):
    # كل مسار assets/... داخل النصوص يُستبدل بنسخة مضمّنة
    def rep(m):
        rel = m.group(2)
        p = os.path.join(HERE, rel)
        return m.group(1) + data_uri(p) if os.path.exists(p) else m.group(0)
    return re.sub(r'((?:\.\./)?)(assets/[A-Za-z0-9_\-/]+\.(?:webp|png|jpg|woff2))', lambda m: data_uri(os.path.join(HERE, m.group(2))) if os.path.exists(os.path.join(HERE, m.group(2))) else m.group(0), text)

html = read("index.html")
css = inline_assets(read("css/style.css"))
html = html.replace('<link rel="stylesheet" href="css/style.css">', "<style>\n" + css + "\n</style>")

def script_rep(m):
    js = inline_assets(read(m.group(1)))
    js = js.replace("</script", "<\\/script")
    return "<script>/* " + m.group(1) + " */\n" + js + "\n</script>"
html = re.sub(r'<script src="([^"]+)"></script>', script_rep, html)
html = inline_assets(html)

with open(OUT, "w", encoding="utf-8") as f:
    f.write(html)
left = re.findall(r'(?:src|href)="(?!data:|#|\.\./\.\./)([^"]+)"', html)
print("✔ تم البناء:", os.path.normpath(OUT), "(%d KB)" % (os.path.getsize(OUT) // 1024))
if left:
    print("⚠ روابط خارجية متبقية:", left); sys.exit(1)
