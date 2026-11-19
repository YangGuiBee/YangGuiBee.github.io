/* ─────────────────────────────────────────────────────────────
   research.js — 연구이론 맵 화면 + 순위 엔진
   데이터(BRANCHES·STEPS·FAMILIES·THEORIES·EXAMPLES)는 research-data.js
   점수 규칙(연구이론맵_초안.md 4장): 가지별 가중치 합, 규범 질문(10)은 걸러냄,
   분석단위·설명(종속변수)이 비면 순위 대신 안내. G = 프레임워크 탭, H = 이론 구축 안내.
   ───────────────────────────────────────────────────────────── */

const pick = {};          // { branchId: code | [codes] }
let tab = 'theory';       // theory | framework
let openId = null;        // 펼친 카드
let showAll = false;      // 상위 5개 / 10개

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const BR = Object.fromEntries(BRANCHES.map(b => [b.id, b]));
const label = (bid, code) => (BR[bid].opts.find(o => o[0] === code) || [code, code])[1];
const isNormYes = () => pick.norm && pick.norm !== 'no';

/* ── 점수 ── */
function score(t) {
  const tg = t.tags || {};
  let s = 0;
  const hits = [];
  if (isNormYes() && (tg.norm || []).includes(pick.norm)) { s += BR.norm.w; hits.push(BR.norm.title); }
  for (const b of BRANCHES) {
    if (b.id === 'norm' || !b.w) continue;
    const v = pick[b.id];
    const have = tg[b.id] || [];
    if (b.multi) {
      const m = (v || []).filter(c => have.includes(c));
      if (m.length) { s += b.w * m.length; hits.push(b.title); }
    } else if (v && have.includes(v)) {
      s += b.w;
      hits.push(b.title);
    }
  }
  if (pick.use === 'frame' && t.kind === 'framework') s += 1;
  return { s, hits };
}

function allowed(t) {
  if (!pick.norm || t.kind) return true;   // 프레임워크·이론 구축 안내는 규범 필터와 무관
  if (pick.norm === 'no') return t.fam !== 'E';
  return (t.tags.norm || []).length > 0;
}

function ranked(kind) {
  return THEORIES
    .filter(t => (t.kind || 'theory') === kind && allowed(t))
    .map(t => ({ t, ...score(t) }))
    .sort((a, b) => b.s - a.s || THEORIES.indexOf(a.t) - THEORIES.indexOf(b.t));
}

function ready() {
  return isNormYes() || (pick.unit && pick.phen);
}

/* ── 질문 패널 ── */
function renderQuestions() {
  const box = document.getElementById('rmQuestions');
  box.innerHTML = STEPS.map(st => {
    const items = BRANCHES.filter(b => b.step === st.no).map(b => {
      const chips = b.opts.map(([code, name]) => {
        const on = b.multi ? (pick[b.id] || []).includes(code) : pick[b.id] === code;
        return `<button type="button" class="rm-chip${on ? ' on' : ''}" data-b="${b.id}" data-c="${code}" aria-pressed="${on}"`
             + `${on ? ' title="다시 누르면 취소"' : ''}>${esc(name)}</button>`;
      }).join('');
      const role = b.w >= 3 ? '<span class="rm-role key">핵심</span>' : b.w === 0 ? '<span class="rm-role">기록만</span>' : '';
      const chosen = b.multi ? (pick[b.id] || []).length > 0 : pick[b.id] !== undefined;
      const clear = chosen ? `<button type="button" class="rm-clear" data-clear="${b.id}" title="이 질문의 선택 지우기">× 취소</button>` : '';
      return `<div class="rm-branch"><div class="rm-bhead"><span class="rm-no">(${b.no})</span> ${esc(b.title)}${role}
              <span class="rm-kind">${b.multi ? '여러 개' : '하나'}</span>${clear}</div>
              <div class="rm-chips">${chips}</div></div>`;
    }).join('');
    return `<section class="rm-step"><h2 class="rm-step-title">STEP ${st.no} · ${esc(st.title)}</h2>${items}</section>`;
  }).join('');
}

/* ── 결과 패널 ── */
function card(r, rank, max) {
  const t = r.t;
  const open = openId === t.id;
  const pct = max > 0 ? Math.round((r.s / max) * 100) : 0;
  const hits = r.hits.map(h => `<span class="rm-hit">${esc(h)}</span>`).join('');
  const body = open ? `<div class="rm-detail">
      <div><b>원전</b> ${esc(t.cite)}</div>
      <div><b>핵심 구성개념</b> ${esc(t.core)}</div>
      <div><b>자주 짝짓는 방법</b> ${esc(t.methods)}</div>
      ${t.caution ? `<div class="rm-caution"><b>주의</b> ${esc(t.caution)}</div>` : ''}
      <div class="rm-fam">계열: ${esc(FAMILIES[t.fam])}</div></div>` : '';
  return `<li class="rm-item${open ? ' open' : ''}">
      <button type="button" class="rm-item-head" data-open="${t.id}" aria-expanded="${open}">
        ${rank ? `<span class="rm-rank">${rank}</span>` : ''}
        <span class="rm-name">${esc(t.name)}<small>${esc(t.en)}</small></span>
        <span class="rm-score">${r.s ? r.s.toFixed(1).replace('.0', '') : '–'}</span>
      </button>
      <div class="rm-bar"><i style="width:${pct}%"></i></div>
      ${hits ? `<div class="rm-hits">${hits}</div>` : ''}${body}</li>`;
}

