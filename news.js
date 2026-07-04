/* ── AI논문 news.js v4 ── */
const NEWS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwvz4H6qBTHT1Q6utrmA1awJYeq9cV6TGKiVKNibuqpQxYTkZ5gXxkY6iH-UWmSxvgZXA/exec';

let allNews    = [];
let currentCat = 'all';
let searchMode = false;

/* ── JSONP ── */
function doJsonp(url, cb) {
  const name  = '_njp_' + Date.now();
  const timer = setTimeout(() => { delete window[name]; cb(null); }, 15000);
  window[name] = function(data) {
    clearTimeout(timer);
    delete window[name];
    const s = document.getElementById('njp-script');
    if (s) s.remove();
    cb(data);
  };
  const script    = document.createElement('script');
  script.id       = 'njp-script';
  script.onerror  = () => { clearTimeout(timer); delete window[name]; cb(null); };
  script.src      = url + '&callback=' + name + '&t=' + Date.now();
  document.head.appendChild(script);
}

/* ── 유틸 ── */
function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function formatDate(ts) {
  if (!ts) return '';
  const m = String(ts).match(/(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/);
  if (m) return `${m[1]}.${m[2].padStart(2,'0')}.${m[3].padStart(2,'0')}`;
  if (/^\d{4}$/.test(String(ts))) return String(ts); // 연도만 있는 경우
  return String(ts).substring(0, 10);
}
function trimAuthors(authors) {
  if (!authors) return '';
  const list = String(authors).split(',').map(a => a.trim()).filter(Boolean);
  return list.slice(0, 3).join(', ') + (list.length > 3 ? ' 외' : '');
}

/* 출처별 Stars 라벨 */
function starsLabel(source, stars) {
  const n = parseInt(stars) || 0;
  if (n <= 0) return '';
  if (source === 'Papers With Code') return `★ ${n} repos`;
  if (source === 'Semantic Scholar')  return `★ ${n} citations`;
  if (source && source.includes('Review')) return `★ ${n} discussions`;
  return `★ ${n}`;
}

/* 카테고리 배지 클래스 */
function badgeClass(cat) {
  if (cat === 'AI거버넌스') return 'news-cat-badge gov';
  if (cat === '최상위학회') return 'news-cat-badge top';
  return 'news-cat-badge';
}

/* ── 카드 렌더링 ── */
function renderNews(items, subtitle) {
  const grid  = document.getElementById('newsGrid');
  const count = document.getElementById('newsCount');

  if (!items || items.length === 0) {
    count.textContent = '';
    grid.innerHTML = `
      <div class="news-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:0.3">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
        <p>${searchMode ? '검색 결과가 없습니다.' : '수집된 연구가 없습니다.<br>트리거 설정 후 내일 자동 업데이트됩니다.'}</p>
      </div>`;
    return;
  }

  count.textContent = subtitle || `총 ${items.length}건`;

  grid.innerHTML = items.map(item => {
    const sl       = starsLabel(item.source, item.stars);
    const authors  = trimAuthors(item.authors);
    const pubDate  = formatDate(item.publishedAt);
    const colDate  = formatDate(item.collectedAt);
    const transUrl = (item.link || '').includes('arxiv.org')
      ? item.link.replace('arxiv.org', 'ar5iv.org')
      : (item.link || '');

    return `
      <div class="news-card">
        <div class="news-card-meta">
          <span class="${badgeClass(item.category)}">${esc(item.category)}</span>
          ${sl ? `<span class="news-stars">${esc(sl)}</span>` : ''}
          <span class="news-source">${esc(item.source)}</span>
          <span class="news-date">${pubDate || colDate}</span>
        </div>
        <div class="news-title">
          <a href="${esc(item.link)}" target="_blank" rel="noopener noreferrer">${esc(item.title)}</a>
        </div>
        ${authors ? `<p class="news-authors">${esc(authors)}</p>` : ''}
        ${item.abstract ? `<p class="news-abstract">${esc(item.abstract)}</p>` : ''}
        <div class="news-card-footer">
          <a class="news-read-link" href="${esc(item.link)}" target="_blank" rel="noopener noreferrer">논문 보기 →</a>
          ${transUrl ? `<a class="news-translate-btn" href="${esc(transUrl)}" target="_blank" rel="noopener noreferrer">🌐 번역 보기</a>` : ''}
          ${searchMode ? `<span class="news-collected">수집일 ${colDate}</span>` : ''}
        </div>
      </div>`;
  }).join('');
}

/* ── 탭 필터 ── */
function filterAndRender() {
  if (searchMode) return;
  const filtered = currentCat === 'all'
    ? allNews
    : allNews.filter(n => (n.category || '').trim() === currentCat);
  renderNews(filtered);
}

document.getElementById('newsTabs').addEventListener('click', function(e) {
  const tab = e.target.closest('.news-tab');
  if (!tab) return;
  exitSearch();
  document.querySelectorAll('.news-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  currentCat = tab.dataset.cat;
  filterAndRender();
});

/* ── 검색 ── */
let searchTimer = null;

document.getElementById('newsSearch').addEventListener('input', function() {
  const kw = this.value.trim();
  clearTimeout(searchTimer);
  if (kw.length < 2) { if (searchMode) exitSearch(); return; }
  searchTimer = setTimeout(() => doSearch(kw), 500);
});

document.getElementById('newsSearchClear').addEventListener('click', function() {
  document.getElementById('newsSearch').value = '';
  exitSearch();
});

function doSearch(keyword) {
  searchMode = true;
  document.getElementById('newsSearchClear').hidden = false;
  setLoading('검색 중…');
  doJsonp(`${NEWS_SCRIPT_URL}?action=searchNews&keyword=${encodeURIComponent(keyword)}`, result => {
    if (!result || !result.ok) { setError('검색 중 오류가 발생했습니다.'); return; }
    renderNews(result.data || [], `"${keyword}" 검색 결과 ${(result.data||[]).length}건`);
  });
}

function exitSearch() {
  searchMode = false;
  document.getElementById('newsSearchClear').hidden = true;
  filterAndRender();
}

/* ── 상태 표시 ── */
function setLoading(msg) {
  document.getElementById('newsGrid').innerHTML = `
    <div class="news-loading">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      <p>${msg || '불러오는 중…'}</p>
    </div>`;
}
function setError(msg) {
  document.getElementById('newsGrid').innerHTML = `<div class="news-empty"><p>${msg}</p></div>`;
  document.getElementById('newsCount').textContent = '';
}

/* ── 초기 로드 ── */
doJsonp(`${NEWS_SCRIPT_URL}?action=getNews`, result => {
  if (!result || !result.ok) { setError('데이터를 불러올 수 없습니다.<br>잠시 후 다시 시도해 주세요.'); return; }
  allNews = result.data || [];
  filterAndRender();
  if (result.latestDate) {
    document.getElementById('newsCount').textContent =
      `오늘의 AI논문 ${allNews.length}건 (${result.latestDate})`;
  }
});
