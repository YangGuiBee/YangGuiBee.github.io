# -*- coding: utf-8 -*-
"""
laws/industrial-digital-transformation-act.html / -decree.html을 생성한다.

2026-08-27 법령후보 자동탐지(scripts/build_law_candidates_snapshot.py)로 발견된
"산업 디지털 전환 및 인공지능 활용 촉진법"(약칭 산업디지털전환법, 산업통상부,
2026-07-01 시행)을 87개 법령 목록에 추가하는 작업.

- 법률 MST=281883, 시행령 MST=287399 (law.go.kr DRF, 2026-08-27 확인)
- 이 법 제2조3의2호가 "「인공지능 발전과 신뢰 기반 조성 등에 관한 기본법」 제2조제1호"를
  직접 인용해 "인공지능"을 정의함 — 인공지능기본법과의 실제 인용관계 확인됨(무-지어내기 원칙에
  따라 이 인용 하나만 근거로 삼음, 그 밖의 "인공지능"이라는 단어가 들어간 조문은 이 법 자체
  개념이지 인공지능기본법 인용이 아니므로 관련법령 카드에 넣지 않음).
- [feedback_lawmap_procedure_diagram_method] 방식을 따름: 원문 JSON 통째로 fetch →
  실제 장 구성으로 [1]구성 →이 법 고유의 주체×단계로 [2]절차구조도 설계(AI기본법 그리드 복사
  안 함) → 원문 그대로 ARTICLES/LEGAL_BASIS 채움.
"""
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LAWS_DIR = ROOT / "laws"
DRF = "http://www.law.go.kr/DRF/lawService.do"

LAW_MST = "281883"
DECREE_MST = "287399"


def fetch(mst):
    url = DRF + "?" + urllib.parse.urlencode({"OC": "test", "target": "law", "MST": mst, "type": "JSON"})
    with urllib.request.urlopen(url, timeout=20) as r:
        return json.loads(r.read().decode("utf-8"))


def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def article_key(a):
    num = a.get("조문번호", "")
    branch = a.get("조문가지번호", "")
    return f"{num}-{branch}" if branch else str(num)


def convert_articles(jo):
    """조문단위 리스트 -> {키: {title, paras:[{num,text,items}]}}. 항이 dict/list 혼재,
    호에 목이 있는 경우까지 전부 처리(다른 law.go.kr 원문 변환 스크립트와 동일 로직)."""
    out = {}
    for a in jo:
        if a.get("조문여부") != "조문":
            continue
        key = article_key(a)
        title = a.get("조문제목", "")
        hang = a.get("항")
        paras = []
        if hang is None:
            paras.append({"num": "", "text": a.get("조문내용", ""), "items": []})
        else:
            hang_list = [hang] if isinstance(hang, dict) else hang
            for h in hang_list:
                items = []
                ho_list = h.get("호", [])
                ho_list = [ho_list] if isinstance(ho_list, dict) else ho_list
                for ho in ho_list:
                    mok_list = ho.get("목", [])
                    mok_list = [mok_list] if isinstance(mok_list, dict) else mok_list
                    if mok_list:
                        items.append({"text": ho.get("호내용", ""), "sub": [m.get("목내용", "") for m in mok_list]})
                    else:
                        items.append(ho.get("호내용", ""))
                paras.append({"num": h.get("항번호", "") or "", "text": h.get("항내용", ""), "items": items})
        out[key] = {"title": title, "paras": paras}
    return out


