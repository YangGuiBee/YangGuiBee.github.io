// 범용: <html 파일> <변수명> 을 받아 그 var 객체 리터럴을 JSON으로 stdout에 출력한다.
// 줄바꿈 유무(예쁘게 들여쓴 형태 vs 한 줄로 압축된 형태) 둘 다 처리하기 위해
// 정규식 대신 문자열/이스케이프를 인식하는 중괄호 매칭으로 객체 끝을 찾는다.
const fs = require('fs');

const filePath = process.argv[2];
const varName = process.argv[3];
const src = fs.readFileSync(filePath, 'utf-8');

const marker = 'var ' + varName + ' = {';
const start = src.indexOf(marker);
if (start === -1) {
  console.error('not found: ' + varName + ' in ' + filePath);
  process.exit(1);
}
const objStart = start + marker.length - 1; // index of the opening '{'

let depth = 0, i = objStart, inStr = false, strCh = '';
for (; i < src.length; i++) {
  const c = src[i];
  if (inStr) {
    if (c === '\\') { i++; continue; }
    if (c === strCh) inStr = false;
    continue;
  }
  if (c === '"' || c === "'") { inStr = true; strCh = c; continue; }
  if (c === '{') depth++;
  else if (c === '}') {
    depth--;
    if (depth === 0) { i++; break; }
  }
}
const literal = src.slice(objStart, i);
const obj = eval('(' + literal + ')');
process.stdout.write(JSON.stringify(obj));
