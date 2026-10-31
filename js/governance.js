/* AI거버넌스 체크리스트 — 입력 폼 + 판정 엔진 + 보고서 렌더링
 * 규칙 데이터는 governance-rules.js (먼저 로드)
 */

/* ════════ 판정 엔진 (DOM 없이 동작 — 예시 검증에도 사용) ════════ */

const ROLE_LABEL = { dev: '인공지능개발사업자', opr: '인공지능이용사업자', user: '이용자' };

// 분야별 개별법 — 이 체크리스트 범위 밖이라 안내만 한다
const SECTOR_LAWS = {
  energy: '에너지법·전기사업법', water: '먹는물관리법', health: '보건의료기본법·의료법',
  device: '의료기기법·디지털의료제품법', nuclear: '원자력안전법·방사능방재법',
  crime: '형사소송법', hire: '채용절차의 공정화에 관한 법률', loan: '금융소비자 보호에 관한 법률·신용정보법',
  road: '교통안전법·자율주행자동차법', sea: '선박안전법', air: '항공안전법', rail: '철도안전법',
  public: '행정기본법(제20조 자동적 처분)', edu: '초·중등교육법'
};

// 조직 유형 → { isState: AI기본법 국가기관등, isPiPublic: 개인정보 보호법 공공기관 }
function orgFlags(org) {
  const t = ORG_TYPES.find(x => x.v === org.type) || {};
  return {
    isState: org.type === 'school' ? org.school === 'pub' : !!t.st,
    isPiPublic: !!t.pp
  };
}

function judgeSystem(s, org) {
  const { isState } = orgFlags(org);
  const role = s.provide === 'internal' ? 'user' : (s.origin === 'self' ? 'dev' : 'opr');
  const area = AREAS.find(a => a.v === s.area) || AREAS.find(a => a.v === 'none');
  const answered = area.qs.every(q => q.multi || s.ans[q.id]);
  const high = answered
    ? area.judge(s.ans, { isState, sys: s, org })
    : { lv: 'review', why: '세부 질문에 모두 답하면 판정합니다' };
  const isHigh = high.lv === 'high' || high.lv === 'review';
  const biz = role !== 'user';
  return {
    role, area, high, isHigh, biz, isState,
    transp: biz && (s.gen !== 'none' || isHigh),
    frontier: s.origin === 'self' && s.frontier === 'yes',
    autoDec: s.ans.human === 'auto' && s.pi !== 'none'
  };
}

