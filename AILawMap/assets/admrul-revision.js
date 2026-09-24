// laws/ai-administrative-rules.html 전용. assets/admrul-snapshot.json을 fetch해서
// "개정 이력"을 #admrulHistory에 렌더링한다. GitHub Actions가 매주 admrul-snapshot.json만
// 갱신하고(scripts/build_admrul_snapshot.py) 이 페이지 HTML은 건드리지 않으므로,
// 최신 확인일/변경 내역은 항상 이 스크립트가 런타임에 그려준다.
(function () {
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var mount = document.getElementById('admrulHistory');
  if (!mount) return;

  fetch('../assets/admrul-snapshot.json').then(function (r) { return r.json(); }).then(function (data) {
    var checkedAt = data.checked_at || '';
    var history = (data.history || []).slice().reverse();

    var html = '<p class="admrul-history-checked">최근 확인일: ' + esc(checkedAt) +
      ' (매주 자동 재확인, GitHub Actions가 목록 변경 시 PR 생성 → 사람이 확인 후 반영)</p>';

    var rows = history.map(function (h) {
      if (h.baseline) {
        return '<li class="admrul-history-row"><span class="d">' + esc(h.date) + '</span> ' +
          esc(h.note || '최초 기준선') + '</li>';
      }
      var parts = [];
      (h.added || []).forEach(function (n) { parts.push('<span class="add">신규</span> ' + esc(n)); });
      (h.removed || []).forEach(function (n) { parts.push('<span class="rm">삭제</span> ' + esc(n)); });
      (h.changed || []).forEach(function (c) {
        parts.push('<span class="chg">변경</span> ' + esc(c.name) + ' — ' +
          esc(c.from_date || '') + '(' + esc(c.from_type || '') + ') → ' +
          esc(c.to_date || '') + '(' + esc(c.to_type || '') + ')');
      });
      if (!parts.length) return '';
      return '<li class="admrul-history-row"><span class="d">' + esc(h.date) + '</span><ul class="admrul-history-items">' +
        parts.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul></li>';
    }).filter(Boolean);

    html += rows.length
      ? '<ul class="admrul-history-list">' + rows.join('') + '</ul>'
      : '<p class="admrul-history-checked">아직 변경 이력이 없습니다.</p>';

    mount.innerHTML = html;
  }).catch(function () {
    mount.innerHTML = '<p class="admrul-history-checked">개정 이력을 불러오지 못했습니다.</p>';
  });
})();
