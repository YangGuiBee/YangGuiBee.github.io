# -*- coding: utf-8 -*-
"""
laws/ai-administrative-rules.html이 다루는 "AI 관련 행정규칙" 목록을 law.go.kr DRF API
(target=admrul, 키워드="인공지능")로 재조회해 assets/admrul-snapshot.json을 갱신한다.

build_law_snapshot.py(87개 법령용)와 같은 원칙을 따른다: HTML 페이지는 전혀 건드리지 않고,
"개정 이력"은 assets/admrul-revision.js가 이 JSON을 런타임에 fetch해서 렌더링한다.

다만 법령과 달리 행정규칙 24건은 laws/ai-administrative-rules.html 안에서 5개 카테고리
(법령 위임 고시 / 위원회·추진단 / 부처별 전담조직 / 업무처리 / 통계고시)로 사람이 직접
분류해 손으로 옮겨 적은 목록(scripts/build_admin_rules_page.py의 ITEMS)이다. 그래서 이
스크립트는 "새 항목이 생겼다/없어졌다/발령일자가 바뀌었다"만 감지해서 snapshot의 history에
기록할 뿐, 페이지의 카테고리 분류를 자동으로 바꾸지 않는다 — 새 항목이 감지되면 사람이
build_admin_rules_page.py의 ITEMS에 수동으로 분류해 추가해야 한다(무-지어내기: 카테고리는
사람이 원문을 읽고 판단할 사항이라 자동화하지 않음).
"""
import json
import time
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SNAPSHOT_PATH = ROOT / "assets" / "admrul-snapshot.json"
DRF_ENDPOINT = "http://www.law.go.kr/DRF/lawSearch.do"
QUERY = "인공지능"


def fmt_date(yyyymmdd):
    if not yyyymmdd or len(yyyymmdd) != 8:
        return yyyymmdd
    return f"{yyyymmdd[0:4]}-{yyyymmdd[4:6]}-{yyyymmdd[6:8]}"


def fetch_all():
    params = {"OC": "test", "target": "admrul", "type": "JSON", "query": QUERY, "display": "100"}
    url = DRF_ENDPOINT + "?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    rows = data.get("AdmRulSearch", {}).get("admrul", [])
    if isinstance(rows, dict):
        rows = [rows]
    items = []
    for r in rows:
        items.append({
            "name": r.get("행정규칙명", ""),
            "type": r.get("행정규칙종류", ""),
            "agency": r.get("소관부처명", ""),
            "date": fmt_date(r.get("발령일자", "")),
            "제개정구분명": r.get("제개정구분명", ""),
            "serial": r.get("행정규칙일련번호", ""),
        })
    return items


def main():
    snapshot = {"checked_at": "", "items": [], "history": []}
    if SNAPSHOT_PATH.exists():
        snapshot = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))

    today = datetime.now().strftime("%Y-%m-%d")

    try:
        current = fetch_all()
    except Exception as e:
        print("FETCH FAILED:", e)
        return

    prev_by_name = {it["name"]: it for it in snapshot.get("items", [])}
    curr_by_name = {it["name"]: it for it in current}

    added = sorted(set(curr_by_name) - set(prev_by_name))
    removed = sorted(set(prev_by_name) - set(curr_by_name))
    changed = []
    for name in sorted(set(curr_by_name) & set(prev_by_name)):
        a, b = prev_by_name[name], curr_by_name[name]
        if a.get("date") != b.get("date") or a.get("제개정구분명") != b.get("제개정구분명"):
            changed.append({
                "name": name,
                "from_date": a.get("date"), "to_date": b.get("date"),
                "from_type": a.get("제개정구분명"), "to_type": b.get("제개정구분명"),
            })

    has_diff = bool(added or removed or changed)
    if has_diff or not snapshot.get("items"):
        entry = {"date": today, "added": added, "removed": removed, "changed": changed}
        snapshot.setdefault("history", []).append(entry)

    snapshot["checked_at"] = today
    snapshot["items"] = current

    SNAPSHOT_PATH.parent.mkdir(parents=True, exist_ok=True)
    SNAPSHOT_PATH.write_text(
        json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    log_path = ROOT / "scripts" / "_last_admrul_run.log"
    lines = [
        f"checked_at: {today}",
        f"total items: {len(current)}",
        f"added: {len(added)}, removed: {len(removed)}, changed: {len(changed)}",
        "",
    ]
    for n in added:
        lines.append(f"- 신규: {n} (사람이 build_admin_rules_page.py의 ITEMS에 카테고리 분류 필요)")
    for n in removed:
        lines.append(f"- 삭제됨: {n} (페이지에서 사람이 카드 제거 필요)")
    for c in changed:
        lines.append(
            f"- 변경: {c['name']}: {c['from_date']}({c['from_type']}) -> {c['to_date']}({c['to_type']})"
        )
    log_path.write_text("\n".join(lines), encoding="utf-8")

    print(f"total: {len(current)}, added: {len(added)}, removed: {len(removed)}, changed: {len(changed)}")
    print(f"see {log_path} for details")


if __name__ == "__main__":
    main()
