# -*- coding: utf-8 -*-
"""
laws/*.html(wf-grid가 있는 87개 법령 페이지)의 법령명으로 law.go.kr DRF API를 조회해
현행 버전의 공포일자/시행일자/제개정구분을 확보하고 AILawMap/assets/law-snapshot.json에
법령명별 누적 배열로 저장한다.

HTML 페이지는 전혀 건드리지 않는다 — "개정 이력" 표시는 각 법령 페이지가 런타임에
이 JSON을 fetch해서 렌더링한다(assets/revision.js). 그래야 매주 실행되는 자동화가
"페이지 콘텐츠를 다시 쓰지 않는다"는 원칙(docs/plan-share-improvement.md 4장)을 지킨다.

주의(무-지어내기 원칙): law.go.kr DRF API에서 "총 개정 횟수"를 신뢰성 있게 얻을 수
있는 문서화된 경로를 확인하지 못했다(2026-08-26 조사, lawSearch.do의 nw=1/target=eflaw,
lawService.do의 target=eflaw/lsHistory 등 시도 — 전부 필터링 실패 또는 단일 버전
개정문만 반환). 따라서 "총 N회" 같은 숫자는 저장하지 않고, API로 확인 가능한 최근
개정 정보(제개정구분/공포일자/시행일자/공포번호)만 기록한다.
"""
import json
import re
import time
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
LAWS_DIR = ROOT / "laws"
SNAPSHOT_PATH = ROOT / "assets" / "law-snapshot.json"
DRF_ENDPOINT = "http://www.law.go.kr/DRF/lawSearch.do"

CONTENT_KEYS = ("제개정구분명", "공포일자", "시행일자", "공포번호", "법령ID")


def fmt_date(yyyymmdd):
    if not yyyymmdd or len(yyyymmdd) != 8:
        return yyyymmdd
    return f"{yyyymmdd[0:4]}-{yyyymmdd[4:6]}-{yyyymmdd[6:8]}"


def fetch_current_version(law_name):
    params = {"OC": "test", "target": "law", "type": "JSON", "query": law_name}
    url = DRF_ENDPOINT + "?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=15) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    rows = data.get("LawSearch", {}).get("law", [])
    if isinstance(rows, dict):
        rows = [rows]

    def norm(s):
        return re.sub(r"\s+", "", s or "")

    for row in rows:
        if norm(row.get("법령명한글")) == norm(law_name) or norm(row.get("법령약칭명")) == norm(law_name):
            return row
    return None


def to_entry(row, checked):
    return {
        "checked": checked,
        "제개정구분명": row.get("제개정구분명", ""),
        "공포일자": fmt_date(row.get("공포일자", "")),
        "시행일자": fmt_date(row.get("시행일자", "")),
        "공포번호": row.get("공포번호", ""),
        "법령ID": row.get("법령ID", ""),
    }


def content_equal(a, b):
    return all(a.get(k) == b.get(k) for k in CONTENT_KEYS)


def main():
    snapshot = {}
    if SNAPSHOT_PATH.exists():
        snapshot = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))

    today = datetime.now().strftime("%Y-%m-%d")
    changed = []
    failed = []
    checked_count = 0

    for path in sorted(LAWS_DIR.glob("*.html")):
        html = path.read_text(encoding="utf-8")
        soup = BeautifulSoup(html, "html.parser")
        if not soup.select_one("#wfGridWrap"):
            continue

        title = soup.find("title")
        if not title or not title.text:
            continue
        law_name = title.text.split(" · LawMap")[0].strip()
        checked_count += 1

        try:
            row = fetch_current_version(law_name)
        except Exception as e:
            failed.append((law_name, str(e)))
            continue
        if not row:
            failed.append((law_name, "no matching record"))
            continue

        entry = to_entry(row, today)
        history = snapshot.setdefault(law_name, [])
        if not history or not content_equal(history[-1], entry):
            history.append(entry)
            changed.append({
                "law": law_name,
                "before": history[-2] if len(history) > 1 else None,
                "after": entry,
            })

        time.sleep(0.2)  # law.go.kr에 부담 주지 않도록 소폭 지연

    SNAPSHOT_PATH.parent.mkdir(parents=True, exist_ok=True)
    SNAPSHOT_PATH.write_text(
        json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    log_path = ROOT / "scripts" / "_last_run.log"
    lines = [
        f"laws checked: {checked_count}",
        f"changed: {len(changed)}",
        f"failed: {len(failed)}",
        "",
    ]
    for c in changed:
        before = c["before"]
        before_desc = (
            f"{before['공포번호']}호 {before['시행일자']} 시행" if before else "(신규)"
        )
        after = c["after"]
        lines.append(
            f"- {c['law']}: {before_desc} -> {after['공포번호']}호 "
            f"{after['시행일자']} 시행 ({after['제개정구분명']})"
        )
    if failed:
        lines.append("")
        lines.append(f"failed ({len(failed)}):")
        for name, err in failed:
            lines.append(f"  - {name}: {err}")
    log_path.write_text("\n".join(lines), encoding="utf-8")

    print(f"laws checked: {checked_count}, changed: {len(changed)}, failed: {len(failed)}")
    print(f"see {log_path} for details")


if __name__ == "__main__":
    main()