// 보고서 항목 생성 — { st: 단계, part: 'common'|'org'|'sys', who, t: 항목, b: 근거, lv }
function buildItems(state) {
  const org = state.org;
  const items = COMMON_ITEMS.map(c => Object.assign({ part: 'common', who: '공통' }, c));
  const results = state.systems.map(s => ({ s, r: judgeSystem(s, org) }));
  const add = (st, part, who, t, b, lv) => items.push({ st, part, who, t, b, lv });
  const { isState, isPiPublic } = orgFlags(org);
  const anyBiz = results.some(x => x.r.biz);

  /* 조직특화부문 */
  if (anyBiz)
    add(1, 'org', '조직', '인공지능사업자로서 AI 고지·표시 표준 문구와 내부 절차 마련', '{법:31|AI기본법 제31조}, 투명성 가이드라인', 'rec');
  if (org.foreign === 'yes') {
    if (org.fcrit.length && anyBiz)
      add(1, 'org', '조직', '국내대리인 지정·신고(국내에 주소·영업소가 없는 사업자)', '{법:36|AI기본법 제36조}, {영:29|시행령 제29조①}', 'must');
    else
      add(1, 'org', '조직', '국내대리인 지정 기준(매출·이용자 수·과태료 이력) 해당 여부를 매년 확인', '{영:29|AI기본법 시행령 제29조①}', 'rec');
  }
  if (isState && results.some(x => x.r.isHigh && x.s.origin !== 'self'))
    add(3, 'org', '조직', '고영향 AI 제품·서비스를 도입할 때 영향평가를 실시한 제품을 우선 고려 — 조달 평가 항목에 반영', '{법:35|AI기본법 제35조②}', 'must');
  if (isPiPublic && org.piScale !== 'none')
    add(3, 'org', '조직', '개인정보 영향평가 실시(공공기관, 대상 개인정보파일 규모 해당)', '{개보:33|개인정보 보호법 제33조①}, {개보영:35|시행령 제35조}', 'must');

  /* 시스템특화부문 */
  results.forEach(({ s, r }) => {
    const who = results.length > 1 ? s.name : '시스템';  // 화면은 시스템 1개씩 — 이름은 보고서 제목에
    const hl = r.high.lv === 'high' ? 'must' : 'ifhigh';

    // 2 식별
    if (s.area !== 'none') {
      if (r.biz) add(2, 'sys', who, '고영향 해당 여부 사전 검토 결과 문서화', '{법:33|AI기본법 제33조①}, ' + r.area.ref, 'must');
      else add(2, 'sys', who, '고영향 판단 결과 기록, 공급업체의 사전 검토 결과 확인', r.area.ref, 'rec');
      if (r.high.lv === 'review' && r.biz)
        add(2, 'sys', who, '판단이 애매하면 과기정통부에 고영향 확인 요청(30일 내 회신, 1회 30일 연장, 이의 시 10일 내 재확인 요청)', '{법:33|AI기본법 제33조}, {영:25|시행령 제25조}', 'rec');
    }
    if (r.transp)
      add(2, 'sys', who, '투명성 의무 대상 — 고지·표시 방법 결정', '{법:31|AI기본법 제31조}', 'must');
    else if (s.provide === 'internal' && s.gen !== 'none')
      add(2, 'sys', who, '내부 업무 용도라 투명성 고지·표시 적용 제외 가능 — 외부 제공을 시작하면 다시 검토', '{영:23|AI기본법 시행령 제23조④}2호', 'rec');
    if (s.origin === 'self' && !r.frontier)
      add(2, 'sys', who, '최첨단 AI(안전성 확보 의무) 비해당 확인 기록', '{영:24|AI기본법 시행령 제24조①}', 'rec');

    // 3 평가
    if (r.frontier)
      add(3, 'sys', who, '최첨단 AI 안전성 확보 — 수명주기 전반의 위험 식별·평가·완화, 사고 모니터링·대응 체계, 이행 결과 제출', '{법:32|AI기본법 제32조}, {영:24|시행령 제24조}, 안전성 가이드라인', r.biz ? 'must' : 'rec');
    if (r.isHigh) {
      add(3, 'sys', who, '위험관리방안 수립(위험 식별 → 분석 → 평가 → 처리)', '{법:34|AI기본법 제34조①}1호, 사업자 책무 가이드라인 3.1', r.biz ? hl : 'apply');
      add(3, 'sys', who, '기본권 영향평가 — 영향받는 개인·집단(취약계층 특성 반영), 기본권 유형, 사회·경제적 영향, 사용 행태, 평가지표, 위험 예방·완화·복구, 개선 이행계획',
        '{법:35|AI기본법 제35조①}, {영:28|시행령 제28조①}, 영향평가 가이드라인', r.biz ? 'effort' : 'apply');
    }
    if (s.pi !== 'none')
      add(3, 'sys', who, '개인정보 처리 근거 정리(동의·계약·법령·소관 업무 등)', '{개보:15|개인정보 보호법 제15조①}', 'must');
    if (s.pi === 'sensitive')
      add(3, 'sys', who, '민감정보·고유식별정보 처리 요건 확인(별도 동의 또는 법령 근거, 안전성 확보 조치)', '{개보:23|개인정보 보호법 제23조}·{개보:24|제24조}', 'must');

    // 4 통제
    if (r.transp) {
      add(4, 'sys', who, '사전 고지 — 제품·계약서·약관 기재, 화면·단말기 표시, 제공 장소 게시 중 하나', '{법:31|AI기본법 제31조①}, {영:23|시행령 제23조①}', 'must');
      if (s.gen !== 'none')
        add(4, 'sys', who, '생성물 표시 — 사람이 인식하는 방법, 또는 기계 판독 방법(이 경우 1회 이상 안내 문구·음성)', '{법:31|AI기본법 제31조②}, {영:23|시행령 제23조②}', 'must');
      if (s.gen === 'deepfake')
        add(4, 'sys', who, '실제와 구분하기 어려운 결과물임을 이용자가 명확히 인식하도록 고지·표시(나이·신체적 조건 고려)', '{법:31|AI기본법 제31조③}, {영:23|시행령 제23조③}', 'must');
    }
    if (r.isHigh && r.biz) {
      add(4, 'sys', who, '설명 방안 — 최종 결과, 주요 판단 기준, 학습용데이터 개요', '{법:34|AI기본법 제34조①}2호', hl);
      add(4, 'sys', who, '이용자 보호 방안', '{법:34|AI기본법 제34조①}3호', hl);
      add(4, 'sys', who, '사람의 관리·감독 — 최종 결정 권한, AI와 다르게 판정한 사유 기록', '{법:34|AI기본법 제34조①}4호', hl);
      add(4, 'sys', who, '조치 내용 문서 작성·보관(5년), 주요 내용 홈페이지 게시', '{법:34|AI기본법 제34조①}5호, {영:27|시행령 제27조①②}', hl);
      if (r.role === 'opr')
        add(4, 'sys', who, '개발사업자가 1~3호 조치를 이행한 AI를 중대한 기능 변경 없이 쓰면 이행 간주 — 필요한 자료를 공급자에게 요청', '{영:27|AI기본법 시행령 제27조③④}', 'rec');
    }
    if (r.isHigh && !r.biz)
      add(4, 'sys', who, '공급업체의 고영향 책무 이행 확인(안전신뢰문서), 사람의 최종 결정 구조, 영향받는 사람에게 AI 활용 사실·설명 요청 방법 안내', '{법:34|AI기본법 제34조①}(준용), 사업자 책무 가이드라인 부록1', 'apply');
    if (s.origin !== 'self')
      add(4, 'sys', who, '공급 계약 조항 — 자료 제공, 입력 데이터 학습 재사용 금지, 국외 이전 여부, 계약 종료 시 파기', '{영:27|AI기본법 시행령 제27조④}', 'rec');
    if (r.autoDec)
      add(4, 'sys', who, '자동화된 결정 — 기준·절차 공개, 거부·설명 요구 대응 절차(처리 근거가 동의·계약·급박한 생명 보호면 거부권 제외)', '{개보:37의2|개인정보 보호법 제37조의2}, {개보영:44의4|시행령 제44조의4}', 'must');

    // 5 운영
    if (r.isHigh)
      add(5, 'sys', who, '모니터링 지표와 기준값 — 집단별 결과 격차, AI·사람 판정 불일치율, 사람이 AI와 다르게 판정한 비율(0%에 가까우면 형식적 개입 경고), 오류·민원', '사업자 책무 가이드라인 3.3', r.biz ? hl : 'apply');
    if (r.autoDec)
      add(5, 'sys', who, '거부·설명 요구를 30일 안에 처리하고 기록', '{개보영:44의3|개인정보 보호법 시행령 제44조의3⑤}', 'must');
    if (r.transp)
      add(5, 'sys', who, '생성 결과 오답·고지 누락 민원 모니터링', '투명성 가이드라인', 'rec');

    // 6 개선
    if (!r.biz)
      add(6, 'sys', who, '외부에 제공하기 시작하면 그 범위에서 이용사업자로 바뀜 — 제31·34조 다시 검토', '사례 01·14', 'rec');
  });

  // 분야별 개별법 안내는 분야당 한 번만
  [...new Set(results.map(x => x.s.area))].filter(a => SECTOR_LAWS[a]).forEach(a =>
    add(2, 'sys', '분야: ' + AREAS.find(x => x.v === a).label.split('(')[0],
      `분야별 개별법(${SECTOR_LAWS[a]}) 의무는 이 체크리스트 범위 밖 — 별도 확인`, 'AI관련법 지도(AILawMap)', 'rec'));

  return { items, results };
}

