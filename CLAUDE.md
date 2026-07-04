# AI Study — Claude Code 하네스 룰

> 건국대학교 공학대학원 AI 전공 · Yang Hee Jung 겸임교수
> 사이트: https://yangguibee.github.io

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 호스팅 | GitHub Pages (정적 HTML/CSS/JS, 빌드 도구 없음) |
| 백엔드 | Google Apps Script Web App (서버리스) |
| 데이터베이스 | Google Sheets (강의문의 / 강의요청 / 뉴스 시트) |
| 배포 | `deploy.ps1` 실행 → 캐시 버스팅 자동화 + git push + 버전 태그 |
| 언어 | 한국어 (설명, 주석, 사용자 메시지 모두 한국어) |

---

## 2. 커뮤니케이션 규칙

- **설명은 항상 한국어**로 작성한다.
- Apps Script 소스를 변경할 때는 **전체 소스**를 항상 제공한다 (부분 발췌 금지).
- 코드 변경 후 관련 파일을 명시하고 변경 이유를 한 줄로 설명한다.

---

## 3. 핵심 코딩 원칙 (Famous Rules 적용)

### DRY — Don't Repeat Yourself
- `SCRIPT_URL`은 **`config.js` 한 곳에서만** 선언한다. 다른 JS 파일에 직접 URL을 하드코딩하지 않는다.
- 공통 nav 로직은 **`nav.js` 한 곳에서만** 관리한다.

### KISS — Keep It Simple, Stupid
- **프레임워크(React, Vue 등)를 도입하지 않는다.** 순수 HTML/CSS/JS를 유지한다.
- Google Apps Script는 GitHub Pages의 백엔드 역할로 충분하다. 별도 서버 추가를 지양한다.
- 복잡한 추상화보다 읽기 쉬운 직접 코드를 선택한다.

### YAGNI — You Ain't Gonna Need It
- 현재 요구사항에 없는 기능은 미리 구현하지 않는다.
- 현재 규모(강의 문의, 논문 수집)에서 Google Sheets 이외의 DB는 불필요하다.

### SRP — Single Responsibility Principle
- 각 JS 파일은 하나의 역할만 담당한다:

  | 파일 | 역할 |
  |------|------|
  | `config.js` | SCRIPT_URL 전역 상수만 |
  | `nav.js` | 햄버거 메뉴 토글만 |
  | `contact.js` | 강의문의 폼 + 관리자 패널 |
  | `news.js` | AI논문 카드 렌더링 + 검색 |
  | `main.js` | 메인 페이지 인터랙션만 |

### Separation of Concerns — 관심사 분리
- **설정**: `config.js` (URL)
- **스타일**: `style.css` (공통), 페이지별 CSS (개별)
- **로직**: 각 페이지별 JS
- **데이터**: Google Sheets (Apps Script가 접근)

### Fail Fast — 경계에서 검증
- 사용자 입력 검증은 **폼 제출 시점**에 즉시 수행한다.
- JSONP 응답이 null이거나 `result.ok === false`이면 즉시 오류 메시지를 표시한다.
- Apps Script에서 예외는 `try/catch`로 잡아 `{ ok: false, msg }` 형식으로 반환한다.

### Boy Scout Rule — 지나친 곳은 더 깨끗하게
- 버그 수정 시 해당 함수 주변의 명백한 개선점도 함께 수정한다.
- 단, 범위를 과도하게 넓히지 않는다 (YAGNI와 균형).

---

## 4. 파일 구조 및 역할

```
C:\AI\
├── index.html          # 메인 (히어로 + 강사 프로필)
├── courses.html        # 강의소개
├── notice.html         # 공지사항
├── resources.html      # 자료실
├── faq.html            # FAQ
├── contact.html        # 강의문의 + 관리자 패널
├── news.html           # AI논문 브라우저
│
├── config.js           # ★ SCRIPT_URL 단일 관리 (수정 시 여기만)
├── nav.js              # 공통 햄버거 메뉴 (모든 페이지 로드)
├── main.js             # index.html 전용 인터랙션
├── contact.js          # 강의문의 로직 (OTP, CRUD, 관리자)
├── news.js             # AI논문 로직 (JSONP, 탭, 검색)
│
├── style.css           # 공통 스타일 (nav, hero, 반응형)
├── contact.css         # 강의문의 전용 스타일
├── news.css            # AI논문 전용 스타일
│
├── deploy.ps1          # ★ 배포 스크립트 (캐시 버스팅 자동화)
└── docs/
    └── workflow.html   # 프로젝트 워크플로우 문서
```

---

## 5. HTML 페이지 추가 규칙

새 페이지를 만들 때 반드시 포함해야 할 항목:

