const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyttLrn3U2VhtUfaUs_ql3FD0uQXZPPd9gvy9nGZVhVtaNT30JPD0TA75g37ir6iGJJfw/exec';

// ── 탭 전환 ──
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.contact-form').forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('form-' + tab.dataset.tab).classList.add('active');
  });
});

// ── 폼 제출 ──
document.querySelectorAll('.contact-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate(form)) return;

    const btn = form.querySelector('.submit-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnSpinner = btn.querySelector('.btn-spinner');

    btn.disabled = true;
    btnText.hidden = true;
    btnSpinner.hidden = false;

    const activeTab = document.querySelector('.tab.active').dataset.tab;
    const fd = new FormData(form);
    fd.append('type', activeTab);
    fd.append('timestamp', new Date().toLocaleString('ko-KR'));

    try {
      await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: fd });
      showSuccess(activeTab);
    } catch {
      alert('제출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      btn.disabled = false;
      btnText.hidden = false;
      btnSpinner.hidden = true;
    }
  });
});

// ── 유효성 검사 ──
function validate(form) {
  let ok = true;
  form.querySelectorAll('[required]').forEach(el => {
    el.classList.remove('error');
    if (!el.value.trim()) { el.classList.add('error'); ok = false; }
  });
  return ok;
}

// ── 성공 화면 ──
function showSuccess(tab) {
  document.querySelector('.tabs').style.display = 'none';
  document.querySelectorAll('.contact-form').forEach(f => {
    f.classList.remove('active');
    f.classList.add('hidden-form');
  });
  document.querySelector('.success-msg').hidden = false;

  // 수강생 질문 탭일 때만 목록 로드
  if (tab === 'student') {
    const listSection = document.querySelector('.contact-list-section');
    listSection.hidden = false;
    loadContactList();
  }
}

// ── 다시 문의하기 ──
function resetForm() {
  document.querySelector('.tabs').style.display = '';
  document.querySelectorAll('.contact-form').forEach(f => {
    f.classList.remove('hidden-form', 'active');
    f.reset();
  });
  document.querySelector('#form-student').classList.add('active');
  document.querySelectorAll('.tab')[0].classList.add('active');
  document.querySelectorAll('.tab')[1].classList.remove('active');
  document.querySelector('.success-msg').hidden = true;
  document.querySelector('.contact-list-section').hidden = true;
}

// ── 수강생 질문 목록 로드 (JSONP) ──
function loadContactList() {
  // 로딩 표시
  document.getElementById('contactListBody').innerHTML =
    '<div style="padding:1.5rem;text-align:center;font-size:0.82rem;color:var(--text-dim)">불러오는 중...</div>';
  document.getElementById('contactListEmpty').hidden = true;

  const cbName = '_loadContacts_' + Date.now();

  // 5초 타임아웃 — Apps Script가 응답 없을 때 처리
  const timer = setTimeout(() => {
    renderContactList([]);
    delete window[cbName];
  }, 5000);

  window[cbName] = function(data) {
    clearTimeout(timer);
    renderContactList(Array.isArray(data) ? data.filter(r => r.type === 'student') : []);
    delete window[cbName];
    const s = document.getElementById('jsonp-contact-script');
    if (s) s.remove();
  };
  const script = document.createElement('script');
  script.id = 'jsonp-contact-script';
  script.onerror = function() {
    clearTimeout(timer);
    renderContactList([]);
    delete window[cbName];
  };
  script.src = `${SCRIPT_URL}?action=contacts&callback=${cbName}&t=${Date.now()}`;
  document.head.appendChild(script);
}

// ── 목록 렌더링 ──
function renderContactList(rows) {
  const body = document.getElementById('contactListBody');
  const empty = document.getElementById('contactListEmpty');
  const count = document.getElementById('contactCount');

  body.innerHTML = '';

  if (rows.length === 0) {
    empty.hidden = false;
    count.textContent = '';
    return;
  }
  empty.hidden = true;
  count.textContent = `총 ${rows.length}건`;

  // 최신순 정렬
  const sorted = rows.slice().reverse();
  sorted.forEach(row => {
    const el = document.createElement('div');
    el.className = 'clist-row';
    el.innerHTML = `
      <span class="clist-col-subject">
        <span class="clist-subject-badge">${row.subject || '-'}</span>
      </span>
      <span class="clist-col-title">${row.title || row.name || '-'}</span>
      <span class="clist-col-date">${formatTs(row.timestamp)}</span>`;
    body.appendChild(el);
  });
}

function formatTs(ts) {
  if (!ts) return '-';
  // "2026. 6. 26. 오후 3:45:12" 형태를 짧게 변환
  const m = String(ts).match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
  if (m) return `${m[1]}.${String(m[2]).padStart(2,'0')}.${String(m[3]).padStart(2,'0')}`;
  return ts;
}

// ── 실시간 에러 해제 ──
document.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('input', () => el.classList.remove('error'));
});
