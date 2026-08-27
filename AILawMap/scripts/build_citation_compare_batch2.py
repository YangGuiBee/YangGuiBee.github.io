# -*- coding: utf-8 -*-
"""
2026-08-27: build_citation_compare.py의 두 번째 배치. 인공지능기본법 관련법령
카드 중 아직 "⇄ 조문 비교" 링크가 없던 7개 법(에너지법·의료기기법·교통안전법·
소상공인기본법·벤처투자 촉진법·금융소비자보호법·신용정보법)의 비교 페이지를
생성한다.

인공지능기본법 ARTICLES JS 객체에는 제16조ㆍ제18조가 없고, 대상법 3개
(소상공인기본법ㆍ의료기기법ㆍ교통안전법)의 ARTICLES에는 제2조(정의)가 없어서,
이 4개 조문은 law.go.kr DRF 원문(scratchpad에 curl로 받아둔 -full.json)에서
직접 변환해 온다. 나머지(에너지법 제2조, 벤처투자법 제70조, 금융소비자보호법
제17ㆍ19조, 신용정보법 제36조의2)는 각 법 페이지에 이미 있는 ARTICLES를 그대로 쓴다.

무-지어내기 확인 근거(2026-08-27 law.go.kr DRF 재확인):
- 에너지법: AI기본법 제2조4호가목이 "「에너지법」 제2조제1호에 따른 에너지의
  공급"이라고 법명+조항 직접 인용.
- 의료기기법: 제2조4호라목이 "「의료기기법」 제2조제1항에 따른 의료기기"를 직접
  인용. 의료기기법 자체 페이지의 wf-node ai-note(P02)가 제6조ㆍ제10조를
  제조업허가ㆍ임상시험계획승인 근거로 명시.
- 교통안전법: 제2조4호아목이 "「교통안전법」 제2조제1호부터 제3호까지"를 직접
  인용(호 1~3만, 4~10호는 인용 범위 밖이라 제외). wf-node ai-note(P05)가
  제55조ㆍ제55조의2(운행기록장치ㆍ차로이탈경고장치)를 명시.
- 소상공인기본법: 제16조②3호가 "「소상공인기본법」 제2조제1항에 따른 소상공인"을
  직접 인용.
- 벤처투자 촉진에 관한 법률: 제18조③이 "「벤처투자 촉진에 관한 법률」 제70조에
  따른 벤처투자모태조합"을 직접 인용.
- 금융소비자보호법ㆍ신용정보법: 제2조4호사목("채용, 대출 심사 등")은 법명을
  인용하지 않음 — 두 법 자체 페이지의 related-chip ai-note가 각각 제17ㆍ19조
  (적합성원칙ㆍ설명의무), 제36조의2(자동화평가 설명ㆍ이의제기)를 근거로 명시한 것을
  그대로 따름(인용관계가 아니라 ai-note 기반 관계).
"""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LAWS_DIR = ROOT / "laws"
SCRATCH = Path(r"C:\Users\BOK\AppData\Local\Temp\claude\c--AI\bf632119-a974-4b3f-b6a8-835e4133b972\scratchpad")


def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def load_js_object(law_file, var_name="ARTICLES"):
    result = subprocess.run(
        ["node", str(ROOT / "scripts" / "extract_js_object.js"), str(law_file), var_name],
        capture_output=True, text=True, check=True, encoding="utf-8",
    )
    return json.loads(result.stdout)


def raw_hang_to_paras(hang_list, only_ho_prefixes=None):
    """DRF 원문의 항(리스트 또는 단일 dict, 항번호 없이 호만 있는 경우 포함)을
    ARTICLES와 같은 paras=[{num,text,items}] 형태로 변환."""
    if isinstance(hang_list, dict):
        hang_list = [hang_list]
    paras = []
    for h in hang_list:
        num = h.get("항번호", "")
        text = h.get("항내용", "")
        items = []
        ho_list = h.get("호", [])
        if isinstance(ho_list, dict):
            ho_list = [ho_list]
        for ho in ho_list:
            ho_num = ho.get("호번호", "")
            if only_ho_prefixes and not any(ho_num.startswith(p) for p in only_ho_prefixes):
                continue
            mok_list = ho.get("목", [])
            if isinstance(mok_list, dict):
                mok_list = [mok_list]
            if mok_list:
                sub = [m.get("목내용", "") for m in mok_list]
                items.append({"text": ho.get("호내용", ""), "sub": sub})
            else:
                items.append(ho.get("호내용", ""))
        if only_ho_prefixes and not items:
            continue
        paras.append({"num": num, "text": text, "items": items})
    return paras


