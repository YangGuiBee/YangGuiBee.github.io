/* ── 모델 맵: 557개 알고리즘 전체를 유사 알고리즘군(family) 단위 리프로 안내한다 ── */
/* 좌표는 트리 레이아웃 알고리즘으로 자동 계산되므로, family를 추가/조정해도
   NODE_POS를 손으로 다시 잡을 필요가 없다 */

const CAT_LABEL = { sup: '지도학습', unsup: '비지도학습', rl: '강화학습', ensemble: '앙상블' };

/* 리프는 subcategory 전체(count) 또는 family로 추린 개별 알고리즘 목록(ids)을 가리킬 수 있다 */
function leafCount(n) { return n.ids ? n.ids.length : n.count; }
function leafLink(n) {
  return n.ids
    ? `algorithms.html?ids=${n.ids.join(',')}`
    : `algorithms.html?cat=${n.category}&sub=${n.subcategory}`;
}

const FLOW_START = 'q1';
const FLOW = {
  q1:  { type: 'question', text: '에이전트가 환경과 상호작용하며 보상으로 학습하나요? (강화학습)', yes: 'rl1', no: 'q2' },

  /* ══════ 강화학습: 모델기반 여부 → 가치/정책 기반 ══════ */
  rl1: { type: 'question', text: '환경의 규칙(전이 모델)을 알고 있거나 활용하나요?', yes: 'rl2', no: 'rl_vp' },
  rl2: { type: 'question', text: '그 모델이 이미 완전히 주어져 있나요? (시뮬레이터가 있음)', yes: 'rl_mbg', no: 'rl_mbl1' },

  rl_mbg: { type: 'question', text: '몬테카를로 트리 탐색으로 자기대국하며 학습하나요?', yes: 'leaf-alphazero', no: 'leaf-dyna-q' },

  rl_mbl1: { type: 'question', text: '게임 규칙 자체를 몰라도 되도록, 승패 예측에 필요한 추상 상태만 학습하나요? (실제 환경 모델 없이)', yes: 'leaf-muzero', no: 'rl_mbl2' },
  rl_mbl2: { type: 'question', text: '학습된 모델로 여러 상상 궤적을 만들어 정책 네트워크의 보조 입력으로만 사용하나요?', yes: 'leaf-i2a', no: 'rl_mbl3' },
  rl_mbl3: { type: 'question', text: '모델 기반 계획으로 먼저 빠르게 학습한 뒤 모델-프리 방식으로 미세조정하나요?', yes: 'leaf-mbmf', no: 'rl_mbl4' },
  rl_mbl4: { type: 'question', text: '몇 스텝만 모델로 미리 내다보고 나머지는 가치함수로 대체하나요?', yes: 'leaf-mbve', no: 'rl_mbl5' },
  rl_mbl5: { type: 'question', text: '여러 확률적 모델의 앙상블로 궤적을 샘플링해 불확실성을 표현하나요?', yes: 'leaf-pets', no: 'rl_mbl6' },
  rl_mbl6: { type: 'question', text: '학습된 잠재 상태 안에서 정책까지 함께 학습하나요? (온라인 계획만 하는 게 아니라)', yes: 'rl_mbl7', no: 'leaf-planet' },
  rl_mbl7: { type: 'question', text: '관측 압축(표현학습)과 정책 학습을 완전히 분리된 단계로 진행하나요?', yes: 'leaf-world-models', no: 'leaf-dreamer' },

  rl_vp: { type: 'question', text: '행동을 확률적 정책으로 직접 출력하나요? (아니면 가치를 계산해 최선을 선택)', yes: 'rl_pol1', no: 'rl_val1' },

  /* ── 정책 기반 (14개, 전부 개별 리프) ── */
  rl_pol1: { type: 'question', text: '전문가의 시연 데이터를 지도학습처럼 모방하나요? (보상 신호 없이)', yes: 'leaf-bc', no: 'rl_pol2' },
  rl_pol2: { type: 'question', text: '가치함수 없이 정책만 학습하나요? (크리틱이 없음)', yes: 'leaf-reinforce', no: 'rl_pol3' },
  rl_pol3: { type: 'question', text: '행동을 확률분포가 아니라 결정적인 값으로 직접 출력하나요? (연속 제어)', yes: 'rl_pol4', no: 'rl_pol7' },
  rl_pol4: { type: 'question', text: '탐색을 돕기 위해 사람의 시연 데이터를 함께 활용하나요?', yes: 'leaf-ddpgfd', no: 'rl_pol5' },
  rl_pol5: { type: 'question', text: '두 개의 크리틱과 지연된 정책 갱신으로 Q값 과대추정을 줄였나요?', yes: 'leaf-td3', no: 'rl_pol6' },
  rl_pol6: { type: 'question', text: '보상뿐 아니라 정책의 엔트로피(다양성)도 함께 최대화하나요?', yes: 'leaf-sac', no: 'leaf-ddpg' },
  rl_pol7: { type: 'question', text: '정책이 한 번에 너무 크게 바뀌지 않도록 제약을 거나요? (신뢰영역)', yes: 'rl_pol8', no: 'rl_pol9' },
  rl_pol8: { type: 'question', text: '그 제약을 위해 2차 최적화(켤레 경사법)를 사용하나요?', yes: 'leaf-trpo', no: 'leaf-ppo' },
  rl_pol9: { type: 'question', text: '정책 갱신에 파라미터 공간의 곡률(자연 경사)을 반영하나요?', yes: 'leaf-nac', no: 'rl_pol10' },
  rl_pol10: { type: 'question', text: '온폴리시가 아니라 과거 경험을 재사용하는 오프폴리시 기법인가요?', yes: 'rl_pol11', no: 'rl_pol13' },
  rl_pol11: { type: 'question', text: '수천 개의 액터가 병렬로 경험을 모으는 대규모 분산 구조인가요?', yes: 'leaf-impala', no: 'rl_pol12' },
  rl_pol12: { type: 'question', text: '경험 재현(리플레이 버퍼)을 결합했나요?', yes: 'leaf-acer', no: 'leaf-off-pac' },
  rl_pol13: { type: 'question', text: '여러 환경을 병렬 실행해 이점(advantage) 함수로 분산을 줄이나요?', yes: 'leaf-a2c-a3c', no: 'leaf-actor-critic' },

  /* ── 가치 기반 (14개 → 12개 리프, 근접 쌍 2개만 묶음) ── */
  rl_val1: { type: 'question', text: '보상에 정책의 엔트로피(다양성)를 포함해 다양한 행동 선택을 장려하나요?', yes: 'leaf-sql', no: 'rl_val2' },
  rl_val2: { type: 'question', text: '테이블(Q-table)로 충분히 표현 가능한 작은 상태공간인가요? (신경망 없이)', yes: 'rl_val3', no: 'rl_val4' },
  rl_val3: { type: 'question', text: '다음 행동도 실제 정책을 따라 정하나요? (온폴리시)', yes: 'leaf-sarsa', no: 'leaf-q-learning' },
  rl_val4: { type: 'question', text: '여러 개선 기법(과대추정 보정·분포·재현·탐색 등)을 한 번에 통합했나요?', yes: 'leaf-rainbow', no: 'rl_val5' },
  rl_val5: { type: 'question', text: 'Q값을 하나의 숫자가 아니라 반환값의 확률분포로 학습하나요?', yes: 'leaf-distributional-dqn', no: 'rl_val6' },
  rl_val6: { type: 'question', text: '경험 재현 방식(우선순위·목표 재라벨링)을 개선하거나, 신경망에 탐색용 잡음을 추가했나요?', yes: 'rl_val7', no: 'rl_val9' },
  rl_val7: { type: 'question', text: '신경망 가중치 자체에 학습 가능한 잡음을 추가해 탐색을 자동화하나요?', yes: 'leaf-noisynet', no: 'rl_val8' },
  rl_val8: { type: 'question', text: '실패한 경험도 도달한 상태를 목표로 재해석해 재사용하나요?', yes: 'leaf-her', no: 'leaf-per' },
  rl_val9: { type: 'question', text: '부분관측 환경이라 과거 정보를 기억할 순환 구조가 필요한가요?', yes: 'leaf-drqn', no: 'rl_val10' },
  rl_val10: { type: 'question', text: '상태 가치와 행동별 이점을 분리한 구조로 학습 효율을 높였나요?', yes: 'leaf-dueling-dqn', no: 'rl_val11' },
  rl_val11: { type: 'question', text: '행동 선택과 가치 평가를 분리해 Q값 과대추정을 줄였나요? (Double DQN)', yes: 'leaf-double-dqn', no: 'leaf-dqn-qnetwork' },

  q2:   { type: 'question', text: '여러 모델을 결합(앙상블)해서 사용하고 싶으신가요?', yes: 'ens1', no: 'q3' },

  /* ══════ 앙상블: 부스팅/스태킹/배깅/보팅 각 family로 세분화 ══════ */
  ens1: { type: 'question', text: '이전 모델의 오차를 다음 모델이 순차적으로 보완하나요? (부스팅)', yes: 'ens_boost1', no: 'ens2' },
  ens_boost1: { type: 'question', text: '오분류된 샘플의 가중치를 높여가는 방식(잔차의 그래디언트가 아님)인가요?', yes: 'leaf-adaboost', no: 'ens_boost2' },
  ens_boost2: { type: 'question', text: '범주형 변수 자동 처리나 속도 최적화가 강화된 최신 구현체를 찾으시나요?', yes: 'ens_boost3', no: 'leaf-gbm' },
  ens_boost3: { type: 'question', text: '범주형 변수를 자동으로 처리하는 것을 가장 중요하게 보시나요?', yes: 'leaf-catboost', no: 'ens_boost4' },
  ens_boost4: { type: 'question', text: '대용량 데이터에서의 학습 속도를 가장 중요하게 보시나요?', yes: 'leaf-lightgbm', no: 'leaf-xgboost' },

  ens2: { type: 'question', text: '여러 모델의 예측을 학습된 메타모델로 다시 결합하나요? (스태킹)', yes: 'ens_stack1', no: 'ens3' },
  ens_stack1: { type: 'question', text: '교차검증 대신 별도의 홀드아웃 집합으로 메타모델을 학습하나요? (빠르지만 데이터를 덜 씀)', yes: 'leaf-blending', no: 'leaf-stacking' },

  ens3: { type: 'question', text: '각 모델이 서로 다른 무작위 부분표본으로 학습되나요? (배깅)', yes: 'ens_bag1', no: 'ens_vote1' },
  ens_bag1: { type: 'question', text: '트리를 기저 모델로 쓰는 전용 배깅인가요? (범용 리샘플링 기법이 아니라)', yes: 'ens_bag2', no: 'ens_bag3' },
  ens_bag2: { type: 'question', text: '분할 임계값까지 무작위로 고르나요? (최적 탐색을 생략)', yes: 'leaf-extra-trees', no: 'leaf-random-forest' },
  ens_bag3: { type: 'question', text: '데이터(행)가 아니라 특징(열)을 무작위로 추출하나요?', yes: 'leaf-random-subspace-method', no: 'ens_bag4' },
  ens_bag4: { type: 'question', text: '복원추출(중복 허용)로 부분표본을 만드나요?', yes: 'leaf-bagging', no: 'leaf-pasting' },

  ens_vote1: { type: 'question', text: '각 모델의 예측 확률까지 평균해 결합하나요? (단순 다수결이 아니라)', yes: 'leaf-soft-voting', no: 'leaf-hard-voting' },

  q3:  { type: 'question', text: '모델의 평가 지표(성능 측정 방법)를 찾고 계신가요?', yes: 'q3a', no: 'q4' },
  q3a: { type: 'question', text: '지도학습 모델을 평가하시나요? (아니면 비지도학습)', yes: 'supeval1', no: 'unsupeval1' },

  q4:   { type: 'question', text: '데이터에 정답(레이블)이 있나요?', yes: 'sup1', no: 'unsup1' },
  sup1: { type: 'question', text: '회귀와 분류에 함께 쓸 수 있는 범용 알고리즘(트리·SVM·KNN·신경망 등)을 찾으시나요?', yes: 'sup_rc1', no: 'sup2' },
  sup2: { type: 'question', text: '예측하려는 값이 연속적인 숫자인가요? (회귀)', yes: 'sup_reg1', no: 'sup_cls1' },

  unsup1:  { type: 'question', text: '데이터를 요약하거나 낮은 차원으로 변환하고 싶으신가요? (아니면 패턴·이상 탐색)', yes: 'unsupA1', no: 'unsupB1' },
  unsupA1: { type: 'question', text: '결과를 2~3차원으로 압축해 직접 눈으로 보고 싶나요? (시각화 목적)', yes: 'viz1', no: 'unsupA2' },
  unsupA2: { type: 'question', text: '특징(차원) 개수 자체를 줄이는 게 목적인가요? (아니면 확률분포·공분산 구조 추정)', yes: 'dimred1', no: 'denscov1' },
  unsupB1: { type: 'question', text: '비슷한 데이터끼리 그룹으로 묶고 싶나요? (군집화)', yes: 'clu1', no: 'unsupB2' },
  unsupB2: { type: 'question', text: '항목 간 동시발생 규칙(장바구니 분석 등)을 찾고 싶나요? (연관규칙)', yes: 'assoc1', no: 'unsupB3' },
  unsupB3: { type: 'question', text: '신경망(딥러닝) 기반 방법을 원하시나요? (아니면 이상치 탐지)', yes: 'neural1', no: 'anom1' },

  /* ── 강화학습 리프 ── */
  'leaf-alphazero': { type: 'leaf', category: 'rl', subcategory: 'model-based-given', ids: ['alphazero'],
    reason: '규칙이 완전히 알려진 게임에서 자기대국과 MCTS로 초인적 실력을 학습하는 알고리즘입니다.' },
  'leaf-dyna-q': { type: 'leaf', category: 'rl', subcategory: 'model-based-given', ids: ['dyna-q'],
    reason: '실제 경험과 학습된 모델의 가상 경험을 함께 활용해 Q값을 갱신하는 통합 프레임워크입니다.' },
  'leaf-muzero': { type: 'leaf', category: 'rl', subcategory: 'model-based-learn', ids: ['muzero'],
    reason: '환경 규칙을 몰라도 예측에 필요한 잠재 상태만 학습해 MCTS로 계획하는 알고리즘입니다.' },
  'leaf-i2a': { type: 'leaf', category: 'rl', subcategory: 'model-based-learn', ids: ['i2a'],
    reason: '학습된 모델로 상상한 궤적을 요약해 정책 결정에 함께 활용하는 알고리즘입니다.' },
  'leaf-mbmf': { type: 'leaf', category: 'rl', subcategory: 'model-based-learn', ids: ['mbmf'],
    reason: '모델 기반 제어로 빠르게 초기화한 뒤 모델 프리로 정밀하게 다듬는 2단계 알고리즘입니다.' },
  'leaf-mbve': { type: 'leaf', category: 'rl', subcategory: 'model-based-learn', ids: ['mbve'],
    reason: '학습된 모델로 몇 스텝만 미리 내다본 뒤 가치함수로 마무리하는 알고리즘입니다.' },
  'leaf-pets': { type: 'leaf', category: 'rl', subcategory: 'model-based-learn', ids: ['pets'],
    reason: '여러 확률적 신경망 모델의 앙상블로 불확실성을 표현하며 계획하는 알고리즘입니다.' },
  'leaf-planet': { type: 'leaf', category: 'rl', subcategory: 'model-based-learn', ids: ['planet'],
    reason: '픽셀 관측에서 학습한 잠재 동역학 모델 안에서 직접 온라인 계획을 세우는 알고리즘입니다.' },
  'leaf-dreamer': { type: 'leaf', category: 'rl', subcategory: 'model-based-learn', ids: ['dreamer'],
    reason: '학습된 잠재 세계모델 안에서 상상으로 궤적을 굴려 정책까지 함께 학습하는 알고리즘입니다.' },
  'leaf-world-models': { type: 'leaf', category: 'rl', subcategory: 'model-based-learn', ids: ['world-models'],
    reason: 'VAE로 관측을 압축하고 RNN으로 예측한 뒤, 그 위에서 정책을 진화전략으로 학습하는 알고리즘입니다.' },

  'leaf-bc': { type: 'leaf', category: 'rl', subcategory: 'policy-based', ids: ['bc'],
    reason: '전문가 시연 데이터를 지도학습으로 모방해 정책을 학습하는 모방학습 기법입니다.' },
  'leaf-reinforce': { type: 'leaf', category: 'rl', subcategory: 'policy-based', ids: ['reinforce'],
    reason: '에피소드 전체의 반환값으로 정책을 직접 갱신하는 정책 경사법의 기본형입니다.' },
  'leaf-actor-critic': { type: 'leaf', category: 'rl', subcategory: 'policy-based', ids: ['actor-critic'],
    reason: '정책(액터)과 가치함수(크리틱)를 함께 학습해 분산을 낮추는 기본 구조입니다.' },
  'leaf-nac': { type: 'leaf', category: 'rl', subcategory: 'policy-based', ids: ['nac'],
    reason: '파라미터 공간의 곡률을 반영한 자연 경사로 정책을 더 효율적으로 갱신하는 기법입니다.' },
  'leaf-a2c-a3c': { type: 'leaf', category: 'rl', subcategory: 'policy-based', ids: ['a2c-a3c'],
    reason: '여러 환경을 병렬 실행해 이점 함수로 분산을 줄이는 분산형 액터-크리틱입니다.' },
  'leaf-acer': { type: 'leaf', category: 'rl', subcategory: 'policy-based', ids: ['acer'],
    reason: '경험 재현을 액터-크리틱에 안전하게 결합해 샘플 효율을 높인 기법입니다.' },
  'leaf-impala': { type: 'leaf', category: 'rl', subcategory: 'policy-based', ids: ['impala'],
    reason: '수많은 액터가 경험을 모으고 V-trace로 정책 지연을 보정하며 대규모로 학습하는 구조입니다.' },
  'leaf-off-pac': { type: 'leaf', category: 'rl', subcategory: 'policy-based', ids: ['off-pac'],
    reason: '행동 정책과 다른 정책을 평가·개선할 수 있도록 확장한 초기 오프폴리시 액터-크리틱입니다.' },
  'leaf-ppo': { type: 'leaf', category: 'rl', subcategory: 'policy-based', ids: ['ppo'],
    reason: '목적함수를 클리핑해 정책이 한 번에 너무 크게 바뀌지 않도록 제한하는 사실상 표준 알고리즘입니다.' },
  'leaf-trpo': { type: 'leaf', category: 'rl', subcategory: 'policy-based', ids: ['trpo'],
    reason: 'KL 발산 제약으로 정책 변화 폭을 엄밀히 제한하며 매 스텝 성능 향상을 보장하는 기법입니다.' },
  'leaf-ddpg': { type: 'leaf', category: 'rl', subcategory: 'policy-based', ids: ['ddpg'],
    reason: '연속 행동 공간에서 결정적 정책을 학습하는 오프폴리시 액터-크리틱입니다.' },
  'leaf-ddpgfd': { type: 'leaf', category: 'rl', subcategory: 'policy-based', ids: ['ddpgfd'],
    reason: '전문가 시연 데이터를 리플레이 버퍼에 섞어 DDPG의 초기 학습을 가속하는 기법입니다.' },
  'leaf-td3': { type: 'leaf', category: 'rl', subcategory: 'policy-based', ids: ['td3'],
    reason: '두 개의 크리틱과 지연된 정책 갱신으로 DDPG의 과대추정 문제를 개선한 기법입니다.' },
  'leaf-sac': { type: 'leaf', category: 'rl', subcategory: 'policy-based', ids: ['sac'],
    reason: '보상과 정책 엔트로피를 함께 최대화해 탐색·활용의 균형을 자동으로 유지하는 알고리즘입니다.' },

  'leaf-q-learning': { type: 'leaf', category: 'rl', subcategory: 'value-based', ids: ['q-learning'],
    reason: '상태-행동 가치를 표(Q-Table)로 저장하며 벨만 방정식으로 최적 정책을 학습하는 기본 기법입니다.' },
  'leaf-sarsa': { type: 'leaf', category: 'rl', subcategory: 'value-based', ids: ['sarsa'],
    reason: '실제로 다음에 취할 행동까지 반영해 갱신하는 온폴리시 가치 기반 기법입니다.' },
  'leaf-dqn-qnetwork': { type: 'leaf', category: 'rl', subcategory: 'value-based', ids: ['q-network', 'dqn'],
    reason: '신경망으로 Q함수를 근사하는 기본 방식으로, 경험 재현과 타깃 네트워크로 학습을 안정화합니다.' },
  'leaf-double-dqn': { type: 'leaf', category: 'rl', subcategory: 'value-based', ids: ['double-dqn'],
    reason: '행동 선택과 가치 평가를 분리해 DQN의 Q값 과대추정 문제를 완화한 기법입니다.' },
  'leaf-dueling-dqn': { type: 'leaf', category: 'rl', subcategory: 'value-based', ids: ['dueling-dqn'],
    reason: '상태 가치와 행동별 이점을 분리된 두 갈래로 계산해 결합하는 신경망 구조 개선입니다.' },
  'leaf-drqn': { type: 'leaf', category: 'rl', subcategory: 'value-based', ids: ['drqn'],
    reason: 'RNN을 결합해 부분관측 환경에서 과거 기억을 활용하도록 만든 DQN 확장입니다.' },
  'leaf-distributional-dqn': { type: 'leaf', category: 'rl', subcategory: 'value-based', ids: ['c51', 'iqn'],
    reason: 'Q값을 단일 기댓값이 아니라 반환값의 확률분포로 학습해 불확실성을 표현하는 기법입니다.' },
  'leaf-noisynet': { type: 'leaf', category: 'rl', subcategory: 'value-based', ids: ['noisynet'],
    reason: '신경망 가중치에 학습 가능한 노이즈를 추가해 탐색을 자동화하는 기법입니다.' },
  'leaf-per': { type: 'leaf', category: 'rl', subcategory: 'value-based', ids: ['per'],
    reason: 'TD 오차가 큰 경험을 더 자주 재현해 학습 효율을 높이는 경험 재현 기법입니다.' },
  'leaf-her': { type: 'leaf', category: 'rl', subcategory: 'value-based', ids: ['her'],
    reason: '실패한 시도도 도달한 상태를 목표로 재해석해 희소 보상 문제를 완화하는 기법입니다.' },
  'leaf-rainbow': { type: 'leaf', category: 'rl', subcategory: 'value-based', ids: ['rainbow'],
    reason: 'Double DQN·Dueling·PER·C51·NoisyNet·다단계 학습을 하나로 통합한 종합 DQN입니다.' },
  'leaf-sql': { type: 'leaf', category: 'rl', subcategory: 'value-based', ids: ['sql-soft-q-learning'],
    reason: '보상에 엔트로피 항을 더해 다양한 행동을 유지하며 학습하는 최대 엔트로피 기법입니다.' },

  /* ── 앙상블 리프 ── */
  'leaf-adaboost': { type: 'leaf', category: 'ensemble', subcategory: 'boosting', ids: ['adaboost'],
    reason: '이전 모델이 틀린 샘플의 가중치를 높여가며 약한 학습기를 순차 결합하는 최초의 부스팅입니다.' },
  'leaf-gbm': { type: 'leaf', category: 'ensemble', subcategory: 'boosting', ids: ['gbm'],
    reason: '이전 모델이 만든 손실의 기울기(잔차)를 다음 트리가 학습하도록 순차 결합하는 고전적 부스팅입니다.' },
  'leaf-catboost': { type: 'leaf', category: 'ensemble', subcategory: 'boosting', ids: ['catboost'],
    reason: '범주형 변수를 자동 처리하고 순서형 부스팅으로 타깃 누수를 방지한 그래디언트 부스팅입니다.' },
  'leaf-lightgbm': { type: 'leaf', category: 'ensemble', subcategory: 'boosting', ids: ['lightgbm'],
    reason: '리프 중심 성장과 히스토그램 분할로 대용량 데이터를 빠르게 학습하는 부스팅입니다.' },
  'leaf-xgboost': { type: 'leaf', category: 'ensemble', subcategory: 'boosting', ids: ['xgboost'],
    reason: '2차 근사와 정규화, 병렬화로 그래디언트 부스팅을 고도화한 사실상 표준 라이브러리입니다.' },
  'leaf-blending': { type: 'leaf', category: 'ensemble', subcategory: 'stacking', ids: ['blending'],
    reason: '홀드아웃 집합으로 메타모델을 학습시키는 스태킹의 단순화 버전입니다.' },
  'leaf-stacking': { type: 'leaf', category: 'ensemble', subcategory: 'stacking', ids: ['stacking'],
    reason: '여러 기저 모델의 예측을 입력으로 받는 메타모델을 교차검증으로 학습시키는 기법입니다.' },
  'leaf-random-forest': { type: 'leaf', category: 'ensemble', subcategory: 'bagging', ids: ['random-forest'],
    reason: '부트스트랩 샘플과 무작위 특징 선택으로 여러 결정트리를 결합하는 대표적 배깅 앙상블입니다.' },
  'leaf-extra-trees': { type: 'leaf', category: 'ensemble', subcategory: 'bagging', ids: ['extra-trees'],
    reason: '분할 임계값까지 무작위로 골라 랜덤 포레스트보다 빠르게 학습하는 트리 앙상블입니다.' },
  'leaf-bagging': { type: 'leaf', category: 'ensemble', subcategory: 'bagging', ids: ['bagging'],
    reason: '복원추출로 만든 여러 부분표본에 같은 모델을 학습시켜 결합하는 분산 감소 앙상블입니다.' },
  'leaf-pasting': { type: 'leaf', category: 'ensemble', subcategory: 'bagging', ids: ['pasting'],
    reason: '복원 없이 무작위로 부분표본을 추출해 각 모델에 학습시키는 배깅의 변형입니다.' },
  'leaf-random-subspace-method': { type: 'leaf', category: 'ensemble', subcategory: 'bagging', ids: ['random-subspace-method'],
    reason: '데이터가 아닌 특징을 무작위로 샘플링해 모델 간 다양성을 확보하는 기법입니다.' },
  'leaf-hard-voting': { type: 'leaf', category: 'ensemble', subcategory: 'voting', ids: ['hard-voting'],
    reason: '여러 분류기의 최종 예측 클래스를 다수결로 결합하는 가장 단순한 앙상블입니다.' },
  'leaf-soft-voting': { type: 'leaf', category: 'ensemble', subcategory: 'voting', ids: ['soft-voting'],
    reason: '여러 분류기의 예측 확률을 평균해 결합하는 앙상블입니다.' },

  /* ══════ 지도학습 평가지표(sup/evaluation, 29개) ══════ */
  supeval1: { type: 'question', text: '회귀 문제의 평가지표를 찾으시나요? (아니면 분류)', yes: 'supeval2', no: 'supeval5' },

  supeval2: { type: 'question', text: '오차의 절대적인 크기(원래 단위)를 그대로 측정하는 지표를 찾으시나요? (비율이나 설명력이 아니라)', yes: 'supeval3', no: 'leaf-reg-ratio' },
  supeval3: { type: 'question', text: '오차를 제곱해서 계산하는 지표인가요? (절댓값이 아니라)', yes: 'supeval4', no: 'leaf-reg-absolute' },
  supeval4: { type: 'question', text: '큰 값의 영향을 줄이기 위해 로그를 취한 뒤 오차를 계산하나요?', yes: 'leaf-reg-log-squared', no: 'leaf-reg-squared' },

  supeval5: { type: 'question', text: '단일 수치로 요약되는 기본 분류 성능 지표를 찾으시나요? (아니면 곡선·시각화 도구)', yes: 'supeval6', no: 'supeval9' },
  supeval6: { type: 'question', text: '전체 데이터에 대한 전반적인 정확도(맞고 틀림)를 보는 지표인가요? (아니면 정밀도·재현율 계열)', yes: 'supeval7', no: 'supeval8' },
  supeval7: { type: 'question', text: '행과 열로 클래스별 예측·실제 건수를 표로 나타내는 지표인가요? (단일 수치가 아니라)', yes: 'leaf-confusion-matrix', no: 'leaf-accuracy-error' },
  supeval8: { type: 'question', text: 'ROC 곡선의 축(민감도·특이도)과 직접 관련된 지표인가요? (정밀도·재현율·F1이 아니라)', yes: 'leaf-roc-family', no: 'leaf-precision-recall-f1' },

  supeval9: { type: 'question', text: '변수(특성)가 예측에 미치는 영향을 해석하기 위한 시각화 도구를 찾으시나요? (아니면 성능평가용 곡선/플롯)', yes: 'supeval10', no: 'supeval11' },
  supeval10: { type: 'question', text: 'SHAP 값을 기반으로 기여도를 보여주는 도구인가요? (아니면 부분의존도·특성중요도)', yes: 'leaf-shap', no: 'leaf-feature-effect-plots' },
  supeval11: { type: 'question', text: 'ROC/PR 곡선이나 혼동행렬을 시각적으로 표현한 도구인가요?', yes: 'leaf-perf-curve-viz', no: 'supeval12' },
  supeval12: { type: 'question', text: '학습 데이터 양이나 학습 진행에 따른 성능 변화를 보여주는 도구인가요?', yes: 'leaf-learning-curve', no: 'supeval13' },
  supeval13: { type: 'question', text: '예측 확률이 실제 빈도와 얼마나 일치하는지(보정 정도)를 확인하는 도구인가요?', yes: 'leaf-calibration', no: 'leaf-boundary-residual' },

  'leaf-reg-ratio': { type: 'leaf', category: 'sup', subcategory: 'evaluation', ids: ['mape', 'mpe', 'r2-score'],
    reason: '오차의 비율이나 설명된 분산 비율로 회귀 성능을 나타내는 지표입니다.' },
  'leaf-reg-absolute': { type: 'leaf', category: 'sup', subcategory: 'evaluation', ids: ['mae', 'mase', 'me-metric'],
    reason: '절댓값 오차를 기반으로 평균 오차 크기(또는 편향)를 재는 지표입니다.' },
  'leaf-reg-squared': { type: 'leaf', category: 'sup', subcategory: 'evaluation', ids: ['mse-sup', 'rmse'],
    reason: '오차를 제곱해 평균을 낸 뒤 필요시 제곱근을 취하는 대표적인 회귀 오차 지표입니다.' },
  'leaf-reg-log-squared': { type: 'leaf', category: 'sup', subcategory: 'evaluation', ids: ['msle', 'rmsle'],
    reason: '큰 값의 영향을 줄이기 위해 로그를 취한 뒤 제곱오차를 계산하는 지표입니다.' },
  'leaf-confusion-matrix': { type: 'leaf', category: 'sup', subcategory: 'evaluation', ids: ['confusion-matrix'],
    reason: '클래스별 예측과 실제값의 교차 빈도를 표로 나타내는 분류 평가의 기본 도구입니다.' },
  'leaf-accuracy-error': { type: 'leaf', category: 'sup', subcategory: 'evaluation', ids: ['accuracy', 'error-rate'],
    reason: '전체 샘플 중 맞거나 틀린 비율로 분류 성능을 요약하는 지표입니다.' },
  'leaf-roc-family': { type: 'leaf', category: 'sup', subcategory: 'evaluation', ids: ['roc-curve', 'auc-score', 'fallout', 'specificity'],
    reason: '민감도와 특이도(위양성률)의 관계로 분류 성능을 나타내는 ROC 관련 지표입니다.' },
  'leaf-precision-recall-f1': { type: 'leaf', category: 'sup', subcategory: 'evaluation', ids: ['precision', 'recall', 'f1-score-sup'],
    reason: '양성 예측의 정확성과 실제 양성 검출률의 균형을 재는 지표입니다.' },
  'leaf-shap': { type: 'leaf', category: 'sup', subcategory: 'evaluation', ids: ['shap-summary'],
    reason: '게임이론 기반 기여도로 각 변수가 예측에 미친 영향을 보여주는 해석 도구입니다.' },
  'leaf-feature-effect-plots': { type: 'leaf', category: 'sup', subcategory: 'evaluation', ids: ['feature-importance-plot', 'pdp-ice-plot'],
    reason: '특성별 중요도나 예측값에 미치는 평균적 영향을 시각화하는 도구입니다.' },
  'leaf-perf-curve-viz': { type: 'leaf', category: 'sup', subcategory: 'evaluation', ids: ['confusion-matrix-heatmap', 'roc-pr-curve'],
    reason: '혼동행렬이나 ROC/PR 곡선을 시각적으로 표현해 분류 성능을 한눈에 보여주는 도구입니다.' },
  'leaf-learning-curve': { type: 'leaf', category: 'sup', subcategory: 'evaluation', ids: ['learning-curve'],
    reason: '학습 데이터 양이나 학습 진행에 따른 훈련·검증 성능 변화를 보여주는 도구입니다.' },
  'leaf-calibration': { type: 'leaf', category: 'sup', subcategory: 'evaluation', ids: ['calibration-curve'],
    reason: '예측 확률이 실제 발생 빈도와 얼마나 일치하는지 보여주는 보정 곡선입니다.' },
  'leaf-boundary-residual': { type: 'leaf', category: 'sup', subcategory: 'evaluation', ids: ['decision-boundary-plot', 'residual-plot'],
    reason: '결정경계나 잔차 분포를 시각화해 모델의 오류 패턴을 진단하는 도구입니다.' },

  /* ══════ 비지도학습 평가지표(unsup/evaluation, 75개) ══════ */
  unsupeval1: { type: 'question', text: '군집화 결과의 품질(응집도·분리도)을 평가하는 지표를 찾으시나요?', yes: 'unsupeval6', no: 'unsupeval2' },
  unsupeval2: { type: 'question', text: '연관규칙(장바구니 분석 등)의 강도를 평가하는 지표를 찾으시나요?', yes: 'unsupeval11', no: 'unsupeval3' },
  unsupeval3: { type: 'question', text: '차원축소나 임베딩 결과가 원래 데이터 구조를 얼마나 잘 보존하는지 평가하는 지표를 찾으시나요?', yes: 'unsupeval21', no: 'unsupeval4' },
  unsupeval4: { type: 'question', text: '이상치 탐지 모델의 탐지 성능(정답 라벨 기준)을 평가하는 지표를 찾으시나요?', yes: 'unsupeval27', no: 'unsupeval5' },
  unsupeval5: { type: 'question', text: '생성모델(GAN·VAE·확산모델 등)이 만든 데이터의 품질을 평가하는 지표를 찾으시나요?', yes: 'unsupeval29', no: 'unsupeval33' },

  unsupeval6: { type: 'question', text: '최적의 군집 개수(k)를 정하기 위한 지표인가요? (이미 정해진 군집 결과의 품질을 재는 게 아니라)', yes: 'leaf-cluster-count', no: 'unsupeval7' },
  unsupeval7: { type: 'question', text: 'DBSCAN처럼 밀도 기반 군집화에서 잡음(어느 군집에도 속하지 않는 점)으로 분류된 비율을 보는 지표인가요?', yes: 'leaf-dbscan-noise', no: 'unsupeval8' },
  unsupeval8: { type: 'question', text: '군집 내부의 응집도와 군집 간 분리도를 함께 반영하는 지표인가요? (단순 이웃 연결성만 보는 게 아니라)', yes: 'unsupeval9', no: 'leaf-connectivity' },
  unsupeval9: { type: 'question', text: '값이 클수록 군집화 품질이 좋다고 해석하는 지표인가요? (작을수록 좋은 지표가 아니라)', yes: 'unsupeval10', no: 'leaf-db-xie-beni' },
  unsupeval10: { type: 'question', text: '데이터 포인트 하나하나의 응집도-분리도 차이를 개별 계산해 평균 내는 지표인가요? (전체 분산비를 한 번에 계산하는 게 아니라)', yes: 'leaf-silhouette', no: 'leaf-chi-dunn' },

  unsupeval11: { type: 'question', text: '지지도·신뢰도·향상도처럼 확률의 단순 비율로 계산하는 기본 지표를 찾으시나요?', yes: 'unsupeval13', no: 'unsupeval12' },
  unsupeval12: { type: 'question', text: '통계적 유의성 검정이나 정보이론 개념(카이제곱·정보이득 등)에 기반한 지표인가요?', yes: 'unsupeval16', no: 'unsupeval18' },
  unsupeval13: { type: 'question', text: '항목 집합이 함께 나타날 확률 자체를 그대로 보는 가장 기본적인 지표인가요? (지지도·신뢰도)', yes: 'leaf-support-confidence', no: 'unsupeval14' },
  unsupeval14: { type: 'question', text: '두 항목이 서로 독립일 때와 실제 관측값의 차이를 비율이 아니라 차값으로 보는 지표인가요?', yes: 'leaf-leverage', no: 'unsupeval15' },
  unsupeval15: { type: 'question', text: '규칙이 틀렸을 때(반례)의 기대빈도를 기준으로 계산하는 지표인가요? (향상도가 아니라)', yes: 'leaf-conviction', no: 'leaf-lift' },
  unsupeval16: { type: 'question', text: '카이제곱 검정처럼 두 항목의 통계적 독립성 자체를 검정하는 지표인가요?', yes: 'leaf-chi-square-assoc', no: 'unsupeval17' },
  unsupeval17: { type: 'question', text: '엔트로피 감소량(정보이론)으로 규칙의 유용성을 재는 지표인가요?', yes: 'leaf-information-gain', no: 'leaf-collective-cf-ps' },
  unsupeval18: { type: 'question', text: '2x2 분할표의 상관관계(오즈비 기반)로 계산하는 지표인가요?', yes: 'unsupeval20', no: 'unsupeval19' },
  unsupeval19: { type: 'question', text: '두 항목 집합 간 대칭적 유사도를 0~1 사이 비율로 나타내는 지표인가요? (자카드·올컨피던스·쿨친스키 계열)', yes: 'leaf-symmetric-similarity', no: 'leaf-zhangs' },
  unsupeval20: { type: 'question', text: '오즈비를 -1~1 범위로 정규화한 지표(율의 Q·Y)인가요?', yes: 'leaf-yules', no: 'leaf-phi-odds' },

  unsupeval21: { type: 'question', text: '주성분이 설명하는 분산의 비율(스크리 플롯 포함)을 보는 지표인가요?', yes: 'leaf-variance-explained', no: 'unsupeval22' },
  unsupeval22: { type: 'question', text: '원본 공간과 축소된 공간에서 이웃(지역 구조)이 얼마나 잘 보존되는지를 보는 지표인가요?', yes: 'unsupeval23', no: 'unsupeval24' },
  unsupeval23: { type: 'question', text: '이웃 관계가 한쪽 방향(원본→축소 또는 축소→원본)으로만 깨지는지를 구분해서 보는 지표 쌍인가요?', yes: 'leaf-trust-continuity', no: 'leaf-neighborhood-lcmc' },
  unsupeval24: { type: 'question', text: '데이터 포인트 간 거리(전역 구조)를 원본과 축소공간에서 비교하는 지표인가요? (지역 이웃 관계가 아니라)', yes: 'unsupeval25', no: 'leaf-reconstruction-mi' },
  unsupeval25: { type: 'question', text: '두 배치(형태)를 회전·이동·크기조정으로 정렬한 뒤 남는 차이를 재는 지표인가요?', yes: 'leaf-procrustes', no: 'unsupeval26' },
  unsupeval26: { type: 'question', text: '가까운 거리에 더 큰 가중치를 주어 오차를 계산하는 지표인가요? (샘먼 오차)', yes: 'leaf-sammon', no: 'leaf-stress-rho' },

  unsupeval27: { type: 'question', text: 'ROC나 PR 곡선처럼 여러 임계값에 걸친 성능을 곡선이나 곡선아래 면적으로 나타내는 지표인가요?', yes: 'leaf-curve-based-anomaly', no: 'unsupeval28' },
  unsupeval28: { type: 'question', text: '고립 포레스트(Isolation Forest)에서 샘플이 격리되기까지의 경로 길이나 그 기반 점수를 직접 보는 지표인가요?', yes: 'leaf-isolation-metrics', no: 'leaf-f1-mcc' },

  unsupeval29: { type: 'question', text: '생성된 이미지의 화질이나 원본과의 지각적·화소 유사도를 재는 지표인가요? (FID·PSNR·SSIM 등)', yes: 'unsupeval30', no: 'unsupeval31' },
  unsupeval30: { type: 'question', text: '사람의 지각과 유사하게 학습된 신경망 특징으로 유사도를 비교하는 지표인가요? (화소·통계 기반이 아니라)', yes: 'leaf-perceptual-similarity', no: 'leaf-pixel-similarity' },
  unsupeval31: { type: 'question', text: '학습된 표현(임베딩)을 다운스트림 분류에 사용했을 때의 정확도로 품질을 재는 지표인가요?', yes: 'leaf-representation-quality', no: 'unsupeval32' },
  unsupeval32: { type: 'question', text: '데이터의 로그우도(또는 그 하한·근사치)로 확률모델의 적합도를 재는 지표인가요?', yes: 'leaf-likelihood-based-generative', no: 'leaf-diversity-distribution' },

  unsupeval33: { type: 'question', text: '두 분포(또는 표본과 이론분포)가 통계적으로 같다고 볼 수 있는지 검정하는 지표인가요? (콜모고로프-스미르노프·앤더슨-달링 등)', yes: 'leaf-goodness-of-fit-test', no: 'unsupeval34' },
  unsupeval34: { type: 'question', text: '모델의 우도(가능도)나 이를 기반으로 한 정보기준으로 적합도를 재는 지표인가요?', yes: 'leaf-likelihood-criteria', no: 'unsupeval35' },
  unsupeval35: { type: 'question', text: '추정된 밀도함수와 실제 밀도함수 사이의 적분 제곱오차를 재는 지표인가요?', yes: 'leaf-density-integrated-error', no: 'unsupeval36' },
  unsupeval36: { type: 'question', text: '공분산 행렬이나 그 역행렬 추정치의 오차·안정성을 재는 지표인가요? (프로베니우스·스펙트럴 노름, 조건수 등)', yes: 'leaf-matrix-estimation-error', no: 'leaf-divergence-cv' },

  'leaf-cluster-count': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['elbow-method', 'gap-statistic', 'wcss'],
    reason: '군집 개수(k)를 정하기 위해 군집 내 응집도 변화나 기준분포 대비 통계량을 활용하는 방법입니다.' },
  'leaf-dbscan-noise': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['dbscan-noise-ratio'],
    reason: '밀도 기반 군집화에서 어느 군집에도 속하지 못한 잡음점의 비율을 보는 지표입니다.' },
  'leaf-connectivity': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['connectivity'],
    reason: '가장 가까운 이웃이 같은 군집에 속하는 정도로 군집화의 지역적 일관성을 재는 지표입니다.' },
  'leaf-db-xie-beni': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['davies-bouldin-index', 'xie-beni-index'],
    reason: '군집 내 분산과 군집 간 거리의 비율로 값이 작을수록 좋은 군집화 품질 지표입니다.' },
  'leaf-silhouette': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['silhouette-coefficient'],
    reason: '각 데이터가 자기 군집과 가장 가까운 다른 군집에 얼마나 더 가까운지를 개별 계산해 평균 내는 지표입니다.' },
  'leaf-chi-dunn': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['calinski-harabasz-index', 'dunn-index'],
    reason: '군집 간 분산과 군집 내 분산의 비율(또는 최소·최대 거리 비율)로 값이 클수록 좋은 지표입니다.' },

  'leaf-support-confidence': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['support', 'confidence'],
    reason: '항목집합이 함께 나타날 확률과 조건부 발생확률을 그대로 보는 연관규칙의 기본 지표입니다.' },
  'leaf-leverage': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['leverage'],
    reason: '두 항목이 독립이라고 가정했을 때와 실제 관측값의 차이를 절대적인 차값으로 재는 지표입니다.' },
  'leaf-conviction': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['conviction'],
    reason: '규칙이 틀렸을 경우의 기대빈도를 기준으로 규칙의 신뢰도를 재는 지표입니다.' },
  'leaf-lift': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['lift'],
    reason: '두 항목이 독립일 때보다 얼마나 더 자주 함께 나타나는지를 비율로 재는 지표입니다.' },
  'leaf-chi-square-assoc': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['chi-square-test-assoc'],
    reason: '두 항목의 발생이 통계적으로 독립인지를 검정하는 카이제곱 기반 지표입니다.' },
  'leaf-information-gain': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['information-gain-assoc'],
    reason: '규칙 적용 전후 엔트로피 감소량으로 정보이론적 유용성을 재는 지표입니다.' },
  'leaf-collective-cf-ps': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['piatetsky-shapiro', 'collective-strength', 'certainty-factor'],
    reason: '관측빈도와 기대빈도의 편차, 규칙의 확신 정도를 종합적으로 재는 통계 기반 지표입니다.' },
  'leaf-symmetric-similarity': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['jaccard-coefficient', 'kulczynski-measure', 'all-confidence'],
    reason: '두 항목집합이 함께 나타나는 정도를 방향성 없이 대칭적인 비율로 재는 지표입니다.' },
  'leaf-zhangs': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['zhangs-metric'],
    reason: '향상도와 신뢰도의 장점을 결합해 -1~1 범위로 정규화한 대칭적 연관성 지표입니다.' },
  'leaf-yules': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['yules-q', 'yules-y'],
    reason: '2x2 분할표의 오즈비를 -1~1 범위로 정규화한 연관성 지표입니다.' },
  'leaf-phi-odds': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['phi-coefficient', 'odds-ratio'],
    reason: '2x2 분할표에서 두 항목 간 상관관계의 강도와 방향을 재는 지표입니다.' },

  'leaf-variance-explained': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['cumulative-explained-variance', 'explained-variance-ratio', 'scree-plot'],
    reason: '주성분(축)이 전체 분산 중 얼마를 설명하는지를 비율이나 누적값·그래프로 보여주는 지표입니다.' },
  'leaf-trust-continuity': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['trustworthiness', 'continuity'],
    reason: '축소된 공간과 원본 공간 사이에서 이웃 관계가 한쪽 방향으로만 깨지는 정도를 각각 재는 지표 쌍입니다.' },
  'leaf-neighborhood-lcmc': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['neighborhood-preservation', 'lcmc'],
    reason: '원본과 축소된 공간에서 같은 이웃이 얼마나 유지되는지를 지역적으로 재는 지표입니다.' },
  'leaf-reconstruction-mi': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['reconstruction-error', 'mutual-information'],
    reason: '축소된 표현으로부터 원본을 복원했을 때의 오차나 원본과 공유하는 정보량을 재는 지표입니다.' },
  'leaf-procrustes': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['procrustes-analysis'],
    reason: '두 형태를 회전·이동·크기조정으로 최적 정렬한 뒤 남는 차이를 재는 지표입니다.' },
  'leaf-sammon': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['sammon-error'],
    reason: '가까운 점들의 거리 보존에 더 큰 가중치를 두어 계산하는 임베딩 오차 지표입니다.' },
  'leaf-stress-rho': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['mds-stress', 'spearman-rho'],
    reason: '원본과 축소된 공간의 거리(또는 순위) 사이의 불일치 정도를 재는 다차원척도법 지표입니다.' },

  'leaf-curve-based-anomaly': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['roc-auc', 'pr-curve', 'average-precision'],
    reason: '여러 임계값에 걸친 이상치 탐지 성능을 곡선이나 곡선 아래 면적으로 종합하는 지표입니다.' },
  'leaf-isolation-metrics': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['average-path-length', 'isolation-score'],
    reason: '고립 포레스트에서 샘플이 격리되기까지의 평균 경로 길이를 바탕으로 이상치 정도를 재는 지표입니다.' },
  'leaf-f1-mcc': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['f1-score', 'mcc'],
    reason: '정답 라벨 기준으로 이상치 탐지의 정밀도·재현율 균형이나 전반적 상관관계를 재는 지표입니다.' },

  'leaf-perceptual-similarity': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['lpips', 'fid', 'kid'],
    reason: '학습된 신경망 특징 공간에서 생성 데이터와 실제 데이터의 분포·지각적 유사도를 재는 지표입니다.' },
  'leaf-pixel-similarity': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['psnr', 'ssim'],
    reason: '화소값이나 구조적 통계를 직접 비교해 이미지 품질을 재는 전통적인 지표입니다.' },
  'leaf-representation-quality': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['knn-classification-accuracy', 'linear-probe-accuracy'],
    reason: '학습된 표현(임베딩)을 다운스트림 분류에 사용했을 때의 정확도로 표현학습 품질을 재는 지표입니다.' },
  'leaf-likelihood-based-generative': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['elbo', 'perplexity', 'reconstruction-loss'],
    reason: '확률모델이 데이터를 얼마나 잘 설명하는지를 로그우도의 하한이나 근사치로 재는 지표입니다.' },
  'leaf-diversity-distribution': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['inception-score', 'mode-score', 'precision-recall-distributions', 'coverage'],
    reason: '생성된 데이터의 다양성과 실제 데이터 분포와의 일치 정도를 재는 지표입니다.' },

  'leaf-goodness-of-fit-test': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['ks-test', 'anderson-darling-test'],
    reason: '표본이 특정 이론분포를 따르는지를 통계적으로 검정하는 적합도 검정 지표입니다.' },
  'leaf-likelihood-criteria': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['log-likelihood', 'aic-bic', 'likelihood-based-score'],
    reason: '모델의 우도와 이를 기반으로 모델 복잡도까지 함께 고려하는 정보기준 지표입니다.' },
  'leaf-density-integrated-error': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['ise', 'mise'],
    reason: '추정된 밀도함수와 실제 밀도함수 사이의 차이를 적분 제곱오차로 재는 지표입니다.' },
  'leaf-matrix-estimation-error': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['frobenius-norm-error', 'spectral-norm-error', 'condition-number', 'mse'],
    reason: '추정된 공분산(또는 행렬)이 실제 값과 얼마나 차이나고 수치적으로 얼마나 안정적인지를 재는 지표입니다.' },
  'leaf-divergence-cv': { type: 'leaf', category: 'unsup', subcategory: 'evaluation', ids: ['kl-divergence', 'cross-validation-score'],
    reason: '두 확률분포 사이의 차이나 교차검증을 통한 일반화 성능으로 모델 적합도를 재는 지표입니다.' },

  /* ══════ 비지도학습 - 군집화 (unsup/clustering, 66개) ══════ */
  clu1: { type: 'question', text: '노드와 엣지로 연결된 그래프/네트워크 구조를 기반으로 군집을 찾나요?', yes: 'clu_f1', no: 'clu2' },
  clu2: { type: 'question', text: '데이터 행(샘플)과 열(특징)을 동시에 군집화하는 이중군집화(바이클러스터링)인가요?', yes: 'clu_i1', no: 'clu3' },
  clu3: { type: 'question', text: '공간을 격자(그리드) 셀로 나누고 셀 단위 통계로 군집을 찾나요?', yes: 'clu_d1', no: 'clu4' },
  clu4: { type: 'question', text: '점들의 밀도 차이로 임의 모양의 군집과 잡음을 구분하나요?', yes: 'clu_c1', no: 'clu5' },
  clu5: { type: 'question', text: '전체 차원이 아니라 일부 부분공간(특징 조합)에서만 유효한 군집을 찾나요?', yes: 'clu_sub1', no: 'clu6' },
  clu_sub1: { type: 'question', text: '군집을 원본 특징이 아니라 저계수 또는 희소 표현 계수로 나타내나요?', yes: 'clu_h1', no: 'clu_g1' },
  clu6: { type: 'question', text: '병합(상향식) 또는 분할(하향식)로 트리 형태의 계층 구조를 만드나요?', yes: 'clu_b1', no: 'clu7' },
  clu7: { type: 'question', text: '데이터가 특정 확률분포의 혼합이거나 점진적 개념 형성으로 표현된다고 가정하나요?', yes: 'clu_e1', no: 'clu_a1' },

  clu_f1: { type: 'question', text: '군집 개수를 미리 정하지 않고, 노드 간 메시지(책임도·가용도)를 주고받아 대표점을 스스로 찾나요?', yes: 'leaf-affinity-propagation', no: 'clu_f2' },
  clu_f2: { type: 'question', text: '그래프 라플라시안의 고유벡터(스펙트럼)를 이용해 컷을 최적화하나요?', yes: 'leaf-spectral-clustering-variants', no: 'leaf-community-detection' },

  clu_i1: { type: 'question', text: '특이값 분해 등 스펙트럴 방법으로 행과 열을 동시에 분해해 바이클러스터를 찾나요?', yes: 'leaf-spectral-cobiclustering', no: 'clu_i2' },
  clu_i2: { type: 'question', text: '이진(0/1) 데이터에서 완전히 균일한 1-블록 부분행렬을 조합적으로 탐색하나요?', yes: 'leaf-bimax', no: 'clu_i3' },
  clu_i3: { type: 'question', text: '행과 열의 값 순위(순서)가 일관되게 유지되는 부분행렬을 찾나요?', yes: 'leaf-opsm', no: 'clu_i4' },
  clu_i4: { type: 'question', text: '평균제곱잔차나 반복적 서명 정제 같은 지역 탐색으로 바이클러스터를 반복 개선하나요?', yes: 'leaf-residue-signature-biclustering', no: 'leaf-statistical-model-biclustering' },

  clu_d1: { type: 'question', text: '웨이블릿 변환으로 다중 해상도의 밀도 신호를 분석해 군집 경계를 찾나요?', yes: 'leaf-wavecluster', no: 'clu_d2' },
  clu_d2: { type: 'question', text: '계층적 격자 셀에 통계 정보(평균·분산)를 저장해 상위 셀부터 하향식으로 탐색하나요?', yes: 'leaf-sting', no: 'clu_d3' },
  clu_d3: { type: 'question', text: '밀도 함수의 국소 극값(계곡)을 기준으로 격자를 최적 분할하나요?', yes: 'leaf-optigrid', no: 'clu_d4' },
  clu_d4: { type: 'question', text: '고정폭이 아니라 데이터에 맞춰 적응적으로 조정되는 유한 구간을 병합하나요?', yes: 'leaf-mafia', no: 'clu_d5' },
  clu_d5: { type: 'question', text: '부분공간별로 조밀한 격자 단위(dense unit)들을 결합해 군집을 구성하나요?', yes: 'leaf-clique', no: 'leaf-gridclus' },

  clu_c1: { type: 'question', text: '표준 DBSCAN을 시공간·가변밀도·적응형 임계값 등으로 확장한 변형인가요?', yes: 'leaf-dbscan-variants', no: 'clu_c2' },
  clu_c2: { type: 'question', text: '고정된 반경(eps) 하나 대신, 도달가능거리 순서나 계층 구조로 다양한 밀도의 군집을 함께 표현하나요?', yes: 'leaf-hierarchical-density-clustering', no: 'clu_c3' },
  clu_c3: { type: 'question', text: '커널 밀도함수의 기울기를 따라 점들을 밀도가 높은 최빈값(모드)으로 이동시키나요?', yes: 'leaf-mode-seeking-clustering', no: 'leaf-density-peaks-clustering' },

  clu_h1: { type: 'question', text: '계수 행렬의 희소성보다 저계수(낮은 랭크, 핵노름)를 규제해 부분공간을 표현하나요?', yes: 'leaf-lrr', no: 'clu_h2' },
  clu_h2: { type: 'question', text: '희소성 규제(L1)에 추가로 L2 항을 결합한 엘라스틱넷 방식인가요?', yes: 'leaf-ensc', no: 'leaf-ssc' },

  clu_g1: { type: 'question', text: '군집 개수(k)를 미리 지정하고 대표점을 기준으로 상위에서 하위로 부분공간을 좁혀가나요?', yes: 'clu_g2', no: 'clu_g3' },
  clu_g2: { type: 'question', text: '축에 평행한 부분공간뿐 아니라 임의 방향으로 회전된 부분공간도 허용하나요?', yes: 'leaf-orclus', no: 'leaf-proclus' },
  clu_g3: { type: 'question', text: 'DBSCAN처럼 밀도로 연결된 이웃을 상향식으로 확장해 부분공간 군집을 찾나요?', yes: 'clu_g4', no: 'leaf-fires-p3c' },
  clu_g4: { type: 'question', text: '차원마다 분산에 따라 다른 가중치(선호도)를 부여해 밀도 연결성을 계산하나요?', yes: 'leaf-predecon', no: 'leaf-subclu' },

  clu_b1: { type: 'question', text: '데이터가 매우 커서 요약 통계(클러스터링 특징 트리)나 대표점 샘플링으로 확장성을 높였나요?', yes: 'leaf-birch-cure', no: 'clu_b2' },
  clu_b2: { type: 'question', text: '그래프의 공유 이웃 수(링크)나 상호연결성·근접성을 함께 고려해 병합하나요?', yes: 'leaf-rock-chameleon', no: 'clu_b3' },
  clu_b3: { type: 'question', text: '두 군집을 병합할지 여부를 베이지안 확률(모델 증거)로 결정하나요?', yes: 'leaf-bayesian-hierarchical-clustering', no: 'clu_b4' },
  clu_b4: { type: 'question', text: 'AGNES/DIANA처럼 이름이 붙은 고전적인 병합식·분할식 구현 알고리즘인가요?', yes: 'leaf-agnes-diana', no: 'leaf-hierarchical-clustering-generic' },

  clu_e1: { type: 'question', text: '범주형 개념 트리를 점진적으로 갱신하며 학습하는 개념 형성 알고리즘인가요?', yes: 'leaf-cobweb-classit', no: 'clu_e2' },
  clu_e2: { type: 'question', text: '문서-단어 관계처럼 잠재 토픽(주제) 분포를 추정해 군집화하나요?', yes: 'leaf-lda-clustering', no: 'clu_e3' },
  clu_e3: { type: 'question', text: '구형 유클리드 거리 대신 방향(각도) 데이터에 특화된 혼합분포를 사용하나요?', yes: 'leaf-vmf-mixture', no: 'clu_e4' },
  clu_e4: { type: 'question', text: '베이지안 변분추론으로 군집 개수와 파라미터를 함께 자동 추정하나요?', yes: 'leaf-vbgm', no: 'leaf-gmm-em' },

  clu_a1: { type: 'question', text: '범주형 또는 범주형과 수치형이 혼합된 데이터를 위한 변형인가요?', yes: 'clu_a2', no: 'clu_a3' },
  clu_a2: { type: 'question', text: '수치형과 범주형 특징을 모두 함께 다루나요?', yes: 'leaf-kprototypes', no: 'leaf-kmodes' },
  clu_a3: { type: 'question', text: '각 점이 여러 군집에 걸쳐 소속 정도(멤버십)를 나눠 갖는 퍼지 방식인가요?', yes: 'clu_a4', no: 'clu_a5' },
  clu_a4: { type: 'question', text: '소속도의 합이 1로 정규화되지 않아 이상치의 영향을 덜 받는 가능론적 방식인가요?', yes: 'leaf-possibilistic-c-means', no: 'leaf-fuzzy-c-means' },
  clu_a5: { type: 'question', text: '군집 중심이 데이터의 평균점이 아니라 실제 데이터포인트(메도이드)여야 하나요?', yes: 'leaf-kmedoids-pam', no: 'clu_a6' },
  clu_a6: { type: 'question', text: '군집 개수(k)를 사용자가 정하지 않고 BIC 등 통계적 기준으로 자동 분할/병합하나요?', yes: 'leaf-x-means-g-means', no: 'clu_a7' },
  clu_a7: { type: 'question', text: '대용량 데이터를 위해 전체가 아니라 미니배치(부분표본) 단위로 반복 갱신하나요?', yes: 'leaf-minibatch-kmeans', no: 'clu_a8' },
  clu_a8: { type: 'question', text: '초기 중심을 무작위가 아니라 거리에 비례한 확률로 퍼뜨려 선택하는 개선판인가요?', yes: 'leaf-kmeans-plusplus', no: 'leaf-kmeans' },

  'leaf-affinity-propagation': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['affinity-propagation'],
    reason: '데이터 포인트 간 책임도와 가용도 메시지를 반복 교환해 대표 예시(exemplar)를 스스로 찾는 알고리즘입니다.' },
  'leaf-spectral-clustering-variants': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['spectral-clustering', 'ratio-cuts', 'shi-malik', 'ng-jordan-weiss'],
    reason: '그래프 라플라시안의 고유벡터로 데이터를 저차원에 임베딩한 뒤 컷을 최소화해 군집을 나누는 스펙트럴 클러스터링 계열 알고리즘입니다.' },
  'leaf-community-detection': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['louvain-leiden', 'mcl', 'girvan-newman', 'infomap'],
    reason: '모듈성 최적화, 랜덤워크 흐름, 매개 중심성 등 그래프의 연결 구조를 이용해 커뮤니티를 탐지하는 알고리즘입니다.' },

  'leaf-spectral-cobiclustering': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['spectral-coclustering', 'spectral-biclustering'],
    reason: '데이터 행렬을 특이값 분해해 행과 열을 동시에 그룹화하는 스펙트럴 기반 이중군집화 알고리즘입니다.' },
  'leaf-bimax': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['bimax'],
    reason: '이진 행렬에서 완전히 1로 채워진 극대 부분행렬을 조합적으로 열거하는 이중군집화 알고리즘입니다.' },
  'leaf-opsm': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['opsm'],
    reason: '조건에 따라 유전자 발현 순위가 일관되게 유지되는 순서 보존 부분행렬을 찾는 알고리즘입니다.' },
  'leaf-residue-signature-biclustering': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['cheng-church', 'isa-biclustering'],
    reason: '평균제곱잔차나 행-열 서명을 반복적으로 정제하며 행과 열을 추가·제거해 수렴시키는 지역 탐색 기반 이중군집화 알고리즘입니다.' },
  'leaf-statistical-model-biclustering': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['plaid-model', 'xmotifs', 'fabia'],
    reason: '가법적 층 모델, 보존 모티프 통계량, 요인분석 등 확률·통계 모델로 바이클러스터를 표현하는 알고리즘입니다.' },

  'leaf-wavecluster': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['wavecluster'],
    reason: '특징 공간을 웨이블릿 변환해 다중 해상도에서 밀집 영역을 찾아내는 신호처리 기반 격자 클러스터링 알고리즘입니다.' },
  'leaf-sting': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['sting'],
    reason: '공간을 계층적 격자 셀로 나누고 각 셀의 통계 정보를 저장해 상위 셀에서 하위 셀로 하향식 탐색하는 알고리즘입니다.' },
  'leaf-optigrid': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['optigrid'],
    reason: '데이터 투영의 밀도 함수에서 국소 최솟값을 찾아 그 지점으로 격자를 최적 분할하는 알고리즘입니다.' },
  'leaf-mafia': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['mafia'],
    reason: '고정폭 격자 대신 적응적으로 조정되는 유한 구간을 병합해 CLIQUE보다 효율적으로 부분공간 군집을 찾는 알고리즘입니다.' },
  'leaf-clique': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['clique'],
    reason: '고차원 공간을 격자로 나누고 각 부분공간에서 조밀한 격자 단위를 결합해 군집을 찾는 부분공간 클러스터링 알고리즘입니다.' },
  'leaf-gridclus': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['gridclus'],
    reason: '데이터 공간을 블록 구조의 격자로 나눈 뒤 인접한 조밀 블록을 병합해 군집을 형성하는 알고리즘입니다.' },

  'leaf-dbscan-variants': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['dbscan', 'vdbscan', 'st-dbscan', 'adbscan'],
    reason: '밀도가 일정 기준 이상인 점들을 연결해 임의 모양의 군집과 잡음을 구분하는 DBSCAN 및 그 시공간·가변밀도·적응형 확장 알고리즘입니다.' },
  'leaf-hierarchical-density-clustering': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['hdbscan', 'optics'],
    reason: '반경을 하나로 고정하지 않고 도달가능거리나 계층 구조로 다양한 밀도의 군집을 동시에 표현하는 밀도 기반 알고리즘입니다.' },
  'leaf-mode-seeking-clustering': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['mean-shift', 'denclue'],
    reason: '커널 밀도 함수의 기울기(경사)를 따라 점들을 밀도가 가장 높은 최빈값(어트랙터)으로 이동시켜 군집을 찾는 알고리즘입니다.' },
  'leaf-density-peaks-clustering': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['density-peaks-clustering'],
    reason: '지역 밀도와 더 높은 밀도를 가진 최근접점까지의 거리를 함께 이용해 군집 중심(밀도 봉우리)을 찾는 알고리즘입니다.' },

  'leaf-lrr': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['lrr'],
    reason: '데이터 자기표현 계수 행렬의 핵노름(저계수성)을 최소화해 부분공간 구조를 복원하는 알고리즘입니다.' },
  'leaf-ensc': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['ensc'],
    reason: '희소성(L1)과 안정성(L2)을 함께 규제하는 엘라스틱넷 목적함수로 부분공간 자기표현 계수를 구하는 알고리즘입니다.' },
  'leaf-ssc': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['ssc'],
    reason: '각 점을 다른 점들의 희소한 선형결합으로 표현해 부분공간 소속 관계를 찾는 알고리즘입니다.' },

  'leaf-proclus': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['proclus'],
    reason: '메도이드를 반복적으로 개선하며 각 군집에 맞는 축 평행 부분공간을 상위에서 하위로 찾는 투영 클러스터링 알고리즘입니다.' },
  'leaf-orclus': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['orclus'],
    reason: 'PROCLUS를 확장해 축에 평행하지 않은 임의 방향의 부분공간에서도 군집을 찾는 투영 클러스터링 알고리즘입니다.' },
  'leaf-subclu': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['subclu'],
    reason: '모든 부분공간에서 DBSCAN의 밀도 연결성 개념을 적용해 상향식으로 부분공간 군집을 탐색하는 알고리즘입니다.' },
  'leaf-predecon': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['predecon'],
    reason: '차원별 분산에 따라 가중치를 다르게 주는 선호도 가중 거리로 밀도 연결성을 계산하는 부분공간 클러스터링 알고리즘입니다.' },
  'leaf-fires-p3c': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['fires', 'p3c'],
    reason: '필터-정제 휴리스틱이나 통계적 검정으로 후보 부분공간을 빠르게 좁혀 근사적으로 군집을 찾는 알고리즘입니다.' },

  'leaf-birch-cure': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['birch', 'cure'],
    reason: '클러스터링 특징 트리나 대표점 축소로 대용량 데이터를 한 번의 스캔으로 요약해 병합하는 확장성 높은 계층적 클러스터링 알고리즘입니다.' },
  'leaf-rock-chameleon': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['rock', 'chameleon'],
    reason: '점들 간 공유 이웃(링크) 수나 상호연결성·근접성을 함께 고려해 군집을 병합하는 그래프 기반 계층적 클러스터링 알고리즘입니다.' },
  'leaf-bayesian-hierarchical-clustering': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['bayesian-hierarchical-clustering'],
    reason: '두 군집을 병합했을 때의 모델 증거(우도)를 비교해 병합 여부를 베이지안 확률로 결정하는 알고리즘입니다.' },
  'leaf-agnes-diana': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['agnes', 'diana'],
    reason: '모든 점을 개별 군집에서 시작해 점진적으로 병합하거나(AGNES), 전체를 한 군집에서 시작해 점진적으로 분할하는(DIANA) 고전적 계층적 클러스터링 알고리즘입니다.' },
  'leaf-hierarchical-clustering-generic': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['hierarchical-clustering'],
    reason: '거리 행렬과 연결 기준(단일·완전·평균 연결법 등)을 이용해 병합적 또는 분할적으로 덴드로그램을 구성하는 일반적인 계층적 클러스터링 알고리즘입니다.' },

  'leaf-cobweb-classit': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['cobweb', 'classit'],
    reason: '새 데이터가 들어올 때마다 범주형(COBWEB) 또는 수치형(CLASSIT) 개념 계층 트리를 점진적으로 갱신하는 증분 개념 형성 알고리즘입니다.' },
  'leaf-lda-clustering': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['lda-clustering'],
    reason: '잠재 디리클레 할당으로 각 데이터의 잠재 토픽 분포를 추정해 군집화에 활용하는 알고리즘입니다.' },
  'leaf-vmf-mixture': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['vmf-mixture'],
    reason: '단위 구면 위 방향 데이터를 폰 미제스-피셔 분포의 혼합으로 모델링해 군집화하는 알고리즘입니다.' },
  'leaf-vbgm': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['vbgm'],
    reason: '변분 베이지안 추론으로 사전분포를 반영해 군집 개수를 자동으로 결정하는 가우시안 혼합 모델입니다.' },
  'leaf-gmm-em': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['gmm-em'],
    reason: '데이터가 여러 개의 가우시안 분포 혼합에서 생성되었다고 가정하고 EM 알고리즘으로 파라미터를 추정하는 알고리즘입니다.' },

  'leaf-kprototypes': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['kprototypes'],
    reason: '수치형 특징은 유클리드 거리로, 범주형 특징은 불일치 개수로 함께 계산해 혼합 데이터를 군집화하는 알고리즘입니다.' },
  'leaf-kmodes': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['kmodes'],
    reason: '평균 대신 최빈값을 군집 대표로 사용하고 불일치 개수를 거리로 삼아 범주형 데이터를 군집화하는 알고리즘입니다.' },
  'leaf-possibilistic-c-means': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['possibilistic-c-means'],
    reason: '소속도 합이 1로 정규화되지 않는 가능론적 소속함수를 사용해 이상치에 강건하게 군집화하는 퍼지 알고리즘입니다.' },
  'leaf-fuzzy-c-means': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['fuzzy-c-means'],
    reason: '각 점이 모든 군집에 대해 소속도(멤버십)를 확률처럼 나눠 갖도록 하는 대표적 퍼지 군집화 알고리즘입니다.' },
  'leaf-kmedoids-pam': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['kmedoids-pam'],
    reason: '군집 중심을 평균이 아니라 실제 데이터점(메도이드)으로 정해 이상치에 강건하게 군집화하는 PAM 알고리즘입니다.' },
  'leaf-x-means-g-means': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['x-means', 'g-means'],
    reason: 'BIC 점수나 가우시안성 검정을 이용해 군집을 반복적으로 분할하며 K값을 자동으로 결정하는 K-Means 확장 알고리즘입니다.' },
  'leaf-minibatch-kmeans': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['minibatch-kmeans'],
    reason: '전체 데이터 대신 무작위로 뽑은 작은 미니배치로 중심을 반복 갱신해 대용량 데이터를 빠르게 군집화하는 알고리즘입니다.' },
  'leaf-kmeans-plusplus': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['kmeans-plusplus'],
    reason: '초기 중심을 이전 중심과의 거리에 비례한 확률로 선택해 K-Means의 수렴 품질과 속도를 개선한 알고리즘입니다.' },
  'leaf-kmeans': { type: 'leaf', category: 'unsup', subcategory: 'clustering', ids: ['kmeans'],
    reason: '각 점을 가장 가까운 중심에 할당하고 중심을 갱신하는 과정을 반복해 군집을 형성하는 가장 기본적인 분할 기반 클러스터링 알고리즘입니다.' },

  /* ══════ 비지도학습 - 차원축소: 선형 / 비선형매니폴드 / 확률적 잠재변수 ══════ */
  dimred1: { type: 'question', text: '선형 변환으로 새 좌표축을 만들어 차원을 축소하나요? (아니면 비선형 매니폴드나 잠재변수 확률모델)', yes: 'dimred_lin1', no: 'dimred2' },
  dimred2: { type: 'question', text: '국소 이웃 구조나 곡면(매니폴드)을 보존하며 비선형으로 임베딩하나요? (아니면 잠재변수 확률모델)', yes: 'dimred_nl1', no: 'dimred_prob1' },
  dimred_prob1: { type: 'question', text: '문서·토픽처럼 잠재 의미 구조를 다루는 계열인가요? (아니면 서로 다른 데이터 뷰 간의 상관구조)', yes: 'leaf-latent-topic', no: 'leaf-multiview-cca' },

  dimred_lin1: { type: 'question', text: '분산을 최대로 보존하는 주성분(PCA) 축을 직접 찾나요?', yes: 'leaf-pca-family', no: 'dimred_lin2' },
  dimred_lin2: { type: 'question', text: '특이값 분해(SVD)를 직접 활용하는 계열인가요?', yes: 'leaf-svd-family', no: 'dimred_lin3' },
  dimred_lin3: { type: 'question', text: '사전(기저) 학습이나 비음수·희소 인수분해로 데이터를 표현하나요?', yes: 'leaf-dict-nmf-family', no: 'dimred_lin4' },
  dimred_lin4: { type: 'question', text: '통계적으로 독립적인 성분을 분리하는 ICA 계열인가요?', yes: 'leaf-ica-family', no: 'dimred_lin5' },
  dimred_lin5: { type: 'question', text: '무작위 투영 행렬로 차원을 줄이는 랜덤 프로젝션 계열인가요?', yes: 'leaf-random-projection-family', no: 'leaf-factor-analysis-family' },

  dimred_nl1: { type: 'question', text: '고차원 이웃 유사도 분포를 저차원에서 재현하는 t-SNE 계열인가요?', yes: 'leaf-tsne-family', no: 'dimred_nl2' },
  dimred_nl2: { type: 'question', text: '지역 구조와 전역 구조를 함께 보존하는 UMAP 계열(변형 포함)인가요?', yes: 'leaf-umap-family', no: 'dimred_nl3' },
  dimred_nl3: { type: 'question', text: '각 점을 이웃점의 선형 결합으로 재구성하는 지역선형임베딩(LLE) 계열인가요?', yes: 'leaf-lle-family', no: 'dimred_nl4' },
  dimred_nl4: { type: 'question', text: '측지 거리나 그래프 스펙트럼을 이용해 매니폴드를 펼치나요? (Isomap·라플라시안·확산맵 등)', yes: 'leaf-isomap-spectral-family', no: 'leaf-mds-family' },

  'leaf-pca-family': { type: 'leaf', category: 'unsup', subcategory: 'dim-reduction', ids: ['pca', 'incremental-pca', 'ppca', 'robust-pca', 'sparse-pca'],
    reason: '분산을 최대로 보존하는 직교 주성분 축으로 데이터를 선형 투영하는 PCA 계열 기법입니다.' },
  'leaf-svd-family': { type: 'leaf', category: 'unsup', subcategory: 'dim-reduction', ids: ['svd', 'truncated-svd', 'k-svd'],
    reason: '행렬을 특이값 분해하여 저차원 표현이나 희소 사전을 구성하는 SVD 계열 기법입니다.' },
  'leaf-dict-nmf-family': { type: 'leaf', category: 'unsup', subcategory: 'dim-reduction', ids: ['dictionary-learning', 'online-dictionary-learning', 'sparse-coding', 'nmf', 'sparse-nmf'],
    reason: '적은 수의 기저(사전) 원소의 선형 결합이나 비음수 인수분해로 데이터를 표현하는 사전학습·인수분해 계열 기법입니다.' },
  'leaf-ica-family': { type: 'leaf', category: 'unsup', subcategory: 'dim-reduction', ids: ['ica', 'fastica'],
    reason: '통계적으로 독립적인 원천 신호를 분리해내는 독립성분분석(ICA) 계열 기법입니다.' },
  'leaf-random-projection-family': { type: 'leaf', category: 'unsup', subcategory: 'dim-reduction', ids: ['random-projection', 'gaussian-random-projection', 'sparse-random-projection'],
    reason: '무작위 투영 행렬로 거리 구조를 근사적으로 보존하며 차원을 축소하는 랜덤 프로젝션 계열 기법입니다.' },
  'leaf-factor-analysis-family': { type: 'leaf', category: 'unsup', subcategory: 'dim-reduction', ids: ['factor-analysis', 'probabilistic-factor-analysis'],
    reason: '관측 변수 뒤에 숨은 소수의 잠재요인으로 공분산 구조를 설명하는 요인분석 계열 기법입니다.' },
  'leaf-tsne-family': { type: 'leaf', category: 'unsup', subcategory: 'dim-reduction', ids: ['tsne', 'barnes-hut-tsne', 'parametric-tsne'],
    reason: '고차원 이웃 간 유사도 분포를 저차원에서 재현하도록 임베딩하는 t-SNE 계열 기법입니다.' },
  'leaf-umap-family': { type: 'leaf', category: 'unsup', subcategory: 'dim-reduction', ids: ['umap', 'parametric-umap', 'pacmap', 'trimap'],
    reason: '지역 이웃 구조와 전역 구조를 함께 보존하며 저차원으로 투영하는 UMAP 계열 매니폴드 기법입니다.' },
  'leaf-lle-family': { type: 'leaf', category: 'unsup', subcategory: 'dim-reduction', ids: ['lle', 'mlle', 'hlle', 'ltsa'],
    reason: '각 점을 이웃점들의 선형 결합으로 재구성해 지역 선형성을 보존하는 LLE 계열 매니폴드 기법입니다.' },
  'leaf-isomap-spectral-family': { type: 'leaf', category: 'unsup', subcategory: 'dim-reduction', ids: ['isomap', 'landmark-isomap', 'laplacian-eigenmaps', 'diffusion-maps', 'kernel-pca'],
    reason: '그래프 상의 측지 거리나 스펙트럴 구조를 이용해 비선형 매니폴드를 저차원으로 펼치는 기법입니다.' },
  'leaf-mds-family': { type: 'leaf', category: 'unsup', subcategory: 'dim-reduction', ids: ['mds', 'metric-mds', 'non-metric-mds', 'landmark-mds'],
    reason: '원본 공간의 거리(또는 순위)를 저차원에서 최대한 보존하도록 배치하는 다차원척도법(MDS) 계열 기법입니다.' },
  'leaf-latent-topic': { type: 'leaf', category: 'unsup', subcategory: 'dim-reduction', ids: ['lsa', 'plsa', 'lda-topic-modeling', 'hdp'],
    reason: '문서-단어 행렬 이면의 잠재 의미나 토픽 분포를 추정하는 잠재변수 토픽모델링 계열 기법입니다.' },
  'leaf-multiview-cca': { type: 'leaf', category: 'unsup', subcategory: 'dim-reduction', ids: ['cca', 'multi-view-learning'],
    reason: '서로 다른 두 데이터 뷰 사이의 상관관계나 공유 구조를 학습하는 다중뷰 상관분석 기법입니다.' },

  /* ══════ 비지도학습 - 밀도/공분산: 밀도추정 vs 공분산추정 ══════ */
  denscov1: { type: 'question', text: '확률밀도 자체를 추정하나요? (아니면 공분산·상관구조 추정)', yes: 'denscov_dens1', no: 'denscov_cov1' },

  denscov_dens1: { type: 'question', text: '히스토그램 기반의 구간별 도수로 밀도를 근사하나요? (아니면 커널·파라메트릭·신경망 기반)', yes: 'leaf-histogram-family', no: 'denscov_dens2' },
  denscov_dens2: { type: 'question', text: '커널함수를 이용해 부드럽게 밀도를 추정하는 KDE 계열인가요?', yes: 'denscov_kde1', no: 'denscov_dens3' },
  denscov_kde1: { type: 'question', text: 'KDE에 사용하는 커널 함수의 종류를 구분하나요? (아니면 대역폭 선택이나 KDE 변형 방식)', yes: 'leaf-kde-kernel-family', no: 'denscov_kde2' },
  denscov_kde2: { type: 'question', text: '대역폭(스무딩 폭)을 선택하는 방법인가요? (아니면 다변량·적응형 KDE 변형)', yes: 'leaf-kde-bandwidth-family', no: 'leaf-kde-variant-family' },
  denscov_dens3: { type: 'question', text: '모수를 가정한 파라메트릭·혼합모델 방식으로 밀도를 추정하나요? (최대우도·적률법·혼합모델 등)', yes: 'leaf-parametric-mixture-family', no: 'denscov_dens4' },
  denscov_dens4: { type: 'question', text: '신경망이나 정규화 플로우로 복잡한 분포를 학습하나요?', yes: 'leaf-neural-flow-family', no: 'denscov_dens5' },
  denscov_dens5: { type: 'question', text: '변수 간 의존구조를 주변분포와 분리해 모델링하는 코퓰라 기반 기법인가요? (아니면 KNN·지역우도 등 비모수 기법)', yes: 'leaf-copula-family', no: 'leaf-nonparametric-other-family' },

  denscov_cov1: { type: 'question', text: '기본적인 표본·최대우도 공분산 추정치를 그대로 사용하나요? (축소·희소화 등 추가 처리 없이)', yes: 'leaf-basic-covariance-family', no: 'denscov_cov2' },
  denscov_cov2: { type: 'question', text: '고차원에서 안정성을 높이려고 추정치를 목표행렬 쪽으로 축소(shrinkage)하나요?', yes: 'leaf-shrinkage-family', no: 'denscov_cov3' },
  denscov_cov3: { type: 'question', text: 'L1 벌점 등으로 역공분산(정밀행렬)을 희소한 그래프 구조로 추정하나요?', yes: 'leaf-sparse-graph-family', no: 'denscov_cov4' },
  denscov_cov4: { type: 'question', text: '이상치에 강건하도록 설계된 공분산 추정 기법인가요? (최소공분산행렬식, M-추정량 등)', yes: 'leaf-robust-covariance-family', no: 'denscov_cov5' },
  denscov_cov5: { type: 'question', text: '밴드·블록대각·토플리츠처럼 인접·순서 구조를 미리 가정하고 그 형태로 제약하나요?', yes: 'leaf-structured-banded-family', no: 'denscov_cov6' },
  denscov_cov6: { type: 'question', text: '요인모델·크로네커 곱·랜덤행렬이론처럼 저차원 잠재 구조를 가정해 공분산을 추정하나요?', yes: 'leaf-structured-factor-family', no: 'leaf-regularized-threshold-family' },

  'leaf-histogram-family': { type: 'leaf', category: 'unsup', subcategory: 'density-covariance', ids: ['adaptive-histogram', 'equal-width-histogram', 'equal-frequency-histogram', 'multi-dimensional-histogram', 'bayesian-blocks'],
    reason: '구간(빈)을 나눠 각 구간의 도수로 확률밀도를 근사하는 히스토그램 기반 기법입니다.' },
  'leaf-kde-kernel-family': { type: 'leaf', category: 'unsup', subcategory: 'density-covariance', ids: ['gaussian-kernel', 'epanechnikov-kernel', 'biweight-kernel', 'triangular-kernel', 'triweight-kernel', 'cosine-kernel'],
    reason: '각 데이터점에 커널 함수를 씌워 더해 밀도를 추정할 때 사용하는 커널 함수 종류입니다.' },
  'leaf-kde-bandwidth-family': { type: 'leaf', category: 'unsup', subcategory: 'density-covariance', ids: ['scotts-rule', 'silvermans-rule', 'plug-in-methods', 'kde-cross-validation'],
    reason: '커널밀도추정의 스무딩 폭(대역폭)을 데이터로부터 자동으로 정하는 대역폭 선택 기법입니다.' },
  'leaf-kde-variant-family': { type: 'leaf', category: 'unsup', subcategory: 'density-covariance', ids: ['univariate-kde', 'multivariate-kde', 'adaptive-kde', 'variable-bandwidth-kde'],
    reason: '변수 개수나 지역 밀도에 따라 커널의 형태·폭을 달리 적용하는 커널밀도추정(KDE) 변형 기법입니다.' },
  'leaf-parametric-mixture-family': { type: 'leaf', category: 'unsup', subcategory: 'density-covariance', ids: ['mle', 'method-of-moments', 'dirichlet-process-mixture-model', 'variational-inference-gmm'],
    reason: '분포의 함수 형태를 가정한 뒤 모수나 혼합모델 구조를 추정하는 파라메트릭·혼합모델 기법입니다.' },
  'leaf-neural-flow-family': { type: 'leaf', category: 'unsup', subcategory: 'density-covariance', ids: ['normalizing-flows', 'real-nvp', 'maf', 'neural-density-estimation'],
    reason: '단순한 기저분포를 신경망 변환으로 복잡한 실제 분포로 사상하는 정규화 플로우 계열 기법입니다.' },
  'leaf-copula-family': { type: 'leaf', category: 'unsup', subcategory: 'density-covariance', ids: ['copula-based-density-estimation', 'vine-copula'],
    reason: '변수별 주변분포와 변수 간 의존구조를 분리해 모델링하는 코퓰라 기반 기법입니다.' },
  'leaf-nonparametric-other-family': { type: 'leaf', category: 'unsup', subcategory: 'density-covariance', ids: ['knn-density-estimation', 'local-likelihood-density-estimation', 'orthogonal-series-density-estimation'],
    reason: '이웃 거리나 지역 우도, 직교 함수급수 등을 이용하는 비모수적 밀도추정 기법입니다.' },
  'leaf-basic-covariance-family': { type: 'leaf', category: 'unsup', subcategory: 'density-covariance', ids: ['empirical-covariance', 'sample-covariance-matrix', 'ml-covariance-estimation'],
    reason: '표본으로부터 공분산을 그대로 계산하는 경험적·최대우도 공분산 추정 기법입니다.' },
  'leaf-shrinkage-family': { type: 'leaf', category: 'unsup', subcategory: 'density-covariance', ids: ['shrunk-covariance', 'ledoit-wolf-shrinkage', 'linear-shrinkage', 'non-linear-shrinkage', 'oas'],
    reason: '표본 공분산을 목표행렬 쪽으로 축소해 고차원에서의 추정 오차를 줄이는 축소추정 기법입니다.' },
  'leaf-sparse-graph-family': { type: 'leaf', category: 'unsup', subcategory: 'density-covariance', ids: ['glasso', 'clime', 'l1-penalized-covariance-estimation', 'sparse-inverse-covariance-estimation', 'neighborhood-selection'],
    reason: 'L1 등의 벌점으로 역공분산(정밀행렬)을 희소한 그래프 구조로 추정하는 기법입니다.' },
  'leaf-robust-covariance-family': { type: 'leaf', category: 'unsup', subcategory: 'density-covariance', ids: ['fastmcd', 'm-estimators'],
    reason: '이상치의 영향을 최소화하도록 설계된 강건 공분산 추정 기법입니다.' },
  'leaf-structured-banded-family': { type: 'leaf', category: 'unsup', subcategory: 'density-covariance', ids: ['banded-covariance', 'block-diagonal-covariance', 'toeplitz-covariance'],
    reason: '변수의 순서나 그룹 구조를 이용해 밴드·블록대각·토플리츠 형태로 공분산을 제약하는 기법입니다.' },
  'leaf-structured-factor-family': { type: 'leaf', category: 'unsup', subcategory: 'density-covariance', ids: ['kronecker-structured-covariance', 'factor-model-covariance', 'poet', 'random-matrix-theory-approaches'],
    reason: '저차원 잠재요인이나 크로네커 곱, 랜덤행렬이론 등 구조적 가정으로 고차원 공분산을 추정하는 기법입니다.' },
  'leaf-regularized-threshold-family': { type: 'leaf', category: 'unsup', subcategory: 'density-covariance', ids: ['regularized-covariance-estimation', 'thresholding-methods'],
    reason: '정규화 항을 추가하거나 작은 원소를 임계값으로 잘라내어 공분산 추정을 안정화하는 기법입니다.' },

  /* ══════ 지도학습: 회귀+분류 범용 (sup/reg-class, 12개) ══════ */
  sup_rc1: { type: 'question', text: '트리 구조로 데이터를 반복 분할해 예측하나요? (결정 트리)', yes: 'leaf-dt', no: 'sup_rc2' },
  sup_rc2: { type: 'question', text: '클래스별 확률분포를 가정하고 베이즈 정리로 결정경계를 구하는 판별분석 계열인가요?', yes: 'leaf-lda-qda', no: 'sup_rc3' },
  sup_rc3: { type: 'question', text: '마진을 최대화하는 초평면(서포트 벡터)으로 분류·회귀하나요?', yes: 'leaf-svm', no: 'sup_rc4' },
  sup_rc4: { type: 'question', text: '가장 가까운 이웃들의 값을 참조해 예측하나요? (K-최근접 이웃)', yes: 'leaf-knn', no: 'sup_rc5' },
  sup_rc5: { type: 'question', text: '설명변수의 분산이나 반응변수와의 공분산을 이용해 성분을 추출한 뒤 회귀·분류하나요? (PCR·PLS 계열)', yes: 'sup_rc6', no: 'sup_rc7' },
  sup_rc6: { type: 'question', text: '반응변수는 고려하지 않고 설명변수의 분산만으로 주성분을 먼저 추출하나요? (PCR·Supervised PCA 계열)', yes: 'leaf-pcr-spca', no: 'leaf-pls-plsda' },
  sup_rc7: { type: 'question', text: '어텐션 메커니즘으로 시퀀스 전체의 관계를 한 번에 처리하는 트랜스포머인가요?', yes: 'leaf-transformer', no: 'sup_rc8' },
  sup_rc8: { type: 'question', text: '이미지·시계열 등 구조화된 데이터 전용 계층(합성곱·순환)을 사용하나요? (CNN/RNN)', yes: 'leaf-cnn-rnn', no: 'leaf-mlp' },

  'leaf-dt': { type: 'leaf', category: 'sup', subcategory: 'reg-class', ids: ['decision-tree'],
    reason: '데이터를 반복적으로 분할하는 규칙(트리) 구조로 회귀와 분류를 모두 수행하는 알고리즘입니다.' },
  'leaf-lda-qda': { type: 'leaf', category: 'sup', subcategory: 'reg-class', ids: ['linear-discriminant-analysis', 'quadratic-discriminant-analysis'],
    reason: '클래스별 데이터 분포를 가정하고 베이즈 정리로 결정경계를 구하는 판별분석 기법입니다.' },
  'leaf-svm': { type: 'leaf', category: 'sup', subcategory: 'reg-class', ids: ['svm'],
    reason: '마진을 최대화하는 초평면(또는 커널로 변환된 공간)으로 회귀·분류 경계를 찾는 알고리즘입니다.' },
  'leaf-knn': { type: 'leaf', category: 'sup', subcategory: 'reg-class', ids: ['knn'],
    reason: '가장 가까운 이웃들의 값을 참조해 예측하는 거리 기반 알고리즘입니다.' },
  'leaf-pcr-spca': { type: 'leaf', category: 'sup', subcategory: 'reg-class', ids: ['pcr', 'supervised-pca'],
    reason: '설명변수의 분산을 최대화하는 주성분을 먼저 추출한 뒤 회귀·분류에 사용하는 기법입니다.' },
  'leaf-pls-plsda': { type: 'leaf', category: 'sup', subcategory: 'reg-class', ids: ['pls', 'pls-da'],
    reason: '반응변수와의 공분산까지 고려해 잠재성분을 추출하는 부분최소제곱 기반 기법입니다.' },
  'leaf-transformer': { type: 'leaf', category: 'sup', subcategory: 'reg-class', ids: ['transformer'],
    reason: '어텐션 메커니즘으로 시퀀스 전체의 관계를 한 번에 처리하는 신경망 구조입니다.' },
  'leaf-cnn-rnn': { type: 'leaf', category: 'sup', subcategory: 'reg-class', ids: ['cnn-rnn'],
    reason: '합성곱·순환 구조로 이미지·시계열 등 구조화된 데이터를 처리하는 신경망입니다.' },
  'leaf-mlp': { type: 'leaf', category: 'sup', subcategory: 'reg-class', ids: ['mlp'],
    reason: '여러 층의 완전연결 신경망으로 비선형 관계를 학습하는 기본 딥러닝 구조입니다.' },

  /* ══════ 지도학습: 분류 (sup/classification, 9개) ══════ */
  sup_cls1: { type: 'question', text: '샘플 간 거리나 클래스 중심까지의 거리로 분류하나요? (마할라노비스 거리·최근접 중심)', yes: 'leaf-distance-based', no: 'sup_cls2' },
  sup_cls2: { type: 'question', text: '베이즈 정리에 기반해 클래스별 데이터 분포를 직접 추정하는 생성모델인가요? (로지스틱류의 판별모델이 아니라)', yes: 'sup_cls3', no: 'sup_cls4' },
  sup_cls3: { type: 'question', text: '변수 간 조건부 독립을 가정하거나(나이브 베이즈) 혼합모형으로 클래스별 분포를 추정하나요?', yes: 'leaf-naive-bayes-gmm', no: 'leaf-bayesian-logistic-network' },
  sup_cls4: { type: 'question', text: '표준정규분포의 누적분포함수(프로빗 링크)로 확률을 모델링하나요? (로지스틱 함수가 아니라)', yes: 'leaf-probit', no: 'leaf-logistic' },

  'leaf-distance-based': { type: 'leaf', category: 'sup', subcategory: 'classification', ids: ['mahalanobis-distance-classification', 'nearest-centroid'],
    reason: '샘플 간 거리(마할라노비스 거리)나 클래스 중심까지의 거리로 분류하는 기법입니다.' },
  'leaf-naive-bayes-gmm': { type: 'leaf', category: 'sup', subcategory: 'classification', ids: ['naive-bayes', 'gmm-em-classification'],
    reason: '변수 간 조건부 독립을 가정하거나 혼합모형으로 클래스별 분포를 추정하는 확률적 생성 분류 기법입니다.' },
  'leaf-bayesian-logistic-network': { type: 'leaf', category: 'sup', subcategory: 'classification', ids: ['bayesian-logistic-regression', 'bayesian-network-classification'],
    reason: '사전분포를 명시적으로 결합해 파라미터나 변수 관계를 추정하는 베이지안 분류 기법입니다.' },
  'leaf-probit': { type: 'leaf', category: 'sup', subcategory: 'classification', ids: ['probit-regression'],
    reason: '표준정규분포의 누적분포함수(프로빗 링크)로 이진 확률을 모델링하는 회귀 기반 분류 기법입니다.' },
  'leaf-logistic': { type: 'leaf', category: 'sup', subcategory: 'classification', ids: ['logistic-regression', 'multinomial-logistic-regression'],
    reason: '로지스틱 함수로 이진 또는 다범주 확률을 직접 모델링하는 판별적 분류 기법입니다.' },

  /* ══════ 지도학습: 회귀 (sup/regression, 55개) ══════ */
  sup_reg1: { type: 'question', text: '경사하강법 계열의 최적화 알고리즘을 찾으시나요? (회귀 모델 자체가 아니라 파라미터를 갱신하는 학습 절차)', yes: 'sup_reg2', no: 'sup_reg8' },
  sup_reg2: { type: 'question', text: '2차 미분(헤시안) 정보를 활용하는 뉴턴 계열 방법인가요?', yes: 'leaf-newton-lbfgs', no: 'sup_reg3' },
  sup_reg3: { type: 'question', text: '1·2차 모멘트를 추정해 파라미터별 학습률을 자동 조정하는 Adam 계열인가요?', yes: 'leaf-adam-adamw', no: 'sup_reg4' },
  sup_reg4: { type: 'question', text: '과거 그래디언트의 관성(모멘텀)을 반영해 가속하나요?', yes: 'leaf-momentum-nag', no: 'sup_reg5' },
  sup_reg5: { type: 'question', text: '학습률을 조정하거나 갱신을 미리 내다보는 등의 보조 기법인가요? (Warm-up·Decay·Lookahead)', yes: 'leaf-lr-schedule-lookahead', no: 'leaf-gd-basic' },

  sup_reg8: { type: 'question', text: '지수족 분포를 가정하는 일반화선형모형(GLM) 계열인가요?', yes: 'sup_reg9', no: 'sup_reg15' },
  sup_reg9: { type: 'question', text: '종속변수가 0 이상의 정수인 카운트(빈도) 데이터인가요?', yes: 'sup_reg10', no: 'sup_reg11' },
  sup_reg10: { type: 'question', text: '0이 지나치게 많은 부분을 별도 과정으로 모델링하나요? (영과잉·허들)', yes: 'leaf-zero-inflated-hurdle', no: 'leaf-count-glm' },
  sup_reg11: { type: 'question', text: '연속이면서 항상 양수인 비대칭 분포(감마·역가우시안·트위디)를 따르나요?', yes: 'leaf-gamma-tweedie', no: 'sup_reg12' },
  sup_reg12: { type: 'question', text: '이항 결과나 생존시간(위험)을 다루나요?', yes: 'leaf-binomial-cox', no: 'sup_reg13' },
  sup_reg13: { type: 'question', text: '반응변수의 형태 자체를 평활함수로 유연하게 확장했나요? (가법모형)', yes: 'leaf-gam-gamlss', no: 'leaf-bayesian-regularized-glm' },

  sup_reg15: { type: 'question', text: '입력 특징을 다항식(거듭제곱) 형태로 확장해 비선형을 표현하나요?', yes: 'sup_reg16', no: 'sup_reg19' },
  sup_reg16: { type: 'question', text: '커널이나 부분최소제곱(PLS)과 결합된 다항 회귀인가요?', yes: 'leaf-poly-kernel-pls', no: 'sup_reg17' },
  sup_reg17: { type: 'question', text: '차수가 높거나 직교 다항식 기저를 사용하나요?', yes: 'leaf-poly-highorder-orthogonal', no: 'leaf-poly-basic' },

  sup_reg19: { type: 'question', text: '벌점(regularization)을 추가해 계수를 축소·선택하는 선형회귀 계열인가요?', yes: 'sup_reg20', no: 'sup_reg23' },
  sup_reg20: { type: 'question', text: 'L1·L2 벌점을 그대로 쓰는 고전적 라쏘·릿지·엘라스틱넷인가요?', yes: 'leaf-lasso-ridge-elasticnet', no: 'sup_reg21' },
  sup_reg21: { type: 'question', text: '볼록하지 않은(non-convex) 벌점(MCP·SCAD)을 사용하나요?', yes: 'leaf-mcp-scad', no: 'leaf-adaptive-group-lasso' },

  sup_reg23: { type: 'question', text: '명시적인 선형·다항식 형태를 넘어서는 비선형·베이지안·신경망 기반 회귀인가요?', yes: 'sup_reg24', no: 'sup_reg28' },
  sup_reg24: { type: 'question', text: '신경망이나 물리 법칙, 딥러닝 기반 가우시안 프로세스를 활용하나요?', yes: 'leaf-neural-physics-dgp', no: 'sup_reg25' },
  sup_reg25: { type: 'question', text: '커널이나 스플라인 등 비모수적 기저함수로 유연하게 적합하나요?', yes: 'leaf-kernel-spline-functional', no: 'sup_reg26' },
  sup_reg26: { type: 'question', text: '사전분포를 명시하거나 여러 비선형 성분을 혼합하나요?', yes: 'leaf-bayesian-mixture-nonlinear', no: 'leaf-nls-robust-nonlinear' },

  sup_reg28: { type: 'question', text: '이상치에 강건하거나 특정 분위수를 직접 예측하는 등 견고성에 초점을 두나요?', yes: 'leaf-robust-quantile', no: 'sup_reg29' },
  sup_reg29: { type: 'question', text: '데이터의 위계 구조를 반영하거나 변수를 단계적으로 선택해 적합하나요?', yes: 'leaf-hierarchical-stepwise', no: 'leaf-linear-regression' },

  'leaf-newton-lbfgs': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['newtons-method', 'lbfgs'],
    reason: '2차 미분(헤시안) 정보를 활용해 빠르게 수렴하는 뉴턴 계열 최적화 알고리즘입니다.' },
  'leaf-adam-adamw': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['adam', 'adamw'],
    reason: '1·2차 모멘트를 추정해 파라미터별 학습률을 자동으로 조정하는 적응적 최적화 알고리즘입니다.' },
  'leaf-momentum-nag': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['momentum-gradient-descent', 'nag'],
    reason: '과거 그래디언트의 관성을 반영해 진동을 줄이고 수렴을 가속하는 최적화 알고리즘입니다.' },
  'leaf-lr-schedule-lookahead': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['learning-rate-decay', 'warmup', 'lookahead'],
    reason: '학습률을 점진적으로 조정하거나 앞선 갱신을 미리 내다보며 안정화하는 학습 보조 기법입니다.' },
  'leaf-gd-basic': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['batch-gradient-descent', 'mini-batch-gradient-descent', 'sgd'],
    reason: '전체 또는 일부 데이터로 그래디언트를 계산해 파라미터를 갱신하는 가장 기본적인 경사하강법입니다.' },
  'leaf-zero-inflated-hurdle': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['zero-inflated-model', 'hurdle-model'],
    reason: '과도하게 많은 0을 별도 과정으로 모델링하는 카운트 데이터용 회귀 기법입니다.' },
  'leaf-count-glm': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['poisson-regression', 'quasi-poisson-regression', 'negative-binomial-regression'],
    reason: '포아송 분포 계열을 가정해 정수 카운트 데이터를 모델링하는 일반화선형모형입니다.' },
  'leaf-gamma-tweedie': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['gamma-regression', 'inverse-gaussian-regression', 'tweedie-regression'],
    reason: '연속이면서 항상 양수인 비대칭 분포를 가정하는 일반화선형모형입니다.' },
  'leaf-binomial-cox': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['binomial-regression', 'cox-proportional-hazard'],
    reason: '이항 결과나 생존시간(위험)을 모델링하는 일반화선형·생존분석 기법입니다.' },
  'leaf-gam-gamlss': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['gam', 'gamlss'],
    reason: '선형 예측식을 평활함수로 확장해 반응변수의 형태까지 유연하게 모델링하는 가법모형입니다.' },
  'leaf-bayesian-regularized-glm': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['bayesian-glm', 'regularized-glm'],
    reason: '사전분포나 벌점을 결합해 안정성을 높인 일반화선형모형입니다.' },
  'leaf-poly-kernel-pls': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['kernel-polynomial-regression', 'pls-polynomial-regression'],
    reason: '다항식 특징을 커널이나 부분최소제곱과 결합해 비선형성을 표현하는 회귀 기법입니다.' },
  'leaf-poly-highorder-orthogonal': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['high-order-polynomial-regression', 'orthogonal-polynomial-regression'],
    reason: '고차항이나 직교 다항식 기저를 사용해 수치적으로 안정적인 다항 회귀 기법입니다.' },
  'leaf-poly-basic': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['univariate-polynomial-regression', 'multivariate-polynomial-regression'],
    reason: '입력을 단변량 또는 다변량 다항식으로 확장해 비선형 관계를 표현하는 기본 다항 회귀입니다.' },
  'leaf-lasso-ridge-elasticnet': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['lasso', 'ridge-regression', 'elastic-net'],
    reason: 'L1·L2 벌점으로 계수를 축소하거나 선택하는 고전적 정규화 회귀입니다.' },
  'leaf-mcp-scad': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['mcp-regression', 'scad-regression'],
    reason: '볼록하지 않은 벌점으로 큰 계수의 편향을 줄이는 정규화 회귀 기법입니다.' },
  'leaf-adaptive-group-lasso': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['adaptive-lasso', 'group-lasso', 'sparse-group-lasso'],
    reason: '가중치를 적응적으로 조정하거나 변수 그룹 단위로 선택하는 라쏘 확장 기법입니다.' },
  'leaf-neural-physics-dgp': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['neural-network-regression', 'physics-informed-regression', 'deep-gaussian-process-regression'],
    reason: '신경망이나 물리 법칙, 딥 가우시안 프로세스로 복잡한 비선형 관계를 학습하는 회귀 기법입니다.' },
  'leaf-kernel-spline-functional': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['kernel-based-regression', 'spline-based-regression', 'functional-data-regression'],
    reason: '커널이나 스플라인 같은 비모수적 기저함수로 유연하게 곡선을 적합하는 회귀 기법입니다.' },
  'leaf-bayesian-mixture-nonlinear': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['bayesian-nonlinear-regression', 'mixture-of-nonlinear-regressions'],
    reason: '사전분포를 결합하거나 여러 비선형 성분을 혼합해 모델링하는 회귀 기법입니다.' },
  'leaf-nls-robust-nonlinear': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['nonlinear-least-squares', 'robust-nonlinear-regression'],
    reason: '비선형 최소제곱으로 적합하거나 이상치에 강건하게 만든 비선형 회귀 기법입니다.' },
  'leaf-robust-quantile': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['robust-regression', 'quantile-regression'],
    reason: '이상치의 영향을 줄이거나 특정 분위수를 직접 예측하는 회귀 기법입니다.' },
  'leaf-hierarchical-stepwise': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['hierarchical-regression', 'stepwise-regression'],
    reason: '데이터의 위계 구조를 반영하거나 변수를 단계적으로 선택해 적합하는 회귀 기법입니다.' },
  'leaf-linear-regression': { type: 'leaf', category: 'sup', subcategory: 'regression', ids: ['linear-regression'],
    reason: '설명변수와 반응변수의 선형 관계를 최소제곱으로 적합하는 가장 기본적인 회귀 알고리즘입니다.' },

  /* ══════ 비지도학습: 시각화 (viz1) — 21개 ══════ */
  viz1: { type: 'question', text: '여러 범주의 값 크기를 비교하거나 전체 구성비를 보여주는 기본 통계 차트인가요? (아니면 분포·관계·특수 시각화)', yes: 'viz2', no: 'viz6' },
  viz2: { type: 'question', text: '막대의 길이로 값의 크기를 비교하는 차트인가요?', yes: 'viz3', no: 'viz4' },
  viz3: { type: 'question', text: '여러 하위 항목의 값을 하나의 막대 안에 누적해서 쌓아 보여주나요?', yes: 'leaf-viz-stacked-bar', no: 'leaf-viz-bar' },
  viz4: { type: 'question', text: '전체에서 각 부분이 차지하는 비율을 원형으로 표현하나요?', yes: 'viz5', no: 'leaf-viz-line-area' },
  viz5: { type: 'question', text: '가운데를 비워 도넛 모양으로 표현하나요?', yes: 'leaf-viz-donut', no: 'leaf-viz-pie' },
  viz6: { type: 'question', text: '데이터가 퍼진 정도나 밀도 형태(분포)를 보여주는 시각화인가요?', yes: 'viz7', no: 'viz8' },
  viz7: { type: 'question', text: '사분위수·최솟값·최댓값 등 요약 통계량이나 빈도수 집계로 분포를 나타내나요? (부드러운 곡선이 아니라)', yes: 'leaf-viz-hist-box', no: 'leaf-viz-kde-violin' },
  viz8: { type: 'question', text: '두 개 이상의 변수 사이 관계나 데이터의 위치 패턴을 점으로 표현하는 시각화인가요?', yes: 'viz9', no: 'viz11' },
  viz9: { type: 'question', text: '점 하나하나의 위치(와 크기)로 개별 데이터를 직접 표현하나요? (집계하지 않고)', yes: 'viz10', no: 'leaf-viz-multivar' },
  viz10: { type: 'question', text: '점들이 밀집된 영역을 육각형 구간으로 집계해서 색으로 표현하나요?', yes: 'leaf-viz-hexbin', no: 'leaf-viz-scatter-bubble' },
  viz11: { type: 'question', text: '3차원 공간이나 등고선처럼 표면·입체 구조를 표현하나요?', yes: 'leaf-viz-3d-contour', no: 'viz12' },
  viz12: { type: 'question', text: '색상이 채워진 격자(행렬) 형태로 값의 크기를 한눈에 보여주나요?', yes: 'leaf-viz-heatmap', no: 'leaf-viz-timeseries-embed' },

  'leaf-viz-bar': { type: 'leaf', category: 'unsup', subcategory: 'visualization', ids: ['bar-plot'],
    reason: '범주별 값의 크기를 막대의 길이로 비교하는 기본 차트입니다.' },
  'leaf-viz-stacked-bar': { type: 'leaf', category: 'unsup', subcategory: 'visualization', ids: ['stacked-bar-plot'],
    reason: '여러 하위 항목의 값을 하나의 막대에 누적해서 보여주는 차트입니다.' },
  'leaf-viz-pie': { type: 'leaf', category: 'unsup', subcategory: 'visualization', ids: ['pie-chart'],
    reason: '전체에서 각 부분이 차지하는 비율을 원형으로 나타내는 차트입니다.' },
  'leaf-viz-donut': { type: 'leaf', category: 'unsup', subcategory: 'visualization', ids: ['donut-chart'],
    reason: '가운데를 비운 원형으로 구성비를 나타내는 차트입니다.' },
  'leaf-viz-line-area': { type: 'leaf', category: 'unsup', subcategory: 'visualization', ids: ['line-plot', 'step-plot', 'area-plot'],
    reason: '값의 연속적인 추이를 선이나 채워진 영역으로 나타내는 차트입니다.' },
  'leaf-viz-hist-box': { type: 'leaf', category: 'unsup', subcategory: 'visualization', ids: ['histogram-viz', 'box-plot'],
    reason: '구간별 빈도나 사분위수 등 요약 통계량으로 분포를 나타내는 시각화입니다.' },
  'leaf-viz-kde-violin': { type: 'leaf', category: 'unsup', subcategory: 'visualization', ids: ['kde-plot', 'violin-plot'],
    reason: '커널 밀도로 분포의 모양을 부드러운 곡선으로 나타내는 시각화입니다.' },
  'leaf-viz-hexbin': { type: 'leaf', category: 'unsup', subcategory: 'visualization', ids: ['hexbin-plot'],
    reason: '점들이 밀집된 영역을 육각형 구간으로 집계해 색으로 나타내는 시각화입니다.' },
  'leaf-viz-scatter-bubble': { type: 'leaf', category: 'unsup', subcategory: 'visualization', ids: ['scatter-plot', 'bubble-plot'],
    reason: '두 변수의 관계를 점의 위치(와 크기)로 나타내는 시각화입니다.' },
  'leaf-viz-multivar': { type: 'leaf', category: 'unsup', subcategory: 'visualization', ids: ['pair-plot', 'parallel-coordinates-plot'],
    reason: '여러 변수 간의 관계를 한 화면에서 동시에 비교하는 다변량 시각화입니다.' },
  'leaf-viz-3d-contour': { type: 'leaf', category: 'unsup', subcategory: 'visualization', ids: ['3d-plot', 'contour-plot'],
    reason: '3차원 공간이나 등고선으로 표면·입체 구조를 나타내는 시각화입니다.' },
  'leaf-viz-heatmap': { type: 'leaf', category: 'unsup', subcategory: 'visualization', ids: ['heatmap'],
    reason: '값의 크기를 색상 격자로 한눈에 보여주는 시각화입니다.' },
  'leaf-viz-timeseries-embed': { type: 'leaf', category: 'unsup', subcategory: 'visualization', ids: ['time-series-plot', 'embedding-scatter'],
    reason: '시간 축이나 차원축소 임베딩 좌표 위에 데이터를 배치해 패턴을 보여주는 시각화입니다.' },

  /* ══════ 비지도학습: 연관규칙 (assoc1) — 28개 ══════ */
  assoc1: { type: 'question', text: '거의 동시에 발생·구매되는 항목들의 조합(장바구니 분석류)을 찾는 알고리즘인가요? (시간 순서 없이)', yes: 'assoc2', no: 'assoc9' },
  assoc2: { type: 'question', text: '후보 항목집합을 생성한 뒤 지지도를 계산하며 가지치기하는 전통적인 방식인가요? (Apriori 원조)', yes: 'leaf-assoc-apriori', no: 'assoc3' },
  assoc3: { type: 'question', text: 'FP-트리(접두사 트리) 구조를 만들어 후보 생성 없이 탐색하나요?', yes: 'assoc4', no: 'assoc5' },
  assoc4: { type: 'question', text: '빈발 패턴을 마이닝하는 게 아니라 FP-트리를 구성하는 과정 자체를 다루나요?', yes: 'leaf-assoc-fp-tree', no: 'leaf-assoc-fp-growth' },
  assoc5: { type: 'question', text: '수직(항목→트랜잭션ID 리스트) 데이터 형식으로 교집합 연산을 하나요?', yes: 'assoc6', no: 'assoc7' },
  assoc6: { type: 'question', text: '트랜잭션 ID 교집합 대신 차집합(diffset)으로 계산량을 줄였나요?', yes: 'leaf-assoc-declat', no: 'leaf-assoc-eclat' },
  assoc7: { type: 'question', text: '메모리 효율을 위해 하이퍼링크(H-struct) 구조를 사용하나요?', yes: 'leaf-assoc-hmine', no: 'assoc8' },
  assoc8: { type: 'question', text: '동등 클래스(IT-tree) 순회로 폐쇄 항목집합을 탐색하나요? (선형시간 보장이 핵심이 아니라)', yes: 'leaf-assoc-charm', no: 'leaf-assoc-lcm' },
  assoc9: { type: 'question', text: '이벤트나 항목이 시간 순서를 가진 순차 패턴을 찾는 알고리즘인가요?', yes: 'assoc10', no: 'assoc13' },
  assoc10: { type: 'question', text: '후보 시퀀스를 생성하고 여러 번 DB를 스캔하며 검증하는 전통적 방식인가요? (Apriori와 유사)', yes: 'leaf-assoc-gsp', no: 'assoc11' },
  assoc11: { type: 'question', text: '부분 패턴을 생략하고 대표(폐쇄) 순차 패턴만 찾나요?', yes: 'leaf-assoc-clospan-bide', no: 'assoc12' },
  assoc12: { type: 'question', text: '수직 데이터 형식의 동등 클래스나 비트맵 연산으로 탐색을 확장하나요?', yes: 'leaf-assoc-spade-spam', no: 'leaf-assoc-freespan-prefixspan' },
  assoc13: { type: 'question', text: '일반적인 이진(있음/없음) 연관규칙을 넘어선 특수 목적(퍼지·다차원·다계층·부정·정량·희소·공간·시간)의 연관규칙인가요?', yes: 'assoc14', no: 'assoc17' },
  assoc14: { type: 'question', text: '수치형 속성을 구간화하거나 퍼지 소속도로 다루는 연관규칙인가요?', yes: 'leaf-assoc-fuzzy-quant', no: 'assoc15' },
  assoc15: { type: 'question', text: '여러 차원(속성)이나 개념 계층 구조를 함께 고려하는 연관규칙인가요?', yes: 'leaf-assoc-multidim-multilevel', no: 'assoc16' },
  assoc16: { type: 'question', text: '항목의 부재나 발생 빈도가 낮은 패턴에 주목하는 연관규칙인가요?', yes: 'leaf-assoc-negative-rare', no: 'leaf-assoc-spatial-temporal' },
  assoc17: { type: 'question', text: '그래프나 트리처럼 항목 간 구조적 연결 관계를 포함한 패턴을 찾나요?', yes: 'assoc18', no: 'assoc19' },
  assoc18: { type: 'question', text: '정점과 간선으로 이루어진 그래프 구조에서 빈발 부분그래프를 찾나요?', yes: 'leaf-assoc-graph', no: 'leaf-assoc-tree' },
  assoc19: { type: 'question', text: '끊임없이 흘러 들어오는 데이터 스트림에서 실시간으로 패턴을 갱신하나요?', yes: 'leaf-assoc-stream', no: 'assoc20' },
  assoc20: { type: 'question', text: '정해진 시간창 안에서 사건들이 발생하는 순서(에피소드)를 찾나요?', yes: 'leaf-assoc-episode', no: 'leaf-assoc-utility' },

  'leaf-assoc-apriori': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['apriori'],
    reason: '후보 항목집합을 생성하고 지지도로 가지치기하는 연관규칙 마이닝의 원조 알고리즘입니다.' },
  'leaf-assoc-fp-tree': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['fp-tree-construction'],
    reason: 'FP-Growth가 사용하는 접두사 트리(FP-Tree)를 구성하는 단계를 다루는 알고리즘입니다.' },
  'leaf-assoc-fp-growth': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['fp-growth'],
    reason: '후보 생성 없이 FP-트리를 재귀적으로 탐색해 빈발 패턴을 찾는 알고리즘입니다.' },
  'leaf-assoc-declat': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['declat'],
    reason: '트랜잭션 ID 교집합 대신 차집합(diffset) 연산으로 Eclat을 개선한 알고리즘입니다.' },
  'leaf-assoc-eclat': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['eclat'],
    reason: '수직 데이터 형식과 동등 클래스 교집합 연산으로 빈발 항목집합을 찾는 알고리즘입니다.' },
  'leaf-assoc-hmine': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['h-mine'],
    reason: '하이퍼링크 구조(H-struct)로 메모리를 효율적으로 사용하는 빈발 패턴 마이닝 알고리즘입니다.' },
  'leaf-assoc-charm': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['charm'],
    reason: 'IT-tree 순회와 diffset으로 폐쇄 항목집합만 압축해서 찾는 알고리즘입니다.' },
  'leaf-assoc-lcm': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['lcm'],
    reason: '선형 시간 복잡도로 폐쇄 항목집합을 열거하는 알고리즘입니다.' },
  'leaf-assoc-gsp': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['gsp'],
    reason: '후보 시퀀스를 생성하고 여러 차례 DB를 스캔하며 검증하는 전통적 순차 패턴 마이닝 알고리즘입니다.' },
  'leaf-assoc-clospan-bide': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['clospan', 'bide'],
    reason: '부분 패턴을 생략하고 대표(폐쇄) 순차 패턴만 압축해서 찾는 알고리즘군입니다.' },
  'leaf-assoc-spade-spam': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['spade', 'spam'],
    reason: '수직 데이터 형식의 동등 클래스나 비트맵 연산으로 순차 패턴을 탐색하는 알고리즘군입니다.' },
  'leaf-assoc-freespan-prefixspan': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['freespan', 'prefixspan'],
    reason: '후보 생성 없이 투영된 부분 데이터베이스를 반복 탐색하는 패턴 성장 방식의 순차 패턴 마이닝 알고리즘군입니다.' },
  'leaf-assoc-fuzzy-quant': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['fuzzy-association-rules', 'quantitative-association-rules'],
    reason: '수치형 속성을 구간화하거나 퍼지 소속도로 다루어 연관규칙을 확장한 알고리즘군입니다.' },
  'leaf-assoc-multidim-multilevel': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['multi-dimensional-association-rules', 'multi-level-association-rules'],
    reason: '여러 차원(속성)이나 개념 계층 구조를 함께 고려하는 연관규칙 알고리즘군입니다.' },
  'leaf-assoc-negative-rare': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['negative-association-rules', 'rare-association-rules'],
    reason: '항목의 부재나 낮은 발생 빈도에 주목해 흔치 않은 패턴을 찾는 연관규칙 알고리즘군입니다.' },
  'leaf-assoc-spatial-temporal': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['spatial-association-rules', 'temporal-association-rules'],
    reason: '공간적 위치나 시간적 맥락을 반영해 연관규칙을 확장한 알고리즘군입니다.' },
  'leaf-assoc-graph': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['graph-pattern-mining'],
    reason: '정점과 간선으로 이루어진 그래프 구조에서 빈발 부분그래프를 찾는 알고리즘입니다.' },
  'leaf-assoc-tree': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['tree-pattern-mining'],
    reason: '트리 구조로 표현된 데이터에서 빈발 부분트리 패턴을 찾는 알고리즘입니다.' },
  'leaf-assoc-stream': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['stream-pattern-mining'],
    reason: '끊임없이 흘러 들어오는 데이터 스트림에서 실시간으로 패턴을 갱신하며 찾는 알고리즘입니다.' },
  'leaf-assoc-episode': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['episode-mining'],
    reason: '정해진 시간창 안에서 사건들이 발생하는 순서(에피소드) 패턴을 찾는 알고리즘입니다.' },
  'leaf-assoc-utility': { type: 'leaf', category: 'unsup', subcategory: 'association', ids: ['utility-mining'],
    reason: '단순 빈도가 아니라 이익·가중치 등 효용이 높은 항목집합을 찾는 알고리즘입니다.' },

  /* ══════ 비지도학습: 이상치 탐지 (anom1) — 51개 ══════ */
  anom1: { type: 'question', text: '단변량 데이터의 통계적 검정이나 분포 특성(Z-점수, IQR, 극단값 검정 등)만으로 이상치를 판단하는 통계적 방법인가요?', yes: 'anom6', no: 'anom2' },
  anom2: { type: 'question', text: '이웃까지의 거리나 지역 밀도비로 이상치를 계산하는 거리/밀도 기반 방법인가요?', yes: 'anom10', no: 'anom3' },
  anom3: { type: 'question', text: '정상 데이터의 경계나 확률분포를 학습해 하나의 모델로 이상치를 판단하나요?', yes: 'anom12', no: 'anom4' },
  anom4: { type: 'question', text: '여러 개의 개별 탐지기 결과를 결합해서 최종 판단하는 앙상블 기반 방법인가요?', yes: 'anom15', no: 'anom5' },
  anom5: { type: 'question', text: '시간 순서가 있는 데이터에서 이상 구간이나 시점을 찾는 시계열 기반 방법인가요?', yes: 'anom17', no: 'anom19' },
  anom6: { type: 'question', text: '구간별 도수(히스토그램)를 기준으로 이상치 점수를 매기나요? (분포 검정이 아니라 빈도 기반)', yes: 'leaf-anom-hbos', no: 'anom7' },
  anom7: { type: 'question', text: '카이제곱 분포를 이용한 적합도 검정으로 이상치를 판단하나요?', yes: 'leaf-anom-chisq', no: 'anom8' },
  anom8: { type: 'question', text: '사분위수 범위(IQR)를 벗어난 값을 이상치로 판단하나요?', yes: 'leaf-anom-iqr', no: 'anom9' },
  anom9: { type: 'question', text: '평균·표준편차(또는 중앙값·MAD)로 정규화한 점수가 임계값을 넘는지로 판단하나요? (개별 극단값 가설검정이 아니라)', yes: 'leaf-anom-zscore', no: 'leaf-anom-extreme-test' },
  anom10: { type: 'question', text: '이웃과의 거리 값 자체를 이상치 점수로 사용하나요? (지역 밀도비가 아니라)', yes: 'leaf-anom-distance', no: 'anom11' },
  anom11: { type: 'question', text: '자신의 밀도와 이웃들의 밀도를 비교한 지역 밀도비(LOF 계열 지표)로 이상치를 판단하나요?', yes: 'leaf-anom-lof-family', no: 'leaf-anom-density-cluster' },
  anom12: { type: 'question', text: '정상 데이터를 감싸는 하나의 결정경계(초평면/구)를 학습하는 서포트벡터 기반 방법인가요?', yes: 'leaf-anom-svm-boundary', no: 'anom13' },
  anom13: { type: 'question', text: '데이터를 반복적으로 무작위 분할해 고립시키는 트리 기반 방법인가요?', yes: 'leaf-anom-isolation-forest', no: 'anom14' },
  anom14: { type: 'question', text: '은닉 상태를 가진 순차 모델로 비정상적인 상태 전이를 탐지하나요?', yes: 'leaf-anom-hmm', no: 'leaf-anom-prob-covariance' },
  anom15: { type: 'question', text: '여러 탐지기의 점수를 평균·최댓값 등 고정된 함수로 합산해서 결합하나요?', yes: 'leaf-anom-score-combination', no: 'anom16' },
  anom16: { type: 'question', text: '서로 다른 특징 부분집합이나 모델 구조로 다양성을 준 뒤 결합하는 앙상블인가요?', yes: 'leaf-anom-diverse-ensemble', no: 'leaf-anom-selective-ensemble' },
  anom17: { type: 'question', text: '예측 모델이 만든 예측값과 실제값의 차이(잔차)가 크면 이상치로 보나요?', yes: 'leaf-anom-forecast-residual', no: 'anom18' },
  anom18: { type: 'question', text: '일정 길이의 부분열끼리 서로 얼마나 다른지 비교해 이상 구간을 찾나요? (이동평균 등 단순 통계가 아니라)', yes: 'leaf-anom-subsequence-similarity', no: 'leaf-anom-moving-stat' },
  anom19: { type: 'question', text: '여러 특징(차원) 부분집합 중 이상치가 잘 드러나는 부분공간을 선택하거나 평가하나요?', yes: 'leaf-anom-subspace-selection', no: 'leaf-anom-angle-based' },

  'leaf-anom-hbos': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['hbos'],
    reason: '각 특징의 히스토그램을 이용해 빈도가 낮은 구간의 값을 이상치로 보는 알고리즘입니다.' },
  'leaf-anom-chisq': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['chi-square-test-outlier'],
    reason: '카이제곱 분포를 이용한 적합도 검정으로 이상치를 판단하는 알고리즘입니다.' },
  'leaf-anom-iqr': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['iqr-method'],
    reason: '사분위수 범위(IQR)를 벗어난 값을 이상치로 판단하는 알고리즘입니다.' },
  'leaf-anom-zscore': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['z-score-method', 'modified-z-score'],
    reason: '평균과 표준편차(또는 중앙값과 MAD)로 정규화한 점수로 이상치를 판단하는 알고리즘군입니다.' },
  'leaf-anom-extreme-test': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['grubbs-test', 'generalized-esd-test', 'dixons-q-test'],
    reason: '단일 또는 다수의 극단값이 정규분포에서 벗어났는지 가설검정으로 판단하는 알고리즘군입니다.' },
  'leaf-anom-distance': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['euclidean-distance-detection', 'mahalanobis-distance', 'average-knn-distance', 'kth-nearest-neighbor-distance', 'knn-outlier-detection'],
    reason: '이웃까지의 거리 값 자체를 이상치 점수로 사용하는 거리 기반 알고리즘군입니다.' },
  'leaf-anom-lof-family': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['lof', 'loop', 'cof', 'ldof', 'inflo'],
    reason: '자신과 이웃의 지역 밀도를 비교한 밀도비로 이상치를 판단하는 LOF 계열 알고리즘군입니다.' },
  'leaf-anom-density-cluster': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['kde-outlier-detection', 'ldf', 'loci', 'dbscan-outlier-detection', 'optics-outlier-detection'],
    reason: '커널 밀도 추정이나 군집 구조를 이용해 밀도가 낮은 영역의 데이터를 이상치로 판단하는 알고리즘군입니다.' },
  'leaf-anom-svm-boundary': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['oc-svm', 'svdd'],
    reason: '정상 데이터를 감싸는 하나의 결정경계(초평면 또는 구)를 학습하는 서포트벡터 기반 알고리즘군입니다.' },
  'leaf-anom-isolation-forest': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['isolation-forest', 'extended-isolation-forest'],
    reason: '데이터를 반복적으로 무작위 분할해 적은 분할 횟수로 고립되는 데이터를 이상치로 보는 알고리즘군입니다.' },
  'leaf-anom-hmm': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['hmm-anomaly-detection'],
    reason: '은닉 상태를 가진 순차 모델로 비정상적인 상태 전이를 탐지하는 알고리즘입니다.' },
  'leaf-anom-prob-covariance': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['elliptic-envelope', 'mcd', 'gmm-anomaly-detection'],
    reason: '데이터의 확률분포나 공분산 구조를 추정해 정상 범위를 벗어난 값을 이상치로 판단하는 알고리즘군입니다.' },
  'leaf-anom-score-combination': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['aom', 'moa', 'threshold-sum'],
    reason: '여러 탐지기의 이상치 점수를 평균·최댓값·합계 등 고정된 함수로 결합하는 알고리즘군입니다.' },
  'leaf-anom-diverse-ensemble': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['feature-bagging', 'isolation-forest-ensemble', 'rrcf'],
    reason: '서로 다른 특징 부분집합이나 무작위 트리 구조로 다양성을 준 뒤 결합하는 앙상블 알고리즘군입니다.' },
  'leaf-anom-selective-ensemble': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['lscp', 'suod'],
    reason: '여러 탐지기 중 지역적으로 우수한 것을 선택하거나 확장성을 고려해 결합하는 앙상블 알고리즘군입니다.' },
  'leaf-anom-forecast-residual': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['arima-residual-analysis', 'exponential-smoothing', 'prophet-anomaly-detection'],
    reason: '예측 모델이 만든 예측값과 실제값의 차이(잔차)가 크면 이상치로 보는 알고리즘군입니다.' },
  'leaf-anom-subsequence-similarity': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['matrix-profile', 'discord-discovery'],
    reason: '일정 길이의 부분열끼리 서로의 유사도를 비교해 가장 이질적인 구간을 찾는 알고리즘군입니다.' },
  'leaf-anom-moving-stat': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['moving-average-median', 's-h-esd'],
    reason: '이동평균·이동중앙값이나 계절성을 반영한 통계량으로 이상 시점을 찾는 알고리즘군입니다.' },
  'leaf-anom-subspace-selection': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['feature-selection-for-outlier-detection', 'hics', 'subspace-outlier-detection'],
    reason: '여러 특징(차원) 부분집합 중 이상치가 잘 드러나는 부분공간을 선택하거나 평가하는 알고리즘군입니다.' },
  'leaf-anom-angle-based': { type: 'leaf', category: 'unsup', subcategory: 'anomaly', ids: ['abod', 'fastabod'],
    reason: '한 점에서 다른 점들을 바라보는 각도의 분산으로 이상치를 판단하는 알고리즘군입니다.' },

  /* ── 신경망 기반 비지도학습(unsup/neural) 서브트리 ── */
  neural1: { type: 'question', text: '새로운 데이터(이미지·샘플)를 합성하는 것이 주 목적인가요?', yes: 'neural2', no: 'neural8' },
  neural2: { type: 'question', text: '생성자와 판별자가 서로 경쟁하며 학습하는 GAN(적대적 생성) 계열인가요?', yes: 'neural3', no: 'neural4' },
  neural3: { type: 'question', text: '도메인 간 변환이나 스타일 벡터를 통한 세밀한 제어 등 특수 목적에 특화됐나요?', yes: 'leaf-gan-applied', no: 'leaf-gan-core' },
  neural4: { type: 'question', text: '노이즈를 점진적으로 추가·제거하는 확산(디퓨전) 과정 기반인가요?', yes: 'neural5', no: 'neural6' },
  neural5: { type: 'question', text: '정규분포 기반 잡음제거 단계나 스코어(그래디언트) 추정 등 구체적인 구현 방식인가요? (일반 개념이 아님)', yes: 'leaf-diffusion-methods', no: 'leaf-diffusion-models' },
  neural6: { type: 'question', text: '적대적 판별자를 결합해 잠재분포를 원하는 사전분포에 맞추나요?', yes: 'leaf-aae', no: 'neural7' },
  neural7: { type: 'question', text: '잠재 요인들이 서로 독립적인 의미로 분리되도록 명시적으로 강조한 변형인가요? (β-VAE·Disentangled VAE)', yes: 'leaf-disentangled-vae-family', no: 'leaf-vae' },

  neural8: { type: 'question', text: '생성이 아니라 압축·복원을 통한 표현학습이 목적인 오토인코더인가요?', yes: 'neural9', no: 'neural12' },
  neural9: { type: 'question', text: '여러 층을 순차적으로 쌓거나 승자 유닛만 활성화하는 등 고전적인 구조 변형인가요?', yes: 'leaf-ae-structural', no: 'neural10' },
  neural10: { type: 'question', text: '입력의 상당 부분을 마스킹한 뒤 트랜스포머 등으로 복원하는 최신 방식인가요?', yes: 'leaf-masked-autoencoders', no: 'neural11' },
  neural11: { type: 'question', text: '손실함수에 명시적 정규화 항(노이즈 복원·희소성·자코비안 페널티)을 추가했나요?', yes: 'leaf-ae-regularized', no: 'leaf-ae' },

  neural12: { type: 'question', text: '에너지 함수를 정의해 낮은 에너지 상태로 수렴시키는 에너지 기반 모델인가요?', yes: 'neural13', no: 'neural15' },
  neural13: { type: 'question', text: '가시층-은닉층만 연결된 제한 볼츠만 머신이거나 이를 층층이 쌓은 심층신념망인가요?', yes: 'leaf-rbm-dbn', no: 'neural14' },
  neural14: { type: 'question', text: '뉴런이 완전히 연결되거나 저장된 패턴을 연상 기억으로 복원하는 볼츠만·홉필드 계열인가요?', yes: 'leaf-boltzmann-hopfield', no: 'leaf-contrastive-training' },

  neural15: { type: 'question', text: '레이블 없이 데이터 자체로 만든 보조 과제로 표현을 학습하는 자기지도학습 계열인가요?', yes: 'neural16', no: 'neural20' },
  neural16: { type: 'question', text: '특정 대조·비대조 기법이 아니라 마스크 언어모델링 등 일반적인 사전학습 개념인가요?', yes: 'leaf-ssl-pretraining-general', no: 'neural17' },
  neural17: { type: 'question', text: '데이터 증강으로 만든 양성 쌍과 음성 쌍을 비교하는 대조학습 기반인가요?', yes: 'neural18', no: 'neural19' },
  neural18: { type: 'question', text: '별도의 모멘텀 인코더나 시퀀스 예측 구조 없이, 배치 내 증강 쌍만으로 구성된 기본 프레임워크인가요?', yes: 'leaf-contrastive-core', no: 'leaf-contrastive-specialized' },
  neural19: { type: 'question', text: '음성 쌍 없이 온라인-타깃 네트워크 예측이나 클러스터 할당 교환으로 학습하나요?', yes: 'leaf-noncontrastive-predictive', no: 'leaf-noncontrastive-regularized' },

  neural20: { type: 'question', text: '군집(클러스터) 구조 자체를 학습 목표로 삼는 심층 클러스터링 계열인가요?', yes: 'neural21', no: 'neural25' },
  neural21: { type: 'question', text: '출력 뉴런을 격자 위상으로 배치해 유사한 입력이 인접하도록 학습하는 자기조직화지도(SOM) 계열인가요?', yes: 'leaf-som-family', no: 'neural22' },
  neural22: { type: 'question', text: '격자 위상 없이 경쟁학습으로 뉴런을 데이터 분포에 자유롭게 적응시키는 뉴럴 가스 계열인가요?', yes: 'leaf-neural-gas-family', no: 'neural23' },
  neural23: { type: 'question', text: '재구성 손실과 군집 할당 손실을 함께 최적화하는 임베디드 클러스터링(DEC) 계열인가요?', yes: 'leaf-dec-family', no: 'neural24' },
  neural24: { type: 'question', text: '임베딩 공간에서 K-평균(중심점) 목적함수를 신경망과 함께 최적화하나요?', yes: 'leaf-kmeans-embedding', no: 'leaf-joint-clustering-repr' },

  neural25: { type: 'question', text: '정상 범위를 벗어난 이상치(비정상 패턴) 탐지가 목적인가요?', yes: 'neural26', no: 'leaf-graph-embedding-misc' },
  neural26: { type: 'question', text: 'GAN이나 오토인코더의 재구성 오차 크기로 이상치를 판단하나요?', yes: 'leaf-reconstruction-anomaly', no: 'neural27' },
  neural27: { type: 'question', text: '정상 데이터를 감싸는 초구나 결정경계를 신경망으로 직접 학습하는 원클래스 방식인가요?', yes: 'leaf-oneclass-anomaly', no: 'neural28' },
  neural28: { type: 'question', text: '순환 구조나 팽창 합성곱으로 시계열의 시간적 패턴을 학습해 이상치를 찾나요?', yes: 'leaf-temporal-anomaly', no: 'leaf-self-supervised-anomaly-detection' },

  'leaf-gan-core': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['gan', 'dcgan', 'wgan'],
    reason: '생성자와 판별자의 적대적 경쟁이라는 기본 구조와, 합성곱 아키텍처·바서슈타인 손실 등으로 학습 안정성을 개선한 핵심 GAN 계열입니다.' },
  'leaf-gan-applied': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['cyclegan', 'stylegan'],
    reason: '도메인 간 변환이나 스타일 벡터를 통한 세밀한 이미지 제어 등, 특수 목적에 특화된 GAN 응용 계열입니다.' },
  'leaf-diffusion-methods': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['ddpm', 'score-based-generative-models'],
    reason: '정규분포 기반 잡음제거 단계 또는 데이터 분포의 스코어(그래디언트) 추정으로 구현한 구체적인 확산 생성 모델입니다.' },
  'leaf-diffusion-models': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['diffusion-models'],
    reason: '노이즈를 점진적으로 추가하고 역과정으로 복원하며 데이터를 생성하는 확산 모델의 일반적 개념입니다.' },
  'leaf-aae': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['aae'],
    reason: '판별자를 이용해 잠재 공간의 분포를 원하는 사전분포에 맞추는 적대적 오토인코더입니다.' },
  'leaf-disentangled-vae-family': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['beta-vae', 'disentangled-vae'],
    reason: 'KL 발산 항에 가중치를 부여하거나 구조를 조정해, 잠재 요인들이 서로 독립적인 의미로 분리되도록 학습하는 VAE 계열입니다.' },
  'leaf-vae': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['vae'],
    reason: '인코더-디코더 구조로 잠재 변수의 분포를 학습해 새로운 샘플을 생성하는 변분 오토인코더입니다.' },
  'leaf-ae-structural': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['stacked-autoencoder', 'wta-autoencoder'],
    reason: '여러 층을 순차적으로 쌓아 사전학습하거나, 은닉층에서 승자 유닛만 활성화해 희소성을 강제하는 구조 변형 오토인코더입니다.' },
  'leaf-masked-autoencoders': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['masked-autoencoders'],
    reason: '입력의 상당 부분을 마스킹한 뒤 나머지로부터 원본을 복원하도록 학습하는 트랜스포머 기반 오토인코더입니다.' },
  'leaf-ae-regularized': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['dae', 'sae', 'cae'],
    reason: '입력에 노이즈를 추가하거나 은닉 표현에 희소성·자코비안 페널티를 부여해 강건한 특징을 학습하는 정규화 오토인코더 계열입니다.' },
  'leaf-ae': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['ae'],
    reason: '입력을 압축했다가 복원하며 저차원 표현을 학습하는 가장 기본적인 오토인코더입니다.' },
  'leaf-rbm-dbn': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['rbm', 'dbn'],
    reason: '가시층-은닉층 간 연결만 허용하는 제한 볼츠만 머신과, 이를 여러 층으로 쌓아 사전학습하는 심층 신념 신경망입니다.' },
  'leaf-boltzmann-hopfield': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['boltzmann-machines', 'hopfield-networks', 'modern-hopfield-networks'],
    reason: '뉴런이 완전히 연결되거나 저장된 패턴을 연상 기억으로 복원하는 고전적·현대적 에너지 기반 신경망입니다.' },
  'leaf-contrastive-training': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['contrastive-divergence', 'pcd', 'contrastive-learning-ebm'],
    reason: '표본추출 체인을 매번 새로 시작하거나 이어서 유지하며 에너지 기반 모델을 학습시키는 대조 발산 계열 기법입니다.' },
  'leaf-ssl-pretraining-general': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['bert-pretraining', 'self-supervised-learning'],
    reason: '마스크된 토큰을 예측하거나 데이터 자체에서 만든 보조 과제로 표현을 학습하는 일반적인 자기지도학습 사전학습 기법입니다.' },
  'leaf-contrastive-core': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['contrastive-learning', 'simclr'],
    reason: '데이터 증강으로 만든 양성 쌍과 배치 내 음성 쌍을 비교해 표현을 학습하는 기본 대조학습 프레임워크입니다.' },
  'leaf-contrastive-specialized': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['moco', 'cpc'],
    reason: '모멘텀으로 갱신되는 별도의 키 인코더나 시퀀스 미래 예측 구조를 결합해 대조학습을 확장한 기법입니다.' },
  'leaf-noncontrastive-predictive': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['byol', 'swav'],
    reason: '음성 쌍 없이 온라인-타깃 네트워크의 출력을 서로 예측하거나 클러스터 할당을 교환하며 학습하는 비대조 자기지도학습입니다.' },
  'leaf-noncontrastive-regularized': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['barlow-twins', 'vicreg'],
    reason: '두 뷰의 표현 간 교차상관이나 분산·공분산에 정규화 항을 부여해 붕괴를 방지하는 비대조 자기지도학습입니다.' },
  'leaf-som-family': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['som', 'gsom'],
    reason: '출력 뉴런을 격자 위상으로 배치해 유사한 입력이 인접하도록 학습하는 자기조직화지도와, 필요에 따라 노드를 늘려가는 성장형 변형입니다.' },
  'leaf-neural-gas-family': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['neural-gas', 'growing-neural-gas'],
    reason: '격자 위상 없이 경쟁학습으로 뉴런을 데이터 분포에 적응시키고, 필요에 따라 노드를 추가해 망을 성장시키는 계열입니다.' },
  'leaf-dec-family': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['dec', 'idec'],
    reason: '오토인코더로 얻은 임베딩에서 군집 할당을 함께 최적화하고, 재구성 손실을 유지해 이를 개선한 심층 임베디드 클러스터링 계열입니다.' },
  'leaf-kmeans-embedding': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['dcn', 'dkm'],
    reason: '임베딩 공간에서 K-평균 목적함수를 신경망과 함께(또는 미분 가능하게) 최적화하는 심층 클러스터링 네트워크입니다.' },
  'leaf-joint-clustering-repr': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['dac', 'jule', 'corl'],
    reason: '표현학습과 군집화를 반복적으로 번갈아 수행하거나 적응적으로 레이블을 재할당하며 함께 정제하는 클러스터링 지향 표현학습 계열입니다.' },
  'leaf-reconstruction-anomaly': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['anogan', 'autoencoder-based-detection'],
    reason: 'GAN이나 오토인코더로 정상 데이터를 학습한 뒤, 재구성 오차의 크기로 이상치를 판단하는 기법입니다.' },
  'leaf-oneclass-anomaly': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['deep-svdd', 'oc-nn'],
    reason: '정상 데이터를 감싸는 초구나 결정경계를 신경망으로 직접 학습해 그 밖의 데이터를 이상치로 판단하는 원클래스 기법입니다.' },
  'leaf-temporal-anomaly': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['lstm-anomaly-detection', 'tcn'],
    reason: '순환 구조나 팽창 합성곱으로 시계열의 시간적 패턴을 학습해 비정상적인 흐름을 탐지하는 기법입니다.' },
  'leaf-self-supervised-anomaly-detection': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['self-supervised-anomaly-detection'],
    reason: '레이블 없이 데이터 자체에서 만든 보조 과제로 정상 패턴을 학습해 이상치를 탐지하는 자기지도학습 기법입니다.' },
  'leaf-graph-embedding-misc': { type: 'leaf', category: 'unsup', subcategory: 'neural', ids: ['gnn-dimensionality-reduction', 'neural-network-embeddings'],
    reason: '그래프의 노드-엣지 관계나 학습된 임베딩 공간을 이용해 데이터를 저차원 표현으로 변환하는 신경망 기반 기법입니다.' }
};

