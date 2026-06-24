const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyleJhzM77_e9WM7Gmrf-7Cs2Evcb_9gx-OXvvNY7cBJuj6I9fQEue0rKLCVgmmXGKjpA/exec';

// ── 관리자 비밀번호 ──
const ADMIN_PW = 'konkuk2026';

// ── 상태 ──
let posts = [];
let currentFilter = 'all';
let editingId = null;
let isAdmin = sessionStorage.getItem('ai_admin') === 'true';

const catLabel = { notice: '공지', ml: '머신러닝', itg: 'IT거버넌스' };
const catClass  = { notice: 'cat-notice', ml: 'cat-ml', itg: 'cat-itg' };

function formatDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

// ── Google Sheets에서 게시글 불러오기 (JSONP) ──
function loadPostsFromSheets() {
  const cbName = '_loadPosts_' + Date.now();
  window[cbName] = function(data) {
    if (Array.isArray(data) && data.length > 0) {
      posts = data;
    } else {
      // Sheets가 비어있으면 localStorage 캐시 사용
      posts = JSON.parse(localStorage.getItem('ai_study_posts') || '[]');
    }
    renderPosts();
    delete window[cbName];
    const s = document.getElementById('jsonp-script');
    if (s) s.remove();
  };

  const script = document.createElement('script');
  script.id = 'jsonp-script';
  script.onerror = function() {
    // 네트워크 오류 시 캐시 사용
    posts = JSON.parse(localStorage.getItem('ai_study_posts') || '[]');
    renderPosts();
    delete window[cbName];
  };
  script.src = `${SCRIPT_URL}?action=list&callback=${cbName}`;
  document.head.appendChild(script);
}

// ── 관리자 UI ──
function applyAdminUI() {
  if (isAdmin) {
    document.body.classList.add('is-admin');
    document.getElementById('adminStatus').textContent = '관리자 모드';
  } else {
    document.body.classList.remove('is-admin');
    document.getElementById('uploadForm').hidden = true;
  }
}

// ── 로그인 모달 ──
function openLoginModal() {
  document.getElementById('loginOverlay').classList.add('open');
  document.getElementById('loginPw').value = '';
  document.getElementById('loginError').hidden = true;
  setTimeout(() => document.getElementById('loginPw').focus(), 100);
}
function closeLoginModal() {
  document.getElementById('loginOverlay').classList.remove('open');
}
function submitLogin() {
  const pw = document.getElementById('loginPw').value;
  if (pw === ADMIN_PW) {
    isAdmin = true;
    sessionStorage.setItem('ai_admin', 'true');
    closeLoginModal();
    applyAdminUI();
    toggleUpload();
  } else {
    document.getElementById('loginError').hidden = false;
    document.getElementById('loginPw').value = '';
    document.getElementById('loginPw').focus();
  }
}
function adminLogin() {
  if (isAdmin) { toggleUpload(); } else { openLoginModal(); }
}
function adminLogout() {
  isAdmin = false;
  sessionStorage.removeItem('ai_admin');
  applyAdminUI();
  document.getElementById('uploadForm').hidden = true;
}

// ── 게시글 렌더링 ──
function renderPosts() {
  const list  = document.getElementById('boardList');
  const empty = document.getElementById('boardEmpty');
  const filtered = currentFilter === 'all' ? posts : posts.filter(p => p.category === currentFilter);
  list.innerHTML = '';
  if (filtered.length === 0) {
    empty.hidden = false;
    empty.style.display = 'flex';
    return;
  }
  empty.hidden = true;
  empty.style.display = 'none';

  filtered.slice().reverse().forEach(post => {
    const el = document.createElement('div');
    el.className = 'board-item';
    el.innerHTML = `
      <span class="board-category ${catClass[post.category]}">${catLabel[post.category]}</span>
      <span class="board-item-title">${post.title}</span>
      <div class="board-item-meta">
        <span class="board-item-author">${post.author}</span>
        <span class="board-item-date">${formatDate(post.date)}</span>
        ${post.link ? `<span class="board-item-file"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg></span>` : ''}
      </div>
    `;
    el.onclick = () => openModal(post);
    list.appendChild(el);
  });
}

