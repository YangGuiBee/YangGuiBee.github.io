/* ── AI Study 공통 nav 햄버거 ── */
(function () {
  const btn   = document.getElementById('navHamburger');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  function close() {
    links.classList.remove('nav-open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', '메뉴 열기');
  }
  function open() {
    links.classList.add('nav-open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', '메뉴 닫기');
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    links.classList.contains('nav-open') ? close() : open();
  });

  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', close);
  });

  document.addEventListener('click', function (e) {
    if (!btn.contains(e.target) && !links.contains(e.target)) close();
  });
})();
