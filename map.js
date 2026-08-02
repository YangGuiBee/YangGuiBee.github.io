/* ── 모델 맵: 질문에 예/아니오로 답하며 세부분류를 찾아가는 추천 플로우차트 ── */
/* scikit-learn 공식 알고리즘 치트시트와 같은 방식 — 개별 알고리즘(557개)이 아니라 */
/* algorithms.js의 20개 세부분류(subcategory) 단위로 안내한다. 리프를 클릭하면    */
/* algorithms.html?cat=..&sub=.. 로 이동해 그 분류의 실제 알고리즘들을 둘러볼 수 있다. */
/* 리프별 개수는 이 작성 시점의 algorithms.js 실데이터 스냅샷(총 557개) — 항목이   */
/* 추가/이동되면 이 숫자도 함께 갱신해야 한다.                                      */

const CAT_LABEL = { sup: '지도학습', unsup: '비지도학습', rl: '강화학습', ensemble: '앙상블' };

const FLOW_START = 'q1';
const FLOW = {
  q1:  { type: 'question', text: '에이전트가 환경과 상호작용하며 보상으로 학습하나요? (강화학습)', yes: 'rl1', no: 'q2' },
  rl1: { type: 'question', text: '환경의 규칙(전이 모델)을 알고 있거나 활용하나요?', yes: 'rl2', no: 'rl3' },
  rl2: { type: 'question', text: '그 모델이 이미 완전히 주어져 있나요? (시뮬레이터가 있음)', yes: 'leaf-model-based-given', no: 'leaf-model-based-learn' },
  rl3: { type: 'question', text: '행동을 확률적 정책으로 직접 출력하나요? (아니면 가치를 계산해 최선을 선택)', yes: 'leaf-policy-based', no: 'leaf-value-based' },

  q2:   { type: 'question', text: '여러 모델을 결합(앙상블)해서 사용하고 싶으신가요?', yes: 'ens1', no: 'q3' },
  ens1: { type: 'question', text: '이전 모델의 오차를 다음 모델이 순차적으로 보완하나요? (부스팅)', yes: 'leaf-boosting', no: 'ens2' },
  ens2: { type: 'question', text: '여러 모델의 예측을 학습된 메타모델로 다시 결합하나요? (스태킹)', yes: 'leaf-stacking', no: 'ens3' },
  ens3: { type: 'question', text: '각 모델이 서로 다른 무작위 부분표본으로 학습되나요? (배깅)', yes: 'leaf-bagging', no: 'leaf-voting' },

  q3:  { type: 'question', text: '모델의 평가 지표(성능 측정 방법)를 찾고 계신가요?', yes: 'q3a', no: 'q4' },
  q3a: { type: 'question', text: '지도학습 모델을 평가하시나요? (아니면 비지도학습)', yes: 'leaf-sup-evaluation', no: 'leaf-unsup-evaluation' },

  q4:   { type: 'question', text: '데이터에 정답(레이블)이 있나요?', yes: 'sup1', no: 'unsup1' },
  sup1: { type: 'question', text: '회귀와 분류에 함께 쓸 수 있는 범용 알고리즘(트리·SVM·KNN·신경망 등)을 찾으시나요?', yes: 'leaf-reg-class', no: 'sup2' },
  sup2: { type: 'question', text: '예측하려는 값이 연속적인 숫자인가요? (회귀)', yes: 'leaf-regression', no: 'leaf-classification' },

  unsup1:  { type: 'question', text: '데이터를 요약하거나 낮은 차원으로 변환하고 싶으신가요? (아니면 패턴·이상 탐색)', yes: 'unsupA1', no: 'unsupB1' },
  unsupA1: { type: 'question', text: '결과를 2~3차원으로 압축해 직접 눈으로 보고 싶나요? (시각화 목적)', yes: 'leaf-visualization', no: 'unsupA2' },
  unsupA2: { type: 'question', text: '특징(차원) 개수 자체를 줄이는 게 목적인가요? (아니면 확률분포·공분산 구조 추정)', yes: 'leaf-dim-reduction', no: 'leaf-density-covariance' },
  unsupB1: { type: 'question', text: '비슷한 데이터끼리 그룹으로 묶고 싶나요? (군집화)', yes: 'leaf-clustering', no: 'unsupB2' },
  unsupB2: { type: 'question', text: '항목 간 동시발생 규칙(장바구니 분석 등)을 찾고 싶나요? (연관규칙)', yes: 'leaf-association', no: 'unsupB3' },
  unsupB3: { type: 'question', text: '신경망(딥러닝) 기반 방법을 원하시나요? (아니면 이상치 탐지)', yes: 'leaf-neural', no: 'leaf-anomaly' },

  'leaf-model-based-given': { type: 'leaf', category: 'rl', subcategory: 'model-based-given', count: 2,
    reason: '환경 시뮬레이터가 이미 주어져 있을 때 계획·탐색으로 학습하는 알고리즘입니다.' },
  'leaf-model-based-learn': { type: 'leaf', category: 'rl', subcategory: 'model-based-learn', count: 8,
    reason: '환경 모델을 직접 학습한 뒤 그 안에서 정책을 훈련하는 알고리즘입니다.' },
  'leaf-policy-based': { type: 'leaf', category: 'rl', subcategory: 'policy-based', count: 14,
    reason: '정책을 신경망으로 직접 출력해 연속적이고 복잡한 행동 공간에 대응하는 알고리즘입니다.' },
  'leaf-value-based': { type: 'leaf', category: 'rl', subcategory: 'value-based', count: 14,
    reason: '상태-행동 가치를 계산해 최선의 행동을 선택하는 알고리즘입니다.' },

  'leaf-boosting': { type: 'leaf', category: 'ensemble', subcategory: 'boosting', count: 5,
    reason: '이전 모델의 오차를 다음 모델이 순차적으로 보완하며 예측력을 높이는 기법입니다.' },
  'leaf-stacking': { type: 'leaf', category: 'ensemble', subcategory: 'stacking', count: 2,
    reason: '여러 기저 모델의 예측을 메타 모델로 다시 결합하는 기법입니다.' },
  'leaf-bagging': { type: 'leaf', category: 'ensemble', subcategory: 'bagging', count: 5,
    reason: '무작위 부분표본으로 여러 모델을 독립 학습시켜 분산을 줄이는 기법입니다.' },
  'leaf-voting': { type: 'leaf', category: 'ensemble', subcategory: 'voting', count: 2,
    reason: '여러 모델의 예측을 다수결·평균으로 결합하는 가장 단순한 앙상블입니다.' },

  'leaf-sup-evaluation': { type: 'leaf', category: 'sup', subcategory: 'evaluation', count: 29,
    reason: '지도학습 모델의 정확도를 재는 회귀·분류 평가지표입니다.' },
  'leaf-unsup-evaluation': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', count: 75,
    reason: '비지도학습 결과(군집·차원축소 등)의 품질을 재는 평가지표입니다.' },

  'leaf-reg-class': { type: 'leaf', category: 'sup', subcategory: 'reg-class', count: 12,
    reason: '회귀와 분류에 모두 쓸 수 있는 범용 알고리즘입니다.' },
  'leaf-regression': { type: 'leaf', category: 'sup', subcategory: 'regression', count: 55,
    reason: '연속적인 수치를 예측하는 회귀 전용 알고리즘입니다.' },
  'leaf-classification': { type: 'leaf', category: 'sup', subcategory: 'classification', count: 9,
    reason: '범주·클래스를 예측하는 확률적·통계적 분류 알고리즘입니다.' },

  'leaf-visualization': { type: 'leaf', category: 'unsup', subcategory: 'visualization', count: 21,
    reason: '고차원 데이터를 2~3차원으로 압축해 눈으로 보여주는 알고리즘입니다.' },
  'leaf-dim-reduction': { type: 'leaf', category: 'unsup', subcategory: 'dim-reduction', count: 46,
    reason: '특징(차원) 개수를 줄여 데이터를 압축하는 알고리즘입니다.' },
  'leaf-density-covariance': { type: 'leaf', category: 'unsup', subcategory: 'density-covariance', count: 56,
    reason: '데이터의 확률분포나 공분산 구조를 추정하는 통계 기법입니다.' },
  'leaf-clustering': { type: 'leaf', category: 'unsup', subcategory: 'clustering', count: 66,
    reason: '비슷한 데이터끼리 자동으로 그룹을 나누는 알고리즘입니다.' },
  'leaf-association': { type: 'leaf', category: 'unsup', subcategory: 'association', count: 28,
    reason: '항목·이벤트 간 동시발생 규칙을 찾는 알고리즘입니다.' },
  'leaf-neural': { type: 'leaf', category: 'unsup', subcategory: 'neural', count: 57,
    reason: '신경망(딥러닝) 기반의 생성모델·표현학습·자기지도학습 알고리즘입니다.' },
  'leaf-anomaly': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', count: 51,
    reason: '정상 범위를 벗어난 이상치를 탐지하는 알고리즘입니다.' }
};

