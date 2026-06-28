const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzDIF0P1LKqAMb-bp8sERiqoclzvxJ2PY9FQpAxdyliXD2ODP3ewNHE1tTq4z3nsXqmaA/exec';
const ADMIN_HASH = '0c8be907519b16e99fe9c8f9449df05530908fe6612bde43426da7295819a6fd';

let authState = null; // null | { email, otp, otpVerified: true } | { isAdmin: true }
let currentRow = null; // 현재 상세보기 중인 row
let currentRows = [];  // 현재 목록 캐시
let currentListTitle = '';
let submitStep    = 'idle'; // 수강생 질문 OTP 단계
let pendingFd     = null;
let reqSubmitStep = 'idle'; // 강의 요청 OTP 단계
let reqPendingFd  = null;

// ── sessionStorage에서 인증 상태 복원 (탭 내 페이지 이동 시 유지) ──
try {
  const saved = sessionStorage.getItem('authState');
  if (saved) authState = JSON.parse(saved);
} catch {}

function saveAuthState(state) {
  authState = state;
  if (state && state.otpVerified) {
    sessionStorage.setItem('authState', JSON.stringify(state));
  }
}
function clearAuthState() {
  authState = null;
  sessionStorage.removeItem('authState');
}

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
    const isReq = tab.dataset.tab === 'request';
    document.getElementById('myqLabel').textContent      = isReq ? '강의 요청 목록'  : '수강생 질문 목록';
    document.getElementById('myqAuthBtnText').textContent = isReq ? '내 요청 확인'    : '내 질문 확인';
  });
});