/* ── 트리 레이아웃 자동 계산 ──
   DFS(예-분기 우선)로 리프에 순차 x슬롯을 매기고, 내부 질문 노드는 두 자식의 평균 x로 배치.
   리프 개수·트리 깊이가 얼마든 좌표를 손으로 다시 잡을 필요가 없다. */
const LAYOUT_OPTS = { rowHeight: 60, leafPitch: 95, marginX: 55, marginTop: 20 };

function computeLayout() {
  const pos = {};
  let leafIndex = 0;
  function visit(key, depth) {
    const node = FLOW[key];
    const y = LAYOUT_OPTS.marginTop + depth * LAYOUT_OPTS.rowHeight;
    if (node.type === 'leaf') {
      const x = LAYOUT_OPTS.marginX + leafIndex * LAYOUT_OPTS.leafPitch;
      leafIndex++;
      pos[key] = { x, y };
      return x;
    }
    const yesX = visit(node.yes, depth + 1);
    const noX = visit(node.no, depth + 1);
    const x = (yesX + noX) / 2;
    pos[key] = { x, y };
    return x;
  }
  visit(FLOW_START, 0);
  const xs = Object.values(pos).map(p => p.x);
  const ys = Object.values(pos).map(p => p.y);
  return {
    pos,
    width: Math.max(...xs) + LAYOUT_OPTS.marginX,
    height: Math.max(...ys) + LAYOUT_OPTS.rowHeight
  };
}