def load_raw_article(full_json_path, jomun_no, branch_no=None, only_ho_prefixes=None):
    with open(full_json_path, encoding="utf-8") as f:
        d = json.load(f)
    jo = d["법령"]["조문"]["조문단위"]
    for a in jo:
        if a.get("조문번호") != jomun_no or a.get("조문여부") != "조문":
            continue
        if branch_no is None and a.get("조문가지번호"):
            continue
        if branch_no is not None and a.get("조문가지번호") != branch_no:
            continue
        if True:
            hang = a.get("항")
            if hang is None:
                # 항 없이 조문내용에 바로 텍스트가 있는 단문 조
                return {"title": a.get("조문제목", ""), "paras": [
                    {"num": "", "text": a.get("조문내용", ""), "items": []}
                ]}
            return {"title": a.get("조문제목", ""), "paras": raw_hang_to_paras(hang, only_ho_prefixes)}
    raise KeyError(f"조문 {jomun_no} not found in {full_json_path}")


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
        if text:
            parts.append(f'<p class="cmp-para">{text}</p>{items_html}')
        else:
            parts.append(items_html)
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
<title>{TARGET_NAME} 비교 · LawMap</title>
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
    <p class="footer-disclaimer">이 페이지는 법령 이해를 돕기 위한 학습·연구 참고 자료이며, 법률 자문이나 정부기관의 공식 해석을 대신하지 않습니다. 조문 매칭은 인공지능기본법 조문 안의 실제 인용 문구 또는 대상 법령 자체 페이지의 AI 관련 손메모(ai-note)를 근거로 했으며 법령상 공식 대응표가 아닙니다.</p>
    인공지능기본법 · {TARGET_NAME} 비교 페이지 · 원문은 <a href="ai-basic-act.html" style="color:var(--blue)">인공지능기본법</a>,
    <a href="{TARGET_HREF}" style="color:var(--blue)">{TARGET_NAME}</a> 각 페이지 데이터 및 law.go.kr 원문(2026-08-27 확인) 사용
  </div>
</footer>

<!-- revision.js -->
<script src="../assets/revision.js"></script>

