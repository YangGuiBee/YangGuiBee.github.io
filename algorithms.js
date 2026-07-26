/* ── AI알고리즘 교과서 데이터 ── */
/* 분류 체계는 List2.md 기준: 비지도학습 / 지도학습 / 강화학습 / 앙상블 */
const CATS = [
  { key: 'unsup', label: '비지도학습', subs: [
    { key: 'visualization', label: '시각화' },
    { key: 'clustering', label: '군집화' },
    { key: 'association', label: '연관규칙' },
    { key: 'dim-reduction', label: '차원축소' },
    { key: 'anomaly', label: '이상치탐지' },
    { key: 'neural', label: '신경망 기반' },
    { key: 'density-covariance', label: '밀도·공분산 추정' },
    { key: 'evaluation', label: '평가' }
  ]},
  { key: 'sup', label: '지도학습', subs: [
    { key: 'regression', label: '회귀' },
    { key: 'classification', label: '분류' },
    { key: 'reg-class', label: '회귀+분류' },
    { key: 'evaluation', label: '평가' }
  ]},
  { key: 'rl', label: '강화학습', subs: [
    { key: 'value-based', label: 'Value-based' },
    { key: 'policy-based', label: 'Policy-based' },
    { key: 'model-based-given', label: 'Model-based (Given)' },
    { key: 'model-based-learn', label: 'Model-based (Learn)' }
  ]},
  { key: 'ensemble', label: '앙상블', subs: [
    { key: 'voting', label: '보팅' },
    { key: 'bagging', label: '배깅' },
    { key: 'boosting', label: '부스팅' },
    { key: 'stacking', label: '스태킹' }
  ]}
];