// ── 폼 제출 ──
document.querySelectorAll('.contact-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const activeTab = document.querySelector('.tab.active').dataset.tab;

    // ── 기타요청: OTP 2단계 제출 ──
    if (activeTab !== 'student') {
      const btn     = document.getElementById('reqSubmitBtn');
      const btnText = document.getElementById('reqSubmitText');
      const btnSpinner = btn.querySelector('.btn-spinner');

      // 2단계: OTP 확인 후 실제 제출
      if (reqSubmitStep === 'otp_pending') {
        const otp    = document.getElementById('reqOTP').value.trim();
        const otpErr = document.getElementById('reqOtpError');
        if (!otp) { otpErr.textContent = '인증코드를 입력해 주세요.'; otpErr.hidden = false; return; }
        otpErr.hidden = true;
        btn.disabled = true; btnText.hidden = true; btnSpinner.hidden = false;

        const email = (reqPendingFd.get('email') || '').trim().toLowerCase();
        doJsonp(`${SCRIPT_URL}?action=verifyOTP&email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, async result => {
          if (!result || !result.ok) {
            btn.disabled = false; btnText.hidden = false; btnSpinner.hidden = true;
            otpErr.textContent = '인증코드가 일치하지 않거나 만료됐습니다.';
            otpErr.hidden = false;
            return;
          }
          try {
            await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: reqPendingFd });
            reqSubmitStep = 'idle';
            saveAuthState({ email, otp, otpVerified: true });
            const fd = reqPendingFd;
            showSuccess({
              timestamp: fd.get('timestamp'), type: '기타요청',
              name: fd.get('topic') || '', email: fd.get('email') || '',
              subject: '강의요청',
              reqName: fd.get('name') || '', org: fd.get('org') || '',
              place: fd.get('place') || '', date: fd.get('date') || '',
              people: fd.get('people') || '', message: fd.get('message') || '',
              _listTitle: '제출한 강의요청<span class="list-title-sub">(등록시 작성한 이메일 인증으로 조회)</span>'
            });
          } catch {
            alert('제출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
            btn.disabled = false; btnText.hidden = false; btnSpinner.hidden = true;
          }
        });
        return;
      }

      // 1단계: 폼 검증 후 OTP 발송
      if (!validate(form)) return;
      const consentEl = document.getElementById('r-consent');
      const consentErr = document.getElementById('reqConsentError');
      if (!consentEl.checked) { consentErr.hidden = false; return; }
      consentErr.hidden = true;
      btn.disabled = true; btnText.hidden = true; btnSpinner.hidden = false;

      const fd = new FormData(form);
      fd.append('type', '기타요청');
      fd.append('timestamp', new Date().toLocaleString('ko-KR'));
      fd.append('contact', fd.get('email') || ''); // Apps Script 호환
      const email = (fd.get('email') || '').trim().toLowerCase();

      doJsonp(`${SCRIPT_URL}?action=sendOTP&email=${encodeURIComponent(email)}`, result => {
        btn.disabled = false; btnText.hidden = false; btnSpinner.hidden = true;
        if (!result || !result.ok) {
          alert('인증코드 발송에 실패했습니다. 이메일을 확인해 주세요.');
          return;
        }
        reqPendingFd  = fd;
        reqSubmitStep = 'otp_pending';
        form.querySelectorAll('input:not(#reqOTP), select, textarea').forEach(el => el.disabled = true);
        document.getElementById('reqOtpInfo').innerHTML =
          `<strong>${esc(email)}</strong>로 인증코드를 발송했습니다.<br>6자리 코드를 입력 후 제출하세요.`;
        document.getElementById('reqOtpSection').style.display = '';
        document.getElementById('reqOtpError').hidden = true;
        btnText.textContent = '인증 후 제출하기';
        setTimeout(() => document.getElementById('reqOTP').focus(), 100);
      });
      return;
    }

    // ── 수강생 질문: 2단계 (OTP 인증 후 제출) ──
    const btn = document.getElementById('studentSubmitBtn');
    const btnText = document.getElementById('studentSubmitText');
    const btnSpinner = btn.querySelector('.btn-spinner');

    // 2단계: OTP 확인 후 실제 제출
    if (submitStep === 'otp_pending') {
      const otp = document.getElementById('submitOTP').value.trim();
      const otpErr = document.getElementById('submitOtpError');
      if (!otp) { otpErr.textContent = '인증코드를 입력해 주세요.'; otpErr.hidden = false; return; }
      otpErr.hidden = true;
      btn.disabled = true; btnText.hidden = true; btnSpinner.hidden = false;

      const email = (pendingFd.get('email') || '').trim().toLowerCase();
      doJsonp(`${SCRIPT_URL}?action=verifyOTP&email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, async result => {
        if (!result || !result.ok) {
          btn.disabled = false; btnText.hidden = false; btnSpinner.hidden = true;
          otpErr.textContent = '인증코드가 일치하지 않거나 만료됐습니다.';
          otpErr.hidden = false;
          return;
        }
        // OTP 확인 완료 → 실제 저장
        try {
          await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: pendingFd });
          submitStep = 'idle';
          saveAuthState({ email, otp, otpVerified: true });
          showSuccess({
            timestamp: pendingFd.get('timestamp'), type: '수강생질문',
            name: pendingFd.get('name'), email: pendingFd.get('email'),
            subject: pendingFd.get('subject'), question: pendingFd.get('question'),
            _listTitle: '제출한 질문<span class="list-title-sub">(등록시 작성한 이메일 인증으로 조회)</span>'
          });
        } catch {
          alert('제출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
          btn.disabled = false; btnText.hidden = false; btnSpinner.hidden = true;
        }
      });
      return;
    }

    // 1단계: 폼 검증 후 OTP 발송
    if (!validate(form)) return;
    btn.disabled = true; btnText.hidden = true; btnSpinner.hidden = false;

    const fd = new FormData(form);
    fd.append('type', '수강생질문');
    fd.append('timestamp', new Date().toLocaleString('ko-KR'));
    const email = (fd.get('email') || '').trim().toLowerCase();

    doJsonp(`${SCRIPT_URL}?action=sendOTP&email=${encodeURIComponent(email)}`, result => {
      btn.disabled = false; btnText.hidden = false; btnSpinner.hidden = true;
      if (!result || !result.ok) {
        alert('인증코드 발송에 실패했습니다: ' + (result && result.msg ? result.msg : '다시 시도해 주세요.'));
        return;
      }
      pendingFd = fd;
      submitStep = 'otp_pending';
      // 폼 필드 잠금
      form.querySelectorAll('input:not(#submitOTP), select, textarea').forEach(el => el.disabled = true);
      // OTP 입력란 표시
      document.getElementById('submitOtpInfo').innerHTML =
        `<strong>${esc(email)}</strong>로 인증코드를 발송했습니다.<br>6자리 코드를 입력 후 제출하세요.`;
      document.getElementById('submitOtpSection').style.display = '';
      document.getElementById('submitOtpError').hidden = true;
      btnText.textContent = '인증 후 제출하기';
      setTimeout(() => document.getElementById('submitOTP').focus(), 100);
    });
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


// ── 성공 화면 ──
function showSuccess(submittedRow) {
  const isReqType = submittedRow && submittedRow.type === '기타요청';
  document.getElementById('myqLabel').textContent       = isReqType ? '강의 요청 목록' : '수강생 질문 목록';
  document.getElementById('myqAuthBtnText').textContent = isReqType ? '내 요청 확인'   : '내 질문 확인';
  document.getElementById('resetBtn').textContent       = isReqType ? '다시 요청하기'  : '다시 문의하기';
  document.querySelector('.contact-desc').style.display = 'none';
  document.querySelector('.tabs').style.display = 'none';
  document.querySelectorAll('.contact-form').forEach(f => {
    f.classList.remove('active');
    f.classList.add('hidden-form');
  });
  document.querySelector('.success-msg').hidden = false;

  if (submittedRow) {
    renderList([submittedRow], submittedRow._listTitle || '제출한 질문');
  }
}

// ── 다시 문의하기 ──
function resetForm() {
  // OTP 제출 상태 초기화
  submitStep = 'idle'; pendingFd = null;
  document.getElementById('submitOtpSection').style.display = 'none';
  document.getElementById('submitOtpError').hidden = true;
  document.getElementById('studentSubmitText').textContent = '질문 제출하기';
  reqSubmitStep = 'idle'; reqPendingFd = null;
  document.getElementById('reqOtpSection').style.display = 'none';
  document.getElementById('reqOtpError').hidden = true;
  document.getElementById('reqConsentError').hidden = true;
  document.getElementById('reqSubmitText').textContent = '강의 요청 제출하기';

  document.querySelector('.tabs').style.display = '';
  document.querySelectorAll('.contact-form').forEach(f => {
    f.classList.remove('hidden-form', 'active');
    // 잠금 해제
    f.querySelectorAll('input, select, textarea').forEach(el => el.disabled = false);
    const btn = f.querySelector('.submit-btn');
    if (btn) {
      btn.disabled = false;
      btn.querySelector('.btn-text').hidden = false;
      btn.querySelector('.btn-spinner').hidden = true;
    }
    f.reset();
  });
  const cErr = document.getElementById('consentError');
  if (cErr) cErr.hidden = true;
  document.querySelector('#form-student').classList.add('active');
  document.querySelectorAll('.tab')[0].classList.add('active');
  document.querySelectorAll('.tab')[1].classList.remove('active');
  document.querySelector('.success-msg').hidden = true;
  document.querySelector('.contact-list-section').style.display = 'none';
}

// ════════════════════════════════════════
//  본인 확인 모달 (OTP)
// ════════════════════════════════════════
function openAuthModal() {
  // 이미 OTP 인증된 상태면 모달 생략하고 바로 목록 로드
  if (authState && authState.otpVerified) {
    refreshList();
    return;
  }
  backToStep1();
  document.getElementById('authOverlay').classList.add('open');
  setTimeout(() => document.getElementById('authEmail').focus(), 100);
}
function closeAuthModal() {
  document.getElementById('authOverlay').classList.remove('open');
}
function backToStep1() {
  document.getElementById('authStep1').style.display = '';
  document.getElementById('authStep2').style.display = 'none';
  document.getElementById('authEmail').value = '';
  document.getElementById('authError').hidden = true;
  document.getElementById('authOTP').value = '';
  document.getElementById('otpError').hidden = true;
  const sendBtn = document.getElementById('otpSendBtn');
  sendBtn.disabled = false;
  sendBtn.querySelector('.btn-text').hidden = false;
  sendBtn.querySelector('.btn-spinner').hidden = true;
}

document.getElementById('authEmail').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendOTP();
});
document.getElementById('authOTP').addEventListener('keydown', e => {
  if (e.key === 'Enter') verifyOTP();
});

