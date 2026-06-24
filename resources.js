const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyleJhzM77_e9WM7Gmrf-7Cs2Evcb_9gx-OXvvNY7cBJuj6I9fQEue0rKLCVgmmXGKjpA/exec';

// ── 로컬 게시글 저장소 (세션 기반) ──
let posts = JSON.parse(localStorage.getItem('ai_study_posts') || '[]');
let currentFilter = 'all';

const catLabel = { notice: '공지', ml: '머신러닝', itg: 'IT거버넌스' };
const catClass = { notice: 'cat-notice', ml: 'cat-ml', itg: 'cat-itg' };

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

function renderPosts() {
  const list = document.getElementById('boardList');
  const empty = document.getElementById('boardEmpty');
  const filtered = currentFilter === 'all' ? posts : posts.filter(p => p.category === currentFilter);

  list.innerHTML = '';
  if (filtered.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  filtered.slice().reverse().forEach((post, idx) => {
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

function openModal(post) {
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-category"><span class="board-category ${catClass[post.category]}">${catLabel[post.category]}</span></div>
    <h2 class="modal-title">${post.title}</h2>
    <p class="modal-meta">${post.author} · ${formatDate(post.date)}</p>
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

// 탭 필터
document.querySelectorAll('.board-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.board-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    renderPosts();
  });
});

// 업로드 토글
function toggleUpload() {
  const form = document.getElementById('uploadForm');
  form.hidden = !form.hidden;
}

// 업로드 제출
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.submit-btn');

  const post = {
    id: Date.now(),
    category: form.category.value,
    author: form.author.value.trim(),
    title: form.title.value.trim(),
    content: form.content.value.trim(),
    link: form.link.value.trim(),
    date: new Date().toISOString()
  };

  if (!post.category || !post.author || !post.title) {
    alert('분류, 작성자, 제목은 필수 항목입니다.');
    return;
  }

  btn.disabled = true;
  btn.textContent = '등록 중...';

  // Google Sheets에도 저장
  const fd = new FormData();
  fd.append('type', 'resource');
  fd.append('timestamp', new Date().toLocaleString('ko-KR'));
  Object.entries(post).forEach(([k, v]) => fd.append(k, v));
  try { await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: fd }); } catch {}

  // 로컬 저장
  posts.push(post);
  localStorage.setItem('ai_study_posts', JSON.stringify(posts));

  form.reset();
  form.hidden = true;
  btn.disabled = false;
  btn.textContent = '등록하기';
  currentFilter = 'all';
  document.querySelectorAll('.board-tab').forEach((t,i) => t.classList.toggle('active', i===0));
  renderPosts();
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

renderPosts();
