// 범용: <html 파일> <변수명> 을 받아 그 var 객체 리터럴을 JSON으로 stdout에 출력한다.
const fs = require('fs');

const filePath = process.argv[2];
const varName = process.argv[3];
const src = fs.readFileSync(filePath, 'utf-8');
const re = new RegExp('var ' + varName + ' = (\\{[\\s\\S]*?\\n  \\};)');
const m = src.match(re);
if (!m) {
  console.error('not found: ' + varName + ' in ' + filePath);
  process.exit(1);
}
const obj = eval('(' + m[1].replace(/;\s*$/, '') + ')');
process.stdout.write(JSON.stringify(obj));
