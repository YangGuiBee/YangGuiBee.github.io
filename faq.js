const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyPPAOwi8rOnrG7x4MKUAXE-8AGkToLW0HrIK6WBii_00YDgQJrMy3mbJybklHnuHxx6A/exec';

const ADMIN_HASH = '0c8be907519b16e99fe9c8f9449df05530908fe6612bde43426da7295819a6fd';

async function hashPassword(pw) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

let posts = [];
let editingId = null;
let isAdmin = sessionStorage.getItem('ai_admin') === 'true';

function formatDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

function loadPostsFromSheets() {
  const cbName = '_loadFaq_' + Date.now();
  window[cbName] = function(data) {
    posts = Array.isArray(data) ? data.filter(p => p.category === 'faq') : [];
    renderPosts();
    delete window[cbName];
    const s = document.getElementById('jsonp-script');
    if (s) s.remove();
  };
  const script = document.createElement('script');
  script.id = 'jsonp-script';
  script.onerror = function() { posts = []; renderPosts(); delete window[cbName]; };
  script.src = `${SCRIPT_URL}?action=list&callback=${cbName}&t=${Date.now()}`;
  document.head.appendChild(script);
}

function applyAdminUI() {
  if (isAdmin) {
    document.body.classList.add('is-admin');
    document.getElementById('adminStatus').textContent = '관리자 모드';
  } else {
    document.body.classList.remove('is-admin');
    document.getElementById('uploadForm').hidden = true;
  }
}

function openLoginModal() {
  document.getElementById('loginOverlay').classList.add('open');
  document.getElementById('loginPw').value = '';
  document.getElementById('loginError').hidden = true;
  setTimeout(() => document.getElementById('loginPw').focus(), 100);
}
function closeLoginModal() { document.getElementById('loginOverlay').classList.remove('open'); }

async function submitLogin() {
  const pw = document.getElementById('loginPw').value;
  if (await hashPassword(pw) === ADMIN_HASH) {
    isAdmin = true;
    sessionStorage.setItem('ai_admin', 'true');
    closeLoginModal(); applyAdminUI(); toggleUpload();
  } else {
    document.getElementById('loginError').hidden = false;
    document.getElementById('loginPw').value = '';
    document.getElementById('loginPw').focus();
  }
}
function adminLogin() { if (isAdmin) toggleUpload(); else openLoginModal(); }
function adminLogout() {
  isAdmin = false;
  sessionStorage.removeItem('ai_admin');
  applyAdminUI();
  document.getElementById('uploadForm').hidden = true;
}

function renderPosts() {
  const list  = document.getElementById('boardList');
  const empty = document.getElementById('boardEmpty');
  const keyword = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
  let filtered = posts;
  if (keyword) {
    filtered = filtered.filter(p =>
      (p.title || '').toLowerCase().includes(keyword) ||
      (p.content || '').toLowerCase().includes(keyword)
    );
  }
  list.innerHTML = '';
  if (filtered.length === 0) {
    empty.hidden = false; empty.style.display = 'flex'; return;
  }
  empty.hidden = true; empty.style.display = 'none';

  filtered.slice().reverse().forEach(post => {
    const el = document.createElement('div');
    el.className = 'board-item';
    el.innerHTML = `
      <span class="faq-q">Q</span>
      <span class="board-item-title">${post.title}</span>
      <div class="board-item-meta">
        <span class="board-item-date">${formatDate(post.date)}</span>
        ${post.link ? `<span class="board-item-file"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg></span>` : ''}
      </div>`;
    el.onclick = () => openModal(post);
    list.appendChild(el);
  });
}

function openModal(post) {
  const adminBtns = isAdmin ? `
    <div class="modal-admin-btns">
      <button class="modal-edit-btn" onclick="startEdit('${post.id}'); closeModal();">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>수정
      </button>
      <button class="modal-delete-btn" onclick="deletePost('${post.id}')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>삭제
      </button>
    </div>` : '';
  document.getElementById('modalContent').innerHTML = `
    <p class="faq-modal-q">Q</p>
    <h2 class="modal-title">${post.title}</h2>
    <p class="modal-meta">${formatDate(post.date)}</p>
    ${adminBtns}
    <div class="modal-divider"></div>
    <p class="faq-modal-a">A</p>
    <div class="modal-body">${post.content || '답변이 없습니다.'}</div>
    ${post.link ? `<a href="${post.link}" target="_blank" class="modal-file-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>참고 링크</a>` : ''}`;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function startEdit(id) {
  const post = posts.find(p => String(p.id) === String(id));
  if (!post) return;
  editingId = id;
  const form = document.getElementById('uploadForm');
  form.title.value   = post.title;
  form.content.value = post.content || '';
  form.link.value    = post.link || '';
  document.getElementById('formTitle').textContent = 'FAQ 수정';
  form.querySelector('.submit-btn').textContent = '수정 완료';
  form.hidden = false;
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deletePost(id) {
  if (!confirm('이 FAQ를 삭제할까요?\n(Google Sheets에서도 해당 행을 직접 삭제해 주세요)')) return;
  posts = posts.filter(p => String(p.id) !== String(id));
  closeModal(); renderPosts();
}

function toggleUpload() {
  const form = document.getElementById('uploadForm');
  const isHidden = form.hidden;
  form.hidden = !isHidden;
  if (!isHidden) { editingId = null; form.reset(); }
  document.getElementById('formTitle').textContent = 'FAQ 등록';
  form.querySelector('.submit-btn').textContent = '등록하기';
  if (isHidden) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('.submit-btn');
  if (!form.title.value.trim() || !form.content.value.trim()) {
    alert('질문과 답변은 필수 항목입니다.'); return;
  }
  btn.disabled = true;
  btn.textContent = editingId ? '수정 중...' : '등록 중...';

  if (editingId) {
    const idx = posts.findIndex(p => String(p.id) === String(editingId));
    if (idx !== -1) {
      posts[idx] = { ...posts[idx],
        title:   form.title.value.trim(),
        content: form.content.value.trim(),
        link:    form.link.value.trim(),
      };
      const fd = new FormData();
      fd.append('type', 'resource');
      fd.append('timestamp', new Date().toLocaleString('ko-KR'));
      Object.entries(posts[idx]).forEach(([k,v]) => fd.append(k, v));
      try { await fetch(SCRIPT_URL, { method:'POST', mode:'no-cors', body:fd }); } catch {}
    }
    editingId = null;
  } else {
    const post = {
      id:       Date.now(),
      category: 'faq',
      author:   'Admin',
      title:    form.title.value.trim(),
      content:  form.content.value.trim(),
      link:     form.link.value.trim(),
      date:     new Date().toISOString()
    };
    const fd = new FormData();
    fd.append('type', 'resource');
    fd.append('timestamp', new Date().toLocaleString('ko-KR'));
    Object.entries(post).forEach(([k,v]) => fd.append(k, v));
    try { await fetch(SCRIPT_URL, { method:'POST', mode:'no-cors', body:fd }); } catch {}
    posts.push(post);
  }

  form.reset(); form.hidden = true;
  btn.disabled = false;
  document.getElementById('formTitle').textContent = 'FAQ 등록';
  btn.textContent = '등록하기';
  renderPosts();
});

document.getElementById('searchInput').addEventListener('input', () => renderPosts());
document.getElementById('loginPw').addEventListener('keydown', e => { if (e.key === 'Enter') submitLogin(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeLoginModal(); } });

applyAdminUI();
loadPostsFromSheets();
