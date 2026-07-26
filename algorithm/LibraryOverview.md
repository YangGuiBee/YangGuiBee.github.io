# AI 모델 라이브러리 현황 정리 — algorithms.html · library.html · news.html

> `List2.md`(전체 687개 세부 알고리즘 목록) 대비, 현재 웹사이트에 실제 구현된 것은 6개뿐입니다.
> 이 문서는 세 페이지가 지금 어떻게 연결되어 있고, 무엇이 아직 안 되어 있는지를 정리한 것입니다.

---

## 1. 세 페이지의 역할

| 페이지 | 역할 | 데이터 소스 | 갱신 방식 |
|---|---|---|---|
| [algorithms.html](../algorithms.html) | 교과서 — 알고리즘별 개요·예제·사례 | `algorithms.js`에 하드코딩 | 코드 수정 시에만 갱신 (정적) |
| [library.html](../library.html) | 링크 라이브러리 — 알고리즘별 공식 문서·강의 링크 | `library.js`에 하드코딩 | 코드 수정 시에만 갱신 (정적) |
| [news.html](../news.html) | 최신 논문 피드 | Google Sheets (Apps Script JSONP) | 매일 자동 수집 (실시간에 가장 가까움) |

---

## 2. 현재 구현된 6개 알고리즘 — 교차 참조

| 분류 | 알고리즘 | id (공통 키) | algorithms.html | library.html 출처 수 | news.html 연동 |
|---|---|---|---|---|---|
| 지도학습 | 선형 회귀 | `linear-regression` | ✅ 개요·예제·사례 | 3개 (sklearn×2, Coursera) | ❌ |
| 지도학습 | 결정트리 | `decision-tree` | ✅ | 4개 (sklearn×2, Kaggle, Coursera) | ❌ |
| 비지도학습 | K-평균 군집화 | `kmeans` | ✅ | 3개 (sklearn×2, Coursera) | ❌ |
| 비지도학습 | PCA | `pca` | ✅ | 3개 (sklearn×2, Coursera) | ❌ |
| 강화학습 | Q-러닝 | `q-learning` | ✅ | 4개 (HF, PyTorch, Kaggle, Coursera) | ❌ |
| 강화학습 | 정책 경사법 | `policy-gradient` | ✅ | 2개 (HF×2) | ❌ |

---

## 3. 연결 메커니즘 — 있는 것과 없는 것

### ✅ 이미 연결됨: algorithms.html ↔ library.html
`algorithms.js`와 `library.js`가 알고리즘마다 **동일한 `id`와 `category`(sup/unsup/rl)** 를 쓰고 있어서, 사실상 같은 알고리즘을 가리키는 두 데이터셋이 이미 키로 묶여 있습니다. 단, 지금은 화면상에서 서로를 오가는 링크(예: 교과서 카드에서 "관련 공식 문서 보기" 버튼)는 아직 없고, 데이터 구조만 준비된 상태입니다.

### ❌ 아직 연결 안 됨: news.html
`news.js`는 Google Sheets의 `카테고리` 컬럼(머신러닝 / AI거버넌스)만으로 필터링합니다 — **개별 알고리즘 단위 태그가 없습니다.** 그래서 "Q-러닝" 카드에서 "Q-러닝 관련 최신 논문 보기"로 바로 연결하는 건 지금 구조로는 불가능하고, Google Sheets에 알고리즘 태그 컬럼을 추가해야 합니다. (CLAUDE.md 규칙상 기존 컬럼 순서는 바꿀 수 없으므로, 추가한다면 맨 뒤에 새 컬럼으로 붙여야 합니다.)

---

## 4. `List2.md` 대비 커버리지

- `List2.md` 전체 세부 알고리즘: **687개**
- 현재 사이트에 구현된 것: **6개** (지도 2 · 비지도 2 · 강화학습 2)
- 커버리지: 약 **0.9%**

즉 지금의 `algorithms.html`/`library.html`은 "전체 커리큘럼의 축소 프로토타입" 단계이고, `List2.md`가 향후 확장의 로드맵 역할을 합니다.

---

## 5. 다음 단계 제안 (우선순위)

1. **교과서 ↔ 라이브러리 상호 링크 추가**: 이미 같은 `id`를 쓰고 있으니, `algorithms.html` 카드에 "공식 문서 보기(library.html#id)" 버튼 하나만 추가해도 즉시 연결 가능 (신규 데이터 불필요)
2. **`List2.md` 순서대로 확장**: 각 대분류에서 2개씩만 구현된 상태이므로, 다음 후보는 로지스틱회귀·SVM(지도학습), DBSCAN·계층적군집화(비지도학습), SARSA·DQN(강화학습) 등
3. **news.html 알고리즘 태그 도입**: Google Sheets에 `알고리즘태그` 컬럼을 추가하고, `algorithms.js`의 `id`를 그대로 태그값으로 재사용하면 세 페이지가 완전히 맞물림 (Apps Script `appsscript.js` 수정 필요 — 전체 소스 제공 원칙에 따라 별도로 진행)
