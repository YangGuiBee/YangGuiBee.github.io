const NEWS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx7KTtldrJozsMGsCE3imWxsftkLZ3id-N5_HoxFt7gUhNDTWfvuwsPUwssNjJbm9pUHg/exec';

let allNews   = [];
let currentCat = 'all';

function doJsonp(url, cb) {
  const name  = '_njp_' + Date.now();
  const timer = setTimeout(() => { delete window[name]; cb(null); }, 12000);
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
  const list = authors.split(',').map(a => a.trim()).filter(Boolean);
  return list.slice(0, 3).join(', ') + (list.length > 3 ? ' 외' : '');
}

function renderNews(items) {
  const grid  = document.getElementById('newsGrid');
  const count = document.getElementById('newsCount');

  if (!items || items.length === 0) {
    count.textContent = '';
    grid.innerHTML = `
      <div class="news-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:0.3">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
        <p>수집된 연구가 없습니다.<br>트리거 설정 후 내일 자동 업데이트됩니다.</p>
      </div>`;
    return;
  }

  count.textContent = `총 ${items.length}건`;
  grid.innerHTML = items.map(item => {
    const isGov    = (item.category || '').trim() === 'AI거버넌스';
    const badgeCls = 'news-cat-badge' + (isGov ? ' gov' : '');
    const authors  = trimAuthors(item.authors);
    const transUrl = 'https://translate.google.com/translate?sl=en&tl=ko&u=' + encodeURIComponent(item.link);
    return `
      <div class="news-card">
        <div class="news-card-meta">
          <span class="${badgeCls}">${esc(item.category)}</span>
          <span class="news-source">${esc(item.source)}</span>
          <span class="news-date">${formatDate(item.collectedAt)}</span>
        </div>
        <div class="news-title">
          <a href="${esc(item.link)}" target="_blank" rel="noopener noreferrer">${esc(item.title)}</a>
        </div>
        ${authors ? `<p class="news-authors">${esc(authors)}</p>` : ''}
        ${item.abstract ? `<p class="news-abstract">${esc(item.abstract)}</p>` : ''}
        <div class="news-card-footer">
          <a class="news-read-link" href="${esc(item.link)}" target="_blank" rel="noopener noreferrer">논문 보기 →</a>
          <a class="news-translate-btn" href="${esc(transUrl)}" target="_blank" rel="noopener noreferrer">🌐 번역 보기</a>
        </div>
      </div>`;
  }).join('');
}

function filterAndRender() {
  const filtered = (currentCat === 'all'
    ? allNews
    : allNews.filter(n => (n.category || '').trim() === currentCat)
  ).slice(0, 20);  // 상위 20건만 표시
  renderNews(filtered);
}

// 탭 전환 (이벤트 위임 방식으로 안정성 향상)
document.getElementById('newsTabs').addEventListener('click', function(e) {
  const tab = e.target.closest('.news-tab');
  if (!tab) return;
  document.querySelectorAll('.news-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  currentCat = tab.dataset.cat;
  filterAndRender();
});

// 초기 데이터 로드
doJsonp(`${NEWS_SCRIPT_URL}?action=getNews`, result => {
  if (!result || !result.ok) {
    document.getElementById('newsGrid').innerHTML = `
      <div class="news-empty">
        <p>데이터를 불러올 수 없습니다.<br>잠시 후 다시 시도해 주세요.</p>
      </div>`;
    return;
  }
  allNews = result.data || [];
  filterAndRender();
});
