const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx24U4D9vY3rxvBmORPDY0cXzHMf3iuHsAVEZERMBu6ALSFlfDNyxCSy8rhQFjBxYKwOw/exec';
const ADMIN_HASH = '0c8be907519b16e99fe9c8f9449df05530908fe6612bde43426da7295819a6fd';

let authState = null; // null | { email, pwHash } | { isAdmin: true }
let currentRow = null; // 현재 상세보기 중인 row

// ── SHA-256 ──
async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

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
    btn.disabled = true; btnText.hidden = true; btnSpinner.hidden = false;

    const activeTab = document.querySelector('.tab.active').dataset.tab;
    const fd = new FormData(form);
    fd.append('type', activeTab === 'student' ? '수강생질문' : '기타요청');
    fd.append('timestamp', new Date().toLocaleString('ko-KR'));

    // 비밀번호 검증 + SHA-256 해시 (수강생 질문만)
    if (activeTab === 'student') {
      const rawPw = fd.get('password') || '';
      const pwErr = document.getElementById('pwError');
      if (rawPw.trim() && !isValidPassword(rawPw)) {
        pwErr.hidden = false;
        btn.disabled = false; btnText.hidden = false; btnSpinner.hidden = true;
        return;
      }
      pwErr.hidden = true;
      fd.delete('password');
      fd.append('password', rawPw.trim() ? await sha256(rawPw) : '');
    }

    try {
      await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: fd });
      showSuccess();
    } catch {
      alert('제출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      btn.disabled = false; btnText.hidden = false; btnSpinner.hidden = true;
    }
  });
});

// ── 유효성 검사 ──
function validate(form) {
  let ok = true;
  form.querySelectorAll('[required]').forEach(el => {
    el.classList.remove('error');
    if (el.type === 'checkbox') {
      if (!el.checked) { el.classList.add('error'); ok = false; }
    } else if (!el.value.trim()) {
      el.classList.add('error'); ok = false;
    }
  });
  return ok;
}

// ── 비밀번호 정책 검사 ──
function isValidPassword(pw) {
  return pw.length >= 8 &&
    /[a-zA-Z]/.test(pw) &&
    /[0-9]/.test(pw) &&
    /[!@#$%^&*()\-_=+\[\]{};':",.<>/?\\|`~]/.test(pw);
}

// ── 성공 화면 ──
function showSuccess() {
  document.querySelector('.tabs').style.display = 'none';
  document.querySelectorAll('.contact-form').forEach(f => {
    f.classList.remove('active');
    f.classList.add('hidden-form');
  });
  document.querySelector('.success-msg').hidden = false;
}

// ── 다시 문의하기 ──
function resetForm() {
  document.querySelector('.tabs').style.display = '';
  document.querySelectorAll('.contact-form').forEach(f => {
    f.classList.remove('hidden-form', 'active');
    const btn = f.querySelector('.submit-btn');
    if (btn) {
      btn.disabled = false;
      btn.querySelector('.btn-text').hidden = false;
      btn.querySelector('.btn-spinner').hidden = true;
    }
    f.reset();
  });
  const pwErr = document.getElementById('pwError');
  if (pwErr) pwErr.hidden = true;
  const cErr = document.getElementById('consentError');
  if (cErr) cErr.hidden = true;
  document.querySelector('#form-student').classList.add('active');
  document.querySelectorAll('.tab')[0].classList.add('active');
  document.querySelectorAll('.tab')[1].classList.remove('active');
  document.querySelector('.success-msg').hidden = true;
}

// ════════════════════════════════════════
//  본인 확인 모달
// ════════════════════════════════════════
function openAuthModal() {
  document.getElementById('authEmail').value = '';
  document.getElementById('authPw').value = '';
  document.getElementById('authError').hidden = true;
  document.getElementById('authOverlay').classList.add('open');
  setTimeout(() => document.getElementById('authEmail').focus(), 100);
}
function closeAuthModal() {
  document.getElementById('authOverlay').classList.remove('open');
}
document.getElementById('authPw').addEventListener('keydown', e => {
  if (e.key === 'Enter') submitAuth();
});

async function submitAuth() {
  const email = document.getElementById('authEmail').value.trim().toLowerCase();
  const pw    = document.getElementById('authPw').value;
  const errEl = document.getElementById('authError');

  if (!email) {
    errEl.textContent = '이메일을 입력해 주세요.';
    errEl.hidden = false;
    return;
  }
  const pwHash = pw.trim() ? await sha256(pw) : '';

  loadContacts(rows => {
    // 이메일 일치 + 비밀번호 확인
    const matched = rows.filter(r => {
      if (r.email.trim().toLowerCase() !== email) return false;
      if (!r.password) return true;        // 비밀번호 미설정 → 이메일만 확인
      return r.password === pwHash;
    });

    if (matched.length === 0) {
      errEl.textContent = '일치하는 게시글이 없습니다. 이메일 또는 비밀번호를 확인해 주세요.';
      errEl.hidden = false;
    } else {
      authState = { email, pwHash };
      closeAuthModal();
      renderList(matched, `내 질문 목록`);
    }
  });
}

// ════════════════════════════════════════
//  관리자 모달
// ════════════════════════════════════════
function openAdminModal() {
  document.getElementById('adminPwInput').value = '';
  document.getElementById('adminError').hidden = true;
  document.getElementById('adminOverlay').classList.add('open');
  setTimeout(() => document.getElementById('adminPwInput').focus(), 100);
}
function closeAdminModal() {
  document.getElementById('adminOverlay').classList.remove('open');
}
document.getElementById('adminPwInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') submitAdminAuth();
});

