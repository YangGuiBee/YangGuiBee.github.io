# -*- coding: utf-8 -*-
"""
collect_dbpia.py
================
DBpia Open API(검색 API)로 "AI" + "거버넌스" 논문 목록을 한 번에 수집해
뷰어(AI거버넌스_논문관리.html)가 읽는 papers.json 으로 저장합니다.

■ 준비 (1회)
  1) https://api.dbpia.co.kr 에서 회원가입 후 "검색 API" 인증키(apikey) 발급
  2) 아래 API_KEY 값에 발급받은 키를 붙여넣기 (또는 실행 시 인자로 전달)

■ 실행
  python collect_dbpia.py                # 스크립트 안의 API_KEY 사용
  python collect_dbpia.py 발급받은키값     # 키를 인자로 전달

  - 표준 라이브러리만 사용합니다(별도 설치 불필요, Python 3.7+).
  - 100건씩 페이지를 자동으로 넘기며 전체 결과를 수집합니다.
  - 기존 papers.json 이 있으면 병합합니다:
      * 이미 있는 논문(같은 URL/ID)의 기존 요약(summary)은 보존
      * 새로 검색된 논문만 추가 (summary 는 빈 상태 → 이후 별도로 생성)

■ 참고
  - 검색 API 응답에는 초록이 포함되지 않습니다. 500자요약 등 요약 항목은
    이 스크립트로 목록을 채운 뒤 논문별로 따로 생성하는 것을 권장합니다.
  - DBpia 웹의 "원문만 보기(OTXT_OFFR_YN=Y)" 필터는 Open API에 동일 옵션이
    없어, 총 건수가 웹 화면(695건)과 다소 다를 수 있습니다. 필요 시
    SEARCH_TERM / ITYPE 등을 조정하세요.
"""

import sys, os, re, time, json, urllib.parse, urllib.request
import xml.etree.ElementTree as ET
from datetime import date

# ─────────────────────────── 설정 ───────────────────────────
API_KEY     = "여기에_발급받은_API_KEY_붙여넣기"   # 또는 실행 인자로 전달
SEARCH_TERM = "AI 거버넌스"          # "AI" 와 "거버넌스" (공백 = AND)
PAGE_SIZE   = 100                    # 페이지당 건수
SORT_TYPE   = 2                      # 1=유사도 2=발행일 3=인기도
REQUEST_URL = "http://api.dbpia.co.kr/v2/search/search.xml"
OUT_PATH    = os.path.join(os.path.dirname(os.path.abspath(__file__)), "papers.json")
SLEEP_SEC   = 0.7                    # 페이지 사이 대기(요청 제한 방지)
# ────────────────────────────────────────────────────────────


def build_url(page):
    params = {
        "key": API_KEY,
        "target": "se",
        "searchall": SEARCH_TERM,
        "pagecount": PAGE_SIZE,
        "pagenumber": page,
        "sorttype": SORT_TYPE,
        "sortorder": "desc",
    }
    return REQUEST_URL + "?" + urllib.parse.urlencode(params, encoding="utf-8")


