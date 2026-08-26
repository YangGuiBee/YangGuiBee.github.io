# -*- coding: utf-8 -*-
"""
인공지능기본법 ↔ 지능정보화 기본법 비교 페이지(laws/ai-basic-act-vs-intelligent-informatization.html)
를 생성한다.

시행령 비교(build_ai_basic_act_compare.py)와 달리 이 둘은 위임관계가 아니라
"인용관계"라, 절차구조도 안에 매칭 구조가 없다. 대신 인공지능기본법 제6조
(기본계획 수립) 조문 본문을 직접 읽어 실제로 「지능정보화 기본법」을 이름으로
인용하는 지점만 골랐다(무-지어내기 원칙 — 확인 안 된 연관은 넣지 않음):

  - 제6조③: 지능정보화 기본법 제6조(종합계획)·제7조(실행계획)
  - 제6조④: 지능정보화 기본법 제2조제16호(공공기관 정의)
  - 제6조⑤: 지능정보화 기본법 제13조(부문별 추진계획)
  - 제8조①6호(위원회 심의사항): 지능정보화 기본법 제40조제1항(데이터센터 정의)

관련 법령 카드의 "제6·13·15조 등에서 인용" 표시 중 제13·15조는 law.go.kr
원문을 직접 재확인한 결과 "지능정보화 기본법"을 조문에서 이름으로 인용하지
않는다(주제상 관련은 있으나 직접 인용 없음) — 이 페이지는 그 두 조문을
포함하지 않는다.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LAWS_DIR = ROOT / "laws"


def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def load_articles(law_file, var_name="ARTICLES"):
    import subprocess

    extractor = ROOT / "scripts" / "extract_js_object.js"
    result = subprocess.run(
        ["node", str(extractor), law_file, var_name],
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


def main():
    base_articles = load_articles(str(LAWS_DIR / "ai-basic-act.html"))
    intel_articles = load_articles(str(LAWS_DIR / "intelligent-informatization-act.html"))

    # 지능정보화 기본법 제2조제16호(공공기관 정의) — law.go.kr에서 직접 확인해
    # 손으로 옮긴 것(2026-08-26, MST=268535). 제2조 전체(30여개 호)는 정의 조항이라
    # 너무 길어서, 실제로 인용된 제16호만 발췌한다.
    intel_art2_ho16 = {
        "title": "정의",
        "paras": [{
            "num": "", "text": '16. "공공기관"이란 다음 각 목의 어느 하나에 해당하는 기관을 말한다.',
            "items": [{
                "text": "16. \"공공기관\"이란 다음 각 목의 어느 하나에 해당하는 기관을 말한다.",
                "sub": [
                    "가. 「공공기관의 운영에 관한 법률」에 따른 공공기관",
                    "나. 「지방공기업법」에 따른 지방공사 및 지방공단",
                    "다. 특별법에 따라 설립된 특수법인",
                    "라. 「초ㆍ중등교육법」, 「고등교육법」 및 그 밖의 다른 법률에 따라 설치된 각급 학교",
                    "마. 그 밖에 대통령령으로 정하는 법인ㆍ기관 및 단체",
                ],
            }],
        }],
    }

    pairs = [
        {
            "label": "제6조③ — 기본계획 수립 시 고려사항",
            "base_key": "6", "base_only_para": "③",
            "targets": [("6", "지능정보화 기본법 제6조 (종합계획)"), ("7", "지능정보화 기본법 제7조 (실행계획)")],
        },
        {
            "label": "제6조④ — 자료제출 요청 대상 공공기관",
            "base_key": "6", "base_only_para": "④",
            "targets": [("2", "지능정보화 기본법 제2조제16호 (공공기관 정의)")],
        },
        {
            "label": "제6조⑤ — 기본계획의 지위",
            "base_key": "6", "base_only_para": "⑤",
            "targets": [("13", "지능정보화 기본법 제13조 (인공지능·인공지능산업 부문별 추진계획)")],
        },
        {
            "label": "제8조①6호 — 위원회 심의사항(데이터센터)",
            "base_key": "8", "base_only_para": None,
            "base_only_item": "6",
            "targets": [("40", "지능정보화 기본법 제40조 (데이터센터)")],
        },
    ]

    def base_para_html(base_key, only_para=None, only_item=None):
        art = base_articles[base_key]
        if only_para:
            paras = [p for p in art["paras"] if p["num"] == only_para]
        elif only_item:
            # ②호 목록에서 특정 호만 추림
            paras = []
            for p in art["paras"]:
                items = [it for it in p.get("items", []) if (it if isinstance(it, str) else it["text"]).startswith(only_item + ".")]
                if items:
                    paras.append({**p, "items": items})
        else:
            paras = art["paras"]
        return render_full_text({"paras": paras})

    rows = []
    for pair in pairs:
        left = base_para_html(pair["base_key"], pair.get("base_only_para"), pair.get("base_only_item"))
        right_blocks = []
        for key, label in pair["targets"]:
            if key == "2":
                art = intel_art2_ho16
            else:
                art = intel_articles[key]
            right_blocks.append(
                f'<div class="cmp-article"><div class="cmp-article-head">{esc(label)}</div>{render_full_text(art)}</div>'
            )
        right = "".join(right_blocks)
        rows.append(
            f'<div class="cmp-row"><div class="cmp-gate-tag">{esc(pair["label"])}</div>'
            f'<div class="cmp-col cmp-col-law"><div class="cmp-article">'
            f'<div class="cmp-article-head">인공지능기본법 {esc(pair["label"].split(" — ")[0])}</div>{left}</div></div>'
            f'<div class="cmp-col cmp-col-decree">{right}</div></div>'
        )

    body = "".join(rows)

    page = f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>인공지능기본법 · 지능정보화 기본법 비교 · LawMap</title>
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
    <h1><a class="law-sibling" href="ai-basic-act.html">인공지능기본법</a><span class="law-sep">&gt;</span><span class="law-current">지능정보화 기본법 비교</span></h1>
    <p class="lead">
      인공지능기본법이 조문 안에서 실제로 이름을 인용하는 지능정보화 기본법 조문만 짝지었습니다.
      전부 인공지능기본법 제6조(인공지능 기본계획의 수립) 안에 있습니다.
    </p>
  </div>
</section>

<section class="block">
  <div class="wrap cmp-wrap">
{body}
  </div>
</section>

<footer class="site-footer">
  <div class="wrap">
    <p class="footer-disclaimer">이 페이지는 법령 이해를 돕기 위한 학습·연구 참고 자료이며, 법률 자문이나 정부기관의 공식 해석을 대신하지 않습니다. 조문 매칭은 인공지능기본법 조문 안의 실제 인용 문구를 근거로 했으며 법령상 공식 대응표가 아닙니다.</p>
    인공지능기본법 · 지능정보화 기본법 비교 페이지 · 원문은 <a href="ai-basic-act.html" style="color:var(--blue)">인공지능기본법</a>,
    <a href="intelligent-informatization-act.html" style="color:var(--blue)">지능정보화 기본법</a> 각 페이지 데이터 및 law.go.kr 원문(2026-08-26 확인) 사용
  </div>
</footer>

</body>
</html>
"""
    out_path = LAWS_DIR / "ai-basic-act-vs-intelligent-informatization.html"
    out_path.write_text(page, encoding="utf-8")
    print("written:", out_path, "-", len(page), "chars")


if __name__ == "__main__":
    main()
