# -*- coding: utf-8 -*-
"""
laws/ai-basic-act-vs-industrial-digital-transformation-act.html을 생성한다.

산업 디지털 전환 및 인공지능 활용 촉진법 제2조3의2호가 인공지능기본법 제2조제1호의
"인공지능" 정의를 그대로 인용하는 것 하나만 근거로 삼은 인용관계 비교 페이지
(무-지어내기 원칙 — 그 밖의 "인공지능" 단어가 들어간 조문은 이 법 자체 개념일 뿐
인공지능기본법 인용이 아니므로 포함하지 않음).
"""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LAWS_DIR = ROOT / "laws"


def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def load_js_object(law_file, var_name="ARTICLES"):
    result = subprocess.run(
        ["node", str(ROOT / "scripts" / "extract_js_object.js"), str(law_file), var_name],
        capture_output=True, text=True, check=True, encoding="utf-8",
    )
    return json.loads(result.stdout)


def render_full_text(art):
    parts = []
    for p in art["paras"]:
        items_html = ""
        if p.get("items"):
            lis = []
            for it in p["items"]:
                if isinstance(it, str):
                    lis.append(f"<li>{it}</li>")
                else:
                    sub_html = ""
                    if it.get("sub"):
                        sub_html = "<ul class='cmp-subitems'>" + "".join(f"<li>{s}</li>" for s in it["sub"]) + "</ul>"
                    lis.append(f"<li>{it['text']}{sub_html}</li>")
            items_html = "<ul class='cmp-items'>" + "".join(lis) + "</ul>"
        text = p["text"]
        parts.append(f'<p class="cmp-para">{text}</p>{items_html}' if text else items_html)
    return "".join(parts)


def filtered_paras(art, only_item_prefix):
    out = []
    for p in art["paras"]:
        items = [it for it in p.get("items", [])
                 if (it if isinstance(it, str) else it["text"]).startswith(only_item_prefix + ".")]
        if items:
            out.append({**p, "items": items})
    return out


def main():
    ai_articles = load_js_object(LAWS_DIR / "ai-basic-act.html")
    sdc_articles = load_js_object(LAWS_DIR / "industrial-digital-transformation-act.html")

    base_paras = filtered_paras(ai_articles["2"], "1")
    target_paras = filtered_paras(sdc_articles["2"], "3의2")

    left = render_full_text({"paras": base_paras})
    right = render_full_text({"paras": target_paras})

    body = (
        '<div class="cmp-row"><div class="cmp-gate-tag">제2조1호 · 제2조3의2호 — "인공지능" 정의 인용</div>'
        '<div class="cmp-col cmp-col-law"><div class="cmp-article">'
        '<div class="cmp-article-head">인공지능기본법 제2조1호 (정의)</div>' + left + '</div></div>'
        '<div class="cmp-col cmp-col-decree"><div class="cmp-article">'
        '<div class="cmp-article-head">산업 디지털 전환 및 인공지능 활용 촉진법 제2조3의2호 (정의)</div>' + right + '</div></div>'
        '</div>'
    )

    page = f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>산업 디지털 전환 및 인공지능 활용 촉진법 비교 · LawMap</title>
<link rel="stylesheet" href="../assets/style.css">
</head>
<body>

<header class="site-header">
  <div class="wrap">
    <a class="brand" href="../index.html">AI 관련 법 지도</a>
    <nav class="site-nav">
      <a href="ai-basic-act.html">인공지능기본법</a>
      <a href="https://www.law.go.kr/LSW/main.html" target="_blank" rel="noopener" class="lawgokr-link">국가법령정보시스템</a>
    </nav>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <h1><a class="law-sibling" href="ai-basic-act.html">인공지능기본법</a><span class="law-sep">&gt;</span><span class="law-current">산업 디지털 전환 및 인공지능 활용 촉진법 비교</span></h1>
    <p class="lead">산업 디지털 전환 및 인공지능 활용 촉진법이 "인공지능"을 정의하며 이름과 조항을 직접 인용하는 인공지능기본법 조문을 짝지었습니다. 이 법의 다른 조문에 나오는 "인공지능"이라는 단어는 이 법 자체의 개념(산업인공지능 등)이지 인공지능기본법 인용이 아니므로 포함하지 않았습니다.</p>
  </div>
</section>

<section class="block">
  <div class="wrap cmp-wrap">
{body}
  </div>
</section>

<footer class="site-footer">
  <div class="wrap">
    <p class="footer-disclaimer">이 페이지는 법령 이해를 돕기 위한 학습·연구 참고 자료이며, 법률 자문이나 정부기관의 공식 해석을 대신하지 않습니다. 조문 매칭은 산업 디지털 전환 및 인공지능 활용 촉진법 조문 안의 실제 인용 문구를 근거로 했으며 법령상 공식 대응표가 아닙니다.</p>
    인공지능기본법 · 산업 디지털 전환 및 인공지능 활용 촉진법 비교 페이지 · 원문은 <a href="ai-basic-act.html" style="color:var(--blue)">인공지능기본법</a>,
    <a href="industrial-digital-transformation-act.html" style="color:var(--blue)">산업 디지털 전환 및 인공지능 활용 촉진법</a> 각 페이지 데이터 및 law.go.kr 원문(2026-08-27 확인) 사용
  </div>
</footer>

<!-- revision.js -->
<script src="../assets/revision.js"></script>

</body>
</html>
"""
    out_path = LAWS_DIR / "ai-basic-act-vs-industrial-digital-transformation-act.html"
    out_path.write_text(page, encoding="utf-8")
    print("written:", out_path, "-", len(page), "chars")


if __name__ == "__main__":
    main()