function renderResults() {
  const box = document.getElementById('rmResults');
  document.querySelectorAll('.rm-tab').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  let html = '';
  if (tab === 'framework') {
    const list = ranked('framework');
    const max = list[0] ? list[0].s : 0;
    html = `<p class="rm-note">관리·평가 프레임워크는 이론이 아니라 <b>기준틀</b>입니다. 연구분석 틀의 단계·차원 축으로 쓰고, "이론 검증"이라고 부르지 않습니다.</p>
            <ol class="rm-list">${list.map((r, i) => card(r, i + 1, max)).join('')}</ol>`;
  } else if (!ready()) {
    html = `<div class="rm-empty">STEP 3의 <b>(6) 분석단위</b>와 <b>(7) 설명(종속변수)</b>을 먼저 골라 주세요.<br>
            법·규범 연구라면 STEP 2에서 <b>"예"</b>를 고르면 규범·법학 이론으로 바로 좁혀집니다.</div>`;
  } else {
    const list = ranked('theory').filter(r => r.s > 0);
    const n = showAll ? 10 : 5;
    const max = list[0] ? list[0].s : 0;
    if (pick.use === 'build') {
      html += `<p class="rm-note">이론 구축형 설계 — 특정 이론을 가져오기보다 자료에서 이론을 만듭니다.</p>
               <ol class="rm-list build">${ranked('build').map(r => card(r, 0, 0)).join('')}</ol>`;
    }
    html += list.length
      ? `<ol class="rm-list">${list.slice(0, n).map((r, i) => card(r, i + 1, max)).join('')}</ol>
         ${list.length > 5 ? `<button type="button" class="rm-more" id="rmMore">${showAll ? '상위 5개만' : '상위 10개 보기'}</button>` : ''}`
      : '<div class="rm-empty">조건에 맞는 이론이 없습니다. 선택을 조금 풀어 보세요.</div>';
  }
  box.innerHTML = html;
  renderSummary();
}

function renderSummary() {
  const parts = BRANCHES.filter(b => pick[b.id] && (!b.multi || pick[b.id].length))
    .map(b => `<span class="rm-sum">(${b.no}) ${esc([].concat(pick[b.id]).map(c => label(b.id, c)).join('·'))}</span>`);
  document.getElementById('rmSummary').innerHTML = parts.length ? parts.join('') : '<span class="rm-sum dim">아직 고른 것이 없습니다</span>';
}

function render() {
  renderQuestions();
  renderResults();
}

/* ── 이벤트 ── */
document.addEventListener('click', e => {
  const chip = e.target.closest('.rm-chip');
  if (chip) {
    const b = BR[chip.dataset.b];
    const c = chip.dataset.c;
    if (b.multi) {
      const cur = pick[b.id] || [];
      pick[b.id] = cur.includes(c) ? cur.filter(x => x !== c) : [...cur, c];
    } else {
      pick[b.id] = pick[b.id] === c ? undefined : c;
    }
    openId = null;
    render();
    return;
  }
  const clr = e.target.closest('.rm-clear');
  if (clr) { delete pick[clr.dataset.clear]; openId = null; render(); return; }
  const head = e.target.closest('[data-open]');
  if (head) { openId = openId === head.dataset.open ? null : head.dataset.open; renderResults(); return; }
  const tb = e.target.closest('.rm-tab');
  if (tb) { tab = tb.dataset.tab; openId = null; renderResults(); return; }
  if (e.target.id === 'rmMore') { showAll = !showAll; renderResults(); return; }
  const ex = e.target.closest('[data-ex]');
  if (ex) {
    Object.keys(pick).forEach(k => delete pick[k]);
    Object.assign(pick, JSON.parse(JSON.stringify(EXAMPLES[+ex.dataset.ex].pick)));
    tab = 'theory'; openId = null; showAll = false;
    render();
    return;
  }
  if (e.target.id === 'rmReset') {
    Object.keys(pick).forEach(k => delete pick[k]);
    tab = 'theory'; openId = null; showAll = false;
    render();
  }
});

document.getElementById('rmExamples').innerHTML =
  EXAMPLES.map((x, i) => `<button type="button" class="rm-ex" data-ex="${i}">${esc(x.name)}</button>`).join('') +
  '<button type="button" class="rm-ex reset" id="rmReset">처음부터</button>';
document.getElementById('rmCount').textContent =
  `이론 ${THEORIES.filter(t => !t.kind).length}개 · 프레임워크 ${THEORIES.filter(t => t.kind === 'framework').length}개 · 이론 구축 안내 ${THEORIES.filter(t => t.kind === 'build').length}개`;

/* 주소 끝 #ex1 ~ #ex3 → 해당 예시를 바로 적용(수업 시연용 링크), #fw → 프레임워크 탭 */
const hm = location.hash.match(/^#ex(\d)/);
if (hm && EXAMPLES[+hm[1] - 1]) Object.assign(pick, JSON.parse(JSON.stringify(EXAMPLES[+hm[1] - 1].pick)));
if (/fw/.test(location.hash)) tab = 'framework';
render();
