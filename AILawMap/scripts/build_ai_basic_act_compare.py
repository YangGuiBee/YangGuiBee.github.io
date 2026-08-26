# -*- coding: utf-8 -*-
"""
인공지능기본법 ↔ 시행령 비교 페이지(laws/ai-basic-act-compare.html)를 생성한다.

절차구조도(wf-grid)의 주체×게이트 셀 안에 이미 인코딩된 위임 관계(같은 셀에
있는 P-node/D-node)를 그대로 매칭 기준으로 쓴다. 원문은 ai-basic-act.html의
ARTICLES(법률)/LEGAL_BASIS, ai-basic-act-decree.html의 DECREE_ARTICLES(시행령
전문)를 그대로 가져다 쓴다 — 새로 짓지 않는다(무-지어내기 원칙).

일회성 생성 스크립트다: 조문 원문이 바뀌면(개정 등) 재실행해서 다시 만든다.
"""
import json
import re
import subprocess
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
LAWS_DIR = ROOT / "laws"
SCRIPTS_DIR = ROOT / "scripts"


def load_js_object(law_file, var_name):
    result = subprocess.run(
        ["node", str(SCRIPTS_DIR / "extract_js_object.js"), str(law_file), var_name],
        capture_output=True, text=True, check=True, encoding="utf-8",
    )
    return json.loads(result.stdout)


BASE_ARTICLES = load_js_object(LAWS_DIR / "ai-basic-act.html", "ARTICLES")
LEGAL_BASIS = load_js_object(LAWS_DIR / "ai-basic-act.html", "LEGAL_BASIS")
DECREE_ARTICLES = load_js_object(LAWS_DIR / "ai-basic-act-decree.html", "DECREE_ARTICLES")
DECREE_LEGAL_BASIS_SHORT = load_js_object(LAWS_DIR / "ai-basic-act.html", "DECREE_LEGAL_BASIS_SHORT")


def esc(s):
    return (
        str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")
    )


def parse_article_keys(citation):
    m = re.match(r"^제([\d·]+)조(?:의(\d+))?", citation)
    if not m:
        return []
    nums = m.group(1).split("·")
    suffix = m.group(2)
    if suffix and len(nums) == 1:
        return [nums[0] + "_" + suffix]
    return nums


def render_full_text(article_key, articles_db):
    art = articles_db.get(article_key)
    if not art:
        return '<p class="cmp-missing">원문 데이터가 아직 없습니다. law.go.kr에서 확인해 주세요.</p>'
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
        parts.append(f'<p class="cmp-para">{p["text"]}</p>{items_html}')
    return "".join(parts)


def base_node_html(pcode, node_text):
    basis = LEGAL_BASIS.get(pcode, [])
    if not basis:
        return f'<p class="cmp-missing">법적 근거 데이터가 없습니다.</p>'
    blocks = []
    for b in basis:
        for key in parse_article_keys(b["article"]) or [None]:
            title = BASE_ARTICLES.get(key, {}).get("title", "") if key else ""
            title_html = f" ({esc(title)})" if title else ""
            body = render_full_text(key, BASE_ARTICLES) if key else '<p class="cmp-missing">조문 번호를 해석하지 못했습니다.</p>'
            blocks.append(
                f'<div class="cmp-article"><div class="cmp-article-head">인공지능기본법 {esc(b["article"])}{title_html}</div>{body}</div>'
            )
    return "".join(blocks)


def decree_node_html(pcode):
    basis = DECREE_LEGAL_BASIS_SHORT.get(pcode)
    if not basis:
        return '<p class="cmp-missing">법적 근거 데이터가 없습니다.</p>'
    blocks = []
    keys = parse_article_keys(basis["article"]) or [None]
    for key in keys:
        title = DECREE_ARTICLES.get(key, {}).get("title", "") if key else ""
        title_html = f" ({esc(title)})" if title else ""
        body = render_full_text(key, DECREE_ARTICLES) if key else '<p class="cmp-missing">조문 번호를 해석하지 못했습니다.</p>'
        blocks.append(
            f'<div class="cmp-article"><div class="cmp-article-head">인공지능기본법 시행령 {esc(basis["article"])}{title_html}</div>{body}</div>'
        )
    return "".join(blocks)


