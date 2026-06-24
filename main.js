// 숫자 카운트업 애니메이션
function animateCount(el, target, suffix = '') {
  let start = 0;
  const duration = 1200;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// IntersectionObserver로 stats 영역 진입 시 카운트업
const statsEl = document.querySelector('.hero-stats');
if (statsEl) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = document.querySelectorAll('.stat-num');
        nums.forEach(el => {
          const raw = el.textContent;
          if (raw === '3+') animateCount(el, 3, '+');
          else if (!isNaN(parseInt(raw))) animateCount(el, parseInt(raw), '');
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });
  observer.observe(statsEl);
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