/* ── 짧은 라벨 (개요도 노드 텍스트) ── */
const NODE_SHORT = {
  q1: '보상학습?', rl1: '모델 인지?', rl2: '모델 제공?', rl_vp: '정책 출력?',
  rl_mbg: 'MCTS?', rl_mbl1: '규칙 필요?', rl_mbl2: '보조입력?', rl_mbl3: '2단계?',
  rl_mbl4: '가치확장?', rl_mbl5: '앙상블모델?', rl_mbl6: '정책학습?', rl_mbl7: '단계분리?',
  rl_pol1: '모방학습?', rl_pol2: 'Critic없음?', rl_pol3: '결정적?', rl_pol4: '시연활용?',
  rl_pol5: '트윈크리틱?', rl_pol6: '엔트로피?', rl_pol7: '신뢰영역?', rl_pol8: '2차최적화?',
  rl_pol9: '자연경사?', rl_pol10: '오프폴리시?', rl_pol11: '대규모분산?', rl_pol12: '경험재현?',
  rl_pol13: '병렬환경?',
  rl_val1: '엔트로피?', rl_val2: '테이블가능?', rl_val3: '온폴리시?', rl_val4: '통합기법?',
  rl_val5: '분포학습?', rl_val6: '재현/탐색?', rl_val7: '잡음추가?', rl_val8: '목표재해석?',
  rl_val9: '부분관측?', rl_val10: '가치/이점분리?', rl_val11: '이중네트워크?',

  q2: '앙상블?', ens1: '부스팅?', ens_boost1: '가중치방식?', ens_boost2: '최신구현체?',
  ens_boost3: '범주형자동?', ens_boost4: '학습속도?',
  ens2: '스태킹?', ens_stack1: '홀드아웃?',
  ens3: '배깅?', ens_bag1: '트리전용?', ens_bag2: '분할무작위?', ens_bag3: '특징추출?', ens_bag4: '복원추출?',
  ens_vote1: '확률평균?',

  q3: '평가지표?', q3a: '지도평가?',
  q4: '레이블?', sup1: '범용모델?', sup2: '연속값?',
  unsup1: '요약변환?', unsupA1: '시각화?', unsupA2: '차원축소?',
  unsupB1: '군집화?', unsupB2: '연관규칙?', unsupB3: '신경망?',

  'leaf-alphazero': 'AlphaZero', 'leaf-dyna-q': 'Dyna-Q',
  'leaf-muzero': 'MuZero', 'leaf-i2a': 'I2A', 'leaf-mbmf': 'MBMF', 'leaf-mbve': 'MBVE',
  'leaf-pets': 'PETS', 'leaf-planet': 'PlaNet', 'leaf-dreamer': 'Dreamer', 'leaf-world-models': 'World Models',
  'leaf-bc': 'BC', 'leaf-reinforce': 'REINFORCE', 'leaf-actor-critic': 'Actor-Critic', 'leaf-nac': 'NAC',
  'leaf-a2c-a3c': 'A2C/A3C', 'leaf-acer': 'ACER', 'leaf-impala': 'IMPALA', 'leaf-off-pac': 'Off-PAC',
  'leaf-ppo': 'PPO', 'leaf-trpo': 'TRPO', 'leaf-ddpg': 'DDPG', 'leaf-ddpgfd': 'DDPGfD',
  'leaf-td3': 'TD3', 'leaf-sac': 'SAC',
  'leaf-q-learning': 'Q-Learning', 'leaf-sarsa': 'SARSA', 'leaf-dqn-qnetwork': 'Q-Net/DQN',
  'leaf-double-dqn': 'Double DQN', 'leaf-dueling-dqn': 'Dueling DQN', 'leaf-drqn': 'DRQN',
  'leaf-distributional-dqn': 'C51/IQN', 'leaf-noisynet': 'NoisyNet', 'leaf-per': 'PER', 'leaf-her': 'HER',
  'leaf-rainbow': 'Rainbow', 'leaf-sql': 'SQL',

  'leaf-adaboost': 'AdaBoost', 'leaf-gbm': 'GBM', 'leaf-catboost': 'CatBoost',
  'leaf-lightgbm': 'LightGBM', 'leaf-xgboost': 'XGBoost',
  'leaf-blending': 'Blending', 'leaf-stacking': 'Stacking',
  'leaf-random-forest': 'RF', 'leaf-extra-trees': 'Extra Trees', 'leaf-bagging': 'Bagging',
  'leaf-pasting': 'Pasting', 'leaf-random-subspace-method': 'Rand.Subspace',
  'leaf-hard-voting': 'Hard Voting', 'leaf-soft-voting': 'Soft Voting',

  /* ── sup/reg-class, sup/regression, sup/classification ── */
  sup_rc1: '트리?', sup_rc2: '판별분석?', sup_rc3: 'SVM?', sup_rc4: 'KNN?',
  sup_rc5: '성분기반?', sup_rc6: 'PCR계열?', sup_rc7: '트랜스포머?', sup_rc8: 'CNN/RNN?',
  sup_cls1: '거리기반?', sup_cls2: '베이즈생성?', sup_cls3: '나이브/GMM?', sup_cls4: '프로빗?',
  sup_reg1: '최적화?', sup_reg2: '뉴턴?', sup_reg3: 'Adam계열?', sup_reg4: '모멘텀?', sup_reg5: 'LR스케줄?',
  sup_reg8: 'GLM?', sup_reg9: '카운트?', sup_reg10: '영과잉?', sup_reg11: '감마/트위디?', sup_reg12: '이항/생존?', sup_reg13: '가법모형?',
  sup_reg15: '다항식?', sup_reg16: '커널/PLS?', sup_reg17: '고차/직교?',
  sup_reg19: '정규화?', sup_reg20: 'L1/L2?', sup_reg21: '비볼록벌점?',
  sup_reg23: '비선형?', sup_reg24: '신경망기반?', sup_reg25: '커널/스플라인?', sup_reg26: '베이즈/혼합?',
  sup_reg28: '강건/분위수?', sup_reg29: '계층/단계적?',

  'leaf-dt': 'DT', 'leaf-lda-qda': 'LDA/QDA', 'leaf-svm': 'SVM', 'leaf-knn': 'K-NN',
  'leaf-pcr-spca': 'PCR/SPCA', 'leaf-pls-plsda': 'PLS/PLS-DA',
  'leaf-transformer': 'Transformer', 'leaf-cnn-rnn': 'CNN/RNN', 'leaf-mlp': 'MLP',
  'leaf-distance-based': '거리분류', 'leaf-naive-bayes-gmm': 'NB/GMM',
  'leaf-bayesian-logistic-network': '베이즈로짓/넷', 'leaf-probit': 'Probit', 'leaf-logistic': '로지스틱',
  'leaf-newton-lbfgs': 'Newton/L-BFGS', 'leaf-adam-adamw': 'Adam/AdamW',
  'leaf-momentum-nag': 'Momentum/NAG', 'leaf-lr-schedule-lookahead': 'LR스케줄', 'leaf-gd-basic': 'GD/SGD',
  'leaf-zero-inflated-hurdle': 'ZI/Hurdle', 'leaf-count-glm': 'Count GLM', 'leaf-gamma-tweedie': 'Gamma/Tweedie',
  'leaf-binomial-cox': 'Binom/Cox', 'leaf-gam-gamlss': 'GAM/GAMLSS', 'leaf-bayesian-regularized-glm': '베이즈/정규GLM',
  'leaf-poly-kernel-pls': '다항+커널/PLS', 'leaf-poly-highorder-orthogonal': '고차/직교다항', 'leaf-poly-basic': '다항회귀',
  'leaf-lasso-ridge-elasticnet': 'Lasso/Ridge/EN', 'leaf-mcp-scad': 'MCP/SCAD', 'leaf-adaptive-group-lasso': '적응/그룹라쏘',
  'leaf-neural-physics-dgp': '신경망/물리/DGP', 'leaf-kernel-spline-functional': '커널/스플라인',
  'leaf-bayesian-mixture-nonlinear': '베이즈/혼합비선형', 'leaf-nls-robust-nonlinear': 'NLS/강건비선형',
  'leaf-robust-quantile': '강건/분위수', 'leaf-hierarchical-stepwise': '위계/단계적', 'leaf-linear-regression': '선형회귀',

  /* ── unsup/visualization, unsup/association, unsup/anomaly ── */
  viz1: '기본차트?', viz2: '막대형?', viz3: '누적막대?', viz4: '원형비율?', viz5: '도넛?',
  viz6: '분포?', viz7: '요약통계?', viz8: '관계표현?', viz9: '개별점?', viz10: '육각집계?',
  viz11: '입체구조?', viz12: '격자히트맵?',
  'leaf-viz-bar': '막대', 'leaf-viz-stacked-bar': '누적막대', 'leaf-viz-pie': '파이', 'leaf-viz-donut': '도넛',
  'leaf-viz-line-area': '선/영역', 'leaf-viz-hist-box': '히스토그램/박스', 'leaf-viz-kde-violin': 'KDE/바이올린',
  'leaf-viz-hexbin': '육각빈', 'leaf-viz-scatter-bubble': '산점도/버블', 'leaf-viz-multivar': '페어/평행좌표',
  'leaf-viz-3d-contour': '3D/등고선', 'leaf-viz-heatmap': '히트맵', 'leaf-viz-timeseries-embed': '시계열/임베딩',

  assoc1: '동시구매?', assoc2: '후보생성?', assoc3: 'FP트리?', assoc4: '트리구성?', assoc5: '수직형식?',
  assoc6: '차집합?', assoc7: '하이퍼링크?', assoc8: 'IT트리?', assoc9: '순차패턴?', assoc10: '후보시퀀스?',
  assoc11: '폐쇄패턴?', assoc12: '비트맵?', assoc13: '특수규칙?', assoc14: '수치/퍼지?', assoc15: '다차원/계층?',
  assoc16: '부정/희소?', assoc17: '구조패턴?', assoc18: '그래프?', assoc19: '스트림?', assoc20: '에피소드?',
  'leaf-assoc-apriori': 'Apriori', 'leaf-assoc-fp-tree': 'FP-Tree구성', 'leaf-assoc-fp-growth': 'FP-Growth',
  'leaf-assoc-declat': 'dEclat', 'leaf-assoc-eclat': 'Eclat', 'leaf-assoc-hmine': 'H-Mine',
  'leaf-assoc-charm': 'CHARM', 'leaf-assoc-lcm': 'LCM', 'leaf-assoc-gsp': 'GSP',
  'leaf-assoc-clospan-bide': 'CloSpan/BIDE', 'leaf-assoc-spade-spam': 'SPADE/SPAM',
  'leaf-assoc-freespan-prefixspan': 'FreeSpan/PrefixSpan', 'leaf-assoc-fuzzy-quant': '퍼지/정량',
  'leaf-assoc-multidim-multilevel': '다차원/다계층', 'leaf-assoc-negative-rare': '부정/희소',
  'leaf-assoc-spatial-temporal': '공간/시간', 'leaf-assoc-graph': '그래프패턴', 'leaf-assoc-tree': '트리패턴',
  'leaf-assoc-stream': '스트림패턴', 'leaf-assoc-episode': '에피소드', 'leaf-assoc-utility': '유틸리티마이닝',

  anom1: '통계검정?', anom2: '거리/밀도?', anom3: '모델기반?', anom4: '앙상블?', anom5: '시계열?',
  anom6: '히스토그램?', anom7: '카이제곱?', anom8: 'IQR?', anom9: '표준화점수?',
  anom10: '거리값?', anom11: '밀도비?', anom12: 'SVM경계?', anom13: '고립트리?', anom14: '순차모델?',
  anom15: '점수결합?', anom16: '다양성앙상블?', anom17: '잔차기반?', anom18: '부분열유사?', anom19: '부분공간선택?',
  'leaf-anom-hbos': 'HBOS', 'leaf-anom-chisq': '카이제곱검정', 'leaf-anom-iqr': 'IQR',
  'leaf-anom-zscore': 'Z-점수류', 'leaf-anom-extreme-test': '극단값검정류', 'leaf-anom-distance': '거리기반',
  'leaf-anom-lof-family': 'LOF계열', 'leaf-anom-density-cluster': '밀도/군집기반', 'leaf-anom-svm-boundary': 'SVM경계류',
  'leaf-anom-isolation-forest': '고립포레스트류', 'leaf-anom-hmm': 'HMM탐지', 'leaf-anom-prob-covariance': '확률/공분산류',
  'leaf-anom-score-combination': '점수결합류', 'leaf-anom-diverse-ensemble': '다양성앙상블', 'leaf-anom-selective-ensemble': '선택적앙상블',
  'leaf-anom-forecast-residual': '예측잔차류', 'leaf-anom-subsequence-similarity': '부분열유사도', 'leaf-anom-moving-stat': '이동통계류',
  'leaf-anom-subspace-selection': '부분공간선택', 'leaf-anom-angle-based': '각도기반',

  /* ── unsup/neural ── */
  neural1: '생성목적?', neural2: 'GAN계열?', neural3: 'GAN응용?', neural4: '확산과정?',
  neural5: '구체구현?', neural6: '적대정규화?', neural7: '분리표현?',
  neural8: '비생성AE?', neural9: '구조변형?', neural10: '마스킹복원?', neural11: '정규화항?',
  neural12: '에너지기반?', neural13: 'RBM기반?', neural14: '볼츠만/홉필드?',
  neural15: '자기지도?', neural16: '일반사전학습?', neural17: '대조학습?', neural18: '기본프레임워크?', neural19: '비대조학습?',
  neural20: '심층군집?', neural21: 'SOM계열?', neural22: '뉴럴가스?', neural23: 'DEC계열?', neural24: 'K평균임베딩?',
  neural25: '이상치탐지?', neural26: '재구성오차?', neural27: '원클래스?', neural28: '시계열패턴?',
  'leaf-gan-core': 'GAN기초', 'leaf-gan-applied': 'GAN응용',
  'leaf-diffusion-methods': 'DDPM/SGM', 'leaf-diffusion-models': 'Diffusion',
  'leaf-aae': 'AAE', 'leaf-disentangled-vae-family': 'β-VAE류', 'leaf-vae': 'VAE',
  'leaf-ae-structural': 'AE구조변형', 'leaf-masked-autoencoders': 'MAE',
  'leaf-ae-regularized': 'AE정규화류', 'leaf-ae': 'AE',
  'leaf-rbm-dbn': 'RBM/DBN', 'leaf-boltzmann-hopfield': '볼츠만/홉필드', 'leaf-contrastive-training': 'CD/PCD',
  'leaf-ssl-pretraining-general': 'SSL사전학습', 'leaf-contrastive-core': 'SimCLR류',
  'leaf-contrastive-specialized': 'MoCo/CPC', 'leaf-noncontrastive-predictive': 'BYOL/SwAV',
  'leaf-noncontrastive-regularized': 'Barlow/VICReg',
  'leaf-som-family': 'SOM류', 'leaf-neural-gas-family': 'Neural Gas류', 'leaf-dec-family': 'DEC류',
  'leaf-kmeans-embedding': 'DCN/DKM', 'leaf-joint-clustering-repr': 'DAC/JULE류',
  'leaf-reconstruction-anomaly': '재구성이상탐지', 'leaf-oneclass-anomaly': 'SVDD/OC-NN',
  'leaf-temporal-anomaly': 'LSTM/TCN', 'leaf-self-supervised-anomaly-detection': 'SSL이상탐지',
  'leaf-graph-embedding-misc': 'GNN/임베딩',

  /* ── unsup/clustering ── */
  clu1: '그래프?', clu2: '이중군집?', clu3: '격자?', clu4: '밀도?', clu5: '부분공간?',
  clu_sub1: '저계수?', clu6: '계층적?', clu7: '확률모델?',
  clu_f1: '메시지전파?', clu_f2: '스펙트럴?',
  clu_i1: 'SVD?', clu_i2: '이진블록?', clu_i3: '순서보존?', clu_i4: '지역탐색?',
  clu_d1: '웨이블릿?', clu_d2: '계층격자?', clu_d3: '최적분할?', clu_d4: '적응구간?', clu_d5: '조밀단위?',
  clu_c1: 'DBSCAN변형?', clu_c2: '계층밀도?', clu_c3: '모드탐색?',
  clu_h1: '저계수규제?', clu_h2: '엘라스틱넷?',
  clu_g1: '하향식?', clu_g2: '임의방향?', clu_g3: '상향식?', clu_g4: '선호도가중?',
  clu_b1: '대용량?', clu_b2: '링크고려?', clu_b3: '베이지안?', clu_b4: '고전구현?',
  clu_e1: '개념형성?', clu_e2: '토픽모델?', clu_e3: '방향데이터?', clu_e4: '변분추론?',
  clu_a1: '범주형?', clu_a2: '혼합형?', clu_a3: '퍼지?', clu_a4: '가능론적?',
  clu_a5: '메도이드?', clu_a6: 'K자동?', clu_a7: '미니배치?', clu_a8: '확률초기화?',
  'leaf-affinity-propagation': 'Affinity Prop.',
  'leaf-spectral-clustering-variants': 'Spectral 계열',
  'leaf-community-detection': '커뮤니티 탐지',
  'leaf-spectral-cobiclustering': 'Spectral Co/Bi',
  'leaf-bimax': 'Bimax', 'leaf-opsm': 'OPSM',
  'leaf-residue-signature-biclustering': 'Cheng-Church/ISA',
  'leaf-statistical-model-biclustering': 'Plaid/xMOTIFs/FABIA',
  'leaf-wavecluster': 'WaveCluster', 'leaf-sting': 'STING', 'leaf-optigrid': 'OptiGrid',
  'leaf-mafia': 'MAFIA', 'leaf-clique': 'CLIQUE', 'leaf-gridclus': 'GridClus',
  'leaf-dbscan-variants': 'DBSCAN 계열',
  'leaf-hierarchical-density-clustering': 'HDBSCAN/OPTICS',
  'leaf-mode-seeking-clustering': 'Mean-Shift/DENCLUE',
  'leaf-density-peaks-clustering': 'DPC',
  'leaf-lrr': 'LRR', 'leaf-ensc': 'EnSC', 'leaf-ssc': 'SSC',
  'leaf-proclus': 'PROCLUS', 'leaf-orclus': 'ORCLUS', 'leaf-subclu': 'SUBCLU',
  'leaf-predecon': 'PreDeCon', 'leaf-fires-p3c': 'FIRES/P3C',
  'leaf-birch-cure': 'BIRCH/CURE', 'leaf-rock-chameleon': 'ROCK/Chameleon',
  'leaf-bayesian-hierarchical-clustering': 'Bayesian HC',
  'leaf-agnes-diana': 'AGNES/DIANA', 'leaf-hierarchical-clustering-generic': 'Hierarchical',
  'leaf-cobweb-classit': 'COBWEB/CLASSIT', 'leaf-lda-clustering': 'LDA 군집',
  'leaf-vmf-mixture': 'vMF Mixture', 'leaf-vbgm': 'VBGM', 'leaf-gmm-em': 'GMM/EM',
  'leaf-kprototypes': 'K-Prototypes', 'leaf-kmodes': 'K-Modes',
  'leaf-possibilistic-c-means': 'PCM', 'leaf-fuzzy-c-means': 'FCM',
  'leaf-kmedoids-pam': 'K-Medoids', 'leaf-x-means-g-means': 'X/G-Means',
  'leaf-minibatch-kmeans': 'MB K-Means', 'leaf-kmeans-plusplus': 'K-Means++',
  'leaf-kmeans': 'K-Means',

  /* ── unsup/dim-reduction, unsup/density-covariance ── */
  dimred1: '선형변환?', dimred2: '비선형매니폴드?', dimred_prob1: '토픽계열?',
  dimred_lin1: 'PCA계열?', dimred_lin2: 'SVD계열?', dimred_lin3: '사전학습?',
  dimred_lin4: 'ICA계열?', dimred_lin5: '랜덤투영?',
  dimred_nl1: 't-SNE계열?', dimred_nl2: 'UMAP계열?', dimred_nl3: 'LLE계열?', dimred_nl4: '측지/스펙트럴?',
  'leaf-pca-family': 'PCA계열', 'leaf-svd-family': 'SVD계열', 'leaf-dict-nmf-family': '사전학습/NMF',
  'leaf-ica-family': 'ICA계열', 'leaf-random-projection-family': '랜덤투영', 'leaf-factor-analysis-family': '요인분석',
  'leaf-tsne-family': 't-SNE계열', 'leaf-umap-family': 'UMAP계열', 'leaf-lle-family': 'LLE계열',
  'leaf-isomap-spectral-family': 'Isomap/스펙트럴', 'leaf-mds-family': 'MDS계열',
  'leaf-latent-topic': '토픽모델링', 'leaf-multiview-cca': 'CCA/다중뷰',

  denscov1: '밀도추정?', denscov_dens1: '히스토그램?', denscov_dens2: 'KDE계열?',
  denscov_dens3: '파라메트릭?', denscov_dens4: '신경망플로우?', denscov_dens5: '코퓰라?',
  denscov_kde1: '커널종류?', denscov_kde2: '대역폭선택?',
  denscov_cov1: '기본추정?', denscov_cov2: '축소추정?', denscov_cov3: '희소그래프?',
  denscov_cov4: '강건추정?', denscov_cov5: '밴드/블록?', denscov_cov6: '요인/크로네커?',
  'leaf-histogram-family': '히스토그램', 'leaf-kde-kernel-family': 'KDE커널', 'leaf-kde-bandwidth-family': 'KDE대역폭',
  'leaf-kde-variant-family': 'KDE변형', 'leaf-parametric-mixture-family': '파라메트릭혼합',
  'leaf-neural-flow-family': '신경망플로우', 'leaf-copula-family': '코퓰라', 'leaf-nonparametric-other-family': '비모수기타',
  'leaf-basic-covariance-family': '기본공분산', 'leaf-shrinkage-family': '축소공분산', 'leaf-sparse-graph-family': '희소그래프',
  'leaf-robust-covariance-family': '강건공분산', 'leaf-structured-banded-family': '밴드/블록',
  'leaf-structured-factor-family': '요인/크로네커', 'leaf-regularized-threshold-family': '정규화/임계',

  /* ── sup/evaluation, unsup/evaluation ── */
  supeval1: '회귀/분류?', supeval2: '크기지표?', supeval3: '제곱오차?', supeval4: '로그적용?',
  supeval5: '단일지표?', supeval6: '정확도?', supeval7: '표형태?', supeval8: 'ROC관련?',
  supeval9: '해석용?', supeval10: 'SHAP?', supeval11: '성능곡선?', supeval12: '학습과정?', supeval13: '확률보정?',
  'leaf-reg-ratio': '비율/R²', 'leaf-reg-absolute': '절대오차', 'leaf-reg-squared': '제곱오차',
  'leaf-reg-log-squared': '로그오차', 'leaf-confusion-matrix': '혼동행렬', 'leaf-accuracy-error': '정확도/오류율',
  'leaf-roc-family': 'ROC계열', 'leaf-precision-recall-f1': 'PR/F1', 'leaf-shap': 'SHAP',
  'leaf-feature-effect-plots': '중요도/PDP', 'leaf-perf-curve-viz': '혼동맵/PR곡선',
  'leaf-learning-curve': '학습곡선', 'leaf-calibration': '보정곡선', 'leaf-boundary-residual': '경계/잔차',

  unsupeval1: '군집품질?', unsupeval2: '연관규칙?', unsupeval3: '구조보존?', unsupeval4: '탐지성능?', unsupeval5: '생성품질?',
  unsupeval6: 'k선택?', unsupeval7: '잡음비율?', unsupeval8: '응집+분리?', unsupeval9: '클수록좋음?', unsupeval10: '개별계산?',
  unsupeval11: '기본비율?', unsupeval12: '통계/정보?', unsupeval13: '지지/신뢰?', unsupeval14: '차값비교?', unsupeval15: '반례기준?',
  unsupeval16: '독립검정?', unsupeval17: '엔트로피?', unsupeval18: '오즈비?', unsupeval19: '대칭유사도?', unsupeval20: 'Q/Y정규화?',
  unsupeval21: '분산설명?', unsupeval22: '이웃보존?', unsupeval23: '방향구분?', unsupeval24: '거리비교?', unsupeval25: '정렬오차?', unsupeval26: '가중오차?',
  unsupeval27: '곡선기반?', unsupeval28: '경로길이?',
  unsupeval29: '화질유사도?', unsupeval30: '지각특징?', unsupeval31: '다운스트림?', unsupeval32: '로그우도?',
  unsupeval33: '분포검정?', unsupeval34: '우도기준?', unsupeval35: '적분오차?', unsupeval36: '행렬오차?',
  'leaf-cluster-count': 'k결정', 'leaf-dbscan-noise': 'DBSCAN잡음', 'leaf-connectivity': 'Connectivity',
  'leaf-db-xie-beni': 'DBI/XBI', 'leaf-silhouette': 'Silhouette', 'leaf-chi-dunn': 'CHI/Dunn',
  'leaf-support-confidence': '지지/신뢰', 'leaf-leverage': 'Leverage', 'leaf-conviction': 'Conviction', 'leaf-lift': 'Lift',
  'leaf-chi-square-assoc': '카이제곱', 'leaf-information-gain': '정보이득', 'leaf-collective-cf-ps': 'CF/CS/PS',
  'leaf-symmetric-similarity': 'Jaccard류', 'leaf-zhangs': "Zhang's", 'leaf-yules': "Yule's Q/Y", 'leaf-phi-odds': 'Phi/Odds',
  'leaf-variance-explained': '분산설명력', 'leaf-trust-continuity': 'Trust/Cont', 'leaf-neighborhood-lcmc': '이웃/LCMC',
  'leaf-reconstruction-mi': '재구성/MI', 'leaf-procrustes': 'Procrustes', 'leaf-sammon': 'Sammon', 'leaf-stress-rho': 'Stress/ρ',
  'leaf-curve-based-anomaly': 'ROC/PR/AP', 'leaf-isolation-metrics': '고립경로', 'leaf-f1-mcc': 'F1/MCC',
  'leaf-perceptual-similarity': 'FID/LPIPS', 'leaf-pixel-similarity': 'PSNR/SSIM', 'leaf-representation-quality': 'kNN/Probe',
  'leaf-likelihood-based-generative': 'ELBO/PPL', 'leaf-diversity-distribution': 'IS/PRD',
  'leaf-goodness-of-fit-test': 'KS/AD', 'leaf-likelihood-criteria': 'AIC-BIC', 'leaf-density-integrated-error': 'ISE/MISE',
  'leaf-matrix-estimation-error': '행렬오차', 'leaf-divergence-cv': 'KL/CV'
};

