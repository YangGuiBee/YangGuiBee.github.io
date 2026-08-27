# -*- coding: utf-8 -*-
"""
laws/*.html(wf-grid가 있는 87개 법령 페이지) 목록 밖에 있는 "AI 관련 신규 법령 후보"를
law.go.kr DRF API(target=law, 키워드="인공지능")로 찾아 assets/law-candidates.json에 기록한다.

build_law_snapshot.py는 이미 페이지가 있는 87개 법령의 개정일자만 재확인할 뿐, 그 목록 밖의
새 법은 절대 발견하지 못한다. 이 스크립트는 반대로 매주 폭넓게 재검색해서 "지금 목록에 없는
법이 새로 생겼다/원래 있었는데 놓쳤다"를 사람에게 알리는 역할만 한다.

**페이지를 자동 생성하지 않는다.** 새 법의 wf-grid 절차구조도(주체×단계)는 법마다 손으로
설계해야 하는 작업이라([[feedback_lawmap_procedure_diagram_method]] 방식) 자동화 대상이
아니다 — 이 스크립트는 후보를 찾아서 PR로 알려주기만 하고, 실제로 페이지를 만들지는 사람이
원문을 읽고 판단한다.

한계(무-지어내기 원칙에 따라 명시): "인공지능" 키워드 제목 검색이라 법령명에 그 단어가 없는
관련법(예: 개인정보보호법ㆍ데이터산업법ㆍ저작권법처럼 주제로만 연결된 법)은 이 검색으로 못
찾는다. 반대로 관련성이 약한 법(예: 부칙에서만 스치듯 언급)이 걸릴 수도 있다 — 둘 다 최종
판단은 사람 몫이다.
"""
import json
import re
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LAWS_DIR = ROOT / "laws"
SNAPSHOT_PATH = ROOT / "assets" / "law-candidates.json"
DRF_ENDPOINT = "http://www.law.go.kr/DRF/lawSearch.do"
QUERY = "인공지능"

SUFFIXES = (" 시행규칙", " 시행령")


def base_name(name):
    for suf in SUFFIXES:
        if name.endswith(suf):
            return name[: -len(suf)]
    return name


def norm(s):
    return re.sub(r"\s+", "", s or "")


def fmt_date(yyyymmdd):
    if not yyyymmdd or len(yyyymmdd) != 8:
        return yyyymmdd
    return f"{yyyymmdd[0:4]}-{yyyymmdd[4:6]}-{yyyymmdd[6:8]}"


def known_base_names():
    """laws/*.html 중 wf-grid가 있는 페이지의 <title>에서 법령명을 뽑아, ' 시행령' 접미사를
    뗀 기저 법령명 집합을 만든다(build_law_snapshot.py와 같은 판단 기준: #wfGridWrap 존재)."""
    names = set()
    for path in LAWS_DIR.glob("*.html"):
        html = path.read_text(encoding="utf-8")
        if "#wfGridWrap" not in html and 'id="wfGridWrap"' not in html:
            continue
        m = re.search(r"<title>(.*?)</title>", html)
        if not m:
            continue
        title = m.group(1).split(" · LawMap")[0].strip()
        names.add(norm(base_name(title)))
    return names


def fetch_candidates():
    params = {"OC": "test", "target": "law", "type": "JSON", "query": QUERY, "display": "100"}
    url = DRF_ENDPOINT + "?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    rows = data.get("LawSearch", {}).get("law", [])
    if isinstance(rows, dict):
        rows = [rows]
    return rows


def main():
    snapshot = {"checked_at": "", "candidates": [], "history": []}
    if SNAPSHOT_PATH.exists():
        snapshot = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))

    today = datetime.now().strftime("%Y-%m-%d")
    known = known_base_names()

    try:
        rows = fetch_candidates()
    except Exception as e:
        print("FETCH FAILED:", e)
        return

    # 법률/시행령/시행규칙을 기저 법령명 기준으로 묶는다. 페이지 제목은 종종 정식 법령명이
    # 아니라 법령약칭명(예: "인공지능기본법")을 쓰므로, 두 이름 모두로 기저명을 만들어서
    # 매칭 키를 잡는다(둘 중 하나라도 known과 겹치면 이미 페이지가 있는 것으로 본다).
    family_keys = {}  # norm(기저명) -> family dict (정식명 기준 하나만 대표로 사용)
    for r in rows:
        name = r.get("법령명한글", "")
        abbr = r.get("법령약칭명", "") or name
        base = base_name(name)
        abbr_base = base_name(abbr)
        key = norm(base)
        fam = family_keys.setdefault(key, {"base_name": base, "abbr_base": abbr_base, "docs": []})
        fam["docs"].append({
            "name": name,
            "kind": r.get("법령구분명", ""),
            "agency": r.get("소관부처명", ""),
            "date": fmt_date(r.get("시행일자", "")),
        })

    new_candidates = []
    for key, fam in family_keys.items():
        if key in known or norm(fam["abbr_base"]) in known:
            continue
        new_candidates.append(fam)
    new_candidates.sort(key=lambda f: f["base_name"])

    prev_bases = {c["base_name"] for c in snapshot.get("candidates", [])}
    curr_bases = {c["base_name"] for c in new_candidates}
    newly_found = sorted(curr_bases - prev_bases)
    resolved = sorted(prev_bases - curr_bases)  # 사람이 페이지를 만들었거나, 검색결과에서 사라짐

    if newly_found or resolved or not snapshot.get("candidates"):
        snapshot.setdefault("history", []).append({
            "date": today,
            "newly_found": newly_found,
            "resolved": resolved,
        })

    snapshot["checked_at"] = today
    snapshot["candidates"] = new_candidates

    SNAPSHOT_PATH.parent.mkdir(parents=True, exist_ok=True)
    SNAPSHOT_PATH.write_text(
        json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    log_path = ROOT / "scripts" / "_last_law_candidates_run.log"
    lines = [
        f"checked_at: {today}",
        f"known laws (base names): {len(known)}",
        f"current candidates (87개 목록 밖): {len(new_candidates)}",
        f"newly found this run: {len(newly_found)}",
        f"resolved (더 이상 후보 아님): {len(resolved)}",
        "",
    ]
    for fam in new_candidates:
        docs_desc = ", ".join(f"{d['kind']}({d['date']})" for d in fam["docs"])
        agency = fam["docs"][0]["agency"] if fam["docs"] else ""
        lines.append(f"- {fam['base_name']} [{agency}] — {docs_desc}")
    log_path.write_text("\n".join(lines), encoding="utf-8")

    print(f"candidates: {len(new_candidates)}, newly_found: {len(newly_found)}, resolved: {len(resolved)}")
    print(f"see {log_path} for details")


if __name__ == "__main__":
    main()
