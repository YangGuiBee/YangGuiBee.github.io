/* ══════════════════════════════════════════════════════
   AI Study  Apps Script  v7
   변경: getStats() + recordHit() 추가
   ══════════════════════════════════════════════════════ */

const ADMIN_EMAIL      = 'guibee1004@gmail.com';
const BACKUP_FOLDER_ID = 'YOUR_GOOGLE_DRIVE_FOLDER_ID'; // ← Google Drive 백업 폴더 ID로 교체
// 배포 URL: https://script.google.com/macros/s/AKfycby2MlftdHUblF9QzifxIyMbwOe4W-7EqS8EQySNBDqTVzFH4I-fiajehiheWlrih4Wp/exec

/* ── 공통: 로그 기록 ─────────────────────────────── */
function writeLog(eventType, email, sheetName, detail, result) {
  try {
    const ss  = SpreadsheetApp.getActiveSpreadsheet();
    let log   = ss.getSheetByName('시스템로그');
    if (!log) {
      log = ss.insertSheet('시스템로그');
      log.appendRow(['일시', '이벤트', '이메일', '시트', '상세', '결과']);
      log.getRange(1, 1, 1, 6).setFontWeight('bold');
    }
    const ts = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    log.appendRow([ts, eventType, email || '', sheetName || '', detail || '', result || 'OK']);
  } catch (e) {}
}