/* ── 전체 지도(개요) 좌표 및 짧은 라벨 ── */
/* DFS(예-분기 우선) 순서로 리프에 0..19 슬롯을 매기고, 내부 질문 노드는 두 자식의
   평균 x로 배치하는 표준 트리 레이아웃 — 슬롯 순서가 곧 아래 좌표 산출 근거 */
const NODE_SHORT = {
  q1: '보상학습?', rl1: '모델 알고?', rl2: '모델 제공?', rl3: '정책 출력?',
  q2: '앙상블?', ens1: '순차보완?', ens2: '메타모델?', ens3: '부분표본?',
  q3: '평가지표?', q3a: '지도평가?',
  q4: '레이블?', sup1: '범용모델?', sup2: '연속값?',
  unsup1: '요약변환?', unsupA1: '시각화?', unsupA2: '차원축소?',
  unsupB1: '군집화?', unsupB2: '연관규칙?', unsupB3: '신경망?',
  'leaf-model-based-given': 'MB(주어짐)', 'leaf-model-based-learn': 'MB(학습)',
  'leaf-policy-based': 'Policy', 'leaf-value-based': 'Value',
  'leaf-boosting': '부스팅', 'leaf-stacking': '스태킹', 'leaf-bagging': '배깅', 'leaf-voting': '보팅',
  'leaf-sup-evaluation': '지도 평가', 'leaf-unsup-evaluation': '비지도 평가',
  'leaf-reg-class': '회귀+분류', 'leaf-regression': '회귀', 'leaf-classification': '분류',
  'leaf-visualization': '시각화', 'leaf-dim-reduction': '차원축소', 'leaf-density-covariance': '밀도·공분산',
  'leaf-clustering': '군집화', 'leaf-association': '연관규칙', 'leaf-neural': '신경망 기반', 'leaf-anomaly': '이상치탐지'
};
const NODE_POS = {
  q1: { x: 497.8, y: 20 },
  rl1: { x: 197.5, y: 80 }, q2: { x: 798.0, y: 80 },
  rl2: { x: 102.5, y: 140 }, rl3: { x: 292.5, y: 140 }, ens1: { x: 518.1, y: 140 }, q3: { x: 1077.8, y: 140 },
  'leaf-model-based-given': { x: 55, y: 200 }, 'leaf-model-based-learn': { x: 150, y: 200 },
  'leaf-policy-based': { x: 245, y: 200 }, 'leaf-value-based': { x: 340, y: 200 },
  'leaf-boosting': { x: 435, y: 200 }, ens2: { x: 601.25, y: 200 },
  q3a: { x: 862.5, y: 200 }, q4: { x: 1293.0, y: 200 },
  'leaf-stacking': { x: 530, y: 260 }, ens3: { x: 672.5, y: 260 },
  'leaf-sup-evaluation': { x: 815, y: 260 }, 'leaf-unsup-evaluation': { x: 910, y: 260 },
  sup1: { x: 1076.25, y: 260 }, unsup1: { x: 1509.7, y: 260 },
  'leaf-bagging': { x: 625, y: 320 }, 'leaf-voting': { x: 720, y: 320 },
  'leaf-reg-class': { x: 1005, y: 320 }, sup2: { x: 1147.5, y: 320 },
  unsupA1: { x: 1361.25, y: 320 }, unsupB1: { x: 1658.125, y: 320 },
  'leaf-regression': { x: 1100, y: 380 }, 'leaf-classification': { x: 1195, y: 380 },
  'leaf-visualization': { x: 1290, y: 380 }, unsupA2: { x: 1432.5, y: 380 },
  'leaf-clustering': { x: 1575, y: 380 }, unsupB2: { x: 1741.25, y: 380 },
  'leaf-dim-reduction': { x: 1385, y: 440 }, 'leaf-density-covariance': { x: 1480, y: 440 },
  'leaf-association': { x: 1670, y: 440 }, unsupB3: { x: 1812.5, y: 440 },
  'leaf-neural': { x: 1765, y: 500 }, 'leaf-anomaly': { x: 1860, y: 500 }
};
const OVERVIEW_W = 1920, OVERVIEW_H = 530;

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
      return `<line class="map-ov-edge" x1="${from.x}" y1="${from.y + 14}" x2="${to.x}" y2="${to.y - 14}"
        stroke="${isTraveled ? '#006633' : '#d8e3da'}" stroke-width="${isTraveled ? 3 : 1.5}"
        stroke-dasharray="${isTraveled ? 'none' : '4 4'}" />`;
    });
  }).join('');

  const nodesSvg = Object.entries(FLOW).map(([key, n]) => {
    const pos = NODE_POS[key];
    const isLeaf = n.type === 'leaf';
    const isCurrent = key === current;
    const isVisited = visitedKeys.has(key);
    const w = isLeaf ? 84 : 100, h = 28;
    let fill = '#f3f6f3', stroke = '#d8e3da', textColor = '#8a978c';
    if (isVisited && !isCurrent) { fill = isLeaf ? '#e6f2ea' : '#eef6f0'; stroke = '#006633'; textColor = '#006633'; }
    if (isCurrent) { fill = '#006633'; stroke = '#006633'; textColor = '#ffffff'; }
    const title = n.type === 'question' ? n.text : `${CAT_LABEL[n.category]} · ${NODE_SHORT[key]} (${n.count}개)`;
    return `
      <g class="map-ov-node">
        <title>${title}</title>
        <rect x="${pos.x - w / 2}" y="${pos.y - h / 2}" width="${w}" height="${h}" rx="${isLeaf ? 14 : 6}"
          fill="${fill}" stroke="${stroke}" stroke-width="${isCurrent ? 2.5 : 1.5}" />
        <text x="${pos.x}" y="${pos.y + 3.2}" text-anchor="middle" font-size="9" font-weight="700" fill="${textColor}">${NODE_SHORT[key]}</text>
      </g>`;
  }).join('');

  wrap.innerHTML = `<svg viewBox="0 0 ${OVERVIEW_W} ${OVERVIEW_H}" preserveAspectRatio="xMidYMid meet">${edgesSvg}${nodesSvg}</svg>`;
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
    const subLabel = NODE_SHORT[current];
    stage.innerHTML = `
      <div class="map-result">
        <div class="map-result-label">추천 분류</div>
        <div class="map-result-title">${CAT_LABEL[node.category]} · ${subLabel}</div>
        <p class="map-result-reason">${node.reason} (${node.count}개 알고리즘 수록)</p>
        <div class="map-result-links">
          <a class="map-result-link primary" href="algorithms.html?cat=${node.category}&sub=${node.subcategory}">이 분류의 알고리즘 보기 →</a>
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
