/* ── AI알고리즘 교과서 데이터 : [1.7] 통계 도구(밀도/공분산 추정) + [1.8] 비지도학습 평가 ── */
/* List3.md 기준. subcategory: 'density-covariance' = [1.7], 'evaluation' = [1.8] */
const CONTENT_1_7_1_8 = [

  /* ================= [1.7.1] Histogram-based Methods ================= */
  {
    id: 'adaptive-histogram',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '적응 히스토그램 (Adaptive Histogram)',
    subtitle: '데이터 밀도에 따라 구간 폭을 가변적으로 조절하는 히스토그램 밀도추정법',
    overview: `<p>고정폭 히스토그램과 달리 각 구간에 포함되는 표본 수가 비슷해지도록 구간 경계를 동적으로 설정합니다.
    데이터가 밀집한 영역은 구간을 좁게, 희박한 영역은 넓게 잡아 등간격 히스토그램에서 발생하는 과도한 평활화 또는
    잡음을 줄입니다.</p>`,
    formula: `f&#770;(x) &#8776; n&#7522; / (n&#183;h&#7522;) &nbsp;&nbsp;(구간 i의 표본수 n&#7522;는 거의 일정, 폭 h&#7522;는 지역 밀도에 반비례해 가변)`,
    features: `<p><strong>장점</strong> — 밀도가 급격히 변하거나 꼬리가 두꺼운 분포에서 고정폭 히스토그램보다 세밀하게 표현합니다.</p>
    <p><strong>단점</strong> — 구간 분할 기준(표본수 k)에 추정 결과가 민감하고, 다차원으로 확장할수록 계산 비용이 커집니다.</p>`,
    applications: `<p>소득분포·주가수익률처럼 밀도가 불균일하고 꼬리가 두꺼운 데이터의 탐색적 분석, 신용평가 모형의 변수 구간화(binning)
    등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'bayesian-blocks',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '베이지안 블록 (Bayesian Blocks)',
    subtitle: '베이즈 확률모형으로 최적의 구간 분할을 자동 탐색하는 히스토그램 기법',
    overview: `<p>Scargle이 제안한 방법으로, 데이터를 여러 개의 구간(block)으로 나누고 각 블록 내부는 상수 밀도(포아송 과정)로
    가정합니다. 블록 개수·경계를 사후확률(피트니스 함수) 기준으로 동적계획법을 통해 전역 최적으로 탐색하여 사용자가
    구간폭이나 개수를 직접 지정하지 않아도 됩니다.</p>`,
    formula: `fitness(block) = N&#7522;&#183;(ln N&#7522; − ln T&#7522;) − &#947;&#183;(블록 수에 대한 벌점),&nbsp; 전체 = &#8721; fitness(block&#7522;) 최대화`,
    features: `<p><strong>장점</strong> — 구간 폭을 사전에 정할 필요가 없고, 급격한 변화점(change point)을 자연스럽게 검출합니다.</p>
    <p><strong>단점</strong> — 동적계획법으로 인해 표본이 매우 많으면 계산량이 커지고, 벌점 계수 &#947; 선택에 결과가 민감합니다.</p>`,
    applications: `<p>천문학 시계열의 광도 변화점 탐지(원 개발 배경), 이벤트 발생률 변화 감지, 부정거래 탐지에서의 시간대별
    발생빈도 분석 등에 사용됩니다. Python astropy.stats.bayesian_blocks로 구현되어 있습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'equal-frequency-histogram',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '등빈도 히스토그램 (Equal-Frequency Histogram)',
    subtitle: '각 구간에 동일한 개수의 표본이 담기도록 경계를 정하는 히스토그램',
    overview: `<p>구간 폭을 고정하는 대신, 정렬된 데이터를 동일한 표본 수 단위로 나누어 구간 경계를 정합니다. 그 결과 데이터가
    밀집한 구간은 폭이 좁아지고 희박한 구간은 폭이 넓어져, 등간격 히스토그램보다 각 구간의 추정 분산이 均일해집니다.</p>`,
    formula: `f&#770;(x) = n&#7522; / (n&#183;h&#7522;),&nbsp;&nbsp; n&#7522; = n/k (전체 n개를 k개 구간에 균등 분배)`,
    features: `<p><strong>장점</strong> — 각 구간의 추정 분산이 비슷해 통계적으로 안정적이며, 이상치가 한 구간에 몰리지 않습니다.</p>
    <p><strong>단점</strong> — 구간 폭이 불균등해 시각적으로 밀도의 실제 모양을 왜곡해 보이게 할 수 있습니다.</p>`,
    applications: `<p>변수 구간화(binning) 기반 신용평점 모형, 의사결정나무의 분할 기준 생성, 범주형 변환이 필요한 전처리 단계
    등에서 널리 사용됩니다.</p>`,
    sklearnFunction: 'KBinsDiscretizer(strategy="quantile")',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/preprocessing.html#discretization',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.KBinsDiscretizer.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'equal-width-histogram',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '등간격 히스토그램 (Equal-Width Histogram)',
    subtitle: '전 구간을 동일한 폭으로 나누는 가장 기본적인 밀도 추정 히스토그램',
    overview: `<p>데이터의 최솟값과 최댓값 사이를 동일한 폭 h의 구간(bin) k개로 나누고, 각 구간에 속하는 표본 수를 세어
    밀도를 근사합니다. 구현이 간단하여 밀도 추정 및 탐색적 분석의 출발점으로 가장 널리 쓰입니다.</p>`,
    formula: `f&#770;(x) = n&#7522; / (n&#183;h),&nbsp;&nbsp; h = (max − min) / k &nbsp;(Sturges: k = 1+log&#8322;n, Freedman-Diaconis: h = 2&#183;IQR&#183;n&#8315;&#185;&#8260;&#179;)`,
    features: `<p><strong>장점</strong> — 계산이 매우 단순하고 해석이 직관적이며, 구현·시각화가 쉽습니다.</p>
    <p><strong>단점</strong> — 구간 경계 위치와 폭 h에 추정 결과가 크게 좌우되고, 불연속적(계단형) 형태로 실제 밀도의
    매끄러움을 반영하지 못합니다.</p>`,
    applications: `<p>데이터 분포의 1차 탐색(EDA), 변수 전처리 시 구간화, 다른 밀도추정 기법(KDE 등)의 대역폭 초기값 설정 기준으로
    사용됩니다.</p>`,
    sklearnFunction: 'numpy.histogram / KBinsDiscretizer(strategy="uniform")',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/preprocessing.html#discretization',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.KBinsDiscretizer.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'multidimensional-histogram',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '다차원 히스토그램 (Multi-dimensional Histogram)',
    subtitle: '2차원 이상의 특성 공간을 격자(grid)로 나누어 결합밀도를 추정하는 방법',
    overview: `<p>1차원 히스토그램을 각 차원에 대해 독립적으로 적용해 초격자(hyper-grid)를 구성하고, 각 격자 셀에 속하는
    표본 수로 결합확률밀도를 근사합니다. 차원이 늘어날수록 셀의 개수가 지수적으로 증가하는 차원의 저주 문제를 겪습니다.</p>`,
    formula: `f&#770;(x&#8321;,...,x&#7495;) = n&#7522;&#8321;...&#7522;&#7495; / (n&#183;V),&nbsp;&nbsp; V = h&#8321;&#183;h&#8322;&#183;...&#183;h&#7495; (셀 부피)`,
    features: `<p><strong>장점</strong> — 개념이 1차원 히스토그램의 자연스러운 확장이며 구현이 단순합니다.</p>
    <p><strong>단점</strong> — 차원이 커질수록 셀당 표본 수가 급격히 희박해지는 차원의 저주가 발생해 3~4차원을 넘으면
    실용성이 떨어집니다.</p>`,
    applications: `<p>저차원(2~3차원) 산점도의 밀도 히트맵 시각화, 이미지 색상 공간의 히스토그램 기반 분석 등 차원이 낮은
    다변량 데이터 탐색에 사용됩니다.</p>`,
    sklearnFunction: 'numpy.histogramdd',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

  /* ================= [1.7.2] Kernel Density Estimation ================= */
  {
    id: 'adaptive-kde',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '적응적 커널 밀도 추정 (Adaptive KDE)',
    subtitle: '지역 밀도에 따라 커널의 대역폭을 표본별로 다르게 적용하는 KDE',
    overview: `<p>표준 KDE는 모든 표본에 동일한 대역폭 h를 사용하지만, 적응적 KDE는 각 표본 x&#7522; 주변의 국소 밀도 추정치에
    따라 대역폭 h&#7522;를 개별적으로 조정합니다. 데이터가 밀집한 영역에서는 대역폭을 좁혀 세부구조를 살리고, 희박한
    영역(꼬리)에서는 넓혀 분산을 줄입니다.</p>`,
    formula: `f&#770;(x) = (1/n) &#8721;&#7522; (1/h&#7522;&#7480;) K((x−x&#7522;)/h&#7522;),&nbsp;&nbsp; h&#7522; = h&#8320;&#183;(f&#770;&#8320;(x&#7522;)/g)&#8315;&#945; &nbsp;(파일럿 밀도 f&#770;&#8320; 기반)`,
    features: `<p><strong>장점</strong> — 다봉분포·꼬리가 두꺼운 분포에서 고정 대역폭 KDE보다 편향을 줄입니다.</p>
    <p><strong>단점</strong> — 파일럿 밀도 추정이 추가로 필요해 계산 비용이 크고, 대역폭 지수 &#945; 등 하이퍼파라미터가
    늘어납니다.</p>`,
    applications: `<p>다봉·비대칭 분포(소득, 강수량 등)의 정밀 밀도 추정, 이상치가 섞인 데이터의 강건한 밀도 추정 등에
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
    id: 'biweight-kernel',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '바이웨이트(4차) 커널 (Biweight / Quartic Kernel)',
    subtitle: '경계에서 매끄럽게 0에 수렴하는 4차 다항식 형태의 KDE 커널',
    overview: `<p>|u|&lt;1 범위에서 (1−u&#178;)&#178; 형태를 갖는 다항식 커널로, 에파네치니코프 커널보다 경계에서 더 매끄럽게
    0으로 접근합니다. 유한한 지지구간을 가져 계산 효율이 좋고, 로컬회귀(LOESS)에서도 널리 쓰입니다.</p>`,
    formula: `K(u) = (15/16)(1 − u&#178;)&#178;,&nbsp; |u| &#8804; 1`,
    features: `<p><strong>장점</strong> — 지지구간이 유한해 계산이 빠르고, 경계에서 1차 미분까지 연속이라 매끄러운 추정 결과를
    줍니다.</p>
    <p><strong>단점</strong> — 에파네치니코프 커널 대비 점근효율이 근소하게 낮습니다.</p>`,
    applications: `<p>LOESS/LOWESS 국소회귀의 가중함수, KDE 기반 탐색적 분석에서 가우시안보다 빠른 대안으로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'cosine-kernel',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '코사인 커널 (Cosine Kernel)',
    subtitle: '코사인 함수 형태로 부드럽게 감쇠하는 유한 지지구간 KDE 커널',
    overview: `<p>|u|&lt;1 구간에서 코사인 함수의 절반 주기를 사용해 부드럽게 0으로 수렴하는 커널입니다. scikit-learn의
    KernelDensity가 지원하는 6종 커널 중 하나로, 가우시안과 유사한 매끄러움을 가지면서도 유한한 지지구간을 갖습니다.</p>`,
    formula: `K(u) = (&#960;/4)&#183;cos(&#960;u/2),&nbsp; |u| &#8804; 1`,
    features: `<p><strong>장점</strong> — 유한 지지구간으로 계산이 빠르면서도 경계에서 매끄럽게 감쇠합니다.</p>
    <p><strong>단점</strong> — 실무에서는 가우시안·에파네치니코프만큼 자주 쓰이지 않아 참고 사례가 적습니다.</p>`,
    applications: `<p>KernelDensity의 커널 옵션 비교실험, 계산 효율이 중요한 대용량 KDE 등에 사용됩니다.</p>`,
    sklearnFunction: "KernelDensity(kernel='cosine')",
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/density.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KernelDensity.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/neighbors/plot_kde_1d.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'kde-cross-validation',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '교차검증 대역폭 선택 (Cross-Validation Bandwidth Selection)',
    subtitle: '교차검증으로 KDE의 최적 대역폭 h를 데이터 기반으로 자동 탐색하는 방법',
    overview: `<p>여러 후보 대역폭 h에 대해 교차검증 로그우도(또는 최소제곱 교차검증 점수)를 계산하고, 점수가 가장 높은
    h를 선택합니다. Scott/Silverman 같은 경험적 공식과 달리 데이터의 실제 형태(다봉성 등)를 반영할 수 있습니다.</p>`,
    formula: `h&#770; = argmax&#8347; (1/K) &#8721;&#8342;&#8331;&#185;&#7480;&#7475; &#8721;&#7522;&#8712;fold&#8342; ln f&#770;&#8315;&#8342;(x&#7522;; h) &nbsp;(K-겹 교차검증 로그우도 최대화)`,
    features: `<p><strong>장점</strong> — 데이터 고유의 분포 형태(다봉, 비대칭)를 반영해 경험적 규칙보다 정확한 대역폭을
    찾습니다.</p>
    <p><strong>단점</strong> — 후보 대역폭 격자 전체를 반복 평가해야 하므로 계산 비용이 크고, 표본이 작으면 분산이 큽니다.</p>`,
    applications: `<p>GridSearchCV와 KernelDensity를 결합한 자동 대역폭 튜닝, 표본 수가 충분하고 계산 자원이 허용되는
    정밀 밀도 추정 상황에서 사용됩니다.</p>`,
    sklearnFunction: 'GridSearchCV + KernelDensity',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/density.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GridSearchCV.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/neighbors/plot_species_kde.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'epanechnikov-kernel',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '에파네치니코프 커널 (Epanechnikov Kernel)',
    subtitle: '평균제곱오차 관점에서 점근적으로 최적인 포물선 형태의 KDE 커널',
    overview: `<p>|u|&lt;1 범위에서 포물선(1−u&#178;) 형태를 가지며, 점근적 평균적분제곱오차(AMISE)를 최소화하는 최적
    커널로 알려져 있습니다. 유한한 지지구간을 가져 계산이 빠릅니다.</p>`,
    formula: `K(u) = (3/4)(1 − u&#178;),&nbsp; |u| &#8804; 1`,
    features: `<p><strong>장점</strong> — 이론적으로 AMISE를 최소화하는 최적 커널이며, 계산 효율도 좋습니다.</p>
    <p><strong>단점</strong> — 경계(|u|=1)에서 미분이 불연속이라 매끄러움이 가우시안보다 다소 떨어집니다.</p>`,
    applications: `<p>KDE의 이론적 성능 비교 기준(효율 100%로 정규화되는 기준 커널), 계산 효율이 중요한 대용량 밀도추정에
    사용됩니다.</p>`,
    sklearnFunction: "KernelDensity(kernel='epanechnikov')",
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/density.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KernelDensity.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/neighbors/plot_kde_1d.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'gaussian-kernel',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '가우시안(정규) 커널 (Gaussian / Normal Kernel)',
    subtitle: '무한 지지구간을 갖는 정규분포 형태로 가장 널리 쓰이는 KDE 커널',
    overview: `<p>표준정규분포 확률밀도함수를 커널로 사용하며, 무한한 지지구간과 무한 계 미분가능성 덕분에 가장 매끄러운
    밀도 추정 결과를 줍니다. 실무 KDE의 기본(default) 커널로 가장 널리 사용됩니다.</p>`,
    formula: `K(u) = (1/&#8730;(2&#960;))&#183;exp(−u&#178;/2)`,
    features: `<p><strong>장점</strong> — 무한히 매끄럽고 다차원으로 확장이 쉬우며, 대부분의 소프트웨어에서 기본값으로
    제공됩니다.</p>
    <p><strong>단점</strong> — 지지구간이 무한해 유한 지지구간 커널보다 계산량이 다소 많고, 꼬리가 두꺼운 분포에서
    편향이 발생할 수 있습니다.</p>`,
    applications: `<p>일반적인 확률밀도 추정, 이상치 탐지의 밀도기반 점수 산출, GMM 대안으로서의 비모수 밀도 시각화 등
    거의 모든 KDE 응용에 기본으로 사용됩니다.</p>`,
    sklearnFunction: "KernelDensity(kernel='gaussian')",
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/density.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KernelDensity.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/neighbors/plot_kde_1d.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'multivariate-kde',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '다변량 커널 밀도 추정 (Multivariate KDE)',
    subtitle: '2차원 이상의 결합확률밀도를 커널 함수로 비모수 추정하는 방법',
    overview: `<p>각 차원마다(또는 공분산 행렬 H를 통해 결합적으로) 커널을 적용해 다변량 결합밀도를 추정합니다.
    대역폭이 각 차원별 스칼라가 아닌 대역폭 행렬 H로 확장되며, 변수 간 상관관계를 반영할 수 있습니다.</p>`,
    formula: `f&#770;(x) = (1/n) &#8721;&#7522; |H|&#8315;&#185;&#8260;&#178; K(H&#8315;&#185;&#8260;&#178;(x−x&#7522;)) &nbsp;(x&#8712;&#8477;&#7480;, H는 d&#215;d 대역폭 행렬)`,
    features: `<p><strong>장점</strong> — 변수 간 결합분포·상관구조를 그대로 반영해 다변량 이상치·군집 탐색에 유용합니다.</p>
    <p><strong>단점</strong> — 차원이 커질수록 필요한 표본 수가 지수적으로 늘어나는 차원의 저주를 피할 수 없습니다.</p>`,
    applications: `<p>다변량 이상치 탐지(밀도가 낮은 영역을 이상치로 판정), GMM의 비모수 대안, 2~3차원 데이터의 등고선
    시각화 등에 사용됩니다.</p>`,
    sklearnFunction: 'KernelDensity',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/density.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KernelDensity.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/neighbors/plot_species_kde.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'plug-in-bandwidth',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '플러그인 방법 (Plug-in Bandwidth Method)',
    subtitle: '점근적 최적 대역폭 공식에 파일럿 추정값을 대입해 대역폭을 정하는 기법',
    overview: `<p>AMISE(점근적 평균적분제곱오차)를 최소화하는 이론적 대역폭 공식에는 실제 밀도의 2차 도함수 관련 항이
    포함되는데, 이를 직접 알 수 없으므로 별도의 파일럿(pilot) 밀도 추정값을 "대입(plug-in)"하여 근사합니다.
    Sheather-Jones 방법이 대표적입니다.</p>`,
    formula: `h&#770;&#8342;&#8347;&#7480;&#8319; = [ R(K) / (&#956;&#8322;(K)&#178; &#8747; f''(x)&#178;dx &#183; n) ]&#185;&#8260;&#8309; &nbsp;(&#8747;f''&#178;dx는 파일럿 추정치로 대체)`,
    features: `<p><strong>장점</strong> — Silverman/Scott 같은 정규분포 가정 규칙보다 실제 데이터 형태를 반영해 정확도가
    높습니다.</p>
    <p><strong>단점</strong> — 파일럿 추정 단계가 추가되어 구현이 복잡하고 계산량이 늘어납니다.</p>`,
    applications: `<p>Sheather-Jones 대역폭 선택(R의 density(bw="SJ")), 정밀한 단변량 KDE가 필요한 통계 분석에
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
    id: 'scotts-rule',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: "스콧의 법칙 (Scott's Rule)",
    subtitle: '표본 크기와 표준편차만으로 대역폭을 빠르게 정하는 경험적 공식',
    overview: `<p>데이터가 정규분포에 가깝다는 가정 아래 AMISE를 최소화하는 대역폭을 표본 수 n과 표준편차 &#963;만으로
    근사한 공식입니다. 계산이 매우 간단해 KDE·히스토그램의 기본(default) 대역폭 규칙으로 널리 채택됩니다.</p>`,
    formula: `h = 3.49&#183;&#963;&#183;n&#8315;&#185;&#8260;&#179; &nbsp;(히스토그램),&nbsp;&nbsp; h = &#963;&#183;n&#8315;&#185;&#8260;&#8309; &nbsp;(단변량 가우시안 KDE)`,
    features: `<p><strong>장점</strong> — 계산이 즉시 가능하고 대부분의 통계 소프트웨어(scipy, R)의 기본값으로 채택될 만큼
    실무적으로 검증되어 있습니다.</p>
    <p><strong>단점</strong> — 정규분포를 가정하므로 다봉분포·비대칭 분포에서는 과도하게 매끄러운(과소적합) 추정을
    낳을 수 있습니다.</p>`,
    applications: `<p>scipy.stats.gaussian_kde의 기본 대역폭 계산, 빠른 탐색적 밀도 시각화 등 정밀도보다 속도가
    중요한 상황에서 사용됩니다.</p>`,
    sklearnFunction: 'scipy.stats.gaussian_kde(bw_method="scott")',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'silvermans-rule',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: "실버만의 경험 법칙 (Silverman's Rule of Thumb)",
    subtitle: '표준편차와 사분위범위를 함께 사용해 대역폭을 정하는 경험적 공식',
    overview: `<p>Scott의 법칙과 유사하게 정규분포를 가정하지만, 표준편차 &#963;와 사분위범위(IQR)의 최솟값을 사용해
    이상치에 조금 더 강건하도록 보정한 공식입니다. 1986년 Silverman의 저서에서 제안되어 KDE의 가장 널리 알려진
    기본 대역폭 규칙입니다.</p>`,
    formula: `h = 0.9&#183;min(&#963;, IQR/1.34)&#183;n&#8315;&#185;&#8260;&#8309;`,
    features: `<p><strong>장점</strong> — 계산이 간단하고 이상치에 Scott 법칙보다 조금 더 강건합니다.</p>
    <p><strong>단점</strong> — 여전히 단봉 정규분포를 암묵적으로 가정하므로 다봉분포에서는 과대평활화(over-smoothing)
    경향이 있습니다.</p>`,
    applications: `<p>KDE 기본 대역폭 자동 설정(scipy, seaborn, R density() 함수 등), 빠른 초기 밀도 추정이 필요한
    실무 분석에 널리 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'triangular-kernel',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '삼각 커널 (Triangular Kernel)',
    subtitle: '중심에서 경계로 선형으로 감소하는 가장 단순한 유한 지지구간 커널',
    overview: `<p>|u|&lt;1 구간에서 (1−|u|) 형태의 삼각형 모양을 가지며, 계산이 매우 단순한 유한 지지구간 커널입니다.
    경계에서 값이 0으로 선형 수렴하지만 미분은 불연속입니다.</p>`,
    formula: `K(u) = 1 − |u|,&nbsp; |u| &#8804; 1`,
    features: `<p><strong>장점</strong> — 계산이 가장 단순하고 직관적입니다.</p>
    <p><strong>단점</strong> — 경계에서 미분이 불연속(꼭짓점)이라 추정 곡선이 완전히 매끄럽지 않습니다.</p>`,
    applications: `<p>계산 자원이 제한적인 환경의 근사 밀도추정, 교육용 KDE 예제 등에서 사용됩니다.</p>`,
    sklearnFunction: "KernelDensity(kernel='linear')",
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/density.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KernelDensity.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'triweight-kernel',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '트라이웨이트 커널 (Triweight Kernel)',
    subtitle: '바이웨이트보다 더 매끄러운 6차 다항식 형태의 유한 지지구간 커널',
    overview: `<p>|u|&lt;1 구간에서 (1−u&#178;)&#179;의 형태를 가져 바이웨이트(4차) 커널보다 경계에서 더 여러 차수의
    미분까지 매끄럽게 0에 수렴합니다. 지역회귀와 KDE에서 매끄러움이 중요할 때 선택됩니다.</p>`,
    formula: `K(u) = (35/32)(1 − u&#178;)&#179;,&nbsp; |u| &#8804; 1`,
    features: `<p><strong>장점</strong> — 유한 지지구간이면서도 경계 매끄러움이 바이웨이트·에파네치니코프보다 우수합니다.</p>
    <p><strong>단점</strong> — 점근효율은 에파네치니코프보다 근소하게 낮고, 실무 사용 빈도가 상대적으로 낮습니다.</p>`,
    applications: `<p>지역 다항회귀(local polynomial regression)의 가중함수, 매끄러움이 중요한 정밀 KDE 분석 등에
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
    id: 'univariate-kde',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '일변량 커널 밀도 추정 (Univariate KDE)',
    subtitle: '단일 변수의 확률밀도를 커널 함수의 합으로 비모수 추정하는 가장 기본적인 KDE',
    overview: `<p>각 관측값 위에 커널 함수를 놓고 모두 더한 뒤 평균을 취해 매끄러운 밀도곡선을 얻는 가장 기본적인
    비모수 밀도추정 방법입니다. 히스토그램과 달리 구간 경계에 의존하지 않고 연속적인 곡선을 제공합니다.</p>`,
    formula: `f&#770;(x) = (1/nh) &#8721;&#7522;&#8348;&#8321;&#7480; K((x−x&#7522;)/h)`,
    features: `<p><strong>장점</strong> — 매끄럽고 연속적인 밀도곡선을 제공하며 히스토그램의 구간 경계 의존성이 없습니다.</p>
    <p><strong>단점</strong> — 대역폭 h 선택에 결과가 크게 좌우되고, 다봉분포에서 봉우리 개수를 놓치거나 과대추정할
    수 있습니다.</p>`,
    applications: `<p>단일 변수의 분포 시각화, 통계적 가설검정 전 데이터 형태 파악, 확률밀도 기반 이상치 점수 계산 등
    가장 기본적인 밀도추정 상황에 사용됩니다.</p>`,
    sklearnFunction: 'KernelDensity',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/density.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KernelDensity.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/neighbors/plot_kde_1d.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'variable-bandwidth-kde',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '가변 대역폭 커널 밀도 추정 (Variable Bandwidth KDE)',
    subtitle: '표본 위치에 따라 서로 다른 대역폭을 적용하는 KDE의 총칭',
    overview: `<p>적응적 KDE와 개념적으로 맞닿아 있으며, 고정 대역폭 대신 각 평가점 혹은 각 표본에 서로 다른 대역폭을
    부여하는 방법들을 통칭합니다. k-최근접 이웃 거리로 대역폭을 정하는 방식(발룬 추정, balloon estimator)이 대표적
    구현 형태입니다.</p>`,
    formula: `f&#770;(x) = (1/n) &#8721;&#7522; (1/h(x)&#7480;) K((x−x&#7522;)/h(x)) &nbsp;(h(x): 평가점 x 주변 k번째 최근접 이웃 거리에 비례)`,
    features: `<p><strong>장점</strong> — 데이터가 희박한 꼬리 영역에서는 대역폭을 넓혀 분산을 줄이고, 밀집 영역에서는
    좁혀 세부구조를 보존합니다.</p>
    <p><strong>단점</strong> — 표준 KDE보다 이론적 성질(수렴 속도 등) 분석이 복잡하고 구현체가 상대적으로 적습니다.</p>`,
    applications: `<p>k-최근접 이웃 밀도추정과의 혼합 기법, 꼬리가 두꺼운 금융 수익률 분포의 정밀 추정 등에
    사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

  /* ================= [1.7.3] Parametric Methods ================= */
  {
    id: 'dirichlet-process-mixture-model',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '디리클레 프로세스 혼합 모델 (Dirichlet Process Mixture Model)',
    subtitle: '혼합성분의 개수를 사전에 정하지 않고 데이터로부터 무한히 확장 가능하게 추정하는 베이지안 혼합모형',
    overview: `<p>가우시안 혼합모형(GMM)의 성분 개수 K를 고정하는 대신, 디리클레 프로세스를 사전분포로 사용해 이론상
    무한개의 성분 중 데이터가 실제로 필요로 하는 개수만 "활성화"되도록 하는 비모수 베이지안 밀도추정 모형입니다.
    스틱-브레이킹(stick-breaking) 구성으로 각 성분의 혼합가중치를 생성합니다.</p>`,
    formula: `G ~ DP(&#945;, G&#8320;),&nbsp;&nbsp; &#960;&#7526; = V&#7526; &#8719;&#8342;&#8339;&#8320;&#8320;&#7527;&#7526;&#8315;&#185;&#8322; (1−V&#8342;),&nbsp; V&#7526; ~ Beta(1, &#945;)`,
    features: `<p><strong>장점</strong> — 군집(성분) 개수를 사전에 지정할 필요가 없고, 데이터가 늘어나면 필요한 만큼
    성분이 자동으로 늘어납니다.</p>
    <p><strong>단점</strong> — 변분추론/MCMC 등 근사추론이 필요해 계산이 무겁고, 집중 파라미터 &#945;에 유효 성분
    개수가 민감합니다.</p>`,
    applications: `<p>군집 개수를 모르는 상태의 고객 세분화, 화자(speaker) 수를 모르는 음성 분리, 토픽 개수를
    사전에 정하지 않는 텍스트 토픽모델링 등에 사용됩니다.</p>`,
    sklearnFunction: "BayesianGaussianMixture(weight_concentration_prior_type='dirichlet_process')",
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/mixture.html#variational-bayesian-gaussian-mixture',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.mixture.BayesianGaussianMixture.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/mixture/plot_concentration_prior.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'method-of-moments',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '적률법 (Method of Moments)',
    subtitle: '표본의 적률(평균·분산 등)을 모집단 적률과 일치시켜 파라미터를 추정하는 고전적 방법',
    overview: `<p>가정한 분포족의 이론적 적률(1차: 평균, 2차: 분산, 이후 고차 적률)을 표본에서 계산한 적률과 같다고
    놓고 연립방정식을 풀어 파라미터를 구하는 가장 오래된 파라메트릭 추정법입니다. MLE보다 계산이 단순하지만
    효율성은 대체로 낮습니다.</p>`,
    formula: `m&#8342; = (1/n) &#8721;&#7522; x&#7522;&#7502; = &#956;&#8342;(&#952;) &nbsp;(k=1,2,...,p개의 방정식을 풀어 파라미터 &#952; 추정)`,
    features: `<p><strong>장점</strong> — 계산이 간단하고 닫힌 형태(closed-form) 해가 존재하는 경우가 많아 MLE의
    초기값으로 자주 활용됩니다.</p>
    <p><strong>단점</strong> — 일반적으로 MLE보다 추정 효율(분산)이 낮고, 고차 적률을 사용할 경우 분산이 더 커집니다.</p>`,
    applications: `<p>감마·베타 분포 등 파라미터 초기값 설정, EM 알고리즘의 초기화, 간단한 통계 모형의 빠른
    파라미터 근사 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'mle-density-estimation',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '최대우도 추정 (MLE, Maximum Likelihood Estimation)',
    subtitle: '관측 데이터의 우도를 최대화하는 파라미터를 찾는 파라메트릭 밀도추정의 표준 방법',
    overview: `<p>가정한 분포족 f(x;&#952;)에서 관측된 표본이 나올 우도(likelihood)를 파라미터 &#952;의 함수로 보고,
    이를 최대화하는 &#952;&#770;를 찾습니다. 정규분포·포아송분포 등 대부분의 파라메트릭 밀도추정의 표준적 접근법이며
    GMM의 EM 알고리즘도 MLE의 반복적 근사 형태입니다.</p>`,
    formula: `&#952;&#770;&#7514;&#7519;&#7480; = argmax&#952; L(&#952;) = argmax&#952; &#8719;&#7522; f(x&#7522;; &#952;) = argmax&#952; &#8721;&#7522; ln f(x&#7522;; &#952;)`,
    features: `<p><strong>장점</strong> — 표본이 충분히 크면 일치성·점근효율성·점근정규성 등 우수한 통계적 성질을
    보장합니다.</p>
    <p><strong>단점</strong> — 가정한 분포가 실제와 다르면(모형오설정) 편향이 발생하고, 일부 모형에서는 닫힌 해가
    없어 수치최적화가 필요합니다.</p>`,
    applications: `<p>정규분포·지수분포 등 파라미터 추정, GMM/HMM의 EM 학습, 로지스틱 회귀 등 대부분의 통계·머신러닝
    모형 학습의 근간 원리로 사용됩니다.</p>`,
    sklearnFunction: 'GaussianMixture / scipy.stats.*.fit',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/mixture.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.mixture.GaussianMixture.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/mixture/plot_gmm_pdf.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'variational-inference-gmm',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: 'GMM을 위한 변분 추론 (Variational Inference for GMM)',
    subtitle: 'EM의 점추정 대신 파라미터의 사후분포 전체를 근사 추정하는 베이지안 GMM 학습법',
    overview: `<p>표준 GMM-EM이 파라미터의 점추정치만 구하는 것과 달리, 각 파라미터에 사전분포를 두고 실제 사후분포를
    다루기 쉬운 근사분포 q로 대체한 뒤 두 분포 간 KL발산을 최소화(=ELBO 최대화)하는 방식으로 학습합니다. 성분
    가중치에 자동으로 축소압력이 걸려 불필요한 성분이 자연스럽게 소멸됩니다.</p>`,
    formula: `ELBO(q) = E&#7523;[ln p(X,Z,&#952;)] − E&#7523;[ln q(Z,&#952;)] &#8804; ln p(X) &nbsp;(ELBO 최대화 &#8801; KL(q||p) 최소화)`,
    features: `<p><strong>장점</strong> — 파라미터의 불확실성까지 정량화하고, 과대적합된 불필요한 성분의 가중치를
    자동으로 0에 가깝게 축소합니다.</p>
    <p><strong>단점</strong> — 근사분포 q의 형태(평균장 가정 등)에 따라 실제 사후분포와 괴리가 생길 수 있고 EM보다
    구현·계산이 복잡합니다.</p>`,
    applications: `<p>군집 개수를 자동으로 정해야 하는 베이지안 군집화, 불확실성 정량화가 필요한 밀도추정 등에
    사용됩니다.</p>`,
    sklearnFunction: 'BayesianGaussianMixture',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/mixture.html#variational-bayesian-gaussian-mixture',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.mixture.BayesianGaussianMixture.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/mixture/plot_concentration_prior.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

  /* ================= [1.7.4] Non-parametric Methods ================= */
  {
    id: 'knn-density-estimation',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: 'k-최근접 이웃 밀도 추정 (k-NN Density Estimation)',
    subtitle: 'k번째 최근접 이웃까지의 거리로 국소 밀도를 역산하는 비모수 밀도추정',
    overview: `<p>KDE가 고정된 부피(대역폭)에서 표본 수를 세는 것과 반대로, 평가점 주변에서 정확히 k개의 이웃을
    포함하는 데 필요한 부피(반경)를 구해 밀도를 역산합니다. 데이터가 희박한 곳에서는 반경이 커지고 밀집한 곳에서는
    반경이 작아져 자연스러운 적응적 특성을 갖습니다.</p>`,
    formula: `f&#770;(x) = k / (n&#183;V&#8342;(x)) &nbsp;(V&#8342;(x): x에서 k번째 최근접 이웃까지의 거리를 반경으로 하는 구의 부피)`,
    features: `<p><strong>장점</strong> — 대역폭을 직접 정할 필요 없이 이웃 수 k 하나로 평활 정도를 조절하며, 밀도에
    자동으로 적응합니다.</p>
    <p><strong>단점</strong> — 추정된 밀도함수가 적분해도 1이 되지 않을 수 있고(정규화 문제), 꼬리에서 두꺼운 꼬리
    형태(fat tail)를 보일 수 있습니다.</p>`,
    applications: `<p>LOF(Local Outlier Factor) 등 밀도기반 이상치 탐지의 핵심 구성요소, 차원이 다소 높은 데이터의
    비모수 밀도추정에 사용됩니다.</p>`,
    sklearnFunction: 'NearestNeighbors',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/neighbors.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.NearestNeighbors.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'local-likelihood-density-estimation',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '지역 우도 밀도 추정 (Local Likelihood Density Estimation)',
    subtitle: '평가점 주변의 국소 가중우도를 최대화해 밀도를 다항식으로 근사하는 방법',
    overview: `<p>전역적으로 하나의 파라메트릭 형태를 가정하는 대신, 각 평가점 근방에서 커널로 가중치를 준 지역
    우도함수를 국소 다항식(보통 로그 스케일)으로 최대화하여 밀도를 추정합니다. KDE와 파라메트릭 MLE의 중간적
    성격을 갖습니다.</p>`,
    formula: `&#8467;&#7522;(&#952;) = &#8721;&#7522; K&#8462;(x&#7522;−x) log f(x&#7522;;&#952;) − n &#8747; K&#8462;(u−x) f(u;&#952;) du &nbsp;(x 주변의 지역 로그우도 최대화)`,
    features: `<p><strong>장점</strong> — KDE보다 경계 편향(boundary bias)이 작고, 꼬리에서 음수가 되지 않는 자연스러운
    추정이 가능합니다.</p>
    <p><strong>단점</strong> — 각 평가점마다 지역 최적화를 반복해야 해 계산 비용이 KDE보다 큽니다.</p>`,
    applications: `<p>KDE의 경계 편향 문제가 중요한 응용, 로그밀도의 국소적 형태 분석 등 통계학 연구 목적으로
    주로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'orthogonal-series-density-estimation',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '직교 급수 밀도 추정 (Orthogonal Series Density Estimation)',
    subtitle: '직교 기저함수(푸리에, 르장드르 등)의 유한 합으로 밀도를 근사하는 방법',
    overview: `<p>밀도함수를 완비 직교기저(푸리에 급수, 르장드르 다항식, 에르미트 다항식 등)로 전개한 뒤, 표본으로부터
    각 기저의 계수를 추정하고 유한개 항만 남겨 잘라내는(truncation) 방식으로 밀도를 근사합니다. KDE와 달리
    대역폭 대신 급수 항의 개수가 평활 정도를 결정합니다.</p>`,
    formula: `f&#770;(x) = &#8721;&#8342;&#8339;&#8320;&#7502; c&#770;&#8342;&#966;&#8342;(x),&nbsp;&nbsp; c&#770;&#8342; = (1/n) &#8721;&#7522; &#966;&#8342;(x&#7522;) &nbsp;(&#966;&#8342;: 직교기저, J: 절단 차수)`,
    features: `<p><strong>장점</strong> — 주기적이거나 특정 구간에 국한된 데이터에서 매우 매끄럽고 해석 가능한 근사를
    제공합니다.</p>
    <p><strong>단점</strong> — 절단 차수 J 선택이 대역폭 선택만큼 까다롭고, 기저함수 선택이 데이터 형태에 따라
    적절히 이루어져야 합니다.</p>`,
    applications: `<p>주기성이 있는 신호(각도, 시간)의 밀도추정, 신호처리·스펙트럼 분석과 결합된 확률밀도 추정
    연구에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

  /* ================= [1.7.5] Advanced Density Estimation ================= */
  {
    id: 'copula-density-estimation',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '코퓰라 기반 밀도 추정 (Copula-based Density Estimation)',
    subtitle: '개별 변수의 주변분포와 변수 간 의존구조(코퓰라)를 분리해서 모델링하는 방법',
    overview: `<p>Sklar의 정리에 따라 임의의 다변량 결합분포는 각 변수의 주변분포(marginal)와 이들 간의 의존구조를
    나타내는 코퓰라 함수로 분해될 수 있습니다. 각 변수의 주변분포를 개별적으로 적합한 뒤, 균등분포로 변환한 값들에
    가우시안·클레이턴·검벨 코퓰라 등을 적합해 전체 결합밀도를 구성합니다.</p>`,
    formula: `f(x&#8321;,...,x&#7480;) = c(F&#8321;(x&#8321;),...,F&#7480;(x&#7480;)) &#183; &#8719;&#7522; f&#7522;(x&#7522;) &nbsp;(c: 코퓰라 밀도, F&#7522;/f&#7522;: 각 변수의 주변 CDF/PDF)`,
    features: `<p><strong>장점</strong> — 주변분포와 의존구조를 분리해 모델링하므로 서로 다른 형태의 주변분포를 조합할
    수 있고, 꼬리 의존성(tail dependence)을 명시적으로 표현할 수 있습니다.</p>
    <p><strong>단점</strong> — 코퓰라 계열(가우시안/클레이턴/검벨 등) 선택에 결과가 민감하고, 고차원에서는 코퓰라
    파라미터 추정이 어려워집니다.</p>`,
    applications: `<p>금융 포트폴리오의 자산 간 꼬리 위험(tail risk) 모델링, 보험 손해액의 의존구조 분석, 다변량
    리스크 관리 등에 널리 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'maf-masked-autoregressive-flow',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '마스크 자기회귀 플로우 (MAF, Masked Autoregressive Flow)',
    subtitle: '자기회귀 조건부분포의 연쇄로 유연한 결합밀도를 모델링하는 정규화 플로우 기법',
    overview: `<p>결합밀도를 연쇄법칙에 따라 조건부분포의 곱 &#8719;&#7522; p(x&#7522;|x&#8321;:&#7522;&#8315;&#185;)으로 분해하고, 각 조건부분포의
    평균·분산을 마스크된 자기회귀 신경망(MADE)으로 출력하여 정규분포에서 데이터 공간으로의 가역 변환을 구성합니다.
    IAF(Inverse Autoregressive Flow)와 정확히 반대 방향의 계산 트레이드오프를 갖습니다.</p>`,
    formula: `x&#7522; = &#956;&#7522;(x&#8321;:&#7522;&#8315;&#185;) + &#963;&#7522;(x&#8321;:&#7522;&#8315;&#185;)&#183;z&#7522;,&nbsp;&nbsp; log p(x) = log p(z) − &#8721;&#7522; log &#963;&#7522;(x&#8321;:&#7522;&#8315;&#185;)`,
    features: `<p><strong>장점</strong> — 밀도(로그우도) 평가가 한 번의 순전파로 가능해 학습이 빠릅니다.</p>
    <p><strong>단점</strong> — 샘플링은 차원 수만큼 순차적으로 반복해야 하므로 느립니다.</p>`,
    applications: `<p>고차원 밀도추정 및 이상치 탐지, 변분추론의 유연한 사후분포 근사, 다른 생성모델의 프라이어
    개선 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/method/maf'
  },
  {
    id: 'neural-density-estimation',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '신경망 밀도 추정 (Neural Density Estimation)',
    subtitle: '심층신경망으로 임의의 복잡한 확률밀도함수를 근사하는 방법들의 총칭',
    overview: `<p>정규화 플로우(Normalizing Flows), 자기회귀 신경망(PixelCNN, MADE), 확산모델(Diffusion Model) 등
    신경망을 이용해 명시적 또는 암묵적으로 확률밀도를 학습하는 모든 접근법을 포괄하는 상위 개념입니다. 고전적
    파라메트릭/비모수 방법보다 고차원·복잡한 데이터(이미지, 텍스트)의 밀도를 다룰 수 있습니다.</p>`,
    formula: `log p&#952;(x) = log p(f&#952;&#8315;&#185;(x)) + log|det &#8706;f&#952;&#8315;&#185;(x)/&#8706;x| &nbsp;(플로우 기반의 경우 변화율 공식, 신경망 &#952; 학습)`,
    features: `<p><strong>장점</strong> — 이미지·텍스트 등 고차원 데이터의 밀도를 표현력 있게 모델링할 수 있습니다.</p>
    <p><strong>단점</strong> — 대량의 데이터와 연산자원이 필요하고, 해석 가능성이 고전적 통계 모형보다 떨어집니다.</p>`,
    applications: `<p>이상치·분포외(OOD) 탐지, 생성모델의 우도 기반 평가, 데이터 증강을 위한 샘플 생성 등에
    사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/task/density-estimation'
  },
  {
    id: 'normalizing-flows',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '정규화 플로우 (Normalizing Flows)',
    subtitle: '단순분포를 일련의 가역변환으로 변형해 복잡한 밀도를 정확히 계산하는 생성모델',
    overview: `<p>표준정규분포처럼 다루기 쉬운 기저분포 z를 여러 개의 가역(invertible)이고 미분가능한 변환 f&#8321;,...,f&#7522;로
    연속 변형시켜 복잡한 데이터 분포 x = f&#7522;&#8728;...&#8728;f&#8321;(z)를 만듭니다. 변수변환 공식의 야코비안 행렬식을 통해
    로그우도를 정확하게(exact) 계산할 수 있다는 점이 VAE·GAN과 구별되는 핵심 특징입니다.</p>`,
    formula: `log p&#7787;(x) = log p&#8382;(f&#8315;&#185;(x)) + &#8721;&#8342; log |det(&#8706;f&#8342;&#8315;&#185;/&#8706;x&#8342;)|`,
    features: `<p><strong>장점</strong> — 정확한 로그우도 계산과 샘플 생성이 모두 가능하며, 잠재공간과 데이터공간의
    차원이 동일하게 보존됩니다.</p>
    <p><strong>단점</strong> — 변환이 가역적이어야 하므로 아키텍처 설계에 제약이 크고, 야코비안 계산 비용이 큽니다.</p>`,
    applications: `<p>정밀한 밀도추정이 필요한 이상치 탐지, 변분추론의 유연한 사후분포, 이미지·음성 생성모델(Glow,
    RealNVP 등) 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: 'https://huggingface.co/models?other=normalizing-flows',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/method/normalizing-flows'
  },
  {
    id: 'real-nvp',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '실수값 비부피보존 변환 (Real NVP, Real-valued Non-Volume Preserving)',
    subtitle: '어파인 결합계층으로 야코비안 계산을 삼각행렬화한 대표적 정규화 플로우',
    overview: `<p>입력을 두 부분으로 나눈 뒤, 한쪽은 그대로 두고 다른 쪽을 첫 번째 부분에 조건화된 스케일·시프트로
    어파인 변환하는 결합계층(coupling layer)을 쌓아 만든 정규화 플로우입니다. 야코비안이 삼각행렬이 되어 행렬식
    계산이 대각원소의 곱으로 간단해집니다.</p>`,
    formula: `y&#8321;:&#7480; = x&#8321;:&#7480;,&nbsp; y&#7480;&#8330;&#8321;:&#7480;&#7480; = x&#7480;&#8330;&#8321;:&#7480;&#7480;&#8853;exp(s(x&#8321;:&#7480;))+t(x&#8321;:&#7480;) &nbsp;(det J = &#8719;exp(s(x&#8321;:&#7480;)))`,
    features: `<p><strong>장점</strong> — 순방향·역방향 변환과 야코비안 계산이 모두 O(d)로 효율적입니다.</p>
    <p><strong>단점</strong> — 절반의 차원이 항등변환되므로 표현력을 높이려면 계층을 깊게 쌓고 분할 방식을 섞어야
    합니다.</p>`,
    applications: `<p>이미지 생성 및 우도 기반 평가, 밀도추정 기반 이상치 탐지, 이후 등장한 Glow 등 플로우 모델의
    기반 구조로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/method/realnvp'
  },
  {
    id: 'vine-copula',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '바인 코퓰라 (Vine Copula)',
    subtitle: '고차원 의존구조를 이변량 코퓰라들의 트리 구조 결합으로 분해하는 방법',
    overview: `<p>변수가 3개 이상일 때 하나의 고차원 코퓰라를 직접 적합하기 어려운 문제를, 여러 개의 이변량(조건부)
    코퓰라를 트리(vine) 형태로 계층적으로 결합해 우회합니다. C-vine, D-vine 등 트리 구조에 따라 분해 방식이
    달라지며 각 간선(edge)마다 서로 다른 코퓰라 계열을 자유롭게 선택할 수 있습니다.</p>`,
    formula: `c(u&#8321;,...,u&#7480;) = &#8719;&#8342;&#8339;&#8321;&#7480;&#8315;&#185; &#8719;&#8320;&#7523;(&#8342;)&#8322;&#8320; c&#7522;,&#7522;&#8322;|D&#7522;&#7522; &nbsp;(트리 T&#8342;의 각 간선에서 조건부 이변량 코퓰라의 곱으로 분해)`,
    features: `<p><strong>장점</strong> — 고차원에서도 각 변수쌍마다 다른 의존구조(코퓰라 계열)를 유연하게 조합할 수
    있습니다.</p>
    <p><strong>단점</strong> — 변수 개수가 늘어나면 가능한 트리 구조의 조합이 폭발적으로 늘어나 구조 선택이
    어렵습니다.</p>`,
    applications: `<p>다자산 포트폴리오의 복합 리스크 모델링, 수문학의 다지점 강수량 의존성 분석 등 고차원 의존구조
    모델링에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

  /* ================= [1.7.6] Basic Covariance Estimation ================= */
  {
    id: 'empirical-covariance',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '경험적 공분산 (Empirical Covariance)',
    subtitle: '표본으로부터 직접 계산하는 가장 기본적인 공분산 행렬 추정치',
    overview: `<p>관측된 표본만을 사용해 변수 간 공분산을 그대로 계산하는 방법으로, 정규분포를 가정할 때의 최대우도
    추정치와 일치합니다. 모든 고급 공분산 추정 기법(축소, 희소화, 강건추정 등)의 출발점이자 비교 기준이 됩니다.</p>`,
    formula: `&#931;&#770; = (1/n) &#8721;&#7522;&#8348;&#8321;&#7480; (x&#7522;−x&#772;)(x&#7522;−x&#772;)&#7511;`,
    features: `<p><strong>장점</strong> — 계산이 단순하고 편향이 없으며(unbiased, n−1로 나눌 경우), 표본 수가 변수 수보다
    충분히 많으면 안정적입니다.</p>
    <p><strong>단점</strong> — 변수 수 p가 표본 수 n에 가깝거나 크면(p&#8776;n 또는 p&gt;n) 행렬이 비가역이거나 극도로
    불안정해지고, 이상치에 매우 취약합니다.</p>`,
    applications: `<p>PCA·LDA·마할라노비스 거리 계산 등 대부분의 다변량 통계기법의 기초 입력값, 포트폴리오 위험
    분석의 기본 공분산 추정에 사용됩니다.</p>`,
    sklearnFunction: 'EmpiricalCovariance',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/covariance.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.covariance.EmpiricalCovariance.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/covariance/plot_covariance_estimation.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'mle-covariance-estimation',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '최대우도 공분산 추정 (Maximum Likelihood Covariance Estimation)',
    subtitle: '다변량 정규분포를 가정하고 우도를 최대화해 공분산 행렬을 구하는 방법',
    overview: `<p>데이터가 다변량 정규분포 N(&#956;,&#931;)를 따른다고 가정할 때, 로그우도를 &#956;와 &#931;에 대해 각각 최대화하면
    평균은 표본평균, 공분산은 경험적 공분산과 정확히 동일한 닫힌 형태의 해가 나옵니다. 즉 경험적 공분산은
    정규성 가정 하의 MLE입니다.</p>`,
    formula: `&#8467;(&#956;,&#931;) = −(n/2)ln|&#931;| − (1/2)&#8721;&#7522;(x&#7522;−&#956;)&#7511;&#931;&#8315;&#185;(x&#7522;−&#956;),&nbsp;&nbsp; &#931;&#770;&#7514;&#7519;&#7480; = (1/n)&#8721;&#7522;(x&#7522;−x&#772;)(x&#7522;−x&#772;)&#7511;`,
    features: `<p><strong>장점</strong> — 정규분포 가정 하에서 통계적으로 가장 효율적인(최소분산) 추정량입니다.</p>
    <p><strong>단점</strong> — 실제 데이터가 정규분포에서 벗어나거나(꼬리가 두꺼움) 이상치가 있으면 추정치가
    왜곡됩니다.</p>`,
    applications: `<p>가우시안 혼합모형(GMM)의 각 성분 공분산 추정, 다변량 정규성 가정 기반의 통계적 가설검정 등에
    사용됩니다.</p>`,
    sklearnFunction: 'EmpiricalCovariance',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/covariance.html#empirical-covariance',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.covariance.EmpiricalCovariance.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'sample-covariance-matrix',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '표본 공분산 행렬 (Sample Covariance Matrix)',
    subtitle: '경험적 공분산과 동일한 개념이나 비편향(n-1) 보정을 적용한 표준 통계학 용어',
    overview: `<p>경험적 공분산과 계산식은 같지만, 통계학에서는 표본분산의 불편추정량(unbiased estimator)이 되도록
    분모에 n 대신 n−1(베셀 보정, Bessel's correction)을 사용하는 관례를 따릅니다. 다변량 분석·재무공학에서
    "공분산 행렬"이라 하면 대체로 이 정의를 가리킵니다.</p>`,
    formula: `S = (1/(n−1)) &#8721;&#7522;&#8348;&#8321;&#7480; (x&#7522;−x&#772;)(x&#7522;−x&#772;)&#7511;`,
    features: `<p><strong>장점</strong> — n−1 보정으로 소표본에서도 편향 없는 분산 추정을 제공합니다.</p>
    <p><strong>단점</strong> — 경험적 공분산과 마찬가지로 고차원(p&gt;n)에서는 비가역·불안정 문제를 그대로 안고
    있습니다.</p>`,
    applications: `<p>재무공학의 자산수익률 공분산행렬 산출, PCA의 입력 행렬, 일반적인 다변량 통계분석 전반에
    사용됩니다.</p>`,
    sklearnFunction: 'numpy.cov',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/covariance.html',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

  /* ================= [1.7.7] Shrinkage Methods ================= */
  {
    id: 'ledoit-wolf-shrinkage',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '르두와-울프 축소 (Ledoit-Wolf Shrinkage)',
    subtitle: '경험적 공분산과 구조화된 목표행렬을 데이터 기반 최적 비율로 혼합하는 축소 추정법',
    overview: `<p>표본 공분산 &#931;&#770;와 항등행렬(또는 등방적 목표행렬) F를 &#931;&#770;&#8342; = (1−&#945;)&#931;&#770; + &#945;F 형태로 볼록결합하되,
    혼합비율 &#945;(축소강도)를 사용자가 임의로 정하지 않고 평균제곱오차를 최소화하는 값을 데이터로부터 닫힌 형태의
    공식으로 자동 계산합니다.</p>`,
    formula: `&#931;&#770;&#7515;&#7559; = (1−&#945;&#770;)&#931;&#770; + &#945;&#770;&#183;(tr(&#931;&#770;)/p)&#183;I,&nbsp;&nbsp; &#945;&#770; = argmin&#8342; E[||&#931;&#770;&#8342;−&#931;||&#7472;&#178;] &nbsp;(닫힌형태 공식으로 계산)`,
    features: `<p><strong>장점</strong> — 축소강도를 교차검증 없이 데이터에서 직접 계산해 빠르고, p&gt;n인 고차원에서도
    항상 가역인 공분산 추정치를 보장합니다.</p>
    <p><strong>단점</strong> — 목표행렬(항등행렬 등)이 실제 구조와 크게 다르면 축소로 인한 편향이 과도해질 수
    있습니다.</p>`,
    applications: `<p>고차원 포트폴리오 최적화의 공분산 입력값, 표본 수 대비 변수 수가 많은 유전체 데이터의 공분산
    추정 등에 널리 사용됩니다.</p>`,
    sklearnFunction: 'LedoitWolf',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/covariance.html#shrunk-covariance',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.covariance.LedoitWolf.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/covariance/plot_lw_vs_oas.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'linear-shrinkage',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '선형 축소 (Linear Shrinkage)',
    subtitle: '표본 공분산과 목표행렬을 고정 또는 계산된 비율로 선형 결합하는 축소기법의 총칭',
    overview: `<p>Ledoit-Wolf, OAS 등 구체적 기법들이 속하는 상위 개념으로, 표본 공분산 &#931;&#770;와 구조화된 목표행렬
    F(항등행렬, 대각행렬, 등상관행렬 등)를 &#931;&#770;&#8342; = (1−&#945;)&#931;&#770;+&#945;F의 선형결합으로 정규화하는 방식을 통칭합니다.</p>`,
    formula: `&#931;&#770;&#8342; = (1−&#945;)&#931;&#770; + &#945;F,&nbsp; 0 &#8804; &#945; &#8804; 1 &nbsp;(F: 목표행렬, &#945;: 축소강도)`,
    features: `<p><strong>장점</strong> — 개념이 단순하고 다양한 목표행렬·축소강도 계산법과 결합해 유연하게 확장됩니다.</p>
    <p><strong>단점</strong> — 목표행렬 F의 선택이 결과 품질을 좌우하며, 축소강도를 고정값으로 쓸 경우 데이터에
    맞지 않을 위험이 있습니다.</p>`,
    applications: `<p>고차원 소표본 상황에서의 안정적 공분산 추정 전반, 판별분석(LDA)의 공분산 정규화 등에
    사용됩니다.</p>`,
    sklearnFunction: 'ShrunkCovariance',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/covariance.html#shrunk-covariance',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.covariance.ShrunkCovariance.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/covariance/plot_covariance_estimation.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'nonlinear-shrinkage',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '비선형 축소 (Non-linear Shrinkage)',
    subtitle: '고유값마다 서로 다른 비선형 축소량을 적용하는 정교한 공분산 축소기법',
    overview: `<p>선형 축소가 모든 고유값에 동일한 선형 비율로 축소를 적용하는 것과 달리, 비선형 축소는 표본 공분산의
    고유값 분포(스펙트럼) 전체를 무작위행렬이론으로 분석하여 각 고유값마다 서로 다른 정도로 축소량을 적용합니다.
    Ledoit-Wolf의 후속 연구(QuEST 등)에서 제안되었습니다.</p>`,
    formula: `&#931;&#770;&#8345;&#8572; = &#8721;&#8342; &#964;(&#955;&#8342;)&#183;u&#8342;u&#8342;&#7511; &nbsp;(&#955;&#8342;: 표본 공분산의 고유값, &#964;(&#183;): 비선형 축소함수, u&#8342;: 고유벡터)`,
    features: `<p><strong>장점</strong> — 선형 축소보다 고유값 스펙트럼을 정교하게 보정해 고차원에서 더 낮은 추정
    오차를 달성합니다.</p>
    <p><strong>단점</strong> — 무작위행렬이론 기반의 스펙트럼 추정이 필요해 구현이 복잡하고 계산 비용이 큽니다.</p>`,
    applications: `<p>변수 수가 매우 많은 대규모 포트폴리오 최적화, 고차원 유전체·금융 데이터의 정밀 공분산
    추정 연구에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'oracle-approximating-shrinkage',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '오라클 근사 축소 (OAS, Oracle Approximating Shrinkage)',
    subtitle: '데이터가 가우시안에 가까울 때 Ledoit-Wolf보다 참값에 더 근접하는 축소 공식',
    overview: `<p>Ledoit-Wolf와 같은 선형 축소 형태를 취하지만, 데이터가 가우시안 분포를 따른다는 가정 아래 참
    공분산을 알고 있는 "오라클"이 선택할 축소강도에 더 가깝게 근사하도록 반복적으로 유도된 공식을 사용합니다.
    작은 표본에서 Ledoit-Wolf보다 낮은 오차를 보이는 경우가 많습니다.</p>`,
    formula: `&#945;&#770;&#8317;&#7280;&#7480; = min{ [(1−2/p)tr(&#931;&#770;&#178;)+tr(&#931;&#770;)&#178;] / [(n+1−2/p)(tr(&#931;&#770;&#178;)−tr(&#931;&#770;)&#178;/p)], 1 }`,
    features: `<p><strong>장점</strong> — 가우시안 데이터에서는 Ledoit-Wolf보다 더 낮은 평균제곱오차를 보이는 경우가
    많고 계산도 닫힌 형태로 빠릅니다.</p>
    <p><strong>단점</strong> — 가우시안 가정에서 벗어난 데이터에서는 이론적 이점이 보장되지 않습니다.</p>`,
    applications: `<p>Ledoit-Wolf와 함께 고차원 포트폴리오 위험모형, 소표본 다변량 분석의 공분산 정규화에
    사용됩니다.</p>`,
    sklearnFunction: 'OAS',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/covariance.html#shrunk-covariance',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.covariance.OAS.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/covariance/plot_lw_vs_oas.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'shrunk-covariance',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '축소 공분산 (Shrunk Covariance)',
    subtitle: '축소강도 α를 사용자가 직접 지정하는 가장 단순한 형태의 선형 축소 공분산',
    overview: `<p>Ledoit-Wolf·OAS처럼 축소강도를 데이터로부터 자동 계산하지 않고, 사용자가 &#945;를 직접 지정해
    표본 공분산과 항등행렬(대각성분 평균)을 혼합하는 가장 기본적인 축소 공분산 구현입니다. scikit-learn의
    ShrunkCovariance 추정기가 이에 해당합니다.</p>`,
    formula: `&#931;&#770;&#8342; = (1−&#945;)&#931;&#770; + &#945;&#183;(tr(&#931;&#770;)/p)&#183;I,&nbsp; &#945; &#8712; [0,1] (사용자 지정)`,
    features: `<p><strong>장점</strong> — 개념이 단순해 교육·실험 목적으로 이해하기 쉽고, &#945;를 교차검증으로 튜닝하면
    데이터에 맞출 수 있습니다.</p>
    <p><strong>단점</strong> — &#945;를 직접 튜닝해야 하므로 Ledoit-Wolf 대비 자동화 수준이 낮습니다.</p>`,
    applications: `<p>공분산 축소 개념의 교육용 예제, &#945; 값에 따른 축소 효과 비교실험 등에 사용됩니다.</p>`,
    sklearnFunction: 'ShrunkCovariance',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/covariance.html#shrunk-covariance',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.covariance.ShrunkCovariance.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/covariance/plot_covariance_estimation.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

  /* ================= [1.7.8] Sparse Covariance Estimation ================= */
  {
    id: 'clime',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '역행렬 추정을 위한 제약 L1 최소화 (CLIME)',
    subtitle: '역공분산 행렬을 제약된 L1 최적화 문제로 직접 추정하는 희소 역공분산 기법',
    overview: `<p>GLASSO가 우도 기반의 벌점화 최적화를 통해 정밀도 행렬(precision matrix)을 추정하는 것과 달리,
    CLIME은 &#937;&#931;&#770; &#8776; I가 되도록 하는 제약 조건 하에서 &#937;의 L1 노름을 최소화하는 선형계획법 형태의 최적화 문제로
    정의됩니다. 각 열(column)을 독립적으로 병렬 계산할 수 있어 확장성이 좋습니다.</p>`,
    formula: `&#937;&#770; = argmin&#8486; ||&#8486;||&#8321; &nbsp; s.t. ||&#931;&#770;&#8486;−I||&#8734; &#8804; &#955;`,
    features: `<p><strong>장점</strong> — 열별로 독립적인 선형계획 문제로 분해되어 병렬화가 쉽고, GLASSO보다 이론적
    수렴 속도(rate) 분석이 용이합니다.</p>
    <p><strong>단점</strong> — 추정된 &#937;&#770;가 대칭이 되도록 별도의 대칭화 후처리가 필요하고, 선형계획법 특유의 계산
    비용이 존재합니다.</p>`,
    applications: `<p>고차원 유전자 발현 네트워크의 조건부 독립구조 추정, 그래프 구조 학습 연구 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'graphical-lasso',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '그래프 라쏘 (GLASSO, Graphical Lasso)',
    subtitle: 'L1 벌점을 부여한 우도 최대화로 희소한 정밀도(역공분산) 행렬을 추정하는 방법',
    overview: `<p>가우시안 그래프 모형에서 정밀도 행렬 &#937;=&#931;&#8315;&#185;의 0이 아닌 원소가 변수 간 조건부 의존관계(그래프의 간선)를
    나타낸다는 점에 착안해, 로그우도에 &#937;의 L1 벌점을 더해 최대화함으로써 대부분의 원소가 정확히 0이 되는 희소한
    역공분산 행렬을 추정합니다.</p>`,
    formula: `&#937;&#770; = argmax&#8486;&#8811;&#8320; [ log det &#8486; − tr(&#931;&#770;&#8486;) − &#961;&#183;||&#8486;||&#8321; ] &nbsp;(&#961;: L1 벌점 강도)`,
    features: `<p><strong>장점</strong> — 변수 간 조건부 독립관계를 그래프로 명시적으로 해석할 수 있고, 표본 수보다
    변수가 많은 상황(p&gt;n)에서도 적용 가능합니다.</p>
    <p><strong>단점</strong> — 벌점 강도 &#961; 선택이 그래프의 희소도를 크게 좌우하고, 최적화 계산 비용이 변수 수의
    세제곱에 가깝게 증가합니다.</p>`,
    applications: `<p>유전자 조절 네트워크 추정, 금융자산 간 조건부 의존 네트워크 분석, 뇌영상(fMRI) 연결성
    분석 등 그래프 구조를 통계적으로 추정할 때 사용됩니다.</p>`,
    sklearnFunction: 'GraphicalLasso / GraphicalLassoCV',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/covariance.html#sparse-inverse-covariance',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.covariance.GraphicalLasso.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/covariance/plot_sparse_cov.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'l1-penalized-covariance',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: 'L1-페널티 공분산 추정 (L1-Penalized Covariance Estimation)',
    subtitle: 'GLASSO를 포함해 L1 정규화를 공분산(또는 역공분산) 추정에 적용하는 방법의 총칭',
    overview: `<p>공분산 또는 정밀도 행렬 추정 문제에 L1 벌점을 더해 희소성(대부분 원소가 0)을 유도하는 정규화
    기법 전체를 포괄하는 개념으로, GLASSO가 가장 대표적인 사례입니다. 벌점 강도 &#961;가 클수록 더 희소한 그래프
    구조를 얻습니다.</p>`,
    formula: `min&#8486; [ −log det &#8486; + tr(&#931;&#770;&#8486;) + &#961;&#183;||&#8486;||&#8321; ] &nbsp;(&#961;=0이면 일반 MLE와 동일)`,
    features: `<p><strong>장점</strong> — 벌점 강도 하나로 희소도와 해석 가능성을 조절할 수 있고, 고차원에서도 안정적인
    해가 존재합니다.</p>
    <p><strong>단점</strong> — 벌점 강도 선택에 교차검증이 필요하며, L1 벌점 특성상 추정치에 편향이 존재합니다.</p>`,
    applications: `<p>희소 그래프 구조 추정 전반(GLASSO, CLIME 등 구체 기법의 상위 범주), 고차원 데이터의
    변수 간 관계 축소에 사용됩니다.</p>`,
    sklearnFunction: 'GraphicalLasso',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/covariance.html#sparse-inverse-covariance',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.covariance.GraphicalLasso.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/covariance/plot_sparse_cov.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'neighborhood-selection',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '이웃 선택 (Neighborhood Selection)',
    subtitle: '각 변수를 나머지 변수로 회귀하는 라쏘를 반복해 그래프 구조를 추정하는 방법',
    overview: `<p>Meinshausen과 Bühlmann이 제안한 방법으로, GLASSO처럼 전체 우도를 한 번에 최적화하는 대신 각 변수
    X&#7522;를 나머지 모든 변수에 대해 라쏘 회귀하여 0이 아닌 계수를 갖는 변수들을 X&#7522;의 "이웃(neighborhood)"으로
    선택합니다. p개의 개별 라쏘 회귀 결과를 모아 전체 그래프를 구성합니다.</p>`,
    formula: `&#946;&#770;&#7522; = argmin&#946; ||X&#7522;−X&#8331;&#7522;&#946;||&#178;&#8322; + &#955;||&#946;||&#8321; &nbsp;(변수 i마다 반복, 0&#8800;&#946;&#7522;&#7527; &#8660; 그래프에 간선 (i,j) 존재)`,
    features: `<p><strong>장점</strong> — p개의 독립적인 라쏘 회귀로 분해되어 병렬화가 쉽고 구현이 비교적 단순합니다.</p>
    <p><strong>단점</strong> — 변수 i→j와 j→i의 선택 결과가 다를 수 있어(비대칭) AND/OR 규칙 등 후처리로 대칭화해야
    합니다.</p>`,
    applications: `<p>고차원 그래프 구조 추정, GLASSO의 근사적 대안으로서 유전자 네트워크·센서 네트워크 분석에
    사용됩니다.</p>`,
    sklearnFunction: 'Lasso (변수별 반복 적용)',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/linear_model.html#lasso',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Lasso.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'sparse-inverse-covariance',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '희소 역공분산 추정 (Sparse Inverse Covariance Estimation)',
    subtitle: '정밀도 행렬의 대부분 원소를 0으로 만들어 변수 간 조건부 독립 그래프를 얻는 접근의 총칭',
    overview: `<p>GLASSO, CLIME, 이웃 선택 등 구체적 알고리즘들이 공통으로 목표하는 상위 개념으로, 공분산의 역행렬인
    정밀도 행렬 &#937;에서 0이 아닌 (i,j) 원소가 존재할 때만 변수 i와 j가 나머지 변수를 조건으로 서로 의존한다는
    가우시안 그래프 모형의 성질을 이용합니다.</p>`,
    formula: `&#937;&#7522;&#7527; = 0 &#8660; X&#7522; &#8869; X&#7527; | X&#8321;,...,X&#7480; \\{&#7522;,&#7527;} &nbsp;(정밀도 행렬의 0 원소 = 조건부 독립)`,
    features: `<p><strong>장점</strong> — 조건부 독립구조를 그래프로 직접 해석할 수 있어 단순 공분산보다 인과적·구조적
    통찰을 제공합니다.</p>
    <p><strong>단점</strong> — 고차원에서 정밀도 행렬 추정 자체가 불안정할 수 있어 정규화(L1 벌점 등)가 필수적입니다.</p>`,
    applications: `<p>가우시안 그래프 모형(GGM) 구축, 유전자·금융·센서 네트워크의 조건부 의존구조 분석에
    사용됩니다.</p>`,
    sklearnFunction: 'GraphicalLasso',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/covariance.html#sparse-inverse-covariance',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.covariance.GraphicalLasso.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/covariance/plot_sparse_cov.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

  /* ================= [1.7.9] Robust Covariance Estimation ================= */
  {
    id: 'fast-mcd',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '고속 MCD (FastMCD, Robust Covariance)',
    subtitle: 'MCD를 대규모 데이터에서도 실용적으로 계산할 수 있게 만든 고속 근사 알고리즘',
    overview: `<p>MCD(최소 공분산 행렬식) 추정은 원리상 가능한 모든 부분집합을 탐색해야 하지만, Rousseeuw와 Van
    Driessen이 제안한 FastMCD는 C-step(농축 단계, concentration step)이라는 반복적 개선 절차와 여러 무작위
    초기 부분집합의 병렬 탐색을 결합해 대규모 데이터에서도 실용적 시간 내에 MCD에 가까운 해를 찾습니다.</p>`,
    formula: `C-step: H&#8321; = {n&#8462;개 표본 중 마할라노비스 거리가 가장 작은 n&#8462;개} &#8594; &#931;&#770;(H&#8321;) 재계산 &#8594; 수렴할 때까지 반복`,
    features: `<p><strong>장점</strong> — 완전탐색 MCD보다 훨씬 빠르면서도 근사 해의 품질이 우수해 scikit-learn 등
    실무 라이브러리의 표준 구현으로 채택되었습니다.</p>
    <p><strong>단점</strong> — 여전히 이상치 비율 h(오염률 가정)를 사전에 설정해야 하고, 매우 고차원에서는 계산량이
    커집니다.</p>`,
    applications: `<p>강건 이상치 탐지(EllipticEnvelope), 강건 마할라노비스 거리 계산, 오염된 다변량 데이터의 안정적
    공분산 추정 등에 사용됩니다.</p>`,
    sklearnFunction: 'MinCovDet',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/covariance.html#robust-covariance-estimation',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.covariance.MinCovDet.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/covariance/plot_robust_vs_empirical_covariance.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'minimum-covariance-determinant',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '최소 공분산 행렬식 (MCD, Minimum Covariance Determinant)',
    subtitle: '전체 표본 중 행렬식이 가장 작은 부분집합만으로 공분산을 추정하는 강건 추정법',
    overview: `<p>전체 n개 표본 중 h개(h&lt;n, 보통 h&#8776;n/2)의 부분집합을 골라 그 부분집합의 공분산 행렬식이 최소가
    되도록 선택한 뒤, 그 부분집합만으로 평균과 공분산을 계산합니다. 이상치가 섞여 있어도 전체의 절반 가까이가
    오염되기 전까지는 강건하게 참값에 가까운 공분산을 추정합니다.</p>`,
    formula: `H&#770; = argmin&#8342;&#8339;{1,...,n}, |H|=h det(&#931;&#770;(H)),&nbsp;&nbsp; &#931;&#770;&#7495;&#7305;&#7285; = c&#8342;&#183;&#931;&#770;(H&#770;) &nbsp;(c&#8342;: 일관성 보정계수)`,
    features: `<p><strong>장점</strong> — 이상치 비율이 50%에 가까워도 붕괴점(breakdown point)이 높아 강건하며,
    이상치 탐지의 마할라노비스 거리 계산에 이상적입니다.</p>
    <p><strong>단점</strong> — 이론적으로 조합 탐색이 필요해 계산 비용이 크며(FastMCD로 근사), 오염률 h를 미리
    가정해야 합니다.</p>`,
    applications: `<p>다변량 이상치 탐지(EllipticEnvelope), 강건 마할라노비스 거리, 오염된 재무·품질관리 데이터의
    강건 통계분석에 사용됩니다.</p>`,
    sklearnFunction: 'MinCovDet',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/covariance.html#robust-covariance-estimation',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.covariance.MinCovDet.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/covariance/plot_mahalanobis_distances.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'm-estimators-covariance',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: 'M-추정량 (M-Estimators for Covariance)',
    subtitle: '이상치의 영향을 제한하는 가중함수로 공분산을 반복 재가중 추정하는 강건 통계기법',
    overview: `<p>최대우도 추정을 일반화해, 각 표본이 손실에 기여하는 정도를 무한정 키우지 않고 특정 함수 &#961;(&#183;)
    (Huber, Tukey biweight 등)로 제한하는 추정량입니다. 이상치일수록 반복 과정에서 가중치를 낮춰 최종 공분산에
    미치는 영향을 억제합니다.</p>`,
    formula: `&#931;&#770; = argmin&#931; &#8721;&#7522; &#961;( d&#7522;(&#931;) ),&nbsp; d&#7522;(&#931;)&#178; = (x&#7522;−&#956;&#770;)&#7511;&#931;&#8315;&#185;(x&#7522;−&#956;&#770;) &nbsp;(&#961;: Huber/Tukey 등 유계 손실함수, 반복재가중최소제곱으로 계산)`,
    features: `<p><strong>장점</strong> — MCD보다 계산이 가볍고(반복 재가중, IRLS), 손실함수 선택에 따라 강건성 정도를
    조절할 수 있습니다.</p>
    <p><strong>단점</strong> — 고차원에서는 붕괴점이 MCD보다 낮아지고, 초기값에 따라 지역해로 수렴할 수 있습니다.</p>`,
    applications: `<p>이상치가 소수 섞인 다변량 데이터의 강건 위치·산포 추정, 강건 회귀분석의 잔차 가중치 계산 등에
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
    id: 'robust-pca',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '강건 주성분 분석 (Robust PCA)',
    subtitle: '데이터 행렬을 저랭크 성분과 희소 이상치 성분으로 분해하는 강건 차원축소·공분산 기법',
    overview: `<p>일반 PCA는 이상치 하나에도 주성분 방향이 크게 흔들리는 문제가 있어, Robust PCA는 관측 행렬
    X를 저랭크 행렬 L(정상 구조)과 희소 행렬 S(이상치·잡음)의 합으로 분해합니다. 핵노름(nuclear norm)과 L1
    노름을 함께 최소화하는 볼록 최적화(주성분추적, Principal Component Pursuit)로 풀 수 있습니다.</p>`,
    formula: `min&#8343;,&#8347; ||L||&#8339; + &#955;||S||&#8321; &nbsp; s.t. X = L + S &nbsp;(||&#183;||&#8339;: 핵노름/특이값의 합)`,
    features: `<p><strong>장점</strong> — 소수의 큰 이상치(그레인 노이즈, 결측 등)에도 저랭크 구조를 정확히 복원할 수
    있습니다.</p>
    <p><strong>단점</strong> — 특이값분해를 반복 수행해야 해 대규모 데이터에서 계산 비용이 크고, 벌점 &#955; 선택이
    분해 품질에 영향을 줍니다.</p>`,
    applications: `<p>영상의 배경-전경 분리, 추천시스템의 이상치 강건 행렬완성, 강건 공분산 구조 추정 등에
    사용됩니다. ([참고] MCD는 [1.5.4.06] 이상치탐지, Robust PCA는 [1.4.1.15] 차원축소에도 등장 — 동일 기법이
    통계적 공분산추정 관점에서 재사용된 것으로 중복 오류가 아닙니다.)</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/method/robust-pca'
  },

  /* ================= [1.7.10] Structured Covariance Estimation ================= */
  {
    id: 'banded-covariance',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '밴드 공분산 (Banded Covariance)',
    subtitle: '대각선에서 멀어질수록 원소를 0으로 강제해 순서가 있는 변수의 공분산을 추정하는 방법',
    overview: `<p>변수들이 시간·공간·서열 등 자연스러운 순서를 가질 때, 서로 멀리 떨어진 변수 쌍(i,j)의 공분산은
    작다고 가정하고 |i−j|&gt;k인 원소를 0으로 강제하는 밴드(띠) 구조를 부여합니다. 밴드 폭 k가 정규화 강도를
    결정합니다.</p>`,
    formula: `&#931;&#770;&#7522;&#7527;&#7515;&#7559; = &#931;&#770;&#7522;&#7527;&#183;1(|i−j| &#8804; k),&nbsp; k: 밴드 폭 (하이퍼파라미터)`,
    features: `<p><strong>장점</strong> — 순서가 있는 데이터에서 자연스러운 정규화이며, 추정치가 항상 양의 정부호가
    되도록 보장하는 변형(tapering)도 존재합니다.</p>
    <p><strong>단점</strong> — 변수 순서가 의미 있는 경우에만 타당하며, 밴드 폭 k 선택이 필요합니다.</p>`,
    applications: `<p>시계열의 자기공분산 구조 추정, 유전체 데이터에서 염색체 상 위치가 가까운 유전자 간 공분산
    추정 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'block-diagonal-covariance',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '블록 대각 공분산 (Block Diagonal Covariance)',
    subtitle: '변수들을 서로 독립인 그룹으로 나누어 그룹 간 공분산을 0으로 가정하는 구조화 방법',
    overview: `<p>변수를 몇 개의 그룹(블록)으로 나눌 수 있다는 사전지식이 있을 때, 서로 다른 블록에 속한 변수 간
    공분산을 0으로 강제하고 블록 내부의 공분산만 자유롭게 추정합니다. 결과적으로 전체 공분산 행렬이 블록
    대각행렬 형태가 됩니다.</p>`,
    formula: `&#931; = diag(&#931;&#8321;, &#931;&#8322;, ..., &#931;&#7482;) &nbsp;(블록 간 원소는 모두 0)`,
    features: `<p><strong>장점</strong> — 파라미터 수가 크게 줄어 표본 대비 변수가 많은 상황에서도 안정적으로
    추정할 수 있고, 블록별로 독립 계산이 가능해 병렬화가 쉽습니다.</p>
    <p><strong>단점</strong> — 블록 구조(그룹 분할)를 사전에 알아야 하며, 실제로는 약하게라도 블록 간 상관이
    있는 경우 편향이 생깁니다.</p>`,
    applications: `<p>다중 센서 그룹, 서로 다른 실험 조건에서 얻은 변수 그룹의 공분산 추정, 인자모형의 사전
    구조 가정 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'factor-model-covariance',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '요인 모델 공분산 (Factor Model Covariance)',
    subtitle: '소수의 공통요인과 변수별 고유분산으로 공분산 행렬을 저차원 구조로 분해하는 방법',
    overview: `<p>p개 변수의 공분산이 k(&#8810;p)개의 잠재 공통요인으로 대부분 설명되고, 나머지는 변수별 고유(독립)
    분산이라고 가정합니다. &#931; = LL&#7511; + &#936;로 분해되며 L(p&#215;k 요인적재행렬)의 낮은 차수 k 덕분에 p&gt;n인
    고차원에서도 안정적으로 추정할 수 있습니다.</p>`,
    formula: `&#931; = LL&#7511; + &#936;,&nbsp; L &#8712; &#8477;&#7480;&#8317;&#7472;, &#936; = diag(&#968;&#8321;,...,&#968;&#7480;) &nbsp;(요인적재 L, 고유분산 &#936;)`,
    features: `<p><strong>장점</strong> — 파라미터 수를 O(pk)로 줄여 고차원 데이터에서도 계산·추정이 안정적입니다.</p>
    <p><strong>단점</strong> — 요인 개수 k를 사전에 정해야 하고, 실제 데이터가 저차원 요인 구조를 따르지 않으면
    적합도가 떨어집니다.</p>`,
    applications: `<p>자산가격결정모형(Fama-French 등)의 자산수익률 공분산 추정, 대규모 포트폴리오 리스크 모형,
    POET 등 고차원 공분산 기법의 기반 가정으로 사용됩니다.</p>`,
    sklearnFunction: 'FactorAnalysis',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/decomposition.html#factor-analysis',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.FactorAnalysis.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'kronecker-covariance',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '크로네커 구조 공분산 (Kronecker-structured Covariance)',
    subtitle: '행-열 구조를 갖는 행렬형 데이터의 공분산을 두 작은 행렬의 크로네커 곱으로 분해하는 방법',
    overview: `<p>데이터가 시공간처럼 두 개(또는 그 이상)의 축을 가진 행렬 형태일 때, 전체 공분산을 각 축에 대한
    작은 공분산 행렬들의 크로네커 곱 &#931; = A&#8855;B로 근사합니다. p&#215;q 크기의 공분산을 p&#178;+q&#178;개의 파라미터만으로
    표현할 수 있어 파라미터 수가 급격히 줄어듭니다.</p>`,
    formula: `&#931; = A &#8855; B,&nbsp; A &#8712; &#8477;&#7477;&#8317;&#7477;, B &#8712; &#8477;&#7476;&#8317;&#7476; &nbsp;(전체 pq&#215;pq 대신 p&#178;+q&#178; 파라미터로 추정)`,
    features: `<p><strong>장점</strong> — 시공간·다중모드 데이터에서 파라미터 수를 획기적으로 줄여 고차원에서도
    안정적으로 추정합니다.</p>
    <p><strong>단점</strong> — 실제 공분산이 크로네커 곱으로 정확히 분해되지 않는 경우 근사 오차가 발생합니다.</p>`,
    applications: `<p>시공간 기상 데이터(위치×시간)의 공분산 모델링, 다채널 뇌파(EEG/fMRI, 채널×시간)의 공분산
    추정 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'toeplitz-covariance',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '토플리츠 공분산 (Toeplitz Covariance)',
    subtitle: '대각선을 따라 값이 일정한(정상성) 시계열 데이터에 특화된 구조화 공분산 추정법',
    overview: `<p>정상(stationary) 시계열에서는 두 시점 간 공분산이 시차(lag) |i−j|에만 의존하고 절대적 시점에는
    의존하지 않습니다. 이 성질을 이용해 공분산 행렬의 각 대각선(constant diagonal)을 동일한 값으로 강제하는
    토플리츠 구조를 부여해 파라미터 수를 p개(시차별 자기공분산)로 줄입니다.</p>`,
    formula: `&#931;&#7522;&#7527; = &#947;(|i−j|) &nbsp;(&#947;(&#183;): 시차별 자기공분산함수, 행렬의 각 대각선이 상수)`,
    features: `<p><strong>장점</strong> — 정상 시계열에서는 파라미터 수가 p&#178;에서 p개로 줄어 추정이 매우 안정적입니다.</p>
    <p><strong>단점</strong> — 데이터가 정상성을 만족하지 않으면(추세·계절성 존재) 구조 가정이 깨져 편향이 큽니다.</p>`,
    applications: `<p>ARMA 등 정상 시계열 모형의 공분산 추정, 음성신호 처리의 자기상관 구조 모델링 등에
    사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

  /* ================= [1.7.11] High-dimensional Covariance Estimation ================= */
  {
    id: 'poet-covariance',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '주 직교 보완 임계값 (POET, Principal Orthogonal complEment Thresholding)',
    subtitle: '공통요인으로 설명되는 부분은 PCA로, 나머지 잔차는 희소화로 추정하는 고차원 공분산 기법',
    overview: `<p>Fan, Liao, Mincheva가 제안한 방법으로, 공분산을 소수의 강한 공통요인이 설명하는 저랭크 성분과
    그 나머지(직교 보완, orthogonal complement) 성분으로 나눕니다. 저랭크 성분은 표본 공분산의 상위 주성분으로
    추정하고, 남은 잔차 공분산은 대부분 약한 상관만 남는다고 보아 임계값(thresholding)으로 희소화합니다.</p>`,
    formula: `&#931;&#770;&#7477;&#7476;&#7502;&#7280; = &#8721;&#7522;&#8339;&#8342; &#955;&#770;&#7522;u&#770;&#7522;u&#770;&#7522;&#7511; + &#931;&#770;&#7469;&#8317;&#7472;&#7522;&#7472;&#7476;&#7480;&#7480; &nbsp;(상위 K개 고유값·고유벡터로 요인 성분, 잔차는 원소별 임계값 처리)`,
    features: `<p><strong>장점</strong> — 강한 공통요인(시장 요인 등)과 약한 개별 상관을 분리해 초고차원(p&#8811;n)에서도
    이론적 수렴 속도가 보장됩니다.</p>
    <p><strong>단점</strong> — 요인 개수 K와 임계값을 함께 정해야 하고, 요인 구조 가정이 실제와 다르면 성능이
    저하됩니다.</p>`,
    applications: `<p>초고차원 자산 포트폴리오의 공분산 추정, 유전체 데이터처럼 변수 수가 표본 수를 크게 초과하는
    상황의 공분산 추정 연구에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'random-matrix-theory-covariance',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '무작위 행렬 이론 접근법 (Random Matrix Theory Approaches)',
    subtitle: '고차원 표본 공분산의 고유값 분포를 무작위행렬이론으로 보정하는 공분산 추정법',
    overview: `<p>변수 수 p와 표본 수 n이 함께 커질 때(p/n&#8594;일정한 비), 표본 공분산의 고유값 분포는 참 공분산의
    고유값과 크게 달라진다는 Marchenko-Pastur 법칙에 기반합니다. 관측된 고유값 스펙트럼에서 이 왜곡을 역으로
    보정해 참 고유값에 더 가까운 공분산 추정치를 복원합니다.</p>`,
    formula: `p/n &#8594; c &#8712; (0,&#8734;)&#48372;&#47084; &#8722; Marchenko-Pastur 분포로 잡음 고유값의 범위를 특정하고, 그 범위 밖의 고유값만 신호로 간주`,
    features: `<p><strong>장점</strong> — 고차원에서 표본 공분산의 고유값이 체계적으로 왜곡되는 현상을 이론적으로
    보정해 더 정확한 스펙트럼을 얻습니다.</p>
    <p><strong>단점</strong> — p/n 비율이 일정한 점근 체제(asymptotic regime)를 가정하므로 실제 유한표본에서는
    근사 오차가 남습니다.</p>`,
    applications: `<p>대규모 포트폴리오의 잡음 고유값 제거(신호-잡음 분리), 비선형 축소(nonlinear shrinkage)의
    이론적 토대, 고차원 통계학 연구에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'regularized-covariance-estimation',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '정규화 공분산 추정 (Regularized Covariance Estimation)',
    subtitle: '축소·희소화·구조화 등 다양한 정규화 기법을 아우르는 고차원 공분산 추정의 상위 개념',
    overview: `<p>표본 공분산이 고차원(p&gt;n)에서 비가역이거나 불안정해지는 문제를 해결하기 위해 축소(shrinkage),
    희소화(L1 벌점), 구조 부여(밴드·블록·크로네커) 등 다양한 방식으로 자유도를 제한하는 접근법 전체를 포괄하는
    용어입니다. Ledoit-Wolf, GLASSO, POET 등이 모두 이 범주에 속합니다.</p>`,
    formula: `&#931;&#770;&#7515;&#7559;&#7475; = argmin&#931; [ −log-likelihood(&#931;) + &#955;&#183;pen(&#931;) ] &nbsp;(pen(&#183;): L1, 프로베니우스, 랭크 등 벌점 함수)`,
    features: `<p><strong>장점</strong> — 표본 수가 부족한 고차원 상황에서도 가역이고 안정적인 공분산 추정치를
    보장합니다.</p>
    <p><strong>단점</strong> — 정규화 방식과 강도 선택에 따라 결과가 크게 달라져 교차검증 등 모형선택 절차가
    필요합니다.</p>`,
    applications: `<p>유전체·금융 등 변수 수가 표본 수를 초과하는 모든 고차원 다변량 분석의 공통 전처리 단계로
    사용됩니다.</p>`,
    sklearnFunction: 'LedoitWolf / GraphicalLasso / ShrunkCovariance',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/covariance.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.covariance.LedoitWolf.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/covariance/plot_covariance_estimation.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'thresholding-covariance',
    category: 'unsup',
    subcategory: 'density-covariance',
    title: '임계값 방법 (Thresholding Methods)',
    subtitle: '절댓값이 작은 공분산 원소를 0으로 만들어 희소성을 유도하는 가장 단순한 정규화 기법',
    overview: `<p>표본 공분산(또는 상관) 행렬의 각 원소에 대해 절댓값이 임계값 &#955; 미만이면 0으로, 이상이면 그대로
    두거나 크기를 줄여(soft-thresholding) 남기는 원소별(entry-wise) 정규화 방법입니다. GLASSO처럼 최적화 문제를
    풀 필요 없이 한 번의 연산으로 희소 공분산을 얻을 수 있습니다.</p>`,
    formula: `&#931;&#770;&#7522;&#7527;&#7515;&#7559; = &#931;&#770;&#7522;&#7527;&#183;1(|&#931;&#770;&#7522;&#7527;| &#8805; &#955;) &nbsp;(hard) &nbsp; 또는 &nbsp; sign(&#931;&#770;&#7522;&#7527;)&#183;max(|&#931;&#770;&#7522;&#7527;|−&#955;, 0) &nbsp;(soft)`,
    features: `<p><strong>장점</strong> — 계산이 원소별 단순 연산이라 매우 빠르고 대규모 행렬에도 즉시 적용
    가능합니다.</p>
    <p><strong>단점</strong> — 결과 행렬이 양의 정부호(positive semi-definite)를 보장하지 않아 후처리가 필요할 수
    있습니다.</p>`,
    applications: `<p>POET의 잔차 공분산 희소화 단계, 초고차원 유전체·이미지 데이터의 빠른 공분산 정규화 등에
    사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

  /* ================= [1.8.1] 군집화 평가지표 ================= */
  {
    id: 'aic-bic',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '아카이케/베이지안 정보기준 (AIC/BIC)',
    subtitle: '모형의 적합도와 복잡도(파라미터 수)를 함께 고려해 최적 모형·군집 수를 선택하는 정보기준',
    overview: `<p>로그우도가 클수록 좋은 모형이지만 파라미터가 많을수록 우도는 무조건 커지는 과적합 문제가 있어,
    파라미터 개수에 비례한 벌점을 빼서 균형을 맞춥니다. GMM의 성분 개수 K나 군집 개수 선택 등 "몇 개가 적절한가"를
    정하는 문제에 널리 쓰입니다.</p>`,
    formula: `AIC = 2k − 2ln(L&#770;),&nbsp;&nbsp; BIC = k&#183;ln(n) − 2ln(L&#770;) &nbsp;(k: 파라미터 수, L&#770;: 최대우도, n: 표본 수 — 값이 작을수록 좋음)`,
    features: `<p>값이 <strong>낮을수록</strong> 더 나은 모형으로 해석합니다. BIC는 표본 수 n에 대한 벌점(ln n)이
    AIC의 상수 벌점(2)보다 커서 더 단순한(파라미터가 적은) 모형을 선호하는 경향이 있습니다.</p>`,
    applications: `<p>GMM·군집화의 최적 군집 개수 K 선택, 회귀·시계열 모형의 변수 선택 및 차수 결정 등 모형 비교
    전반에 사용됩니다.</p>`,
    sklearnFunction: 'GaussianMixture.aic() / .bic()',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/mixture.html#selecting-the-number-of-components-in-a-classical-gaussian-mixture-model',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.mixture.GaussianMixture.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/mixture/plot_gmm_selection.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'calinski-harabasz-index',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '칼린스키-하라바츠 지수 (CHI, Calinski-Harabasz Index)',
    subtitle: '군집 간 분산과 군집 내 분산의 비율로 군집화 품질을 평가하는 정답 레이블 불필요 지표',
    overview: `<p>분산분석(ANOVA)의 F-통계량과 유사한 형태로, 군집 간 산포(between-cluster dispersion)가 군집 내
    산포(within-cluster dispersion)보다 상대적으로 클수록 군집이 잘 분리되었다고 판단합니다. 계산이 빠르고
    직관적이어서 K 선택에 자주 사용됩니다.</p>`,
    formula: `CHI = [tr(B&#7529;)/(k−1)] / [tr(W&#7529;)/(n−k)] &nbsp;(B&#7529;: 군집 간 분산행렬, W&#7529;: 군집 내 분산행렬, k: 군집 수, n: 표본 수)`,
    features: `<p>값이 <strong>높을수록</strong> 좋은 군집화이며, 볼록(convex)한 형태의 군집에서 특히 잘 작동합니다.
    계산이 실루엣보다 빨라 대용량 데이터의 K 탐색에 유리합니다.</p>`,
    applications: `<p>K-평균 등 분할 기반 군집화의 최적 군집 수 결정, 여러 군집화 알고리즘 결과의 상대 비교 등에
    사용됩니다.</p>`,
    sklearnFunction: 'calinski_harabasz_score',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/clustering.html#calinski-harabasz-index',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.metrics.calinski_harabasz_score.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'connectivity-index',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '연결성 (Connectivity)',
    subtitle: '각 데이터의 최근접 이웃들이 같은 군집에 속하는 정도를 측정하는 군집화 평가지표',
    overview: `<p>각 표본에 대해 가장 가까운 L개의 이웃을 찾고, 그 이웃이 자신과 다른 군집에 속할 때마다 거리 순위에
    반비례하는 벌점을 누적합니다. 국소적으로 인접한 데이터가 서로 다른 군집으로 쪼개지는 것을 얼마나 잘 피하는지를
    정량화합니다.</p>`,
    formula: `Conn(C) = &#8721;&#7522;&#8339;&#8321;&#7472; &#8721;&#8342;&#8339;&#8321;&#4670; x&#7522;,&#8340;&#8342; &nbsp;(x&#7522;,&#8340;&#8342;=1/j&nbsp;이면 i의 j번째 최근접이웃이 다른 군집, 아니면 0)`,
    features: `<p>값이 <strong>낮을수록</strong> 좋으며(0에 가까울수록 이웃 보존이 잘 됨), 특히 밀도기반·계층적
    군집화처럼 비볼록 군집 형태를 평가할 때 실루엣보다 적합합니다.</p>`,
    applications: `<p>DBSCAN·계층적 군집화 등 임의 형태 군집의 국소 응집도 평가, 여러 군집화 기법의 상대 비교
    (R의 clValid 패키지 등)에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'davies-bouldin-index',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '데이비스-볼딘 지수 (DBI, Davies-Bouldin Index)',
    subtitle: '가장 유사한(가까운) 군집 쌍 간의 유사도 평균으로 군집 분리도를 평가하는 지표',
    overview: `<p>각 군집에 대해 자기 자신과 가장 유사한 다른 군집을 찾아 "유사도"(군집 내 산포의 합을 군집 간
    중심거리로 나눈 값)를 계산하고, 이를 모든 군집에 대해 평균냅니다. 군집 내부는 조밀하고 군집 간 거리는 멀수록
    값이 작아집니다.</p>`,
    formula: `DBI = (1/k) &#8721;&#7522; max&#7522;&#8800;&#7527; [ (&#963;&#7522;+&#963;&#7527;) / d(c&#7522;,c&#7527;) ] &nbsp;(&#963;&#7522;: 군집 i 내부 평균거리, c&#7522;: 중심, d(c&#7522;,c&#7527;): 중심 간 거리)`,
    features: `<p>값이 <strong>낮을수록</strong> 좋은 군집화(최솟값 0)입니다. 계산이 빠르고 직관적이지만 볼록한
    형태의 군집에 유리하게 편향되는 경향이 있습니다. 군집화([1.8.1])뿐 아니라 차원축소 결과의 군집 분리도
    평가([1.8.3])에도 동일하게 사용됩니다.</p>`,
    applications: `<p>K-평균·GMM 등의 최적 군집 수 K 탐색, 차원축소 후 임베딩 공간에서의 군집 분리도 검증 등에
    사용됩니다.</p>`,
    sklearnFunction: 'davies_bouldin_score',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/clustering.html#davies-bouldin-index',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.metrics.davies_bouldin_score.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'dunn-index',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '던 지수 (DI, Dunn Index)',
    subtitle: '군집 간 최소거리와 군집 내 최대지름의 비율로 군집화 품질을 평가하는 지표',
    overview: `<p>모든 군집 쌍 사이의 거리 중 가장 가까운(최소) 거리를 분자로, 모든 군집 중 내부가 가장 넓게 퍼진
    (최대 지름) 군집을 분모로 두어 비율을 계산합니다. 군집 간 분리와 군집 내 응집을 동시에 극단값(min/max)으로
    반영하는 것이 특징입니다.</p>`,
    formula: `DI = min&#7522;&#8800;&#7527; d(C&#7522;,C&#7527;) / max&#8342; diam(C&#8342;) &nbsp;(d: 군집 간 최소거리, diam: 군집 내 최대 표본쌍 거리)`,
    features: `<p>값이 <strong>높을수록</strong> 좋은 군집화입니다. 다만 최소·최댓값만 사용하므로 이상치나 잡음에
    매우 민감하다는 단점이 있습니다.</p>`,
    applications: `<p>군집이 명확히 분리되고 이상치가 적은 정제된 데이터에서 군집 수 결정, 다른 지표(실루엣, CHI)와
    함께 교차검증용으로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'elbow-method',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '엘보 방법 (Elbow Method)',
    subtitle: '군집 수 K에 따른 군집내 제곱합(WCSS) 감소폭이 급격히 꺾이는 지점을 찾는 시각적 기법',
    overview: `<p>K를 1부터 늘려가며 WCSS(군집 내 제곱합)를 계산해 그래프로 그리면, K가 커질수록 WCSS는 단조
    감소하지만 특정 지점부터 감소폭이 급격히 완만해지는 "팔꿈치(elbow)" 형태가 나타납니다. 이 지점을 적절한
    군집 수로 선택합니다.</p>`,
    formula: `WCSS(K) = &#8721;&#8342;&#8339;&#8321;&#7472; &#8721;&#7522;&#8712;C&#8342; ||x&#7522;−&#956;&#8342;||&#178; &nbsp;(K에 대한 WCSS(K) 곡선의 변곡점을 육안 또는 2차 미분으로 탐지)`,
    features: `<p>정량적 임계값이 아닌 <strong>시각적 판단</strong>에 의존하는 것이 특징이며, 팔꿈치가 뚜렷하지 않은
    데이터에서는 주관적 해석 오차가 생길 수 있습니다.</p>`,
    applications: `<p>K-평균 등 분할 기반 군집화의 K 초기 탐색, 실루엣·갭 통계량 등 다른 지표와 함께 보조적으로
    사용됩니다.</p>`,
    sklearnFunction: 'KMeans.inertia_',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/clustering.html#k-means',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'gap-statistic',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '갭 통계량 (Gap Statistic)',
    subtitle: '실제 데이터의 군집 내 산포와 균등분포에서 기대되는 산포의 차이(갭)로 K를 선택하는 지표',
    overview: `<p>엘보 방법의 주관성을 보완하기 위해 Tibshirani 등이 제안했습니다. 실제 데이터의 로그(WCSS)와,
    데이터 범위 내에서 무작위로 생성한(균등분포) 참조 데이터셋들의 로그(WCSS) 기댓값 사이의 차이(gap)가 최대가
    되는 K를 선택합니다.</p>`,
    formula: `Gap(K) = E*[ln(WCSS&#8342;(K))] − ln(WCSS(K)) &nbsp;(E*: B개의 균등분포 참조 데이터셋에 대한 평균, 표준오차를 고려한 1-표준오차 규칙으로 최적 K 선택)`,
    features: `<p>값이 <strong>높을수록</strong> 좋으며, 엘보 방법과 달리 참조분포와의 통계적 비교를 통해 K 선택을
    객관화합니다. 단, 참조 데이터셋을 여러 번 생성·계산해야 해 비용이 큽니다.</p>`,
    applications: `<p>군집 구조가 뚜렷하지 않아 엘보 방법이 모호한 경우의 K 결정, 군집화 전처리 단계의 정량적
    K 선택 도구로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'silhouette-coefficient',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '실루엣 계수 (Silhouette Coefficient)',
    subtitle: '각 표본이 자신의 군집에 얼마나 잘 속하고 다른 군집과는 얼마나 잘 분리되는지 [-1,1]로 나타내는 지표',
    overview: `<p>각 표본 i에 대해 같은 군집 내 다른 표본들과의 평균거리 a(i)(응집도)와, 가장 가까운 다른 군집
    표본들과의 평균거리 b(i)(분리도)를 계산해 정규화한 값입니다. 표본별 값의 평균을 전체 군집화 품질 점수로
    사용하며, 정답 레이블 없이도 계산할 수 있어 가장 널리 쓰이는 군집 평가지표입니다.</p>`,
    formula: `s(i) = (b(i) − a(i)) / max(a(i), b(i)),&nbsp; s &#8712; [−1, 1]`,
    features: `<p>값이 <strong>1에 가까울수록</strong> 좋은 군집화, <strong>0</strong>은 군집 경계에 있음, <strong>음수</strong>는
    잘못된 군집 배정을 의미합니다. 볼록한 형태의 군집에 유리하며 계산 비용이 O(n&#178;)으로 대용량에서는 느립니다.</p>`,
    applications: `<p>K-평균·계층적 군집화 등 거의 모든 군집화 알고리즘의 K 선택 및 결과 품질 검증에 표준적으로
    사용됩니다.</p>`,
    sklearnFunction: 'silhouette_score / silhouette_samples',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/clustering.html#silhouette-coefficient',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.metrics.silhouette_score.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/cluster/plot_kmeans_silhouette_analysis.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'wcss',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '군집 내 제곱합 (WCSS, Within-Cluster Sum of Squares)',
    subtitle: '각 표본과 소속 군집 중심 간 거리 제곱의 총합으로 응집도를 나타내는 K-평균의 목적함수이자 평가지표',
    overview: `<p>K-평균이 최소화하는 목적함수 그 자체로, 각 표본과 자신이 속한 군집 중심 사이 유클리드 거리의
    제곱을 모두 더한 값입니다. 관성(inertia)이라고도 불리며 K가 커질수록 항상 감소하므로 단독으로는 K 선택
    기준이 되지 못하고 엘보 방법 등과 함께 사용됩니다.</p>`,
    formula: `WCSS = &#8721;&#8342;&#8339;&#8321;&#7472; &#8721;&#7522;&#8712;C&#8342; ||x&#7522; − &#956;&#8342;||&#178;`,
    features: `<p>값이 <strong>낮을수록</strong> 군집 내 응집도가 높습니다. K를 늘리면(극단적으로 K=n이면 0)
    무조건 감소하므로 K와 함께 해석해야 하며, 단독 지표로는 과적합(K 과다) 위험이 있습니다.</p>`,
    applications: `<p>K-평균의 학습 목적함수, 엘보 방법·갭 통계량 계산의 기초 통계량으로 사용됩니다.</p>`,
    sklearnFunction: 'KMeans.inertia_',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/clustering.html#k-means',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'xie-beni-index',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '자이-베니 지수 (XBI, Xie-Beni Index)',
    subtitle: '퍼지 군집화의 응집도와 최소 분리도의 비율로 품질을 평가하는 지표',
    overview: `<p>주로 퍼지 C-평균(Fuzzy C-Means)처럼 소속도(membership) &#956;&#7522;&#8342;를 사용하는 군집화에 적용됩니다.
    소속도로 가중된 군집 내 제곱합을 분자로, 군집 중심 간 최소 거리 제곱을 분모로 두어 응집도와 분리도를
    동시에 반영합니다.</p>`,
    formula: `XBI = [ &#8721;&#8342;&#8321;&#7472; &#8721;&#7522;&#8321;&#7480; &#956;&#7522;&#8342;&#7501; ||x&#7522;−c&#8342;||&#178; ] / [ n&#183;min&#7522;&#8800;&#7527; ||c&#7522;−c&#7527;||&#178; ] &nbsp;(m: 퍼지화 계수)`,
    features: `<p>값이 <strong>낮을수록</strong> 좋은 군집화입니다. 하드 군집화의 DBI와 유사한 역할을 퍼지 군집화
    맥락에서 수행합니다.</p>`,
    applications: `<p>퍼지 C-평균, 가능성 C-평균(Possibilistic C-Means) 등 소속도 기반 군집화의 최적 군집 수 및
    퍼지화 계수 선택에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

  /* ================= [1.8.2] 연관규칙 평가지표 ================= */
  {
    id: 'all-confidence',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '전체 신뢰도 (All-Confidence)',
    subtitle: '항목집합에 포함된 모든 개별 신뢰도 중 최솟값으로 정의되는 연관규칙 강도 지표',
    overview: `<p>항목집합 X&#8746;Y에 대해 가능한 모든 방향의 신뢰도(conf(X&#8594;Y), conf(Y&#8594;X) 등) 중 가장 작은 값을
    대표값으로 사용합니다. 지지도가 항목 개별 등장빈도보다 큰 부분집합이 없도록 보장하는 하한(lower bound)
    성질을 가져 빈발 패턴 마이닝의 가지치기에 활용됩니다.</p>`,
    formula: `all\\_conf(X&#8746;Y) = sup(X&#8746;Y) / max(sup(X), sup(Y))`,
    features: `<p>값의 범위는 <strong>[0,1]</strong>이며 높을수록 항목집합 내 모든 항목이 서로 강하게 동반 출현함을
    의미합니다. 반단조성(anti-monotone) 성질이 있어 효율적인 가지치기가 가능합니다.</p>`,
    applications: `<p>대용량 트랜잭션 데이터에서 강한 연관성을 갖는 항목집합만 남기는 빈발 패턴 마이닝의 가지치기
    기준으로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'certainty-factor',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '확실성 계수 (Certainty Factor)',
    subtitle: 'X가 주어졌을 때 Y에 대한 확신이 사전확률 대비 얼마나 증가·감소했는지 정규화한 지표',
    overview: `<p>규칙 X&#8594;Y의 신뢰도가 Y의 사전 지지도보다 얼마나 높은지를 [-1,1] 범위로 정규화합니다. 전문가시스템의
    불확실성 추론에서 유래한 지표로, 단순 신뢰도-지지도 차이보다 해석이 직관적입니다.</p>`,
    formula: `CF = (conf(X&#8594;Y) − sup(Y)) / (1 − sup(Y)),&nbsp; conf &#8805; sup(Y)일 때; &nbsp; CF = (conf(X&#8594;Y) − sup(Y)) / sup(Y),&nbsp; conf &lt; sup(Y)일 때`,
    features: `<p>값의 범위는 <strong>[-1,1]</strong>이며, <strong>양수</strong>는 X가 Y의 발생 확신을 높임, <strong>0</strong>은
    독립, <strong>음수</strong>는 X가 Y 발생 확신을 낮춤을 의미합니다.</p>`,
    applications: `<p>의료진단 규칙, 전문가시스템의 규칙 신뢰도 평가, 연관규칙의 방향성 있는 인과적 해석이 필요한
    분야에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'chi-square-test',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '카이제곱 검정 (Chi-Square Test)',
    subtitle: 'X와 Y의 2×2 분할표에서 관측빈도와 독립가정 기대빈도의 차이로 연관성의 통계적 유의성을 검정',
    overview: `<p>X, Y 각각의 존재 여부로 만든 2×2 분할표에서, 두 항목이 통계적으로 독립이라는 귀무가설 하의 기대빈도와
    실제 관측빈도의 차이를 합산합니다. Lift와 달리 연관성의 방향(양/음)과 통계적 유의성을 함께 검정할 수
    있습니다.</p>`,
    formula: `&#967;&#178; = &#8721;&#7522; (O&#7522; − E&#7522;)&#178; / E&#7522; &nbsp;(O&#7522;: 분할표의 관측빈도, E&#7522;: 독립가정 하의 기대빈도, 자유도 1인 &#967;&#178;분포와 비교)`,
    features: `<p>값이 <strong>클수록</strong> 독립가정으로부터 벗어남(강한 연관성, 양/음 방향은 별도 확인 필요)을
    의미합니다. 기대빈도가 작은(희귀 항목) 경우 근사가 부정확해질 수 있습니다.</p>`,
    applications: `<p>연관규칙의 통계적 유의성 검정, 우연에 의한 거짓 연관(spurious association) 필터링 등에
    사용됩니다.</p>`,
    sklearnFunction: 'scipy.stats.chi2_contingency',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'collective-strength',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '집합 강도 (Collective Strength)',
    subtitle: '항목집합의 실제 동시 발생/비발생 빈도와 독립가정 기대치의 비율로 결속력을 측정하는 지표',
    overview: `<p>X와 Y가 함께 나타나는 경우와 둘 다 나타나지 않는 경우(위반이 없는 경우)의 관측 비율을, 독립을
    가정했을 때의 기대 비율로 나눈 값에 위반 여부에 대한 보정항을 곱해 계산합니다. 값이 1이면 독립, 1보다 크면
    양의 연관을 의미합니다.</p>`,
    formula: `CS(X,Y) = [ (P(XY)+P(&#172;X&#172;Y)) / (P(X)P(Y)+P(&#172;X)P(&#172;Y)) ] &#183; [ (1−P(X)P(Y)−P(&#172;X)P(&#172;Y)) / (1−P(XY)−P(&#172;X&#172;Y)) ]`,
    features: `<p>값이 <strong>1보다 크면</strong> 양의 연관, <strong>1이면</strong> 독립, <strong>1보다 작으면</strong>
    음의 연관을 의미합니다. 범위는 [0,&#8734;)입니다.</p>`,
    applications: `<p>항목집합 전체의 결속력(동시발생+동시비발생을 함께 고려)을 평가해야 하는 시장바구니 분석 등에
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
    id: 'confidence-metric',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '신뢰도 (Confidence)',
    subtitle: 'X를 포함하는 거래 중 Y도 함께 포함하는 비율 — 연관규칙의 가장 기본적인 강도 지표',
    overview: `<p>규칙 X&#8594;Y에서 조건부확률 P(Y|X)를 그대로 사용하는 지표로, 지지도와 함께 Apriori·FP-Growth 등
    빈발 패턴 마이닝 알고리즘이 규칙을 생성할 때 가장 먼저 적용하는 최소 임계값 기준입니다.</p>`,
    formula: `conf(X&#8594;Y) = sup(X&#8746;Y) / sup(X) = P(Y|X)`,
    features: `<p>값의 범위는 <strong>[0,1]</strong>이며 높을수록 X가 있을 때 Y가 함께 나타날 확률이 높음을 의미합니다.
    다만 Y 자체의 발생 빈도가 원래 높으면 X와 무관하게 신뢰도가 높게 나올 수 있어(Lift로 보완 필요) 왜곡될
    수 있습니다.</p>`,
    applications: `<p>시장바구니 분석의 추천규칙 생성, 장바구니 진열·프로모션 설계 등 연관규칙 마이닝 전반의
    기본 임계값으로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'conviction',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '확신도 (Conviction)',
    subtitle: 'X가 있는데도 Y가 없을 확률을, 독립일 때 기대되는 확률과 비교하는 방향성 있는 지표',
    overview: `<p>Lift가 곱셈적 대칭 지표인 것과 달리, 확신도는 규칙의 방향(X&#8594;Y)을 반영해 "X는 있지만 Y는 없는"
    반증 사례가 독립가정 대비 얼마나 드문지를 측정합니다. 함의(implication) 관계의 강도를 논리적으로 더 잘
    반영한다고 알려져 있습니다.</p>`,
    formula: `conv(X&#8594;Y) = [1 − sup(Y)] / [1 − conf(X&#8594;Y)]`,
    features: `<p>값이 <strong>1</strong>이면 X와 Y가 독립, <strong>1보다 크면</strong> 양의 연관(값이 무한대이면
    완전 함의: conf=1)을 의미합니다. conf(X&#8594;Y)=1일 때 분모가 0이 되어 무한대로 발산합니다.</p>`,
    applications: `<p>Lift만으로는 구분되지 않는 규칙의 방향성 있는 함의 강도 비교, 연관규칙의 순위화(ranking)에
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
    id: 'information-gain-rule',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '정보 이득 (Information Gain)',
    subtitle: 'X를 알았을 때 Y의 불확실성(엔트로피)이 얼마나 줄어드는지로 연관성을 측정하는 정보이론적 지표',
    overview: `<p>결정트리의 분기 기준으로 쓰이는 정보이득과 동일한 개념을 연관규칙 평가에 적용한 것으로, X라는
    조건을 앎으로써 Y의 엔트로피가 얼마나 감소하는지를 계산합니다. 확률적 의존성을 지지도·신뢰도와는 다른
    정보이론 관점에서 정량화합니다.</p>`,
    formula: `IG(Y;X) = H(Y) − H(Y|X) = &#8721;&#7522;&#7500;&#8320;&#8321;&#7472; &#8721;&#7522;&#7500;&#8320;&#8321;&#7472; P(x,y)&#183;log[ P(x,y) / (P(x)P(y)) ]`,
    features: `<p>값이 <strong>0</strong>이면 X와 Y가 통계적으로 독립, <strong>클수록</strong> 두 변수 간 상호
    의존성이 강함을 의미합니다. 항상 0 이상입니다.</p>`,
    applications: `<p>연관규칙의 특성 선택, 규칙 후보 중 정보량이 큰 규칙 우선순위화 등에 사용됩니다.</p>`,
    sklearnFunction: 'mutual_info_score',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mutual_info_score.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mutual_info_score.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'jaccard-coefficient',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '자카드 계수 (Jaccard Coefficient)',
    subtitle: 'X와 Y가 함께 나타난 거래 수를, 둘 중 하나라도 나타난 거래 수로 나눈 집합 유사도 지표',
    overview: `<p>집합의 교집합 크기를 합집합 크기로 나누는 자카드 유사도를, 항목 X·Y가 등장한 거래 집합에 그대로
    적용한 지표입니다. Lift와 달리 대칭적(symmetric)이며 0~1로 정규화되어 해석이 직관적입니다.</p>`,
    formula: `J(X,Y) = sup(X&#8746;Y) / [ sup(X) + sup(Y) − sup(X&#8746;Y) ]`,
    features: `<p>값의 범위는 <strong>[0,1]</strong>이며 높을수록 두 항목이 강하게 동반 출현합니다. 두 항목 모두
    빈도가 낮으면 우연히도 값이 높게 나올 수 있어 해석에 주의가 필요합니다.</p>`,
    applications: `<p>항목 간 유사도 기반 추천, 연관규칙의 대칭적 강도 비교 등에 사용됩니다.</p>`,
    sklearnFunction: 'jaccard_score',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/model_evaluation.html#jaccard-similarity-coefficient-score',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.metrics.jaccard_score.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'kulczynski-measure',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '쿨친스키 측도 (Kulczynski Measure)',
    subtitle: 'X→Y와 Y→X 두 방향 신뢰도의 평균으로 연관 강도를 측정하는 대칭적 지표',
    overview: `<p>단일 방향의 신뢰도가 항목의 빈도 불균형에 취약한 문제를 보완하기 위해, 두 방향(conf(X&#8594;Y),
    conf(Y&#8594;X))의 산술평균을 사용합니다. 불균형도(imbalance ratio)와 함께 사용하면 왜곡된 지지도·Lift 값의
    함정을 피할 수 있다고 알려져 있습니다.</p>`,
    formula: `Kulc(X,Y) = 0.5&#183;[ conf(X&#8594;Y) + conf(Y&#8594;X) ] = 0.5&#183;[ P(Y|X) + P(X|Y) ]`,
    features: `<p>값의 범위는 <strong>[0,1]</strong>이며, 항목의 빈도가 매우 불균형한(null-invariant 하지 않은)
    데이터셋에서 Lift·Jaccard보다 안정적으로 해석되는 경우가 많습니다.</p>`,
    applications: `<p>항목 빈도가 극단적으로 치우친 대용량 트랜잭션 데이터의 연관성 평가, 불균형도 지표와 결합한
    규칙 필터링에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'leverage-metric',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '레버리지 (Leverage)',
    subtitle: 'X와 Y의 실제 동시발생 확률과 독립가정 하의 기대 확률의 차이(뺄셈 기반 지표)',
    overview: `<p>Lift가 두 확률의 비율(나눗셈)을 보는 것과 달리, 레버리지는 차이(뺄셈)로 연관성을 측정합니다.
    독립일 때 기대되는 동시발생확률보다 실제로 얼마나 더(또는 덜) 자주 함께 나타나는지를 절대적인 확률 단위로
    보여줍니다.</p>`,
    formula: `Leverage(X,Y) = P(X,Y) − P(X)&#183;P(Y) = sup(X&#8746;Y) − sup(X)&#183;sup(Y)`,
    features: `<p>값이 <strong>0</strong>이면 독립, <strong>양수</strong>면 양의 연관, <strong>음수</strong>면 음의
    연관을 의미하며 범위는 [-0.25, 0.25]입니다. Lift와 달리 절대적 빈도 규모도 함께 반영합니다.</p>`,
    applications: `<p>Lift가 희귀 항목에서 과대평가되는 문제를 보완하는 보조지표, 규칙의 실질적 영향력(절대
    빈도 기준) 평가에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'lift-metric',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '향상도 (Lift)',
    subtitle: 'X와 Y가 독립일 때보다 실제로 얼마나 더(배수로) 함께 나타나는지를 측정하는 대표적 연관규칙 지표',
    overview: `<p>신뢰도만으로는 Y 자체가 원래 흔한 항목이라 신뢰도가 높게 나오는 함정을 피하기 어려운데, 향상도는
    신뢰도를 Y의 사전 지지도로 나누어 이 함정을 보정합니다. 지지도·신뢰도와 함께 연관규칙 마이닝에서 가장
    널리 쓰이는 3대 지표 중 하나입니다.</p>`,
    formula: `Lift(X&#8594;Y) = conf(X&#8594;Y) / sup(Y) = P(X,Y) / [P(X)&#183;P(Y)]`,
    features: `<p>값이 <strong>1</strong>이면 X와 Y가 독립, <strong>1보다 크면</strong> 양의 연관(함께 나타나기 쉬움),
    <strong>1보다 작으면</strong> 음의 연관(서로 배타적)을 의미합니다.</p>`,
    applications: `<p>시장바구니 분석의 상품 진열·묶음판매 전략 수립, 추천시스템의 연관상품 추천, 교차판매(cross-sell)
    규칙 평가 등에 가장 널리 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'odds-ratio',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '오즈비 (Odds Ratio)',
    subtitle: '2×2 분할표에서 X가 있을 때 Y가 있을 오즈와 X가 없을 때 Y가 있을 오즈의 비율',
    overview: `<p>통계학·역학 연구에서 널리 쓰이는 오즈비를 연관규칙 평가에 적용한 것으로, 분할표의 네 셀(a,b,c,d)의
    곱으로 간단히 계산됩니다. Yule's Q, Yule's Y 등 여러 지표가 오즈비를 기반으로 정규화된 형태입니다.</p>`,
    formula: `OR = (a&#183;d) / (b&#183;c) &nbsp;(a=count(X,Y), b=count(X,&#172;Y), c=count(&#172;X,Y), d=count(&#172;X,&#172;Y))`,
    features: `<p>값이 <strong>1</strong>이면 독립, <strong>1보다 크면</strong> 양의 연관, <strong>1보다 작으면</strong>
    음의 연관을 의미하며 범위는 [0,&#8734;)입니다.</p>`,
    applications: `<p>역학 연구의 위험요인-질병 연관성 분석에서 유래했으며, 연관규칙의 통계적 강도 비교, Yule
    지표들의 계산 기초로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'phi-coefficient',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '파이 계수 (Phi Coefficient, φ)',
    subtitle: '두 이진 변수 간의 피어슨 상관계수에 해당하는 연관성 지표',
    overview: `<p>X, Y를 각각 0/1의 이진 변수로 보았을 때의 피어슨 상관계수와 수학적으로 동일하며, 카이제곱
    통계량과도 &#966;=&#8730;(&#967;&#178;/n) 관계로 연결됩니다. 대칭적이고 [-1,1]로 정규화되어 있어 해석이 직관적입니다.</p>`,
    formula: `&#966; = [P(X,Y) − P(X)P(Y)] / &#8730;[P(X)P(&#172;X)P(Y)P(&#172;Y)]`,
    features: `<p>값의 범위는 <strong>[-1,1]</strong>이며, <strong>0</strong>은 독립, <strong>양수/음수</strong>는
    각각 양/음의 연관을 나타냅니다. 두 이진변수 간 선형상관을 측정하는 표준적 방법입니다.</p>`,
    applications: `<p>이진 속성 간 연관성의 표준화된 비교, 카이제곱검정 유의성과 함께 사용하는 효과크기 지표로
    쓰입니다.</p>`,
    sklearnFunction: 'matthews_corrcoef',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/model_evaluation.html#matthews-correlation-coefficient',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.metrics.matthews_corrcoef.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'piatetsky-shapiro',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '피아텟스키-샤피로 측도 (Piatetsky-Shapiro Measure)',
    subtitle: '레버리지와 동일한 원리로 관측빈도와 기대빈도의 차이를 규칙 흥미도로 사용하는 초기 지표',
    overview: `<p>연관규칙의 "흥미도(interestingness)"라는 개념을 1991년 최초로 정식화한 지표 중 하나로, 실제
    동시발생 빈도와 독립가정 하의 기대빈도의 차이를 표본 수 N으로 스케일링합니다. 레버리지와 본질적으로
    동일한 뺄셈 기반 원리를 공유합니다.</p>`,
    formula: `PS(X,Y) = N&#183;[ P(X,Y) − P(X)P(Y) ] = count(X,Y) − N&#183;P(X)&#183;P(Y)`,
    features: `<p>값이 <strong>0</strong>이면 독립, <strong>양수</strong>면 양의 연관, <strong>음수</strong>면 음의
    연관을 의미합니다.</p>`,
    applications: `<p>연관규칙 흥미도 척도의 이론적 기초, 다른 뺄셈 기반 지표(레버리지 등)와의 비교연구에
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
    id: 'support-metric',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '지지도 (Support)',
    subtitle: '전체 거래 중 항목집합이 실제로 등장하는 비율 — 연관규칙 마이닝의 가장 기본적인 빈도 지표',
    overview: `<p>항목집합 X(또는 X∪Y)가 전체 거래 데이터에서 나타나는 비율로, Apriori 알고리즘의 반단조성(항목이
    많을수록 지지도는 감소하거나 유지) 성질을 이용한 가지치기의 기준이 되는 가장 근본적인 지표입니다.</p>`,
    formula: `sup(X) = count(X) / N,&nbsp;&nbsp; sup(X&#8594;Y) = sup(X&#8746;Y) = count(X&#8746;Y) / N`,
    features: `<p>값의 범위는 <strong>[0,1]</strong>이며, 최소 지지도(min_support) 임계값 이상인 항목집합만 "빈발
    항목집합(frequent itemset)"으로 간주합니다.</p>`,
    applications: `<p>Apriori·FP-Growth 등 모든 빈발 패턴 마이닝 알고리즘의 1차 필터링 기준, 신뢰도·향상도 계산의
    분모/분자 구성요소로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'yules-q',
    category: 'unsup',
    subcategory: 'evaluation',
    title: "율의 Q (Yule's Q)",
    subtitle: '오즈비를 [-1,1] 범위로 정규화한 연관성 지표',
    overview: `<p>오즈비 OR을 (OR−1)/(OR+1) 형태로 변환하여 값의 범위를 [-1,1]로 정규화한 지표입니다. 2×2 분할표의
    네 셀만으로 계산되며 감마 계수(Goodman-Kruskal gamma)의 2×2 특수 사례와 동일합니다.</p>`,
    formula: `Q = (ad − bc) / (ad + bc) &nbsp;(a=count(X,Y), b=count(X,&#172;Y), c=count(&#172;X,Y), d=count(&#172;X,&#172;Y))`,
    features: `<p>값의 범위는 <strong>[-1,1]</strong>이며, <strong>0</strong>은 독립, 부호는 연관의 방향을 나타냅니다.
    오즈비보다 해석과 비교가 쉽습니다.</p>`,
    applications: `<p>이진 변수 간 연관성의 정규화된 비교, 사회과학·역학 연구에서의 연관성 강도 보고 등에
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
    id: 'yules-y',
    category: 'unsup',
    subcategory: 'evaluation',
    title: "율의 Y (Yule's Y)",
    subtitle: '오즈비의 제곱근을 이용해 정규화한, Q보다 값의 변화가 완만한 연관성 지표',
    overview: `<p>Yule's Q와 마찬가지로 오즈비 기반이지만, 분할표 셀 값에 제곱근을 취해 계산함으로써 극단적인 오즈비
    값에 덜 민감하도록(변화가 완만하도록) 만든 지표입니다. "동틀림 계수(coefficient of colligation)"라고도
    불립니다.</p>`,
    formula: `Y = (&#8730;(ad) − &#8730;(bc)) / (&#8730;(ad) + &#8730;(bc))`,
    features: `<p>값의 범위는 <strong>[-1,1]</strong>이며, Yule's Q보다 극단값에서의 변화 폭이 완만해 이상치에
    다소 강건합니다.</p>`,
    applications: `<p>Yule's Q와 함께 이진 변수 간 연관성 비교, 극단적 분포를 갖는 분할표의 안정적 연관성 평가에
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
    id: 'zhangs-metric',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '장 측도 (Zhang\'s Metric)',
    subtitle: '양/음의 연관성을 하나의 척도로 [-1,1] 범위에서 함께 표현하는 통합 지표',
    overview: `<p>Lift·Leverage 등 대부분의 지표가 양의 연관과 음의 연관을 비대칭적으로 표현하는 문제를 보완하기
    위해, 분모를 양/음의 상황에 따라 다르게 정규화하여 하나의 척도로 통합한 지표입니다.</p>`,
    formula: `Zhang(X,Y) = [P(X,Y) − P(X)P(Y)] / max[ P(X,Y)(1−P(X)), P(X)(P(Y)−P(X,Y)) ]`,
    features: `<p>값의 범위는 <strong>[-1,1]</strong>이며, <strong>양수</strong>는 양의 연관, <strong>음수</strong>는
    음의 연관, <strong>0</strong>은 독립을 의미합니다. null-invariance(항목 빈도 왜곡에 덜 민감) 성질이
    비교적 우수합니다.</p>`,
    applications: `<p>양/음 연관성을 동시에 비교해야 하는 종합적 연관규칙 평가, 다른 지표 간 비교연구의 기준
    지표로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

  /* ================= [1.8.3] 차원축소 평가지표 =================
     [참고] DBI(Davies-Bouldin Index)는 [1.8.1.04]에서, Silhouette Score는 [1.8.1.08] Silhouette
     Coefficient와 동일 지표이므로 여기서는 중복 작성하지 않고 해당 항목의 applications에 차원축소
     맥락(임베딩 공간에서의 군집 분리도 평가)을 함께 기술했습니다. KL Divergence도 [1.8.6.06]에서
     한 번만 작성하고 중복하지 않았습니다(동일 수식·정의). */
  {
    id: 'continuity-metric',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '연속성 (Continuity)',
    subtitle: '원공간에서 가까웠던 이웃이 축소된 공간에서도 가까이 유지되는 정도를 측정하는 지표',
    overview: `<p>Trustworthiness와 쌍을 이루는 지표로, 원공간의 k-최근접 이웃이 저차원 임베딩에서 이웃 목록에서
    빠지는 경우(원래 가까웠는데 멀어짐, "누락된 이웃")에 벌점을 부과합니다. Trustworthiness가 "거짓 이웃"을
    벌하는 것과 반대 방향의 오류를 측정합니다.</p>`,
    formula: `Continuity = 1 − (2/(nk(2n−3k−1))) &#8721;&#7522;&#8339;&#8321;&#7480; &#8721;&#7527;&#8712;U&#8342;(k) (r(i,j) − k) &nbsp;(U&#8342;(k): 원공간 이웃이었으나 임베딩에서 빠진 점, r(i,j): 임베딩 공간 순위)`,
    features: `<p>값의 범위는 <strong>[0,1]</strong>이며 <strong>1에 가까울수록</strong> 좋습니다(원래 이웃 관계가
    잘 보존됨). Trustworthiness와 함께 사용해야 임베딩의 전체적인 이웃 보존 품질을 온전히 평가할 수
    있습니다.</p>`,
    applications: `<p>t-SNE, UMAP 등 비선형 차원축소 결과의 이웃구조 보존 품질 검증에 Trustworthiness와 함께
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
    id: 'cumulative-explained-variance',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '누적 설명 분산 (Cumulative Explained Variance)',
    subtitle: '상위 k개 주성분이 전체 분산 중 누적으로 설명하는 비율',
    overview: `<p>PCA에서 각 주성분이 설명하는 분산 비율(explained variance ratio)을 큰 순서대로 누적하여 합산한
    값입니다. 원하는 정보 보존 수준(예: 95%)을 만족하는 최소 주성분 개수 k를 정하는 데 직접적으로 사용됩니다.</p>`,
    formula: `CEV(k) = &#8721;&#7522;&#8339;&#8321;&#7472; &#955;&#7522; / &#8721;&#7527;&#8339;&#8321;&#7480; &#955;&#7527; &nbsp;(&#955;&#7522;: i번째 주성분의 고유값, 내림차순 정렬)`,
    features: `<p>값의 범위는 <strong>[0,1]</strong>이며 k가 증가할수록 단조 증가합니다. 스크리 플롯과 함께
    "몇 개의 주성분을 남길 것인가"를 결정하는 데 사용됩니다.</p>`,
    applications: `<p>PCA 기반 차원축소에서 주성분 개수 결정, 데이터 압축률과 정보 손실의 트레이드오프 분석에
    사용됩니다.</p>`,
    sklearnFunction: 'PCA.explained_variance_ratio_.cumsum()',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/decomposition.html#pca',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/decomposition/plot_pca_vs_lda.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'explained-variance-ratio',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '설명된 분산 비율 (Explained Variance Ratio)',
    subtitle: '각 주성분 하나가 전체 분산 중 차지하는 비율',
    overview: `<p>PCA로 얻은 각 주성분의 고유값을 전체 고유값의 합으로 나눈 값으로, 해당 주성분이 원본 데이터의
    분산(정보량)을 얼마나 설명하는지를 나타냅니다. 누적 설명 분산의 개별 항입니다.</p>`,
    formula: `EVR&#7522; = &#955;&#7522; / &#8721;&#7527; &#955;&#7527;`,
    features: `<p>값의 범위는 <strong>[0,1]</strong>이며 각 주성분 간 순위·상대적 중요도를 비교하는 데 사용됩니다.
    첫 몇 개 주성분의 비율이 크게 높으면 데이터가 저차원 구조를 강하게 가짐을 시사합니다.</p>`,
    applications: `<p>PCA·인자분석의 주성분 개수 결정, 스크리 플롯의 y축 값으로 사용됩니다.</p>`,
    sklearnFunction: 'PCA.explained_variance_ratio_',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/decomposition.html#pca',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'lcmc',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '지역 연속성 메타기준 (LCMC, Local Continuity Meta-Criterion)',
    subtitle: '무작위 임베딩 대비 초과 성능을 측정하도록 이웃보존 지표를 보정한 메타 기준',
    overview: `<p>Trustworthiness·Continuity와 유사하게 k-이웃 일치도를 사용하지만, 완전히 무작위인 임베딩에서
    기대되는 우연한 일치 정도를 빼서 "무작위 대비 얼마나 더 잘 보존했는가"를 측정하도록 보정한 지표입니다.
    여러 차원축소 기법의 이웃 보존 성능을 공정하게 비교하기 위해 제안되었습니다.</p>`,
    formula: `LCMC(k) = (k/(n−1)) + (1/(nk)) &#8721;&#7522;&#8339;&#8321;&#7480; |N&#7522;&#7480;&#8756;(k) &#8745; N&#7522;&#7500;(k)| − k&#178;/(n−1) &nbsp;(N&#7522;&#7480;&#8756;,N&#7522;&#7500;: 원공간·임베딩 공간의 k-이웃 집합)`,
    features: `<p>값이 <strong>높을수록</strong> 우연한 일치 대비 실제 이웃 보존 성능이 우수함을 의미합니다.
    이웃 크기 k에 대한 민감도가 Trustworthiness보다 낮다고 보고됩니다.</p>`,
    applications: `<p>t-SNE·Isomap·LLE 등 여러 매니폴드 학습 기법의 이웃보존 성능을 공정하게 비교하는 벤치마크
    연구에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'mse-reconstruction',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '평균 제곱 오차 (MSE, Mean Squared Error) — 차원축소 재구성',
    subtitle: '축소된 차원에서 원공간으로 복원한 값과 원본 값의 차이를 제곱 평균한 재구성 품질 지표',
    overview: `<p>PCA·오토인코더 등으로 데이터를 저차원으로 압축한 뒤 다시 원차원으로 복원(reconstruct)했을 때,
    원본과 복원값의 차이를 제곱해 평균한 값입니다. 값이 작을수록 저차원 표현이 원본 정보를 적게 손실하고
    보존했음을 의미합니다.</p>`,
    formula: `MSE = (1/n) &#8721;&#7522; ||x&#7522; − x&#770;&#7522;||&#178; &nbsp;(x&#770;&#7522;: 저차원 임베딩에서 복원한 값)`,
    features: `<p>값이 <strong>낮을수록</strong> 좋은 재구성(정보 손실이 적음)을 의미합니다. 스케일에 의존적이므로
    변수 표준화 여부에 따라 값의 크기가 달라집니다.</p>`,
    applications: `<p>PCA·오토인코더의 압축 차원 수 결정, 여러 차원축소 기법의 정보 손실 정도 비교에
    사용됩니다.</p>`,
    sklearnFunction: 'mean_squared_error',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/model_evaluation.html#mean-squared-error',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'mutual-information',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '상호 정보량 (Mutual Information)',
    subtitle: '두 변수(또는 원공간과 임베딩)가 서로에 대해 공유하는 정보의 양을 측정하는 정보이론적 지표',
    overview: `<p>두 확률변수의 결합분포와 각 주변분포의 곱 사이의 KL발산으로 정의되며, 선형 상관계수와 달리
    비선형적 의존관계까지 포착합니다. 차원축소 평가에서는 원본 데이터와 축소된 표현 간의 정보 보존 정도를
    측정하는 데 사용됩니다.</p>`,
    formula: `I(X;Y) = &#8721;&#7522;&#8321;&#7527; P(x&#7522;,y&#7527;)&#183;log[ P(x&#7522;,y&#7527;) / (P(x&#7522;)P(y&#7527;)) ] = H(X) − H(X|Y)`,
    features: `<p>값이 <strong>0</strong>이면 두 변수가 독립, <strong>클수록</strong> 정보 공유(의존성)가 강함을
    의미합니다. 정규화된 버전(NMI)은 [0,1]로 스케일이 조정됩니다.</p>`,
    applications: `<p>차원축소 표현의 정보 보존 검증, 특성 선택에서 타깃 변수와의 비선형 연관성 평가 등에
    사용됩니다.</p>`,
    sklearnFunction: 'mutual_info_score / normalized_mutual_info_score',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/clustering.html#mutual-information-based-scores',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mutual_info_score.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'neighborhood-preservation',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '이웃 보존성 (Neighborhood Preservation)',
    subtitle: '원공간의 k-최근접 이웃 집합이 저차원 임베딩에서도 동일하게 유지되는 비율',
    overview: `<p>각 표본에 대해 원공간에서의 k-최근접 이웃 집합과 임베딩 공간에서의 k-최근접 이웃 집합이 얼마나
    겹치는지(교집합 비율)를 계산해 전체 표본에 대해 평균냅니다. Trustworthiness·Continuity보다 계산이 단순한
    이웃보존 지표입니다.</p>`,
    formula: `NP(k) = (1/n) &#8721;&#7522;&#8339;&#8321;&#7480; |N&#7522;&#7480;&#8756;(k) &#8745; N&#7522;&#7500;(k)| / k`,
    features: `<p>값의 범위는 <strong>[0,1]</strong>이며 <strong>1에 가까울수록</strong> 국소 이웃구조가 완벽히
    보존됨을 의미합니다. 이웃 크기 k 선택에 따라 결과가 달라질 수 있습니다.</p>`,
    applications: `<p>t-SNE·UMAP·LLE 등 매니폴드 학습 결과의 국소구조 보존 검증, 차원축소 기법 간 벤치마크
    비교에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'procrustes-analysis',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '프로크루스테스 분석 (Procrustes Analysis)',
    subtitle: '회전·이동·크기조정으로 두 좌표 형상을 최적 정렬한 뒤 남는 잔차로 임베딩 품질을 평가',
    overview: `<p>저차원 임베딩과 원본(또는 다른 기준) 좌표 배치가 회전·평행이동·균일 크기조정만 다를 뿐 본질적으로
    같은 형상인지를 평가합니다. 두 형상을 최적으로 정렬(직교 프로크루스테스 문제)한 후 남는 제곱합 잔차를
    비유사도로 사용합니다.</p>`,
    formula: `d&#178;(X,Y) = min&#8322;,&#946;,&#964; ||X − &#946;YQ − 1&#964;&#7511;||&#7529; &nbsp;(Q: 직교회전행렬, &#946;: 크기조정, &#964;: 이동, ||&#183;||&#7529;: 프로베니우스 노름)`,
    features: `<p>값이 <strong>0에 가까울수록</strong> 두 형상이 회전·이동·크기와 무관하게 일치함을 의미합니다.
    다차원척도법(MDS) 결과 간 비교, 여러 실행 결과의 안정성 검증에 적합합니다.</p>`,
    applications: `<p>MDS·형상분석(shape analysis)의 임베딩 안정성 검증, 서로 다른 차원축소 기법 결과의 형상
    유사도 비교에 사용됩니다.</p>`,
    sklearnFunction: 'scipy.spatial.procrustes',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'reconstruction-error',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '재구성 오류 (Reconstruction Error)',
    subtitle: '저차원 표현에서 원공간으로 복원한 값이 원본과 얼마나 다른지를 나타내는 차원축소의 핵심 품질지표',
    overview: `<p>PCA·오토인코더 등 압축-복원이 가능한 차원축소 기법에서, 인코딩된 저차원 벡터를 다시 디코딩했을
    때 원본과의 차이를 정량화한 값입니다. MSE, 프로베니우스 노름 등 다양한 거리 척도로 구체화될 수 있는
    포괄적 개념입니다.</p>`,
    formula: `RE = ||X − X&#770;||&#7529;&#178; = ||X − X&#183;W&#183;W&#7511;||&#7529;&#178; &nbsp;(PCA의 경우, W: 상위 k개 주성분 적재행렬)`,
    features: `<p>값이 <strong>낮을수록</strong> 좋은 차원축소(정보 손실 최소화)를 의미합니다. 차원 수 k가
    늘어날수록 단조 감소하므로 압축률과의 트레이드오프로 해석해야 합니다.</p>`,
    applications: `<p>PCA·오토인코더의 최적 잠재차원 수 결정, 이상치 탐지(재구성 오류가 큰 표본을 이상치로 판정)
    등에 사용됩니다.</p>`,
    sklearnFunction: 'PCA (inverse_transform 후 mean_squared_error)',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/decomposition.html#pca',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'sammon-error',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '새먼 오차 (Sammon Error / Sammon Stress)',
    subtitle: '가까운 점들의 거리 보존에 더 큰 가중치를 두는 MDS 스트레스의 변형',
    overview: `<p>일반 MDS 스트레스가 모든 점 쌍의 거리 오차를 동일하게 취급하는 것과 달리, 새먼 매핑은 원공간에서
    거리가 가까웠던 쌍의 오차에 1/d&#7522;&#7527;로 가중치를 부여해 국소구조 보존을 더 중시합니다. Sammon Mapping 알고리즘의
    목적함수이자 평가지표입니다.</p>`,
    formula: `E = (1/&#8721;&#7522;&lt;&#7527; d&#7522;&#7527;) &#8721;&#7522;&lt;&#7527; [(d&#7522;&#7527; − d&#770;&#7522;&#7527;)&#178; / d&#7522;&#7527;] &nbsp;(d&#7522;&#7527;: 원공간 거리, d&#770;&#7522;&#7527;: 임베딩 공간 거리)`,
    features: `<p>값이 <strong>낮을수록</strong> 좋으며, 가중치 1/d&#7522;&#7527; 덕분에 가까운 이웃 관계 보존을 우선시하는
    임베딩 평가에 적합합니다.</p>`,
    applications: `<p>새먼 매핑 및 비선형 차원축소 결과의 국소구조 보존 평가, 시각화 목적의 임베딩 품질 검증에
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
    id: 'scree-plot',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '스크리 플롯 (Scree Plot)',
    subtitle: '주성분 번호에 따른 고유값(또는 설명분산)의 감소 추이를 시각화해 적정 차원 수를 판단하는 도구',
    overview: `<p>PCA의 각 주성분을 고유값이 큰 순서대로 x축에 나열하고 y축에 고유값(또는 설명 분산 비율)을 그린
    꺾은선 그래프입니다. 엘보 방법과 유사하게, 그래프의 기울기가 완만해지는 지점("돌무더기 비탈"이라는 이름의
    유래) 이전까지의 주성분만 채택합니다.</p>`,
    formula: `Plot: (i, &#955;&#7522;) &nbsp;for i=1,...,p &nbsp;(&#955;&#7522;: i번째 주성분의 고유값, 내림차순)`,
    features: `<p>정량적 임계값보다는 <strong>시각적 판단</strong>에 의존합니다. 급격한 하락 이후 완만해지는
    지점을 "적정 차원 수"로 채택하는 것이 일반적 해석입니다.</p>`,
    applications: `<p>PCA·인자분석의 주성분/요인 개수 결정, 데이터 탐색 단계에서 잠재 차원 수 추정에 사용됩니다.</p>`,
    sklearnFunction: 'PCA.explained_variance_',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/decomposition.html#pca',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'spearmans-rho',
    category: 'unsup',
    subcategory: 'evaluation',
    title: "순위 상관계수 (Spearman's ρ)",
    subtitle: '원공간과 임베딩 공간의 거리 순위 간 상관을 측정하는 비모수적 임베딩 평가 지표',
    overview: `<p>원공간의 쌍별 거리와 저차원 임베딩의 쌍별 거리를 각각 순위(rank)로 변환한 뒤, 두 순위 사이의
    피어슨 상관계수를 계산합니다. 절대적인 거리 크기가 아니라 순서 관계의 보존 여부만을 평가하므로 비선형
    변환에도 강건합니다.</p>`,
    formula: `&#961; = 1 − [6&#8721;&#7522; d&#7522;&#178;] / [m(m&#178;−1)] &nbsp;(d&#7522;: 두 거리 순위의 차이, m: 비교하는 쌍의 개수)`,
    features: `<p>값의 범위는 <strong>[-1,1]</strong>이며 <strong>1에 가까울수록</strong> 거리 순서관계가 잘
    보존됨을 의미합니다. Shepard 다이어그램과 함께 사용하면 시각적으로도 확인할 수 있습니다.</p>`,
    applications: `<p>MDS·Isomap 등 거리 기반 차원축소 결과의 전역구조 보존 검증, Shepard 다이어그램의 정량적
    요약 지표로 사용됩니다.</p>`,
    sklearnFunction: 'scipy.stats.spearmanr',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'mds-stress',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '스트레스 (Stress, MDS Stress)',
    subtitle: '원공간의 거리와 저차원 임베딩 거리 간의 제곱오차 합으로 MDS의 적합도를 측정하는 지표',
    overview: `<p>다차원척도법(MDS)이 최소화하는 목적함수 그 자체로, 원본 거리행렬 D와 임베딩 공간에서 계산한
    거리행렬 D&#770;의 차이를 제곱합으로 정량화합니다. Kruskal의 스트레스 공식이 가장 널리 쓰이며, 값이 작을수록
    저차원 배치가 원본 거리 구조를 잘 재현한 것입니다.</p>`,
    formula: `Stress&#8321; = &#8730;[ &#8721;&#7522;&lt;&#7527; (d&#7522;&#7527; − d&#770;&#7522;&#7527;)&#178; / &#8721;&#7522;&lt;&#7527; d&#7522;&#7527;&#178; ]`,
    features: `<p>값이 <strong>낮을수록</strong> 좋으며 Kruskal의 경험적 기준으로 0.2 이상은 나쁨, 0.05 미만은
    우수로 해석하는 관례가 있습니다.</p>`,
    applications: `<p>MDS의 임베딩 차원 수 결정, 여러 초기값·최적화 결과의 적합도 비교 등에 사용됩니다.</p>`,
    sklearnFunction: 'MDS.stress_',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/manifold.html#multi-dimensional-scaling',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.manifold.MDS.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/manifold/plot_mds.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'trustworthiness',
    category: 'unsup',
    subcategory: 'evaluation',
    title: '신뢰성 (Trustworthiness)',
    subtitle: '저차원 임베딩에서 새로 이웃이 된 점들이 원공간에서도 실제로 가까웠는지를 측정하는 지표',
    overview: `<p>Continuity와 쌍을 이루는 지표로, 임베딩 공간에서는 k-이웃이지만 원공간에서는 이웃이 아니었던
    "거짓 이웃(false neighbor)"의 발생을 벌점으로 계산합니다. t-SNE·UMAP 등 비선형 임베딩이 원공간 구조를
    왜곡 없이 보존하는지 검증하는 가장 표준적인 지표 중 하나입니다.</p>`,
    formula: `T(k) = 1 − (2/(nk(2n−3k−1))) &#8721;&#7522;&#8339;&#8321;&#7480; &#8721;&#7527;&#8712;U&#8342;(k) (r(i,j) − k) &nbsp;(U&#8342;(k): 임베딩 이웃이지만 원공간에서는 이웃이 아니었던 점, r(i,j): 원공간 순위)`,
    features: `<p>값의 범위는 <strong>[0,1]</strong>이며 <strong>1에 가까울수록</strong> 좋습니다(거짓 이웃이
    거의 없음). scikit-learn에 직접 구현되어 있어 실무에서 가장 흔히 사용되는 임베딩 신뢰성 지표입니다.</p>`,
    applications: `<p>t-SNE·UMAP 등 매니폴드 학습 결과의 신뢰성 검증, 하이퍼파라미터(perplexity 등) 튜닝의
    정량적 기준으로 사용됩니다.</p>`,
    sklearnFunction: 'trustworthiness',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/manifold.html#trustworthiness',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.manifold.trustworthiness.html',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },

];