/* ── 라우터 ──────────────────────────────────────── */
function doGet(e) {
  const p      = e.parameter;
  const action = p.action || '';
  const cb     = p.callback || 'cb';
  let data;

  try {
    if      (action === 'sendOTP')       data = sendOTP(p);
    else if (action === 'verifyOTP')     data = verifyOTP(p, '강의문의');
    else if (action === 'verifyOTPReq')  data = verifyOTP(p, '강의요청');
    else if (action === 'contacts')      data = getContacts();
    else if (action === 'adminContacts') data = adminList('강의문의');
    else if (action === 'adminRequests') data = adminList('강의요청');
    else if (action === 'getNews')       data = getNews();
    else if (action === 'searchNews')    data = searchNews(p.keyword || '');
    else if (action === 'getStats')      data = getStats();
    else                                 data = { ok: false, msg: 'unknown action' };
  } catch (err) {
    data = { ok: false, msg: String(err) };
  }

  return ContentService
    .createTextOutput(cb + '(' + JSON.stringify(data) + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function doPost(e) {
  const p      = e.parameter;
  const action = p.action || '';
  let data;

  try {
    if      (action === 'update') data = updateRow(p);
    else if (action === 'delete') data = deleteRow(p);
    else if (action === 'reply')  data = sendReply(p);
    else if (action === 'hit')    data = recordHit(p);
    else                          data = saveContact(p);
  } catch (err) {
    data = { ok: false, msg: String(err) };
  }

  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ── OTP ─────────────────────────────────────────── */
function sendOTP(p) {
  const email = (p.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    writeLog('OTP_SENT', email, '-', 'invalid email', 'FAIL');
    return { ok: false, msg: '유효한 이메일을 입력해 주세요.' };
  }

  const otp   = String(Math.floor(100000 + Math.random() * 900000));
  const key   = 'otp_' + email;
  const cache = CacheService.getScriptCache();
  cache.put(key, otp, 600);

  try {
    GmailApp.sendEmail(email, '[AI Study] 인증코드 안내',
      `인증코드: ${otp}\n\n10분 내에 입력해 주세요.\n\nAI Study 강의 담당자 드림`,
      {
        htmlBody: `<div style="font-family:sans-serif;max-width:480px">
          <h2 style="color:#4f46e5">AI Study 인증코드</h2>
          <p style="font-size:2rem;font-weight:bold;letter-spacing:.3em;color:#1e1b4b">${otp}</p>
          <p style="color:#666">10분 내에 입력해 주세요.</p>
        </div>`
      });
    writeLog('OTP_SENT', email, '-', '-', 'OK');
    return { ok: true };
  } catch (err) {
    writeLog('OTP_SENT', email, '-', String(err), 'FAIL');
    return { ok: false, msg: '메일 발송 실패: ' + err.message };
  }
}

function verifyOTP(p, sheetName) {
  const email  = (p.email || '').trim().toLowerCase();
  const otp    = (p.otp   || '').trim();
  const cache  = CacheService.getScriptCache();
  const stored = cache.get('otp_' + email);

  if (!stored || stored !== otp) {
    writeLog('OTP_VERIFY', email, sheetName, 'mismatch', 'FAIL');
    return { ok: false, msg: '인증코드가 일치하지 않거나 만료됐습니다.' };
  }

  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { ok: true, data: [] };

  const isReq = sheetName === '강의요청';
  const rows  = sheet.getDataRange().getValues().slice(1)
    .filter(r => (r[3] || '').toString().trim().toLowerCase() === email)
    .map(r => rowToObj(r, isReq));

  writeLog('OTP_VERIFY', email, sheetName, rows.length + '건', 'OK');
  return { ok: true, data: rows };
}

/* ── 신규 등록 ───────────────────────────────────── */
function saveContact(p) {
  const ss        = SpreadsheetApp.getActiveSpreadsheet();
  const isReq     = (p.type || '') === '기타요청';
  const sheetName = isReq ? '강의요청' : '강의문의';
  const sheet     = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);

  const row = isReq
    ? [p.timestamp || new Date().toLocaleString('ko-KR'), '기타요청',
       p.topic||'', (p.email||'').trim().toLowerCase(), p.name||'',
       p.org||'', p.place||'', p.date||'', p.people||'', p.message||'',
       '미답변', '', '']
    : [p.timestamp || new Date().toLocaleString('ko-KR'), '수강생질문',
       p.name||'', (p.email||'').trim().toLowerCase(), p.subject||'',
       p.question||'', '미답변', '', ''];

  sheet.appendRow(row);

  try {
    const label = isReq ? '강의요청' : '수강생질문';
    GmailApp.sendEmail(ADMIN_EMAIL, `[AI Study] 새 ${label} 등록`,
      `${isReq ? p.topic : p.subject} / ${p.email}`,
      { htmlBody: `<p><b>유형:</b> ${label}</p>
                   <p><b>제목:</b> ${isReq ? p.topic : p.subject}</p>
                   <p><b>이메일:</b> ${p.email}</p>
                   <p><b>내용:</b> ${isReq ? p.message : p.question}</p>` });
  } catch (_) {}

  writeLog('SUBMIT', (p.email||'').trim().toLowerCase(), sheetName,
           isReq ? (p.topic||'') : (p.subject||''), 'OK');
  return { ok: true };
}

/* ── 수정 ────────────────────────────────────────── */
function updateRow(p) {
  const sheetName = p.sheet || '강의문의';
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { ok: false, msg: 'sheet not found' };

  const rows  = sheet.getDataRange().getValues();
  const isReq = sheetName === '강의요청';

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) !== String(p.ts)) continue;
    if ((rows[i][3]||'').toString().trim().toLowerCase() !== (p.email||'').trim().toLowerCase()) continue;
    if (isReq) {
      sheet.getRange(i+1,3).setValue(p.topic   || rows[i][2]);
      sheet.getRange(i+1,5).setValue(p.reqName || rows[i][4]);
      sheet.getRange(i+1,6).setValue(p.org     || rows[i][5]);
      sheet.getRange(i+1,10).setValue(p.message || rows[i][9]);
    } else {
      sheet.getRange(i+1,3).setValue(p.name     || rows[i][2]);
      sheet.getRange(i+1,5).setValue(p.subject  || rows[i][4]);
      sheet.getRange(i+1,6).setValue(p.question || rows[i][5]);
    }
    writeLog('UPDATE', (p.email||'').trim().toLowerCase(), sheetName, 'ts='+p.ts, 'OK');
    return { ok: true };
  }
  writeLog('UPDATE', (p.email||'').trim().toLowerCase(), sheetName, 'ts='+p.ts+' not found', 'FAIL');
  return { ok: false, msg: 'row not found' };
}

/* ── 삭제 ────────────────────────────────────────── */
function deleteRow(p) {
  const sheetName = p.sheet || '강의문의';
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { ok: false, msg: 'sheet not found' };

  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) !== String(p.ts)) continue;
    if ((rows[i][3]||'').toString().trim().toLowerCase() !== (p.email||'').trim().toLowerCase()) continue;
    sheet.deleteRow(i + 1);
    writeLog('DELETE', (p.email||'').trim().toLowerCase(), sheetName, 'ts='+p.ts, 'OK');
    return { ok: true };
  }
  writeLog('DELETE', (p.email||'').trim().toLowerCase(), sheetName, 'ts='+p.ts+' not found', 'FAIL');
  return { ok: false, msg: 'row not found' };
}