// ── 게시글 모달 ──
function openModal(post) {
  const adminBtns = isAdmin ? `
    <div class="modal-admin-btns">
      <button class="modal-edit-btn" onclick="startEdit('${post.id}'); closeModal();">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        수정
      </button>
      <button class="modal-delete-btn" onclick="deletePost('${post.id}')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
        삭제
      </button>
    </div>` : '';

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-category"><span class="board-category ${catClass[post.category]}">${catLabel[post.category]}</span></div>
    <h2 class="modal-title">${post.title}</h2>
    <p class="modal-meta">${post.author} · ${formatDate(post.date)}</p>
    ${adminBtns}
    <div class="modal-divider"></div>
    <div class="modal-body">${post.content || '내용이 없습니다.'}</div>
    ${post.link ? `<a href="${post.link}" target="_blank" class="modal-file-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>첨부 파일 열기</a>` : ''}
  `;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── 수정 ──
function startEdit(id) {
  const post = posts.find(p => String(p.id) === String(id));
  if (!post) return;
  editingId = id;
  const form = document.getElementById('uploadForm');
  form.category.value = post.category;
  form.author.value   = post.author;
  form.title.value    = post.title;
  form.content.value  = post.content || '';
  form.link.value     = post.link || '';
  document.getElementById('formTitle').textContent = '자료 수정';
  form.querySelector('.submit-btn').textContent = '수정 완료';
  form.hidden = false;
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── 삭제 (로컬에서만 제거, Sheets는 직접 관리) ──
function deletePost(id) {
  if (!confirm('이 게시글을 삭제할까요?\n(Google Sheets에서도 해당 행을 직접 삭제해 주세요)')) return;
  posts = posts.filter(p => String(p.id) !== String(id));
  closeModal();
  renderPosts();
}

// ── 업로드 토글 ──
function toggleUpload() {
  const form = document.getElementById('uploadForm');
  if (!form.hidden) {
    form.hidden = true;
    editingId = null;
    form.reset();
    document.getElementById('formTitle').textContent = '자료 등록';
    form.querySelector('.submit-btn').textContent = '등록하기';
  } else {
    editingId = null;
    form.reset();
    document.getElementById('formTitle').textContent = '자료 등록';
    form.querySelector('.submit-btn').textContent = '등록하기';
    form.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ── 등록/수정 제출 ──
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('.submit-btn');

  if (!form.category.value || !form.author.value.trim() || !form.title.value.trim()) {
    alert('분류, 작성자, 제목은 필수 항목입니다.');
    return;
  }

  btn.disabled = true;
  btn.textContent = editingId ? '수정 중...' : '등록 중...';

  if (editingId) {
    const idx = posts.findIndex(p => String(p.id) === String(editingId));
    if (idx !== -1) {
      posts[idx] = { ...posts[idx],
        category: form.category.value,
        author:   form.author.value.trim(),
        title:    form.title.value.trim(),
        content:  form.content.value.trim(),
        link:     form.link.value.trim(),
      };
      // 수정도 Sheets에 전송 (새 행으로 추가됨 — 이전 행은 Sheets에서 직접 삭제)
      const fd = new FormData();
      fd.append('type', 'resource');
      fd.append('timestamp', new Date().toLocaleString('ko-KR'));
      Object.entries(posts[idx]).forEach(([k, v]) => fd.append(k, v));
      try { await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: fd }); } catch {}
    }
    editingId = null;
  } else {
    const post = {
      id:       Date.now(),
      category: form.category.value,
      author:   form.author.value.trim(),
      title:    form.title.value.trim(),
      content:  form.content.value.trim(),
      link:     form.link.value.trim(),
      date:     new Date().toISOString()
    };
    const fd = new FormData();
    fd.append('type', 'resource');
    fd.append('timestamp', new Date().toLocaleString('ko-KR'));
    Object.entries(post).forEach(([k, v]) => fd.append(k, v));
    try { await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: fd }); } catch {}
    posts.push(post);
  }

  form.reset();
  form.hidden = true;
  btn.disabled = false;
  document.getElementById('formTitle').textContent = '자료 등록';
  btn.textContent = '등록하기';
  currentFilter = 'all';
  document.querySelectorAll('.board-tab').forEach((t,i) => t.classList.toggle('active', i===0));
  renderPosts();
});

// ── 탭 필터 ──
document.querySelectorAll('.board-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.board-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    renderPosts();
  });
});

// ── 로그인 엔터키 ──
document.getElementById('loginPw').addEventListener('keydown', e => {
  if (e.key === 'Enter') submitLogin();
});

// ── ESC 키 ──
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeLoginModal(); }
});

// ── 초기화 ──
applyAdminUI();
loadPostsFromSheets();  // Sheets에서 불러오기 (실패 시 로컬 캐시 사용)