let zoom = null; /* null이면 다음 렌더에서 컨테이너 폭에 맞춰 자동 계산 */
let layoutCache = null;

/* 트리가 계속 커지므로 "컨테이너 폭에 맞추기"는 결국 글자를 읽을 수 없는 크기로 수렴한다.
   그래서 기본값은 항상 읽을 수 있는 실제 크기(100%)로 고정하고, 전체를 보고 싶으면
   사용자가 직접 축소(-)하도록 한다. */
function computeFitZoom() { return 1; }

function applyZoom() {
  if (!layoutCache) return;
  const svg = document.querySelector('#mapOverview svg');
  if (!svg) return;
  svg.style.width = Math.round(layoutCache.width * zoom) + 'px';
  svg.style.height = Math.round(layoutCache.height * zoom) + 'px';
  const label = document.getElementById('mapZoomLabel');
  if (label) label.textContent = Math.round(zoom * 100) + '%';
}

function renderOverview() {
  const wrap = document.getElementById('mapOverview');
  const prevScrollEl = wrap.querySelector('.map-ov-scroll');
  const prevScroll = prevScrollEl ? { left: prevScrollEl.scrollLeft, top: prevScrollEl.scrollTop } : null;
  /* 최종 결과(리프) 카드는 질문 카드보다 내용이 많아 세로로 더 필요하므로,
     결과 화면에서는 다이어그램 높이를 줄여 그 아래 결과 상자가 화면에 들어오게 한다 */
  wrap.classList.toggle('is-leaf', FLOW[current].type === 'leaf');
  const layout = computeLayout();
  layoutCache = layout;
  const { pos: NODE_POS, width: OVERVIEW_W, height: OVERVIEW_H } = layout;

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
    const title = n.type === 'question' ? n.text : `${CAT_LABEL[n.category]} · ${NODE_SHORT[key]} (${leafCount(n)}개)`;
    return `
      <g class="map-ov-node">
        <title>${title}</title>
        <rect x="${pos.x - w / 2}" y="${pos.y - h / 2}" width="${w}" height="${h}" rx="${isLeaf ? 14 : 6}"
          fill="${fill}" stroke="${stroke}" stroke-width="${isCurrent ? 2.5 : 1.5}" />
        <text x="${pos.x}" y="${pos.y + 3.2}" text-anchor="middle" font-size="9" font-weight="700" fill="${textColor}">${NODE_SHORT[key]}</text>
      </g>`;
  }).join('');

  wrap.innerHTML = `
    <div class="map-ov-scroll">
      <svg viewBox="0 0 ${OVERVIEW_W} ${OVERVIEW_H}" preserveAspectRatio="xMidYMid meet">${edgesSvg}${nodesSvg}</svg>
    </div>
    <div class="map-ov-zoom">
      <button type="button" class="map-ov-zoom-btn" data-zoom="out" aria-label="축소">−</button>
      <span id="mapZoomLabel" class="map-ov-zoom-label">100%</span>
      <button type="button" class="map-ov-zoom-btn" data-zoom="in" aria-label="확대">+</button>
      <button type="button" class="map-ov-zoom-btn map-ov-zoom-fit" data-zoom="fit" aria-label="기본 크기(100%)로">100%</button>
    </div>
  `;

  wrap.querySelector('.map-ov-zoom').addEventListener('click', e => {
    const btn = e.target.closest('button[data-zoom]');
    if (!btn) return;
    if (btn.dataset.zoom === 'in') zoom = Math.min(4, zoom * 1.25);
    else if (btn.dataset.zoom === 'out') zoom = Math.max(0.15, zoom * 0.8);
    else zoom = computeFitZoom();
    applyZoom();
  });

  if (zoom == null) zoom = computeFitZoom();
  applyZoom();
  /* innerHTML을 통째로 다시 그리면 스크롤 컨테이너가 새로 생겨 위치가 (0,0)으로
     리셋된다. 그 상태로 다음 위치까지 애니메이션하면 매번 화면이 좌상단으로
     튀었다가 이동하는 것처럼 보이므로, 직전 스크롤 위치를 즉시(애니메이션 없이)
     복원한 뒤 그 지점에서부터 새 위치로 부드럽게 이어서 이동한다. */
  if (prevScroll) {
    const scrollEl = wrap.querySelector('.map-ov-scroll');
    if (scrollEl) { scrollEl.scrollLeft = prevScroll.left; scrollEl.scrollTop = prevScroll.top; }
  }
  /* 아직 아무 답변도 하지 않은 최초 진입 상태에서도 루트 노드가 가로 중앙에 오도록 맞춘다
     (트리 좌표가 훨씬 넓어져, 스크롤 맨 왼쪽=루트가 아니게 되었기 때문) */
  focusOnCurrentNode({ bumpZoom: path.length > 0, smooth: path.length > 0 });
}