function sendOTP() {
  const email = document.getElementById('authEmail').value.trim().toLowerCase();
  const errEl = document.getElementById('authError');
  if (!email) {
    errEl.textContent = '이메일을 입력해 주세요.';
    errEl.hidden = false;
    return;
  }
  errEl.hidden = true;

  const btn = document.getElementById('otpSendBtn');
  btn.disabled = true;
  btn.querySelector('.btn-text').hidden = true;
  btn.querySelector('.btn-spinner').hidden = false;

  doJsonp(`${SCRIPT_URL}?action=sendOTP&email=${encodeURIComponent(email)}`, result => {
    btn.disabled = false;
    btn.querySelector('.btn-text').hidden = false;
    btn.querySelector('.btn-spinner').hidden = true;

    if (!result || !result.ok) {
      errEl.textContent = (result && result.msg) || '인증코드 발송에 실패했습니다. 이메일을 확인해 주세요.';
      errEl.hidden = false;
      return;
    }
    document.getElementById('otpSentMsg').innerHTML =
      `<strong>${esc(email)}</strong>로 인증코드를 발송했습니다.<br />이메일을 확인 후 6자리 코드를 입력하세요.`;
    document.getElementById('authStep1').style.display = 'none';
    document.getElementById('authStep2').style.display = '';
    setTimeout(() => document.getElementById('authOTP').focus(), 100);
  });
}