async function submitAdminAuth() {
  const pw   = document.getElementById('adminPwInput').value;
  const hash = await sha256(pw);
  if (hash !== ADMIN_HASH) {
    document.getElementById('adminError').hidden = false;
    return;
  }
  authState = { isAdmin: true };
  closeAdminModal();
  loadContacts(rows => renderList(rows, `전체 질문 목록`));
}

// ════════════════════════════════════════
//  JSONP 데이터 로드
// ════════════════════════════════════════
function loadContacts(onResult) {
  const body = document.getElementById('contactListBody');
  body.innerHTML = '<div class="clist-loading">불러오는 중…</div>';
  document.getElementById('contactListEmpty').hidden = true;
  document.querySelector('.contact-list-section').style.display = 'block';

  const cbName = '_lc_' + Date.now();
  const timer = setTimeout(() => { delete window[cbName]; onResult([]); }, 6000);

  window[cbName] = function(data) {
    clearTimeout(timer);
    delete window[cbName];
    const s = document.getElementById('jsonp-contact-script');
    if (s) s.remove();
    // Apps Script가 named fields로 반환하는 경우와 인덱스 기반 모두 처리
    const rows = Array.isArray(data) ? data.map(normalizeRow).filter(r => r.type === '수강생질문') : [];
    onResult(rows);
  };

  const script = document.createElement('script');
  script.id = 'jsonp-contact-script';
  script.onerror = () => { clearTimeout(timer); delete window[cbName]; onResult([]); };
  script.src = `${SCRIPT_URL}?action=contacts&callback=${cbName}&t=${Date.now()}`;
  document.head.appendChild(script);
}

// Apps Script가 named fields를 반환하거나, 인덱스 기반(구버전) 모두 대응
function normalizeRow(r) {
  // doGet이 named fields를 반환하는 경우 (업데이트 후)
  if (r.timestamp !== undefined) return r;
  // 구버전: Object.values()로 인덱스 접근
  const v = Object.values(r);
  return {
    timestamp: String(v[0]||''),
    type:      String(v[1]||''),
    name:      String(v[2]||''),
    email:     String(v[3]||''),
    subject:   String(v[4]||''),
    question:  String(v[5]||''),
    password:  String(v[12]||'')
  };
}