/* 질문에 답할 때마다(또는 최초 진입 시 루트를 보여줄 때) 현재 노드 위치로 이동한다.
   사용자가 이미 더 크게 확대해 뒀다면 그 배율은 존중하고,
   기본(100%)처럼 너무 축소된 상태일 때만(그리고 실제로 답변을 진행 중일 때만) 보기 편한 배율로 끌어올린다. */
function focusOnCurrentNode(opts) {
  opts = opts || {};
  if (!layoutCache) return;
  const pos = layoutCache.pos[current];
  if (!pos) return;
  const scrollEl = document.querySelector('#mapOverview .map-ov-scroll');
  if (!scrollEl) return;
  const FOCUS_ZOOM = 1.4;
  if (opts.bumpZoom && zoom < FOCUS_ZOOM) { zoom = FOCUS_ZOOM; applyZoom(); }
  const targetLeft = Math.max(0, pos.x * zoom - scrollEl.clientWidth / 2);
  const targetTop = Math.max(0, pos.y * zoom - scrollEl.clientHeight / 2);
  scrollEl.scrollTo({ left: targetLeft, top: targetTop, behavior: opts.smooth === false ? 'auto' : 'smooth' });
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
        <p class="map-result-reason">${node.reason} (${leafCount(node)}개 알고리즘 수록)</p>
        <div class="map-result-links">
          <a class="map-result-link primary" href="${leafLink(node)}">이 분류의 알고리즘 보기 →</a>
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
