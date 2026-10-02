import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

styles = read("styles.css")
assets = read("assets_data.js")
data = read("data.js")
engine = read("engine.js")
app = read("app.js")

html = html.replace("/*__STYLES__*/", styles)
html = html.replace("/*__ASSETS__*/", assets)
html = html.replace("/*__DATA__*/", data)
html = html.replace("/*__ENGINE__*/", engine)
html = html.replace("/*__APP__*/", app)

with open("maha-academy.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Built maha-academy.html:", len(html), "bytes")
