// 법령 페이지 하단에 최근 개정 정보를 동적으로 표시하고, 상단 "국가법령정보시스템"
// 링크를 이 페이지의 법령으로 바로 열리게 고쳐준다.
// law-snapshot.json은 매주 GitHub Actions가 갱신하는 데이터 파일이며,
// 이 스크립트가 fetch해서 렌더링하는 방식이라 자동화가 페이지 HTML 자체를
// 다시 쓸 필요가 없다(docs/plan-share-improvement.md 4장 "페이지 본문은
// 자동으로 다시 쓰지 않음" 원칙).
(function () {
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // 비교/연결설명 페이지(제목이 "{법령명} 비교 · LawMap" 또는 "{법령명} 연결설명 · LawMap")는
  // 그 법령명 자체가 조회 키이므로 끝의 접미사만 떼어내면 일반 법령 페이지와 같은 로직을
  // 그대로 쓸 수 있다.
  var lawName = document.title.split(' · LawMap')[0].trim().replace(/ (비교|연결설명)$/, '');
  var footerWrap = document.querySelector('footer.site-footer .wrap');
  var lawgokrLink = document.querySelector('.lawgokr-link');

  function setLawgokrLink(url) {
    if (lawgokrLink) lawgokrLink.href = url;
  }

  if (!lawName) return;

  fetch('../assets/law-snapshot.json').then(function (r) { return r.json(); }).then(function (data) {
    var history = data[lawName];
    if (!history || !history.length) {
      // 국제규범 등 law.go.kr에 없는 문서는 검색 결과가 없을 것이므로 홈으로 보낸다.
      setLawgokrLink('https://www.law.go.kr/');
      return;
    }

    // law.go.kr은 /법령/{법령명} 경로로 그 법의 현행 페이지를 바로 연다
    // (이 사이트의 조문 원문 링크들이 이미 같은 방식을 쓰고 있어 검증된 패턴).
    setLawgokrLink('https://www.law.go.kr/법령/' + encodeURIComponent(lawName));

    if (!footerWrap) return;
    var latest = history[history.length - 1];
    var historyUrl = 'https://www.law.go.kr/법령/' + encodeURIComponent(lawName);
    var text = '개정 이력: 최근 ' + latest['제개정구분명'] + ' — ' +
      latest['공포일자'] + ' 공포 · ' + latest['시행일자'] + ' 시행';

    var p = document.createElement('p');
    p.className = 'law-revision';
    p.innerHTML = esc(text) + ' · <a href="' + historyUrl +
      '" target="_blank" rel="noopener">law.go.kr 연혁 보기</a>';
    footerWrap.appendChild(p);
  }).catch(function () {
    // law-snapshot.json 조회 실패 시 링크만 안전한 기본값으로 돌려놓는다.
    setLawgokrLink('https://www.law.go.kr/');
  });
})();