/* ── 답변 발송 ───────────────────────────────────── */
function sendReply(p) {
  const sheetName = p.sheet || '강의문의';
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { ok: false, msg: 'sheet not found' };

  try {
    GmailApp.sendEmail(p.email, p.subject, '',
      { htmlBody: p.htmlBody, name: 'AI Study 강의 담당자' });
  } catch (err) {
    writeLog('REPLY_SENT', p.email, sheetName, String(err), 'FAIL');
    return { ok: false, msg: err.message };
  }

  const rows  = sheet.getDataRange().getValues();
  const isReq = sheetName === '강의요청';
  const answeredAt = new Date().toLocaleString('ko-KR');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) !== String(p.ts)) continue;
    const sc = isReq ? 11 : 7;
    const ac = isReq ? 12 : 8;
    const rc = isReq ? 13 : 9;
    sheet.getRange(i+1, sc).setValue('답변완료');
    sheet.getRange(i+1, ac).setValue(answeredAt);
    sheet.getRange(i+1, rc).setValue(p.replyText || '');
    break;
  }

  writeLog('REPLY_SENT', p.email, sheetName, p.subject||'', 'OK');
  return { ok: true };
}

/* ── 관리자 목록 ─────────────────────────────────── */
function getContacts() { return adminList('강의문의'); }

function adminList(sheetName) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { ok: true, data: [] };
  const isReq = sheetName === '강의요청';
  return { ok: true, data: sheet.getDataRange().getValues().slice(1).map(r => rowToObj(r, isReq)) };
}

function rowToObj(r, isReq) {
  if (isReq) return {
    timestamp: String(r[0]||''), type: String(r[1]||''), name: String(r[2]||''),
    email: String(r[3]||''), reqName: String(r[4]||''), org: String(r[5]||''),
    place: String(r[6]||''), date: String(r[7]||''), people: String(r[8]||''),
    message: String(r[9]||''), status: String(r[10]||''),
    answeredAt: String(r[11]||''), replyText: String(r[12]||''),
    subject: String(r[2]||''),
  };
  return {
    timestamp: String(r[0]||''), type: String(r[1]||''), name: String(r[2]||''),
    email: String(r[3]||''), subject: String(r[4]||''), question: String(r[5]||''),
    status: String(r[6]||''), answeredAt: String(r[7]||''), replyText: String(r[8]||''),
  };
}

/* ── 뉴스 조회 ────────────────────────────────────── */
function getNews() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('뉴스');
  if (!sheet) return { ok: true, data: [], latestDate: '' };

  const rows = sheet.getDataRange().getValues().slice(1)
    .filter(r => r[2]).slice(-20).reverse()
    .map(r => ({
      collectedAt: String(r[0]||''), category: String(r[1]||''),
      title: String(r[2]||''), publishedAt: String(r[3]||''),
      authors: String(r[4]||''), source: String(r[5]||''),
      link: String(r[6]||''), stars: String(r[7]||''), abstract: String(r[8]||''),
    }));

  return { ok: true, data: rows, latestDate: rows.length ? rows[0].collectedAt : '' };
}

function searchNews(keyword) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('뉴스');
  if (!sheet || !keyword) return { ok: true, data: [] };

  const kw   = keyword.toLowerCase();
  const data = sheet.getDataRange().getValues().slice(1)
    .filter(r => r[2] && (String(r[2]).toLowerCase().includes(kw) || String(r[4]).toLowerCase().includes(kw)))
    .slice(-50).reverse()
    .map(r => ({
      collectedAt: String(r[0]||''), category: String(r[1]||''),
      title: String(r[2]||''), publishedAt: String(r[3]||''),
      authors: String(r[4]||''), source: String(r[5]||''),
      link: String(r[6]||''), stars: String(r[7]||''), abstract: String(r[8]||''),
    }));

  return { ok: true, data };
}

