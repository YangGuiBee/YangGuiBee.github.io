/* ── AI소식 news.js v3 ── */
const NEWS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx7KTtldrJozsMGsCE3imWxsftkLZ3id-N5_HoxFt7gUhNDTWfvuwsPUwssNjJbm9pUHg/exec';

let allNews    = [];   // 오늘의 10건
let currentCat = 'all';
let searchMode = false;

/* ── JSONP 헬퍼 ── */
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
  const script = document.createElement('script');
  script.id      = 'njp-script';
  script.onerror = () => { clearTimeout(timer); delete window[name]; cb(null); };
  script.src     = url + '&callback=' + name + '&t=' + Date.now();
  document.head.appendChild(script);
}

/* ── 유틸 ── */
function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function formatDate(ts) {
  if (!ts) return '';
  const m = String(ts).match(/(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/);
  return m ? `${m[1]}.${m[2].padStart(2,'0')}.${m[3].padStart(2,'0')}` : String(ts).substring(0, 10);
}
function trimAuthors(authors) {
  if (!authors) return '';
  const list = String(authors).split(',').map(a => a.trim()).filter(Boolean);
  return list.slice(0, 3).join(', ') + (list.length > 3 ? ' 외' : '');
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
    const isGov    = (item.category || '').trim() === 'AI거버넌스';
    const badgeCls = 'news-cat-badge' + (isGov ? ' gov' : '');
    const authors  = trimAuthors(item.authors);
    const stars    = parseInt(item.stars) || 0;
    const transUrl = (item.link || '').includes('arxiv.org')
      ? item.link.replace('arxiv.org', 'ar5iv.org')
      : (item.link || '');
    const pubDate  = formatDate(item.publishedAt);
    const colDate  = formatDate(item.collectedAt);

    return `
      <div class="news-card">
        <div class="news-card-meta">
          <span class="${badgeCls}">${esc(item.category)}</span>
          ${stars > 0 ? `<span class="news-stars">★ ${stars}</span>` : ''}
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

/* ── 탭 필터링 (일반 모드) ── */
function filterAndRender() {
  if (searchMode) return;
  const filtered = currentCat === 'all'
    ? allNews
    : allNews.filter(n => (n.category || '').trim() === currentCat);
  renderNews(filtered);
}

/* ── 탭 이벤트 ── */
document.getElementById('newsTabs').addEventListener('click', function(e) {
  const tab = e.target.closest('.news-tab');
  if (!tab) return;
  // 검색 모드 해제
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

  if (kw.length < 2) {
    if (searchMode) exitSearch();
    return;
  }

  searchTimer = setTimeout(() => doSearch(kw), 500);
});

document.getElementById('newsSearchClear').addEventListener('click', function() {
  document.getElementById('newsSearch').value = '';
  exitSearch();
});

function doSearch(keyword) {
  searchMode = true;
  document.getElementById('newsSearchClear').hidden = false;
  setLoading();
  doJsonp(`${NEWS_SCRIPT_URL}?action=searchNews&keyword=${encodeURIComponent(keyword)}`, result => {
    if (!result || !result.ok) {
      setError('검색 중 오류가 발생했습니다.');
      return;
    }
    const data = result.data || [];
    renderNews(data, `"${keyword}" 검색 결과 ${data.length}건`);
  });
}

function exitSearch() {
  searchMode = false;
  document.getElementById('newsSearchClear').hidden = true;
  filterAndRender();
}

/* ── 로딩 / 오류 ── */
function setLoading() {
  document.getElementById('newsGrid').innerHTML = `
    <div class="news-loading">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      <p>검색 중…</p>
    </div>`;
}
function setError(msg) {
  document.getElementById('newsGrid').innerHTML = `<div class="news-empty"><p>${msg}</p></div>`;
}

/* ── 초기 로드 (오늘의 10건) ── */
doJsonp(`${NEWS_SCRIPT_URL}?action=getNews`, result => {
  if (!result || !result.ok) {
    setError('데이터를 불러올 수 없습니다.<br>잠시 후 다시 시도해 주세요.');
    return;
  }
  allNews = result.data || [];
  const ld = result.latestDate ? ` (${result.latestDate})` : '';
  filterAndRender();
  if (result.latestDate) {
    document.getElementById('newsCount').textContent = `오늘의 AI소식 ${allNews.length}건${ld}`;
  }
});
