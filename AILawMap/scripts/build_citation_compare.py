# -*- coding: utf-8 -*-
"""
인공지능기본법이 조문 안에서 이름으로 직접 인용하는 다른 법(위임관계가 아닌 경우)과의
비교 페이지를 생성한다. build_ai_basic_act_compare.py(법-시행령 위임관계, wf-grid
매칭)와 달리, 이런 법들은 절차구조도에 매칭 구조가 없어서 조문 인용 지점을 직접
읽어 CONFIGS에 손으로 기록해야 한다(무-지어내기 원칙 — 확인 안 된 연관은 안 넣음).

새 법을 추가하려면:
1. `grep "그 법 이름" laws/ai-basic-act.html`로 실제 인용 지점을 찾는다.
2. 인용에 조문번호가 없으면(일반 참조) 함부로 특정 조문과 매칭하지 않는다 —
   그런 경우는 이 스크립트 대상이 아니다(관련은 있지만 "조문 비교"는 부적절).
3. 아래 CONFIGS에 새 항목을 추가하고 재실행한다.
"""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LAWS_DIR = ROOT / "laws"


def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def load_js_object(law_file, var_name):
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
        parts.append(f'<p class="cmp-para">{p["text"]}</p>{items_html}')
    return "".join(parts)


def filtered_paras(art, only_para=None, only_item_prefix=None):
    if only_para:
        return [p for p in art["paras"] if p["num"] == only_para]
    if only_item_prefix:
        out = []
        for p in art["paras"]:
            items = [it for it in p.get("items", [])
                     if (it if isinstance(it, str) else it["text"]).startswith(only_item_prefix + ".")]
            if items:
                out.append({**p, "items": items})
        return out
    return art["paras"]


PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>인공지능기본법 · {TARGET_NAME} 비교 · LawMap</title>
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
    <h1><a class="law-sibling" href="ai-basic-act.html">인공지능기본법</a><span class="law-sep">&gt;</span><span class="law-current">{TARGET_NAME} 비교</span></h1>
    <p class="lead">{LEAD}</p>
  </div>
</section>

<section class="block">
  <div class="wrap cmp-wrap">
{BODY}
  </div>
</section>

<footer class="site-footer">
  <div class="wrap">
    <p class="footer-disclaimer">이 페이지는 법령 이해를 돕기 위한 학습·연구 참고 자료이며, 법률 자문이나 정부기관의 공식 해석을 대신하지 않습니다. 조문 매칭은 인공지능기본법 조문 안의 실제 인용 문구를 근거로 했으며 법령상 공식 대응표가 아닙니다.</p>
    인공지능기본법 · {TARGET_NAME} 비교 페이지 · 원문은 <a href="ai-basic-act.html" style="color:var(--blue)">인공지능기본법</a>,
    <a href="{TARGET_HREF}" style="color:var(--blue)">{TARGET_NAME}</a> 각 페이지 데이터 사용
  </div>
</footer>

</body>
</html>
"""


def build_page(config):
    base_articles = load_js_object(LAWS_DIR / "ai-basic-act.html", "ARTICLES")
    target_articles = load_js_object(LAWS_DIR / config["target_file"], "ARTICLES")

    rows = []
    for pair in config["pairs"]:
        left_paras = filtered_paras(
            base_articles[pair["base_key"]],
            pair.get("base_only_para"),
            pair.get("base_only_item"),
        )
        left = render_full_text({"paras": left_paras})

        right_blocks = []
        for key, label, extra in pair["targets"]:
            if extra:
                art = extra  # 수동 발췌 데이터(예: 정의조 중 특정 호만)
            else:
                art = target_articles[key]
            right_blocks.append(
                f'<div class="cmp-article"><div class="cmp-article-head">{esc(label)}</div>{render_full_text(art)}</div>'
            )
        right = "".join(right_blocks)

        rows.append(
            f'<div class="cmp-row"><div class="cmp-gate-tag">{esc(pair["label"])}</div>'
            f'<div class="cmp-col cmp-col-law"><div class="cmp-article">'
            f'<div class="cmp-article-head">인공지능기본법 {esc(pair["base_cite"])}</div>{left}</div></div>'
            f'<div class="cmp-col cmp-col-decree">{right}</div></div>'
        )

    body = "".join(rows)
    html = (
        PAGE_TEMPLATE
        .replace("{TARGET_NAME}", config["target_name"])
        .replace("{TARGET_HREF}", config["target_file"])
        .replace("{LEAD}", config["lead"])
        .replace("{BODY}", body)
    )
    out_path = LAWS_DIR / config["out_file"]
    out_path.write_text(html, encoding="utf-8")
    print("written:", out_path, "-", len(html), "chars")


CONFIGS = [
    {
        "target_file": "data-industry-act.html",
        "target_name": "데이터 산업진흥 및 이용촉진에 관한 기본법",
        "out_file": "ai-basic-act-vs-data-industry-act.html",
        "lead": "인공지능기본법이 \"생성형 인공지능\"을 정의하며 인용하는 데이터 산업진흥법 조문을 짝지었습니다.",
        "pairs": [
            {
                "label": "제2조5호 — 생성형 인공지능 정의",
                "base_key": "2", "base_only_item": "5",
                "base_cite": "제2조5호",
                "targets": [("2", "데이터 산업진흥 및 이용촉진에 관한 기본법 제2조 (정의)", None)],
            },
        ],
    },
    {
        "target_file": "personal-information-protection-act.html",
        "target_name": "개인정보보호법",
        "out_file": "ai-basic-act-vs-personal-information-protection-act.html",
        "lead": (
            "개인정보보호법 자체의 절차구조도에 \"AI 관련\"으로 표시(ai-note)된 조문만 골라, "
            "그 페이지의 자체 설명(생체정보→고영향AI 판단기준 연결, 자동화된 결정 조문의 AI 명시 등)에 "
            "따라 인공지능기본법의 대응 조문과 짝지었습니다. 인공지능기본법 쪽 조문에 이 법 이름이 직접 "
            "인용되지는 않습니다."
        ),
        "pairs": [
            {
                "label": "생체정보(민감정보) — 고영향 AI 판단기준",
                "base_key": "2", "base_only_item": "4",
                "base_cite": "제2조4호 (고영향 인공지능 정의)",
                "targets": [
                    ("23", "개인정보보호법 제23조 (민감정보의 처리 제한)", None),
                    ("24", "개인정보보호법 제24조 (고유식별정보의 처리 제한)", None),
                ],
            },
            {
                "label": "자동화된 결정 — 설명요구·이의제기권",
                "base_key": "3", "base_only_para": "②",
                "base_cite": "제3조② (기본원칙)",
                "targets": [
                    ("37-2", "개인정보보호법 제37조의2 (자동화된 결정에 대한 거부·설명 등 요구권) — \"인공지능 기술을 적용한 시스템\" 명시 조문", None),
                ],
            },
        ],
    },
]


if __name__ == "__main__":
    for cfg in CONFIGS:
        build_page(cfg)