def fetch(page):
    url = build_url(page)
    req = urllib.request.Request(url, headers={"User-Agent": "dbpia-list-collector/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def child_val(el, tag):
    """el 하위에서 tag의 name 속성 또는 child text 또는 attribute를 관대하게 추출."""
    if el is None:
        return ""
    node = el.find(tag)
    if node is not None:
        if node.get("name"):
            return node.get("name").strip()
        if (node.text or "").strip():
            return node.text.strip()
    if el.get(tag):
        return el.get(tag).strip()
    return ""


def parse_items(xml_text):
    """XML 문자열에서 (totalcount, [record,...]) 반환."""
    root = ET.fromstring(xml_text)

    # 에러 응답 처리 (예: <error><code>E0001</code><message>...</message></error>)
    err = root.find(".//error")
    if err is not None:
        code = (err.findtext("code") or "").strip()
        msg = (err.findtext("message") or err.text or "").strip()
        raise RuntimeError("API 오류 %s: %s" % (code, msg))

    total_txt = ""
    for t in root.iter():
        if t.tag.lower().endswith("totalcount") and (t.text or "").strip():
            total_txt = t.text.strip(); break
    total = int(re.sub(r"[^0-9]", "", total_txt) or 0)

    records = []
    for item in root.iter("item"):
        title = (item.findtext("title") or "").strip()

        # 저자: <authors><author name="..."/></authors>
        names = []
        for a in item.iter("author"):
            nm = a.get("name") or (a.text or "")
            if nm.strip():
                names.append(nm.strip())
        authors = ", ".join(names)

        publisher = ""
        pub_pub = item.find("publisher")
        if pub_pub is not None:
            publisher = pub_pub.get("name", "") or child_val(item, "publisher")

        pub_el = item.find("publication")
        journal = (pub_el.get("name") if pub_el is not None and pub_el.get("name")
                   else child_val(item, "publication"))

        # 발행연월: <issue yymm="2024.7"/> 또는 child
        year = ""
        iss = item.find("issue")
        if iss is not None:
            year = iss.get("yymm") or child_val(item, "issue") or ""
        year = year.strip()

        link = (item.findtext("link_url") or "").strip()
        if not link:  # 혹시 속성으로 오는 경우
            lu = item.find("link_url")
            if lu is not None:
                link = (lu.get("url") or "").strip()

        # ID: 상세 URL의 숫자/노드 식별자
        m = re.search(r"(?:ArticleDetail/|nodeId=)([A-Za-z0-9]+)", link)
        pid = m.group(1) if m else (link or title)

        if not title:
            continue
        records.append({
            "id": pid,
            "title": title,
            "authors": authors,
            "year": year,
            "publisher": publisher,
            "journal": journal,
            "url": link,
            "keywords": [],
            "abstract": "",
            "summary": {}      # 500자요약 등은 이후 단계에서 생성
        })
    return total, records


def load_existing(path):
    if not os.path.exists(path):
        return {}
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        return {p.get("id") or p.get("url"): p for p in data.get("papers", [])}
    except Exception:
        return {}


def main():
    key = sys.argv[1] if len(sys.argv) > 1 else API_KEY
    if not key or key.startswith("여기에"):
        print("[중지] API_KEY 가 설정되지 않았습니다. 스크립트 상단 API_KEY 값을 넣거나\n"
              "       python collect_dbpia.py 발급받은키값  형태로 실행하세요.")
        sys.exit(1)
    globals()["API_KEY"] = key

    existing = load_existing(OUT_PATH)
    print("기존 papers.json 논문 수: %d" % len(existing))

    all_new = {}
    page = 1
    total = None
    while True:
        print("· %d페이지 요청..." % page, end=" ", flush=True)
        xml_text = fetch(page)
        try:
            total, recs = parse_items(xml_text)
        except ET.ParseError:
            print("\n[오류] XML 파싱 실패. 응답 앞부분:\n", xml_text[:500]); sys.exit(2)
        print("%d건 수신 (전체 %d건)" % (len(recs), total))
        if not recs:
            break
        for r in recs:
            all_new[r["id"]] = r
        if total and len(all_new) >= total:
            break
        page += 1
        if page > 200:   # 안전장치
            break
        time.sleep(SLEEP_SEC)

    # 병합: 기존 요약 보존 + 신규 추가
    merged = dict(existing)
    added = 0
    for pid, rec in all_new.items():
        if pid in merged:
            # 메타는 최신으로 갱신하되 기존 요약/초록은 유지
            keep = merged[pid]
            rec["summary"] = keep.get("summary") or {}
            rec["abstract"] = keep.get("abstract") or ""
            rec["keywords"] = keep.get("keywords") or rec["keywords"]
            merged[pid] = rec
        else:
            merged[pid] = rec
            added += 1

    papers = list(merged.values())
    # 발행일 내림차순 정렬(연월 기준)
    def ykey(p):
        m = re.findall(r"\d+", p.get("year", ""))
        return (int(m[0]) if m else 0, int(m[1]) if len(m) > 1 else 0)
    papers.sort(key=ykey, reverse=True)

    out = {
        "meta": {
            "keyword": SEARCH_TERM,
            "source": "DBpia Open API (api.dbpia.co.kr)",
            "lastUpdated": date.today().isoformat(),
            "note": ("DBpia Open API 검색 결과로 수집한 목록입니다. 검색 API에는 초록이 "
                     "포함되지 않아 요약(500자요약 등)은 별도 단계에서 생성합니다. "
                     "뷰어의 [갱신] 버튼이 이 papers.json 을 읽어 신규 논문을 합칩니다.")
        },
        "papers": papers
    }
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    print("\n완료 ✅  전체 %d건 저장 (신규 %d건 추가)" % (len(papers), added))
    print("저장 위치: %s" % OUT_PATH)


if __name__ == "__main__":
    main()