```html
<!-- 1. nav에 햄버거 버튼 포함 -->
<nav class="nav">
  <div class="nav-inner">
    <a href="index.html" class="logo">AI <span>Study</span></a>
    <ul class="nav-links">...</ul>
    <a href="contact.html" class="nav-cta">강의 문의</a>
    <button class="nav-hamburger" id="navHamburger"
            aria-label="메뉴 열기" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<!-- 2. Apps Script 연동 시 config.js 먼저 로드 -->
<script src="config.js"></script>
<script src="페이지.js?v=1"></script>

<!-- 3. nav.js는 항상 마지막에 로드 -->
<script src="nav.js"></script>
```

---

## 6. Apps Script (백엔드) 규칙

### 통신 패턴
- **읽기**: JSONP (`doGet` → `callback(JSON)`) — CORS 우회
- **쓰기**: `fetch(SCRIPT_URL, { method:'POST', mode:'no-cors' })` — 응답 없음

### 필수 패턴
```javascript
// doGet: 모든 액션은 action 파라미터로 분기
function doGet(e) {
  const action = e.parameter.action || '';
  const cb     = e.parameter.callback || 'cb';
  // ...
  return ContentService
    .createTextOutput(cb + '(' + JSON.stringify(result) + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

// doPost: 반드시 'ok' 텍스트 반환 (no-cors는 응답 읽기 불가)
function doPost(e) {
  // ...
  return ContentService.createTextOutput('ok');
}
```

### OpenReview API 호환성
- `valOf(v)` 헬퍼 필수 사용: v1(`"string"`)과 v2(`{value:"..."}`) 형식 모두 처리

### 수정 시 규칙
- Apps Script 소스를 수정할 때는 **전체 소스를 항상 제공**한다.
- 배포 후 새 URL이 생기면 **`config.js`만 수정**한다.

---

## 7. Google Sheets 스키마 (고정)

### 강의문의 시트 (9컬럼)
```
[0]timestamp [1]type [2]name [3]email [4]subject
[5]question  [6]status [7]answeredAt [8]replyText
```

### 강의요청 시트 (13컬럼)
```
[0]timestamp [1]type  [2]name(topic) [3]email   [4]reqName
[5]org       [6]place [7]date        [8]people  [9]message
[10]status   [11]answeredAt          [12]replyText
```

### 뉴스 시트 (9컬럼)
```
[0]수집일자 [1]카테고리 [2]제목    [3]발행일자 [4]저자
[5]발행처   [6]원문링크 [7]Stars   [8]초록
```

> **컬럼 순서 변경 시 Apps Script의 인덱스 참조도 반드시 함께 수정한다.**

---

## 8. 캐시 버스팅 & 배포 규칙

- **`?v=숫자`를 수동으로 변경하지 않는다.** `deploy.ps1`이 자동으로 처리한다.
- 모든 배포는 `deploy.ps1`을 통해 수행한다:
  ```powershell
  cd C:\AI
  .\deploy.ps1                              # 버전 자동 증가
  .\deploy.ps1 -Version v2.0 -Message "..."  # 버전 직접 지정
  ```
- 배포 시 git 태그가 자동 생성된다 (형상관리).

### 롤백
```powershell
git checkout v1.0   # 특정 버전으로 전환
git checkout main   # 최신으로 복귀
```

---

## 9. 보안 규칙

- **관리자 비밀번호**: SHA-256 해시로 `contact.js`에 저장. 평문 절대 금지.
- **OTP**: CacheService TTL 600초. 만료 후 자동 삭제.
- **ADMIN_EMAIL**: Apps Script 내 상수(`const ADMIN_EMAIL`)로만 관리. 클라이언트 JS 노출 금지.
- **XSS 방어**: 사용자 입력은 항상 `esc()` 함수로 이스케이프 후 innerHTML에 삽입.
  ```javascript
  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
                    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  ```

---

## 10. 금지 사항

| 금지 | 이유 |
|------|------|
| `contact.js` / `news.js`에 SCRIPT_URL 직접 선언 | DRY 위반 — `config.js` 사용 |
| `?v=숫자` 수동 변경 | `deploy.ps1` 자동화 목적 위반 |
| React / Vue 등 프레임워크 도입 | KISS 위반 — 빌드 파이프라인 불필요 |
| Apps Script 부분 소스만 제공 | 전체 소스 제공 원칙 위반 |
| GitHub Pages에 서버/DB 도입 시도 | 정적 호스팅만 지원 |
| Google Sheets 컬럼 순서 임의 변경 | rowToObj 인덱스 참조 파괴 |
| 설명을 영어로 작성 | 한국어 원칙 위반 |