const ALGORITHMS = [
  {
    id: 'linear-regression',
    category: 'sup',
    subcategory: 'regression',
    title: '선형 회귀 (Linear Regression)',
    subtitle: '연속적인 수치를 예측하는 가장 기본적인 지도학습 모델',
    overview: `<p>입력 변수(특성)와 출력 변수(정답) 사이의 관계를 하나의 직선(또는 초평면)으로 근사하는 모델입니다.
      정답과의 오차 제곱합(MSE)을 최소화하는 방향으로 가중치를 학습하며, 회귀 문제의 기준선(baseline)으로 가장 널리 쓰입니다.</p>`,
    formula: `y&#770; = w&#183;x + b,&nbsp;&nbsp; Loss = (1/n) &#8721; (y&#7522; − y&#770;&#7522;)&#178;`,
    applications: `<p>부동산 가격 예측(면적·연식·위치로 매매가 추정), 광고 예산 대비 매출 예측, 온도·습도로 전력 수요 예측 등
      입력과 출력이 선형에 가까운 실무 문제에서 해석이 쉬운 베이스라인 모델로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'decision-tree',
    category: 'sup',
    subcategory: 'reg-class',
    title: '결정트리 (Decision Tree)',
    subtitle: '조건 분기를 통해 데이터를 분류·회귀하는 트리 구조 모델',
    overview: `<p>데이터를 가장 잘 나누는 특성과 기준값을 찾아 재귀적으로 분기하며, 각 리프 노드가 하나의 예측값(클래스 또는 평균값)을
      갖도록 트리를 구성합니다. 분기 기준으로는 지니 불순도(Gini) 또는 정보 이득(Information Gain)을 사용합니다.</p>`,
    formula: `Gini = 1 − &#8721; p&#7522;&#178;,&nbsp;&nbsp; Information Gain = H(parent) − &#8721; (n&#7522;/n)&#183;H(child&#7522;)`,
    applications: `<p>신용평가·대출 심사, 의료 진단 규칙(증상 기반 질병 분류), 고객 이탈 예측 등 "왜 이렇게 판단했는가"를
      사람이 직접 규칙으로 설명해야 하는 화이트박스 모델이 필요한 분야에서 널리 사용됩니다. 랜덤포레스트·XGBoost 등
      앙상블 모델의 기본 구성 요소이기도 합니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'kmeans',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'K-Means Clustering : K-평균 군집화',
    subtitle: '정답 레이블 없이 데이터를 K개의 군집으로 나누는 대표적 비지도학습',
    overview: `<p>K개의 중심점(centroid)을 임의로 초기화한 뒤, ①각 데이터를 가장 가까운 중심점에 할당 → ②각 군집의 평균으로
      중심점을 갱신하는 과정을 반복해 군집이 더 이상 바뀌지 않을 때까지 수렴시키는 알고리즘.</p>`,
    formula: 'J = Σ_k Σ_{x_i ∈ C_k} ||x_i − μ_k||²  (군집 내 거리 제곱합 최소화)',
    features: `<p>계산이 빠르고 구현이 단순해 대규모 데이터의 기본 베이스라인으로 적합, 중심점이 평균이므로 대표 패턴 해석이 직관적, 다양한 변형으로 확장이 가능한 장점, K를 사전에 정해야 하고(최적 K를 찾는 이론적으로 확립된 방법은 없음) 초기 중심에 민감해 지역 최적해에 빠질 수 있으며(scikit-learn은 기본값으로 k-means++ 초기화를 사용해 완화), 군집이 볼록·등방적이라는 가정 때문에 이상치와 비구형(비선형) 클러스터에 약한 단점.</p>`,
    applications: `<p>고객 세분화(연령대·구매 패턴별 방문자 그룹화 등 마케팅 타겟팅), 이미지 색상 압축(색상을 K개 대표색으로 양자화), 이상치 탐지 전처리,
      뉴스 기사 주제별 자동 그룹핑 등 레이블 없는 대규모 데이터의 빠른 구조화에 사용.</p>`,
    sklearnFunction: 'KMeans',
    sklearnGuideURL: `https://scikit-learn.org/stable/modules/clustering.html#k-means`,
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/cluster/plot_kmeans_digits.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://www.cs.cmu.edu/~bhiksha/courses/mlsp.fall2010/class14/macqueen.pdf`
  },
  {
    id: 'dbscan',
    category: 'unsup',
    subcategory: 'clustering',
    title: `DBSCAN(Density-Based Spatial Clustering of Applications with Noise) : 잡음을 포함한 밀도 기반 공간 클러스터링`,
    subtitle: `밀도가 높은 영역을 자동으로 찾아 군집을 형성하고, 어디에도 속하지 않는 점은 이상치로 분류하는 밀도 기반 군집화`,
    overview: `<p>각 점의 반경(eps) 안에 있는 이웃 수가 최소 개수(minPts) 이상이면 핵심점으로 표시하고, 핵심점끼리 이웃하면 하나의 군집으로 연결하는 기법. 어떤 핵심점의 이웃도 아닌 점은 잡음(noise)으로 분류. 군집 개수를 미리 지정할 필요가 없고 임의 모양의 군집도 탐지 가능.</p>`,
    formula: `핵심점 조건: |N_eps(p)| ≥ minPts  (N_eps(p)는 p로부터 거리 eps 이내의 이웃 집합)`,
    features: `<p>군집의 개수를 사전 설정할 필요 없으며, 이상치(outliers)를 자연스럽게 처리 가능하고, 원형이 아닌 임의 모양의 군집도 찾아내는 장점, 적절한 파라미터(Epsilon(&#949;), Min Points(MinPts)) 설정이 필요하며, 밀도가 균일하지 않은 데이터에 부적합하고, 고차원에서는 거리 개념이 무너져 성능이 떨어지는 단점.</p>`,
    applications: `<p>위성·지도 데이터의 밀집 지역(도시) 자동 탐지, 신용카드 이상거래 탐지, 공간 데이터의 핫스팟 분석 등 군집 모양이 비정형이거나 개수를 모르는 상황에 널리 사용.</p>`,
    sklearnFunction: 'DBSCAN',
    sklearnGuideURL: `https://scikit-learn.org/stable/modules/clustering.html#dbscan`,
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.cluster.DBSCAN.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/cluster/plot_dbscan.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://cdn.aaai.org/KDD/1996/KDD96-037.pdf'
  },
  {
    id: 'hierarchical-clustering',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'Agglomerative/Divisive Clustering : 병합적(상향식)/분할적(하향식) 클러스터링',
    subtitle: '개별 데이터를 점차 병합하거나 전체를 점차 분할하며 나무(덴드로그램) 구조의 계층을 만드는 군집화',
    overview: `<p>병합적(Agglomerative, 상향식)은 모든 데이터를 각각 하나의 군집으로 보고 가장 가까운 두 군집을 반복적으로 합쳐 나가고, 분할적(Divisive, 하향식)은 반대로 전체를 하나의 군집으로 두고 점차 쪼개는 방식. 군집 간 거리 계산법(연결법, linkage)에 따라 최단·최장·평균·와드(Ward) 연결법으로 구분.</p>`,
    formula: 'Ward 연결법: 두 군집을 병합했을 때 군집 내 분산 증가량이 최소가 되는 쌍을 선택',
    features: `<p>군집 개수를 미리 정하지 않고 덴드로그램을 본 뒤 결정할 수 있고, 계층 구조 자체가 데이터의 포함 관계를 보여줘 해석에 유용하며, 연결법 선택으로 군집 모양을 조절할 수 있는 장점, 계산량이 데이터 수의 제곱~세제곱에 비례해 대용량 데이터에 부적합하고, 한 번 병합·분할한 결정은 되돌릴 수 없어(greedy) 초기 오류가 끝까지 전파되는 단점.</p>`,
    applications: `<p>생물 분류학의 계통수 작성, 유전자 발현 데이터의 계층적 히트맵 분석, 문서의 주제별 계층 분류 등 "몇 개로 나눌지"를 데이터를 본 뒤 유연하게 정하고 싶은 탐색적 분석에 사용.</p>`,
    sklearnFunction: 'AgglomerativeClustering',
    sklearnGuideURL: `https://scikit-learn.org/stable/modules/clustering.html#hierarchical-clustering`,
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.cluster.AgglomerativeClustering.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/cluster/plot_agglomerative_dendrogram.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://arxiv.org/abs/1109.2378'
  },
  {
    id: 'gmm-em',
    category: 'unsup',
    subcategory: 'clustering',
    title: `GMM(Gaussian Mixture Model) : 가우시안 혼합 모델 / EM(Expectation-Maximization) : 기대값 최대화 알고리즘`,
    subtitle: '데이터가 여러 가우시안 분포의 혼합으로 생성되었다고 가정하고 소속 확률을 계산하는 모델 기반 군집화',
    overview: `<p>K-평균이 각 데이터를 하나의 군집에만 강제 배정하는 것과 달리, 각 데이터가 여러 군집에 속할 확률(소프트 배정)을 부여하는 기법. 기대값 최대화(EM) 알고리즘으로 학습하며, E-step에서 각 데이터의 군집 소속 확률을 계산하고 M-step에서 그 확률을 가중치로 각 군집의 평균·공분산·비중을 재추정하는 과정을 수렴할 때까지 반복.</p>`,
    formula: `p(x) = Σ_{k=1..K} π_k · N(x | μ_k, Σ_k)  (π_k: k번째 군집의 혼합 비중, Σ_k π_k = 1)`,
    features: `<p>소프트 군집화로 군집 경계의 불확실성을 확률로 표현할 수 있고, 공분산 행렬을 통해 타원형 등 K-평균보다 다양한 모양의 군집을 표현하며, 생성 모델이라 새 데이터의 확률도 계산 가능한 장점, 군집 개수(K)를 미리 지정해야 하고 초기값에 따라 지역 최적해에 빠질 수 있으며, 고차원에서는 공분산 추정이 불안정해지는 단점.</p>`,
    applications: `<p>고객 세그먼트가 겹치는 특성을 확률로 표현해야 하는 마케팅 분석, 음성 신호의 화자 분리, 모든 군집에 대한 확률이 낮은 데이터를 이상치로 판단하는 이상 탐지에 사용.</p>`,
    sklearnFunction: 'GaussianMixture',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/mixture.html',
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.mixture.GaussianMixture.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/mixture/plot_gmm.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://www.jstor.org/stable/2984875'
  },
  {
    id: 'mean-shift',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'Mean-Shift Clustering : 평균 이동 클러스터링',
    subtitle: '데이터 밀도가 가장 높은 지점(봉우리)으로 점을 반복 이동시키며 군집을 형성하는 밀도 기반 군집화',
    overview: `<p>각 데이터 점에서 출발해 커널 반경 내 이웃들의 평균 방향으로 점을 반복 이동시키는 기법. 모든 점이 결국 밀도가 가장 높은 지점(mode)으로 수렴하며, 같은 봉우리로 수렴한 점들이 하나의 군집이 됨. 군집 개수를 미리 정할 필요가 없음.</p>`,
    formula: `m(x) = ( Σ K(x_i − x)·x_i ) / ( Σ K(x_i − x) ) − x  (평균 이동 벡터, K는 커널 함수)`,
    features: `<p>군집 개수 사전 설정 불필요하며, 비선형적 분포에도 적합한 장점, 계산 비용이 크고 고차원 데이터에 적합하지 않으며, 대역폭(bandwidth) 파라미터 선택이 까다로운 단점.</p>`,
    applications: `<p>이미지 분할 및 객체 추적(컴퓨터 비전에서 색상·특징 기반 물체 위치 추적), 이상치에 덜 민감한 군집화가 필요한 영상 처리에 사용.</p>`,
    sklearnFunction: 'MeanShift',
    sklearnGuideURL: `https://scikit-learn.org/stable/modules/clustering.html#mean-shift`,
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.cluster.MeanShift.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/cluster/plot_mean_shift.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://courses.csail.mit.edu/6.869/handouts/PAMIMeanshift.pdf`
  },
  {
    id: 'spectral-clustering',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'Spectral Clustering(Normalized Cuts) : 스펙트럴 클러스터링, 정규화 컷',
    subtitle: '데이터를 그래프로 표현한 뒤 그래프를 가장 적게 끊는 방식으로 나누는 그래프 기반 군집화',
    overview: `<p>데이터 포인트를 노드로, 유사도를 간선 가중치로 하는 그래프를 만들고 라플라시안 행렬을 고유분해해 상위 고유벡터로 저차원 공간에 투영하는 기법. 이 공간에서 K-평균 같은 단순 군집화를 적용하면 원래 공간에서 원형이 아니었던 복잡한 모양의 군집도 잘 분리.</p>`,
    formula: 'L = D − W  (라플라시안 = 차수행렬 − 인접행렬), 상위 k개 고유벡터로 임베딩 후 K-평균 적용',
    features: `<p>비선형적으로 얽힌 복잡한 모양의 군집도 잘 분리하고 그래프 구조 데이터에 자연스럽게 적용되는 장점, 유사도 그래프의 고유분해 계산 비용이 커서 대규모 데이터에 부적합하고 유사도 척도·군집 개수 설정에 결과가 민감한 단점.</p>`,
    applications: `<p>이미지 분할(픽셀 유사도 그래프로 객체 경계 탐지), 소셜 네트워크의 커뮤니티 탐지, 비선형적으로 얽힌 데이터의 군집화에 사용.</p>`,
    sklearnFunction: 'SpectralClustering',
    sklearnGuideURL: `https://scikit-learn.org/stable/modules/clustering.html#spectral-clustering`,
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.cluster.SpectralClustering.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/cluster/plot_segmentation_toy.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://arxiv.org/pdf/0711.0189'
  },
  {
    id: 'affinity-propagation',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'Affinity Propagation : 친화도 전파',
    subtitle: '모든 데이터가 서로 메시지를 주고받으며 대표 데이터(exemplar)를 자동으로 찾아내는 그래프 기반 군집화',
    overview: `<p>군집 개수를 미리 지정하지 않고, 모든 데이터 쌍이 책임도(responsibility)와 가용도(availability) 메시지를 반복적으로 주고받으며 어떤 데이터가 군집 대표(exemplar)가 될지 자동 결정하는 기법. 수렴하면 각 데이터는 자신에게 가장 적합한 대표를 따라 군집을 형성.</p>`,
    formula: `r(i,k) ← s(i,k) − max_{k′≠k}{a(i,k′)+s(i,k′)},  a(i,k) ← min{0, r(k,k) + Σ_{i′∉{i,k}} max(0, r(i′,k))}`,
    features: `<p>군집 개수를 자동으로 결정하고 실제 데이터 포인트를 대표(exemplar)로 사용해 해석이 쉬운 장점, 시간·메모리 복잡도가 데이터 수의 제곱에 비례해 대규모 데이터에 부적합하고, 선호도(preference) 파라미터에 결과가 민감하며 수렴이 진동할 수 있는 단점.</p>`,
    applications: `<p>문서 요약의 대표 문장 선택, 유전자 데이터의 대표 서열 탐색, 이미지 집합의 대표 이미지 선정 등 군집 개수를 모르면서 대표 사례를 뽑아야 하는 상황에 사용.</p>`,
    sklearnFunction: 'AffinityPropagation',
    sklearnGuideURL: `https://scikit-learn.org/stable/modules/clustering.html#affinity-propagation`,
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.cluster.AffinityPropagation.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/cluster/plot_affinity_propagation.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://www.science.org/doi/10.1126/science.1136800'
  },
  {
    id: 'birch',
    category: 'unsup',
    subcategory: 'clustering',
    title: `BIRCH(Balanced Iterative Reducing and Clustering using Hierarchies) : 계층을 이용한 균형 반복 축소 클러스터링`,
    subtitle: '대용량 데이터를 한 번의 스캔으로 압축된 트리(CF Tree)에 요약한 뒤 군집화하는 대규모 특화 기법',
    overview: `<p>데이터를 하나씩 읽으면서 개수·합·제곱합으로 이루어진 CF(Clustering Feature)라는 압축 통계만 CF Tree에 누적하고 원본은 버리는 방식. 전체 데이터를 메모리에 올리지 않고도 군집 구조를 파악할 수 있어 데이터가 매우 크거나 한 번만 훑을 수 있는 스트리밍 상황에 적합.</p>`,
    formula: 'CF = (N, LS, SS)  (N: 데이터 개수, LS: 선형합 Σx_i, SS: 제곱합 Σx_i²)',
    features: `<p>메모리를 절약하면서 대규모 데이터를 처리할 수 있으며 다른 계층적 알고리즘보다 속도가 빠르며, 데이터를 압축하여 군집화 과정을 단순화할 수 있는 장점, 군집의 밀도가 고르게 분포된 경우에 더 잘 작동하며, 밀도가 불균일한 경우 성능이 저하될 수 있으며, 초기 매개변수 설정에 따라 성능이 크게 영향을 받을 수 있는 단점.</p>`,
    applications: `<p>수백만 건 규모의 거래·로그 데이터 군집화, 실시간 스트리밍 데이터의 온라인 군집화 등 메모리에 다 올릴 수 없는 대용량 데이터 분석에 사용.</p>`,
    sklearnFunction: 'Birch',
    sklearnGuideURL: `https://scikit-learn.org/stable/modules/clustering.html#birch`,
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.cluster.Birch.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/cluster/plot_birch_vs_minibatchkmeans.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://dl.acm.org/doi/10.1145/235968.233324'
  },
  {
    id: 'hdbscan',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'HDBSCAN(Hierarchical DBSCAN) : 계층적 DBSCAN',
    subtitle: 'DBSCAN을 확장해 하나의 eps 없이도 밀도가 서로 다른 여러 군집을 찾아내는 계층적 밀도 기반 군집화',
    overview: `<p>DBSCAN이 하나의 반경(eps)에 의존해 밀도가 지역마다 다르면 실패하는 문제를 해결한 기법. 다양한 밀도 수준에서 계층적으로 군집 구조를 만든 뒤, 계층을 따라 가장 안정적으로 오래 유지되는 군집들을 자동으로 선택하므로 eps를 고정할 필요가 없음.</p>`,
    formula: `d_mreach(a,b) = max{core_k(a), core_k(b), d(a,b)}  (상호 도달 거리로 최소신장트리를 구성해 계층 생성)`,
    features: `<p>가변 밀도 대응(클러스터마다 밀도가 달라도 계층적으로 분석하여 적절한 클러스터를 추출), 노이즈 처리(이상치를 어떤 클러스터에도 할당하지 않고 노이즈로 분류하여 모델의 신뢰성 향상), 파라미터 단순화(DBSCAN에서 &#949; 파라미터를 설정할 필요 없음), 계층적 구조 제공의 장점, 계산 복잡도(대규모 데이터셋에 대해 일반적인 K-means보다 계산 비용이 높음), 데이터 편향성(극단적 희소성이나 불연속적 밀도 차이 시 성능 저하 가능), 파라미터 영향(최소 클러스터 크기 설정에 따라 결과가 크게 달라질 수 있음)의 단점.</p>`,
    applications: `<p>도심·교외처럼 지역별 밀도 차이가 큰 위치 데이터, 밀도가 불균일한 센서 데이터의 군집화, 이상치에 강건한 군집화가 필요한 실무 분석에 널리 사용.</p>`,
    sklearnFunction: 'HDBSCAN',
    sklearnGuideURL: `https://scikit-learn.org/stable/modules/clustering.html#hdbscan`,
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.cluster.HDBSCAN.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/cluster/plot_hdbscan.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://link.springer.com/chapter/10.1007/978-3-642-37456-2_14`
  },
  {
    id: 'cure',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'CURE(Clustering Using REpresentatives) : 대표점 기반 클러스터링',
    subtitle: '군집마다 여러 개의 대표점을 뽑아 중심 쪽으로 축소시켜 임의 모양과 이상치에 강건하게 병합하는 계층 군집화',
    overview: `<p>중심점 하나(centroid) 또는 모든 점(all-point)으로 군집 간 거리를 재는 대신, 각 군집에서 서로 멀리 흩어진 대표점 여러 개를 뽑고 이를 중심 쪽으로 일정 비율(&#945;)만큼 축소시켜 대표점으로 삼는 기법. 두 군집의 대표점 쌍 중 최소 거리를 군집 간 거리로 사용.</p>`,
    formula: 'p′ = p + α·(mean − p)  (α: 축소 비율, 대표점 p를 군집 중심 쪽으로 이동)',
    features: `<p>다양한 형태와 크기의 군집을 효과적으로 탐지할 수 있으며, 노이즈에 강하고 이상치의 영향을 적게 받는 장점, 대규모 데이터에서는 계산 비용이 높고, 군집 내 대표 포인트의 개수와 축소 비율 등의 매개변수 설정이 필요한 단점.</p>`,
    applications: `<p>임의 모양의 군집이 섞여 있거나 이상치가 많은 대용량 공간 데이터(지리 정보, 패턴 인식) 군집화에 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://www2.cs.sfu.ca/CourseCentral/459/han/papers/guha98.pdf`
  },
  {
    id: 'rock',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'ROCK(RObust Clustering using linKs) : 링크 기반 강건 클러스터링',
    subtitle: '거리 대신 두 데이터가 공유하는 이웃 수(링크)로 범주형 데이터를 군집화하는 계층 군집화',
    overview: `<p>범주형 데이터는 유클리드 거리로 유사도를 표현하기 어렵다는 점에 착안해, 두 점 사이의 거리를 직접 재는 대신 공통으로 갖는 이웃의 수(링크, link)를 세는 기법. 링크가 많을수록 같은 군집일 가능성이 높다고 보고 병합적 계층 군집화를 수행.</p>`,
    formula: 'link(p_i, p_j) = |N(p_i) ∩ N(p_j)|  (두 점이 공유하는 이웃의 개수)',
    features: `<p>범주형 데이터에 특화되어 있어 범주형 특성을 잘 반영한 군집화를 수행하고 밀도가 높은 군집을 잘 탐지할 수 있는 장점, 계산 비용이 높아 대규모 데이터셋에는 적합하지 않으며, 거리 계산보다 연결 기반 군집화가 복잡한 단점.</p>`,
    applications: `<p>시장 조사 설문처럼 범주형·이진형 속성이 많은 데이터의 군집화, 장바구니 데이터의 고객 유형 분류에 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://ieeexplore.ieee.org/document/754967/'
  },
  {
    id: 'chameleon',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'Chameleon : 카멜레온',
    subtitle: `그래프 분할로 작은 부분 군집을 만든 뒤 상호 연결성과 근접성을 함께 고려해 동적으로 병합하는 2단계 계층 군집화`,
    overview: `<p>1단계에서 데이터를 k-최근접이웃 그래프로 만들고 그래프 분할로 작은 부분 군집으로 나눈 뒤, 2단계에서 두 부분 군집 사이의 상호 연결성(연결 간선의 양)과 근접성(간선 가중치의 유사도)을 군집 자체의 내부 특성에 맞춰 동적으로 계산해 병합하는 기법. 고정된 정적 모델에 의존하지 않는 것이 핵심.</p>`,
    formula: `RI(C_i, C_j) = |EC(C_i,C_j)| / ((|EC(C_i)|+|EC(C_j)|)/2),  RC = 상대 근접성 → RI × RC^α 가 최대인 쌍을 병합`,
    features: `<p>군집의 밀도와 모양을 고려하여 다양한 군집 구조를 잘 탐지할 수 있으며 다른 계층적 군집화보다 유연한 군집화를 제공하는 장점, 계산 비용이 매우 높으며 대규모 데이터셋에서는 실행이 어려울 수 있으며 초기 클러스터링과 병합 기준을 설정하는 것이 어려운 단점.</p>`,
    applications: `<p>모양과 밀도가 크게 다른 군집이 혼재된 공간 데이터 분석, 동적 모델링 기반 계층 군집화 연구의 대표 사례로 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://cs.rhodes.edu/welshc/COMP465_S15/Papers/chameleon.pdf`
  },
  {
    id: 'agnes',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'AGNES(AGglomerative NESting) : 병합적 중첩',
    subtitle: '모든 데이터를 개별 군집으로 시작해 가장 유사한 두 군집을 반복적으로 합쳐나가는 상향식 계층 군집화',
    overview: `<p>각 데이터를 하나의 군집으로 두고 시작해, 매 단계마다 가장 유사한 두 군집을 하나로 합치는 과정을 모든 데이터가 하나가 될 때까지 반복하는 대표적 병합적 계층 군집화. 병합 과정 전체를 덴드로그램으로 기록해 원하는 높이에서 잘라 군집 수를 정함.</p>`,
    formula: '매 단계 d(C_i, C_j)가 최소인 군집 쌍을 병합 (d는 단일·완전·평균·Ward 연결법 중 선택)',
    features: `<p>덴드로그램으로 병합 전 과정을 시각적으로 확인할 수 있고 군집 개수를 사전에 정하지 않아도 되며, 연결법을 바꿔가며 다양한 군집 구조를 탐색할 수 있는 장점, 데이터 수가 많아지면 모든 쌍의 거리를 반복 계산해야 해 비용이 급격히 커지고, 한 번 병합한 결정은 되돌릴 수 없는(greedy) 단점.</p>`,
    applications: `<p>유전자 발현 데이터의 계통 분석, 고객·문서의 계층적 세분화 등 병합적 계층 군집화가 필요한 탐색적 분석 전반에 사용.</p>`,
    sklearnFunction: 'AgglomerativeClustering',
    sklearnGuideURL: `https://scikit-learn.org/stable/modules/clustering.html#hierarchical-clustering`,
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.cluster.AgglomerativeClustering.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/cluster/plot_agglomerative_dendrogram.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://onlinelibrary.wiley.com/doi/book/10.1002/9780470316801`
  },
  {
    id: 'diana',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'DIANA(DIvisive ANAlysis) : 분할적 분석',
    subtitle: '전체를 하나의 군집으로 시작해 가장 이질적인 군집을 반복적으로 쪼개나가는 하향식 계층 군집화',
    overview: `<p>AGNES와 정반대 방향으로, 모든 데이터를 하나의 큰 군집으로 두고 시작해 매 단계 가장 이질적인(지름이 큰) 군집을 둘로 분할하는 과정을 반복하는 기법. 전체 구조를 먼저 파악한 뒤 필요한 부분만 세분화할 수 있는 것이 특징.</p>`,
    formula: `매 단계 지름(diameter)이 최대인 군집을 선택 → 평균 비유사도가 가장 큰 점부터 분리군으로 이동시켜 2분할`,
    features: `<p>큰 구조를 먼저 파악한 뒤 필요한 부분만 세분화할 수 있어 상위 수준의 군집 구조를 빠르게 볼 수 있고, 상위 분할이 하위보다 신뢰도가 높아 대분류가 중요한 분석에 유리한 장점, 매 단계 최적 분할을 찾는 계산 비용이 병합적 방식보다 커서 실무에서는 AGNES보다 덜 사용되는 단점.</p>`,
    applications: `<p>큰 시장 세그먼트를 먼저 나누고 일부만 세부 세그먼트로 쪼개는 마케팅 분석 등 상위 구조가 우선인 계층 분석에 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://onlinelibrary.wiley.com/doi/book/10.1002/9780470316801`
  },
  {
    id: 'optics',
    category: 'unsup',
    subcategory: 'clustering',
    title: `OPTICS(Ordering Points To Identify the Clustering Structure) : 클러스터 구조 식별을 위한 점 순서화`,
    subtitle: '도달 거리 순서를 기록해 다양한 밀도의 군집 구조를 하나의 그래프로 한 번에 보여주는 밀도 기반 군집화',
    overview: `<p>DBSCAN처럼 밀도 기반으로 동작하되, 군집을 바로 확정하지 않고 모든 점을 도달 가능 거리(reachability distance)가 증가하는 순서로 정렬해 기록하는 기법. 이 순서를 그래프로 그리면 골짜기(valley) 구간이 각각 하나의 군집에 해당하며, 그래프 하나로 여러 eps 값에서의 군집 구조를 동시에 확인 가능.</p>`,
    formula: `reach-dist(p, o) = max{core-dist(o), d(o, p)}  (o의 핵심 거리와 실제 거리 중 큰 값)`,
    features: `<p>DBSCAN과 유사하게 이상치를 감지할 수 있으며, 여러 밀도 수준에서 군집을 식별 가능하고, eps를 하나로 고정하지 않아도 되는 장점, 계산 시간이 오래 걸릴 수 있으며, 적절한 매개변수 설정이 어려울 수 있고, 결과가 순서 그래프 형태라 최종 레이블을 얻으려면 추가 후처리가 필요한 단점.</p>`,
    applications: `<p>적절한 eps를 사전에 알기 어려운 탐색적 밀도 기반 군집 분석, 밀도가 다양한 실세계 공간 데이터 분석에 사용.</p>`,
    sklearnFunction: 'OPTICS',
    sklearnGuideURL: `https://scikit-learn.org/stable/modules/clustering.html#optics`,
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.cluster.OPTICS.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/cluster/plot_optics.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://www.dbs.ifi.lmu.de/Publikationen/Papers/OPTICS.pdf'
  },
  {
    id: 'denclue',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'DENCLUE(DENsity-based CLUstEring) : 밀도 기반 클러스터링',
    subtitle: '모든 데이터가 만드는 밀도 함수를 수학적으로 정의하고 그 봉우리(국소 최대점)를 찾아 군집을 정의하는 기법',
    overview: `<p>각 데이터가 주변에 미치는 영향을 커널(주로 가우시안) 형태의 영향 함수로 모델링하고, 이를 모두 더해 전체 공간의 밀도 함수를 커널 밀도 추정(KDE)으로 구성. 이후 각 점에서 경사를 따라 오르는 언덕 오르기로 밀도 유인자(density attractor)를 찾아, 같은 유인자로 수렴한 점들을 하나의 군집으로 묶는 기법.</p>`,
    formula: `f_D(x) = Σ_{i=1..n} K((x − x_i)/σ)  (K: 커널 함수, σ: 대역폭) → ∇f_D(x) = 0 인 국소 최대점이 군집 중심`,
    features: `<p>명확하게 정의된 군집을 생성하고, 밀도가 낮은 지역을 노이즈로 구분할 수 있으며, 데이터 분포에 따라 다양한 밀도의 군집을 잘 탐지할 수 있는 장점, 밀도 함수를 설정하는 데 필요한 매개변수가 많으며 계산이 복잡하여 대규모 데이터에서는 성능이 저하될 수 있는 단점.</p>`,
    applications: `<p>천체(별·은하) 분포처럼 밀도 지형 자체를 수학적으로 분석해야 하는 과학 데이터, 잡음이 많은 대용량 공간 데이터 연구에 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://www2.cs.uh.edu/~ceick/DM/Denclue2.pdf'
  },
  {
    id: 'density-peaks-clustering',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'DPC(Density Peaks Clustering) : 밀도 봉우리 클러스터링',
    subtitle: `군집 중심은 밀도가 높으면서 자신보다 밀도 높은 점과는 멀리 떨어져 있다는 두 성질로 중심을 찾는 밀도 기반 군집화`,
    overview: `<p>Rodriguez와 Laio가 2014년 Science에 발표한 기법으로, 각 점에 대해 국소 밀도(&#961;)와 자신보다 밀도가 높은 점들 중 최근접 거리(&#948;)를 계산. 두 값이 모두 큰 점을 결정 그래프(decision graph)에서 골라 군집 중심으로 삼고, 나머지 점은 자신보다 밀도가 높은 최근접 이웃을 따라 배정.</p>`,
    formula: `ρ_i = Σ_j χ(d_ij − d_c),  δ_i = min_{j: ρ_j > ρ_i} (d_ij)  (ρ: 국소 밀도, δ: 상대 거리)`,
    features: `<p>직관적 중심 정의, 결정 그래프를 통한 해석 가능성, 군집 형태 제약이 비교적 약함, 단순한 할당 과정의 장점, 거리 행렬 계산 비용(O(n&#178;)), 핵심 파라미터(컷오프 거리 d&#7580;)에 민감, 중심 선택이 반자동이라는 단점.</p>`,
    applications: `<p>군집 개수를 미리 정하기 어렵지만 결정 그래프로 직관적으로 판단하고 싶은 분석, 비구형 군집이 섞인 이미지·패턴 데이터의 군집화에 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://www.science.org/doi/10.1126/science.1242072'
  },
  {
    id: 'vdbscan',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'VDBSCAN(Varied Density DBSCAN) : 가변 밀도 DBSCAN',
    subtitle: `k-dist 그래프로 여러 밀도 수준의 eps를 자동 선정해 밀도가 다른 군집을 순차적으로 찾는 DBSCAN 확장`,
    overview: `<p>각 점에서 k번째 최근접 이웃까지의 거리(k-dist)를 정렬한 그래프를 그리고, 기울기가 급격히 꺾이는 지점을 분석해 밀도 수준별로 서로 다른 eps 값을 자동 선정하는 기법. 밀도가 높은 eps부터 순서대로 DBSCAN을 적용하고, 이미 군집화된 점은 다음 단계에서 제외.</p>`,
    formula: `k-dist(p) = p에서 k번째 최근접 이웃까지의 거리 → 정렬 후 급변점(knee)들을 eps_1, eps_2, ... 로 선정`,
    features: `<p>DBSCAN과 달리 여러 밀도 수준의 eps를 k-dist 그래프로 자동 선정해 밀도가 다른 군집을 함께 찾아내는 장점, k-dist 그래프의 꺾이는 지점을 정확히 판별하기 어려운 경우가 있고, 밀도 수준마다 DBSCAN을 반복 실행해야 해 계산 비용이 늘어나는 단점.</p>`,
    applications: `<p>단일 eps로는 놓치기 쉬운 도심·외곽처럼 밀도 차이가 뚜렷한 지리 공간 데이터, 다양한 밀도의 센서 데이터 군집화에 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://ieeexplore.ieee.org/document/4280175/'
  },
  {
    id: 'st-dbscan',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'ST-DBSCAN(Spatial-Temporal DBSCAN) : 시공간 DBSCAN',
    subtitle: '공간 거리와 시간 차이를 함께 고려해 위치는 가깝지만 시점이 다른 사건을 구분하는 DBSCAN 확장',
    overview: `<p>일반 DBSCAN이 공간 거리만으로 이웃을 판정하는 것과 달리, 공간 반경(eps1)과 시간 반경(eps2)을 모두 만족해야 이웃으로 인정하는 기법. 위치가 가까워도 발생 시점이 멀면 다른 군집으로 분리하며, 핵심 객체·잡음·인접 군집 판정을 시공간 데이터에 맞게 확장.</p>`,
    formula: `N(p) = { q | d_spatial(p,q) ≤ eps1 ∧ d_temporal(p,q) ≤ eps2 }`,
    features: `<p>위치만으로는 놓치는 시간적 패턴을 함께 포착해 같은 장소라도 다른 시점의 사건을 올바르게 구분하는 장점, 공간(eps1)·시간(eps2) 두 파라미터를 모두 조정해야 하고, DBSCAN과 마찬가지로 밀도 차이가 큰 데이터에는 취약한 단점.</p>`,
    applications: `<p>기상 데이터의 이상 기후 탐지, 질병 발생 감시(시공간 클러스터로 전염병 확산 파악), 교통사고 다발 구간·시간대 분석에 널리 사용.</p>`,
    sklearnFunction: 'ST_DBSCAN (st_dbscan)',
    sklearnGuideURL: 'https://github.com/eren-ck/st_dbscan',
    sklearnAPIURL: 'https://pypi.org/project/st-dbscan/',
    sklearnExampleURL: `https://github.com/eren-ck/st_dbscan/blob/master/demo/demo.ipynb`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://www.sciencedirect.com/science/article/pii/S0169023X06000218`
  },
  {
    id: 'adbscan',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'ADBSCAN(Adaptive DBSCAN) : 적응형 DBSCAN',
    subtitle: `센서 거리·데이터 밀도에 따라 eps와 최소 점 개수를 자동 조정해 파라미터 설정 부담을 줄인 DBSCAN 확장`,
    overview: `<p>DBSCAN의 eps·minPts를 데이터 전체에 고정 적용하면 밀도가 다른 영역에서 성능이 떨어지는 문제를 해결한 기법. 라이다·깊이 카메라처럼 센서에서 멀어질수록 점 밀도가 낮아지는 특성에 맞춰 반경과 최소 점 개수를 지역적으로 자동 계산해, 사실상 하나의 입력 파라미터만으로 다양한 밀도의 군집을 탐지.</p>`,
    formula: 'eps(x) = f(d_sensor(x))  (센서로부터의 거리·지역 밀도에 따라 반경을 적응적으로 산출)',
    features: `<p>파라미터를 거의 자동으로 조정해 사용자가 직접 튜닝할 부담이 적고, 센서 거리에 따라 밀도가 달라지는 실시간 3D 데이터에 강한 장점, 자동 조정 로직이 라이다·깊이 센서 등 특정 응용 맥락에 맞춰져 있어 일반 정형 데이터에는 범용성이 떨어질 수 있는 단점.</p>`,
    applications: '<p>2D/3D 라이다·깊이 카메라를 이용한 로봇·자율주행의 실시간 객체 탐지 및 위치 추정에 사용.</p>',
    sklearnFunction: '',
    sklearnGuideURL: `https://docs.openedgeplatform.intel.com/dev/edge-ai-suites/robotics-ai-suite/robotics/dev_guide/tutorials_amr/navigation/adbscan/index.html`,
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://ieeexplore.ieee.org/document/8628138/'
  },
  {
    id: 'minibatch-kmeans',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'Mini-Batch K-Means : 미니배치 K-평균',
    subtitle: '전체 데이터 대신 무작위 소표본(미니배치)만으로 중심점을 갱신해 속도를 크게 높인 K-평균 변형',
    overview: `<p>매 반복마다 전체 데이터를 모두 사용하는 K-평균과 달리, 무작위로 뽑은 작은 배치만으로 중심점을 조금씩 갱신하는 기법. 계산량이 배치 크기에 비례해 크게 줄어들어 수백만 건 규모나 스트리밍 환경에서도 실용적.</p>`,
    formula: 'c ← c + η(x − c)  (배치 내 각 샘플 x에 대해 학습률 η로 중심점 c를 점진적 갱신)',
    features: `<p>매우 큰 데이터에서 학습 속도가 크게 빨라짐, 스트리밍/온라인 학습처럼 데이터가 순차적으로 들어오는 환경에도 유리, K-means와 유사한 해석 가능(centroid 기반)의 장점, 배치 샘플링으로 인해 결과 변동(분산)이 커질 수 있음, 배치 크기·학습률 성격 파라미터에 민감할 수 있음, 작은 데이터에서는 일반 K-means 대비 장점이 크지 않은 단점.</p>`,
    applications: `<p>수백만 건 규모의 로그·텍스트·이미지 데이터 군집화, 실시간으로 유입되는 스트리밍 데이터의 온라인 군집화, 대용량 데이터의 빠른 사전 탐색에 사용.</p>`,
    sklearnFunction: 'MiniBatchKMeans',
    sklearnGuideURL: `https://scikit-learn.org/stable/modules/clustering.html#mini-batch-k-means`,
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.cluster.MiniBatchKMeans.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/cluster/plot_mini_batch_kmeans.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://dl.acm.org/doi/10.1145/1772690.1772862'
  },
  {
    id: 'wavecluster',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'WaveCluster : 웨이브 클러스터',
    subtitle: '격자로 나눈 데이터에 웨이블릿 변환을 적용해 군집 경계(고주파 성분)를 찾아내는 그리드 기반 군집화',
    overview: `<p>데이터 공간을 다차원 격자로 나누고 각 셀의 데이터 개수를 신호로 취급한 뒤, 웨이블릿 변환을 적용해 저주파 성분(군집 내부)과 고주파 성분(군집 경계)으로 분해하는 기법. 저주파 성분에서 밀도가 높은 격자를 연결 요소로 묶어 군집을 식별.</p>`,
    formula: `count matrix에 웨이블릿 변환 적용 → 평균 서브밴드(저주파)에서 연결 요소 탐색, 시간 복잡도 O(n)`,
    features: `<p>계산 복잡도가 데이터 수에 선형(O(n))이라 매우 빠르고, 임의 모양의 군집을 찾아내며 잡음에 강건하고 입력 순서에 영향받지 않는 장점, 격자 크기 설정에 결과가 민감하고 차원이 높아지면 격자 셀 수가 기하급수적으로 늘어나는 차원의 저주에 취약한 단점.</p>`,
    applications: `<p>대용량 공간 데이터베이스의 빠른 군집화, 임의 모양의 군집과 잡음이 섞인 이미지·지리 데이터 분석에 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://www.vldb.org/conf/1998/p428.pdf'
  },
  {
    id: 'sting',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'STING(STatistical INformation Grid) : 통계 정보 격자',
    subtitle: `공간을 계층적 사각형 셀로 나누고 각 셀에 통계 정보를 미리 저장해 한 번의 스캔으로 처리하는 그리드 기반 군집화`,
    overview: `<p>공간 영역을 쿼드트리처럼 계층적 사각형 셀로 나누는 기법. 최하위 셀은 실제 데이터로부터 개수·평균·표준편차·최솟값·최댓값·분포 유형을 직접 계산하고, 상위 셀은 하위 셀 정보를 합쳐 유도. 질의 시 최상위부터 조건에 맞지 않는 셀은 건너뛰며 내려감.</p>`,
    formula: `상위 셀 통계는 하위 셀에서 유도: n = Σ n_i,  mean = (Σ n_i · mean_i)/n  → 시간 복잡도 O(n)`,
    features: `<p>데이터를 한 번만 스캔해도 되어 시간 복잡도가 O(n)으로 매우 효율적이고 대규모 데이터에 잘 확장되며, 질의 기반 탐색이 가능한 장점, 셀 경계가 고정된 사각형이라 군집 경계가 계단식으로 나타나 정밀도가 떨어질 수 있는 단점.</p>`,
    applications: '<p>대규모 공간 데이터베이스의 질의 응답형 군집 탐색, 지리정보시스템(GIS)의 밀도 분석에 사용.</p>',
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://www.vldb.org/conf/1997/P186.PDF'
  },
  {
    id: 'clique',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'CLIQUE(CLustering In QUEst) : 격자 기반 부분공간 클러스터링',
    subtitle: '고차원 데이터의 부분 공간마다 격자를 만들어 밀집한 칸을 찾아내는 그리드 기반 부분 공간 군집화',
    overview: `<p>각 속성을 동일 크기 구간으로 나눠 격자를 만들고, 데이터가 일정 밀도(&#964;) 이상 들어있는 칸을 밀집 단위(dense unit)로 정의하는 기법. Apriori처럼 낮은 차원의 밀집 단위를 먼저 찾고 이를 결합해 높은 차원으로 확장하며, 전체 차원이 아닌 일부 속성 조합에서만 나타나는 군집도 발견.</p>`,
    formula: `selectivity(u) = |{x ∈ D : x ∈ u}| / |D| > τ  (밀집 단위 판정), 군집 = 인접한 밀집 단위의 최대 연결 집합`,
    features: `<p>전체 차원에서는 보이지 않는 부분 공간별 군집을 자동으로 발견하고, 차원 수에 대한 확장성이 좋으며 각 군집을 조건식으로 간결히 기술할 수 있는 장점, 격자 구간 수와 밀도 임계값(&#964;) 설정에 결과가 민감하고, 속성 수가 매우 많으면 탐색할 부분 공간 조합이 급격히 늘어나는 단점.</p>`,
    applications: `<p>속성이 매우 많은 고차원 데이터(유전자 발현, 다변량 센서)에서 일부 속성 조합에만 나타나는 숨은 군집 탐색에 사용.</p>`,
    sklearnFunction: 'CLIQUE (ELKI)',
    sklearnGuideURL: 'https://elki-project.github.io/algorithms/',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://dl.acm.org/doi/10.1145/276304.276314'
  },
  {
    id: 'optigrid',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'OptiGrid : 최적 격자',
    subtitle: '균등 격자 대신 밀도가 낮은 지점에 분할 초평면을 배치해 고차원에 특화한 최적 격자 군집화',
    overview: `<p>CLIQUE 등이 각 차원을 균등 간격으로 미리 나누는 것과 달리, 데이터 투영을 분석해 밀도가 가장 낮은 지점(군집 사이 골짜기)을 찾아 그곳에 분할 초평면을 배치하는 기법. 밀도가 낮은 곳만 잘라 나가므로 고차원에서도 효율적이고 수학적으로 뒷받침되는 격자 분할을 구성.</p>`,
    formula: '투영 밀도 f̂(x)의 국소 최소점에 분할 평면 배치 → 재귀적으로 부분공간 분할',
    features: `<p>균등 격자보다 데이터 분포에 맞춘 효율적 분할이 가능해 고차원에서도 계산 효율이 높은 장점, 분할 초평면을 찾는 밀도 추정 자체가 고차원에서 까다롭고 표준 라이브러리 구현체가 거의 없는 단점.</p>`,
    applications: `<p>차원이 매우 높아 균등 격자 방식(CLIQUE 등)이 비효율적인 고차원 데이터의 군집화 연구에 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://bib.dbvis.de/uploadedFiles/171.pdf'
  },
  {
    id: 'mafia',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'MAFIA(Merging of Adaptive Finite IntervAls) : 적응적 유한 구간 병합',
    subtitle: '각 차원을 데이터 분포에 맞춘 적응형 구간으로 나누어 CLIQUE보다 빠르고 정밀하게 부분 공간을 찾는 기법',
    overview: `<p>CLIQUE가 각 차원을 균등 크기로 나누는 것과 달리, 먼저 작은 균일 윈도우로 히스토그램을 만들고 히스토그램 값이 비슷한 인접 윈도우를 임계값(&#946;) 기준으로 병합해 데이터 분포에 맞는 적응형 구간을 만드는 기법. 이 구간들로 낮은 차원부터 밀집 단위를 찾아 고차원으로 결합.</p>`,
    formula: `인접 윈도우 w_i, w_{i+1} 병합 조건: |max(w_i) − max(w_{i+1})| < β  (β: 병합 임계값)`,
    features: `<p>적응형 구간이 데이터 분포를 반영해 CLIQUE보다 계산량이 적고 정밀한 군집 경계를 찾으며, 대용량 데이터로의 확장성이 좋은 장점, 윈도우 병합 임계값(&#946;) 등 추가 파라미터가 필요하고, 차원이 매우 높아지면 부분 공간 탐색 비용은 여전히 큰 단점.</p>`,
    applications: `<p>대규모·고차원 데이터셋의 부분 공간 군집화, CLIQUE보다 빠른 처리가 필요한 데이터 마이닝 응용에 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'http://www.szit.bme.hu/~marti/adatbanya/MAFIA.pdf'
  },
  {
    id: 'gridclus',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'GridClus : 격자 클러스터',
    subtitle: `데이터 공간을 격자 블록으로 나눈 뒤 밀도가 높은 블록부터 병합해 계층 구조를 만드는 초기 그리드 기반 군집화`,
    overview: `<p>1996년 Schikuta가 제안한 초기 그리드 기법으로, 패턴 자체가 아니라 패턴이 위치한 값 공간을 서로 겹치지 않는 d차원 초사각형 블록으로 조직하는 방식. 각 블록의 밀도를 계산한 뒤 밀도가 높은 블록부터 낮은 순서로 반복 병합해 중첩되지 않는 군집들의 계층을 형성.</p>`,
    formula: `density(B) = |B| / volume(B)  (블록 B의 밀도) → 밀도 내림차순으로 인접 블록 병합`,
    features: `<p>패턴이 아닌 값 공간을 격자로 조직해 대용량 데이터에서도 계층적 군집화를 비교적 빠르게 수행할 수 있는 장점, 격자 블록의 크기·경계 설정에 결과가 좌우되고, 이후 등장한 STING·CLIQUE 등에 비해 이론적 정교함과 확장성이 떨어져 현재는 거의 사용되지 않는 단점.</p>`,
    applications: `<p>대용량 데이터셋에서 계층적 군집화를 그리드 구조로 근사하려 한 초기 데이터 마이닝 연구 사례에 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://ieeexplore.ieee.org/document/546732/'
  },
  {
    id: 'cobweb',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'COBWEB : 코브웹',
    subtitle: '데이터를 한 번에 하나씩 받아 분류 트리를 점진적으로 갱신하는 범주형 특화 증분 개념 군집화',
    overview: `<p>Fisher가 1987년 제안한 기법으로, 전체 데이터를 저장하지 않고 한 번에 하나씩 받아 분류 트리에 삽입·갱신. 기존 노드에 삽입, 새 자식 노드 생성, 형제 노드 병합, 노드 분할이라는 네 가지 연산 중 무엇을 적용할지 범주 유용도(category utility, CU)로 판단하며, CU는 군집 내부는 비슷하고 군집 간에는 다르게 만드는 분할을 선호하도록 설계.</p>`,
    formula: `CU = (1/n) Σ_k P(C_k) [ Σ_i Σ_j P(A_i=V_ij | C_k)² − Σ_i Σ_j P(A_i=V_ij)² ]`,
    features: `<p>데이터를 하나씩 처리할 수 있어 전체를 저장할 필요가 없고, 트리 구조 자체가 개념 간 포함 관계를 해석하기 쉽게 보여주는 장점, 데이터가 들어오는 순서에 결과가 민감하고, 연속형보다 범주형 속성에 적합하며 대용량 데이터에서는 트리가 지나치게 커질 수 있는 단점.</p>`,
    applications: `<p>데이터가 스트림으로 들어오는 온라인 개념 학습, 범주형 속성이 많은 지식 습득 연구, 계통 분류 트리 자동 생성에 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://www.cl.cam.ac.uk/~av308/cobweb.pdf'
  },
  {
    id: 'classit',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'CLASSIT : 분류 증분 학습 시스템',
    subtitle: 'COBWEB의 범주 유용도를 연속형 속성에 맞게 확장해 수치 데이터의 개념 트리를 만드는 증분 군집화',
    overview: `<p>COBWEB이 범주형 속성에 특화되어 연속형 데이터를 다루기 어려운 점을 보완한 변형. 각 군집 안의 연속형 속성 값이 정규분포를 따른다고 가정하고, 분산이 작을수록(값이 촘촘할수록) 그 속성이 군집을 잘 설명한다고 보는 방식으로 범주 유용도를 재정의. 삽입·병합·분할 절차는 COBWEB과 동일.</p>`,
    formula: `CU ∝ Σ_k P(C_k) Σ_i (1/σ_ik − 1/σ_ip)  (σ: 속성 i의 표준편차, 군집 내 분산이 작을수록 유용도 증가)`,
    features: `<p>COBWEB의 증분 처리 장점을 유지하면서 연속형 수치 속성 데이터에도 적용할 수 있는 장점, 각 속성이 정규분포를 따른다는 가정이 실제와 다르면 성능이 떨어지고, COBWEB과 마찬가지로 데이터 입력 순서에 결과가 민감한 단점.</p>`,
    applications: `<p>센서에서 실시간으로 들어오는 연속형 계측 데이터의 온라인 개념 형성, 수치형 데이터의 증분 학습 연구에 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://www.sciencedirect.com/science/article/abs/pii/S0020737385800567`
  },
  {
    id: 'lda-clustering',
    category: 'unsup',
    subcategory: 'clustering',
    title: `LDA(Latent Dirichlet Allocation) for Clustering : 클러스터링을 위한 잠재 디리클레 할당`,
    subtitle: '문서를 여러 주제의 확률적 혼합으로 보고 문서-단어 행렬을 분해해 소프트 군집화하는 확률적 토픽 모델',
    overview: `<p>각 문서는 여러 주제의 혼합으로, 각 주제는 단어들의 확률 분포로 이루어진다고 가정하는 베이지안 생성 모델. 문서-단어 행렬을 입력받아 문서별 주제 분포와 주제별 단어 분포를 함께 추정하며, 문서를 주제 확률 벡터로 표현하면 비슷한 주제 비율을 가진 문서끼리 소프트 군집화 가능.</p>`,
    formula: `p(w|d) = Σ_z p(w|z)·p(z|d)  (z: 잠재 토픽, θ_d ~ Dir(α), φ_z ~ Dir(β))`,
    features: `<p>문서가 여러 주제에 동시에 속할 수 있는 소프트 군집화를 제공하고, 각 군집(주제)을 대표 단어로 해석하기 쉬운 장점, 주제 개수(K)를 미리 정해야 하고 단어 순서·문맥을 무시하는 bag-of-words 가정 때문에 문장의 의미적 뉘앙스를 놓칠 수 있는 단점.</p>`,
    applications: `<p>대규모 문서 집합의 주제 모델링, 검색·추천 엔진의 문서 주제별 정리, 대량 텍스트 데이터의 탐색적 군집화에 널리 사용.</p>`,
    sklearnFunction: 'LatentDirichletAllocation',
    sklearnGuideURL: `https://scikit-learn.org/stable/modules/decomposition.html#latentdirichletallocation-lda`,
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.LatentDirichletAllocation.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/applications/plot_topics_extraction_with_nmf_lda.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://www.jmlr.org/papers/volume3/blei03a/blei03a.pdf'
  },
  {
    id: 'vbgm',
    category: 'unsup',
    subcategory: 'clustering',
    title: `VBGM(Variational Bayesian Gaussian Mixture) : 변분 베이지안 가우시안 혼합`,
    subtitle: 'GMM에 베이지안 사전 분포를 결합해 실제로 필요한 군집 개수를 데이터로부터 자동 추론하는 모델 기반 군집화',
    overview: `<p>일반 GMM이 군집 개수(K)를 정확히 지정해야 하는 것과 달리, 각 군집 가중치에 디리클레 분포(유한 혼합) 또는 디리클레 프로세스(무한 혼합) 사전 분포를 두고 변분 추론으로 사후 분포를 근사하는 기법. 사전 분포의 농도 파라미터를 작게 두면 불필요한 군집의 가중치가 자동으로 0에 수렴해 유효 군집 개수를 데이터가 결정.</p>`,
    formula: `q(Z,π,μ,Λ)로 사후분포 근사 → ELBO 최대화, π ~ Dir(α_0/K) (α_0 작을수록 희소한 π)`,
    features: `<p>군집 개수를 정확히 몰라도 넉넉한 상한만 지정하면 데이터가 유효 개수를 자동 결정하고, 과적합(불필요하게 많은 군집 사용)을 억제하는 장점, 변분 추론 근사의 계산 비용이 일반 GMM보다 크고, 사전 분포의 농도 파라미터 설정에 결과가 민감할 수 있는 단점.</p>`,
    applications: `<p>군집 개수를 사전에 알기 어려운 탐색적 데이터 분석, GMM의 과적합을 방지해야 하는 밀도 추정 문제에 사용.</p>`,
    sklearnFunction: 'BayesianGaussianMixture',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/mixture.html#bgmm',
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.mixture.BayesianGaussianMixture.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/mixture/plot_concentration_prior.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://www.cs.princeton.edu/courses/archive/fall11/cos597C/reading/BleiJordan2005.pdf`
  },
  {
    id: 'bayesian-hierarchical-clustering',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'Bayesian Hierarchical Clustering : 베이지안 계층적 클러스터링',
    subtitle: '병합 여부를 거리 대신 "같은 모델에서 나왔다"는 베이지안 가설의 확률로 판단하는 계층 군집화',
    overview: `<p>Heller와 Ghahramani가 2005년 제안한 기법으로, 일반 병합적 계층 군집화처럼 개별 군집에서 시작해 합쳐 나가되 병합 기준이 거리가 아니라 베이지안 가설 검정. 두 군집이 하나의 확률 모델에서 생성되었을 가설과 서로 다른 모델에서 나왔을 가설의 주변가능도를 비교해 병합 확률이 높은 쌍부터 병합하며, 디리클레 과정 혼합 모델(DPM)의 상향식 근사로도 해석.</p>`,
    formula: `r_k = π_k·p(D_k|H_1) / p(D_k|T_k)  (r_k: 병합 사후확률, H_1: 하나의 모델에서 생성되었다는 가설)`,
    features: `<p>병합 여부를 확률 모델 기반으로 판단해 임의적인 거리 척도보다 통계적 근거가 뚜렷하고, 새 데이터의 소속 확률과 예측 분포를 함께 계산할 수 있는 장점, 각 병합 단계마다 우도를 계산해야 해 일반 병합적 군집화보다 계산 비용이 크고, 데이터에 적합한 확률 모델을 별도로 정의해야 하는 단점.</p>`,
    applications: `<p>마이크로어레이·유전자 발현 데이터의 계층 분석(R/BHC 패키지), 병합 결정에 확률적 근거가 필요한 생물정보학 연구에 사용.</p>`,
    sklearnFunction: 'bhc (Python 구현체)',
    sklearnGuideURL: `https://github.com/caponetto/bayesian-hierarchical-clustering`,
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://mlg.eng.cam.ac.uk/zoubin/papers/icml05heller.pdf'
  },
  {
    id: 'vmf-mixture',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'Mixture of von Mises-Fisher Distributions : 폰 미제스-피셔 분포 혼합',
    subtitle: '단위 초구 위의 방향성 데이터를 가우시안 대신 방향 분포로 모델링하는 EM 기반 군집화',
    overview: `<p>텍스트 벡터처럼 L2 정규화되어 단위 초구 표면 위의 점으로 표현되는 방향성 데이터는 일반 가우시안 혼합모델로 적절히 모델링하기 어려움. von Mises-Fisher(vMF) 분포는 구 표면의 방향 분포로 평균 방향(&#956;)과 집중도(&#954;)로 정의되며, 여러 vMF를 혼합한 모델을 GMM과 동일한 EM으로 학습해 방향성 데이터를 확률적으로 군집화하는 기법.</p>`,
    formula: `f(x | μ,κ) = c_d(κ)·exp(κ·μᵀx),  ||x|| = ||μ|| = 1  (κ: 집중도, 클수록 평균 방향에 밀집)`,
    features: `<p>방향(각도)이 중요한 고차원 데이터를 가우시안 혼합보다 적절하게 모델링하고, EM으로 확률적 소속을 계산할 수 있는 장점, 집중도(&#954;) 파라미터 추정이 고차원에서 수치적으로 까다롭고, 일반 GMM만큼 널리 쓰이는 표준 라이브러리 구현체가 적은 단점.</p>`,
    applications: `<p>고차원 텍스트 분류·군집화, 유전자 발현 방향성 데이터 분석 등 크기보다 방향이 중요한 데이터에 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://www.jmlr.org/papers/volume6/banerjee05a/banerjee05a.pdf`
  },
  {
    id: 'kmedoids-pam',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'K-Medoids(PAM, Partitioning Around Medoids) : K-중앙점',
    subtitle: '군집 중심으로 평균 대신 실제 데이터 점(medoid)을 사용해 이상치에 강건한 분할 군집화',
    overview: `<p>K-평균이 가상의 평균점을 중심으로 쓰는 것과 달리, 실제 데이터 중 군집 내 다른 점들과의 거리 합이 최소인 점(medoid)을 중심으로 사용하는 기법. 대표 구현인 PAM은 medoid 교체를 전수 탐색하며, 대규모 데이터에는 표본 기반의 CLARA, 무작위 탐색 기반의 CLARANS로 확장.</p>`,
    formula: `minimize Σ_i d(x_i, m_{c(i)})  (m: medoid, d: 임의의 거리·비유사도 함수)`,
    features: `<p>중심이 실제 데이터이므로 이상치 영향이 평균보다 작아 상대적으로 강건, 거리 함수(유클리드/맨해튼/임의의 비유사도)를 유연하게 사용할 수 있음, 해석 시 대표 실제 사례를 medoid로 제시 가능한 장점, K-means보다 구현이 복잡하고 초기 medoid에 따라 결과가 달라질 수 있음, PAM은 계산량이 커서 대규모 데이터에 느릴 경우 CLARA/CLARANS로 완화해야 하는 단점.</p>`,
    applications: `<p>이상치가 포함된 고객·환자 데이터의 세분화, 유전자 발현 데이터처럼 비유클리드 거리(상관계수 기반 등)를 써야 하는 분석, 대표 사례 제시가 중요한 사례 기반 추론에 사용.</p>`,
    sklearnFunction: 'KMedoids (scikit-learn-extra)',
    sklearnGuideURL: `https://scikit-learn-extra.readthedocs.io/en/stable/modules/cluster.html`,
    sklearnAPIURL: `https://scikit-learn-extra.readthedocs.io/en/stable/generated/sklearn_extra.cluster.KMedoids.html`,
    sklearnExampleURL: `https://scikit-learn-extra.readthedocs.io/en/stable/auto_examples/plot_kmedoids.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://onlinelibrary.wiley.com/doi/book/10.1002/9780470316801`
  },
  {
    id: 'louvain-leiden',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'Louvain Algorithm : 루뱅 알고리즘 / Leiden Algorithm : 라이덴 알고리즘',
    subtitle: '모듈성을 최대화하는 방향으로 노드를 재배치하고 그룹을 압축해 대규모 네트워크의 커뮤니티를 빠르게 찾는 기법',
    overview: `<p>모듈성(그룹 내부 연결이 그룹 간 연결보다 얼마나 촘촘한지를 나타내는 지표)이 커지는 방향으로 노드를 반복 재배치하고, 형성된 그룹을 하나의 노드로 압축해 같은 과정을 반복하는 기법. Leiden은 Louvain의 개선판으로 일부 커뮤니티가 내부적으로 끊어지는 문제를 보완.</p>`,
    formula: 'Q = (1/2m) Σ_ij [A_ij − (k_i·k_j)/(2m)]·δ(c_i, c_j)  (모듈성)',
    features: `<p>대규모 네트워크에서도 빠르게 커뮤니티를 탐지하고 계층적 구조를 자연스럽게 얻는 장점, Louvain은 내부적으로 연결이 끊긴 커뮤니티를 만들 수 있고(Leiden이 이를 보완), 모듈성 최적화 특성상 작은 커뮤니티를 놓치는 해상도 한계(resolution limit)가 있는 단점.</p>`,
    applications: `<p>소셜 네트워크의 커뮤니티 탐지, 추천 시스템의 사용자 그룹 분석, 단백질 상호작용 네트워크의 기능적 모듈 발견에 널리 사용.</p>`,
    sklearnFunction: 'louvain_communities (NetworkX)',
    sklearnGuideURL: `https://networkx.org/documentation/stable/reference/algorithms/community.html`,
    sklearnAPIURL: `https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.community.louvain.louvain_communities.html`,
    sklearnExampleURL: `https://networkx.org/documentation/stable/auto_examples/algorithms/plot_visualize_louvain_communities.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://arxiv.org/abs/0803.0476'
  },
  {
    id: 'mcl',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'MCL(Markov Clustering Algorithm) : 마르코프 클러스터링 알고리즘',
    subtitle: `그래프 위 랜덤 워크를 시뮬레이션해 군집 내부에서는 흐름이 뭉치고 군집 사이에서는 옅어지도록 반복 계산하는 기법`,
    overview: `<p>van Dongen이 2000년 제안한 기법으로, 그래프의 인접 행렬을 확률 전이 행렬로 바꾼 뒤 확장(expansion)과 팽창(inflation)을 반복 적용. 확장은 행렬 제곱으로 긴 경로의 랜덤 워크 확률을 계산해 군집 내부 경로를 상대적으로 강화하고, 팽창은 각 원소를 거듭제곱·재정규화해 높은 확률은 더 높이고 낮은 확률은 더 낮춤.</p>`,
    formula: `Expansion: M ← M^e,  Inflation: M_ij ← (M_ij)^r / Σ_k (M_kj)^r  (r: 팽창 계수)`,
    features: `<p>군집 개수를 미리 지정할 필요가 없고, 랜덤 워크라는 직관적 원리로 임의 구조의 그래프에 적용 가능한 장점, 팽창 파라미터 값에 군집의 세밀함이 민감하게 좌우되고, 행렬 제곱 연산 때문에 대규모 그래프에서 계산·메모리 비용이 큰 단점.</p>`,
    applications: `<p>단백질-단백질 상호작용 네트워크의 기능적 복합체 예측, 생물정보학·소셜 네트워크의 커뮤니티 탐지에 널리 사용.</p>`,
    sklearnFunction: 'MCL (micans)',
    sklearnGuideURL: 'https://micans.org/mcl/sec_description1.html',
    sklearnAPIURL: `https://cdlib.readthedocs.io/en/0.2.0/reference/cd_algorithms/algs/cdlib.algorithms.markov_clustering.html`,
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://micans.org/mcl/index.html'
  },
  {
    id: 'ratio-cuts',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'Ratio Cuts : 비율 컷',
    subtitle: '자른 간선 가중치를 각 그룹의 정점 개수로 나누어 균형 잡힌 그래프 분할을 유도하는 스펙트럴 군집화 목적함수',
    overview: `<p>그래프를 나눌 때 자른 간선 가중치 합(cut)만 최소화하면 정점 하나만 떼어내는 극단적으로 불균형한 분할이 최소값이 되기 쉬움. Ratio Cut은 cut을 각 그룹의 정점 개수로 나누어 정규화함으로써, 간선을 적게 자르면서도 두 그룹 크기가 비슷해지는 분할을 선호하도록 유도하는 목적함수. 완화(relax)하면 그래프 라플라시안 고유벡터 문제가 되어 스펙트럴 군집화의 이론적 기반이 됨.</p>`,
    formula: 'RatioCut(S) = cut(S, S̄)/|S| + cut(S, S̄)/|S̄|  (|S|: 정점 개수)',
    features: `<p>정점 수 기준으로 균형 잡힌 분할을 유도해 극단적으로 작은 그룹만 떼어내는 문제를 방지하는 장점, 정점 개수만 고려하고 정점의 연결 정도(차수)는 반영하지 않아 차수 편차가 큰 그래프에서는 Normalized Cut(볼륨 기준)보다 부자연스러운 분할을 만들 수 있는 단점.</p>`,
    applications: `<p>회로 설계의 그래프 분할, 병렬 컴퓨팅의 작업 분배 등 그룹 크기 균형이 중요한 분할 문제와 스펙트럴 군집화 이론 학습에 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://ieeexplore.ieee.org/document/310898'
  },
  {
    id: 'shi-malik',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'Shi-Malik Algorithm : 시-말릭 알고리즘',
    subtitle: '이미지를 픽셀 그래프로 보고 정규화 컷을 최소화하는 고유벡터로 영역을 분할하는 스펙트럴 군집화',
    overview: `<p>Shi와 Malik이 이미지 분할을 그래프 분할 문제로 재정의하며 제안한 기법. 픽셀 간 유사도로 그래프를 만들고 정규화 컷(자른 간선 가중치를 각 그룹의 볼륨으로 나눈 값)을 최소화하는 분할을 찾음. 완화하면 일반화 고유값 문제가 되고, 두 번째로 작은 고유값의 고유벡터 부호로 픽셀을 두 그룹으로 나눈 뒤 필요하면 재귀적으로 세분화.</p>`,
    formula: `Ncut(A,B) = cut(A,B)/assoc(A,V) + cut(A,B)/assoc(B,V)  → (D−W)y = λDy 의 두 번째 고유벡터로 분할`,
    features: `<p>정규화 컷 기준 덕분에 매우 작은 영역만 분리되는 것을 방지하고 임의 모양의 영역도 잘 분할하는 장점, 큰 이미지에서 고유값 분해 계산 비용이 크고 분할할 영역 수(재귀 깊이)를 결정하는 별도 기준이 필요한 단점.</p>`,
    applications: `<p>컴퓨터 비전의 이미지·영역 분할, 객체 경계 검출 등에 사용되며 스펙트럴 군집화를 실용화한 대표 논문으로 널리 인용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://people.eecs.berkeley.edu/~malik/papers/SM-ncut.pdf'
  },
  {
    id: 'ng-jordan-weiss',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'Ng-Jordan-Weiss Algorithm : 응-조던-와이스 알고리즘',
    subtitle: '정규화 라플라시안의 고유벡터를 행 단위로 재정규화한 뒤 K-평균을 적용하는 표준 스펙트럴 군집화 절차',
    overview: `<p>Ng, Jordan, Weiss가 2002년 제안한 기법으로 현재 대부분의 라이브러리가 구현하는 표준 스펙트럴 군집화 절차. 유사도 행렬로부터 정규화 라플라시안을 계산하고 상위 k개 고유벡터를 열로 갖는 행렬을 만든 뒤, 각 행을 단위 길이로 재정규화(차수가 낮은 정점의 값이 지나치게 작아지는 문제를 보정)하고 마지막으로 K-평균을 적용.</p>`,
    formula: `L = D^(−1/2) W D^(−1/2) → 상위 k개 고유벡터로 X 구성 → Y_ij = X_ij / (Σ_j X_ij²)^(1/2) → Y에 K-평균`,
    features: `<p>행 정규화 덕분에 차수 편차가 큰 그래프에서도 안정적으로 동작하고 이론적 분석이 잘 되어 있어 표준 절차로 자리잡은 장점, 고유값 분해와 K-평균 두 단계가 모두 필요해 계산 비용이 있고 군집 개수(k)와 유사도 척도(&#963;)를 사전에 정해야 하는 단점.</p>`,
    applications: `<p>scikit-learn의 SpectralClustering이 기본 채택한 절차로, 이미지 분할·커뮤니티 탐지 등 스펙트럴 군집화 응용 전반에 표준으로 사용.</p>`,
    sklearnFunction: 'SpectralClustering',
    sklearnGuideURL: `https://scikit-learn.org/stable/modules/clustering.html#spectral-clustering`,
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.cluster.SpectralClustering.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/cluster/plot_segmentation_toy.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://proceedings.neurips.cc/paper/2001/file/801272ee79cfde7fa5960571fee36b9b-Paper.pdf`
  },
  {
    id: 'girvan-newman',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'Girvan-Newman Algorithm : 거반-뉴먼 알고리즘',
    subtitle: '커뮤니티를 잇는 다리 역할의 간선을 매개 중심성으로 찾아 제거해 나가는 하향식 그래프 군집화',
    overview: `<p>모든 간선의 매개 중심성(edge betweenness, 두 정점 사이 최단 경로 중 그 간선을 지나는 비율)을 계산하는 기법. 서로 다른 커뮤니티를 잇는 다리 역할의 간선일수록 많은 최단 경로가 지나가 중심성이 높으므로, 가장 높은 간선을 제거하고 다시 계산하는 과정을 반복하면 그래프가 여러 커뮤니티로 쪼개짐.</p>`,
    formula: `C_B(e) = Σ_{s≠t} σ_st(e) / σ_st  (σ_st: s-t 최단경로 수, σ_st(e): 그중 e를 지나는 수)`,
    features: `<p>커뮤니티를 가르는 다리 간선을 명시적으로 식별할 수 있어 결과 해석이 직관적이고 계층적 분할 구조를 얻는 장점, 매 단계 모든 간선의 매개 중심성을 재계산해야 해 최악의 경우 O(n&#179;)에 이르는 계산 비용 때문에 대규모 네트워크에는 부적합한 단점.</p>`,
    applications: `<p>소셜 네트워크의 커뮤니티 구조 발견, 조직 내 협업 네트워크 분석 등 어떤 연결이 그룹 간 다리 역할을 하는지 파악해야 하는 분석에 사용.</p>`,
    sklearnFunction: 'girvan_newman (NetworkX)',
    sklearnGuideURL: `https://networkx.org/documentation/stable/reference/algorithms/community.html`,
    sklearnAPIURL: `https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.community.centrality.girvan_newman.html`,
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://www.pnas.org/doi/10.1073/pnas.122653799'
  },
  {
    id: 'infomap',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'Infomap : 인포맵',
    subtitle: '랜덤 워커의 이동 경로를 가장 짧게 압축하는 분할을 커뮤니티로 정의하는 정보이론 기반 그래프 군집화',
    overview: `<p>Rosvall과 Bergstrom이 2008년 제안한 기법으로, 네트워크 위 랜덤 워커가 특정 커뮤니티 내부에 오래 머문다는 점에 착안. 커뮤니티마다 별도의 지역 코드북을 쓰고 커뮤니티를 벗어날 때만 공통 코드를 사용하도록 인코딩하면 실제 구조에 맞는 분할일수록 전체 부호 길이(맵 방정식)가 짧아지며, 이를 최소화하는 분할을 탐색.</p>`,
    formula: `L(M) = q·H(Q) + Σ_{i=1..m} p_i·H(P_i)  (맵 방정식: 전체 부호 길이 = 커뮤니티 간 이동 + 내부 이동 부호 길이)`,
    features: `<p>정보이론적으로 명확한 기준(설명 길이 최소화)을 제공하고, 방향성 네트워크와 흐름 데이터에 특히 잘 맞으며 계층적 커뮤니티도 탐지 가능한 장점, 무방향·흐름이 약한 네트워크에서는 모듈성 기반(Louvain)과 결과 차이가 크지 않고 대규모 네트워크에서 계산 자원이 상당히 필요한 단점.</p>`,
    applications: `<p>대규모 소셜·인용·생물학적 네트워크의 커뮤니티 탐지, 특히 인용 관계·웹 링크처럼 방향성 흐름이 있는 네트워크 분석에 사용.</p>`,
    sklearnFunction: 'Infomap (mapequation)',
    sklearnGuideURL: 'https://www.mapequation.org/infomap/',
    sklearnAPIURL: 'https://mapequation.github.io/infomap/python/',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://www.pnas.org/doi/10.1073/pnas.0706851105'
  },
  {
    id: 'proclus',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'PROCLUS(PROjected CLUStering) : 투영 클러스터링',
    subtitle: '군집마다 서로 다른 대표 속성 집합을 함께 찾아내는 medoid 기반 투영 군집화',
    overview: `<p>고차원 데이터에서 군집이 전체 속성이 아니라 일부 속성 조합(부분 공간)에서만 뚜렷하게 나타난다는 점에 착안한 기법. 초기화·반복·정제 3단계로 동작하며, 전체 속성 공간에서 대략적인 medoid 후보를 찾고 각 군집마다 어떤 속성이 그 군집을 잘 설명하는지 가중치를 부여한 뒤, 관련 속성만 쓰는 맨해튼 부분거리로 군집을 재배정하는 과정을 반복.</p>`,
    formula: `Manhattan segmental distance: d(x,y) = ( Σ_{i ∈ D} |x_i − y_i| ) / |D|  (D: 해당 군집의 관련 속성 집합)`,
    features: `<p>군집마다 서로 다른 관련 속성 집합을 함께 찾아주어 결과 해석에 도움이 되고 CLIQUE류보다 이상치 처리에 유리한 장점, 군집 개수와 평균 부분 공간 차원수를 미리 지정해야 하고 초기 medoid 선택에 결과가 민감한 단점.</p>`,
    applications: `<p>속성 수가 많아 전체 차원으로는 군집이 보이지 않는 고차원 데이터(유전자 발현, 다변량 센서)에서 각 군집의 핵심 속성까지 함께 찾아야 하는 분석에 사용.</p>`,
    sklearnFunction: 'PROCLUS (ELKI)',
    sklearnGuideURL: 'https://elki-project.github.io/algorithms/',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://dl.acm.org/doi/pdf/10.1145/304181.304188'
  },
  {
    id: 'orclus',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'ORCLUS(ORiented projected CLUStering) : 방향성 투영 클러스터링',
    subtitle: '군집의 부분 공간이 좌표축과 나란하지 않고 임의 방향으로도 존재할 수 있다고 보는 PROCLUS 확장',
    overview: `<p>PROCLUS 등 대부분의 투영 군집화가 부분 공간이 원래 속성 축과 나란하다고(axis-parallel) 가정하는 것과 달리, 실제 군집은 여러 속성이 회전·조합된 임의 방향으로 뭉칠 수 있다는 점에 착안한 기법. 군집 배정과 함께 각 군집이 가장 잘 뭉쳐 보이는 임의 방향의 직교 벡터 집합을 동시에 계산.</p>`,
    formula: `각 군집 C_i의 공분산 행렬을 고유분해 → 고유값이 작은 l개 고유벡터가 이루는 부분공간에 투영해 거리 측정`,
    features: `<p>축에 나란하지 않은 임의 방향의 군집도 표현할 수 있어 PROCLUS보다 표현력이 높은 장점, 각 군집의 방향(고유벡터)까지 계산해야 해 PROCLUS보다 계산 비용이 크고 군집 개수 k와 부분 공간 차원 l을 모두 미리 정해야 하는 단점.</p>`,
    applications: `<p>속성 간 상관관계로 군집이 축에 나란하지 않은 방향으로 나타나는 고차원 데이터(금융·생물학 데이터의 상관 구조) 분석에 사용.</p>`,
    sklearnFunction: 'orclus (R)',
    sklearnGuideURL: 'https://rdrr.io/cran/orclus/',
    sklearnAPIURL: 'https://rdrr.io/cran/orclus/man/orclus.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://dl.acm.org/doi/10.1145/342009.335383'
  },
  {
    id: 'subclu',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'SUBCLU(density-connected SUBspace CLUstering) : 부분공간 클러스터링',
    subtitle: `DBSCAN의 밀도 연결성을 유지하면서 단조성을 이용해 부분 공간을 Apriori 방식으로 탐색하는 밀도 기반 부분 공간 군집화`,
    overview: `<p>Kailing, Kriegel, Kröger가 제안한 기법으로, 먼저 각 속성(1차원)마다 DBSCAN을 적용해 1차원 밀도 군집을 찾음. 밀도 연결성은 부분 공간이 커질수록 군집이 작아지거나 사라진다는 단조성을 만족하므로, Apriori처럼 k차원에서 밀도 군집이 없는 조합은 (k+1)차원에서 검사할 필요가 없다고 가지치기하며 낮은 차원부터 높은 차원으로 후보를 좁혀나감.</p>`,
    formula: 'S ⊆ S′ 이면 C_S′ ⊆ C_S  (밀도 연결성의 단조성) → Apriori 방식 가지치기',
    features: `<p>DBSCAN과 동일한 엄밀한 밀도 군집 정의를 유지하며 단조성을 이용한 가지치기로 CLIQUE류보다 탐색 효율이 좋은 장점, 여전히 각 부분 공간마다 DBSCAN을 반복 실행해야 해 속성 수가 매우 많아지면 계산 비용이 커지고 eps·minPts를 지정해야 하는 단점.</p>`,
    applications: `<p>DBSCAN과 동일한 밀도 군집 정의를 유지하며 고차원 데이터의 부분 공간 군집을 찾아야 하는 연구, 부분 공간 군집화 알고리즘 비교의 기준(baseline)으로 사용.</p>`,
    sklearnFunction: 'SUBCLU (ELKI)',
    sklearnGuideURL: 'https://elki-project.github.io/algorithms/',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://epubs.siam.org/doi/10.1137/1.9781611972740.23'
  },
  {
    id: 'fires',
    category: 'unsup',
    subcategory: 'clustering',
    title: `FIRES(FIlter REfinement Subspace clustering) : 필터 정제 부분공간 클러스터링`,
    subtitle: '1차원 결과를 곧바로 결합해 근사 후보를 만든 뒤 정제하는 빠른 부분 공간 군집화',
    overview: `<p>SUBCLU 등이 차원을 하나씩 늘려가며 모든 조합을 확인하는 상향식 탐색을 쓰는 것과 달리, 필터-정제 3단계 구조로 계산량을 줄이는 기법. 1단계에서 각 속성마다 독립적으로 기초 군집(base cluster)을 만들고, 2단계에서 유사한 기초 군집을 빠르게 병합해 다차원 근사 후보를 직접 생성하며(중간 차원 검사 생략), 3단계에서 후보에 속한 데이터에 실제 군집화를 다시 적용해 확정.</p>`,
    formula: `1단계: 각 차원별 base cluster 생성 → 2단계: 유사 base cluster 병합으로 근사 후보 → 3단계: 후보 정제`,
    features: `<p>필터-정제 구조 덕분에 속성 수에 대해 최대 이차(quadratic)로만 계산량이 늘어나 매우 고차원인 데이터에도 확장성이 좋은 장점, 근사적 접근이라 SUBCLU 같은 정밀한 방법보다 일부 군집을 놓치거나 부정확하게 찾을 수 있는 단점.</p>`,
    applications: `<p>속성 수가 매우 많아 SUBCLU·CLIQUE 같은 전수 탐색이 비효율적인 초고차원 데이터의 근사적 부분 공간 군집화에 사용.</p>`,
    sklearnFunction: 'FIRES (subspace, R)',
    sklearnGuideURL: 'https://rdrr.io/cran/subspace/',
    sklearnAPIURL: 'https://rdrr.io/cran/subspace/man/FIRES.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://ieeexplore.ieee.org/document/1617427'
  },
  {
    id: 'predecon',
    category: 'unsup',
    subcategory: 'clustering',
    title: `PreDeCon(subspace PREference weighted DEnsity CONnected clustering) : 선호도 가중 밀도 연결 클러스터링`,
    subtitle: 'DBSCAN의 이웃 판정에 속성별 분산 기반 가중치를 적용해 저차원 부분 공간의 군집을 찾는 밀도 기반 기법',
    overview: `<p>DBSCAN이 모든 속성을 동등하게 취급하는 유클리드 거리로 이웃을 판정하는 것과 달리, 각 점 주변 이웃들의 속성별 분산을 계산해 분산이 작은(촘촘한) 속성에는 큰 가중치를, 분산이 큰 속성에는 작은 가중치를 부여하는 선호 가중 거리를 정의하는 기법. 이 가중 거리로 DBSCAN과 동일한 밀도 도달·밀도 연결 개념을 적용.</p>`,
    formula: `w_i = 1 (σ_i² > δ), κ (σ_i² ≤ δ)  →  dist_pref(p,q) = √( Σ_i w_i (p_i − q_i)² )`,
    features: `<p>DBSCAN의 밀도 연결 개념을 유지하면서 속성별 분산에 기반한 가중치로 부분 공간 구조를 자연스럽게 반영하는 장점, 분산 임계값·가중치 파라미터가 추가로 필요해 DBSCAN보다 튜닝이 복잡하고 표준 라이브러리보다 ELKI 등 연구용 툴킷에서 주로 제공되는 단점.</p>`,
    applications: `<p>고차원 데이터에서 일부 속성 방향으로만 나타나는 저분산 구조를 갖는 군집 탐색 연구, ELKI 툴킷 기반 학술 비교 실험에 사용.</p>`,
    sklearnFunction: 'PreDeCon (ELKI)',
    sklearnGuideURL: 'https://elki-project.github.io/algorithms/',
    sklearnAPIURL: `https://elki-project.github.io/releases/current/javadoc/elki/clustering/subspace/PreDeCon.html`,
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://ieeexplore.ieee.org/document/1250933'
  },
  {
    id: 'p3c',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'P3C(Probabilistic and Projected Clustering) : 확률적 투영 클러스터링',
    subtitle: '카이제곱 검정으로 밀집 구간만 남겨 파라미터를 거의 요구하지 않고 군집 개수까지 자동으로 찾는 투영 군집화',
    overview: `<p>각 속성을 1+log&#8322;(n)개 구간으로 나누고 각 구간의 데이터 개수가 균등분포를 따르는지 카이제곱 검정으로 확인하는 기법. 균등분포에서 크게 벗어난(데이터가 몰린) 구간만 남겨 그 조합으로 군집 후보 영역을 통계적으로 추정. 군집 개수를 입력으로 요구하지 않으며, 수치형과 범주형이 섞인 데이터에도 적용 가능한 최초의 투영 군집화로 소개.</p>`,
    formula: `χ² = Σ_i (O_i − E_i)²/E_i  (구간별 관측·기대 빈도) → 균등성 기각 시 해당 구간을 밀집 구간으로 채택`,
    features: `<p>군집 개수를 사용자가 지정하지 않아도 통계적으로 추정하고, 수치형·범주형 혼합 데이터에도 적용할 수 있는 장점, 구간 분할과 카이제곱 검정을 반복해야 해 계산 비용이 있고 균등분포 기준이라는 통계적 가정이 실제 데이터와 다르면 결과가 왜곡될 수 있는 단점.</p>`,
    applications: '<p>군집 개수를 미리 알기 어렵고 수치형·범주형이 혼재된 실무 데이터의 투영 군집화 연구에 사용.</p>',
    sklearnFunction: 'P3C (subspace, R)',
    sklearnGuideURL: 'https://rdrr.io/cran/subspace/',
    sklearnAPIURL: 'https://rdrr.io/cran/subspace/man/P3C.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://www.cs.sfu.ca/~ester/papers/KAIS-ProjectedClustering.final.pdf`
  },
  {
    id: 'lrr',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'LRR(Low-Rank Representation) : 저계수 표현',
    subtitle: `전체 결합계수 행렬이 최대한 낮은 계수를 갖도록 만들어 부분 공간 구조를 전역적으로 복원하는 표현학습 기반 군집화`,
    overview: `<p>데이터가 여러 저차원 선형 부분 공간의 합집합에서 나왔다고 가정하고, 각 데이터를 전체 데이터의 선형결합으로 표현하되 개별적으로 희소하게 표현하는 대신 전체 결합계수 행렬의 계수(rank)가 최소가 되도록 전역 최적화하는 기법. 구한 저계수 계수 행렬을 유사도 행렬로 사용해 스펙트럴 군집화를 적용.</p>`,
    formula: `min_{Z,E} ||Z||_* + λ||E||_{2,1}  s.t.  X = XZ + E  (||·||_* : 핵 노름)`,
    features: `<p>노이즈·이상치가 섞인 데이터에서도 전역적 저계수 구조를 통해 강건하게 부분 공간을 복원할 수 있고, 이론적 복원 보장이 연구되어 있는 장점, 핵 노름 최소화 최적화의 계산 비용이 데이터 수가 커지면 급격히 증가하는 단점.</p>`,
    applications: `<p>얼굴 인식(조명·각도에 따른 부분 공간), 모션 분할(움직이는 물체별 궤적 부분 공간) 등 데이터가 여러 선형 부분 공간의 합집합으로 모델링되는 컴퓨터 비전 문제에 널리 사용.</p>`,
    sklearnFunction: 'LRR (저자 공개 구현체)',
    sklearnGuideURL: 'https://github.com/sckangz/LRR',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://arxiv.org/abs/1010.2955'
  },
  {
    id: 'ensc',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'EnSC(Elastic Net Subspace Clustering) : 엘라스틱 넷 부분 공간 군집화',
    subtitle: `L1(희소성)과 L2(연결성)를 함께 쓰는 엘라스틱 넷으로 자기표현 계수를 구하는 표현학습 기반 부분 공간 군집화`,
    overview: `<p>각 점을 다른 점들의 선형결합으로 표현하는 자기표현(self-expressive) 모델을 쓰되, 결합계수를 구할 때 L1 노름(희소성, 다른 부분 공간의 점 계수를 0으로)과 L2 노름(연결성, 같은 부분 공간 내 계수를 고르게 분산)을 함께 적용하는 기법. SSC의 "희소하지만 군집 내 연결이 끊길 수 있는" 단점과 LRR류의 "연결은 좋지만 덜 희소한" 단점 사이의 균형을 맞춤.</p>`,
    formula: `min_c  λ||c||_1 + ((1−λ)/2)||c||_2² + (γ/2)||x − Xc||_2²,  c_jj = 0`,
    features: `<p>희소성과 군집 내 연결성의 균형을 맞춰 SSC보다 안정적인 유사도 그래프를 만들고, 능동집합(active set) 알고리즘으로 대규모 데이터에도 확장 가능한 장점, L1·L2 혼합 비율을 추가로 튜닝해야 하고 스펙트럴 군집화 단계의 고유분해 비용이 여전히 필요한 단점.</p>`,
    applications: `<p>대규모 이미지·비디오 데이터의 부분 공간 군집화에서 SSC의 연결 끊김 문제를 보완해야 하는 컴퓨터 비전 연구에 사용.</p>`,
    sklearnFunction: 'EnSC (subspace-clustering)',
    sklearnGuideURL: 'https://github.com/ChongYou/subspace-clustering',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://arxiv.org/pdf/1605.02633'
  },
  {
    id: 'ssc',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'SSC(Sparse Subspace Clustering) : 희소 부분공간 클러스터링',
    subtitle: '각 데이터를 다른 데이터들의 희소한 선형결합으로 표현해 부분 공간 구조를 복원하는 표현학습 기반 군집화',
    overview: `<p>Elhamifar와 Vidal이 2009년 제안한 기법으로, 데이터가 여러 저차원 선형 부분 공간의 합집합에 놓여 있다고 가정. 무수히 많은 표현 방법 중 희소한 표현일수록 같은 부분 공간에 속한 소수의 점만 선택한다는 점에 착안해, 각 점마다 L1 최소화(basis pursuit)로 희소 계수를 구하고 이를 유사도 행렬로 삼아 스펙트럴 군집화를 적용.</p>`,
    formula: `min_c ||c||_1  s.t.  x = Xc,  c_jj = 0  (각 점을 자신을 제외한 나머지의 희소 결합으로 표현)`,
    features: `<p>희소 표현이 같은 부분 공간의 점만 선택하는 성질(subspace-preserving)이 이론적으로 보장되고, 부분 공간의 개수·차원을 미리 몰라도 되는 장점, 각 점마다 L1 최적화를 풀어야 해 시간·공간 복잡도가 O(n&#178;)에 이르러 대규모 데이터에 부적합하고 같은 군집 내에서 연결이 끊길 수 있는(graph connectivity) 단점.</p>`,
    applications: `<p>얼굴 인식(동일 인물의 조명 변화 부분 공간), 모션 분할(물체별 궤적 부분 공간) 등 데이터가 여러 선형 부분 공간의 합집합으로 모델링되는 컴퓨터 비전 문제에 사용.</p>`,
    sklearnFunction: 'SSC (subspace-clustering)',
    sklearnGuideURL: 'https://github.com/ChongYou/subspace-clustering',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://arxiv.org/abs/1203.1005'
  },
  {
    id: 'spectral-coclustering',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'Spectral Co-Clustering : 스펙트럴 동시 클러스터링',
    subtitle: '행과 열을 동시에 군집화해 문서와 그 문서의 특징적 단어를 함께 찾아내는 이분 그래프 기반 동시 군집화',
    overview: `<p>Dhillon이 2001년 제안한 기법으로, 데이터 행렬을 행(문서)과 열(단어) 두 종류 정점을 가진 이분 그래프로 보고 행렬 원소 값을 간선 가중치로 취급. 이 그래프에 정규화 컷을 최소화하는 스펙트럴 군집화를 적용하면 각 행과 열이 정확히 하나의 동시 군집에 속하는 블록 대각 구조를 얻음.</p>`,
    formula: 'A_n = D_1^(−1/2) A D_2^(−1/2) → SVD의 상위 특이벡터를 결합해 K-평균 적용',
    features: `<p>행과 열을 동시에 군집화해 어떤 문서 그룹이 어떤 단어 그룹과 연관되는지 한 번에 파악할 수 있는 장점, 각 행·열이 정확히 하나의 군집에만 속하는 블록 대각 구조를 가정하므로 여러 군집에 걸치는 중첩 구조는 표현하지 못하는 단점.</p>`,
    applications: `<p>문서-단어 행렬의 텍스트 마이닝(주제어와 문서를 동시에 파악), 추천 시스템의 사용자-상품 동시 군집화에 사용.</p>`,
    sklearnFunction: 'SpectralCoclustering',
    sklearnGuideURL: `https://scikit-learn.org/stable/modules/biclustering.html#spectral-co-clustering`,
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.cluster.SpectralCoclustering.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/bicluster/plot_bicluster_newsgroups.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://dl.acm.org/doi/10.1145/502512.502550'
  },
  {
    id: 'spectral-biclustering',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'Spectral Biclustering : 스펙트럴 이중 클러스터링',
    subtitle: '행과 열이 각각 그룹으로 나뉘어 바둑판(체커보드) 블록 구조를 이룬다고 가정하고 이를 복원하는 동시 군집화',
    overview: `<p>Kluger가 2003년 제안한 기법으로, 데이터 행렬에 행 그룹과 열 그룹이 각각 존재하고 그 조합이 체커보드 형태의 블록 구조를 이룬다고 가정. 행 그룹이 2개, 열 그룹이 3개라면 각 행은 3개, 각 열은 2개의 이중군집에 속하며, 스펙트럴 기법으로 이 블록 구조를 복원.</p>`,
    formula: `정규화 후 SVD → 행·열 고유벡터를 각각 K-평균으로 분할 → 체커보드 블록 = (행 그룹 × 열 그룹) 조합`,
    features: `<p>행·열 순서에 의미가 있는 데이터에서 체커보드 형태의 국소 구조를 명시적으로 찾아내고 해석이 직관적인 장점, 데이터가 실제로 체커보드 구조를 따른다는 가정이 강해 이 가정에서 벗어난 데이터에는 적합하지 않은 단점.</p>`,
    applications: `<p>유전자 발현 데이터의 조건별 발현 패턴 분석, 순서가 고정된 이미지·시계열·게놈 데이터의 국소 구조 탐지에 사용.</p>`,
    sklearnFunction: 'SpectralBiclustering',
    sklearnGuideURL: `https://scikit-learn.org/stable/modules/biclustering.html#spectral-biclustering`,
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.cluster.SpectralBiclustering.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/bicluster/plot_spectral_biclustering.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://genome.cshlp.org/content/13/4/703.full'
  },
  {
    id: 'cheng-church',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'Cheng and Church Algorithm : 청-처치 알고리즘',
    subtitle: '평균제곱잔차(H-score)가 낮은 부분행렬을 그리디하게 찾아내는 유전자 발현 데이터 최초의 이중군집화',
    overview: `<p>평균제곱잔차 점수(H-score)는 부분행렬의 각 원소가 그 행의 평균·열의 평균·전체 평균과 비교해 얼마나 일관된 패턴을 보이는지 측정하는 지표. 점수가 낮을수록 함께 오르내리는 응집력 있는 이중군집(&#948;-bicluster)이며, 알고리즘은 전체 행렬에서 시작해 H-score를 가장 많이 낮추는 행·열을 임계값 이하가 될 때까지 그리디하게 제거.</p>`,
    formula: `H(I,J) = (1/|I||J|) Σ_{i∈I, j∈J} (e_ij − e_iJ − e_Ij + e_IJ)² ≤ δ`,
    features: `<p>H-score라는 명확한 수치 기준으로 이중군집의 응집도를 평가할 수 있고 개념이 단순해 널리 채택된 장점, 그리디 제거 방식이라 전역 최적해를 보장하지 못하고 임계값 &#948; 설정에 민감하며, 이미 찾은 이중군집과 겹치지 않게 하려면 값을 마스킹하는 추가 처리가 필요한 단점.</p>`,
    applications: `<p>유전자 발현 데이터에서 특정 조건 하에 함께 발현되는 유전자 그룹 탐색 등 생물정보학 분석에서 이중군집화를 대중화시킨 초기 기법으로 인용.</p>`,
    sklearnFunction: 'BCCC (biclust, R)',
    sklearnGuideURL: 'https://cran.r-project.org/web/packages/biclust/index.html',
    sklearnAPIURL: 'https://rdrr.io/cran/biclust/man/BCCC.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://www.aaai.org/Papers/ISMB/2000/ISMB00-010.pdf'
  },
  {
    id: 'isa-biclustering',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'ISA(Iterative Signature Algorithm) : 반복 서명 알고리즘',
    subtitle: `시드 집합에서 출발해 행렬 곱과 임계값 처리를 번갈아 반복하며 서로를 강화하는 전사 모듈로 수렴시키는 이중군집화`,
    overview: `<p>임의의 시드 벡터(유전자 일부를 표시한 0/1 벡터)에서 출발해, 발현 행렬로 그 유전자 집합과 강하게 연관된 조건들을 계산하고 임계값으로 걸러낸 뒤, 다시 그 조건 집합과 연관된 유전자를 계산해 거르는 과정을 번갈아 반복하는 기법. 임계값 처리가 핵심으로, 이것이 없으면 사실상 특이값 분해(SVD)와 동등해짐.</p>`,
    formula: `g_new = Π_g(Eᵀ·c),  c_new = Π_c(E·g)  (Π: 임계값 필터, 수렴할 때까지 반복)`,
    features: `<p>서로 겹치는(overlapping) 이중군집을 자연스럽게 찾을 수 있고, 임계값 처리 덕분에 노이즈에 비교적 강건한 장점, 시드 벡터와 임계값 설정에 결과가 민감하고 다양한 모듈을 얻으려면 여러 시드로 반복 실행해야 해 계산 비용이 늘어나는 단점.</p>`,
    applications: `<p>유전자 발현 데이터에서 겹칠 수 있는 전사 모듈 발굴, 노이즈에 강건한 이중군집화가 필요한 생물정보학 연구에 R/Bioconductor eisa·isa2 패키지로 사용.</p>`,
    sklearnFunction: 'isa2 (R/Bioconductor)',
    sklearnGuideURL: `https://www.bioconductor.org/packages/release/bioc/html/eisa.html`,
    sklearnAPIURL: 'https://rdrr.io/cran/isa2/man/isa.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://journals.aps.org/pre/abstract/10.1103/PhysRevE.67.031902`
  },
  {
    id: 'opsm',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'OPSM(Order-Preserving SubMatrix) : 순서 보존 부분행렬',
    subtitle: `값의 크기가 아니라 여러 조건에 걸친 오르내리는 순서가 일관되게 유지되는 부분행렬을 찾는 순서 기반 이중군집화`,
    overview: `<p>부분행렬이 순서 보존이라는 것은 열(조건)의 순서를 적절히 재배열했을 때 그 부분행렬의 모든 행(유전자)에서 값이 그 순서대로 엄격히 증가한다는 뜻. 절대적인 발현 수치가 아니라 여러 조건에 걸쳐 같은 순서로 오르내리는 패턴을 공유하는지를 보며, 이 문제는 NP-난해라 실제로는 빈발 시퀀스 패턴 마이닝 기반 등 휴리스틱으로 근사.</p>`,
    formula: '∃ 열 순열 π: ∀i∈I, e_{i,π(1)} < e_{i,π(2)} < ... < e_{i,π(k)}',
    features: `<p>절대값이 아닌 상대적 순서 패턴을 포착하므로 스케일이 다른 조건 간에도 일관된 생물학적 패턴을 찾을 수 있는 장점, 정확한 최적해를 찾는 문제 자체가 NP-난해라 대규모 데이터에서는 휴리스틱 근사에 의존해야 하고 정확도와 계산 비용 사이의 트레이드오프가 있는 단점.</p>`,
    applications: `<p>조건에 따른 상대적 발현 순서 변화가 중요한 유전자 발현 데이터 분석, 추천 시스템·마케팅 데이터의 순서 패턴 발견에 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://dl.acm.org/doi/10.1145/565196.565214'
  },
  {
    id: 'plaid-model',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'Plaid Model : 플래드 모델',
    subtitle: '데이터 행렬을 여러 겹의 이중군집(층) 값의 합으로 모델링해 겹치는 이중군집을 동시에 찾는 가법적 이중군집화',
    overview: `<p>Lazzeroni와 Owen이 2002년 제안한 기법으로, 발현 행렬의 각 원소를 여러 층(layer, 이중군집)의 기여값을 더한 것으로 모델링. 각 층은 자신에게 속한 행·열 집합과 그 층이 기여하는 값(층 평균 + 행 효과 + 열 효과)으로 정의되며, 최소제곱 오차 최소화로 층 구조를 반복 추정. 여러 층이 같은 행·열을 공유(중첩)할 수 있는 것이 청-처치와의 핵심 차이.</p>`,
    formula: `Y_ij = μ_0 + Σ_{k=1..K} (μ_k + α_ik + β_jk)·ρ_ik·κ_jk  (ρ, κ: 층 소속 지시자)`,
    features: `<p>여러 이중군집이 겹치는 중첩 구조를 명시적으로 모델링할 수 있어 겹침이 없다고 가정하는 기법보다 유연한 장점, 층 개수와 각 층의 행·열 집합을 함께 추정해야 해 모델 적합의 계산 비용과 복잡도가 크고 층 개수를 정하는 별도 기준이 필요한 단점.</p>`,
    applications: `<p>하나의 유전자가 여러 생물학적 과정에 동시에 관여하는 등 이중군집이 겹칠 가능성이 높은 유전자 발현 데이터의 정밀 분석에 사용.</p>`,
    sklearnFunction: 'BCPlaid (biclust, R)',
    sklearnGuideURL: 'https://cran.r-project.org/web/packages/biclust/index.html',
    sklearnAPIURL: `https://search.r-project.org/CRAN/refmans/biclust/html/BCPlaid.html`,
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://www.jstor.org/stable/24307087'
  },
  {
    id: 'xmotifs',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'xMOTIFs(conserved gene expression MOTIFs) : 보존된 유전자 발현 모티프',
    subtitle: '이산화한 발현 값이 여러 샘플에 걸쳐 정확히 동일하게 유지되는 유전자 집합을 그리디하게 찾는 이중군집화',
    overview: `<p>발현 행렬을 몇 개의 이산 수준(예: 저·중·고)으로 이산화한 뒤, 어떤 유전자 집합이 특정 샘플 부분집합에서 모두 동일한 이산 값을 가지면 그 조합을 보존된 발현 모티프로 정의하는 기법. 여러 무작위 시드에서 가장 큰 모티프를 그리디하게 탐색하고, 하나를 찾으면 해당 샘플을 제거한 뒤 나머지에서 반복해 샘플이 겹치지 않는 이중군집들을 순차적으로 획득.</p>`,
    formula: '(G, S)가 xMOTIF ⇔ ∀g∈G, ∀s∈S: state(g,s) = 동일한 이산값, |S| ≥ α·n',
    features: `<p>"정확히 동일한 이산 값"이라는 엄격한 기준으로 매우 뚜렷한 발현 패턴을 찾아내고 질병 아형 구분처럼 클래스 판별에 유용한 패턴 발굴에 강점이 있는 장점, 이산화 방식(구간 수·경계)에 결과가 크게 좌우되고 서로 겹치지 않는 이중군집만 반환해 실제로 겹치는 생물학적 패턴은 놓칠 수 있는 단점.</p>`,
    applications: `<p>암의 아형 분류처럼 특정 환자 그룹을 구별짓는 유전자 발현 패턴 탐색, 질병 아형 연관 유전자 마커 발굴에 사용.</p>`,
    sklearnFunction: 'BCXmotifs (biclust, R)',
    sklearnGuideURL: 'https://cran.r-project.org/web/packages/biclust/index.html',
    sklearnAPIURL: 'https://rdrr.io/cran/biclust/man/BCXmotifs.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://pubmed.ncbi.nlm.nih.gov/12603019/'
  },
  {
    id: 'bimax',
    category: 'unsup',
    subcategory: 'clustering',
    title: `Bimax(BInary inclusion-MAXimal biclustering) : 이진 포함-극대 이중군집화`,
    subtitle: `0/1 이진 행렬에서 더 이상 확장할 수 없는 모든 1로 채워진 부분행렬을 분할정복으로 빠짐없이 열거하는 기법`,
    overview: `<p>Prelic 등이 2006년 제안한 기법으로, 발현 행렬을 임계값 기준으로 0/1 이진 행렬로 변환한 뒤 모든 1로만 채워진 부분행렬 중 행이나 열을 하나라도 추가하면 0이 섞이게 되는 포함-극대(inclusion-maximal) 부분행렬을 분할정복으로 열거. 확률적 탐색이 아니라 조건을 만족하는 모든 이중군집을 체계적으로 찾아냄.</p>`,
    formula: `bicluster (I, J): ∀i∈I, ∀j∈J, e_ij = 1  이고 (I′⊇I ∧ J′⊇J)인 더 큰 부분행렬이 존재하지 않음`,
    features: `<p>조건을 만족하는 모든 이중군집을 빠짐없이 열거해 탐욕적 방법이 놓칠 수 있는 패턴도 찾아내고, 분할정복으로 비교적 효율적으로 동작하는 장점, 연속값을 이진화하는 과정에서 정보 손실이 발생하고 이중군집 수가 많은 데이터에서는 열거 결과가 지나치게 많아지는 단점.</p>`,
    applications: `<p>발현 유무(on/off)로 단순화할 수 있는 유전자 발현 데이터의 전수 이중군집 탐색, 다른 이중군집화 알고리즘의 성능 비교 벤치마크 기준으로 널리 사용.</p>`,
    sklearnFunction: 'BCBimax (biclust, R)',
    sklearnGuideURL: 'https://cran.r-project.org/web/packages/biclust/index.html',
    sklearnAPIURL: 'https://rdrr.io/cran/biclust/man/BCBimax.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://academic.oup.com/bioinformatics/article/22/9/1122/200492`
  },
  {
    id: 'fabia',
    category: 'unsup',
    subcategory: 'clustering',
    title: `FABIA(Factor Analysis for BIcluster Acquisition) : 바이클러스터 획득을 위한 요인 분석`,
    subtitle: '희소한 인자와 적재를 갖는 요인분석으로 무거운 꼬리 분포까지 반영해 이중군집을 추출하는 확률적 기법',
    overview: `<p>발현 행렬을 소수의 인자(조건 방향 패턴)와 적재(유전자 방향 기여도)의 곱셈적 결합으로 모델링하는 요인분석 기법. 인자와 적재 모두에 희소성을 부여해 소수의 유전자·조건만 강하게 관여하는 국소적 이중군집 구조를 얻으며, 유전자 발현 데이터의 무거운 꼬리(heavy-tail) 분포를 반영하도록 EM과 변분 근사를 결합한 베이지안 프레임워크로 학습.</p>`,
    formula: `X = Σ_{k=1..p} λ_k · z_kᵀ + Υ  (λ_k: 희소 적재 벡터, z_k: 희소 인자 벡터)`,
    features: `<p>희소 요인분석을 통해 국소적이고 해석 가능한 이중군집을 얻고, 실제 유전자 발현 데이터의 무거운 꼬리 분포를 통계적으로 잘 반영하는 장점, 인자 개수를 미리 지정해야 하고 베이지안 변분 추론 특성상 단순 이중군집화 기법보다 개념적으로 복잡하며 계산 비용이 큰 단점.</p>`,
    applications: `<p>대규모 전사체(transcriptome) 데이터에서 유전자와 샘플을 동시에 그룹화하는 생물정보학 분석에 Bioconductor fabia 패키지로 널리 사용.</p>`,
    sklearnFunction: 'fabia (Bioconductor)',
    sklearnGuideURL: `https://bioconductor.org/packages/release/bioc/html/fabia.html`,
    sklearnAPIURL: `https://bioconductor.org/packages/release/bioc/manuals/fabia/man/fabia.pdf`,
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://academic.oup.com/bioinformatics/article/26/12/1520/287036`
  },
  {
    id: 'kmodes',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'K-Modes : K-최빈값',
    subtitle: '범주형 데이터를 위해 K-평균의 평균을 최빈값으로, 거리를 불일치 개수로 바꾼 분할 군집화',
    overview: `<p>색상·지역·등급처럼 평균이라는 개념이 성립하지 않는 범주형 데이터를 다루기 위해, 군집 중심을 각 속성의 최빈값(mode) 조합으로 정의하고 두 데이터의 거리를 "값이 일치하지 않는 속성의 개수"로 측정하는 기법.</p>`,
    formula: 'd(x, y) = Σ_{j=1..m} δ(x_j, y_j),  δ(a,b) = 0 (a=b), 1 (a≠b)',
    features: `<p>범주형 데이터에서 평균이 의미 없다는 문제를 해결, 중심이 "최빈값 조합"이라 해석이 쉬움(전형적 범주 패턴)의 장점, 연속형 데이터에는 부적합(범주화 필요), 범주화 방식(구간 수/경계)에 따라 결과가 달라질 수 있음, K와 초기 모드에 민감할 수 있는 단점.</p>`,
    applications: `<p>설문 응답(예/아니오, 선호 범주) 기반 응답자 유형 분류, 고객의 범주형 속성(회원등급·거주지역·선호 카테고리) 세분화, 유전자 마커 같은 이산형 생물 데이터 분석에 사용.</p>`,
    sklearnFunction: 'KModes (kmodes)',
    sklearnGuideURL: 'https://github.com/nicodv/kmodes',
    sklearnAPIURL: 'https://pypi.org/project/kmodes/',
    sklearnExampleURL: `https://github.com/nicodv/kmodes/blob/master/examples/soybean.py`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://link.springer.com/article/10.1023/A:1009769707641'
  },
  {
    id: 'kprototypes',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'K-Prototypes : K-프로토타입',
    subtitle: '수치형과 범주형이 섞인 혼합 데이터를 K-평균과 K-최빈값의 거리를 결합해 군집화하는 기법',
    overview: `<p>K-평균(수치형, 유클리드 거리)과 K-최빈값(범주형, 불일치 개수)을 하나의 목적함수로 결합해, 실무 데이터에서 흔한 혼합형 데이터를 한 번에 군집화하는 기법. 두 거리의 균형은 가중치 &#947;(gamma)로 조절하며, 중심 갱신도 수치형은 평균, 범주형은 최빈값으로 각각 수행.</p>`,
    formula: `d(x, c) = Σ_{j ∈ num} (x_j − c_j)² + γ · Σ_{j ∈ cat} δ(x_j, c_j)  (γ: 범주형 항 가중치)`,
    features: `<p>수치형+범주형 혼합 데이터를 하나의 모델로 자연스럽게 군집화 가능, 데이터 타입별로 적절한 중심 갱신(평균/최빈값)을 사용하는 장점, gamma(범주형 항 가중치) 선택이 결과에 영향, 범주화 방식과 가중치 설정이 임의적일 수 있음(해석/재현성 이슈), 구현 및 튜닝이 K-means보다 복잡한 단점.</p>`,
    applications: `<p>나이·소득(수치형)과 직업·지역(범주형)이 함께 있는 고객 데이터 세분화, 설비 센서값과 상태 코드가 혼재된 제조 데이터 분석 등 실무 정형 데이터 전반에 사용.</p>`,
    sklearnFunction: 'KPrototypes (kmodes)',
    sklearnGuideURL: 'https://github.com/nicodv/kmodes',
    sklearnAPIURL: `https://github.com/nicodv/kmodes/blob/master/kmodes/kprototypes.py`,
    sklearnExampleURL: `https://github.com/nicodv/kmodes/blob/master/examples/benchmark_kprototypes.py`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://grid.cs.gsu.edu/~wkim/index_files/papers/kprototype.pdf`
  },
  {
    id: 'fuzzy-c-means',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'FCM(Fuzzy C-Means) : 퍼지 C-평균',
    subtitle: '각 데이터가 여러 군집에 소속도(membership)를 가지고 부분적으로 속할 수 있게 하는 소프트 군집화',
    overview: `<p>K-평균이 데이터를 하나의 군집에만 배타적으로 배정하는 것과 달리, 각 데이터가 모든 군집에 대해 0~1 사이의 소속도를 가지도록 허용하는 기법. 퍼지 지수(fuzzifier, m)로 소속도의 부드러운 정도를 조절하며, 소속도를 가중치로 삼아 중심점을 갱신하는 과정을 반복.</p>`,
    formula: `J_m = Σ_{i=1..n} Σ_{j=1..c} (u_ij)^m ||x_i − c_j||²  (u_ij: i번째 데이터의 j번째 군집 소속도, m: 퍼지 지수)`,
    features: `<p>군집 경계가 모호한 경우에도 소속도로 표현 가능, "부분적으로 여러 군집에 속하는" 현상을 자연스럽게 모델링, hard clustering(K-means)보다 유연한 해석이 가능한 장점, fuzzifier(m) 등 하이퍼파라미터에 민감, 이상치에 취약할 수 있으며, 계산량이 K-means보다 크고, 최종적으로 hard label이 필요하면 소속도에서 argmax로 변환해야 함(정보 일부 손실)의 단점.</p>`,
    applications: `<p>의료 영상 분할(조직 경계가 불분명한 MRI·CT 영상), 고객 세분화 중 복수 세그먼트에 걸친 고객 분석, 토양·기상 데이터처럼 범주 경계가 연속적인 데이터 분석에 사용.</p>`,
    sklearnFunction: 'skfuzzy.cluster.cmeans (scikit-fuzzy)',
    sklearnGuideURL: 'https://scikit-fuzzy.readthedocs.io/',
    sklearnAPIURL: `https://scikit-fuzzy.readthedocs.io/en/latest/_modules/skfuzzy/cluster/_cmeans.html`,
    sklearnExampleURL: `https://scikit-fuzzy.readthedocs.io/en/latest/auto_examples/plot_cmeans.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://www.sciencedirect.com/science/article/abs/pii/0098300484900207`
  },
  {
    id: 'kmeans-plusplus',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'K-Means++ : K-평균++',
    subtitle: '초기 중심점을 서로 멀리 떨어지도록 확률적으로 선택해 K-평균의 수렴 속도와 품질을 높이는 초기화 기법',
    overview: `<p>K-평균이 초기 중심점을 완전히 무작위로 고르면 지역 최적해에 빠지기 쉬운 문제를 개선한 초기화 방법. 첫 중심점은 무작위로 뽑되, 이후 중심점은 기존 중심점들로부터 거리가 멀수록 뽑힐 확률이 높아지도록(거리 제곱에 비례) 순차적으로 선택. scikit-learn의 KMeans가 기본값으로 채택.</p>`,
    formula: `P(x) = D(x)² / Σ_{x′} D(x′)²  (D(x): x에서 가장 가까운 기존 중심점까지의 거리)`,
    features: `<p>무작위 초기화보다 더 적은 반복으로 더 좋은 해에 수렴하고, 최적해 대비 기댓값 상한(O(log K) 근사 보장)이 이론적으로 증명되어 있으며 scikit-learn 기본값으로 채택될 만큼 안정적인 장점, 중심점을 하나씩 순차적으로 뽑아야 해 초기화 자체의 계산 비용이 무작위 초기화보다 약간 큰 단점.</p>`,
    applications: `<p>K-평균을 사용하는 거의 모든 실무 상황에서 기본 초기화 전략으로 사용되며, 특히 군집 결과의 재현성과 안정성이 중요한 분석에 필수적으로 적용.</p>`,
    sklearnFunction: 'kmeans_plusplus',
    sklearnGuideURL: `https://scikit-learn.org/stable/modules/clustering.html#k-means`,
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.cluster.kmeans_plusplus.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/cluster/plot_kmeans_plusplus.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'http://ilpubs.stanford.edu:8090/778/1/2006-13.pdf'
  },
  {
    id: 'possibilistic-c-means',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'PCM(Possibilistic C-Means) : 가능성 C-평균',
    subtitle: '퍼지 C-평균의 소속도 합이 1이어야 한다는 제약을 없애 이상치에 강건하게 만든 소프트 군집화',
    overview: `<p>퍼지 C-평균(FCM)은 각 데이터의 소속도 합이 반드시 1이어야 해서, 모든 군집에서 멀리 떨어진 이상치도 억지로 어딘가에 높은 소속도를 갖게 되는 문제가 있음. PCM은 이 합=1 제약을 제거해 소속도를 "그 군집에 속할 가능성(typicality)"으로 재해석하여, 이상치가 모든 군집에 대해 낮은 값을 갖도록 허용하는 기법.</p>`,
    formula: `J = Σ_{i=1..n} Σ_{j=1..c} (u_ij)^m ||x_i − c_j||² + Σ_{j=1..c} η_j Σ_{i=1..n} (1−u_ij)^m  (제약 Σ_j u_ij = 1 없음)`,
    features: `<p>소속도 합 제약이 없어 이상치가 모든 군집에서 낮은 값을 갖게 되므로 FCM보다 잡음·이상치에 강건하고, 소속도를 절대적인 "전형성"으로 해석할 수 있는 장점, 군집 간 상호 제약이 사라져 여러 중심이 같은 군집으로 겹쳐 수렴(coincident cluster)하는 문제가 있고, 대역폭 파라미터 &#951; 설정에 민감한 단점.</p>`,
    applications: `<p>잡음이 많은 센서·영상 데이터의 군집화, 이상치를 명시적으로 걸러내야 하는 품질 검사 데이터 분석 등 FCM이 이상치에 흔들리는 상황의 대안으로 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://ieeexplore.ieee.org/document/227387'
  },
  {
    id: 'x-means',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'X-Means : X-평균',
    subtitle: 'BIC 등 정보기준으로 군집 분할 여부를 판정해 K를 자동으로 결정하는 K-평균 확장',
    overview: `<p>K-평균을 실행한 뒤 각 군집을 둘로 나눠보고, 나누기 전과 후의 BIC(베이지안 정보기준)를 비교해 점수가 개선되면 분할을 채택하는 과정을 반복하는 기법. 사용자는 K의 대략적인 범위만 지정하면 되고, 최종 K는 정보기준이 결정.</p>`,
    formula: `BIC = ln L − (p/2)·ln n  (L: 우도, p: 파라미터 수, n: 데이터 수) → 분할 전후 BIC 비교로 채택 여부 결정`,
    features: `<p>K를 정확히 지정하지 않고 범위만 주면 정보기준으로 자동 결정하며, K-평균 기반이라 계산 효율이 좋은 장점, 군집이 구형 가우시안이라는 가정에 의존하고, BIC 근사의 가정이 어긋나는 데이터에서는 K를 과대·과소 추정할 수 있는 단점.</p>`,
    applications: `<p>군집 개수를 사전에 모르는 대규모 데이터의 탐색적 분석, 반복 실험에서 K를 매번 수동 조정하기 어려운 자동화 파이프라인에 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://cs.pitt.edu/~jrs/pubs/xmeans.pdf'
  },
  {
    id: 'g-means',
    category: 'unsup',
    subcategory: 'clustering',
    title: 'G-Means : G-평균',
    subtitle: '각 군집이 가우시안 분포를 따르는지 통계 검정으로 확인해 K를 자동으로 늘려가는 K-평균 확장',
    overview: `<p>적은 수의 군집에서 시작해 각 군집 내부 데이터가 가우시안 분포를 따르는지 Anderson-Darling 정규성 검정으로 판정하고, 정규성을 만족하지 않으면 그 군집을 둘로 분할하는 과정을 반복. K를 사용자가 지정하지 않아도 통계적 근거로 적절한 군집 개수를 스스로 찾아내는 기법.</p>`,
    formula: `각 군집에 대해 Anderson-Darling 정규성 검정 수행 → 기각 시 해당 군집을 2개로 분할, 수렴할 때까지 반복`,
    features: `<p>K를 사전에 지정하지 않아도 통계 검정을 근거로 군집 개수를 자동 결정하고, 판정 기준이 통계적으로 명확한 장점, 각 군집이 가우시안(구형)이라는 가정에 의존해 비구형 군집에서는 과도하게 분할될 수 있고, 반복적인 분할·검정으로 계산 비용이 K-평균보다 큰 단점.</p>`,
    applications: `<p>군집 개수를 사전에 알기 어려운 탐색적 데이터 분석, 문서·이미지 자동 그룹화 등 적절한 K 결정 자체가 과제인 상황에 사용.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: `https://proceedings.neurips.cc/paper/2003/file/234833147b97bb6aed53a8f4f1c7a7d8-Paper.pdf`
  },
  {
    id: 'pca',
    category: 'unsup',
    subcategory: 'dim-reduction',
    title: '주성분분석 (PCA, Principal Component Analysis)',
    subtitle: '데이터의 분산을 최대한 보존하며 차원을 축소하는 기법',
    overview: `<p>서로 상관된 여러 특성을 분산이 가장 큰 방향(주성분) 순서로 재구성하여, 정보 손실을 최소화하면서 저차원으로
      투영합니다. 공분산 행렬의 고유벡터(eigenvector)가 주성분 축이 되고, 고유값(eigenvalue)이 클수록 설명력이 큽니다.</p>`,
    formula: `Cov(X)&#183;v = &#955;&#183;v  (고유벡터 v가 주성분 방향, &#955;가 분산 설명량)`,
    applications: `<p>고차원 이미지·유전자 데이터의 시각화, 차원의 저주(curse of dimensionality) 완화를 위한 전처리,
      노이즈 제거, 얼굴 인식(Eigenface) 등에서 핵심 전처리 기법으로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'q-learning',
    category: 'rl',
    subcategory: 'value-based',
    title: 'Q-러닝 (Q-Learning)',
    subtitle: '시행착오를 통해 상태-행동 가치를 학습하는 대표적 강화학습 알고리즘',
    overview: `<p>에이전트가 환경과 상호작용하며 각 (상태, 행동) 쌍의 가치(Q값)를 테이블 또는 함수로 학습합니다. 실제로 취한
      행동과 무관하게 다음 상태에서의 최대 Q값을 이용해 갱신하는 오프폴리시(off-policy) 방식입니다.</p>`,
    formula: `Q(s,a) &#8592; Q(s,a) + &#945;[r + &#947;&#183;max&#8342;Q(s',a') − Q(s,a)]`,
    applications: `<p>게임 AI(아타리 게임, 격자 기반 게임), 로봇 경로 탐색, 창고 로봇의 최적 이동 경로 학습, 자원 배분 최적화 등
      환경과의 반복적 상호작용을 통해 보상을 최대화해야 하는 순차적 의사결정 문제에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'policy-gradient',
    category: 'rl',
    subcategory: 'policy-based',
    title: '정책 경사법 (Policy Gradient)',
    subtitle: 'Q값 대신 정책 자체를 직접 최적화하는 강화학습 알고리즘',
    overview: `<p>상태를 행동의 확률분포로 매핑하는 정책 &#960;&#952;(a|s)를 신경망으로 표현하고, 기대 보상을 높이는 방향으로
      정책 파라미터 &#952;를 경사상승법으로 직접 갱신합니다. 행동 공간이 연속적이거나 매우 클 때 Q-러닝보다 적합합니다.</p>`,
    formula: `&#8711;&#952; J(&#952;) = E[&#8711;&#952; log &#960;&#952;(a|s)&#183;G&#8348;]`,
    applications: `<p>로봇 팔의 연속적 제어(관절 각도 조정), 자율주행의 조향·가속 제어, 대화형 에이전트의 응답 정책 학습 등
      행동이 이산적이지 않고 연속적인 값을 가지는 제어 문제에서 주로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'random-forest',
    category: 'ensemble',
    subcategory: 'bagging',
    title: '랜덤 포레스트 (Random Forest)',
    subtitle: '여러 결정트리를 배깅으로 결합해 분산을 낮추는 대표적 앙상블 모델',
    overview: `<p>훈련 데이터에서 중복을 허용해 여러 부분집합(부트스트랩 샘플)을 뽑고, 각 샘플마다 결정트리를 독립적으로 학습시킨 뒤
      다수결(분류) 또는 평균(회귀)으로 예측을 결합합니다. 트리마다 분기 시 특성도 무작위로 일부만 사용해 트리 간 상관을 낮춥니다.</p>`,
    formula: `y&#770; = mode/mean { T&#8321;(x), T&#8322;(x), ..., T&#8345;(x) }  (T&#8342;는 부트스트랩 샘플로 학습한 개별 트리)`,
    applications: `<p>신용평가·의료 진단·이미지 분류 등 정형 데이터 기반 분류/회귀 문제에서 결정트리보다 안정적인 성능을 내는
      실무 기본값(default) 모델로 널리 쓰이며, 특성 중요도(feature importance) 산출에도 자주 활용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: '3d-plot',
    category: 'unsup',
    subcategory: 'visualization',
    title: '3D 그래프 (3D Plot)',
    subtitle: '세 개의 변수를 3차원 공간의 좌표로 동시에 표현하는 기본 시각화',
    overview: `<p>세 개의 수치형 변수를 x·y·z 세 축에 각각 대응시켜 점, 선, 또는 표면으로 그리는 그래프입니다. 두 변수 간 관계만으로는 드러나지 않는 세 변수 사이의 입체적인 패턴이나 곡면 구조를 살펴볼 때 사용합니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 세 변수의 관계를 한 그림에 담을 수 있지만, 2차원 화면에 투영하는 과정에서 점들이 서로 가려지거나 축척이 왜곡되어 정확한 값을 읽기 어렵습니다.</p>`,
    applications: `<p>물리 시뮬레이션 결과, 3변수 실험 데이터의 곡면(예: 손실 함수 지형) 시각화, 지형·기상 데이터의 고도 표현 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'area-plot',
    category: 'unsup',
    subcategory: 'visualization',
    title: '면적 그래프 (Area Plot)',
    subtitle: '선 그래프 아래 영역을 색으로 채워 값의 크기와 누적을 함께 강조하는 시각화',
    overview: `<p>선 그래프와 동일하게 x축을 따라 값을 잇지만, 선 아래 영역을 색으로 채워 값의 크기를 시각적으로 강조합니다. 여러 계열을 쌓아 그리면 전체 합계와 각 계열의 기여도를 동시에 볼 수 있습니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 값의 추이와 크기를 함께 강조해 시간에 따른 누적 변화를 직관적으로 보여주지만, 계열이 많아지면 겹친 영역을 구분하기 어려워집니다.</p>`,
    applications: `<p>시계열 매출·트래픽의 누적 추이, 포트폴리오 구성 비중의 시간 변화 등 값의 크기와 흐름을 함께 보여주고 싶은 데이터에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'bar-plot',
    category: 'unsup',
    subcategory: 'visualization',
    title: '막대 그래프 (Bar Plot)',
    subtitle: '범주별 값을 막대의 길이로 비교하는 가장 기본적인 시각화',
    overview: `<p>범주형 변수의 각 항목에 대응하는 수치를 막대의 길이(또는 높이)로 표현합니다. 범주 간 값의 크기를 직관적으로 비교할 수 있어 가장 널리 쓰이는 기초 시각화입니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 범주 간 크기 비교가 직관적이지만, 범주 수가 많아지면 막대가 좁아져 가독성이 떨어집니다.</p>`,
    applications: `<p>제품별 매출 비교, 설문 응답 빈도 집계, 카테고리별 성능 지표 비교 등 범주형 데이터의 크기 비교에 널리 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'box-plot',
    category: 'unsup',
    subcategory: 'visualization',
    title: '박스 플롯 (Box Plot)',
    subtitle: '사분위수를 이용해 데이터의 분포·중앙값·이상치를 한눈에 보여주는 시각화',
    overview: `<p>데이터를 1사분위수(Q1)·중앙값(Q2)·3사분위수(Q3)로 요약해 상자로 그리고, 상자 밖으로 수염(whisker)을 뻗어 정상 범위를 표시합니다. 수염을 벗어난 점은 이상치 후보로 개별 표시합니다.</p>
      <div class="algo-formula">IQR = Q3 − Q1,&nbsp; 수염 범위 = [Q1 − 1.5·IQR, Q3 + 1.5·IQR]</div>`,
    formula: 'IQR = Q3 − Q1,&nbsp; 수염 범위 = [Q1 − 1.5·IQR, Q3 + 1.5·IQR]',
    features: `<p><strong>특징</strong> — 평균 대신 중앙값·사분위수를 사용해 이상치의 영향을 적게 받고, 여러 그룹의 분포를 나란히 비교하기에 좋습니다.</p>`,
    applications: `<p>여러 실험군 간 성능 분포 비교, 설문 응답의 이상치 탐지, 품질 관리에서 공정 산포 확인 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'bubble-plot',
    category: 'unsup',
    subcategory: 'visualization',
    title: '버블 차트 (Bubble Plot)',
    subtitle: '산점도에 원의 크기라는 세 번째 차원을 더해 세 변수를 동시에 표현하는 시각화',
    overview: `<p>x·y 좌표로 두 변수를 표현하는 산점도에, 각 점을 원(버블)으로 그리고 그 크기로 세 번째 변수를 추가로 표현합니다. 필요하면 색상까지 더해 네 번째 변수도 함께 나타낼 수 있습니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 한 그림에서 세 개 이상의 변수를 동시에 비교할 수 있지만, 버블이 겹치면 크기를 정확히 비교하기 어려워집니다.</p>`,
    applications: `<p>국가별 인구·소득·기대수명을 동시에 보여주는 사회지표 시각화, 상품별 매출·마진·판매량 비교 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'contour-plot',
    category: 'unsup',
    subcategory: 'visualization',
    title: '등고선 플롯 (Contour Plot)',
    subtitle: '2차원 평면 위에서 같은 값을 잇는 등고선으로 3차원 곡면을 표현하는 시각화',
    overview: `<p>두 변수(x, y)에 대응하는 값(z)이 같은 지점들을 선으로 이어 등고선을 그립니다. 산을 지도 위에 등고선으로 표현하듯, 3차원 곡면 데이터를 2차원 평면에 압축해서 보여줍니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 3차원 곡면을 2차원으로 압축해 값이 밀집·희소한 영역과 봉우리·골짜기 구조를 한눈에 파악할 수 있습니다.</p>`,
    applications: `<p>손실 함수(loss surface)의 최적화 경로 시각화, 지형 고도·기압 분포 지도, 2변량 확률밀도함수 시각화 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'donut-chart',
    category: 'unsup',
    subcategory: 'visualization',
    title: '도넛 차트 (Donut Chart)',
    subtitle: '파이 차트 가운데를 비워 전체 대비 비율을 표현하는 원형 시각화',
    overview: `<p>전체를 100%로 두고 각 범주가 차지하는 비율을 원형 조각의 각도로 표현하는 파이 차트의 변형입니다. 가운데를 도넛처럼 비워 총합·핵심 수치 등 추가 정보를 표시할 여백으로 활용할 수 있습니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 파이 차트보다 시각적으로 덜 무겁고 중앙에 요약 수치를 배치할 수 있지만, 조각 각도로 비율을 정확히 비교하기는 여전히 어렵습니다.</p>`,
    applications: `<p>설문 응답 비율, 예산 항목별 구성비, 시장 점유율 등 전체 대비 부분의 비율을 간단히 보여줄 때 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'heatmap',
    category: 'unsup',
    subcategory: 'visualization',
    title: '히트맵 (Heatmap)',
    subtitle: '행렬 형태 데이터의 각 값을 색상의 진하기로 표현하는 시각화',
    overview: `<p>행과 열로 이루어진 표(행렬) 형태 데이터에서, 각 칸의 값을 색의 진하기나 색조로 표현합니다. 숫자를 일일이 읽지 않고도 값이 큰 영역과 작은 영역, 패턴을 색으로 즉시 파악할 수 있습니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 큰 행렬 데이터에서 패턴·군집·상관관계를 색으로 즉각 드러내지만, 색상 척도를 잘못 고르면 실제보다 과장되거나 왜곡되어 보일 수 있습니다.</p>`,
    applications: `<p>변수 간 상관행렬 시각화, 유전자 발현 데이터의 조건별 패턴 분석, 웹페이지 클릭 히트맵 분석 등에 널리 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'histogram-viz',
    category: 'unsup',
    subcategory: 'visualization',
    title: '히스토그램 (Histogram)',
    subtitle: '연속형 데이터를 구간(bin)으로 나누어 각 구간의 빈도를 막대로 표현하는 시각화',
    overview: `<p>연속형 변수의 값 범위를 일정한 폭의 구간(bin)으로 나누고, 각 구간에 속하는 데이터 개수를 막대의 높이로 표현합니다. 데이터가 어떤 값 근처에 몰려 있고 어떻게 퍼져 있는지, 즉 분포의 모양을 파악하는 가장 기본적인 방법입니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 데이터의 분포 형태(대칭·치우침·다봉성)를 직관적으로 보여주지만, 구간(bin) 폭을 어떻게 정하느냐에 따라 인상이 크게 달라집니다.</p>`,
    applications: `<p>측정값의 분포 확인, 이상치 존재 여부 사전 점검, 모델 입력 특성의 정규성 확인 등 데이터 탐색의 첫 단계에서 거의 항상 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'kde-plot',
    category: 'unsup',
    subcategory: 'visualization',
    title: '밀도 플롯 (KDE, Kernel Density Estimate)',
    subtitle: '히스토그램의 계단식 형태 대신 매끄러운 곡선으로 데이터의 분포를 추정해 그리는 시각화',
    overview: `<p>각 데이터 점 위에 작은 커널(주로 가우시안) 곡선을 씌운 뒤 모두 더해, 히스토그램보다 매끄러운 확률밀도 곡선으로 데이터 분포를 표현합니다. 구간 경계에 따라 모양이 들쭉날쭉해지는 히스토그램의 단점을 보완합니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 매끄러운 곡선으로 분포의 전체적인 모양을 보여주지만, 대역폭(bandwidth) 설정에 따라 과도하게 뭉개지거나 지나치게 울퉁불퉁해질 수 있습니다.</p>`,
    applications: `<p>여러 그룹의 분포 형태를 겹쳐서 비교, 히스토그램보다 매끄러운 분포 시각화가 필요한 발표 자료 등에 사용됩니다.</p>`,
    sklearnFunction: 'KernelDensity',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/density.html',
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KernelDensity.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/neighbors/plot_kde_1d.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'line-plot',
    category: 'unsup',
    subcategory: 'visualization',
    title: '선 그래프 (Line Plot)',
    subtitle: '순서가 있는 데이터를 점으로 찍고 선으로 이어 추세를 보여주는 가장 기본적인 시각화',
    overview: `<p>시간이나 순서에 따라 나열된 데이터를 점으로 표시하고 인접한 점을 선으로 이어, 값이 오르내리는 추세를 보여줍니다. 시계열 데이터를 표현하는 가장 기본적이고 직관적인 방법입니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 값의 증가·감소·추세를 직관적으로 보여주지만, 데이터 포인트가 매우 많으면 선이 뭉개져 세부 패턴이 가려질 수 있습니다.</p>`,
    applications: `<p>주가·매출 추이, 센서 측정값의 시간 변화, 모델 학습 중 손실 값 변화 추적 등 순서가 있는 데이터의 추세 파악에 가장 널리 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'pair-plot',
    category: 'unsup',
    subcategory: 'visualization',
    title: '산점도 행렬 (Pair Plot, Scatter Matrix)',
    subtitle: '모든 변수 쌍의 산점도를 격자로 배열해 다변량 데이터의 관계를 한눈에 살펴보는 시각화',
    overview: `<p>여러 변수를 가진 데이터에서, 가능한 모든 변수 쌍에 대한 산점도를 행렬 형태로 배열해 그립니다. 대각선에는 각 변수 자신의 분포(히스토그램 또는 밀도 플롯)를 배치해, 변수 간 관계와 개별 분포를 동시에 살펴볼 수 있습니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 여러 변수 쌍의 관계를 한 번에 탐색할 수 있어 다변량 데이터 탐색(EDA)의 초기 단계에 유용하지만, 변수 수가 많아지면 격자가 너무 커져 한눈에 보기 어려워집니다.</p>`,
    applications: `<p>모델링 전 여러 특성 간 상관관계·군집 구조를 빠르게 훑어보는 탐색적 데이터 분석(EDA)에 널리 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'pie-chart',
    category: 'unsup',
    subcategory: 'visualization',
    title: '파이 차트 (Pie Chart)',
    subtitle: '전체를 원 하나로 두고 각 범주의 비율을 부채꼴 각도로 표현하는 시각화',
    overview: `<p>전체 데이터를 원 하나(100%)로 표현하고, 각 범주가 차지하는 비율만큼 부채꼴 모양으로 잘라 나타냅니다. 전체 대비 각 부분의 비중을 표현하는 가장 대중적인 방법입니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 전체 대비 비율이라는 의미가 직관적으로 전달되지만, 조각이 여러 개이거나 크기가 비슷하면 어느 쪽이 더 큰지 각도만으로 구분하기 어렵습니다.</p>`,
    applications: `<p>시장 점유율, 예산 구성비, 설문 응답 비율 등 전체를 구성하는 항목별 비중을 간단히 보여줄 때 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'scatter-plot',
    category: 'unsup',
    subcategory: 'visualization',
    title: '산점도 (Scatter Plot)',
    subtitle: '두 변수의 값을 점 하나하나로 좌표평면에 찍어 관계를 살펴보는 가장 기본적인 시각화',
    overview: `<p>두 수치형 변수를 각각 x축·y축으로 삼아, 개별 데이터를 점으로 좌표평면에 찍습니다. 두 변수 사이에 어떤 관계(양의 상관, 음의 상관, 관계 없음, 군집 구조 등)가 있는지 가장 직접적으로 보여줍니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 두 변수의 관계·군집·이상치를 직관적으로 드러내지만, 데이터가 매우 많으면 점들이 겹쳐(overplotting) 밀도를 제대로 읽기 어려워집니다.</p>`,
    applications: `<p>변수 간 상관관계 탐색, 회귀 모델의 예측값-실제값 비교, 군집화 결과 시각화 등 데이터 분석 전반에서 가장 기본적으로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'stacked-bar-plot',
    category: 'unsup',
    subcategory: 'visualization',
    title: '누적 막대 그래프 (Stacked Bar Plot)',
    subtitle: '하나의 막대 안에 여러 하위 항목을 쌓아, 전체 합계와 구성 비율을 함께 보여주는 시각화',
    overview: `<p>일반 막대 그래프처럼 범주별 막대를 그리되, 각 막대를 여러 하위 항목으로 나누어 쌓아 올립니다. 막대 전체 높이는 합계를, 각 구간의 길이는 하위 항목의 기여도를 함께 보여줍니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 전체 합계와 구성 요소별 기여도를 동시에 보여줄 수 있지만, 맨 아래 항목을 제외한 나머지 구간은 시작점이 달라 서로 길이를 비교하기 어렵습니다.</p>`,
    applications: `<p>연도별 매출을 제품 카테고리별로 나누어 보여주는 차트, 설문 응답을 하위 그룹별로 나누어 비교하는 분석 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'step-plot',
    category: 'unsup',
    subcategory: 'visualization',
    title: '꺾은선 그래프 (Step Plot)',
    subtitle: '값이 부드럽게 변하지 않고 특정 시점에 계단식으로 바뀌는 데이터를 표현하는 시각화',
    overview: `<p>일반 선 그래프처럼 점들을 잇되, 점 사이를 매끄러운 대각선이 아니라 수평-수직의 계단 모양으로 잇습니다. 값이 연속적으로 변하는 것이 아니라 특정 시점에 갑자기 바뀌는 데이터(재고 수량, 상태값 등)를 표현할 때 사용합니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 값이 유지되다가 특정 시점에 급격히 바뀌는 데이터의 실제 변화 시점을 정확하게 보여줍니다.</p>`,
    applications: `<p>재고 수량 변화, 정책 금리 변경 이력, 상태 기계(state machine)의 상태 전이 등 계단식으로 변하는 데이터에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'time-series-plot',
    category: 'unsup',
    subcategory: 'visualization',
    title: '시계열 플롯 (Time Series Plot)',
    subtitle: '시간을 x축으로 삼아 값의 시간에 따른 변화를 보여주는 선 그래프의 시계열 전용 형태',
    overview: `<p>x축을 명시적으로 시간(날짜, 시각)으로 두고 값을 선으로 이어 시간에 따른 변화를 보여주는 그래프입니다. 추세·계절성·주기성 같은 시계열 특유의 패턴을 파악하는 데 특화되어 있습니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 추세·계절성·이상 급등락 같은 시계열 고유 패턴을 직관적으로 드러내지만, 관측 기간이 길어지면 세부 변동이 뭉개져 보일 수 있습니다.</p>`,
    applications: `<p>주가·환율 추이, 웹사이트 트래픽의 요일·시간대별 패턴, 센서 데이터의 이상 탐지 사전 점검 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'violin-plot',
    category: 'unsup',
    subcategory: 'visualization',
    title: '바이올린 플롯 (Violin Plot)',
    subtitle: '박스 플롯에 데이터의 밀도 곡선(KDE)을 더해 분포의 모양까지 함께 보여주는 시각화',
    overview: `<p>박스 플롯처럼 사분위수 정보를 보여주면서, 동시에 각 값이 얼마나 자주 나타나는지를 좌우 대칭인 밀도 곡선(바이올린 모양)으로 함께 표현합니다. 박스 플롯만으로는 알 수 없는 분포가 한 덩어리인지 여러 봉우리로 나뉘는지(다봉성)까지 보여줍니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 박스 플롯보다 분포의 형태(다봉성, 치우침)를 훨씬 풍부하게 보여주지만, 처음 접하는 사람에게는 해석이 직관적이지 않을 수 있습니다.</p>`,
    applications: `<p>여러 그룹 간 분포의 모양 차이 비교, 다봉 분포 여부 확인이 중요한 실험 데이터 분석 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'hexbin-plot',
    category: 'unsup',
    subcategory: 'visualization',
    title: '육각빈 플롯 (Hexbin Plot)',
    subtitle: '점이 너무 많아 겹치는 산점도를 육각형 구간별 밀도 색상으로 대체해 표현하는 시각화',
    overview: `<p>평면을 육각형 격자로 나누고, 각 육각형 안에 몇 개의 데이터 점이 들어있는지를 색의 진하기로 표현합니다. 데이터가 매우 많아 산점도의 점들이 서로 겹쳐(overplotting) 밀도를 읽을 수 없을 때의 대안입니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 수만~수백만 개의 점이 겹치는 상황에서도 밀도가 높은 영역을 정확히 드러내지만, 개별 데이터 포인트의 정보는 사라집니다.</p>`,
    applications: `<p>대용량 로그 데이터의 두 지표 간 관계 시각화, 위치 데이터의 밀집 지역 파악 등 산점도가 과밀해지는 대용량 데이터에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'parallel-coordinates-plot',
    category: 'unsup',
    subcategory: 'visualization',
    title: '평행 좌표 플롯 (Parallel Coordinates Plot)',
    subtitle: '여러 변수의 축을 나란히 세우고 각 데이터를 축을 잇는 꺾은선으로 표현하는 다변량 시각화',
    overview: `<p>변수마다 하나씩 세로축을 나란히 배치하고, 하나의 데이터 샘플을 각 축 위의 값을 지나는 하나의 꺾은선으로 그립니다. 변수가 아무리 많아도 하나의 평면에 모두 표현할 수 있어, 산점도로는 어려운 고차원 데이터의 패턴 탐색에 사용됩니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 변수가 많은 고차원 데이터도 하나의 그림에 담을 수 있지만, 선이 많아지면 서로 겹쳐 특정 패턴(군집)을 구분하기 어려워집니다.</p>`,
    applications: `<p>다변량 데이터에서 군집별 패턴 비교, 여러 특성을 동시에 만족하는 이상치 탐색 등 변수 수가 많은 데이터의 탐색적 분석에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'embedding-scatter',
    category: 'unsup',
    subcategory: 'visualization',
    title: '차원축소 임베딩 산점도 (PCA/t-SNE/UMAP Scatter)',
    subtitle: '고차원 데이터를 PCA·t-SNE·UMAP 등으로 2~3차원에 압축한 뒤 산점도로 그리는 시각화',
    overview: `<p>변수가 수십~수천 개인 고차원 데이터를 사람이 눈으로 볼 수 있는 2~3차원으로 압축(임베딩)한 뒤, 그 결과를 산점도로 그립니다. 압축 방법으로는 선형인 PCA, 지역 구조를 보존하는 비선형인 t-SNE·UMAP이 주로 쓰이며, 방법에 따라 강조되는 구조(전역 vs 지역)가 다릅니다.</p>`,
    formula: '',
    features: `<p><strong>특징</strong> — 레이블 없이도 고차원 데이터의 군집·이상치 구조를 시각적으로 드러내지만, t-SNE/UMAP은 축의 절대적 위치나 거리가 원 공간의 거리를 그대로 반영하지 않으므로 해석에 주의가 필요합니다.</p>`,
    applications: `<p>이미지·텍스트 임베딩의 군집 구조 확인, 딥러닝 모델 은닉층 표현(representation)의 시각적 점검, 고차원 데이터의 탐색적 군집 확인 등에 널리 사용됩니다.</p>`,
    sklearnFunction: 'PCA / TSNE',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/manifold.html',
    sklearnAPIURL: `https://scikit-learn.org/stable/modules/generated/sklearn.manifold.TSNE.html`,
    sklearnExampleURL: `https://scikit-learn.org/stable/auto_examples/manifold/plot_t_sne_perplexity.html`,
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  }
];

/* ── 내비게이션 상태: 검색 중이 아니면 대분류 → 세부분류 → 알고리즘 순으로 드릴다운 ── */
let navCat = null;
let navSub = null;

function countBy(catKey, subKey) {
  return ALGORITHMS.filter(a => a.category === catKey && (subKey == null || a.subcategory === subKey)).length;
}

function renderBreadcrumb() {
  const wrap = document.getElementById('algoBreadcrumb');
  const cat = CATS.find(c => c.key === navCat);
  const sub = cat?.subs.find(s => s.key === navSub);
  let html = navCat == null
    ? `<span class="crumb current">전체</span>`
    : `<button class="crumb" data-goto="top">전체</button>`;
  if (cat) {
    html += `<span class="sep">/</span>`;
    html += navSub == null
      ? `<span class="crumb current">${cat.label}</span>`
      : `<button class="crumb" data-goto="cat">${cat.label}</button>`;
  }
  if (sub) {
    html += `<span class="sep">/</span><span class="crumb current">${sub.label}</span>`;
  }
  wrap.innerHTML = html;
}

function renderNavGrid() {
  const grid = document.getElementById('algoNavGrid');
  if (navCat == null) {
    grid.hidden = false;
    grid.innerHTML = CATS.map(c => `
      <div class="algo-nav-card cat-${c.key}" data-cat="${c.key}">
        <div class="algo-nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </div>
        <div class="algo-nav-text">
          <div class="algo-nav-label">${c.label}</div>
          <div class="algo-nav-count">${countBy(c.key)}개 알고리즘</div>
        </div>
      </div>`).join('');
    return;
  }
  const cat = CATS.find(c => c.key === navCat);
  if (navSub == null) {
    grid.hidden = false;
    grid.innerHTML = cat.subs.map(s => `
      <div class="algo-nav-card cat-${cat.key}" data-sub="${s.key}">
        <div class="algo-nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </div>
        <div class="algo-nav-text">
          <div class="algo-nav-label">${s.label}</div>
          <div class="algo-nav-count">${countBy(cat.key, s.key)}개 알고리즘</div>
        </div>
      </div>`).join('');
    return;
  }
  grid.hidden = true;
  grid.innerHTML = '';
}

/* 값이 없는 항목은 레이블까지 통째로 숨긴다 (해당없음 표시 대신 아예 생략) */
function block(label, html) {
  return html ? `<div class="algo-block"><h3>${label}</h3>${html}</div>` : '';
}
function sourceRow(label, url) {
  return url ? `<tr><th>${label}</th><td><a class="algo-source-link" href="${url}" target="_blank" rel="noopener">${url}</a></td></tr>` : '';
}
function sourceBlock(algo) {
  const rows = [
    algo.sklearnFunction ? `<tr><th>라이브러리 함수명</th><td>${algo.sklearnFunction}</td></tr>` : '',
    sourceRow('라이브러리 가이드', algo.sklearnGuideURL),
    sourceRow('라이브러리 API', algo.sklearnAPIURL),
    sourceRow('라이브러리 예제', algo.sklearnExampleURL),
    sourceRow('원논문/구현체', algo.papersWithCodeURL),
    sourceRow('Hugging Face', algo.huggingfaceURL),
    sourceRow('Space', algo.spaceURL)
  ].join('');
  if (!rows) return '';
  return `<div class="algo-block algo-sources-block"><h3>출처</h3><table class="algo-source-table">${rows}</table></div>`;
}

function renderAlgorithms() {
  const list = document.getElementById('algoList');
  const empty = document.getElementById('algoEmpty');
  const keyword = (document.getElementById('algoSearch')?.value || '').trim().toLowerCase();

  const searching = keyword.length > 0;
  const showList = searching || (navCat != null && navSub != null);

  list.hidden = !showList;
  if (!showList) { empty.hidden = true; return; }

  let filtered = ALGORITHMS;
  if (searching) {
    filtered = filtered.filter(a => a.title.toLowerCase().includes(keyword) || a.subtitle.toLowerCase().includes(keyword));
  } else {
    filtered = filtered.filter(a => a.category === navCat && a.subcategory === navSub);
  }

  list.innerHTML = '';
  if (filtered.length === 0) {
    empty.hidden = false;
    empty.querySelector('p').textContent = searching ? '검색 결과가 없습니다.' : '이 분류에는 아직 등록된 알고리즘이 없습니다.';
    return;
  }
  empty.hidden = true;

  filtered.forEach(algo => {
    const cat = CATS.find(c => c.key === algo.category);
    const sub = cat?.subs.find(s => s.key === algo.subcategory);
    const card = document.createElement('div');
    card.className = `algo-card cat-${algo.category}`;
    card.dataset.id = algo.id;
    card.innerHTML = `
      <div class="algo-card-header">
        <div class="algo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </div>
        <div class="algo-header-text">
          <span class="algo-tag">${cat ? cat.label : ''}${sub ? ' · ' + sub.label : ''}</span>
          <h2 class="algo-title">${algo.title}</h2>
          <p class="algo-subtitle">${algo.subtitle}</p>
        </div>
        <div class="algo-chevron">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
      <div class="algo-body">
        <div class="algo-body-inner">
          ${block('개요', algo.overview)}
          ${block('수식', algo.formula ? `<div class="algo-formula">${algo.formula}</div>` : '')}
          ${block('특징', algo.features)}
          ${block('적용분야', algo.applications)}
          ${sourceBlock(algo)}
        </div>
      </div>
    `;
    card.querySelector('.algo-card-header').addEventListener('click', () => {
      const isOpen = card.classList.contains('open');
      document.querySelectorAll('.algo-card').forEach(c => c.classList.remove('open'));
      if (!isOpen) card.classList.add('open');
    });
    list.appendChild(card);
  });
}

function render() {
  const searching = (document.getElementById('algoSearch')?.value || '').trim().length > 0;
  document.getElementById('algoBreadcrumb').hidden = searching;
  if (searching) {
    document.getElementById('algoNavGrid').hidden = true;
  } else {
    renderBreadcrumb();
    renderNavGrid();
  }
  renderAlgorithms();
}

document.getElementById('algoNavGrid').addEventListener('click', e => {
  const card = e.target.closest('.algo-nav-card');
  if (!card) return;
  if (card.dataset.cat) { navCat = card.dataset.cat; navSub = null; }
  else if (card.dataset.sub) { navSub = card.dataset.sub; }
  render();
});

document.getElementById('algoBreadcrumb').addEventListener('click', e => {
  const crumb = e.target.closest('.crumb[data-goto]');
  if (!crumb) return;
  if (crumb.dataset.goto === 'top') { navCat = null; navSub = null; }
  else if (crumb.dataset.goto === 'cat') { navSub = null; }
  render();
});

document.getElementById('algoSearch').addEventListener('input', render);

/* ── 딥링크: library.html?id=... 에서 넘어온 경우 해당 알고리즘 카드로 바로 진입 ── */
const deepLinkId = new URLSearchParams(location.search).get('id');
const deepLinkAlgo = deepLinkId ? ALGORITHMS.find(a => a.id === deepLinkId) : null;
if (deepLinkAlgo) { navCat = deepLinkAlgo.category; navSub = deepLinkAlgo.subcategory; }

render();

if (deepLinkAlgo) {
  const target = document.querySelector(`.algo-card[data-id="${deepLinkAlgo.id}"]`);
  if (target) {
    target.classList.add('open');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