/* ── 방문 카운터 (doPost action=hit) ─────────────── */
function recordHit(p) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName('방문통계');
  if (!sheet) {
    sheet = ss.insertSheet('방문통계');
    sheet.appendRow(['날짜', '페이지', '방문수']);
    sheet.getRange(1,1,1,3).setFontWeight('bold');
  }

  const today = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd');
  const page  = p.page || 'index';
  const rows  = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === today && String(rows[i][1]) === page) {
      sheet.getRange(i+1, 3).setValue((rows[i][2]||0) + 1);
      return { ok: true };
    }
  }
  sheet.appendRow([today, page, 1]);
  return { ok: true };
}

/* ── 통계 조회 (doGet action=getStats) ───────────── */
function getStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let visits = 0;
  const visitSheet = ss.getSheetByName('방문통계');
  if (visitSheet) {
    visitSheet.getDataRange().getValues().slice(1)
      .forEach(r => { visits += (parseInt(r[2]) || 0); });
  }

  const newsSheet = ss.getSheetByName('뉴스');
  const news = newsSheet ? Math.max(0, newsSheet.getLastRow() - 1) : 0;

  const resSheet = ss.getSheetByName('자료실');
  const resources = resSheet ? Math.max(0, resSheet.getLastRow() - 1) : 0;

  return { ok: true, visits, news, resources };
}

/* ── 논문 수집 (트리거 실행) ──────────────────────── */
function collectResearch() {
  const ss      = SpreadsheetApp.getActiveSpreadsheet();
  const sheet   = ss.getSheetByName('뉴스') || ss.insertSheet('뉴스');
  const today   = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd');
  const results = { pwc: 0, ss: 0, or: 0, arxiv: 0, errors: [] };

  const existingLinks = new Set();
  sheet.getDataRange().getValues().slice(1).forEach(r => { if (r[6]) existingLinks.add(String(r[6]).trim()); });

  const newRows = [];

  try {
    const pwcRes  = UrlFetchApp.fetch('https://paperswithcode.com/api/v1/papers/?ordering=-github_link_count&page_size=5');
    const pwcData = JSON.parse(pwcRes.getContentText());
    (pwcData.results || []).forEach(item => {
      const link = 'https://paperswithcode.com/paper/' + (item.id || '');
      if (item.title && !existingLinks.has(link)) {
        newRows.push([today, '머신러닝', item.title, (item.published||'').substring(0,10),
          (item.authors||[]).map(a=>a.name).join(', '), 'Papers With Code', link,
          item.github_link_count||0, (item.abstract||'').substring(0,300)]);
        existingLinks.add(link); results.pwc++;
      }
    });
  } catch (e) { results.errors.push('PWC:'+e.message); }

  try {
    const ssUrl = 'https://api.semanticscholar.org/graph/v1/paper/search'
      + '?query=machine+learning&fields=title,authors,year,citationCount,externalIds,venue,abstract&limit=5'
      + '&venue=NeurIPS,ICML,ICLR,CVPR,ACL';
    const ssRes  = UrlFetchApp.fetch(ssUrl, { muteHttpExceptions: true });
    const ssData = JSON.parse(ssRes.getContentText());
    (ssData.data || []).forEach(item => {
      const arxivId = (item.externalIds||{}).ArXiv;
      const link = arxivId ? 'https://arxiv.org/abs/'+arxivId : 'https://www.semanticscholar.org/paper/'+item.paperId;
      if (item.title && !existingLinks.has(link)) {
        newRows.push([today, '최상위학회', item.title, String(item.year||''),
          (item.authors||[]).map(a=>a.name).join(', '), 'Semantic Scholar', link,
          item.citationCount||0, (item.abstract||'').substring(0,300)]);
        existingLinks.add(link); results.ss++;
      }
    });
  } catch (e) { results.errors.push('SS:'+e.message); }

  try {
    const orUrl = 'https://api.openreview.net/notes?invitation=aclweb.org%2FACL%2F2024%2FConference%2F--%2FSubmission&limit=5&offset=0';
    const orRes  = UrlFetchApp.fetch(orUrl, { muteHttpExceptions: true });
    const orData = JSON.parse(orRes.getContentText());
    (orData.notes || []).forEach(item => {
      const c    = item.content || {};
      const link = 'https://openreview.net/forum?id=' + item.id;
      if (c.title && !existingLinks.has(link)) {
        newRows.push([today, 'AI거버넌스', c.title,
          item.cdate ? new Date(item.cdate).toISOString().substring(0,10) : '',
          Array.isArray(c.authors) ? c.authors.join(', ') : String(c.authors||''),
          'OpenReview', link, (item.details&&item.details.replyCount)||0,
          (c.abstract||'').substring(0,300)]);
        existingLinks.add(link); results.or++;
      }
    });
  } catch (e) { results.errors.push('OR:'+e.message); }

  try {
    const arxivRes = UrlFetchApp.fetch('https://rss.arxiv.org/rss/cs.CY');
    const arxivXml = arxivRes.getContentText();
    (arxivXml.match(/<item>([\s\S]*?)<\/item>/g) || []).slice(0,5).forEach(item => {
      const title   = (item.match(/<title>([\s\S]*?)<\/title>/)            ||[])[1]||'';
      const link    = (item.match(/<link>([\s\S]*?)<\/link>/)              ||[])[1]||'';
      const authors = (item.match(/<dc:creator>([\s\S]*?)<\/dc:creator>/)  ||[])[1]||'';
      const abs     = (item.match(/<description>([\s\S]*?)<\/description>/)||[])[1]||'';
      const cl      = link.trim();
      if (title && cl && !existingLinks.has(cl)) {
        newRows.push([today, 'AI거버넌스',
          title.replace(/<!\[CDATA\[|\]\]>/g,'').trim(), today,
          authors.replace(/<!\[CDATA\[|\]\]>/g,'').trim(),
          'arXiv cs.CY', cl, 0,
          abs.replace(/<!\[CDATA\[|\]\]>/g,'').replace(/<[^>]+>/g,'').trim().substring(0,300)]);
        existingLinks.add(cl); results.arxiv++;
      }
    });
  } catch (e) { results.errors.push('arXiv:'+e.message); }

  if (newRows.length > 0) {
    sheet.getRange(sheet.getLastRow()+1, 1, newRows.length, 9).setValues(newRows);
  }

  writeLog('COLLECT_RUN', ADMIN_EMAIL, '뉴스',
    `PWC:${results.pwc} SS:${results.ss} OR:${results.or} arXiv:${results.arxiv}`,
    results.errors.length ? 'WARN:'+results.errors.join(';') : 'OK');

  GmailApp.sendEmail(ADMIN_EMAIL, '[AI Study] 논문 수집 완료',
    `수집일: ${today}\nPWC:${results.pwc} / SS:${results.ss} / OR:${results.or} / arXiv:${results.arxiv}\n`
    + (results.errors.length ? '오류: '+results.errors.join(', ') : '오류 없음'));
}

