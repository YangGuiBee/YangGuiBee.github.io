function doPost(e) {
  const p = e.parameter;
  const type = p.type || '';
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (type === 'resource') {
    const sheet = ss.getSheetByName('자료실') || ss.insertSheet('자료실');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['id','category','author','title','content','link','date','timestamp']);
    }
    sheet.appendRow([p.id, p.category, p.author, p.title, p.content||'', p.link||'', p.date, p.timestamp]);
  } else {
    const isStudent = (p.name && p.email && !p.org);
    const sheet = ss.getSheetByName('강의문의') || ss.insertSheet('강의문의');
    sheet.appendRow([
      p.timestamp || new Date().toLocaleString('ko-KR'),
      isStudent ? '수강생질문' : '기타요청',
      p.name||'', p.email||'', p.subject||'',
      isStudent ? (p.question||'') : (p.topic||''),
      p.org||'', p.contact||'', p.place||'',
      isStudent ? '' : (p.message||''), p.date||'', p.people||''
    ]);
  }
  return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
}

function doGet(e) {
  const callback = e.parameter.callback || 'callback';
  const action = e.parameter.action;

  if (action === 'list') {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('자료실');
    let posts = [];
    if (sheet && sheet.getLastRow() > 1) {
      const rows = sheet.getRange(2, 1, sheet.getLastRow()-1, 8).getValues();
      posts = rows.map(r => ({
        id: r[0], category: r[1], author: r[2],
        title: r[3], content: r[4], link: r[5], date: r[6]
      })).filter(p => p.title);
    }
    return ContentService.createTextOutput(`${callback}(${JSON.stringify(posts)})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
}