/* 9강 detail ⑧ 가상 사례 — ○○공공기관 채용 AI A~D (판정 결과가 ⑧과 같아야 함) */
const GOV_EXAMPLE = {
  org: { type: 'public', foreign: 'no', fcrit: [], piScale: 'none' },
  systems: [
    { name: 'A 서류전형 AI', origin: 'vendor', provide: 'internal', gen: 'none', area: 'hire', pi: 'general', frontier: 'no', ans: { use: 'score', human: 'ref' } },
    { name: 'B AI 역량면접', origin: 'vendor', provide: 'internal', gen: 'none', area: 'hire', pi: 'general', frontier: 'no', ans: { use: 'bio', human: 'ref' } },
    { name: 'C 채용 문의 챗봇', origin: 'vendor', provide: 'external', gen: 'gen', area: 'hire', pi: 'general', frontier: 'no', ans: { use: 'admin', human: 'aux' } },
    { name: 'D 업무용 생성형 AI', origin: 'vendor', provide: 'internal', gen: 'gen', area: 'none', pi: 'none', frontier: 'no', ans: {} }
  ]
};

/* ════════ 화면 (브라우저에서만) ════════ */
if (typeof document !== 'undefined') (function () {
  const STORE_KEY = 'govChecklist.v1';
  const $ = id => document.getElementById(id);

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function lawUrl(k, art) {
    const base = 'https://www.law.go.kr/' + encodeURIComponent('법령') + '/' + encodeURIComponent(GOV_LAWS[k]);
    if (!art) return base;
    const [main, br] = art.split('의');
    return base + '/' + encodeURIComponent('제' + main + '조' + (br ? '의' + br : ''));
  }
  // {법:34|표기} → law.go.kr 링크 (규칙 데이터 전용 — 사용자 입력은 esc 처리)
  function renderBasis(b) {
    return esc(b).replace(/\{([^|{}:]+):([^|{}]*)\|([^{}]+)\}/g,
      (m, k, art, txt) => `<a href="${lawUrl(k, art)}" target="_blank" rel="noopener">${txt}</a>`);
  }

  const newSys = () => ({ name: '', origin: '', provide: '', gen: '', area: '', pi: '', frontier: 'no', ans: {} });
  let state = load() || { org: { type: '', foreign: 'no', fcrit: [], piScale: 'none' }, systems: [newSys()] };

  // 보고서는 AI 시스템 하나씩 — 예전에 여러 개 저장된 경우 첫 번째만 쓴다
  function load() {
    try {
      const v = JSON.parse(localStorage.getItem(STORE_KEY));
      if (v && v.systems && v.systems.length) v.systems = v.systems.slice(0, 1);
      return v && v.systems && v.systems.length ? v : null;
    } catch (e) { return null; }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* 저장 불가 환경은 무시 */ }
  }

  /* ── 폼 렌더링 ── */
  const pills = (name, opts, val) => opts.map(o =>
    `<label class="g-opt${val === o.v ? ' on' : ''}"><input type="radio" name="${name}" value="${o.v}"${val === o.v ? ' checked' : ''}>${esc(o.label)}</label>`
  ).join('');
  const radios = (name, opts, val) => '<div class="g-opts">' + pills(name, opts, val) + '</div>';
  function checks(name, opts, vals) {
    return '<div class="g-opts">' + opts.map(o => {
      const on = vals.includes(o.v);
      return `<label class="g-opt${on ? ' on' : ''}"><input type="checkbox" name="${name}" value="${o.v}"${on ? ' checked' : ''}>${esc(o.label)}</label>`;
    }).join('') + '</div>';
  }
  // row: 레이블 왼쪽 + 입력 오른쪽 한 줄 배치
  const field = (label, html, hint, row) =>
    `<div class="g-field${row ? ' g-row' : ''}"><div class="g-label">${label}${hint ? `<span class="g-hint">${hint}</span>` : ''}</div>${html}</div>`;

  function renderOrg() {
    const o = state.org;
    // 해외 사업자 여부는 조직 유형 줄 끝에 붙여 한 화면에 들어오게 한다
    let h = field('조직 유형', '<div class="g-opts">' + pills('org.type', ORG_TYPES, o.type) +
      '<span class="g-inline-label">국내에 주소·영업소가 없는 해외 사업자 여부</span>' + pills('org.foreign', YN, o.foreign) + '</div>', '', true);
    if (o.type === 'school')
      h += field('설립 주체', radios('org.school', SCHOOL_FOUND, o.school), '국공립이면 AI기본법 "국가기관등" — 학생 평가 AI는 대상 분야에서 교육(2.13)을 고르세요', true);
    if (o.foreign === 'yes') h += field('국내대리인 지정 기준 — 해당 항목을 모두 고르세요', checks('org.fcrit', FOREIGN_CRITERIA, o.fcrit), 'AI기본법 시행령 제29조①', true);
    if (orgFlags(o).isPiPublic)
      h += field('개인정보파일 규모', radios('org.piScale', PI_SCALE, o.piScale), '개인정보 보호법 시행령 제35조 — 공공기관 영향평가 대상', true);
    $('orgForm').innerHTML = h;
  }

  function renderSystems() {
    $('sysForm').innerHTML = state.systems.map((s, i) => {
      const area = AREAS.find(a => a.v === s.area);
      let h = `<div class="g-sys" data-i="${i}">
        <div class="g-field g-row"><label class="g-label" for="s${i}name">AI시스템 명칭</label><div class="g-sys-head">
          <input class="g-name" id="s${i}name" name="s${i}.name" value="${esc(s.name)}" maxlength="40">
        </div></div>`;
      h += field('도입 방식', radios(`s${i}.origin`, SYS_ORIGIN, s.origin), '', true);
      h += field('시스템 사용자', radios(`s${i}.provide`, SYS_PROVIDE, s.provide), '', true);
      h += field('생성 기능', radios(`s${i}.gen`, SYS_GEN, s.gen), '', true);
      h += field('대상 분야', radios(`s${i}.area`, AREAS, s.area), 'AI기본법 제2조제4호 고영향 분야', true);
      if (area) area.qs.forEach(q => {
        h += q.multi
          ? field(q.label, checks(`s${i}.ans.${q.id}`, q.opts, s.ans[q.id] || []), '', true)
          : field(q.label, radios(`s${i}.ans.${q.id}`, q.opts, s.ans[q.id]), '', true);
      });
      h += field('개인정보 처리', radios(`s${i}.pi`, SYS_PI, s.pi), '', true);
      if (s.origin === 'self')
        h += field('최첨단 AI인가요?', radios(`s${i}.frontier`, SYS_FRONTIER, s.frontier), '학습 누적 연산량 10의 26승 이상 + 최첨단 기술 + 광범위·중대한 위험', true);
      return h + '</div>';
    }).join('');
  }

  function renderForm() { renderOrg(); renderSystems(); }

  /* ── 입력 반영 ── */
  function setByName(name, input) {
    const parts = name.split('.');
    if (parts[0] === 'org') {
      if (input.type === 'checkbox') toggle(state.org[parts[1]], input.value, input.checked);
      else state.org[parts[1]] = input.value;
      return;
    }
    const s = state.systems[+parts[0].slice(1)];
    if (parts[1] === 'ans') {
      if (input.type === 'checkbox') { s.ans[parts[2]] = s.ans[parts[2]] || []; toggle(s.ans[parts[2]], input.value, input.checked); }
      else s.ans[parts[2]] = input.value;
    } else {
      if (parts[1] === 'area' && s.area !== input.value) s.ans = {};
      s[parts[1]] = input.value;
    }
  }
  function toggle(arr, v, on) {
    const i = arr.indexOf(v);
    if (on && i < 0) arr.push(v);
    if (!on && i >= 0) arr.splice(i, 1);
  }

  document.addEventListener('change', e => {
    const el = e.target;
    if (!el.name || !el.closest('#govForm')) return;
    setByName(el.name, el);
    save();
    if (el.type === 'text') return;
    // 선택에 따라 질문이 바뀌므로 다시 그리고 스크롤 위치 유지
    const y = window.scrollY;
    renderForm();
    window.scrollTo(0, y);
  });
  document.addEventListener('input', e => {
    if (e.target.classList && e.target.classList.contains('g-name')) { setByName(e.target.name, e.target); save(); }
  });
  // 9강 ⑧ 예시 — 같은 기관의 A~D 중 하나를 불러온다
  $('examples').innerHTML = GOV_EXAMPLE.systems.map((s, i) =>
    `<button type="button" class="g-btn g-btn-line g-btn-sm" data-ex="${i}">${esc(s.name)}</button>`).join('');
  $('examples').addEventListener('click', e => {
    const b = e.target.closest('[data-ex]');
    if (!b) return;
    state = JSON.parse(JSON.stringify({ org: GOV_EXAMPLE.org, systems: [GOV_EXAMPLE.systems[+b.dataset.ex]] }));
    save(); renderForm(); $('formError').textContent = ''; $('report').hidden = true;
  });
  $('resetForm').addEventListener('click', () => {
    if (!confirm('입력한 내용을 모두 지울까요?')) return;
    state = { org: { type: '', foreign: 'no', fcrit: [], piScale: 'none' }, systems: [newSys()] };
    save(); renderForm(); $('report').hidden = true;
  });
  $('makeReport').addEventListener('click', makeReport);
  $('printReport').addEventListener('click', () => window.print());

  /* ── 검증(Fail Fast) ── */
  function validate() {
    if (!state.org.type) return '조직 유형을 선택하세요.';
    if (state.org.type === 'school' && !state.org.school) return '학교의 설립 주체를 선택하세요.';
    for (const s of state.systems) {
      if (!s.name.trim()) return 'AI시스템 명칭을 입력하세요.';
      for (const [k, label] of [['origin', '도입 방식'], ['provide', '시스템 사용자'], ['gen', '생성 기능'], ['area', '대상 분야'], ['pi', '개인정보 처리']])
        if (!s[k]) return `「${s.name}」의 ${label}을(를) 선택하세요.`;
      const area = AREAS.find(a => a.v === s.area);
      const miss = area.qs.find(q => !q.multi && !s.ans[q.id]);
      if (miss) return `「${s.name}」 — ${miss.label}`;
    }
    return '';
  }

  /* ── 보고서 ── */
  function makeReport() {
    const err = validate();
    $('formError').textContent = err;
    if (err) return;

    const { items, results } = buildItems(state);
    let orgLabel = ORG_TYPES.find(t => t.v === state.org.type).label;
    if (state.org.type === 'school') orgLabel += ' · ' + SCHOOL_FOUND.find(t => t.v === state.org.school).label;
    const cnt = k => items.filter(it => it.lv === k).length;

    let h = `<div class="r-head">
      <h2>AI 거버넌스 적용방안 — ${esc(results[0].s.name)}</h2>
      <p class="r-meta">${esc(orgLabel)} · 기준일 ${GOV_DATE}</p>
      <div class="r-count">
        <span class="lv-must">필수 ${cnt('must')}</span><span class="lv-if">해당 시 필수 ${cnt('ifhigh')}</span>
        <span class="lv-effort">노력 의무 ${cnt('effort')}</span><span class="lv-apply">준용 ${cnt('apply')}</span><span class="lv-rec">권장 ${cnt('rec')}</span>
      </div></div>`;

    h += `<h3 class="r-h3">시스템 판정</h3><div class="r-tw"><table class="r-tbl r-sum"><thead><tr>
      <th>시스템</th><th>지위</th><th>고영향</th><th>투명성(제31조)</th><th>개인정보</th></tr></thead><tbody>`;
    results.forEach(({ s, r }) => {
      const hi = HIGH_LABEL[r.high.lv];
      h += `<tr><td class="nw"><b>${esc(s.name)}</b></td>
        <td class="nw" data-label="지위">${ROLE_LABEL[r.role]}</td>
        <td data-label="고영향"><span class="hi ${hi.cls}">${hi.label}</span> ${s.area !== 'none' ? esc(r.area.label) + ' — ' : ''}${esc(r.high.why)}</td>
        <td data-label="투명성">${r.transp ? '적용' + (s.gen === 'deepfake' ? ' (딥페이크 포함)' : '') : (s.provide === 'internal' && s.gen !== 'none' ? '내부 용도 — 적용 제외 가능' : '해당 없음')}</td>
        <td data-label="개인정보">${{ none: '처리 안 함', general: '일반', sensitive: '민감·고유식별' }[s.pi]}${r.autoDec ? ' · 자동화된 결정' : ''}</td></tr>`;
    });
    h += '</tbody></table></div>';

    STAGES.forEach(st => {
      const rows = items.filter(it => it.st === st.n);
      if (!rows.length) return;
      h += `<h3 class="r-h3"><span class="r-stn">${st.n}</span>${st.name} <small>${st.sub}</small></h3>
        <div class="r-tw"><table class="r-tbl"><thead><tr><th class="c-part">부문</th><th>점검 항목</th><th class="c-basis">근거</th><th class="c-lv">구분</th><th class="c-chk">확인</th></tr></thead><tbody>`;
      rows.forEach(it => {
        const lv = LEVELS[it.lv];
        h += `<tr><td class="c-part"><span class="pt pt-${it.part}">${esc(it.who)}</span></td><td>${esc(it.t)}</td>
          <td class="c-basis">${renderBasis(it.b)}</td><td class="c-lv"><span class="${lv.cls}">${lv.label}</span></td><td class="c-chk">□</td></tr>`;
      });
      h += '</tbody></table></div>';
    });

    $('reportBody').innerHTML = h;
    $('report').hidden = false;
    $('report').scrollIntoView({ behavior: 'smooth' });
  }

  renderForm();
})();