/* ── 월간 백업 ───────────────────────────────────── */
function monthlyBackup() {
  const ss     = SpreadsheetApp.getActiveSpreadsheet();
  const yyyymm = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMM');
  let   folder;

  try {
    folder = DriveApp.getFolderById(BACKUP_FOLDER_ID);
  } catch (_) {
    const results = DriveApp.getFoldersByName('AI_Study_Backup');
    folder = results.hasNext() ? results.next() : DriveApp.createFolder('AI_Study_Backup');
  }

  const targets = ['강의문의', '강의요청', '뉴스', '시스템로그', '방문통계'];
  const saved   = [];

  targets.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) return;
    const csv = sheet.getDataRange().getValues()
      .map(r => r.map(c => '"' + String(c).replace(/"/g,'""') + '"').join(',')).join('\n');
    folder.createFile(Utilities.newBlob('﻿'+csv, 'text/csv; charset=utf-8', yyyymm+'_'+name+'.csv'));
    saved.push(name);
  });

  writeLog('BACKUP', ADMIN_EMAIL, '-', yyyymm+' '+saved.join(','), 'OK');
  GmailApp.sendEmail(ADMIN_EMAIL, '[AI Study] 월간 백업 완료',
    `백업 완료: ${yyyymm}\n저장 시트: ${saved.join(', ')}`);
}

/* ── 트리거 설정 (최초 1회 실행) ─────────────────── */
function setupAllTriggers() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('collectResearch')
    .timeBased().everyDays(1).atHour(6).inTimezone('Asia/Seoul').create();

  ScriptApp.newTrigger('monthlyBackup')
    .timeBased().onMonthDay(1).atHour(3).inTimezone('Asia/Seoul').create();

  Logger.log('트리거 설정 완료');
}
