// 숫자 카운트업 애니메이션
function animateCount(el, target) {
  let start = 0;
  const duration = 1200;
  const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = fmt(Math.floor(eased * target));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ── 통계 JSONP 로드 ──
function doJsonpMain(url, cb) {
  const name  = '_mj_' + Date.now();
  const timer = setTimeout(() => { delete window[name]; cb(null); }, 8000);
  window[name] = function(data) {
    clearTimeout(timer);
    delete window[name];
    const s = document.getElementById('main-jsonp-script');
    if (s) s.remove();
    cb(data);
  };
  const script  = document.createElement('script');
  script.id     = 'main-jsonp-script';
  script.onerror = () => { clearTimeout(timer); delete window[name]; cb(null); };
  script.src    = url + '&callback=' + name + '&t=' + Date.now();
  document.head.appendChild(script);
}

function loadStats() {
  // 방문 카운터 +1 (no-cors POST, 응답 없음)
  fetch(SCRIPT_URL, {
    method: 'POST', mode: 'no-cors',
    body: new URLSearchParams({ action: 'hit', page: 'index' })
  }).catch(() => {});

  // 통계 조회
  doJsonpMain(SCRIPT_URL + '?action=getStats', result => {
    if (!result || !result.ok) return;

    const elV = document.getElementById('statVisits');
    const elN = document.getElementById('statNews');
    const elR = document.getElementById('statResources');

    if (elV && result.visits > 0)    animateCount(elV, result.visits);
    if (elN && result.news > 0)      animateCount(elN, result.news);
    if (elR && result.resources > 0) animateCount(elR, result.resources);
  });
}

// 통계 섹션 뷰포트 진입 시 로드
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadStats();
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  observer.observe(statsSection);
}

// 카드 마우스 패럴랙스
const card = document.querySelector('.profile-card');
if (card) {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateZ(8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0)';
    card.style.transition = 'transform 0.5s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
}
