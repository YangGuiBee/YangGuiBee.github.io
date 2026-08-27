# -*- coding: utf-8 -*-
"""
laws/industrial-digital-transformation-act-decree.html을 생성한다.
generate_industrial_digital_transformation_act.py(법 페이지)와 같은 조문 데이터를 쓰되,
시행령(D-node)을 주 레이어로, 본법(P-node)을 토글 레이어로 뒤집는다
(sosang-basic-act-decree.html과 동일한 패턴).
"""
import json
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LAWS_DIR = ROOT / "laws"
DRF = "http://www.law.go.kr/DRF/lawService.do"

LAW_MST = "281883"
DECREE_MST = "287399"
LAW_NAME = "산업 디지털 전환 및 인공지능 활용 촉진법"
DECREE_NAME = "산업 디지털 전환 및 인공지능 활용 촉진법 시행령"


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


def art_url(law_name_kr, art_label):
    return "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/" + urllib.parse.quote(law_name_kr) + "/" + urllib.parse.quote(art_label)


def node(pcode, art_label, text, dec=None):
    return {"pcode": pcode, "art": art_label, "text": text, "dec": dec}


# 법 페이지(generate_industrial_digital_transformation_act.py)와 동일한 LANES 정의 —
# 위임쌍(dec=)이 있는 노드만 시행령 페이지에 실질적으로 나타난다.
LANES = [
    ("산업통상부장관(정책ㆍ감독기관)", {
        0: [node("P01", "제5조①③", "종합계획 수립(위원회 심의)", dec=("D01", "제3조", "위임사항(선도사업ㆍ규제개선ㆍ신산업육성 등)")),
            node("P02", "제6조①②③", "실태조사, 산업인공지능 수준진단", dec=("D02", "제4조", "실태조사 범위ㆍ수준진단 기준"))],
        1: [node("P03", "제10조①ㆍ제12조①", "산업데이터 활용촉진 지원, 표준화 추진"),
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

GATE_NAMES = [
    "G0 정책수립ㆍ실태조사", "G1 데이터생태계조성", "G2 선도사업지원",
    "G3 기반조성(센터ㆍ인력양성)", "G4 금융ㆍ국제협력", "G5 성과관리ㆍ안전", "G6 운영ㆍ보칙",
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
BASIC_EDGES = [
    {"from": "P01", "to": "P02", "kind": "solid"},
    {"from": "P05", "to": "P06", "kind": "solid"},
    {"from": "P07", "to": "P08", "kind": "solid"},
    {"from": "P11", "to": "P12", "kind": "solid"},
    {"from": "P12", "to": "P13", "kind": "solid"},
    {"from": "P16", "to": "P17", "kind": "solid"},
    {"from": "P20", "to": "P05", "kind": "dashed"},
    {"from": "P05", "to": "P16", "kind": "dashed"},
    {"from": "P06", "to": "P16", "kind": "dashed"},
    {"from": "P25", "to": "P05", "kind": "dashed"},
    {"from": "P22", "to": "P07", "kind": "dashed"},
    {"from": "P23", "to": "P11", "kind": "dashed"},
    {"from": "P01", "to": "P14", "kind": "dashed"},
]
# P15(위원회 심의사항)ㆍP21(규제개선 신청)ㆍP24(협회 법인격)는 시행령 위임(dec=)이
# 없어 이 페이지에 노드가 없으므로, 이들을 참조하는 엣지도 제외했다(법 페이지에는 있음).


def art_href_for(label, name):
    first = label.split("ㆍ")[0].split("①")[0].split("②")[0].split("③")[0].split("~")[0]
    return art_url(name, first)


def node_html(n):
    """시행령 페이지: dec가 있는 노드만 D를 주 레이어(표시), P를 토글 레이어(hidden)로 그린다.
    dec가 없는 노드(시행령 위임 없음)는 이 페이지에 실질적으로 나타나지 않는다(빈 셀)."""
    if not n["dec"]:
        return ""
    dcode, dart, dtext = n["dec"]
    dhref = art_href_for(dart, DECREE_NAME)
    phref = art_href_for(n["art"], LAW_NAME)
    html = (f'<div class="wf-node" id="{dcode}">'
            f'<div class="wf-node-top"><span class="pcode">{dcode}</span>'
            f'<a class="a" href="{dhref}" target="_blank" rel="noopener">{esc(dart)}</a></div>'
            f'<span class="t">{esc(dtext)}</span></div>')
    html += (f'<div class="wf-node dec-node" id="{n["pcode"]}" hidden>'
             f'<div class="wf-node-top"><span class="pcode">{n["pcode"]}</span>'
             f'<a class="a" href="{phref}" target="_blank" rel="noopener">{esc(n["art"])}</a></div>'
             f'<span class="t">{esc(n["text"])}</span></div>')
    return html


def build():
    law_data = fetch(LAW_MST)
    decree_data = fetch(DECREE_MST)
    ARTICLES = convert_articles(law_data["법령"]["조문"]["조문단위"])
    DECREE_ARTICLES = convert_articles(decree_data["법령"]["조문"]["조문단위"])

    grid_rows = []
    d_nodes = []
    for lane_name, gates in LANES:
        grid_rows.append(f'<div class="wf-gate-cell">{esc(lane_name)}</div>')
        for g in range(7):
            nodes = gates.get(g, [])
            cell_html = "".join(node_html(n) for n in nodes)
            grid_rows.append(f'<div class="wf-cell">{cell_html}</div>')
            for n in nodes:
                if n["dec"]:
                    d_nodes.append(n)
    grid_html = "\n        ".join(grid_rows)

    LEGAL_BASIS = {n["dec"][0]: [{"article": n["dec"][1], "text": n["dec"][2]}] for n in d_nodes}

    gate_heads = "".join(
        f'<div class="wf-gate-head"><span class="wf-lane-title">G{i}</span><span class="wf-lane-sub">{esc(g.split(" ",1)[1])}</span></div>'
        for i, g in enumerate(GATE_NAMES)
    )

    articles_json = json.dumps(ARTICLES, ensure_ascii=False)
    decree_articles_json = json.dumps(DECREE_ARTICLES, ensure_ascii=False)
    legal_basis_json = json.dumps(LEGAL_BASIS, ensure_ascii=False)
    decree_edges_json = json.dumps(DECREE_EDGES, ensure_ascii=False)
    basic_edges_json = json.dumps(BASIC_EDGES, ensure_ascii=False)
    gate_names_json = json.dumps(GATE_NAMES, ensure_ascii=False)

    js = """
(function(){{
  var EDGES = {decree_edges};
  var BASIC_EDGES = {basic_edges};

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

  var basicVisible = false;
  var TOGGLE_FLAG = false;

  function activeEdges(){{
    return basicVisible ? EDGES.concat(BASIC_EDGES) : EDGES;
  }}

  var GATE_NAMES = {gate_names};

  // 조문 원문. law.go.kr DRF(OC=test, MST={law_mst}, 산업 디지털 전환 및 인공지능 활용
  // 촉진법, 시행일 20260701판)에서 그대로 가져온 것.
  var ARTICLES = {articles};

  // 시행령 조문 원문. law.go.kr DRF(OC=test, MST={decree_mst}, 산업 디지털 전환 및
  // 인공지능 활용 촉진법 시행령, 시행일 20260701판)에서 그대로 가져온 것.
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

  function toggleBasic(){{
    basicVisible = !basicVisible;
    TOGGLE_FLAG = basicVisible;
    document.querySelectorAll('#wfGridWrap .dec-node').forEach(function(n){{
      if (basicVisible) n.removeAttribute('hidden'); else n.setAttribute('hidden', '');
    }});
    var btn = document.getElementById('basicToggle');
    if (btn) {{
      btn.innerHTML = basicVisible ? '-&nbsp;&nbsp;본법' : '+&nbsp;&nbsp;본법';
      btn.classList.toggle('on', basicVisible);
    }}
    bindHover();
    draw();
    clearDetail();
  }}

  document.addEventListener('DOMContentLoaded', function(){{
    bindHover();
    draw();
    var btn = document.getElementById('basicToggle');
    if (btn) btn.addEventListener('click', toggleBasic);
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
""".format(
        decree_edges=decree_edges_json, basic_edges=basic_edges_json,
        gate_names=gate_names_json, articles=articles_json,
        decree_articles=decree_articles_json, legal_basis=legal_basis_json,
        law_mst=LAW_MST, decree_mst=DECREE_MST,
        law_name=json.dumps(LAW_NAME, ensure_ascii=False),
        decree_name=json.dumps(DECREE_NAME, ensure_ascii=False),
    )

    page = f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>산업 디지털 전환 및 인공지능 활용 촉진법 시행령 · LawMap</title>
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
    <h1><a class="law-sibling" href="industrial-digital-transformation-act.html">산업 디지털 전환 및 인공지능 활용 촉진법</a><span class="law-sep">&gt;</span><span class="law-current">산업 디지털 전환 및 인공지능 활용 촉진법 시행령</span></h1>
    <p class="lead">
      산업 디지털 전환 및 인공지능 활용 촉진법이 "대통령령으로 정한다"고 위임한 사항(선도사업 선정ㆍ지원 절차,
      위원회 운영, 지원센터ㆍ전담기관 지정요건, 국제협력 세부업무 등)을 구체화하는 하위법령입니다. (제1조 목적)
    </p>
    <div class="tags">
      <span class="tag">대통령령 제36467호(현행)</span>
      <span class="tag">공포 2026-06-30</span>
      <span class="tag">시행 2026-07-01</span>
      <span class="tag">일부개정</span>
      <span class="tag">소관 산업통상부</span>
      <span class="tag">전문 16개조</span>
    </div>
  </div>
</section>

<section class="block">
  <div class="wrap">
    <h2 class="sec-title"><span class="no">1</span>구성</h2>
    <p class="sec-desc">
      법령 원문에 공식 장(章) 구분이 없어, 본법 장 구성에 대응해 조문 범위를 묶었습니다. 배지를 클릭하면
      법령 원문 전체 페이지가 해당 조문 위치로 이동합니다.
    </p>
  </div>

  <div class="chapter-flow">
    <a class="ch" href="{art_url(DECREE_NAME, '제1조')}" target="_blank" rel="noopener"><div class="no">그룹1 · 제1~2조의2</div><h4>총칙</h4><p>목적, 산업인공지능의 활용범위, 국가기관등의 범위</p></a>
    <div class="arrow">→</div>
    <a class="ch ai-note" href="{art_url(DECREE_NAME, '제3조')}" target="_blank" rel="noopener"><div class="no">그룹2 · 제3~6조</div><h4>정책수립ㆍ위원회</h4><p>종합계획 세부사항, 실태조사ㆍ수준진단, 위원회 구성, 전문위원회</p></a>
    <div class="arrow">→</div>
    <a class="ch" href="{art_url(DECREE_NAME, '제7조')}" target="_blank" rel="noopener"><div class="no">그룹3 · 제7~10조</div><h4>선도사업ㆍ규제개선</h4><p>선도사업 선정, 지원, 규제개선 심의, 관리ㆍ감독</p></a>
    <div class="arrow">→</div>
    <a class="ch" href="{art_url(DECREE_NAME, '제11조')}" target="_blank" rel="noopener"><div class="no">그룹4 · 제11~13조</div><h4>기반조성</h4><p>지원센터 지정, 전문인력 양성, 국제협력</p></a>
    <div class="arrow">→</div>
    <a class="ch" href="{art_url(DECREE_NAME, '제14조')}" target="_blank" rel="noopener"><div class="no">그룹5 · 제14~16조</div><h4>운영ㆍ위임위탁</h4><p>전담기관 지정, 협회 설립인가, 권한의 위임 및 위탁</p></a>
  </div>
</section>

<section class="block">
  <div class="wrap">
    <h2 class="sec-title"><span class="no">2</span>절차 구조도<button type="button" id="basicToggle" class="decree-toggle">+&nbsp;&nbsp;본법</button></h2>
    <p class="sec-desc">
      시행령이 구체화한 절차를 중심으로 그린 흐름도입니다. <a href="industrial-digital-transformation-act.html" style="color:var(--blue)">산업 디지털 전환 및 인공지능 활용 촉진법</a>
      페이지와 같은 5개 주체 × 7단계(G0~G6) 축을 사용하며, 위임 조문이 있는 셀만 표시됩니다.
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
    <div class="related-grid">
    <div class="related-chip"><div class="rel">모법(위임근거)</div><div class="name"><a href="industrial-digital-transformation-act.html" style="color:var(--blue)">산업 디지털 전환 및 인공지능 활용 촉진법</a></div></div>
    <div class="related-chip ai-note"><div class="rel">본법 제2조3의2호가 인용하는 "인공지능" 정의 근거</div><div class="name"><a href="ai-basic-act.html" style="color:var(--blue)">인공지능기본법</a></div></div>
    </div>
  </div>
</section>

<footer class="site-footer">
  <div class="wrap">
    <p class="footer-disclaimer">이 페이지는 법령 이해를 돕기 위한 학습·연구 참고 자료이며, 법률 자문이나 정부기관의 공식 해석을 대신하지 않습니다. 절차구조도의 행위자 주체 구분은 조문 해석에 따른 편집 관점이며 법령상 공식 분류가 아닙니다.</p>
    산업 디지털 전환 및 인공지능 활용 촉진법 시행령 &middot; 대통령령 제36467호 (2026-06-30 공포, 2026-07-01 시행) &middot; 기준일 2026-08-27
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

    out_path = LAWS_DIR / "industrial-digital-transformation-act-decree.html"
    out_path.write_text(page, encoding="utf-8")
    print("written:", out_path, "-", len(page), "chars")


if __name__ == "__main__":
    build()
