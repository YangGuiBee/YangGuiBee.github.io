// 검색 결과 등에서 #P13 같은 조문 앵커로 딥링크했을 때, 그 노드가 시행령/본법
// 토글로 숨겨져(hidden) 있으면 자동으로 펼쳐서 보이게 한다.
// 각 법령 페이지의 toggleDecree() 등은 페이지별 IIFE 안에 갇혀 있어 외부에서
// 호출할 수 없으므로, hidden 속성을 직접 조작하고 토글 버튼 표시만 맞춰준다.
(function () {
  function revealIfHidden() {
    var id = decodeURIComponent(location.hash.replace('#', ''));
    if (!id) return;
    var target = document.getElementById(id);
    if (!target || !target.hasAttribute('hidden')) return;

    document.querySelectorAll('.dec-node').forEach(function (n) {
      n.removeAttribute('hidden');
    });

    var btn = document.getElementById('decreeToggle') || document.getElementById('basicToggle');
    if (btn && btn.innerHTML.indexOf('+') !== -1) {
      btn.innerHTML = btn.innerHTML.replace('+', '-');
      btn.classList.add('on');
    }

    target.scrollIntoView({ block: 'center' });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealIfHidden);
  } else {
    revealIfHidden();
  }
})();