def parse_grid():
    html = (LAWS_DIR / "ai-basic-act.html").read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "html.parser")
    grid = soup.select_one(".wf-grid")
    children = [c for c in grid.find_all(recursive=False)]

    gate_heads = [c for c in children if "wf-gate-head" in c.get("class", [])]
    gates = []
    for g in gate_heads:
        title = g.select_one(".wf-lane-title").get_text(strip=True)
        sub = g.select_one(".wf-lane-sub").get_text(strip=True)
        gates.append(f"{title} {sub}")

    rest = children[1 + len(gate_heads):]  # skip corner-head + gate-heads
    rows = []
    i = 0
    while i < len(rest):
        subject = rest[i].get_text(strip=True)
        cells = rest[i + 1: i + 1 + len(gates)]
        row_cells = []
        for cell in cells:
            p_nodes, d_nodes = [], []
            for node in cell.select(".wf-node"):
                pcode = node.select_one(".pcode").get_text(strip=True)
                t_el = node.select_one(".t")
                text = t_el.get_text(strip=True) if t_el else ""
                if "dec-node" in node.get("class", []):
                    d_nodes.append((pcode, text))
                else:
                    p_nodes.append((pcode, text))
            row_cells.append((p_nodes, d_nodes))
        rows.append((subject, row_cells))
        i += 1 + len(gates)

    return gates, rows


def build_comparison_html(gates, rows):
    out = []
    for subject, cells in rows:
        cell_blocks = []
        for gate_idx, (p_nodes, d_nodes) in enumerate(cells):
            if not p_nodes and not d_nodes:
                continue
            left = "".join(base_node_html(pc, t) for pc, t in p_nodes) or '<p class="cmp-empty">해당 없음</p>'
            right = "".join(decree_node_html(pc) for pc, t in d_nodes) or '<p class="cmp-empty">해당 없음</p>'
            gate_label = esc(gates[gate_idx])
            cell_blocks.append(
                f'<div class="cmp-row"><div class="cmp-gate-tag">{gate_label}</div>'
                f'<div class="cmp-col cmp-col-law">{left}</div>'
                f'<div class="cmp-col cmp-col-decree">{right}</div></div>'
            )
        if not cell_blocks:
            continue
        out.append(f'<h3 class="cmp-subject">{esc(subject)}</h3>' + "".join(cell_blocks))
    return "".join(out)


PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>인공지능기본법 · 시행령 비교 · LawMap</title>
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
    <h1><a class="law-sibling" href="ai-basic-act.html">인공지능기본법</a><span class="law-sep">&gt;</span><span class="law-current">시행령 비교</span></h1>
    <p class="lead">
      절차구조도의 주체·단계(G0~G6)별로, 인공지능기본법 조문과 그 조문이 위임한 시행령 조문을
      나란히 놓고 원문 전체를 비교합니다. 왼쪽은 법률, 오른쪽은 시행령입니다.
    </p>
  </div>
</section>

<section class="block">
  <div class="wrap cmp-wrap">
{BODY}
  </div>
</section>

<footer class="site-footer">
  <div class="wrap">
    <p class="footer-disclaimer">이 페이지는 법령 이해를 돕기 위한 학습·연구 참고 자료이며, 법률 자문이나 정부기관의 공식 해석을 대신하지 않습니다. 법률·시행령의 조문 매칭은 절차구조도 편집 관점에 따른 것이며 법령상 공식 대응표가 아닙니다.</p>
    인공지능기본법 · 시행령 비교 페이지 · 원문은 <a href="ai-basic-act.html" style="color:var(--blue)">인공지능기본법</a>,
    <a href="ai-basic-act-decree.html" style="color:var(--blue)">인공지능기본법 시행령</a> 각 페이지 데이터를 그대로 사용
  </div>
</footer>

</body>
</html>
"""


def main():
    gates, rows = parse_grid()
    body = build_comparison_html(gates, rows)
    html = PAGE_TEMPLATE.replace("{BODY}", body)
    out_path = LAWS_DIR / "ai-basic-act-compare.html"
    out_path.write_text(html, encoding="utf-8")
    print("written:", out_path, "-", len(html), "chars")


if __name__ == "__main__":
    main()
