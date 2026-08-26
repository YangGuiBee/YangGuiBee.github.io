# -*- coding: utf-8 -*-
"""
laws/*.html(wf-grid가 있는 87개 법령 페이지)를 스캔해 검색용 JSON 인덱스를 만들고,
각 페이지 </body> 직전에 assets/deeplink.js·assets/revision.js 로드 태그를 삽입한다
(중복 삽입 방지 마커 사용).

산출물: AILawMap/assets/search-index.json
"""
import json
import re
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
LAWS_DIR = ROOT / "laws"
OUT_PATH = ROOT / "assets" / "search-index.json"

COMMON_SCRIPTS = [
    ("<!-- deeplink.js -->", '<script src="../assets/deeplink.js"></script>'),
    ("<!-- revision.js -->", '<script src="../assets/revision.js"></script>'),
]


def extract_law_name(soup):
    title = soup.find("title")
    if not title or not title.text:
        return None
    return title.text.split(" · LawMap")[0].strip()


def extract_entries(soup):
    entries = []
    for node in soup.select(".wf-node"):
        node_id = node.get("id")
        if not node_id:
            continue
        classes = node.get("class", [])
        if "dec-node" in classes:
            # dec-node는 본법/시행령 상대 페이지 조문을 토글로 보여주는 참조 배지일 뿐,
            # 같은 id의 "진짜" 조문은 반대쪽 페이지에 dec-node가 아닌 형태로 이미 존재한다
            # (전수 확인: 35쌍 전부 mismatch 0). 검색결과 중복을 막기 위해 여기서는 제외.
            continue
        pcode_el = node.select_one(".pcode")
        text_el = node.select_one(".t")
        pcode = pcode_el.get_text(strip=True) if pcode_el else ""
        text = text_el.get_text(strip=True) if text_el else ""
        if not pcode and not text:
            continue
        entries.append({"id": node_id, "pcode": pcode, "text": text})
    return entries


def inject_common_scripts(html):
    if "</body>" not in html:
        return html, False
    changed = False
    for marker, tag in COMMON_SCRIPTS:
        if marker in html:
            continue
        html = html.replace("</body>", f"{marker}\n{tag}\n</body>", 1)
        changed = True
    return html, changed


def main():
    index = []
    touched = 0
    for path in sorted(LAWS_DIR.glob("*.html")):
        html = path.read_text(encoding="utf-8")
        soup = BeautifulSoup(html, "html.parser")

        # wf-grid가 없는 페이지(현재는 ai-guidelines.html 하나)는 이번 스코프에서 제외
        if not soup.select_one("#wfGridWrap"):
            continue

        name = extract_law_name(soup)
        entries = extract_entries(soup)
        if not name or not entries:
            continue

        rel_path = f"laws/{path.name}"
        index.append({"name": name, "path": rel_path, "entries": entries})

        new_html, changed = inject_common_scripts(html)
        if changed:
            path.write_text(new_html, encoding="utf-8")
            touched += 1

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(
        json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    total_entries = sum(len(law["entries"]) for law in index)
    print(f"laws indexed: {len(index)}")
    print(f"total wf-node entries: {total_entries}")
    print(f"pages newly patched with common scripts: {touched}")
    print(f"written: {OUT_PATH}")


if __name__ == "__main__":
    main()
