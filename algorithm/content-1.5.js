/* ── AI알고리즘 교과서 데이터 : [1.5] 이상치 탐지 (Anomaly/Outlier Detection) ── */
/* List3.md 기준. subcategory: 'anomaly' = [1.5] 전체 (1.5.1~1.5.7) */
const CONTENT_1_5 = [

  /* ================= [1.5.1] Statistical Methods (통계 기반 방법) ================= */
  {
    id: 'chi-square-test-outlier',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '카이제곱 검정 (Chi-Square Test)',
    subtitle: '관측빈도와 기대빈도의 차이를 통계적으로 검정해 이상치를 판별하는 기법',
    overview: `<p>카이제곱 적합도 검정을 이상치 탐지에 응용한 방법으로, 관측된 빈도분포가 가정된 기대 분포(정규분포 등)에서 얼마나
    벗어나는지를 통계량으로 계산합니다. 다변량 정규분포를 가정하면 마할라노비스 거리의 제곱이 카이제곱 분포를 따른다는 성질을
    이용해 이상치 판정 임계값을 통계적으로 설정할 수 있습니다.</p>`,
    formula: `&#967;&#178; = &#8721; (O&#7522; - E&#7522;)&#178; / E&#7522;`,
    features: `<p><strong>장점</strong> — 통계적 근거가 명확하고 임계값을 유의수준(p-value)으로 해석할 수 있습니다.</p>
    <p><strong>단점</strong> — 범주형 데이터 또는 정규분포 가정에 의존하며, 표본이 작으면 검정력이 떨어지고 연속형 데이터는 사전에
    이산화(binning)해야 합니다.</p>`,
    applications: `<p>품질관리 공정에서 규격 이탈 검출, 로그·설문 데이터의 범주별 빈도 이상 탐지, 다변량 정규성을 가정한 이상치 컷오프
    설정 등에 사용됩니다. Python scipy.stats.chisquare 또는 chi2 분포 함수로 구현할 수 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'dixons-q-test',
    category: 'unsup',
    subcategory: 'anomaly',
    title: "딕슨 Q 검정 (Dixon's Q Test)",
    subtitle: '소표본에서 최댓값·최솟값이 이상치인지 범위 기반으로 판정하는 통계 검정',
    overview: `<p>정렬된 소표본(대략 n=3~30)에서 의심되는 극값과 그다음으로 가까운 값의 차이를 전체 범위(최댓값-최솟값)로 나눈
    Q 통계량을 계산해 표에 정리된 임계값과 비교합니다. 한 표본에 이상치가 하나만 있다고 가정하는 단일 이상치 탐지에 특화된
    고전적 기법입니다.</p>`,
    formula: `Q = |x&#7523;&#7794;&#7523;&#7523;&#7524;&#7495;&#7581;&#7581; - x&#7495;&#7515;&#7495;&#7523;&#7523;&#7495;&#7523;&#7521;| / (x&#7495;&#7495;&#7522; - x&#7495;&#7522;&#7515;)`,
    features: `<p><strong>장점</strong> — 계산이 매우 간단해 소표본 실험 데이터에 손쉽게 적용할 수 있습니다.</p>
    <p><strong>단점</strong> — 표본당 하나의 이상치만 가정하므로 여러 이상치가 있으면 서로를 가려버리는 마스킹(masking) 문제가
    발생하고, 표본 크기가 30을 넘으면 부적절하며 정규분포를 가정합니다.</p>`,
    applications: `<p>분석화학·실험실 반복측정에서 이상 측정값 스크리닝, 소규모 품질검사 데이터에서 특이값을 판별하는 용도로
    ASTM 등 산업 표준 시험법에도 채택되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'generalized-esd-test',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '일반화 극단 스튜던트화 편차 검정 (Generalized ESD Test)',
    subtitle: '이상치 개수를 정확히 모를 때 상한 개수까지 순차적으로 검정하는 확장된 Grubbs 검정',
    overview: `<p>Rosner(1983)가 제안한 방법으로, 표본에서 가장 큰 편차를 갖는 값을 하나씩 제거해가며 최대 r개(사용자가 지정한
    상한)까지 순차적으로 검정 통계량을 계산합니다. 각 단계의 통계량을 해당 단계의 임계값과 비교해 실제 이상치 개수를 자동으로
    판정하므로, 단일 이상치만 다루는 Grubbs 검정의 마스킹 문제를 완화합니다.</p>`,
    formula: `R&#7522; = max|x&#7522; - x&#772;| / s ,&nbsp;&nbsp; &#955;&#7522; = (n-i)t&#7580;&#8330;&#8203;&#8203; / &#8730;((n-i-1+t&#178;)(n-i+1))`,
    features: `<p><strong>장점</strong> — 이상치 개수를 정확히 몰라도 상한만 지정하면 되고, 다중 이상치에 대해 Grubbs 검정보다
    강건합니다.</p>
    <p><strong>단점</strong> — 여전히 정규분포 가정이 필요하고, 상한 r을 잘못 설정하면 이상치를 놓치거나 과다 검출할 수
    있습니다.</p>`,
    applications: `<p>대기질·수질 모니터링의 다중 이상측정 스크리닝, 임상시험 데이터 정제 등에 사용되며, Twitter의
    S-H-ESD(Seasonal Hybrid ESD) 시계열 이상탐지 알고리즘의 핵심 통계 검정으로도 활용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'grubbs-test',
    category: 'unsup',
    subcategory: 'anomaly',
    title: "그럽스 검정 (Grubbs' Test)",
    subtitle: '정규분포를 따르는 단변량 데이터에서 단일 극값 이상치를 검정하는 통계 기법',
    overview: `<p>ESD(Extreme Studentized Deviate) 검정이라고도 불리며, 표본평균으로부터 가장 크게 벗어난 값의 표준화 편차를
    G 통계량으로 계산해 t분포 기반 임계값과 비교합니다. 한 번에 하나의 이상치만 검정할 수 있어, 여러 이상치가 있으면 반복
    적용하거나 Generalized ESD로 확장해야 합니다.</p>`,
    formula: `G = max|x&#7522; - x&#772;| / s ,&nbsp;&nbsp; G&#8347;&#8337;&#8305;&#7580; = ((n-1)/&#8730;n)&#183;&#8730;(t&#178;&#8341;/(2n),n-2 / (n-2+t&#178;&#8341;/(2n),n-2))`,
    features: `<p><strong>장점</strong> — 통계적으로 엄밀한 유의수준 기반 판정이 가능합니다.</p>
    <p><strong>단점</strong> — 정규분포 가정이 필수이며, 마스킹·스와핑(swamping) 문제로 다중 이상치에는 적합하지 않습니다.</p>`,
    applications: `<p>실험계측 데이터의 단일 이상값 검정, 통계적 품질관리(SQC) 관리도에서 이탈점을 확인하는 용도로
    사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'hbos',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '히스토그램 기반 이상치 점수 (HBOS, Histogram-Based Outlier Score)',
    subtitle: '특성별 히스토그램 밀도를 독립적으로 결합해 매우 빠르게 이상치를 채점하는 기법',
    overview: `<p>Goldstein & Dengel(2012)이 제안했습니다. 각 특성마다 정적 또는 동적 폭 히스토그램을 만들어 해당 구간의 상대
    밀도의 역수를 특성별 이상치 점수로 삼고, 특성 간 독립을 가정해 전체 점수를 각 차원 점수의 합(로그 영역)으로 계산합니다.
    나이브 베이즈처럼 특성 독립을 가정함으로써 선형 시간에 계산이 끝나는 것이 핵심입니다.</p>`,
    formula: `HBOS(p) = &#8721;&#7522;&#8331;&#8331;&#8331; log(1 / hist&#7522;(p))`,
    features: `<p><strong>장점</strong> — 다른 알고리즘 대비 5~7배 이상 빠르며 전역(global) 이상치 탐지에 강합니다.</p>
    <p><strong>단점</strong> — 특성 간 독립 가정 때문에 국소(local) 이상치나 특성 간 상관관계를 반영하지 못합니다.</p>`,
    applications: `<p>대용량 로그 데이터의 실시간 이상탐지 전처리, 여러 탐지기를 결합하는 앙상블(SUOD 등)의 빠른 베이스 탐지기로
    활용됩니다. PyOD 라이브러리의 HBOS 클래스로 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'iqr-method',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '사분위수 범위 방법 (IQR, Interquartile Range Method)',
    subtitle: '1사분위수와 3사분위수 사이 범위를 벗어난 값을 이상치로 판단하는 강건한 기법',
    overview: `<p>데이터의 25%(Q1)와 75%(Q3) 지점을 구해 IQR = Q3-Q1을 계산하고, Q1-1.5&#183;IQR 미만 또는
    Q3+1.5&#183;IQR 초과인 값을 이상치로 분류합니다. 박스플롯의 수염(whisker) 기준과 동일하며, 평균·표준편차 대신 중앙값 기반
    통계량을 사용해 이상치 자체의 영향을 덜 받습니다.</p>`,
    formula: `이상치 조건: x &lt; Q1 - 1.5&#183;IQR &nbsp;또는&nbsp; x &gt; Q3 + 1.5&#183;IQR &nbsp;&nbsp;(IQR = Q3 - Q1)`,
    features: `<p><strong>장점</strong> — 분포 가정이 없고 이상치에 강건하며 계산이 매우 간단합니다.</p>
    <p><strong>단점</strong> — 임계 계수(1.5)가 경험적으로 정해진 값이고, 다봉분포나 다변량 데이터에는 그대로 적용하기
    어렵습니다.</p>`,
    applications: `<p>탐색적 데이터분석(EDA)의 기본 이상치 스크리닝, 박스플롯 시각화와 결합한 품질관리, 데이터 전처리 파이프라인의
    1차 필터로 가장 널리 사용되는 방법입니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'modified-z-score',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '수정 Z-점수 (Modified Z-Score, MAD 기반)',
    subtitle: '평균·표준편차 대신 중앙값과 중앙값절대편차(MAD)를 사용해 강건성을 높인 Z-점수',
    overview: `<p>표준 Z-점수는 평균·표준편차 자체가 이상치에 민감해 왜곡될 수 있습니다. Iglewicz & Hoaglin(1993)이 제안한
    수정판은 중앙값(median)과 MAD(중앙값절대편차)를 사용해 이상치가 통계량 자체를 오염시키는 영향을 최소화합니다. 절대값이
    보통 3.5를 넘으면 이상치로 판단합니다.</p>`,
    formula: `M&#7522; = 0.6745&#183;(x&#7522; - median(x)) / MAD ,&nbsp;&nbsp; MAD = median(|x&#7522; - median(x)|)`,
    features: `<p><strong>장점</strong> — 이상치 자체가 통계량을 오염시키는 마스킹 문제에 강건하고 비정규분포에도 비교적
    안정적입니다.</p>
    <p><strong>단점</strong> — 임계값 3.5는 경험적 값이며 다변량으로 확장하기 어렵습니다.</p>`,
    applications: `<p>센서·IoT 시계열의 실시간 스파이크 탐지, 이상치가 이미 많이 섞인 오염된 데이터셋의 강건한 스크리닝에
    사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'z-score-method',
    category: 'unsup',
    subcategory: 'anomaly',
    title: 'Z-점수 방법 (Z-Score Method)',
    subtitle: '평균으로부터 표준편차 몇 배 떨어져 있는지로 이상치를 판단하는 가장 기본적인 통계 기법',
    overview: `<p>데이터가 정규분포를 따른다고 가정하고, 각 값을 (x-평균)/표준편차로 표준화한 뒤 절대값이 임계치(흔히
    2~3)를 넘으면 이상치로 분류합니다. 단변량 데이터에서 가장 널리 쓰이는 입문적 이상치 탐지 방법입니다.</p>`,
    formula: `Z = (x - &#956;) / &#963;`,
    features: `<p><strong>장점</strong> — 이해와 구현이 매우 쉽고 계산비용이 낮습니다.</p>
    <p><strong>단점</strong> — 정규분포 가정이 깨지면 부정확하고, 평균·표준편차 자체가 이상치에 의해 왜곡되는 마스킹 문제가
    있습니다.</p>`,
    applications: `<p>제조공정 관리도(SPC), 재무데이터의 급격한 수익률 이탈 탐지, 다른 정교한 기법을 적용하기 전 1차
    스크리닝 단계로 널리 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

  /* ================= [1.5.2] Distance-based Methods (거리 기반 방법) ================= */
  {
    id: 'average-knn-distance',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '평균 K-최근접 이웃 거리 (Average KNN Distance)',
    subtitle: 'k개 최근접 이웃까지 거리의 평균을 이상치 점수로 사용하는 거리 기반 기법',
    overview: `<p>각 점에서 k개의 최근접 이웃까지 거리를 모두 구해 평균을 이상치 점수로 사용합니다. k번째 이웃까지의 거리
    하나만 보는 방법보다 국소 영역의 전반적인 밀집도를 더 안정적으로 반영합니다.</p>`,
    formula: `score(p) = (1/k) &#8721;&#7522;&#8331;&#8331;&#7580; dist(p, NN&#7522;(p))`,
    features: `<p><strong>장점</strong> — k번째 거리만 쓰는 방법보다 잡음에 덜 민감하고 안정적입니다.</p>
    <p><strong>단점</strong> — 여전히 전역 밀도 차이를 반영하지 못해 밀도가 다른 군집이 섞이면 오탐이 발생합니다.</p>`,
    applications: `<p>이상거래 탐지, 센서 네트워크의 이상 데이터포인트 탐지 등 KNN 기반 이상탐지의 표준 베이스라인으로
    사용됩니다. PyOD의 KNN 클래스에서 method='mean' 옵션으로 제공됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'cof',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '연결성 기반 이상치 인자 (COF, Connectivity-based Outlier Factor)',
    subtitle: '최근접 이웃 간 사슬형 연결거리를 비교해 저밀도 패턴에서도 안정적으로 이상치를 찾는 기법',
    overview: `<p>Tang et al.(2002)이 제안했습니다. 유클리드 거리 대신 최근접 이웃을 잇는 최소신장트리(SBN-path) 상의 평균
    사슬거리(ac-distance)를 사용해, 한 점의 ac-distance를 이웃들의 ac-distance 평균과 비교합니다. LOF가 이웃 밀도가 비슷한
    저밀도 패턴(sparse pattern)을 오탐하는 문제를 개선한 기법입니다.</p>`,
    formula: `COF&#8342;(p) = |N&#8342;(p)|&#183;ac-dist&#8339;&#8342;&#8339;(&#7524;)(p) / &#8721;&#7522;&#8712;N&#8342;(p) ac-dist&#8339;&#8342;&#8339;(&#7522;)(o)`,
    features: `<p><strong>장점</strong> — 저밀도 선형 패턴이나 사슬형 구조에서도 오탐이 적습니다.</p>
    <p><strong>단점</strong> — 사슬거리 계산 비용이 LOF보다 높아 대규모 데이터에서 확장성이 떨어집니다.</p>`,
    applications: `<p>네트워크 트래픽처럼 선형·사슬형 정상 패턴이 존재하는 데이터의 이상탐지, LOF 계열 알고리즘 비교연구의
    기준 기법으로 사용됩니다. PyOD의 COF 클래스로 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'euclidean-distance-detection',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '유클리드 거리 기반 탐지 (Euclidean Distance-based Detection)',
    subtitle: '점 사이의 직선 거리만으로 밀집도를 판단하는 가장 단순한 거리 기반 이상치 탐지',
    overview: `<p>각 점에서 다른 점(또는 인접 이웃) 사이의 유클리드 거리를 계산해, 주변에 가까운 이웃이 적을수록 이상치로
    판단합니다. Knorr & Ng(1998)의 DB(Distance-Based) 이상치 개념 — 반경 &#955; 안에 있는 이웃 비율이 임계치 미만이면
    이상치 — 이 대표적인 형태입니다.</p>`,
    formula: `p는 DB(k,&#955;) 이상치 &#8660; |{q : dist(p,q) &#8804; &#955;}| &lt; k`,
    features: `<p><strong>장점</strong> — 개념이 직관적이고 분포 가정이 필요 없습니다.</p>
    <p><strong>단점</strong> — 고차원에서 거리 개념이 무너지는 차원의 저주에 취약하고, 전역 밀도 차이를 고려하지 못합니다.</p>`,
    applications: `<p>저차원 공간데이터의 이상 지점 탐지, KNN·LOF 등 정교한 기법의 개념적 토대로 교육·비교 목적에 널리
    활용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'inflo',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '영향 기반 이상치도 (INFLO, INFLuenced Outlierness)',
    subtitle: 'k-최근접 이웃과 역-최근접 이웃을 함께 고려해 경계 영역의 오탐을 줄이는 밀도 비교 기법',
    overview: `<p>Jin et al.(2006)이 제안했습니다. LOF가 서로 다른 밀도의 군집 경계에서 오탐하는 문제를 개선하기 위해, 한
    점의 k-최근접 이웃과 그 점을 이웃으로 삼는 역최근접이웃(RNN)을 합친 영향공간(Influence Space)의 평균 밀도와 자신의
    밀도를 비교합니다.</p>`,
    formula: `INFLO(p) = (&#8721;&#7522;&#8712;IS(p) den(q)) / (|IS(p)|&#183;den(p))`,
    features: `<p><strong>장점</strong> — 서로 다른 밀도를 가진 군집이 인접해 있을 때 LOF보다 경계 오탐이 적습니다.</p>
    <p><strong>단점</strong> — 역최근접이웃 계산이 추가로 필요해 연산비용이 더 큽니다.</p>`,
    applications: `<p>밀도가 불균일하게 섞인 실세계 데이터(고객 세분화, 센서 네트워크)의 경계부 이상탐지에 활용됩니다.
    R의 DDoutlier 패키지 등 연구용 라이브러리에 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'knn-outlier-detection',
    category: 'unsup',
    subcategory: 'anomaly',
    title: 'K-최근접 이웃 기반 이상치 탐지 (KNN, K-Nearest Neighbor-based Outlier Detection)',
    subtitle: 'k번째 최근접 이웃까지의 거리를 이상치 점수로 사용하는 대표적 거리 기반 기법',
    overview: `<p>Ramaswamy et al.(2000)이 제안한 방식으로, 각 점에서 k번째로 가까운 이웃까지의 거리(또는 k개 이웃까지
    거리의 합·평균)를 계산해 값이 클수록 이상치로 판단합니다. 밀도 추정 없이 순수 거리만으로 작동해 구현이 간단합니다.</p>`,
    formula: `score(p) = dist(p, NN&#8342;(p))`,
    features: `<p><strong>장점</strong> — 구현이 간단하고 이해가 쉬우며 평균·최대 거리 등 다양한 변형으로 확장할 수
    있습니다.</p>
    <p><strong>단점</strong> — 밀도가 다른 군집이 혼재하면 성능이 떨어지고 고차원에서 거리 왜곡 문제가 발생합니다.</p>`,
    applications: `<p>신용카드 이상거래 탐지, 제조공정 센서데이터의 이상 스크리닝 등 다양한 실무에서 베이스라인으로 널리
    사용됩니다. PyOD의 KNN 클래스로 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'kth-nearest-neighbor-distance',
    category: 'unsup',
    subcategory: 'anomaly',
    title: 'k번째 최근접 이웃 거리 (k-th Nearest Neighbor Distance)',
    subtitle: '정확히 k번째로 가까운 이웃까지의 거리 하나만을 이상치 점수로 쓰는 가장 단순한 형태의 거리 기반 기법',
    overview: `<p>KNN 기반 탐지의 가장 단순한 변형으로, 이웃들의 평균이나 합이 아니라 오직 k번째 이웃까지의 거리(k-distance)
    값 자체를 이상치 점수로 사용합니다. 계산이 가장 가볍지만, 가장 가까운 하나의 이웃 정보에만 의존해 잡음에 민감할 수
    있습니다.</p>`,
    formula: `score(p) = dist(p, NN&#8342;(p)) &nbsp;(NN&#8342;(p): p로부터 k번째로 가까운 점)`,
    features: `<p><strong>장점</strong> — KNN 변형(k번째 거리·평균·최대) 중 계산이 가장 가볍습니다.</p>
    <p><strong>단점</strong> — 단일 이웃 거리에만 의존해 국소 잡음에 취약하고 평균·최댓값 방식보다 불안정할 수 있습니다.</p>`,
    applications: `<p>실시간성이 중요한 스트리밍 데이터의 경량 이상탐지, 다른 KNN 변형과의 성능 비교 실험의 기준선으로
    사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'lof',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '지역 이상치 인자 (LOF, Local Outlier Factor)',
    subtitle: '주변 이웃 대비 상대적으로 밀도가 낮은 점을 이상치로 판단하는 가장 널리 쓰이는 밀도 기반 거리 기법',
    overview: `<p>Breunig et al.(2000)이 제안했습니다. 각 점의 지역 도달가능밀도(local reachability density, lrd)를
    계산하고, 이를 k개 이웃들의 lrd 평균과 비교한 비율을 LOF 점수로 사용합니다. LOF&#8776;1이면 주변과 밀도가 비슷한
    정상점, 1보다 훨씬 크면 국소적으로 밀도가 낮은 이상치입니다.</p>`,
    formula: `LOF&#8342;(p) = ( &#8721;&#7522;&#8712;N&#8342;(p) lrd(o) / lrd(p) ) / |N&#8342;(p)|`,
    features: `<p><strong>장점</strong> — 전역이 아닌 지역 밀도를 비교해 밀도가 서로 다른 군집이 섞여도 잘 탐지합니다.</p>
    <p><strong>단점</strong> — 이웃 수(k) 파라미터에 민감하고 고차원 데이터에서는 성능이 저하됩니다.</p>`,
    applications: `<p>신용카드 이상거래 탐지, 네트워크 침입탐지, 센서 데이터의 국소 이상 탐지 등 밀도 기반 이상탐지의 사실상
    표준 기법으로 사용됩니다.</p>`,
    sklearnFunction: 'LocalOutlierFactor',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/outlier_detection.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.LocalOutlierFactor.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/miscellaneous/plot_anomaly_comparison.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'loop-local-outlier-probability',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '지역 이상치 확률 (LoOP, Local Outlier Probability)',
    subtitle: 'LOF류 점수를 통계적으로 해석 가능한 [0,1] 확률값으로 변환한 지역 밀도 기반 기법',
    overview: `<p>Kriegel, Kröger, Schubert & Zimek(2009)이 제안했습니다. 각 점의 확률적 집합거리(probabilistic set
    distance)로 국소밀도(PLOF)를 정의하고, 이를 정규화한 뒤 오차함수(erf)를 적용해 이상치일 확률로 직접 해석 가능한 점수를
    산출합니다. LOF류 점수가 상대적 크기만 의미하고 절대적 해석이 어려운 한계를 보완합니다.</p>`,
    formula: `LoOP(p) = max(0, erf( PLOF(p) / (&#955;&#183;&#8730;2) ))`,
    features: `<p><strong>장점</strong> — 점수를 통계적 확률로 해석할 수 있어 임계값 설정이 직관적입니다.</p>
    <p><strong>단점</strong> — 정규분포 가정 기반의 근사이며, 이웃 수(k) 및 정규화 계수 &#955; 선택에 결과가 민감합니다.</p>`,
    applications: `<p>이상치 여부를 확률로 보고해야 하는 리스크관리·이상거래 탐지 시스템, 여러 탐지기 점수를 정규화해
    앙상블로 결합할 때 표준화된 스케일을 제공합니다. Python PyNomaly 라이브러리로 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'mahalanobis-distance',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '마할라노비스 거리 (Mahalanobis Distance)',
    subtitle: '변수 간 상관관계와 분산 규모를 반영해 다변량 공간에서의 거리를 재는 통계적 거리 척도',
    overview: `<p>유클리드 거리와 달리 데이터의 공분산 구조를 반영해, 분산이 큰 방향으로는 거리를 축소하고 상관된 변수 간
    왜곡을 보정합니다. 데이터가 다변량 정규분포를 따르면 거리의 제곱이 카이제곱분포를 따른다는 성질을 이용해 이상치 임계값을
    통계적으로 설정할 수 있습니다.</p>`,
    formula: `D&#8340;(x) = &#8730;((x-&#956;)&#7488; &#931;&#8315;&#185; (x-&#956;))`,
    features: `<p><strong>장점</strong> — 변수 간 상관관계와 스케일을 함께 고려해 유클리드 거리보다 통계적으로 타당합니다.</p>
    <p><strong>단점</strong> — 공분산행렬 &#931;의 추정 자체가 이상치에 민감해, 강건 공분산 추정(MCD 등)과 함께 사용해야
    안정적입니다.</p>`,
    applications: `<p>다변량 품질관리 관리도(T&#178; 관리도), 신용평가모형의 이상 고객 탐지, 얼굴인식·이상탐지 전처리의
    표준 거리 척도로 사용됩니다. scikit-learn의 공분산 추정 클래스에서 직접 계산할 수 있습니다.</p>`,
    sklearnFunction: 'EmpiricalCovariance.mahalanobis',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/covariance.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.covariance.EmpiricalCovariance.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/covariance/plot_mahalanobis_distances.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

  /* ================= [1.5.3] Density-based Methods (밀도 기반 방법) ================= */
  {
    id: 'dbscan-outlier-detection',
    category: 'unsup',
    subcategory: 'anomaly',
    title: 'DBSCAN 기반 이상치 탐지 (DBSCAN-based Outlier Detection)',
    subtitle: '군집화 과정에서 자연스럽게 걸러지는 잡음점을 이상치로 활용하는 밀도 기반 탐지',
    overview: `<p>DBSCAN 군집화 알고리즘을 실행했을 때 어떤 군집에도 속하지 못하고 노이즈(label=-1)로 분류되는 점들을 그대로
    이상치로 간주하는 방식입니다. 별도의 이상치 점수 대신 군집화의 부산물을 활용하는 가장 손쉬운 밀도 기반 접근입니다.</p>`,
    formula: `이상치 &#8660; label(p) = noise &nbsp;(핵심점의 eps-이웃도 아니고 스스로도 핵심점이 아닌 점)`,
    features: `<p><strong>장점</strong> — 군집화와 이상치 탐지를 한 번에 수행할 수 있고 원형이 아닌 군집 모양에도
    강건합니다.</p>
    <p><strong>단점</strong> — eps·minPts 파라미터에 결과가 크게 좌우되고, 이상치 정도(점수) 없이 이분법적으로만
    판단합니다.</p>`,
    applications: `<p>공간 데이터의 밀집구역 탐지와 동시에 이상 위치를 표시하거나, 군집화 파이프라인에 이상치 필터링을
    자연스럽게 통합할 때 사용됩니다.</p>`,
    sklearnFunction: 'DBSCAN',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/clustering.html#dbscan',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.cluster.DBSCAN.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/cluster/plot_dbscan.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'kde-outlier-detection',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '이상치를 위한 커널 밀도 추정 (KDE, Kernel Density Estimation for Outliers)',
    subtitle: '비모수적으로 추정한 확률밀도가 낮은 영역의 점을 이상치로 판단하는 기법',
    overview: `<p>각 점 주변에 커널 함수(주로 가우시안)를 놓아 전체 데이터의 확률밀도함수를 비모수적으로 추정하고, 추정된
    밀도값이 낮은 점을 이상치로 분류합니다. 분포 형태를 가정하지 않아 다봉분포에도 유연하게 대응할 수 있습니다.</p>`,
    formula: `f&#770;(x) = (1/nh) &#8721;&#7522;&#8331;&#8331;&#7580; K((x-x&#7522;)/h) ,&nbsp;&nbsp; 이상치 &#8660; f&#770;(x) &lt; &#964;`,
    features: `<p><strong>장점</strong> — 분포 모양을 가정하지 않아 유연하고 다봉분포에도 대응합니다.</p>
    <p><strong>단점</strong> — 대역폭(h) 선택에 결과가 매우 민감하고, 고차원에서는 차원의 저주로 추정이 불안정해집니다.</p>`,
    applications: `<p>저차원 센서 신호의 이상 구간 탐지, 이상치 탐지 전 탐색적 밀도 시각화에 사용됩니다. scikit-learn의
    KernelDensity로 로그우도를 계산해 임계치 이하 샘플을 이상치로 표시하는 방식으로 활용할 수 있습니다.</p>`,
    sklearnFunction: 'KernelDensity',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/density.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KernelDensity.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/neighbors/plot_kde_1d.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'ldf',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '지역 밀도 인자 (LDF, Local Density Factor)',
    subtitle: '커널 밀도 추정을 LOF의 도달가능거리 개념과 결합한 지역 밀도 기반 이상치 기법',
    overview: `<p>Latecki, Lazarevic & Pokrajac(2007)이 제안했습니다. LOF처럼 이웃과의 상대 밀도를 비교하되, 밀도 추정
    자체를 가우시안 커널 기반 KDE(지역밀도추정, LDE)로 계산해 급격한 밀도 변화 지역에서 LOF보다 안정적인 점수를
    제공합니다.</p>`,
    formula: `LDF(p) = ( &#8721;&#7522;&#8712;N&#8342;(p) LDE(o) / |N&#8342;(p)| ) / LDE(p)`,
    features: `<p><strong>장점</strong> — 커널 기반 밀도추정으로 LOF보다 매끄럽고 안정적인 밀도 비교가 가능합니다.</p>
    <p><strong>단점</strong> — 커널 대역폭 선택이 추가로 필요하고 계산 비용이 LOF보다 큽니다.</p>`,
    applications: `<p>밀도 변화가 완만하지 않고 급격한 실세계 데이터의 지역 이상탐지에 활용됩니다. R의 DDoutlier 패키지 등
    연구용 도구에 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'ldof',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '지역 거리 기반 이상치 인자 (LDOF, Local Distance-based Outlier Factor)',
    subtitle: '이웃까지의 거리와 이웃끼리의 내부 거리를 비교해 밀도 추정 없이 이상치를 측정하는 기법',
    overview: `<p>Zhang et al.(2009)이 제안했습니다. 한 점과 k-최근접 이웃들 사이의 평균거리를, 그 이웃들끼리의 평균
    쌍대거리(내부 응집도)와 비교한 비율로 이상치 정도를 정의합니다. 밀도를 직접 추정하지 않고 순수 거리 비율만으로 작동해
    흩어진 데이터(scattered data)에서도 안정적입니다.</p>`,
    formula: `LDOF&#8342;(p) = ( (1/k)&#8721;&#7522;&#8712;N&#8342;(p) dist(p,o) ) / D&#8342;(p) &nbsp;(D&#8342;(p): 이웃 간 평균 쌍대거리)`,
    features: `<p><strong>장점</strong> — 밀도 추정 없이도 흩어진 패턴에서 LOF보다 안정적으로 작동합니다.</p>
    <p><strong>단점</strong> — 이웃 간 쌍대거리 계산으로 O(k&#178;)의 추가 비용이 발생합니다.</p>`,
    applications: `<p>군집 구조가 뚜렷하지 않고 데이터가 널리 흩어진 산점 데이터의 이상탐지에 사용됩니다. R의 DDoutlier
    패키지 등에 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'loci',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '지역 상관 적분 (LOCI, Local Correlation Integral)',
    subtitle: '여러 반경(스케일)에서 이웃 수의 편차를 자동으로 비교해 임계값 지정 없이 이상치를 찾는 기법',
    overview: `<p>Papadimitriou et al.(2003)이 제안했습니다. 반경 r 내 이웃 수 n(p,r)과 그 r을 &#945;배 확대한 반경에서의
    평균 이웃 수를 비교하는 MDEF(Multi-granularity Deviation Factor)를 여러 반경에 걸쳐 계산합니다. 사용자가 임계값을
    수동으로 정할 필요 없이 표준편차(&#963;&#8339;&#7502;&#7502;&#7502;) 기준 3&#963;를 넘으면 자동으로 이상치를
    판정합니다.</p>`,
    formula: `MDEF(p,r,&#945;) = 1 - n(p,&#945;r) / n&#770;(p,r,&#945;) ,&nbsp;&nbsp; 이상치 &#8660; MDEF &gt; 3&#183;&#963;&#8339;&#7502;&#7502;&#7502;`,
    features: `<p><strong>장점</strong> — 사용자가 임계값을 직접 지정하지 않아도 자동 컷오프를 제공하고 이상치 군집
    (micro-cluster)도 탐지할 수 있습니다.</p>
    <p><strong>단점</strong> — 여러 반경에 걸친 계산으로 연산비용이 크며, 근사 가속 기법(aLOCI)이 별도로 필요합니다.</p>`,
    applications: `<p>반경 설정이 어려운 탐색적 이상탐지, 이상치 뭉치(마이크로 클러스터) 탐지가 필요한 부정거래 탐지 등에
    활용됩니다. PyOD의 LOCI 클래스로 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'optics-outlier-detection',
    category: 'unsup',
    subcategory: 'anomaly',
    title: 'OPTICS 기반 이상치 탐지 (OPTICS-based Outlier Detection)',
    subtitle: '다양한 밀도의 군집을 순서화하는 OPTICS의 도달거리를 이용해 이상치를 판별하는 기법',
    overview: `<p>OPTICS는 DBSCAN처럼 고정된 eps 하나 대신, 점들을 도달가능거리(reachability distance) 순으로 정렬해
    다양한 밀도의 군집 구조를 하나의 순서(reachability plot)로 표현합니다. 도달거리가 유난히 크게 튀는 점이나 어떤 군집에도
    안정적으로 속하지 못하는 점을 이상치로 간주합니다.</p>`,
    formula: `reachability-dist&#8342;(p,o) = max(core-dist&#8342;(o), dist(p,o))`,
    features: `<p><strong>장점</strong> — DBSCAN과 달리 밀도가 다른 여러 군집을 동시에 다룰 수 있어 밀도가 불균일한
    데이터의 이상탐지에 유리합니다.</p>
    <p><strong>단점</strong> — 계산 복잡도가 DBSCAN보다 높고 결과 해석에 reachability plot 분석이 추가로 필요합니다.</p>`,
    applications: `<p>밀도가 서로 다른 여러 지역이 혼재한 공간데이터의 이상탐지, 계층적 군집 구조 분석과 이상탐지를 동시에
    수행할 때 사용됩니다.</p>`,
    sklearnFunction: 'OPTICS',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/clustering.html#optics',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.cluster.OPTICS.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/cluster/plot_optics.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

  /* ================= [1.5.4] Model-based Methods (모델 기반 방법) ================= */
  {
    id: 'elliptic-envelope',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '타원형 엔벨로프 (Elliptic Envelope, Robust Covariance)',
    subtitle: '데이터가 다변량 정규분포를 따른다고 가정하고 강건 공분산으로 타원형 경계를 적합하는 이상치 탐지',
    overview: `<p>데이터를 하나의 다변량 가우시안 분포로 가정하고, MCD(최소공분산행렬식) 같은 강건 추정으로 중심과 공분산을
    구한 뒤 그 타원형 등고선(마할라노비스 거리 등고선) 밖에 있는 점을 이상치로 판단합니다. 일반 공분산 추정과 달리 이상치
    자체에 영향을 덜 받도록 설계되었습니다.</p>`,
    formula: `이상치 &#8660; (x-&#956;&#770;)&#7488; &#931;&#770;&#8315;&#185; (x-&#956;&#770;) &gt; &#967;&#178;&#8332;,&#8321;&#8331;&#8341;`,
    features: `<p><strong>장점</strong> — 통계적으로 해석 가능한 타원 경계와 마할라노비스 거리 기반 임계값을
    제공합니다.</p>
    <p><strong>단점</strong> — 데이터가 단봉 가우시안 형태를 따른다는 가정이 깨지면(다봉분포·비선형 군집) 성능이 급격히
    저하됩니다.</p>`,
    applications: `<p>저차원의 단일 군집 형태 데이터에서 강건한 이상치 탐지, 금융 리스크 데이터의 다변량 정규성 가정 하
    이상치 스크리닝에 사용됩니다.</p>`,
    sklearnFunction: 'EllipticEnvelope',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/outlier_detection.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.covariance.EllipticEnvelope.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/covariance/plot_mahalanobis_distances.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'extended-isolation-forest',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '확장 고립 포레스트 (EIF, Extended Isolation Forest)',
    subtitle: '축에 평행한 분기 대신 임의 기울기의 초평면으로 분할해 고립 포레스트의 편향을 줄인 기법',
    overview: `<p>Hariri, Carrasco Kind & Brunner(2019)가 제안했습니다. 기존 Isolation Forest는 분기가 항상 좌표축에
    평행해 이상치 점수 지도(heatmap)에 격자무늬 아티팩트가 생기는 편향이 있습니다. EIF는 각 분기마다 무작위 기울기와 무작위
    절편을 갖는 초평면으로 데이터를 자르는 확장을 도입해 더 매끄럽고 일관된 이상치 점수를 산출합니다.</p>`,
    formula: `분기 조건: (x - p)&#183;n &lt; 0 &nbsp;(n: 임의 방향 법선벡터, p: 임의 절편점)`,
    features: `<p><strong>장점</strong> — 이상치 점수 지도가 매끄럽고 좌표축 편향(격자 아티팩트)이 사라져 더 일관된
    점수를 제공합니다.</p>
    <p><strong>단점</strong> — 초평면 계산으로 기존 Isolation Forest보다 학습·추론 비용이 다소 증가합니다.</p>`,
    applications: `<p>이상치 점수의 공간적 일관성이 중요한 이미지·센서 데이터 이상탐지, 기존 Isolation Forest의 편향이
    문제되는 고차원 실무 데이터에 사용됩니다. 공식 구현은 GitHub의 sahandha/eif 패키지 및 H2O.ai에서 제공됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'gmm-anomaly-detection',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '이상치 탐지를 위한 가우시안 혼합 모델 (GMM, Gaussian Mixture Model for Anomaly Detection)',
    subtitle: '데이터를 여러 정규분포의 혼합으로 모델링하고 낮은 우도를 갖는 점을 이상치로 판단하는 확률 모델 기법',
    overview: `<p>EM 알고리즘으로 K개 가우시안 성분의 평균·공분산·혼합비율을 학습한 뒤, 각 점이 학습된 혼합분포에서 나올
    우도(likelihood)를 계산합니다. 우도가 임계값보다 낮은 점, 즉 어떤 성분에도 잘 들어맞지 않는 점을 이상치로
    분류합니다.</p>`,
    formula: `p(x) = &#8721;&#8342;&#8331;&#8331;&#8336; &#960;&#8342;&#183;N(x | &#956;&#8342;, &#931;&#8342;) ,&nbsp;&nbsp; 이상치 &#8660; log p(x) &lt; &#964;`,
    features: `<p><strong>장점</strong> — 다봉분포(여러 군집)를 하나의 확률모델로 유연하게 표현할 수 있습니다.</p>
    <p><strong>단점</strong> — 성분 개수(K)를 사전에 정해야 하고, 고차원에서는 공분산 추정이 불안정해질 수 있습니다.</p>`,
    applications: `<p>다중 정상 패턴(여러 운전 모드)이 존재하는 설비 이상탐지, 여러 고객군을 반영한 신용평가 이상탐지 등에
    사용됩니다. scikit-learn의 GaussianMixture로 score_samples를 계산해 구현할 수 있습니다.</p>`,
    sklearnFunction: 'GaussianMixture',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/mixture.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.mixture.GaussianMixture.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/mixture/plot_gmm_pdf.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'hmm-sequential-anomaly',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '순차적 이상치를 위한 은닉 마르코프 모델 (HMM, Hidden Markov Model for Sequential Anomalies)',
    subtitle: '관측되지 않는 상태 전이 확률을 학습해 정상 순서에서 벗어난 시퀀스를 탐지하는 확률 모델 기법',
    overview: `<p>데이터를 순차적으로 전이하는 은닉 상태들의 관측으로 모델링하고, 상태 전이확률과 관측확률을 정상
    데이터로 학습합니다. 새로운 시퀀스가 학습된 모델에서 나올 우도(또는 비터비 경로 확률)가 비정상적으로 낮으면 이상
    시퀀스로 판단합니다.</p>`,
    formula: `P(O|&#955;) = &#8721;&#8207;&#8331;&#8339;&#7522;&#7580;&#7500;&#7495;&#7521; &#8339;&#7514;&#7495;&#7522;&#7521; P(O|Q,&#955;)&#183;P(Q|&#955;)`,
    features: `<p><strong>장점</strong> — 값 자체보다 시간적 순서·문맥 이상(contextual anomaly)을 포착할 수 있습니다.</p>
    <p><strong>단점</strong> — 은닉 상태 수를 사전에 정해야 하고 학습에 충분한 정상 시퀀스 데이터가 필요합니다.</p>`,
    applications: `<p>사용자 행동 로그의 비정상 접근 패턴(시퀀스) 탐지, 설비의 비정상 운전 모드 전이 탐지, 필기·음성 등
    시계열 시퀀스 이상탐지에 사용됩니다. Python hmmlearn 라이브러리로 구현할 수 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'isolation-forest',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '고립 포레스트 (Isolation Forest)',
    subtitle: '무작위 분기로 데이터를 빠르게 고립시켜 평균 경로 길이가 짧은 점을 이상치로 판단하는 트리 앙상블 기법',
    overview: `<p>Liu, Ting & Zhou(2008)가 제안했습니다. 밀도나 거리를 계산하지 않고, 무작위로 특성과 분할값을 골라 데이터를
    재귀적으로 이등분하는 트리(iTree)를 다수 생성합니다. 이상치는 정상 데이터보다 훨씬 적은 분기만으로 고립되므로 루트로부터의
    평균 경로 길이가 짧다는 성질을 이용해 점수화합니다.</p>`,
    formula: `s(x,n) = 2&#8315;&#7517;&#8317;&#7539;&#8318;&#8260;&#7502;&#8317;&#7523;&#8318; &nbsp;(h(x): 평균 경로 길이, c(n): 정규화 상수)`,
    features: `<p><strong>장점</strong> — 거리·밀도 계산이 없어 고차원·대용량 데이터에서도 선형에 가까운 속도로 확장할 수
    있습니다.</p>
    <p><strong>단점</strong> — 축에 평행한 분기로 인한 편향(격자무늬 아티팩트)이 있고 국소적(local) 이상치 탐지에는
    상대적으로 약합니다.</p>`,
    applications: `<p>신용카드 이상거래 탐지, 서버·네트워크 이상 로그 탐지, 대규모 IoT 센서 데이터의 실시간 이상탐지 등
    산업 표준으로 가장 널리 쓰이는 이상탐지 알고리즘 중 하나입니다.</p>`,
    sklearnFunction: 'IsolationForest',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/outlier_detection.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/ensemble/plot_isolation_forest.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'mcd-outlier-detection',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '최소 공분산 행렬식 (MCD, Minimum Covariance Determinant)',
    subtitle: '공분산 행렬식이 최소가 되는 부분집합으로 강건하게 정상 분포를 추정해 이상치를 탐지하는 기법',
    overview: `<p>Rousseeuw(1984)가 제안한 강건 공분산 추정법으로, 전체 n개 중 h개(h&#8776;n/2 이상)의 부분집합 중 표본
    공분산 행렬의 행렬식이 최소가 되는 부분집합을 탐색해 이를 정상 데이터의 중심·공분산 추정치로 사용합니다. FastMCD
    알고리즘으로 효율적으로 계산하며, 이렇게 얻은 강건한 마할라노비스 거리로 이상치를 판별합니다.</p>`,
    formula: `(&#956;&#770;,&#931;&#770;) = argmin&#8347;&#8834;{1..n},|&#8347;|=&#8462; det(Cov(H))`,
    features: `<p><strong>장점</strong> — 데이터의 최대 약 50%가 이상치여도 추정치가 왜곡되지 않는 높은 강건성
    (breakdown point)을 가집니다.</p>
    <p><strong>단점</strong> — 부분집합 탐색으로 계산비용이 일반 공분산 추정보다 크고, 표본 수 대비 차원이 크면
    불안정합니다.</p>`,
    applications: `<p>다변량 이상치 탐지의 전처리용 강건 공분산 추정, EllipticEnvelope의 내부 알고리즘으로 사용되어
    금융·품질관리 데이터의 이상치 탐지에 활용됩니다. scikit-learn의 MinCovDet으로 구현되어 있습니다.</p>`,
    sklearnFunction: 'MinCovDet',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/covariance.html#robust-covariance-estimation',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.covariance.MinCovDet.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/covariance/plot_mahalanobis_distances.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'oc-svm',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '일클래스 서포트 벡터 머신 (OC-SVM, One-Class SVM)',
    subtitle: '정상 데이터만으로 원점(또는 특징공간의 대부분 데이터)과 분리하는 초평면을 학습하는 지지벡터 기반 이상치 탐지',
    overview: `<p>Schölkopf et al.(2001)이 제안했습니다. 커널을 통해 데이터를 고차원 특징공간으로 매핑한 뒤, 원점으로부터
    최대 마진으로 대부분의 정상 데이터를 분리하는 초평면을 학습합니다. 새로운 점이 이 경계 바깥에 위치하면 이상치로
    판정합니다.</p>`,
    formula: `min&#119908;,&#961;,&#958; (1/2)||w||&#178; + (1/&#957;n)&#8721;&#958;&#7522; - &#961; &nbsp;s.t. (w&#183;&#966;(x&#7522;)) &#8805; &#961; - &#958;&#7522;`,
    features: `<p><strong>장점</strong> — 커널 트릭으로 비선형 경계를 유연하게 학습할 수 있고 이론적 기반(SVM)이
    탄탄합니다.</p>
    <p><strong>단점</strong> — 커널·&#957; 파라미터 튜닝이 까다롭고 대용량 데이터에서 학습 속도가 느립니다.</p>`,
    applications: `<p>정상 데이터만 확보 가능한 설비 이상탐지(novelty detection), 텍스트·이미지 특징 기반 이상 콘텐츠
    탐지 등에 사용됩니다. scikit-learn의 OneClassSVM으로 구현되어 있습니다.</p>`,
    sklearnFunction: 'OneClassSVM',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/outlier_detection.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.svm.OneClassSVM.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/miscellaneous/plot_anomaly_comparison.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'svdd',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '서포트 벡터 데이터 설명 (SVDD, Support Vector Data Description)',
    subtitle: '정상 데이터를 감싸는 최소 반지름의 초구(hypersphere)를 학습해 그 밖의 점을 이상치로 판단하는 기법',
    overview: `<p>Tax & Duin(1999, 2004)이 제안했습니다. OC-SVM과 유사하게 커널 특징공간에서 작동하지만, 초평면 대신
    데이터를 감싸는 최소 부피의 구(중심 a, 반지름 R)를 직접 학습합니다. 슬랙 변수로 일부 이상치가 구 밖에 있는 것을 허용해
    유연성을 확보합니다.</p>`,
    formula: `min&#7521;,&#119886;,&#958; R&#178; + C&#8721;&#958;&#7522; &nbsp;s.t. ||x&#7522; - a||&#178; &#8804; R&#178; + &#958;&#7522; , &#958;&#7522;&#8805;0`,
    features: `<p><strong>장점</strong> — 구 형태의 경계로 기하학적 해석이 직관적이고 커널을 통해 비선형 경계로 확장할
    수 있습니다.</p>
    <p><strong>단점</strong> — OC-SVM과 마찬가지로 커널·C 파라미터 튜닝이 필요하고 데이터가 매우 비대칭이면 성능이 떨어질
    수 있습니다.</p>`,
    applications: `<p>고장 진단·공정 모니터링에서 정상 운전 범위를 하나의 구로 정의하는 novelty detection에 사용되며,
    딥러닝 버전인 Deep SVDD의 이론적 토대가 되었습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

  /* ================= [1.5.5] Ensemble Methods (앙상블 방법) ================= */
  {
    id: 'aom',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '최댓값의 평균 (AOM, Average of Maximum)',
    subtitle: '여러 이상치 탐지기를 그룹으로 나눠 그룹별 최댓값을 평균내는 점수 결합 기법',
    overview: `<p>Aggarwal & Sathe(2015) 등에서 제안된 이상치 앙상블 결합 방식입니다. 여러 기저 탐지기(base detector)의
    점수를 무작위로 p개 그룹으로 나눈 뒤, 각 그룹 내에서 최댓값을 그룹 대표점수로 삼고, 이 그룹 대표점수들의 평균을 최종
    이상치 점수로 사용합니다. 단순 평균보다 극단값을 살리면서 단일 최댓값 결합보다 분산을 줄이는 절충안입니다.</p>`,
    formula: `AOM = (1/p) &#8721;&#7527;&#8331;&#8331;&#8339; max&#7522;&#8712;G&#7527; score&#7522;(x)`,
    features: `<p><strong>장점</strong> — 단순 평균(분산 과소)과 단순 최댓값(분산 과대)의 중간적 절충으로 안정성과
    민감도의 균형을 제공합니다.</p>
    <p><strong>단점</strong> — 그룹 분할(그룹 수·크기) 설정에 결과가 좌우되고 무작위 분할로 인한 변동성이 존재합니다.</p>`,
    applications: `<p>여러 이상치 탐지기의 점수를 하나로 결합해야 하는 이상치 앙상블 시스템에 사용됩니다. PyOD의
    combination 모듈(aom 함수)로 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'feature-bagging',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '특징 배깅 (Feature Bagging)',
    subtitle: '특성의 무작위 부분집합마다 이상치 탐지기를 학습해 결과를 결합하는 배깅 기반 앙상블 기법',
    overview: `<p>Lazarevic & Kumar(2005)가 제안했습니다. 전체 특성 중 무작위로 부분집합을 골라 여러 개의 LOF 등 기저
    탐지기를 각각 학습시키고, 각 탐지기의 점수를 합(breadth-first) 또는 최댓값(cumulative) 방식으로 결합합니다. 랜덤
    포레스트의 특성 배깅 아이디어를 이상치 탐지에 적용한 기법입니다.</p>`,
    formula: `score(x) = combine&#8341;&#8331;&#8331;&#8340; score&#8341;(x) &nbsp;(각 score&#8341;은 서로 다른 특성 부분집합으로 학습된 탐지기)`,
    features: `<p><strong>장점</strong> — 고차원 데이터에서 일부 특성에만 존재하는 이상치(subspace outlier)를 더 잘 잡아
    내고, 단일 탐지기보다 분산을 줄여 안정성을 높입니다.</p>
    <p><strong>단점</strong> — 탐지기를 여러 번 학습해야 해 연산비용이 커지고 특성 부분집합 크기 설정이 필요합니다.</p>`,
    applications: `<p>특성이 매우 많은 텍스트·유전체 데이터의 이상탐지, 단일 알고리즘의 분산을 줄이고 싶은 실무 앙상블
    파이프라인에 사용됩니다. PyOD의 FeatureBagging 클래스로 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'isolation-forest-ensemble',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '고립 포레스트 앙상블 (Isolation Forest Ensemble)',
    subtitle: '다수의 독립적인 고립 트리를 배깅 방식으로 결합해 안정적인 이상치 점수를 만드는 앙상블 관점의 고립 포레스트',
    overview: `<p>Isolation Forest 자체가 본질적으로 배깅(bagging) 앙상블 기법으로, 데이터의 무작위 부분표본마다
    독립적인 iTree를 다수 생성한 뒤 모든 트리에서의 평균 경로 길이를 결합해 최종 점수를 산출합니다. 단일 트리의 무작위성으로
    인한 분산을 다수 트리의 평균으로 줄이는 것이 핵심 원리입니다.</p>`,
    formula: `E[h(x)] = (1/T) &#8721;&#7580;&#8331;&#8331;&#8323; h&#7580;(x) &nbsp;(T개 iTree의 평균 경로 길이)`,
    features: `<p><strong>장점</strong> — 트리 수(T)를 늘릴수록 점수의 분산이 줄어 안정적이고, 각 트리를 독립적으로 병렬
    학습할 수 있습니다.</p>
    <p><strong>단점</strong> — 트리 수가 많아지면 계산·메모리 비용이 선형으로 증가합니다.</p>`,
    applications: `<p>대규모 이상거래·로그 탐지 시스템에서 안정적인 점수가 필요한 프로덕션 환경, 다른 이상치 앙상블
    (SUOD, LSCP 등)의 기저 탐지기로도 널리 사용됩니다. scikit-learn의 IsolationForest에서 n_estimators로 트리 수를 직접
    조절할 수 있습니다.</p>`,
    sklearnFunction: 'IsolationForest',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/outlier_detection.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/ensemble/plot_isolation_forest.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'lscp',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '지역 선택적 조합 (LSCP, Locally Selective Combination in Parallel outlier ensembles)',
    subtitle: '테스트 지점 주변 지역에서 가장 성능이 좋은 기저 탐지기를 동적으로 선택해 결합하는 병렬 이상치 앙상블',
    overview: `<p>Zhao, Nasrullah, Hryniewicki & Li(2019, SDM)가 제안했습니다. 정답 라벨이 없는 비지도 이상치 탐지에서
    모든 기저 탐지기를 동일하게 취급하는 기존 앙상블과 달리, 무작위 특성 부분공간에서 테스트 지점의 최근접 이웃들에 대한
    합의(consensus)를 기준으로 그 지역에서 가장 유능한 탐지기들을 선택한 뒤 결합합니다.</p>`,
    formula: `score(x) = combine&#8342;&#8712;TopK(local competence(x)) score&#8342;(x)`,
    features: `<p><strong>장점</strong> — 지역별로 가장 성능이 좋은 탐지기를 동적으로 선택해 고정 결합 방식(AOM, 평균
    등)보다 정확도가 높습니다.</p>
    <p><strong>단점</strong> — 지역 성능 추정을 위한 추가 계산(유사 라벨 생성, 이웃 탐색)이 필요해 연산비용이 큽니다.</p>`,
    applications: `<p>서로 다른 성격의 여러 탐지기를 보유한 실무 이상탐지 시스템에서 동적 모델 선택이 필요한 경우
    사용됩니다. PyOD의 LSCP 클래스로 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'moa',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '평균의 최댓값 (MOA, Maximum of Average)',
    subtitle: '여러 이상치 탐지기를 그룹으로 나눠 그룹별 평균 중 최댓값을 취하는 점수 결합 기법',
    overview: `<p>AOM과 짝을 이루는 결합 방식으로, 기저 탐지기들을 무작위로 p개 그룹으로 나눈 뒤 각 그룹 내에서는 평균을
    그룹 대표점수로 삼고, 여러 그룹 대표점수 중 최댓값을 최종 이상치 점수로 사용합니다. AOM이 그룹 내 최댓값·그룹 간 평균인
    것과 정반대 순서로 결합합니다.</p>`,
    formula: `MOA = max&#7527;&#8331;&#8331;&#8339; ( (1/|G&#7527;|) &#8721;&#7522;&#8712;G&#7527; score&#7522;(x) )`,
    features: `<p><strong>장점</strong> — 그룹 내 평균으로 잡음을 줄이면서도 그룹 간 최댓값으로 민감도를 유지하는 절충
    결합입니다.</p>
    <p><strong>단점</strong> — 그룹 분할 방식에 따라 성능 편차가 크고 AOM 대비 상황에 따라 우열이 갈립니다.</p>`,
    applications: `<p>AOM과 함께 이상치 앙상블 결합 실험에서 비교 기준으로 사용되며, PyOD의 combination 모듈(moa 함수)로
    구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'rrcf',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '강건 무작위 컷 포레스트 (RRCF, Robust Random Cut Forest)',
    subtitle: '스트리밍 데이터에서 점을 제거했을 때 트리 구조 변화를 이상치 점수로 사용하는 온라인 이상탐지 앙상블',
    overview: `<p>Guha, Mishra, Roy & Schrijvers(2016, ICML)가 제안했습니다. Isolation Forest와 유사하게 무작위 분할로
    트리를 구성하지만, 각 차원을 그 값의 범위(최댓값-최솟값)에 비례한 확률로 선택해 분할하며, 한 점을 트리에서 제거했을 때
    트리의 서술 복잡도가 얼마나 줄어드는지(CoDisp, Collusive Displacement)를 이상치 점수로 사용합니다. 슬라이딩 윈도우로
    트리를 갱신해 스트리밍 데이터에 대응합니다.</p>`,
    formula: `CoDisp(x) &#8776; x와 인접한 점들을 함께 제거했을 때의 평균 모델 복잡도 변화(공동 변위)`,
    features: `<p><strong>장점</strong> — 슬라이딩 윈도우 갱신으로 실시간 스트리밍 데이터의 개념 변화(concept drift)에
    대응할 수 있고, 근접 중복점(near-duplicate)에도 강건합니다.</p>
    <p><strong>단점</strong> — 트리 갱신·삭제 연산이 배치형 Isolation Forest보다 구현이 복잡합니다.</p>`,
    applications: `<p>AWS의 실시간 이상탐지 서비스(Kinesis Data Analytics의 RANDOM_CUT_FOREST 함수)의 핵심 알고리즘,
    IoT 센서 스트림·로그 스트림의 온라인 이상탐지에 사용됩니다. Python rrcf 패키지로 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'suod',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '확장 가능한 비지도 이상치 탐지 (SUOD, Scalable Unsupervised Outlier Detection)',
    subtitle: '대규모 이종 이상치 탐지기 앙상블의 학습·추론을 가속하는 세 모듈 결합 프레임워크',
    overview: `<p>Zhao, Ding, Yang & Bai(2021, MLSys)가 제안했습니다. 개별 알고리즘이 아니라, 수십~수백 개의 서로 다른
    이상치 탐지기를 동시에 운용할 때 속도를 높이기 위한 가속 시스템입니다. (1) 무작위 투영으로 고차원 데이터를 저차원
    부분공간으로 압축, (2) 각 탐지기의 학습·추론 비용을 예측해 작업을 균형 있게 병렬 분배, (3) 비지도 모델을 지도 회귀모형으로
    근사해 추론을 가속하는 세 모듈로 구성됩니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 개별 알고리즘 성능을 크게 희생하지 않으면서 대규모 이종 앙상블의 학습·추론
    속도를 수 배 향상시킵니다.</p>
    <p><strong>단점</strong> — 프레임워크 자체가 이상치를 새로 탐지하는 것이 아니라 기존 탐지기들의 가속 계층이라 단독으로는
    사용할 수 없습니다.</p>`,
    applications: `<p>수십 개의 PyOD 탐지기를 동시에 운용하는 대규모 프로덕션 이상탐지 파이프라인의 속도 최적화에
    사용됩니다. PyOD의 SUOD 클래스로 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'thresh',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '임계값 합 (Thresh, Threshold Sum)',
    subtitle: '각 기저 탐지기의 점수를 개별 임계값 초과분으로 정규화한 뒤 합산해 결합하는 점수 결합 기법',
    overview: `<p>이상치 앙상블 결합 방법 중 하나로, 원점수를 그대로 평균·최댓값으로 결합하는 대신 각 기저 탐지기별로
    개별 임계값(threshold)을 정해 초과분을 정규화한 뒤 이를 합산하여 최종 점수를 산출합니다. 탐지기마다 점수 스케일이 크게
    다를 때 단순 평균보다 공정하게 결합할 수 있습니다.</p>`,
    formula: `score(x) = &#8721;&#7522;&#8331;&#8331;&#7580; max(0, score&#7522;(x) - &#964;&#7522;)`,
    features: `<p><strong>장점</strong> — 탐지기 간 점수 스케일 차이의 영향을 줄여 서로 다른 알고리즘을 공정하게 결합할
    수 있습니다.</p>
    <p><strong>단점</strong> — 탐지기별 임계값(&#964;&#7522;) 설정 방법에 따라 결합 성능이 달라집니다.</p>`,
    applications: `<p>스케일이 크게 다른 이질적 탐지기(예: 거리 기반과 확률 기반)를 함께 앙상블할 때 사용되며, PyOD의
    combination 모듈에서 average·maximization·aom·moa 등 다른 결합 함수와 함께 제공됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

  /* ================= [1.5.6] Time-series Anomaly Detection (시계열 이상치 탐지) ================= */
  {
    id: 'arima-residual-analysis',
    category: 'unsup',
    subcategory: 'anomaly',
    title: 'ARIMA 기반 잔차 분석 (ARIMA-based Residual Analysis)',
    subtitle: '시계열을 ARIMA 모델로 예측한 뒤 실제값과의 잔차가 큰 시점을 이상치로 판단하는 기법',
    overview: `<p>자기회귀누적이동평균(ARIMA) 모델로 시계열의 추세·계절성·자기상관 구조를 학습해 각 시점의 예측값을 구하고,
    실제 관측값과 예측값의 차이(잔차)를 계산합니다. 잔차가 통계적으로 유의한 수준(예: 표준편차의 몇 배)을 넘으면 이상치로
    판정합니다.</p>`,
    formula: `e&#8339; = y&#8339; - &#375;&#8339; ,&nbsp;&nbsp; 이상치 &#8660; |e&#8339;| &gt; k&#183;&#963;&#7522;`,
    features: `<p><strong>장점</strong> — 시계열의 추세·계절성을 명시적으로 제거한 후 잔차만 보므로 정상 변동과 이상
    변동을 잘 구분합니다.</p>
    <p><strong>단점</strong> — ARIMA의 정상성(stationarity) 가정과 차수(p,d,q) 선택이 까다롭고, 구조적 변화가 잦은
    시계열에는 재학습이 필요합니다.</p>`,
    applications: `<p>서버 자원 사용률·판매량 등 계절성이 뚜렷한 시계열의 이상 구간 탐지, 금융·통계 시계열의 이상치
    스크리닝에 사용됩니다. Python statsmodels의 ARIMA 클래스로 구현할 수 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'discord-discovery',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '불일치 발견 (Discord Discovery)',
    subtitle: '시계열에서 자신과 가장 가까운(겹치지 않는) 부분열과도 가장 멀리 떨어진 구간을 이상치로 찾는 기법',
    overview: `<p>Keogh et al.이 제안한 개념으로, 길이 l의 모든 부분열(subsequence) 중 자신과 겹치지 않는 최근접 이웃
    부분열까지의 거리가 가장 큰 구간을 "discord"(불일치 구간)로 정의합니다. 조정할 파라미터가 부분열 길이 하나뿐이라는
    단순함 덕분에 시계열 이상탐지의 대표적 방법으로 자리잡았으며, HOT SAX 등 고속 탐색 알고리즘으로 계산합니다.</p>`,
    formula: `discord = argmax&#8347;&#7522; ( min&#8347;&#7527; : non-overlapping dist(S&#7522;, S&#7527;) )`,
    features: `<p><strong>장점</strong> — 조정할 파라미터가 부분열 길이 정도로 매우 단순하고 미묘한 이상 패턴도 잘
    잡아냅니다.</p>
    <p><strong>단점</strong> — 전수 비교 시 계산량이 O(n&#178;)로 크며, 부분열 길이 선택에 결과가 달라질 수 있습니다.</p>`,
    applications: `<p>심전도(ECG)의 이상 파형 구간 탐지, 산업 설비 진동 신호의 이상 패턴 탐지 등에 활용되며, Matrix
    Profile 계산 결과에서 가장 큰 값을 갖는 구간으로도 동일하게 찾을 수 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'exponential-smoothing',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '지수 평활 (Exponential Smoothing)',
    subtitle: '최근 관측치에 더 큰 가중치를 지수적으로 부여해 예측값을 만들고 잔차로 이상치를 찾는 시계열 기법',
    overview: `<p>홀트-윈터스(Holt-Winters) 지수평활법 등으로 추세·계절성을 반영한 예측값을 순차적으로 갱신하고, 실제값과
    예측값의 차이(잔차) 또는 예측 신뢰구간을 벗어나는 정도로 이상치를 판정합니다. ARIMA보다 계산이 가볍고 온라인 갱신에
    적합합니다.</p>`,
    formula: `&#374;&#8339; = &#945;y&#8339; + (1-&#945;)&#374;&#8339;&#8331;&#8321; &nbsp;(단순지수평활, &#945;: 평활계수)`,
    features: `<p><strong>장점</strong> — 계산이 가볍고 온라인으로 순차 갱신하기 쉬워 실시간 모니터링에 적합합니다.</p>
    <p><strong>단점</strong> — 급격한 구조변화(레벨 시프트)에는 반응이 느릴 수 있고 평활계수 선택이 결과에 영향을
    줍니다.</p>`,
    applications: `<p>서버·네트워크 지표의 실시간 임계치 기반 알림 시스템, 재고·수요 예측의 이상 수요 탐지에 널리
    사용됩니다. Python statsmodels의 ExponentialSmoothing 클래스로 구현할 수 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'matrix-profile',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '행렬 프로파일 (Matrix Profile)',
    subtitle: '시계열의 모든 부분열 쌍의 최근접 거리를 미리 계산해 이상치와 반복 패턴을 동시에 찾는 자료구조 기반 기법',
    overview: `<p>Yeh et al.(2016)이 제안했습니다. 시계열의 길이 l인 모든 부분열에 대해, 자신과 겹치지 않는 가장 가까운
    부분열까지의 거리를 저장한 배열(Matrix Profile)을 STOMP·STAMP 등의 알고리즘으로 효율적으로 계산합니다. 값이 가장 큰
    지점이 discord(이상 구간), 가장 작은 지점이 motif(반복 패턴)에 해당합니다.</p>`,
    formula: `MP[i] = min&#7522;&#7522;&#8722;&#7527;&#8339;&#8805;&#8318; dist(S&#7522;, S&#7527;) &nbsp;(S&#7522;: i에서 시작하는 길이 l의 부분열)`,
    features: `<p><strong>장점</strong> — 도메인 지식 없이 부분열 길이 하나만으로 이상치와 반복 패턴을 동시에 찾을 수
    있고, STOMP 등으로 대규모 시계열에도 확장할 수 있습니다.</p>
    <p><strong>단점</strong> — 부분열 길이(l) 선택에 결과가 민감하고 다변량 시계열로 확장 시 계산비용이 증가합니다.</p>`,
    applications: `<p>산업 설비의 센서 시계열에서 반복되는 정상 패턴과 이상 구간을 동시에 찾는 예지보전, 심전도·뇌파 등
    생체신호의 이상 파형 탐지에 사용됩니다. Python stumpy 라이브러리로 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'moving-average-median',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '이동 평균/중앙값 (Moving Average/Median)',
    subtitle: '일정 구간의 평균 또는 중앙값을 기준선으로 삼아 크게 벗어난 값을 이상치로 판단하는 가장 단순한 시계열 기법',
    overview: `<p>최근 w개 시점의 평균(또는 이상치에 더 강건한 중앙값)을 이동시키며 계산해 기준선(baseline)으로 삼고,
    실제 관측값이 이 기준선에서 일정 폭(표준편차 배수 또는 절대편차) 이상 벗어나면 이상치로 판정합니다. 계절성·추세가 약한
    단순 시계열에 적합한 입문적 방법입니다.</p>`,
    formula: `MA&#8339; = (1/w)&#8721;&#7522;&#8339;&#8331;&#119908;&#8330;&#8321;&#8339; y&#7522; ,&nbsp;&nbsp; 이상치 &#8660; |y&#8339; - MA&#8339;| &gt; k&#183;&#963;&#119908;`,
    features: `<p><strong>장점</strong> — 구현이 매우 간단하고 계산비용이 낮아 실시간 스트리밍에도 적용하기 쉽습니다.</p>
    <p><strong>단점</strong> — 창 크기(w) 선택에 민감하고 뚜렷한 계절성·비선형 추세가 있는 시계열에는 부정확합니다.</p>`,
    applications: `<p>설비 센서값의 실시간 임계치 알림, 온라인 대시보드의 간단한 이상 경고 규칙 등 가장 널리 쓰이는 1차
    이상탐지 기법입니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'prophet-anomaly-detection',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '프로펫 이상치 탐지 (Prophet Anomaly Detection)',
    subtitle: 'Facebook Prophet의 추세·계절성 분해 예측과 신뢰구간을 이용해 실제값의 이상 이탈을 탐지하는 기법',
    overview: `<p>Meta(Facebook)가 공개한 Prophet은 시계열을 추세(trend)·연간/주간/일간 계절성·휴일 효과의 가법 모델로
    분해해 예측하며 예측 신뢰구간(기본 80%)을 함께 제공합니다. 실제 관측값이 예측 신뢰구간을 벗어나는 정도(잔차와 불확실성
    구간의 비율)를 기준으로 이상치를 판정합니다.</p>`,
    formula: `y(t) = g(t) + s(t) + h(t) + &#949;&#8339; ,&nbsp;&nbsp; 이상치 &#8660; y&#8339; &#8713; [yhat_lower&#8339;, yhat_upper&#8339;]`,
    features: `<p><strong>장점</strong> — 계절성·휴일·결측치가 있는 실무 비즈니스 시계열에 강건하고 파라미터 튜닝 부담이
    적습니다.</p>
    <p><strong>단점</strong> — 급격한 구조변화나 다변량 상호작용을 반영하기 어렵고, 순수 이상탐지 전용 모델이 아니라
    예측 결과를 재활용하는 간접적 방식입니다.</p>`,
    applications: `<p>웹 트래픽·매출 등 계절성이 강한 비즈니스 지표의 이상 이탈 탐지, 마케팅 캠페인 효과와 이상 변동을
    함께 모니터링하는 대시보드에 사용됩니다. Python prophet 라이브러리로 구현할 수 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 's-h-esd',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '계절성 하이브리드 극단 스튜던트화 편차 (S-H-ESD, Seasonal Hybrid ESD)',
    subtitle: '시계열을 계절 분해한 뒤 잔차에 강건 통계량과 Generalized ESD 검정을 적용하는 트위터의 시계열 이상탐지 기법',
    overview: `<p>Hochenbaum, Vallis & Kejariwal(2014, Twitter)이 제안했습니다. STL(계절-추세 분해)로 시계열의 추세와
    계절 성분을 제거해 잔차를 얻은 뒤, 평균·표준편차 대신 중앙값과 MAD(중앙값절대편차) 같은 강건 통계량을 사용해 Generalized
    ESD 검정을 적용, 전역(global) 이상치와 국소(local) 이상치를 모두 탐지합니다.</p>`,
    formula: `잔차 = y&#8339; - STL(trend+seasonal) ,&nbsp;&nbsp; median·MAD 기반 스튜던트화 통계량으로 Generalized ESD 순차 검정`,
    features: `<p><strong>장점</strong> — 계절성이 강한 실세계 시계열에서도 안정적으로 작동하고, 강건 통계량 사용으로
    이상치 자체의 왜곡 영향에 강합니다.</p>
    <p><strong>단점</strong> — STL 분해가 뚜렷한 계절 주기 존재를 전제로 하며, 비계절적 시계열이나 매우 짧은 시계열에는
    부적합합니다.</p>`,
    applications: `<p>트위터 등 대규모 서비스의 사용량·오류율 시계열 실시간 모니터링, 계절성이 뚜렷한 웹·앱 지표의
    이상탐지에 사용됩니다. Twitter의 AnomalyDetection(R) 패키지 및 그 파이썬 포팅 라이브러리로 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

  /* ================= [1.5.7] High-dimensional Outlier Detection (고차원 데이터 이상치 탐지) ================= */
  {
    id: 'abod-outlier-detection',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '각도 기반 이상치 탐지 (ABOD, Angle-Based Outlier Detection)',
    subtitle: '이웃 점들을 바라보는 각도의 분산으로 고차원 데이터의 이상치를 판별하는 기법',
    overview: `<p>Kriegel, Schubert & Zimek(2008)이 제안했습니다. 한 점에서 다른 두 점을 잇는 벡터 사이의 각도를 모든
    점 쌍에 대해 계산해 그 분산(각도분산, ABOF)을 이상치 점수로 사용합니다. 군집 내부의 점은 이웃들이 사방에 고르게 퍼져
    있어 각도 분산이 크고, 이상치는 이웃들이 대체로 한 방향에 몰려 있어 각도 분산이 작다는 통찰에 기반합니다. 거리 대신
    각도를 사용해 차원이 커져도 변별력이 유지되는 것이 핵심 장점입니다.</p>`,
    formula: `ABOF(p) = Var&#8348;,&#7522;&#8712;D ( &lang;&#8407;po,&#8407;pq&rang; / (||&#8407;po||&#178;||&#8407;pq||&#178;) )`,
    features: `<p><strong>장점</strong> — 거리 기반 기법이 겪는 차원의 저주에 강건해 고차원 데이터에서도 변별력을
    유지합니다.</p>
    <p><strong>단점</strong> — 모든 점 쌍의 각도를 계산하는 원조 버전은 O(n&#179;)로 매우 느립니다.</p>`,
    applications: `<p>유전체·텍스트 임베딩처럼 차원이 매우 높은 데이터의 이상탐지, 거리 기반 기법이 무력화되는 고차원
    실무 데이터에 사용됩니다. PyOD의 ABOD 클래스로 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'fastabod',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '고속 각도 기반 이상치 탐지 (FastABOD)',
    subtitle: '전체 점 쌍 대신 k-최근접 이웃만으로 각도 분산을 근사해 ABOD를 가속한 기법',
    overview: `<p>ABOD 원조 알고리즘이 모든 점 쌍을 고려해 O(n&#179;)의 비용이 드는 문제를 해결하기 위해 Kriegel et
    al.(2008)이 함께 제안한 근사 버전입니다. 전체 데이터가 아니라 k-최근접 이웃끼리만 각도 분산을 계산해 계산량을
    O(n&#183;k&#178;)로 대폭 줄입니다.</p>`,
    formula: `FastABOF(p) = Var&#8348;,&#7522;&#8712;N&#8342;(p) ( &lang;&#8407;po,&#8407;pq&rang; / (||&#8407;po||&#178;||&#8407;pq||&#178;) )`,
    features: `<p><strong>장점</strong> — 원조 ABOD와 비슷한 정확도를 유지하면서 대규모 데이터에도 적용 가능한 속도를
    제공합니다.</p>
    <p><strong>단점</strong> — 이웃 수(k) 선택에 따라 근사 품질이 달라지고 여전히 KNN 탐색 비용이 필요합니다.</p>`,
    applications: `<p>대용량 고차원 데이터에서 ABOD의 이상탐지 성능을 유지하면서 실무에 적용할 때 사용됩니다. PyOD의
    ABOD 클래스에서 method='fast' 옵션으로 제공됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'feature-selection-outlier-detection',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '이상치 탐지를 위한 특징 선택 (Feature Selection for Outlier Detection)',
    subtitle: '이상치가 드러나는 소수의 관련 특성만 선별해 고차원 데이터의 이상탐지 정확도를 높이는 전처리 전략',
    overview: `<p>고차원 데이터에서는 이상치가 전체 특성이 아니라 일부 부분공간(subspace)에서만 두드러지는 경우가 많아,
    관련 없는 특성이 섞이면 거리·밀도 기반 탐지기의 성능이 오히려 떨어집니다. 분산·상호정보량·부분공간 대비도(HiCS 등)를
    기준으로 이상치와 관련성이 높은 특성 부분집합을 먼저 선별한 뒤 그 위에서 탐지기를 적용하는 전략적 접근입니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 관련 없는 잡음 특성을 제거해 차원의 저주를 완화하고 탐지 정확도와
    해석가능성을 동시에 높입니다.</p>
    <p><strong>단점</strong> — 특성 선택 기준(분산·상관·부분공간 대비도)을 잘못 정하면 오히려 이상치가 드러나는 특성을
    제거할 위험이 있습니다.</p>`,
    applications: `<p>센서 수백 개 중 일부만 이상과 관련된 산업 설비 모니터링, 유전체 데이터처럼 특성 수가 표본 수보다
    훨씬 많은 고차원 이상탐지의 전처리 단계로 HiCS·SOD 등 부분공간 탐색 기법과 함께 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'hics',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '고대비 부분공간 (HiCS, High Contrast Subspaces)',
    subtitle: '밀도 대비가 높은 특성 부분공간을 통계적으로 탐색해 그 위에서 이상치 순위를 매기는 고차원 이상탐지 기법',
    overview: `<p>Keller, Müller & Böhm(2012, ICDE)이 제안했습니다. 고차원 데이터에서는 이상치가 전체 공간에서는 흩어져
    보여도 특정 부분공간에서는 뚜렷한 저밀도로 드러나는 경우가 많다는 점에 착안해, 여러 특성 부분집합의 주변분포와 결합분포
    차이(통계적 검정)를 이용해 대비(contrast)가 높은 부분공간들을 탐색합니다. 이렇게 찾은 고대비 부분공간들에서 LOF 등
    기존 밀도 기반 점수를 계산해 결합함으로써, 기존 기법이 전공간(full space)에서 무작위 순위로 퇴화하는 문제를
    완화합니다.</p>`,
    formula: `contrast(S) = 부분집합 S의 주변분포 대비 결합분포 편차(콜모고로프-스미르노프 검정 등으로 측정)`,
    features: `<p><strong>장점</strong> — 이상치가 숨어있는 관련 부분공간을 자동으로 탐색해 전공간 기반 기법보다 고차원
    이상탐지 정확도를 높입니다.</p>
    <p><strong>단점</strong> — 부분공간 탐색 자체의 계산비용이 크고 몬테카를로 샘플링 파라미터에 결과가 민감합니다.</p>`,
    applications: `<p>특성이 많고 이상치가 일부 특성 조합에서만 드러나는 고차원 산업·바이오 데이터의 이상탐지, 부분공간
    이상탐지 연구의 대표적 벤치마크 기법으로 사용됩니다. ELKI 라이브러리에 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'subspace-outlier-detection',
    category: 'unsup',
    subcategory: 'anomaly',
    title: '부분공간 이상치 탐지 (SOD, Subspace Outlier Detection)',
    subtitle: '이웃점들이 형성하는 저분산 부분공간(참조축)을 찾아 그 축에서 벗어난 정도로 이상치를 판별하는 고차원 기법',
    overview: `<p>Kriegel, Kröger, Schubert & Zimek(2009)이 제안했습니다. 각 점의 공유 최근접 이웃(SNN)으로 참조집합을
    구성하고, 그 참조집합의 분산이 작은 방향들을 모아 부분공간(참조축, reference subspace)을 정의합니다. 대상 점이 이
    저분산 부분공간을 기준으로 얼마나 벗어나 있는지를 거리로 측정해 이상치 점수로 사용하는, 축에 평행한(axis-parallel)
    부분공간에서 이상치를 탐지하는 대표 기법입니다.</p>`,
    formula: `SOD(p) = &#8730;( &#8721;&#7522;&#8712;relevant dims (p&#7522; - &#956;&#8337;&#8339;,&#7522;)&#178; )`,
    features: `<p><strong>장점</strong> — 전체 차원이 아닌 관련 부분공간만 사용해 고차원에서도 이상치가 드러나는 축을
    정확히 짚어낼 수 있습니다.</p>
    <p><strong>단점</strong> — 축에 평행한 부분공간만 고려해 임의 방향의 부분공간 이상치는 놓칠 수 있고, 참조집합 크기
    등 파라미터에 민감합니다.</p>`,
    applications: `<p>특성이 많고 일부 축 조합에서만 이상치가 드러나는 고차원 데이터(센서 그룹, 유전자 발현)의
    이상탐지에 사용됩니다. PyOD의 SOD 클래스 및 ELKI 라이브러리에 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  }

];
