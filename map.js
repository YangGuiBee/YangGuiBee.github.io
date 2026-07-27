/* ── 모델 맵: 질문에 예/아니오로 답하며 알고리즘을 찾아가는 추천 플로우차트 ── */
/* scikit-learn 공식 알고리즘 치트시트와 같은 방식 — 지금은 7개 샘플 알고리즘 기준 */

const ALGO_INFO = {
  'linear-regression': { title: '선형 회귀 (Linear Regression)' },
  'decision-tree':     { title: '결정트리 (Decision Tree)' },
  'kmeans':            { title: 'K-평균 군집화 (K-Means Clustering)' },
  'pca':               { title: '주성분분석 (PCA)' },
  'q-learning':        { title: 'Q-러닝 (Q-Learning)' },
  'policy-gradient':   { title: '정책 경사법 (Policy Gradient)' },
  'random-forest':     { title: '랜덤 포레스트 (Random Forest)' }
};

const FLOW_START = 'q1';
const FLOW = {
  q1: { type: 'question', text: '이 문제에 정답(레이블)이 있는 데이터인가요?', yes: 'q2b', no: 'q2a' },
  q2a: { type: 'question', text: '비슷한 데이터끼리 그룹으로 묶고 싶나요? (아니면 차원을 줄이고 싶은가요?)', yes: 'leaf-kmeans', no: 'leaf-pca' },
  q2b: { type: 'question', text: '정답을 미리 주는 대신, 에이전트가 환경과 상호작용하며 보상으로 학습하나요?', yes: 'q3a', no: 'q3b' },
  q3a: { type: 'question', text: '상태·행동의 경우의 수가 적어 표(Q-table)로 나타낼 수 있나요?', yes: 'leaf-qlearning', no: 'leaf-policygrad' },
  q3b: { type: 'question', text: '예측하려는 값이 연속적인 숫자인가요? (아니면 범주·클래스인가요?)', yes: 'q4a', no: 'q4b' },
  q4a: { type: 'question', text: '입력과 출력이 대체로 하나의 직선(선형 관계)으로 보이나요?', yes: 'leaf-linreg', no: 'leaf-rf-reg' },
  q4b: { type: 'question', text: '모델이 왜 그렇게 판단했는지 사람이 규칙으로 설명할 수 있어야 하나요?', yes: 'leaf-dt', no: 'leaf-rf-cls' },

  'leaf-kmeans':     { type: 'leaf', id: 'kmeans', reason: '레이블 없이 비슷한 데이터를 자동으로 그룹화합니다.' },
  'leaf-pca':        { type: 'leaf', id: 'pca', reason: '레이블 없이 데이터의 차원(특성 수)을 압축·시각화합니다.' },
  'leaf-qlearning':  { type: 'leaf', id: 'q-learning', reason: '상태-행동 조합이 적을 때 표 기반으로 가치를 학습합니다.' },
  'leaf-policygrad': { type: 'leaf', id: 'policy-gradient', reason: '상태·행동 공간이 커서 신경망으로 정책을 직접 학습합니다.' },
  'leaf-linreg':     { type: 'leaf', id: 'linear-regression', reason: '입출력 관계가 선형적일 때 가장 해석하기 쉬운 회귀 모델입니다.' },
  'leaf-rf-reg':     { type: 'leaf', id: 'random-forest', reason: '비선형 패턴이 있는 회귀 문제에서 여러 트리를 결합해 안정적으로 예측합니다.' },
  'leaf-dt':         { type: 'leaf', id: 'decision-tree', reason: '판단 근거를 사람이 규칙으로 설명해야 하는 분류 문제에 적합합니다.' },
  'leaf-rf-cls':     { type: 'leaf', id: 'random-forest', reason: '해석 가능성보다 정확도가 중요한 분류 문제에서 여러 트리를 결합합니다.' }
};

/* ── 전체 지도(개요) 좌표 및 짧은 라벨 ── */
const NODE_SHORT = {
  q1: '레이블 유무', q2a: '그룹화 · 축소', q2b: '보상 학습?', q3a: '상태 이산적?',
  q3b: '회귀 · 분류', q4a: '선형 관계?', q4b: '해석 필요?',
  'leaf-kmeans': 'K-평균', 'leaf-pca': 'PCA',
  'leaf-qlearning': 'Q-러닝', 'leaf-policygrad': '정책경사법',
  'leaf-linreg': '선형회귀', 'leaf-rf-reg': '랜덤포레스트',
  'leaf-dt': '결정트리', 'leaf-rf-cls': '랜덤포레스트'
};
const NODE_POS = {
  q1:  { x: 383, y: 20 },
  q2a: { x: 190, y: 62 }, q2b: { x: 575, y: 62 },
  'leaf-kmeans': { x: 135, y: 104 }, 'leaf-pca': { x: 245, y: 104 },
  q3a: { x: 410, y: 104 }, q3b: { x: 740, y: 104 },
  'leaf-qlearning': { x: 355, y: 146 }, 'leaf-policygrad': { x: 465, y: 146 },
  q4a: { x: 630, y: 146 }, q4b: { x: 850, y: 146 },
  'leaf-linreg': { x: 575, y: 188 }, 'leaf-rf-reg': { x: 685, y: 188 },
  'leaf-dt': { x: 795, y: 188 }, 'leaf-rf-cls': { x: 905, y: 188 }
};