</body>
</html>
"""


def build_page(config):
    rows = []
    for pair in config["pairs"]:
        left = render_full_text({"paras": pair["base_paras"]})
        right_blocks = []
        for label, art in pair["targets"]:
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


def main():
    ai_full = SCRATCH / "ai-basic-act-full.json"
    sosang_full = SCRATCH / "sosang-basic-act-full.json"
    medical_full = SCRATCH / "medical-devices-act-full.json"
    traffic_full = SCRATCH / "traffic-safety-act-full.json"

    ai_articles = load_js_object(LAWS_DIR / "ai-basic-act.html")
    art2 = ai_articles["2"]
    art16 = load_raw_article(ai_full, "16")
    art18 = load_raw_article(ai_full, "18")

    def base_4ho(item_prefix):
        return filtered_paras(art2, only_item_prefix=item_prefix)

    energy_articles = load_js_object(LAWS_DIR / "energy-act.html")
    venture_articles = load_js_object(LAWS_DIR / "venture-investment-act.html")
    fcpa_articles = load_js_object(LAWS_DIR / "financial-consumer-protection-act.html")
    cia_articles = load_js_object(LAWS_DIR / "credit-information-act.html")

    energy_art2_ho1 = {
        "title": "정의",
        "paras": [{"num": "", "text": "", "items": [
            it for it in energy_articles["2"]["paras"][0]["items"] if it.startswith("1.")
        ]}],
    }

    medical_art2_para1 = load_raw_article(medical_full, "2")
    medical_art2_para1["paras"] = [medical_art2_para1["paras"][0]]  # 항①만(의료기기 정의)
    medical_art6 = load_raw_article(medical_full, "6")
    medical_art10 = load_raw_article(medical_full, "10")

    traffic_art2_ho123 = load_raw_article(traffic_full, "2", only_ho_prefixes=["1.", "2.", "3."])
    traffic_art55 = load_raw_article(traffic_full, "55")
    traffic_art55_2 = load_raw_article(traffic_full, "55", branch_no="2")

    sosang_art2_para1 = load_raw_article(sosang_full, "2")
    sosang_art2_para1["paras"] = [sosang_art2_para1["paras"][0]]  # 항①만(소상공인 정의)

    pubdata_articles = load_js_object(LAWS_DIR / "public-data-act.html")
    art6 = ai_articles["6"]
    pubdata_base_paras = filtered_paras(art6, only_item_prefix="4의2") + filtered_paras(art6, only_para="③")

    configs = [
        {
            "target_file": "energy-act.html",
            "target_name": "에너지법",
            "out_file": "ai-basic-act-vs-energy-act.html",
            "lead": "인공지능기본법이 \"고영향 인공지능\" 판단기준 중 하나로 이름을 직접 인용하는 에너지법 조문을 짝지었습니다.",
            "pairs": [{
                "label": "제2조4호가목 — 고영향 인공지능 판단기준(에너지 공급)",
                "base_cite": "제2조4호가목 (고영향 인공지능 정의)",
                "base_paras": base_4ho("4"),
                "targets": [("에너지법 제2조1호 (정의 — 에너지)", energy_art2_ho1)],
            }],
        },
        {
            "target_file": "medical-devices-act.html",
            "target_name": "의료기기법",
            "out_file": "ai-basic-act-vs-medical-devices-act.html",
            "lead": (
                "인공지능기본법이 \"고영향 인공지능\" 판단기준 중 하나로 이름을 직접 인용하는 의료기기법 "
                "제2조(정의)와, 의료기기법 자체 절차구조도에 AI 관련(ai-note)으로 표시된 제6조ㆍ제10조를 "
                "짝지었습니다."
            ),
            "pairs": [{
                "label": "제2조4호라목 — 고영향 인공지능 판단기준(의료기기)",
                "base_cite": "제2조4호라목 (고영향 인공지능 정의)",
                "base_paras": base_4ho("4"),
                "targets": [
                    ("의료기기법 제2조① (정의 — 의료기기)", medical_art2_para1),
                    ("의료기기법 제6조 (제조업의 허가 등)", medical_art6),
                    ("의료기기법 제10조 (임상시험계획의 승인 등)", medical_art10),
                ],
            }],
        },
        {
            "target_file": "traffic-safety-act.html",
            "target_name": "교통안전법",
            "out_file": "ai-basic-act-vs-traffic-safety-act.html",
            "lead": (
                "인공지능기본법이 \"고영향 인공지능\" 판단기준 중 하나로 이름과 조항 범위(제1호~제3호)를 직접 "
                "인용하는 교통안전법 제2조와, 교통안전법 자체 절차구조도에 AI 관련(ai-note)으로 표시된 "
                "제55조ㆍ제55조의2(운행기록장치ㆍ차로이탈경고장치)를 짝지었습니다."
            ),
            "pairs": [{
                "label": "제2조4호아목 — 고영향 인공지능 판단기준(교통수단ㆍ시설ㆍ체계)",
                "base_cite": "제2조4호아목 (고영향 인공지능 정의)",
                "base_paras": base_4ho("4"),
                "targets": [
                    ("교통안전법 제2조1~3호 (정의 — 교통수단ㆍ교통시설ㆍ교통체계)", traffic_art2_ho123),
                    ("교통안전법 제55조 (운행기록장치의 장착 및 운행기록의 활용 등)", traffic_art55),
                    ("교통안전법 제55조의2 (차로이탈경고장치의 장착)", traffic_art55_2),
                ],
            }],
        },
        {
            "target_file": "sosang-basic-act.html",
            "target_name": "소상공인기본법",
            "out_file": "ai-basic-act-vs-sosang-basic-act.html",
            "lead": "인공지능기본법이 중소기업등 지원대상 중 하나로 이름과 조항을 직접 인용하는 소상공인기본법 조문을 짝지었습니다.",
            "pairs": [{
                "label": "제16조②3호 — 중소기업등(소상공인 포함) 지원대상 정의",
                "base_cite": "제16조②3호 (인공지능기술 도입ㆍ활용 시책 등)",
                "base_paras": filtered_paras(art16, only_para="②"),
                "targets": [("소상공인기본법 제2조① (정의 — 소상공인)", sosang_art2_para1)],
            }],
        },
        {
            "target_file": "venture-investment-act.html",
            "target_name": "벤처투자 촉진에 관한 법률",
            "out_file": "ai-basic-act-vs-venture-investment-act.html",
            "lead": "인공지능기본법이 창업 활성화 지원 방안으로 이름과 조항을 직접 인용하는 벤처투자 촉진법 조문을 짝지었습니다.",
            "pairs": [{
                "label": "제18조③ — 창업 활성화(벤처투자모태조합 활용)",
                "base_cite": "제18조③ (창업의 활성화 등)",
                "base_paras": filtered_paras(art18, only_para="③"),
                "targets": [("벤처투자 촉진에 관한 법률 제70조 (벤처투자모태조합의 결성 등)", venture_articles["70"])],
            }],
        },
        {
            "target_file": "financial-consumer-protection-act.html",
            "target_name": "금융소비자 보호에 관한 법률",
            "out_file": "ai-basic-act-vs-financial-consumer-protection-act.html",
            "lead": (
                "인공지능기본법 조문 안에 법명이 직접 인용되지는 않지만, 금융소비자 보호에 관한 법률 자체의 "
                "related-chip에 \"AI기본법 제2조4호사목(대출 심사 등)의 안전확보의무 이행 근거\"로 명시된 "
                "적합성원칙ㆍ설명의무 조문을 짝지었습니다."
            ),
            "pairs": [{
                "label": "제2조4호사목 — 고영향 인공지능 판단기준(채용ㆍ대출 심사)",
                "base_cite": "제2조4호사목 (고영향 인공지능 정의)",
                "base_paras": base_4ho("4"),
                "targets": [
                    ("금융소비자 보호에 관한 법률 제17조 (적합성원칙)", fcpa_articles["17"]),
                    ("금융소비자 보호에 관한 법률 제19조 (설명의무)", fcpa_articles["19"]),
                ],
            }],
        },
        {
            "target_file": "credit-information-act.html",
            "target_name": "신용정보의 이용 및 보호에 관한 법률",
            "out_file": "ai-basic-act-vs-credit-information-act.html",
            "lead": (
                "인공지능기본법 조문 안에 법명이 직접 인용되지는 않지만, 신용정보법 자체의 related-chip에 "
                "\"AI기본법 제3조②의 설명 제공 원칙과 연결되는 자동화평가(알고리즘 신용평가) 설명ㆍ이의제기 "
                "체계\"로 명시된 조문을 짝지었습니다."
            ),
            "pairs": [{
                "label": "제3조② — 자동화된 결정에 대한 설명 원칙",
                "base_cite": "제3조② (기본원칙)",
                "base_paras": filtered_paras(ai_articles["3"], only_para="②"),
                "targets": [
                    ("신용정보의 이용 및 보호에 관한 법률 제36조의2 (자동화평가 결과에 대한 설명 및 이의제기 등)", cia_articles["36-2"]),
                ],
            }],
        },
        {
            "target_file": "public-data-act.html",
            "target_name": "공공데이터의 제공 및 이용 활성화에 관한 법률",
            "out_file": "ai-basic-act-vs-public-data-act.html",
            "lead": (
                "인공지능기본법이 인공지능 기본계획의 학습용데이터 항목에서 이름을 직접 인용하는 공공데이터법 "
                "조문을 짝지었습니다. 공공데이터법 자체 페이지의 소개 문구도 제14조ㆍ제26조를 인공지능기본법과 "
                "가장 밀접한 조문으로 명시하고 있습니다."
            ),
            "pairs": [{
                "label": "제6조②4의2호ㆍ③ — 공공데이터 학습용데이터 생성ㆍ제공",
                "base_cite": "제6조②4의2호ㆍ③ (인공지능 기본계획의 수립)",
                "base_paras": pubdata_base_paras,
                "targets": [
                    ("공공데이터의 제공 및 이용 활성화에 관한 법률 제14조 (공공데이터의 이용 활성화)", pubdata_articles["14"]),
                    ("공공데이터의 제공 및 이용 활성화에 관한 법률 제26조 (공공데이터의 제공)", pubdata_articles["26"]),
                ],
            }],
        },
    ]

    for cfg in configs:
        build_page(cfg)


if __name__ == "__main__":
    main()