function verifyOTP() {
  const email = document.getElementById('authEmail').value.trim().toLowerCase();
  const otp   = document.getElementById('authOTP').value.trim();
  const errEl = document.getElementById('otpError');

  if (!otp) {
    errEl.textContent = '인증코드를 입력해 주세요.';
    errEl.hidden = false;
    return;
  }

  const btn = document.getElementById('otpVerifyBtn');
  btn.disabled = true;
  btn.querySelector('.btn-text').hidden = true;
  btn.querySelector('.btn-spinner').hidden = false;

  const onReqTab = isRequestTab();
  const verifyAction = onReqTab ? 'verifyOTPReq' : 'verifyOTP';
  doJsonp(`${SCRIPT_URL}?action=${verifyAction}&email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, result => {
    btn.disabled = false;
    btn.querySelector('.btn-text').hidden = false;
    btn.querySelector('.btn-spinner').hidden = true;

    if (!result || !result.ok) {
      errEl.textContent = '인증코드가 일치하지 않거나 만료됐습니다.';
      errEl.hidden = false;
      return;
    }
    saveAuthState({ email, otp, otpVerified: true });
    closeAuthModal();
    const rows = (result.data || []).map(normalizeRow);
    renderList(rows, onReqTab ? '내 요청 목록' : '내 질문 목록');
  });
}

// ── 범용 JSONP ──
function doJsonp(url, onResult) {
  const cbName = '_jp_' + Date.now();
  const timer = setTimeout(() => { delete window[cbName]; onResult(null); }, 8000);
  window[cbName] = function(data) {
    clearTimeout(timer);
    delete window[cbName];
    const s = document.getElementById('jsonp-tmp-script');
    if (s) s.remove();
    onResult(data);
  };
  const script = document.createElement('script');
  script.id = 'jsonp-tmp-script';
  script.onerror = () => { clearTimeout(timer); delete window[cbName]; onResult(null); };
  script.src = url + `&callback=${cbName}&t=${Date.now()}`;
  document.head.appendChild(script);
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
  showAdminPanel();
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
  if (r.timestamp !== undefined) return r;
  const v = Object.values(r);
  return {
    timestamp:  String(v[0]||''),
    type:       String(v[1]||''),
    name:       String(v[2]||''),
    email:      String(v[3]||''),
    subject:    String(v[4]||''),
    question:   String(v[5]||''),
    status:     String(v[6]||''),
    answeredAt: String(v[7]||''),
  };
}

// ════════════════════════════════════════
//  목록 렌더링
// ════════════════════════════════════════
function renderList(rows, title) {
  currentRows = rows;
  currentListTitle = title;
  document.querySelector('.contact-list-section').style.display = 'block';
  document.getElementById('listTitle').innerHTML = title;
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
    const answered = row.status === '답변완료';
    el.innerHTML = `
      <span class="clist-col-subject"><span class="clist-subject-badge">${esc(row.subject||'-')}</span></span>
      <span class="clist-col-title">${esc(row.name||'-')}${answered ? '<br><span class="answered-badge">✓ 답변완료</span>' : ''}</span>
      <span class="clist-col-date">${formatTs(row.timestamp)}${answered && row.answeredAt ? '<br><span class="answered-date">'+formatTs(row.answeredAt)+'</span>' : ''}</span>`;
    body.appendChild(el);
  });
}

// ════════════════════════════════════════
//  상세 모달
// ════════════════════════════════════════
function openDetailModal(row) {
  currentRow = row;

  const isReq = row.type === '기타요청';

  const isAnswered = row.status === '답변완료';
  const canEdit = !isAnswered && authState && (
    authState.otpVerified && (row.email || '').trim().toLowerCase() === authState.email
  );

  const bodyHtml = isReq
    ? [
        row.reqName ? `담당자: ${esc(row.reqName)}`                               : '',
        row.org     ? `기관/회사명: ${esc(row.org)}`                              : '',
        row.place   ? `강의 장소: ${esc(row.place)}`                              : '',
        row.date    ? `희망 일정: ${esc(row.date)}`                               : '',
        row.people  ? `대상 인원: ${esc(row.people)}`                             : '',
        row.message ? `요청사항:<br>${esc(row.message).replace(/\n/g,'<br>')}` : ''
      ].filter(Boolean).join('<br>')
    : esc(row.question||'').replace(/\n/g,'<br>');

  document.getElementById('detailContent').innerHTML = `
    <div class="detail-subject"><span class="clist-subject-badge">${esc(row.subject||'-')}</span></div>
    <h3 class="detail-title">${esc(row.name||'-')}</h3>
    <div class="detail-meta">${esc(row.email||'')} · ${formatTs(row.timestamp)}</div>
    <div class="detail-divider"></div>
    <div class="detail-body">${bodyHtml}</div>`;

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
  if (currentRow.status === '답변완료') {
    alert('관리자가 답변완료한 내용은 수정 및 삭제가 불가합니다.');
    return;
  }
  const isReq = currentRow.type === '기타요청';
  document.getElementById('editModalTitle').textContent = isReq ? '강의 요청 수정' : '질문 수정';
  document.getElementById('editStudentFields').style.display  = isReq ? 'none' : '';
  document.getElementById('editRequestFields').style.display  = isReq ? ''     : 'none';
  if (isReq) {
    document.getElementById('edit-req-name').value = currentRow.reqName || '';
    document.getElementById('edit-topic').value    = currentRow.name    || '';
    document.getElementById('edit-org').value      = currentRow.org     || '';
    document.getElementById('edit-place').value    = currentRow.place   || '';
    document.getElementById('edit-date').value     = currentRow.date    || '';
    document.getElementById('edit-people').value   = currentRow.people  || '';
    document.getElementById('edit-message').value  = currentRow.message || '';
  } else {
    document.getElementById('edit-subject').value  = currentRow.subject  || '';
    document.getElementById('edit-title').value    = currentRow.name     || '';
    document.getElementById('edit-question').value = currentRow.question || '';
  }
  closeDetailModal();
  document.getElementById('editOverlay').classList.add('open');
}
function closeEditModal() {
  document.getElementById('editOverlay').classList.remove('open');
}

document.getElementById('editForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  if (!currentRow) return;

  const isReq = currentRow.type === '기타요청';
  const fd = new FormData();
  fd.append('action', 'update');
  fd.append('ts',     currentRow.timestamp);
  fd.append('email',  currentRow.email);

  if (isReq) {
    fd.append('sheet',   '강의요청');
    fd.append('reqName', document.getElementById('edit-req-name').value);
    fd.append('topic',   document.getElementById('edit-topic').value);
    fd.append('org',     document.getElementById('edit-org').value);
    fd.append('place',   document.getElementById('edit-place').value);
    fd.append('date',    document.getElementById('edit-date').value);
    fd.append('people',  document.getElementById('edit-people').value);
    fd.append('message', document.getElementById('edit-message').value);
  } else {
    fd.append('name',     document.getElementById('edit-title').value);
    fd.append('subject',  document.getElementById('edit-subject').value);
    fd.append('question', document.getElementById('edit-question').value);
  }

  const btn = this.querySelector('.edit-save-btn');
  btn.disabled = true; btn.textContent = '저장 중…';

  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 10000);
    await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: fd, signal: ctrl.signal });
    clearTimeout(tid);
    if (currentRow) {
      if (isReq) {
        currentRow.reqName = document.getElementById('edit-req-name').value;
        currentRow.name    = document.getElementById('edit-topic').value;
        currentRow.org     = document.getElementById('edit-org').value;
        currentRow.place   = document.getElementById('edit-place').value;
        currentRow.date    = document.getElementById('edit-date').value;
        currentRow.people  = document.getElementById('edit-people').value;
        currentRow.message = document.getElementById('edit-message').value;
      } else {
        currentRow.name     = document.getElementById('edit-title').value;
        currentRow.subject  = document.getElementById('edit-subject').value;
        currentRow.question = document.getElementById('edit-question').value;
      }
    }
    closeEditModal();
    alert('수정됐습니다.');
    renderList(currentRows, currentListTitle);
  } catch {
    alert('수정 중 오류가 발생했습니다. 다시 시도해 주세요.');
    btn.disabled = false; btn.textContent = '저장하기';
  }
});

// ════════════════════════════════════════
//  삭제
// ════════════════════════════════════════
async function deleteFromDetail() {
  if (!currentRow) return;
  if (currentRow.status === '답변완료') {
    alert('관리자가 답변완료한 내용은 수정 및 삭제가 불가합니다.');
    return;
  }
  if (!confirm('이 게시글을 삭제하시겠습니까?')) return;

  const fd = new FormData();
  fd.append('action', 'delete');
  fd.append('ts',     currentRow.timestamp);
  fd.append('email',  currentRow.email);
  if (currentRow.type === '기타요청') fd.append('sheet', '강의요청');

  try {
    await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: fd });
    // 로컬 캐시에서 즉시 제거
    currentRows = currentRows.filter(r => r !== currentRow);
    closeDetailModal();
    alert('삭제됐습니다.');
    renderList(currentRows, currentListTitle);
  } catch {
    alert('삭제 중 오류가 발생했습니다.');
  }
}

// ════════════════════════════════════════
//  관리자 패널
// ════════════════════════════════════════
let adminCurrentRow  = null;
let adminCurrentType = 'contacts';

function showAdminPanel() {
  document.getElementById('userSection').style.display  = 'none';
  document.querySelector('.tabs').style.display         = 'none';
  document.querySelectorAll('.contact-form').forEach(f => {
    f.classList.remove('active'); f.classList.add('hidden-form');
  });
  document.querySelector('.success-msg').hidden = true;
  document.getElementById('adminPanel').style.display = '';
  document.querySelector('.contact-desc').style.display = 'none';
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.admin-tab[data-type="contacts"]').classList.add('active');
  adminCurrentType = 'contacts';
  loadAdminData('contacts');
}

function exitAdminMode() {
  clearAuthState();
  document.getElementById('adminPanel').style.display  = 'none';
  document.getElementById('userSection').style.display = '';
  document.querySelector('.tabs').style.display = '';
  document.querySelectorAll('.contact-form').forEach(f => f.classList.remove('hidden-form'));
  document.querySelector('.contact-form').classList.add('active');
}

function switchAdminTab(btn) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  adminCurrentType = btn.dataset.type;
  loadAdminData(adminCurrentType);
}

function loadAdminData(type) {
  const action = type === 'requests' ? 'adminRequests' : 'adminContacts';
  document.getElementById('adminListBody').innerHTML = '<div class="clist-loading">불러오는 중…</div>';
  doJsonp(`${SCRIPT_URL}?action=${action}&t=${Date.now()}`, result => {
    if (!result || !result.ok) {
      document.getElementById('adminListBody').innerHTML = '<div class="clist-loading">데이터를 불러올 수 없습니다.</div>';
      return;
    }
    renderAdminList((result.data || []).map(normalizeRow), type);
  });
}

function renderAdminList(rows, type) {
  const body = document.getElementById('adminListBody');
  if (!rows.length) {
    body.innerHTML = '<div class="clist-loading">등록된 내용이 없습니다.</div>';
    return;
  }
  body.innerHTML = '';
  rows.slice().reverse().forEach(row => {
    const isAns = row.status === '답변완료';
    const el = document.createElement('div');
    el.className = 'admin-list-item' + (isAns ? ' answered' : '');
    el.innerHTML = `
      <span class="acol-subject">
        <span class="clist-subject-badge">${esc(row.subject||'-')}</span>
        ${isAns ? '<br><span class="admin-answered-badge">✓ 답변완료</span>' : ''}
      </span>
      <span class="acol-title">${esc(row.name||'-')}</span>
      <span class="acol-email">${esc(row.email||'')}</span>
      <span class="acol-date">${formatTs(row.timestamp)}${isAns && row.answeredAt ? '<br><span class="admin-ans-date">'+formatTs(row.answeredAt)+'</span>' : ''}</span>`;
    el.addEventListener('click', () => openAdminDetail(row, type));
    body.appendChild(el);
  });
}

function openAdminDetail(row, type) {
  adminCurrentRow  = row;
  adminCurrentType = type || 'contacts';
  const isReq   = type === 'requests';
  const isAns   = row.status === '답변완료';

  document.getElementById('adminDetailHeader').innerHTML = `
    <div class="admin-detail-info">
      <div class="admin-detail-badge-row">
        <span class="clist-subject-badge">${esc(row.subject||'-')}</span>
        ${isAns ? ' <span class="admin-answered-badge">✓ 답변완료</span>' : ''}
      </div>
      <div class="admin-detail-title">${esc(row.name||'-')}</div>
      <div class="admin-detail-meta">${esc(row.email||'')} · ${formatTs(row.timestamp)}</div>
    </div>`;

  const sf = document.getElementById('aeStudentFields');
  const rf = document.getElementById('aeRequestFields');
  if (isReq) {
    sf.style.display = 'none'; rf.style.display = '';
    document.getElementById('ae-reqname').value = row.reqName || '';
    document.getElementById('ae-topic').value   = row.name    || '';
    document.getElementById('ae-org').value     = row.org     || '';
    document.getElementById('ae-place').value   = row.place   || '';
    document.getElementById('ae-date').value    = row.date    || '';
    document.getElementById('ae-people').value  = row.people  || '';
    document.getElementById('ae-message').value = row.message || '';
  } else {
    sf.style.display = ''; rf.style.display = 'none';
    document.getElementById('ae-subject').value  = row.subject  || '';
    document.getElementById('ae-title').value    = row.name     || '';
    document.getElementById('ae-question').value = row.question || '';
  }

  const originalTxt = isReq
    ? `[강의요청 내용]\n담당자: ${row.reqName||''}\n기관/회사명: ${row.org||''}\n희망 강의 주제: ${row.name||''}\n강의 장소: ${row.place||''}\n희망 일정: ${row.date||''}\n대상 인원: ${row.people||''}\n기타 요청사항: ${row.message||''}`
    : `[질문 내용]\n과목: ${row.subject||''}\n제목: ${row.name||''}\n\n${row.question||''}`;
  document.getElementById('adminReplyText').value =
    `안녕하세요, ${isReq ? (row.reqName||row.name) : row.name}님.\n\n아래 내용에 대해 답변 드립니다.\n\n${'─'.repeat(32)}\n${originalTxt}\n${'─'.repeat(32)}\n\n[이곳에 답변을 작성해 주세요]\n\n감사합니다.\nAI Study 강의 담당자 드림`;

  // (1) 버튼 상태 초기화
  const btn = document.getElementById('adminSendBtn');
  const txt = document.getElementById('adminSendText');
  const spn = document.getElementById('adminSendSpinner');
  btn.disabled = false; txt.hidden = false; spn.hidden = true;

  // (3) 답변완료 여부에 따라 섹션 전환
  const replyTA   = document.getElementById('adminReplyText');
  const ansTime   = document.getElementById('adminAnsweredTime');
  const secLabel  = document.getElementById('adminReplySectionLabel');
  if (isAns) {
    replyTA.style.display  = 'none';
    ansTime.style.display  = '';
    ansTime.textContent    = '답변 이메일 발송 시각 : ' + formatTs(row.answeredAt);
    secLabel.innerHTML     = '답변 완료';
    btn.style.display      = 'none';
  } else {
    replyTA.style.display  = '';
    ansTime.style.display  = 'none';
    secLabel.innerHTML     = '답변 작성 <span class="admin-section-sub">(이메일로 발송됩니다)</span>';
    btn.style.display      = '';
  }

  document.getElementById('adminDetailOverlay').classList.add('open');
}

function closeAdminDetail() {
  document.getElementById('adminDetailOverlay').classList.remove('open');
}

async function saveAdminEdit() {
  if (!adminCurrentRow) return;
  const isReq = adminCurrentType === 'requests';
  const fd = new FormData();
  fd.append('action', 'update');
  fd.append('ts',    adminCurrentRow.timestamp);
  fd.append('email', adminCurrentRow.email);
  if (isReq) {
    fd.append('sheet',   '강의요청');
    fd.append('reqName', document.getElementById('ae-reqname').value);
    fd.append('topic',   document.getElementById('ae-topic').value);
    fd.append('org',     document.getElementById('ae-org').value);
    fd.append('place',   document.getElementById('ae-place').value);
    fd.append('date',    document.getElementById('ae-date').value);
    fd.append('people',  document.getElementById('ae-people').value);
    fd.append('message', document.getElementById('ae-message').value);
  } else {
    fd.append('name',     document.getElementById('ae-title').value);
    fd.append('subject',  document.getElementById('ae-subject').value);
    fd.append('question', document.getElementById('ae-question').value);
  }
  const btn = document.querySelector('.admin-save-btn');
  btn.disabled = true; btn.textContent = '저장 중…';
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 10000);
    await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: fd, signal: ctrl.signal });
    clearTimeout(tid);
    if (isReq) {
      adminCurrentRow.reqName = document.getElementById('ae-reqname').value;
      adminCurrentRow.name    = document.getElementById('ae-topic').value;
      adminCurrentRow.org     = document.getElementById('ae-org').value;
      adminCurrentRow.place   = document.getElementById('ae-place').value;
      adminCurrentRow.date    = document.getElementById('ae-date').value;
      adminCurrentRow.people  = document.getElementById('ae-people').value;
      adminCurrentRow.message = document.getElementById('ae-message').value;
    } else {
      adminCurrentRow.subject  = document.getElementById('ae-subject').value;
      adminCurrentRow.name     = document.getElementById('ae-title').value;
      adminCurrentRow.question = document.getElementById('ae-question').value;
    }
    document.querySelector('.admin-detail-title').textContent = adminCurrentRow.name;
    btn.textContent = '저장됐습니다 ✓';
    setTimeout(() => { btn.disabled = false; btn.textContent = '수정 저장'; }, 2000);
  } catch {
    alert('저장 중 오류가 발생했습니다.');
    btn.disabled = false; btn.textContent = '수정 저장';
  }
}

async function sendAdminReply() {
  if (!adminCurrentRow) return;
  const replyText = document.getElementById('adminReplyText').value.trim();
  if (!replyText) { alert('답변 내용을 입력해 주세요.'); return; }

  const isReq  = adminCurrentType === 'requests';
  const toName = isReq ? (adminCurrentRow.reqName || adminCurrentRow.name) : adminCurrentRow.name;

  const originalHtml = isReq
    ? `<p><b>담당자:</b> ${esc(adminCurrentRow.reqName||'')}</p>
       <p><b>기관/회사명:</b> ${esc(adminCurrentRow.org||'')}</p>
       <p><b>희망 강의 주제:</b> ${esc(adminCurrentRow.name||'')}</p>
       <p><b>강의 장소:</b> ${esc(adminCurrentRow.place||'')}</p>
       <p><b>희망 일정:</b> ${esc(adminCurrentRow.date||'')}</p>
       <p><b>대상 인원:</b> ${esc(adminCurrentRow.people||'')}</p>
       <p><b>기타 요청사항:</b> ${esc(adminCurrentRow.message||'')}</p>`
    : `<p><b>과목:</b> ${esc(adminCurrentRow.subject||'')}</p>
       <p><b>제목:</b> ${esc(adminCurrentRow.name||'')}</p>
       <p style="margin-top:0.5rem;white-space:pre-wrap">${esc(adminCurrentRow.question||'')}</p>`;

  const htmlBody = `<div style="font-family:sans-serif;max-width:600px;color:#333">
    <p>안녕하세요, <b>${esc(toName)}</b>님.</p><br>
    <div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:16px 0;font-size:.9rem">
      <p style="color:#666;margin:0 0 10px;font-weight:600">▶ 원문 내용</p>${originalHtml}
    </div>
    <div style="padding:16px;border-left:4px solid #4f46e5;background:#f8f7ff;margin:16px 0">
      <p style="color:#4f46e5;margin:0 0 10px;font-weight:600">▶ 답변</p>
      <p style="white-space:pre-wrap">${esc(replyText)}</p>
    </div>
    <p>감사합니다.</p><p><b>AI Study 강의 담당자 드림</b></p>
  </div>`;

  const fd = new FormData();
  fd.append('action',   'reply');
  fd.append('sheet',    isReq ? '강의요청' : '강의문의');
  fd.append('ts',       adminCurrentRow.timestamp);
  fd.append('email',    adminCurrentRow.email);
  fd.append('subject',  isReq ? '[AI Study] 강의요청 검토 결과 안내드립니다.' : '[AI Study] 강의문의 답변 드립니다.');
  fd.append('htmlBody', htmlBody);

  const btn = document.getElementById('adminSendBtn');
  const txt = document.getElementById('adminSendText');
  const spn = document.getElementById('adminSendSpinner');
  btn.disabled = true; txt.hidden = true; spn.hidden = false;

  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 15000);
    await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: fd, signal: ctrl.signal });
    clearTimeout(tid);
    adminCurrentRow.status     = '답변완료';
    adminCurrentRow.answeredAt = new Date().toLocaleString('ko-KR');
    closeAdminDetail();
    alert(`${adminCurrentRow.email} 으로 답변을 발송했습니다.`);
    loadAdminData(adminCurrentType);
  } catch {
    alert('발송 중 오류가 발생했습니다. 다시 시도해 주세요.');
    btn.disabled = false; txt.hidden = false; spn.hidden = true;
  }
}

// ── 목록 새로고침 ──
function isRequestTab() {
  const active = document.querySelector('.tab.active');
  return !!(active && active.dataset.tab === 'request');
}

function refreshList() {
  if (!authState) return;
  if (authState.isAdmin) {
    showAdminPanel(); return;
  } else if (authState.otpVerified) {
    const onReqTab = isRequestTab();
    const action = onReqTab ? 'verifyOTPReq' : 'verifyOTP';
    const title  = onReqTab ? '내 요청 목록' : '내 질문 목록';
    doJsonp(`${SCRIPT_URL}?action=${action}&email=${encodeURIComponent(authState.email)}&otp=${encodeURIComponent(authState.otp)}`, result => {
      if (!result || !result.ok) { alert('인증이 만료됐습니다. 다시 인증해 주세요.'); clearAuthState(); return; }
      renderList((result.data || []).map(normalizeRow), title);
    });
  }
}

// ── 유틸 ──
function formatTs(ts) {
  if (!ts) return '-';
  const s = String(ts);
  const m = s.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2}).*?(\d{1,2}):(\d{2})/);
  if (m) return `${m[1]}.${m[2].padStart(2,'0')}.${m[3].padStart(2,'0')} ${m[4].padStart(2,'0')}:${m[5]}`;
  const d = s.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
  if (d) return `${d[1]}.${d[2].padStart(2,'0')}.${d[3].padStart(2,'0')}`;
  return s;
}
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── 실시간 에러 해제 ──
document.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('input', () => el.classList.remove('error'));
});

// ── 모달 overlay 닫기: mousedown 시작점도 overlay여야만 닫힘 ──
// (textarea 드래그 선택 후 바깥에서 놓을 때 닫히는 버그 방지)
[
  { id: 'authOverlay',        fn: closeAuthModal    },
  { id: 'adminOverlay',       fn: closeAdminModal   },
  { id: 'detailOverlay',      fn: closeDetailModal  },
  { id: 'editOverlay',        fn: closeEditModal    },
  { id: 'adminDetailOverlay', fn: closeAdminDetail  }
].forEach(({ id, fn }) => {
  const el = document.getElementById(id);
  let downOnSelf = false;
  el.addEventListener('mousedown', e => { downOnSelf = (e.target === el); });
  el.addEventListener('click', e => {
    const sel = window.getSelection ? window.getSelection().toString() : '';
    if (downOnSelf && e.target === el && !sel) fn();
    downOnSelf = false;
  });
});