function renderOverview() {
  const wrap = document.getElementById('mapOverview');
  const traveled = path.map(step => ({
    from: step.nodeKey,
    to: step.answerYes ? FLOW[step.nodeKey].yes : FLOW[step.nodeKey].no
  }));
  const visitedKeys = new Set(['q1', ...traveled.map(e => e.to)]);

  const edgesSvg = Object.entries(FLOW).filter(([, n]) => n.type === 'question').flatMap(([key, n]) => {
    return ['yes', 'no'].map(branch => {
      const childKey = n[branch];
      const from = NODE_POS[key], to = NODE_POS[childKey];
      const isTraveled = traveled.some(e => e.from === key && e.to === childKey);
      return `<line class="map-ov-edge" x1="${from.x}" y1="${from.y + 15}" x2="${to.x}" y2="${to.y - 15}"
        stroke="${isTraveled ? '#006633' : '#d8e3da'}" stroke-width="${isTraveled ? 3 : 1.5}"
        stroke-dasharray="${isTraveled ? 'none' : '4 4'}" />`;
    });
  }).join('');

  const nodesSvg = Object.entries(FLOW).map(([key, n]) => {
    const pos = NODE_POS[key];
    const isLeaf = n.type === 'leaf';
    const isCurrent = key === current;
    const isVisited = visitedKeys.has(key);
    const w = isLeaf ? 96 : 132, h = 30;
    let fill = '#f3f6f3', stroke = '#d8e3da', textColor = '#8a978c';
    if (isVisited && !isCurrent) { fill = isLeaf ? '#e6f2ea' : '#eef6f0'; stroke = '#006633'; textColor = '#006633'; }
    if (isCurrent) { fill = '#006633'; stroke = '#006633'; textColor = '#ffffff'; }
    const title = n.type === 'question' ? n.text : (ALGO_INFO[n.id]?.title || '');
    return `
      <g class="map-ov-node">
        <title>${title}</title>
        <rect x="${pos.x - w / 2}" y="${pos.y - h / 2}" width="${w}" height="${h}" rx="${isLeaf ? 15 : 7}"
          fill="${fill}" stroke="${stroke}" stroke-width="${isCurrent ? 2.5 : 1.5}" />
        <text x="${pos.x}" y="${pos.y + 3.5}" text-anchor="middle" font-size="10" font-weight="700" fill="${textColor}">${NODE_SHORT[key]}</text>
      </g>`;
  }).join('');

  wrap.innerHTML = `<svg viewBox="0 0 980 205" preserveAspectRatio="xMidYMid meet">${edgesSvg}${nodesSvg}</svg>`;
}

let path = []; /* [{ nodeKey, text, answerYes }] */
let current = FLOW_START;

function renderTrail() {
  const trail = document.getElementById('mapTrail');
  if (path.length === 0) { trail.innerHTML = ''; return; }
  trail.innerHTML = path.map((step, i) => `
    ${i > 0 ? '<span class="map-trail-arrow">→</span>' : ''}
    <span class="map-trail-step" title="${step.text}">
      ${NODE_SHORT[step.nodeKey]}
      <span class="map-trail-a ${step.answerYes ? 'yes' : 'no'}">${step.answerYes ? '예' : '아니오'}</span>
    </span>
  `).join('');
}

function renderStage() {
  const stage = document.getElementById('mapStage');
  const node = FLOW[current];

  if (node.type === 'question') {
    stage.innerHTML = `
      <div class="map-question">
        <div class="map-question-label">Q${path.length + 1}</div>
        <div class="map-question-text">${node.text}</div>
        <div class="map-btn-row">
          <button class="map-btn map-btn-yes" data-answer="yes">예</button>
          <button class="map-btn map-btn-no" data-answer="no">아니오</button>
        </div>
      </div>`;
    stage.querySelector('[data-answer="yes"]').addEventListener('click', () => answer(true));
    stage.querySelector('[data-answer="no"]').addEventListener('click', () => answer(false));
  } else {
    const info = ALGO_INFO[node.id];
    stage.innerHTML = `
      <div class="map-result">
        <div class="map-result-label">추천 알고리즘</div>
        <div class="map-result-title">${info.title}</div>
        <p class="map-result-reason">${node.reason}</p>
        <div class="map-result-links">
          <a class="map-result-link primary" href="algorithms.html?id=${node.id}">교과서에서 배우기 →</a>
        </div>
      </div>`;
  }
}

function renderActions() {
  const actions = document.getElementById('mapActions');
  actions.innerHTML = `
    <button class="map-action-btn" id="mapBack" ${path.length === 0 ? 'hidden' : ''}>← 이전 질문으로</button>
    <button class="map-action-btn" id="mapReset" ${path.length === 0 ? 'hidden' : ''}>처음부터 다시</button>
  `;
  document.getElementById('mapBack')?.addEventListener('click', goBack);
  document.getElementById('mapReset')?.addEventListener('click', reset);
}

function render() {
  renderOverview();
  renderTrail();
  renderStage();
  renderActions();
}

function answer(isYes) {
  const node = FLOW[current];
  path.push({ nodeKey: current, text: node.text, answerYes: isYes });
  current = isYes ? node.yes : node.no;
  render();
}

function goBack() {
  if (path.length === 0) return;
  const last = path.pop();
  current = last.nodeKey;
  render();
}

function reset() {
  path = [];
  current = FLOW_START;
  render();
}

render();
