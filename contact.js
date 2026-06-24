// ── Google Apps Script 배포 URL (설정 후 여기에 붙여넣기) ──
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyPPAOwi8rOnrG7x4MKUAXE-8AGkToLW0HrIK6WBii_00YDgQJrMy3mbJybklHnuHxx6A/exec';

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
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: fd
      });
      showSuccess();
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
    f.reset();
  });
  document.querySelector('#form-student').classList.add('active');
  document.querySelectorAll('.tab')[0].classList.add('active');
  document.querySelectorAll('.tab')[1].classList.remove('active');
  document.querySelector('.success-msg').hidden = true;
}

// ── 실시간 에러 해제 ──
document.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('input', () => el.classList.remove('error'));
});