def build_page(law_data, decree_data):
    law_jo = law_data["법령"]["조문"]["조문단위"]
    decree_jo = decree_data["법령"]["조문"]["조문단위"]
    ARTICLES = convert_articles(law_jo)
    DECREE_ARTICLES = convert_articles(decree_jo)

    # [1] 구성: 전문(장) 항목만 추출
    chapters = [a for a in law_jo if a.get("조문여부") == "전문"]

    def lawgokr_url(law_name, jono):
        return ("https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=282974&joNo=" + jono +
                "&joBrNo=00&chrClsCd=010202&urlMode=lsInfoP&efYd=20260701&ancYnChk=0")

    # 실제 lsiSeq은 law.go.kr 페이지에서 확인 필요하므로 장 배지는 law.go.kr 목차 링크 대신
    # 조문 링크 패턴(법령/이름/제N조)을 그대로 사용한다(다른 페이지들과 동일한 방식).
    def art_url(law_name_kr, art_label):
        return "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/" + urllib.parse.quote(law_name_kr) + "/" + urllib.parse.quote(art_label)

    LAW_NAME = "산업 디지털 전환 및 인공지능 활용 촉진법"
    DECREE_NAME = "산업 디지털 전환 및 인공지능 활용 촉진법 시행령"

    chapter_ranges = []
    for i, ch in enumerate(chapters):
        start_num = ch.get("조문번호")
        title_line = ch.get("조문내용", "").strip()
        end_num = None
        # 다음 조문번호들 중 이 챕터에 속하는 마지막 조문번호를 구한다
        chapter_ranges.append({"start": start_num, "title": title_line})

    # 장별 요약(직접 원문 확인해 손으로 기록 — 각 장의 실제 조문범위/내용)
    CHAPTER_FLOW = [
        {"no": "제1장 · 제1~4조", "title": "총칙", "desc": "목적ㆍ정의ㆍ국가 등의 책무ㆍ다른 법률과의 관계", "ai": False},
        {"no": "제2장 · 제5~8조", "title": "산업 디지털 전환 및 인공지능 활용 정책의 수립 등", "desc": "종합계획 수립, 실태조사, 산업디지털전환및인공지능활용위원회 설치ㆍ기능", "ai": False},
        {"no": "제3장 · 제9~14조", "title": "산업데이터 및 산업인공지능 활용 생태계 조성", "desc": "산업데이터 활용ㆍ보호 원칙, 활용촉진, 전문회사, 표준화, 품질관리, 플랫폼", "ai": True},
        {"no": "제4장 · 제15~18조", "title": "산업 디지털 전환 및 인공지능 활용 선도사업의 지원 등", "desc": "선도사업 선정, 지원, 규제개선, 관리ㆍ감독", "ai": False},
        {"no": "제5장 · 제19~27조", "title": "산업 디지털 전환 및 인공지능 활용 기반 조성 및 활성화", "desc": "지원센터, 기술ㆍ서비스개발, 전문인력 양성, 금융ㆍ세제, 국제협력, 우수기업, 데이터센터, 안전확보, 전담기관, 협회", "ai": False},
        {"no": "제6장 · 제28~30조", "title": "보칙", "desc": "재원의 조달, 권한의 위임ㆍ위탁, 벌칙 적용에서의 공무원 의제", "ai": False},
    ]

    chapter_html_parts = []
    for i, c in enumerate(CHAPTER_FLOW):
        cls = "ch ai-note" if c["ai"] else "ch"
        first_art = c["no"].split("제")[-1].split("~")[0].split("조")[0]
        href = art_url(LAW_NAME, "제" + first_art + "조")
        chapter_html_parts.append(
            f'<a class="{cls}" href="{href}" target="_blank" rel="noopener"><div class="no">{esc(c["no"])}</div><h4>{esc(c["title"])}</h4><p>{esc(c["desc"])}</p></a>'
        )
        if i < len(CHAPTER_FLOW) - 1:
            chapter_html_parts.append('<div class="arrow">→</div>')
    chapter_flow_html = "".join(chapter_html_parts)

    # ---- [2] 절차구조도 설계 ----
    # 주체(행) 5개, 단계(열) G0~G6 — 이 법 고유 구조(AI기본법 그리드 복사 아님)
    GATE_NAMES = [
        "G0 정책수립ㆍ실태조사", "G1 데이터생태계조성", "G2 선도사업지원",
        "G3 기반조성(센터ㆍ인력양성)", "G4 금융ㆍ국제협력", "G5 성과관리ㆍ안전", "G6 운영ㆍ보칙",
    ]

    def node(pcode, art_label, text, ai=False, dec=None):
        return {"pcode": pcode, "art": art_label, "text": text, "ai": ai, "dec": dec}

    # dec = (dcode, art_label, text) or None
    LANES = [
        ("산업통상부장관(정책ㆍ감독기관)", {
            0: [node("P01", "제5조①③", "종합계획 수립(위원회 심의)", dec=("D01", "제3조", "위임사항(선도사업ㆍ규제개선ㆍ신산업육성 등)")),
                node("P02", "제6조①②③", "실태조사, 산업인공지능 수준진단", dec=("D02", "제4조", "실태조사 범위ㆍ수준진단 기준"))],
            1: [node("P03", "제10조①ㆍ제12조①", "산업데이터 활용촉진 지원, 표준화 추진", ai=True),
                node("P04", "제13조ㆍ제14조", "산업데이터 품질관리ㆍ플랫폼 지원시책")],
            2: [node("P05", "제15조①②", "선도사업 발굴ㆍ공고", dec=("D07", "제7조①②", "선도사업 발굴 지원, 공고 사항")),
                node("P06", "제17조②⑤ㆍ제18조①③", "규제개선 통보ㆍ관리감독ㆍ시정명령", dec=("D09_10", "제9조ㆍ제10조", "규제개선 검토ㆍ시정명령 절차"))],
            3: [node("P07", "제19조①③", "지원센터 지정, 비용지원", dec=("D11", "제11조①~④", "센터 지정요건ㆍ신청ㆍ공고")),
                node("P08", "제21조①②", "전문인력 양성시책, 양성기관 지정", dec=("D12", "제12조", "양성기관 지정요건ㆍ신청"))],
            4: [node("P09", "제22조①", "금융 및 세제지원 시책")],
            5: [node("P10", "제24조ㆍ제24조의2ㆍ제25조", "우수기업 선정ㆍ데이터센터 구축활성화ㆍ안전확보")],
            6: [node("P11", "제26조①②", "전담기관 지정ㆍ비용지원", dec=("D14", "제14조", "전담기관 지정업무 공고ㆍ대통령령 업무")),
                node("P12", "제27조①③", "협회 설립인가ㆍ비용지원", dec=("D15", "제15조①③", "설립인가 신청서류ㆍ인가공고")),
                node("P13", "제29조①②", "권한 위임ㆍ업무 위탁", dec=("D16", "제16조", "위임ㆍ위탁 업무 범위"))],
        }),
        ("산업디지털전환및인공지능활용위원회", {
            0: [node("P14", "제7조①~④", "위원회 설치ㆍ구성ㆍ위원장", dec=("D05", "제5조", "관계부처 차관급 위원, 의결정족수")),
                node("P15", "제8조①②③", "위원회 심의사항(종합계획ㆍ정책ㆍ선도사업 등)")],
            2: [node("P16", "제17조④", "규제개선 심의", dec=("D09b", "제9조", "전문위원회 사전검토, 심의 고려사항")),
                node("P17", "제7조⑦", "전문위원회 설치", dec=("D06", "제6조", "전문위원회 구성ㆍ운영"))],
        }),
        ("산업인공지능 공급ㆍ수요기업(전환기업등)", {
            1: [node("P18", "제9조①~⑦", "산업데이터 활용ㆍ보호 원칙(사용수익권ㆍ손해배상책임)"),
                node("P19", "제11조①③", "전문회사 설립ㆍ신고")],
            2: [node("P20", "제15조③", "선도사업 계획서 신청", dec=("D07_2", "제7조③④", "계획서 제출, 사전평가")),
                node("P21", "제17조①⑦⑧", "규제개선ㆍ규제신속확인ㆍ실증특례 신청")],
        }),
        ("전담기관ㆍ협회ㆍ지원센터", {
            3: [node("P22", "제19조⑤", "지원센터 업무 수행", dec=("D11_5", "제11조⑤", "센터 업무 11개 항목"))],
            6: [node("P23", "제26조", "전담기관 업무수행", dec=("D14_2", "제14조②", "전담기관 대통령령 업무")),
                node("P24", "제27조②", "협회 법인격(민법 사단법인 준용)")],
        }),
        ("국가ㆍ지방자치단체", {
            2: [node("P25", "제16조①", "선도사업 지원(행정ㆍ기술ㆍ재정)", dec=("D08", "제8조", "지원 가능사항, 지원신청 절차"))],
            4: [node("P26", "제23조①~⑤", "국제협력(산업데이터 보호, 국외이전 제한 대응)", dec=("D13", "제13조", "국제협력 세부업무"))],
            6: [node("P27", "제28조①②", "재원 조달ㆍ예산 지원")],
        }),
    ]

    def node_html(n):
        art_href = art_url(LAW_NAME, n["art"].split("ㆍ")[0].split("①")[0].split("②")[0].split("③")[0])
        cls = "wf-node ai-note" if n["ai"] else "wf-node"
        html = (f'<div class="{cls}" id="{n["pcode"]}">'
                f'<div class="wf-node-top"><span class="pcode">{n["pcode"]}</span>'
                f'<a class="a" href="{art_href}" target="_blank" rel="noopener">{esc(n["art"])}</a></div>'
                f'<span class="t">{esc(n["text"])}</span></div>')
        if n["dec"]:
            dcode, dart, dtext = n["dec"]
            dhref = art_url(DECREE_NAME, dart.split("ㆍ")[0].split("①")[0].split("②")[0].split("③")[0].split("~")[0])
            html += (f'<div class="wf-node dec-node" id="{dcode}" hidden>'
                     f'<div class="wf-node-top"><span class="pcode">{dcode}</span>'
                     f'<a class="a" href="{dhref}" target="_blank" rel="noopener">{esc(dart)}</a></div>'
                     f'<span class="t">{esc(dtext)}</span></div>')
        return html

    grid_rows = []
    all_nodes = []
    for lane_name, gates in LANES:
        grid_rows.append(f'<div class="wf-gate-cell">{esc(lane_name)}</div>')
        for g in range(7):
            nodes = gates.get(g, [])
            cell_html = "".join(node_html(n) for n in nodes)
            grid_rows.append(f'<div class="wf-cell">{cell_html}</div>')
            all_nodes.extend(nodes)
    grid_html = "\n        ".join(grid_rows)

    # LEGAL_BASIS
    LEGAL_BASIS = {n["pcode"]: [{"article": n["art"], "text": n["text"]}] for n in all_nodes}
    for n in all_nodes:
        if n["dec"]:
            dcode, dart, dtext = n["dec"]
            LEGAL_BASIS[dcode] = [{"article": dart, "text": dtext}]

    # EDGES: 같은 lane 내 순차 흐름(solid) + 위원회/기업/기관/지자체 → 장관 절차 연계(dashed)
    EDGES = [
        {"from": "P01", "to": "P02", "kind": "solid"},
        {"from": "P05", "to": "P06", "kind": "solid"},
        {"from": "P07", "to": "P08", "kind": "solid"},
        {"from": "P11", "to": "P12", "kind": "solid"},
        {"from": "P12", "to": "P13", "kind": "solid"},
        {"from": "P14", "to": "P15", "kind": "solid"},
        {"from": "P16", "to": "P17", "kind": "solid"},
        {"from": "P20", "to": "P05", "kind": "dashed"},
        {"from": "P05", "to": "P16", "kind": "dashed"},
        {"from": "P21", "to": "P06", "kind": "dashed"},
        {"from": "P06", "to": "P16", "kind": "dashed"},
        {"from": "P25", "to": "P05", "kind": "dashed"},
        {"from": "P22", "to": "P07", "kind": "dashed"},
        {"from": "P23", "to": "P11", "kind": "dashed"},
        {"from": "P24", "to": "P12", "kind": "dashed"},
        {"from": "P01", "to": "P14", "kind": "dashed"},
        {"from": "P15", "to": "P01", "kind": "dashed"},
    ]
    DECREE_EDGES = [
        {"from": "D01", "to": "D02", "kind": "solid"},
        {"from": "D07", "to": "D09_10", "kind": "solid"},
        {"from": "D11", "to": "D12", "kind": "solid"},
        {"from": "D05", "to": "D06", "kind": "solid"},
        {"from": "D07_2", "to": "D07", "kind": "dashed"},
        {"from": "D08", "to": "D07", "kind": "dashed"},
        {"from": "D11_5", "to": "D11", "kind": "dashed"},
        {"from": "D14_2", "to": "D14", "kind": "dashed"},
    ]

    HERO_LEAD = (
        "산업데이터 생성ㆍ활용의 활성화와 지능정보기술의 산업 적용, 인공지능의 산업 활용을 촉진해 "
        "산업 경쟁력을 확보하기 위한 법입니다. 원래 이름은 \"산업 디지털 전환 촉진법\"이었으나 "
        "2025-12-30 개정으로 \"및 인공지능 활용\"이 추가됐습니다(제명변경). 제2조3의2호가 "
        "인공지능기본법 제2조제1호의 인공지능 정의를 그대로 인용합니다. (제1조 목적)"
    )

    RELATED_CHIPS = f"""
      <div class="related-chip ai-note">
        <div class="rel">제2조3의2호 "인공지능" 정의 — 「인공지능 발전과 신뢰 기반 조성 등에 관한 기본법」 제2조제1호를 그대로 인용</div>
        <div class="name"><a href="ai-basic-act.html" style="color:var(--blue)">인공지능기본법</a></div>
        <a href="ai-basic-act-vs-industrial-digital-transformation-act.html" class="cmp-link">⇄ 조문 비교</a>
      </div>
      <div class="related-chip">
        <div class="rel">제2조4호ㆍ제24조의2 지능정보기술ㆍ데이터센터 정의 인용</div>
        <div class="name"><a href="intelligent-informatization-act.html" style="color:var(--blue)">지능정보화 기본법</a></div>
      </div>
      <div class="related-chip">
        <div class="rel">제12조① 표준화 관련 다른 법률의 표준 우선 적용</div>
        <div class="name"><a href="data-industry-act.html" style="color:var(--blue)">데이터 산업진흥 및 이용촉진에 관한 기본법</a></div>
      </div>
      <div class="related-chip">
        <div class="rel">제4조② 개인정보 처리ㆍ정보주체 권리는 이 법을 따름</div>
        <div class="name"><a href="personal-information-protection-act.html" style="color:var(--blue)">개인정보보호법</a></div>
      </div>
""".strip("\n")

    articles_json = json.dumps(ARTICLES, ensure_ascii=False)
    decree_articles_json = json.dumps(DECREE_ARTICLES, ensure_ascii=False)
    legal_basis_json = json.dumps(LEGAL_BASIS, ensure_ascii=False)
    edges_json = json.dumps(EDGES, ensure_ascii=False)
    decree_edges_json = json.dumps(DECREE_EDGES, ensure_ascii=False)
    gate_names_json = json.dumps(GATE_NAMES, ensure_ascii=False)

    JS_TEMPLATE = """
(function(){{
  var EDGES = {edges};
  var DECREE_EDGES = {decree_edges};

  function rel(rect, wr){{
    return {{
      left: rect.left - wr.left, right: rect.right - wr.left,
      top: rect.top - wr.top, bottom: rect.bottom - wr.top,
      cx: (rect.left + rect.right)/2 - wr.left, cy: (rect.top + rect.bottom)/2 - wr.top
    }};
  }}
  function roundedPath(pts, r){{
    var clean = [pts[0]];
    for (var i=1;i<pts.length;i++){{
      var p=pts[i], last=clean[clean.length-1];
      if (Math.abs(p[0]-last[0])>0.5 || Math.abs(p[1]-last[1])>0.5) clean.push(p);
    }}
    if (clean.length < 2) return '';
    if (clean.length === 2) return 'M '+clean[0][0]+' '+clean[0][1]+' L '+clean[1][0]+' '+clean[1][1];
    var d = 'M '+clean[0][0]+' '+clean[0][1];
    for (var j=1;j<clean.length-1;j++){{
      var p0=clean[j-1], p1=clean[j], p2=clean[j+1];
      var d1x=p1[0]-p0[0], d1y=p1[1]-p0[1], len1=Math.hypot(d1x,d1y);
      var d2x=p2[0]-p1[0], d2y=p2[1]-p1[1], len2=Math.hypot(d2x,d2y);
      var rr = Math.min(r, len1/2, len2/2);
      var ax = p1[0]-(d1x/len1)*rr, ay = p1[1]-(d1y/len1)*rr;
      var bx = p1[0]+(d2x/len2)*rr, by = p1[1]+(d2y/len2)*rr;
      d += ' L '+ax+' '+ay+' Q '+p1[0]+' '+p1[1]+' '+bx+' '+by;
    }}
    var lastPt = clean[clean.length-1];
    d += ' L '+lastPt[0]+' '+lastPt[1];
    return d;
  }}

  var NO_DETOUR = {{}};
  var GUTTER_X = 0;
  var GRID_BOTTOM = 0;

  function edgePath(kind, s, t, e){{
    var r = 10;
    if (kind === 'loop') {{
      var rx = Math.max(s.right, t.right) + 11;
      return roundedPath([[s.right,s.cy],[rx,s.cy],[rx,t.cy],[t.right,t.cy]], r);
    }}
    var forwardDx = t.left - s.right;
    var backwardDx = s.left - t.right;
    var overlapX = forwardDx < 8 && backwardDx < 8;
    if (overlapX) {{
      var gutterX = Math.min(s.left, t.left) - 11;
      return roundedPath([[s.left,s.cy],[gutterX,s.cy],[gutterX,t.cy],[t.left,t.cy]], r);
    }}
    var sameRow = Math.abs(s.cy - t.cy) < 2;
    if (!sameRow) {{
      if (forwardDx >= 8) {{
        var gx = s.right + 11;
        return roundedPath([[s.right,s.cy],[gx,s.cy],[gx,t.cy],[t.left,t.cy]], r);
      }}
      var gx2 = s.left - 11;
      return roundedPath([[s.left,s.cy],[gx2,s.cy],[gx2,t.cy],[t.right,t.cy]], r);
    }}
    var edgeKey = e ? (e.from + '>' + e.to) : '';
    var toggleDetour = TOGGLE_FLAG && !NO_DETOUR[edgeKey];
    var skipsColumn = forwardDx > 40 || backwardDx > 40;
    if (skipsColumn || toggleDetour) {{
      var goAbove = s.top < (GRID_BOTTOM - s.bottom);
      var edgeY = goAbove ? -8 : GRID_BOTTOM + 8;
      if (forwardDx >= 8) {{
        var outX = s.right + 10;
        return roundedPath([[s.right,s.cy],[outX,s.cy],[outX,edgeY],[t.cx,edgeY],[t.cx, goAbove ? t.top : t.bottom]], r);
      }}
      var outX2 = s.left - 10;
      return roundedPath([[s.left,s.cy],[outX2,s.cy],[outX2,edgeY],[t.cx,edgeY],[t.cx, goAbove ? t.top : t.bottom]], r);
    }}
    if (forwardDx >= 8) {{
      var midX = s.right + forwardDx/2;
      return roundedPath([[s.right,s.cy],[midX,s.cy],[midX,t.cy],[t.left,t.cy]], r);
    }}
    var midX2 = s.left - backwardDx/2;
    return roundedPath([[s.left,s.cy],[midX2,s.cy],[midX2,t.cy],[t.right,t.cy]], r);
  }}

  var pathEls = [];

  function draw(){{
    var wrap = document.getElementById('wfGridWrap');
    var svg = document.getElementById('wfArrows');
    if (!wrap || !svg) return;
    svg.querySelectorAll('path.wf-arrow-path').forEach(function(p){{ svg.removeChild(p); }});
    pathEls = [];
    var wr = wrap.getBoundingClientRect();
    var corner = document.querySelector('.wf-corner-head');
    GUTTER_X = corner ? (corner.getBoundingClientRect().right - wr.left) + 11 : 0;
    GRID_BOTTOM = wr.height;

    activeEdges().forEach(function(e){{
      var a = document.getElementById(e.from);
      var b = document.getElementById(e.to);
      if (!a || !b) {{ pathEls.push(null); return; }}
      var s = rel(a.getBoundingClientRect(), wr);
      var t = rel(b.getBoundingClientRect(), wr);
      var d = edgePath(e.kind, s, t, e);
      var marker = e.kind === 'loop' ? 'wf-arrow-loop' : 'wf-arrow';
      var cls = 'wf-arrow-path' + (e.kind === 'dashed' ? ' dashed' : e.kind === 'loop' ? ' loopback' : '');

      var path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d', d);
      path.setAttribute('class', cls);
      path.setAttribute('marker-end', 'url(#'+marker+')');
      svg.appendChild(path);
      pathEls.push(path);
    }});
  }}

  function setHover(nodeId){{
    var nodeSet = null, edgeSet = null;
    if (nodeId) {{
      nodeSet = new Set([nodeId]);
      edgeSet = new Set();
      activeEdges().forEach(function(e, i){{
        if (e.from === nodeId || e.to === nodeId) {{
          edgeSet.add(i);
          nodeSet.add(e.from);
          nodeSet.add(e.to);
        }}
      }});
    }}
    document.querySelectorAll('.wf-node').forEach(function(n){{
      if (!nodeSet) {{ n.classList.remove('wf-dim','wf-hl'); return; }}
      var isConn = nodeSet.has(n.id);
      n.classList.toggle('wf-dim', !isConn);
      n.classList.toggle('wf-hl', isConn);
    }});
    pathEls.forEach(function(p, i){{
      if (!p) return;
      if (!edgeSet) {{ p.classList.remove('wf-dim','wf-hl'); return; }}
      var isConn = edgeSet.has(i);
      p.classList.toggle('wf-dim', !isConn);
      p.classList.toggle('wf-hl', isConn);
    }});
  }}

  function bindHover(){{
    document.querySelectorAll('.wf-node').forEach(function(n){{
      if (n.dataset.hoverBound) return;
      n.dataset.hoverBound = '1';
      n.setAttribute('tabindex', '0');
      n.addEventListener('mouseenter', function(){{ setHover(n.id); showDetail(n); }});
      n.addEventListener('mouseleave', restoreDetail);
      n.addEventListener('focus', function(){{ setHover(n.id); showDetail(n); }});
      n.addEventListener('blur', restoreDetail);
    }});
  }}

  function restoreDetail(){{
    setHover(null);
    var sel = document.querySelector('.wf-node.wf-selected');
    if (sel) showDetail(sel); else clearDetail();
  }}

  function nodeContext(nodeEl){{
    var cell = nodeEl.closest('.wf-cell');
    var el = cell ? cell.previousElementSibling : null;
    var actor = '', gate = '';
    var steps = 0;
    while (el) {{
      steps++;
      if (el.classList.contains('wf-gate-cell')) {{
        actor = el.childNodes[0].textContent.trim();
        gate = GATE_NAMES[steps - 1] || '';
        break;
      }}
      el = el.previousElementSibling;
    }}
    return {{ actor: actor, gate: gate }};
  }}

  var EDGE_KIND_LABEL = {{ solid: '같은 주체 · 다음 단계', dashed: '다른 주체로 연계', loop: '조건부 회귀' }};

  function relatedChip(id, dir, kind){{
    var el = document.getElementById(id);
    if (!el) return '';
    var t = (el.querySelector('.t') || {{}}).textContent || '';
    return '<button type="button" class="wf-detail-chip" data-target="' + id + '" title="' + EDGE_KIND_LABEL[kind] + '">'
      + (dir === 'prev' ? '← ' : '→ ') + id + ' ' + t + '</button>';
  }}

  function renderItems(items){{
    return '<ul class="wf-detail-law-items">' + items.map(function(i){{
      if (typeof i === 'string') return '<li>' + i + '</li>';
      var subHtml = i.sub && i.sub.length
        ? '<ul class="wf-detail-law-subitems">' + i.sub.map(function(s){{ return '<li>' + s + '</li>'; }}).join('') + '</ul>'
        : '';
      return '<li>' + i.text + subHtml + '</li>';
    }}).join('') + '</ul>';
  }}

  function renderArticleFull(art){{
    if (!art) return '<p class="wf-detail-law-missing">원문 데이터가 아직 없습니다. law.go.kr에서 확인해 주세요.</p>';
    return art.paras.map(function(p){{
      var itemsHtml = p.items.length ? renderItems(p.items) : '';
      return '<p class="wf-detail-law-para">' + p.text + '</p>' + itemsHtml;
    }}).join('');
  }}

  function articleNum(article){{
    var m = article.match(/^제(\\d+)조(?:의(\\d+))?/);
    if (!m) return '';
    return m[2] ? m[1] + '-' + m[2] : m[1];
  }}

  var decreeVisible = false;
  var TOGGLE_FLAG = false;

  function activeEdges(){{
    return decreeVisible ? EDGES.concat(DECREE_EDGES) : EDGES;
  }}

  var GATE_NAMES = {gate_names};

  // 조문 원문(항ㆍ호ㆍ목 단위). 국가법령정보 공동활용 API(law.go.kr DRF, OC=test,
  // MST={law_mst}, 산업 디지털 전환 및 인공지능 활용 촉진법, 시행일 20260701판)에서
  // 그대로 가져온 것으로, 법령은 저작권법 제7조에 따라 보호 대상이 아니다.
  var ARTICLES = {articles};

  // 시행령 조문 원문. law.go.kr DRF(OC=test, MST={decree_mst},
  // 산업 디지털 전환 및 인공지능 활용 촉진법 시행령, 시행일 20260701판)에서 그대로 가져온 것.
  var DECREE_ARTICLES = {decree_articles};

  var LEGAL_BASIS = {legal_basis};


  function showDetail(nodeEl){{
    var panel = document.getElementById('wfDetail');
    if (!panel) return;
    var pcode = nodeEl.id;
    var isDecree = pcode.charAt(0) === 'D';
    var title = (nodeEl.querySelector('.t') || {{}}).textContent || '';
    var link = nodeEl.querySelector('a.a');
    var ctx = nodeContext(nodeEl);

    var sideHtml = '<h3 class="wf-detail-title"><span class="wf-detail-pcode">' + pcode + '</span>' + title + '</h3>'
      + '<p class="wf-detail-meta">' + ctx.gate + (ctx.actor ? ' · ' + ctx.actor : '') + '</p>';

    var mainHtml = '';
    var basis = LEGAL_BASIS[pcode];
    if (basis && basis.length) {{
      mainHtml += '<div class="wf-detail-law-grid">' + basis.map(function(b){{
        var num = articleNum(b.article);
        var srcArticles = isDecree ? DECREE_ARTICLES : ARTICLES;
        var art = srcArticles[num];
        var titleTxt = art ? '(' + art.title + ')' : '';
        var lawLabel = isDecree ? {decree_name} : {law_name};
        return '<div class="wf-detail-law">'
          + '<span class="wf-detail-law-art">' + lawLabel + ' ' + b.article + titleTxt + '</span>'
          + '<div class="wf-detail-law-full">' + renderArticleFull(art) + '</div>'
          + '</div>';
      }}).join('') + '</div>';
    }} else if (link) {{
      mainHtml += '<a class="wf-detail-link" href="' + link.getAttribute('href') + '" target="_blank" rel="noopener">법적 근거: ' + link.textContent + ' →</a>';
    }}

    var prevChips = activeEdges().filter(function(e){{ return e.to === pcode; }}).map(function(e){{ return relatedChip(e.from, 'prev', e.kind); }}).join('');
    var nextChips = activeEdges().filter(function(e){{ return e.from === pcode; }}).map(function(e){{ return relatedChip(e.to, 'next', e.kind); }}).join('');
    if (prevChips || nextChips) {{
      mainHtml += '<div class="wf-detail-related"><div class="wf-detail-related-row">';
      if (prevChips) mainHtml += '<span class="wf-detail-related-label">이전</span>' + prevChips;
      if (nextChips) mainHtml += '<span class="wf-detail-related-label" style="margin-left:12px">다음</span>' + nextChips;
      mainHtml += '</div></div>';
    }}

    var html = '<div class="wf-detail-body">'
      + '<div class="wf-detail-side">' + sideHtml + '</div>'
      + '<div class="wf-detail-main">' + mainHtml + '</div>'
      + '</div>';

    panel.innerHTML = html;

    panel.querySelectorAll('.wf-detail-chip').forEach(function(chip){{
      chip.addEventListener('click', function(){{
        var target = document.getElementById(chip.getAttribute('data-target'));
        if (!target) return;
        target.scrollIntoView({{ behavior: 'smooth', block: 'center', inline: 'center' }});
        document.querySelectorAll('.wf-node.wf-selected').forEach(function(m){{ m.classList.remove('wf-selected'); }});
        target.classList.add('wf-selected');
        showDetail(target);
      }});
    }});
  }}

  function clearDetail(){{
    var panel = document.getElementById('wfDetail');
    if (panel) panel.innerHTML = '<p class="wf-detail-hint">노드를 클릭하거나 포커스를 이동하면 상세 정보가 여기에 표시됩니다.</p>';
    document.querySelectorAll('.wf-node.wf-selected').forEach(function(n){{ n.classList.remove('wf-selected'); }});
  }}

  function toggleDecree(){{
    decreeVisible = !decreeVisible;
    TOGGLE_FLAG = decreeVisible;
    document.querySelectorAll('#wfGridWrap .dec-node').forEach(function(n){{
      if (decreeVisible) n.removeAttribute('hidden'); else n.setAttribute('hidden', '');
    }});
    var btn = document.getElementById('decreeToggle');
    if (btn) {{
      btn.innerHTML = decreeVisible ? '-&nbsp;&nbsp;시행령' : '+&nbsp;&nbsp;시행령';
      btn.classList.toggle('on', decreeVisible);
    }}
    bindHover();
    draw();
    clearDetail();
  }}

  document.addEventListener('DOMContentLoaded', function(){{
    bindHover();
    draw();
    var btn = document.getElementById('decreeToggle');
    if (btn) btn.addEventListener('click', toggleDecree);
    document.querySelectorAll('.wf-node').forEach(function(n){{
      n.addEventListener('click', function(){{
        document.querySelectorAll('.wf-node.wf-selected').forEach(function(m){{ m.classList.remove('wf-selected'); }});
        n.classList.add('wf-selected');
        showDetail(n);
      }});
    }});
    window.addEventListener('resize', draw);
  }});
}})();
"""

    js = JS_TEMPLATE.format(
        edges=edges_json, decree_edges=decree_edges_json,
        gate_names=gate_names_json, articles=articles_json,
        decree_articles=decree_articles_json, legal_basis=legal_basis_json,
        law_mst=LAW_MST, decree_mst=DECREE_MST,
        law_name=json.dumps(LAW_NAME, ensure_ascii=False),
        decree_name=json.dumps(DECREE_NAME, ensure_ascii=False),
    )

    gate_heads = "".join(
        f'<div class="wf-gate-head"><span class="wf-lane-title">G{i}</span><span class="wf-lane-sub">{esc(g.split(" ",1)[1])}</span></div>'
        for i, g in enumerate(GATE_NAMES)
    )

    page = f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>산업 디지털 전환 및 인공지능 활용 촉진법 · LawMap</title>
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
    <h1><span class="law-current">산업 디지털 전환 및 인공지능 활용 촉진법</span><span class="law-sep">&gt;</span><a class="law-sibling" href="industrial-digital-transformation-act-decree.html">산업 디지털 전환 및 인공지능 활용 촉진법 시행령</a></h1>
    <p class="lead">{HERO_LEAD}</p>
    <div class="tags">
      <span class="tag">법률 제21250호(현행)</span>
      <span class="tag">공포 2025-12-30</span>
      <span class="tag">시행 2026-07-01</span>
      <span class="tag">일부개정</span>
      <span class="tag">소관 산업통상부</span>
      <span class="tag">전문 6장 30개조</span>
    </div>
  </div>