// ════════════════════════════════════════
//  목록 렌더링
// ════════════════════════════════════════
function renderList(rows, title) {
  document.getElementById('listTitle').textContent = title;
  const body  = document.getElementById('contactListBody');
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

  rows.slice().reverse().forEach(row => {
    const el = document.createElement('div');
    el.className = 'clist-row';
    el.onclick = () => openDetailModal(row);
    el.innerHTML = `
      <span class="clist-col-subject"><span class="clist-subject-badge">${esc(row.subject||'-')}</span></span>
      <span class="clist-col-title">${esc(row.name||'-')}</span>
      <span class="clist-col-date">${formatTs(row.timestamp)}</span>`;
    body.appendChild(el);
  });
}

// ════════════════════════════════════════
//  상세 모달
// ════════════════════════════════════════
function openDetailModal(row) {
  currentRow = row;

  const canEdit = authState && (
    authState.isAdmin ||
    (row.email || '').trim().toLowerCase() === (authState.email || '')
  );

  document.getElementById('detailContent').innerHTML = `
    <div class="detail-subject"><span class="clist-subject-badge">${esc(row.subject||'-')}</span></div>
    <h3 class="detail-title">${esc(row.name||'-')}</h3>
    <div class="detail-meta">${esc(row.email||'')} · ${formatTs(row.timestamp)}</div>
    <div class="detail-divider"></div>
    <div class="detail-body">${esc(row.question||'').replace(/\n/g,'<br>')}</div>`;

  document.getElementById('detailActions').style.display = canEdit ? 'flex' : 'none';
  document.getElementById('detailOverlay').classList.add('open');
}
function closeDetailModal() {
  document.getElementById('detailOverlay').classList.remove('open');
}

// ════════════════════════════════════════
//  수정 모달
// ════════════════════════════════════════
function openEditFromDetail() {
  if (!currentRow) return;
  document.getElementById('edit-subject').value  = currentRow.subject || '';
  document.getElementById('edit-title').value    = currentRow.name    || '';
  document.getElementById('edit-question').value = currentRow.question|| '';
  closeDetailModal();
  document.getElementById('editOverlay').classList.add('open');
}
function closeEditModal() {
  document.getElementById('editOverlay').classList.remove('open');
}

document.getElementById('editForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  if (!currentRow) return;

  const fd = new FormData();
  fd.append('action',   'update');
  fd.append('ts',       currentRow.timestamp);
  fd.append('email',    currentRow.email);
  fd.append('name',     document.getElementById('edit-title').value);
  fd.append('subject',  document.getElementById('edit-subject').value);
  fd.append('question', document.getElementById('edit-question').value);

  const btn = this.querySelector('.edit-save-btn');
  btn.disabled = true; btn.textContent = '저장 중…';

  try {
    await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: fd });
    closeEditModal();
    alert('수정됐습니다.');
    refreshList();
  } catch {
    alert('수정 중 오류가 발생했습니다.');
    btn.disabled = false; btn.textContent = '저장하기';
  }
});

// ════════════════════════════════════════
//  삭제
// ════════════════════════════════════════
async function deleteFromDetail() {
  if (!currentRow) return;
  if (!confirm('이 게시글을 삭제하시겠습니까?')) return;

  const fd = new FormData();
  fd.append('action', 'delete');
  fd.append('ts',     currentRow.timestamp);
  fd.append('email',  currentRow.email);

  try {
    await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: fd });
    closeDetailModal();
    alert('삭제됐습니다.');
    refreshList();
  } catch {
    alert('삭제 중 오류가 발생했습니다.');
  }
}

// ── 목록 새로고침 ──
function refreshList() {
  if (!authState) return;
  if (authState.isAdmin) {
    loadContacts(rows => renderList(rows, '전체 질문 목록'));
  } else {
    loadContacts(rows => {
      const matched = rows.filter(r => {
        if ((r.email||'').trim().toLowerCase() !== authState.email) return false;
        if (!r.password) return true;
        return r.password === authState.pwHash;
      });
      renderList(matched, '내 질문 목록');
    });
  }
}

// ── 유틸 ──
function formatTs(ts) {
  if (!ts) return '-';
  const m = String(ts).match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
  if (m) return `${m[1]}.${m[2].padStart(2,'0')}.${m[3].padStart(2,'0')}`;
  return String(ts);
}
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── 실시간 에러 해제 ──
document.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('input', () => el.classList.remove('error'));
});