</section>

<section class="block">
  <div class="wrap">
    <h2 class="sec-title"><span class="no">1</span>구성</h2>
    <p class="sec-desc">
      이 법은 6개 장으로 구성되어 있습니다. 제3장(초록색)에 인공지능기본법 정의를 인용하는 제2조3의2호와
      관련된 산업데이터ㆍ산업인공지능 생태계 조성 조문들이 있습니다. 장 배지를 클릭하면 법령 원문 전체
      페이지가 해당 장의 첫 조문 위치로 이동합니다.
    </p>
  </div>

  <div class="chapter-flow">
{chapter_flow_html}
  </div>
</section>

<section class="block">
  <div class="wrap">
    <h2 class="sec-title"><span class="no">2</span>절차 구조도<button type="button" id="decreeToggle" class="decree-toggle">+&nbsp;&nbsp;시행령</button></h2>
    <p class="sec-desc">
      산업통상부장관의 정책수립부터 위원회 심의, 기업(전환기업등)의 참여, 지원기관 운영, 국가ㆍ지자체의
      재정지원까지 5개 주체 × 7단계(G0~G6)로 정리했습니다.
    </p>
  </div>

  <div class="wf-scroll">
    <div class="wf-grid-wrap" id="wfGridWrap">
      <svg class="wf-arrows" id="wfArrows">
        <defs>
          <marker id="wf-arrow" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto"><path d="M0,0 L7,4 L0,8 Z" fill="#8592a6"></path></marker>
          <marker id="wf-arrow-loop" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto"><path d="M0,0 L7,4 L0,8 Z" fill="#8592a6"></path></marker>
        </defs>
      </svg>
      <div class="wf-grid">
        <div class="wf-corner-head">주체 / 단계</div>
        {gate_heads}
        {grid_html}
      </div>
    </div>
  </div>

  <div class="wf-detail" id="wfDetail">
    <p class="wf-detail-hint">노드를 클릭하거나 포커스를 이동하면 상세 정보가 여기에 표시됩니다.</p>
  </div>
</section>

<section class="block">
  <div class="wrap">
    <h2 class="sec-title"><span class="no">3</span>관련 법령</h2>
    <p class="sec-desc">산업 디지털 전환 및 인공지능 활용 촉진법 조문 안에서 직접 인용되거나, 실무상 함께 검토해야 하는 법령입니다. 전체 연결 구조는 <a href="../index.html" style="color:var(--blue)">AI 관련 법 지도</a> 페이지를 참고하세요.</p>
    <div class="related-grid">
{RELATED_CHIPS}
    </div>
  </div>
</section>

<footer class="site-footer">
  <div class="wrap">
    <p class="footer-disclaimer">이 페이지는 법령 이해를 돕기 위한 학습·연구 참고 자료이며, 법률 자문이나 정부기관의 공식 해석을 대신하지 않습니다. 절차구조도의 행위자 주체 구분은 조문 해석에 따른 편집 관점이며 법령상 공식 분류가 아닙니다.</p>
    산업 디지털 전환 및 인공지능 활용 촉진법 &middot; 법률 제21250호 (2025-12-30 공포, 2026-07-01 시행) &middot; 기준일 2026-08-27
  </div>
</footer>

<script>{js}</script>

<!-- deeplink.js -->
<script src="../assets/deeplink.js"></script>
<!-- revision.js -->
<script src="../assets/revision.js"></script>
</body>
</html>
"""

    out_path = LAWS_DIR / "industrial-digital-transformation-act.html"
    out_path.write_text(page, encoding="utf-8")
    print("written:", out_path, "-", len(page), "chars")
    return ARTICLES, DECREE_ARTICLES, chapters


def main():
    law_data = fetch(LAW_MST)
    decree_data = fetch(DECREE_MST)
    build_page(law_data, decree_data)


if __name__ == "__main__":
    main()
