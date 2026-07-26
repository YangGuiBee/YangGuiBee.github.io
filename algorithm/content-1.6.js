/* ── [1.6] 신경망 기반 (Neural Network-based) 콘텐츠 데이터 ──
   List3.md [1.6.1]~[1.6.6] 전체 하위 항목을 다룹니다.
   AE/DAE/SAE/CAE/&#946;-VAE/SOM/GAN/AAE/VAE/Contrastive Learning/Self-Supervised Learning은
   List3.md에 두 하위섹션에 걸쳐 등장하는 동일 기법이므로(의도된 재사용) 이 파일에는 1개 항목으로만 작성했습니다. */
const CONTENT_1_6 = [
  {
    id: 'gan',
    category: 'unsup',
    subcategory: 'neural',
    title: '생성적 적대 신경망 (GAN, Generative Adversarial Networks)',
    subtitle: '생성자와 판별자가 서로 경쟁하며 실제와 구분되지 않는 데이터를 만들어내는 생성 모델',
    overview: `<p>생성자(Generator)는 무작위 잡음으로부터 가짜 데이터를 만들고, 판별자(Discriminator)는 진짜 데이터와 가짜 데이터를 구분하도록 학습합니다.
    두 네트워크가 미니맥스 게임 형태로 서로 경쟁하며 훈련되어, 학습이 끝나면 생성자가 실제 데이터 분포에 가까운 샘플을 만들어낼 수 있습니다.
    이미지·음성·텍스트 등 다양한 도메인에서 사실적인 데이터 생성의 토대가 된 대표적인 생성 모델입니다.</p>`,
    formula: `min&#8342; max&#8332; V(D,G) = E[log D(x)] + E[log(1&#8722;D(G(z)))]`,
    features: `<p><strong>장점</strong> — 매우 사실적이고 선명한 샘플을 생성할 수 있고, 명시적인 확률분포 가정 없이 데이터 분포를 암묵적으로 학습합니다.</p>
    <p><strong>단점</strong> — 생성자·판별자의 균형을 맞추기 어려워 학습이 불안정하고, 일부 모드만 생성하는 모드 붕괴(mode collapse)가 자주 발생합니다.</p>`,
    applications: `<p>이미지 합성·초해상도·데이터 증강, 스타일 변환, AnoGAN과 같은 이상치 탐지 등 폭넓은 생성형 AI 응용의 기반 모델로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/generative-adversarial-networks'
  },
  {
    id: 'dcgan',
    category: 'unsup',
    subcategory: 'neural',
    title: '심층 합성곱 GAN (DCGAN, Deep Convolutional GAN)',
    subtitle: '완전연결층 대신 합성곱 구조를 사용해 이미지 생성 품질과 학습 안정성을 높인 GAN',
    overview: `<p>GAN의 생성자와 판별자를 완전연결층 대신 합성곱·전치합성곱 층으로 구성하여 이미지 생성 품질과 학습 안정성을 크게 개선한 구조입니다.
    배치정규화, LeakyReLU, 스트라이드 합성곱 등 구체적인 아키텍처 가이드라인을 제시하여 이후 GAN 연구의 표준 백본이 되었습니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 합성곱 구조 덕분에 이미지 특유의 공간적 패턴 학습에 유리하고 GAN 중에서는 학습이 비교적 안정적입니다.</p>
    <p><strong>단점</strong> — 여전히 고해상도 생성이나 다양한 모드를 모두 커버하는 데는 한계가 있습니다.</p>`,
    applications: `<p>얼굴·사물 이미지 생성, 합성 이미지를 활용한 데이터 증강, 이후 등장한 다양한 GAN 변형의 기본 아키텍처로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: 'https://huggingface.co/keras-io/dcgan-to-generate-face-images',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/unsupervised-representation-learning-with-1'
  },
  {
    id: 'wgan',
    category: 'unsup',
    subcategory: 'neural',
    title: '바서슈타인 GAN (WGAN, Wasserstein GAN)',
    subtitle: '바서슈타인 거리를 손실 함수로 사용해 GAN의 학습 안정성을 개선한 모델',
    overview: `<p>기존 GAN의 손실 함수(젠슨-섀넌 발산)를 두 분포 사이의 바서슈타인 거리(Earth Mover&#39;s Distance)로 대체하여 학습 안정성과 수렴성을 개선한 GAN입니다.
    판별자 대신 립시츠 제약을 만족하는 &#39;비평가(critic)&#39;를 두고, 가중치 클리핑 또는 그래디언트 페널티(WGAN-GP)로 이 제약을 근사합니다.</p>`,
    formula: `W(P&#8322;, P&#8291;) = sup&#8348;&#8348;&#8348; ||f||&#8343; &#8804; 1 &#8901; ( E[f(x)] &#8722; E[f(G(z))] )`,
    features: `<p><strong>장점</strong> — 모드 붕괴가 완화되고, 학습 손실이 실제 생성 품질과 상관관계를 가져 학습 상태를 모니터링하기 쉽습니다.</p>
    <p><strong>단점</strong> — 립시츠 제약을 가중치 클리핑으로 근사하면 최적화가 어려워질 수 있어, 이를 개선한 WGAN-GP가 널리 쓰입니다.</p>`,
    applications: `<p>안정적인 GAN 학습이 필요한 이미지 생성 전반과, 학습 손실 자체를 품질 지표로 활용하는 이상치 탐지용 GAN 연구 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/wasserstein-gan'
  },
  {
    id: 'cyclegan',
    category: 'unsup',
    subcategory: 'neural',
    title: '사이클 생성적 적대 신경망 (CycleGAN, Cycle-Consistent Generative Adversarial Network)',
    subtitle: '짝지어지지 않은 두 도메인 이미지 간의 변환을 학습하는 GAN',
    overview: `<p>짝지어지지 않은(unpaired) 두 도메인의 이미지 간 변환을 학습하는 GAN입니다. A&#8594;B, B&#8594;A 두 방향의 생성자를 동시에 학습하며,
    원본을 A&#8594;B&#8594;A로 되돌렸을 때 원본과 같아야 한다는 사이클 일관성 손실(cycle-consistency loss)을 추가해 대응 쌍 데이터 없이도 스타일을 학습합니다.</p>`,
    formula: `L = L&#8332;&#8332;&#8358;&#8321;(G,F) + &#955;&#8901;( ||F(G(x))&#8722;x||&#8321; + ||G(F(y))&#8722;y||&#8321; )`,
    features: `<p><strong>장점</strong> — 짝지어진(paired) 학습 데이터가 없어도 서로 다른 도메인 간 이미지 변환을 학습할 수 있습니다.</p>
    <p><strong>단점</strong> — 형태(geometry)가 크게 다른 도메인 간 변환에는 취약하고, 두 방향의 생성자·판별자를 함께 학습해야 해 연산 비용이 큽니다.</p>`,
    applications: `<p>사진↔회화 스타일 변환, 말↔얼룩말 같은 객체 외형 변환, 의료 영상의 도메인 적응(예: MRI↔CT 변환) 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: 'https://huggingface.co/keras-io/CycleGAN',
    spaceURL: 'https://huggingface.co/spaces/keras-io/CycleGAN',
    papersWithCodeURL: 'https://paperswithcode.com/paper/unpaired-image-to-image-translation-using'
  },
  {
    id: 'stylegan',
    category: 'unsup',
    subcategory: 'neural',
    title: '스타일 GAN (StyleGAN, Style-based Generative Adversarial Network)',
    subtitle: '스타일 벡터를 계층별로 주입해 세밀하게 제어 가능한 이미지를 생성하는 GAN',
    overview: `<p>잠재 벡터를 매핑 네트워크로 변환한 뒤, 각 해상도 층에 AdaIN 방식으로 스타일 정보를 주입하는 생성자 구조를 제안한 GAN입니다.
    굵은 스타일(자세·얼굴형)부터 미세한 스타일(피부결·색감)까지 계층별로 분리해 제어할 수 있어 매우 사실적이고 편집 가능한 이미지를 생성합니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 스타일을 계층별로 분리해 세밀한 이미지 제어와 잠재 공간 보간이 가능하고, 최고 수준의 사실감을 제공합니다.</p>
    <p><strong>단점</strong> — 학습에 막대한 연산 자원이 필요하고, 학습 데이터의 편향(예: 인구통계학적 편향)을 그대로 학습합니다.</p>`,
    applications: `<p>가상 인물 얼굴 생성, 이미지 속성 편집·보간, 그래픽·게임 콘텐츠용 합성 이미지 제작 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: 'https://huggingface.co/matthias-wright/stylegan2',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/a-style-based-generator-architecture-for'
  },
  {
    id: 'cd-algorithm',
    category: 'unsup',
    subcategory: 'neural',
    title: '대조 발산 알고리즘 (CD, Contrastive Divergence)',
    subtitle: 'RBM 등 에너지 기반 모델을 빠르게 근사 학습하는 방법',
    overview: `<p>RBM처럼 정규화 상수(분배함수)의 계산이 어려운 에너지 기반 모델을 학습하기 위해 제안된 근사 학습법입니다.
    실제 데이터로 시작한 깁스 샘플링을 단 몇 스텝(흔히 CD-1)만 실행해 얻은 샘플로 그래디언트를 근사함으로써, 완전한 수렴을 기다리지 않고도 실용적인 속도로 모델을 학습합니다.</p>`,
    formula: `&#8710;W &#8733; &#10216;v h&#10217;&#8348;&#7522;&#8348;&#7522; &#8722; &#10216;v h&#10217;&#8332;&#8332;&#8331;&#8331;&#8331;`,
    features: `<p><strong>장점</strong> — 정확한 우도(likelihood) 계산 없이도 RBM과 같은 에너지 기반 모델을 빠르게 학습할 수 있습니다.</p>
    <p><strong>단점</strong> — 샘플링 스텝 수(k)가 작으면 참 그래디언트에 대한 편향된 근사가 되어 학습 품질이 떨어질 수 있습니다.</p>`,
    applications: `<p>RBM·DBN의 층별 사전학습(pretraining) 단계에서 핵심적으로 사용되는 학습 알고리즘입니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'pcd-algorithm',
    category: 'unsup',
    subcategory: 'neural',
    title: '지속 대조 발산 (PCD, Persistent Contrastive Divergence)',
    subtitle: '깁스 체인을 매 스텝 이어가며 CD보다 정확하게 모델 분포를 근사하는 학습법',
    overview: `<p>CD의 변형으로, 매 학습 스텝마다 깁스 체인을 데이터에서 새로 시작하지 않고 이전 스텝의 체인 상태를 그대로 이어받아 계속 진행시킵니다.
    체인이 여러 스텝에 걸쳐 지속되므로 모델 분포를 더 정확히 탐색할 수 있어 CD보다 편향이 적은 그래디언트 추정치를 제공합니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — CD보다 정확하게 모델 분포를 근사하며, 학습 후반부에 안정적인 그래디언트 추정을 제공합니다.</p>
    <p><strong>단점</strong> — 체인이 실제 모델 분포에서 크게 벗어나는 믹싱(mixing) 문제가 발생하면 오히려 성능이 저하될 수 있습니다.</p>`,
    applications: `<p>RBM·DBN 등 에너지 기반 모델의 학습, 특히 CD-1의 편향이 문제가 되는 상황에서 대안으로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'dbn',
    category: 'unsup',
    subcategory: 'neural',
    title: '심층 신념 신경망 (DBN, Deep Belief Networks)',
    subtitle: '여러 RBM을 층층이 쌓아 탐욕적으로 사전학습하는 심층 생성 모델',
    overview: `<p>여러 층의 RBM을 쌓아 올려 각 층을 탐욕적(greedy)으로 사전학습한 뒤 전체를 미세조정하는 심층 생성 모델입니다.
    하위 층에서 상위 층으로 갈수록 점점 추상적인 특징을 학습하며, 심층 신경망 학습의 어려움(그래디언트 소실)을 완화하는 방법으로 딥러닝 부흥의 중요한 계기가 되었습니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 비지도 사전학습으로 심층 신경망의 초기 가중치를 좋은 지점에 위치시켜 학습을 돕습니다.</p>
    <p><strong>단점</strong> — 층별 그리디 학습이 전역 최적은 아닐 수 있고, 배치정규화·ReLU·잔차연결 등 현대 기법 등장 이후 사용 빈도가 크게 줄었습니다.</p>`,
    applications: `<p>손글씨 숫자 인식 등 초기 딥러닝 연구, 심층 신경망의 비지도 사전학습 전략 연구 등에 사용되었습니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/a-fast-learning-algorithm-for-deep-belief'
  },
  {
    id: 'rbm',
    category: 'unsup',
    subcategory: 'neural',
    title: '제한 볼츠만 머신 (RBM, Restricted Boltzmann Machine)',
    subtitle: '가시층과 은닉층 두 층으로만 구성된 확률적 에너지 기반 신경망',
    overview: `<p>가시층(visible)과 은닉층(hidden) 두 층으로만 구성되고, 같은 층 내부의 연결은 없이 층 간에만 연결이 존재하는 확률적 에너지 기반 모델입니다.
    에너지 함수를 최소화하는 방향으로 학습하며, 대조 발산(CD) 알고리즘으로 효율적으로 훈련할 수 있어 DBN의 기본 구성 요소로 널리 쓰였습니다.</p>`,
    formula: `E(v,h) = &#8722;&#8721;a&#7522;v&#7522; &#8722; &#8721;b&#11388;h&#11388; &#8722; &#8721;&#8721;v&#7522;h&#11388;w&#7522;&#11388;`,
    features: `<p><strong>장점</strong> — 협업 필터링·특징 학습에 효과적이며 구조가 단순해 이해와 구현이 쉽습니다.</p>
    <p><strong>단점</strong> — 분배함수(Z) 계산이 어려워 근사 학습(CD)에 의존해야 하고, 현대 신경망 구조 대비 표현력이 제한적입니다.</p>`,
    applications: `<p>추천 시스템(넷플릭스 프라이즈 당시의 협업 필터링), 차원 축소, 이미지·음성의 비지도 특징 사전학습 등에 사용됩니다.</p>`,
    sklearnFunction: 'BernoulliRBM',
    sklearnGuideURL: 'https://scikit-learn.org/stable/modules/neural_networks_unsupervised.html',
    sklearnAPIURL: 'https://scikit-learn.org/stable/modules/generated/sklearn.neural_network.BernoulliRBM.html',
    sklearnExampleURL: 'https://scikit-learn.org/stable/auto_examples/neural_networks/plot_rbm_logistic_classification.html',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://physics.paperswithcode.com/method/restricted-boltzmann-machine'
  },
  {
    id: 'ddpm',
    category: 'unsup',
    subcategory: 'neural',
    title: '잡음 제거 확산 확률 모델 (DDPM, Denoising Diffusion Probabilistic Models)',
    subtitle: '점진적으로 잡음을 더하고 역으로 제거하며 데이터를 생성하는 확산 모델',
    overview: `<p>데이터에 점진적으로 가우시안 잡음을 추가해 완전한 노이즈로 만드는 정방향 확산 과정과, 신경망이 각 단계의 잡음을 예측해 역으로 제거하며
    데이터를 복원하는 역방향 과정으로 구성된 생성 모델입니다. 학습은 각 타임스텝에서 추가된 잡음을 예측하는 단순한 회귀 손실로 이루어지며,
    안정적인 학습과 뛰어난 샘플 품질로 현대 이미지 생성의 표준이 되었습니다.</p>`,
    formula: `L = E&#8348;&#8321;x&#8320;&#949;[ || &#949; &#8722; &#949;&#952;(&#8730;&#945;&#772;&#8348;x&#8320;+&#8730;(1&#8722;&#945;&#772;&#8348;)&#949;, t) ||&#178; ]`,
    features: `<p><strong>장점</strong> — GAN 대비 학습이 안정적이고 다양성이 높은 고품질 샘플을 생성합니다.</p>
    <p><strong>단점</strong> — 샘플링에 수백~수천 스텝의 반복적인 역확산 과정이 필요해 생성 속도가 느립니다(DDIM 등으로 개선).</p>`,
    applications: `<p>텍스트-이미지 생성(Stable Diffusion 계열), 이미지 복원·초해상도, 음성·영상 합성 등 현대 생성형 AI의 핵심 기술로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: 'https://huggingface.co/google/ddpm-cifar10-32',
    spaceURL: 'https://huggingface.co/spaces/stabilityai/stable-diffusion',
    papersWithCodeURL: 'https://paperswithcode.com/paper/denoising-diffusion-probabilistic-models'
  },
  {
    id: 'diffusion-models',
    category: 'unsup',
    subcategory: 'neural',
    title: '확산 모델 (Diffusion Models)',
    subtitle: '점진적 잡음 추가·제거 과정을 학습해 데이터를 생성하는 생성 모델의 총칭',
    overview: `<p>데이터에 점진적으로 잡음을 더해가는 정방향 확산 과정을 정의하고, 그 역과정을 신경망으로 학습해 잡음으로부터 데이터를 생성하는 생성 모델의
    총칭입니다. 비평형 열역학(non-equilibrium thermodynamics)에서 아이디어를 빌려온 초기 연구에서 출발해 DDPM·스코어 기반 모델 등으로 발전했으며,
    오늘날 이미지·영상·오디오 생성의 주류 접근법으로 자리잡았습니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 학습이 안정적이고 매우 높은 샘플 품질과 다양성을 동시에 확보할 수 있습니다.</p>
    <p><strong>단점</strong> — 샘플 생성에 반복적인 역확산 과정이 필요해 GAN보다 추론(inference) 비용이 큽니다.</p>`,
    applications: `<p>텍스트 기반 이미지·영상 생성, 3D 콘텐츠 생성, 분자 구조 설계 등 광범위한 생성 작업의 기반 기술로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: 'https://huggingface.co/spaces/stabilityai/stable-diffusion',
    papersWithCodeURL: 'https://paperswithcode.com/paper/deep-unsupervised-learning-using'
  },
  {
    id: 'score-based-generative-models',
    category: 'unsup',
    subcategory: 'neural',
    title: '점수 기반 생성 모델 (Score-based Generative Models)',
    subtitle: '데이터 로그밀도의 그래디언트(스코어)를 학습해 랑주뱅 동역학으로 샘플을 생성하는 모델',
    overview: `<p>데이터의 로그 확률 밀도의 그래디언트(스코어, &#8711;&#8339;log p(x))를 신경망으로 추정하고, 랑주뱅 동역학(Langevin dynamics)을 이용해
    이 스코어를 따라가며 샘플을 생성하는 모델입니다. 여러 잡음 수준에서 스코어를 함께 학습하는 잡음 조건화를 도입해 저밀도 영역에서도 안정적으로
    학습되며, DDPM과 수학적으로 밀접하게 연결됩니다.</p>`,
    formula: `s&#952;(x) &#8776; &#8711;&#8339;log p(x),  x&#8348;&#8330;&#8321; = x&#8348; + (&#949;/2)s&#952;(x&#8348;) + &#8730;&#949;&#8901;z`,
    features: `<p><strong>장점</strong> — 적대적 학습 없이 안정적으로 학습되고, 아키텍처 선택이 유연합니다.</p>
    <p><strong>단점</strong> — 샘플링에 많은 반복 스텝이 필요해 생성 속도가 느립니다.</p>`,
    applications: `<p>이미지·오디오 생성, 확산 모델의 이론적 기반 연구, 역문제(inverse problem) 해결 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/generative-modeling-by-estimating-gradients'
  },
  {
    id: 'disentangled-vae',
    category: 'unsup',
    subcategory: 'neural',
    title: '분리 표현 변분 오토인코더 (Disentangled VAE)',
    subtitle: '잠재 차원 각각이 데이터의 독립적인 생성 요인에 대응하도록 학습하는 VAE 계열',
    overview: `<p>잠재 공간의 각 차원이 형태·색상·회전 등 데이터를 구성하는 독립적인 요인(factor)과 일대일로 대응하도록 유도하는 VAE 계열입니다.
    &#946;-VAE처럼 KL 항에 가중치를 부여하거나, FactorVAE처럼 잠재 변수 간 전체 상관(Total Correlation)을 직접 벌점화하는 방식으로
    잠재 변수 사이의 통계적 독립성을 강화합니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 잠재 차원별로 해석 가능한 요인을 얻어 제어된 생성과 속성 편집이 가능합니다.</p>
    <p><strong>단점</strong> — 재구성 품질과 분리도(disentanglement) 사이에 트레이드오프가 발생합니다.</p>`,
    applications: `<p>얼굴 속성 편집, 로봇 상태 표현 학습, 공정성(fairness)을 고려한 표현 학습 연구 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/disentangling-by-factorising'
  },
  {
    id: 'beta-vae',
    category: 'unsup',
    subcategory: 'neural',
    title: '베타 변분 오토인코더 (&#946;-VAE, Beta-Variational Autoencoder)',
    subtitle: 'KL 항에 가중치 &#946;를 부여해 분리된 잠재 표현을 유도하는 VAE 변형',
    overview: `<p>표준 VAE의 손실 함수에서 KL 발산 항에 &#946;&gt;1의 가중치를 곱해, 잠재 변수가 사전분포(등방성 가우시안)에 더 가깝게, 즉 서로
    독립적으로 유지되도록 강하게 압박하는 VAE 변형입니다. &#946;를 키울수록 더 분리된(disentangled) 표현을 얻지만 재구성 품질은 다소 희생됩니다.</p>`,
    formula: `L = E[log p(x|z)] &#8722; &#946;&#8901;D&#8342;&#8343;(q(z|x) || p(z)),  &#946; &gt; 1`,
    features: `<p><strong>장점</strong> — 하이퍼파라미터 &#946; 하나만으로 분리 정도를 조절할 수 있어 구현이 간단합니다.</p>
    <p><strong>단점</strong> — &#946;가 커질수록 재구성 오차가 증가하는 트레이드오프가 존재합니다.</p>`,
    applications: `<p>해석 가능한 잠재 표현 학습, 이미지 속성 분리, 강화학습의 상태 표현 학습 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/early-visual-concept-learning-with'
  },
  {
    id: 'vae',
    category: 'unsup',
    subcategory: 'neural',
    title: '변분 오토인코더 (VAE, Variational Autoencoder)',
    subtitle: '입력을 확률분포로 인코딩하고 샘플링을 통해 복원·생성하는 확률적 생성 모델',
    overview: `<p>인코더가 입력을 잠재 변수의 확률분포(평균·분산)로 매핑하고, 디코더가 이 분포에서 샘플링한 잠재 벡터로부터 입력을 복원하도록
    학습하는 확률적 생성 모델입니다. 재구성 손실과 잠재 분포를 사전분포에 가깝게 만드는 KL 발산 항을 함께 최적화하며, 재매개변수화
    트릭(reparameterization trick)으로 역전파가 가능해집니다.</p>`,
    formula: `L = E&#8348;(z|x)[log p(x|z)] &#8722; D&#8342;&#8343;(q(z|x) || p(z))  (ELBO 최대화)`,
    features: `<p><strong>장점</strong> — 연속적이고 매끄러운 잠재 공간을 얻어 보간·샘플링이 용이하고 학습이 안정적입니다.</p>
    <p><strong>단점</strong> — GAN 대비 생성 이미지가 다소 흐릿한 경향이 있습니다.</p>`,
    applications: `<p>이미지 생성 및 잠재 공간 보간, 재구성 오차를 활용한 이상치 탐지, 추천 시스템의 잠재 표현 학습 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: 'https://huggingface.co/stabilityai/sd-vae-ft-mse',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/auto-encoding-variational-bayes'
  },
  {
    id: 'aae',
    category: 'unsup',
    subcategory: 'neural',
    title: '적대적 오토인코더 (AAE, Adversarial Autoencoder)',
    subtitle: 'GAN의 적대적 학습으로 잠재 분포를 원하는 사전분포에 맞추는 오토인코더',
    overview: `<p>오토인코더의 잠재 벡터 분포가 임의로 지정한 사전분포를 따르도록, VAE의 KL 발산 항 대신 GAN의 적대적 학습을 사용하는
    생성 모델입니다. 판별자가 인코더의 출력 분포와 목표 사전분포를 구분하지 못하도록 인코더를 학습시켜, 원하는 형태(가우시안, 혼합분포 등)의
    잠재 공간을 유연하게 설계할 수 있습니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 사전분포 형태를 자유롭게 선택할 수 있고 군집화·준지도 학습에도 활용 가능합니다.</p>
    <p><strong>단점</strong> — GAN 기반이라 적대적 학습의 불안정성 문제를 동일하게 가집니다.</p>`,
    applications: `<p>준지도 분류, 이미지의 스타일·내용 분리, 비지도 군집화 및 차원 축소·시각화 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/adversarial-autoencoders'
  },
  {
    id: 'barlow-twins',
    category: 'unsup',
    subcategory: 'neural',
    title: '바를로 트윈스 (Barlow Twins)',
    subtitle: '교차상관행렬을 항등행렬에 가깝게 만들어 표현 붕괴 없이 학습하는 자기지도 학습법',
    overview: `<p>같은 이미지에 서로 다른 증강(augmentation)을 적용한 두 뷰를 동일한 네트워크에 통과시켜 얻은 임베딩 사이의 교차상관행렬을
    항등행렬에 가깝게 만드는 자기지도 학습 방법입니다. 대각 성분은 1에(두 뷰의 같은 차원이 일치), 비대각 성분은 0에 가깝게(차원 간 중복 제거)
    만들어, 음성 표본이나 모멘텀 인코더 없이도 표현 붕괴를 방지합니다.</p>`,
    formula: `L = &#8721;&#7522;(1&#8722;C&#7522;&#7522;)&#178; + &#955;&#8901;&#8721;&#7522;&#8721;&#11388;&#8800;&#7522; C&#7522;&#11388;&#178;  (C는 두 뷰 임베딩의 교차상관행렬)`,
    features: `<p><strong>장점</strong> — 음성 쌍·큰 배치·모멘텀 인코더가 불필요해 구현이 단순합니다.</p>
    <p><strong>단점</strong> — 임베딩 차원이 충분히 커야 성능이 잘 나오는 경향이 있습니다.</p>`,
    applications: `<p>이미지 자기지도 사전학습, 오디오·그래프 표현 학습 등에 응용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/barlow-twins-self-supervised-learning-via'
  },
  {
    id: 'bert-pretraining',
    category: 'unsup',
    subcategory: 'neural',
    title: 'BERT 스타일 사전학습 (BERT-style Pretraining, Masked Language Modeling)',
    subtitle: '문장의 일부를 가리고 양방향 문맥으로 복원하도록 학습하는 트랜스포머 사전학습 방식',
    overview: `<p>입력 문장의 일부 토큰을 무작위로 마스킹한 뒤, 양방향 트랜스포머 인코더가 문맥 전체(좌우 양쪽)를 보고 마스킹된 토큰을
    예측하도록 학습하는 자기지도 사전학습 방식입니다. 대량의 레이블 없는 텍스트에서 범용 언어 표현을 학습한 뒤 다양한 다운스트림
    과제에 미세조정하는 전이학습 패러다임을 확립했습니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 양방향 문맥을 모두 활용해 문장 이해 과제에서 뛰어난 성능을 보이고, 미세조정만으로 다양한 과제에 적용 가능합니다.</p>
    <p><strong>단점</strong> — 사전학습에 막대한 연산 자원이 필요하고, 자기회귀적 텍스트 생성 과제에는 적합하지 않습니다.</p>`,
    applications: `<p>질의응답, 문장 분류, 개체명 인식 등 다양한 자연어이해 과제의 백본으로 널리 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: 'https://huggingface.co/google-bert/bert-base-uncased',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/bert-pre-training-of-deep-bidirectional'
  },
  {
    id: 'byol',
    category: 'unsup',
    subcategory: 'neural',
    title: '자가 잠재 부트스트랩 (BYOL, Bootstrap Your Own Latent)',
    subtitle: '부정 쌍 없이 온라인·타깃 네트워크의 예측 관계만으로 표현을 학습하는 자기지도 학습법',
    overview: `<p>온라인 네트워크(online network)가 한 증강 뷰의 표현으로부터, 타깃 네트워크(target network, 온라인 네트워크의 지수이동평균)가
    만든 다른 증강 뷰의 표현을 예측하도록 학습하는 자기지도 학습법입니다. 음성 표본(negative pair) 없이도 비대칭 구조와 그래디언트
    정지(stop-gradient)만으로 표현 붕괴를 방지한다는 점이 특징입니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 음성 쌍이 필요 없어 배치 크기에 덜 민감하고 구현이 비교적 단순합니다.</p>
    <p><strong>단점</strong> — 붕괴가 일어나지 않는 이유에 대한 이론적 설명이 초기에는 명확하지 않았습니다(배치정규화의 암묵적 역할 논쟁).</p>`,
    applications: `<p>이미지·오디오 자기지도 표현 학습, 레이블이 적은 환경에서의 전이학습 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/bootstrap-your-own-latent-a-new-approach-to'
  },
  {
    id: 'cae',
    category: 'unsup',
    subcategory: 'neural',
    title: '수축 오토인코더 (CAE, Contractive Autoencoder)',
    subtitle: '인코더 출력의 야코비안에 벌점을 주어 입력 변화에 둔감한 표현을 학습하는 오토인코더',
    overview: `<p>재구성 손실에 인코더 출력의 야코비안(Jacobian) 행렬의 프로베니우스 노름을 벌점 항으로 추가하여, 입력의 작은 변화에
    잠재 표현이 민감하게 반응하지 않도록(국소적으로 수축하도록) 학습하는 오토인코더입니다. 이를 통해 데이터가 실제로 놓여 있는
    저차원 매니폴드 방향으로만 민감하고 나머지 방향으로는 둔감한 표현을 얻습니다.</p>`,
    formula: `L = ||x &#8722; x&#770;||&#178; + &#955;&#8901;||J&#8342;(x)||&#178;&#8339;  (J&#8342;는 인코더의 야코비안)`,
    features: `<p><strong>장점</strong> — 잡음이나 사소한 변형에 강건한 특징을 학습합니다.</p>
    <p><strong>단점</strong> — 야코비안 계산 비용이 크고 벌점 가중치(&#955;) 튜닝이 필요합니다.</p>`,
    applications: `<p>강건한 특징 추출, 이미지 분류 전처리, 표현 학습 연구 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'contrastive-learning',
    category: 'unsup',
    subcategory: 'neural',
    title: '대조 학습 (Contrastive Learning)',
    subtitle: '긍정 쌍은 가깝게, 부정 쌍은 멀게 배치하도록 학습하는 자기지도 표현 학습의 핵심 원리',
    overview: `<p>같은 데이터에서 파생된 긍정 쌍(positive pair, 예: 같은 이미지의 서로 다른 증강)은 임베딩 공간에서 가깝게, 서로 다른
    데이터로부터 나온 부정 쌍(negative pair)은 멀게 배치하도록 학습하는 자기지도 표현 학습의 핵심 원리입니다. InfoNCE 등의 손실
    함수로 구현되며 SimCLR·MoCo 등 다양한 방법의 공통 기반이자, 에너지 기반 모델의 관점에서는 긍정 쌍의 에너지를 낮추고 부정 쌍의
    에너지를 높이는 학습으로도 해석됩니다.</p>`,
    formula: `L = &#8722;log[ exp(sim(z&#7522;,z&#11388;)/&#964;) / &#8721;&#8342; exp(sim(z&#7522;,z&#8342;)/&#964;) ]  (InfoNCE 손실)`,
    features: `<p><strong>장점</strong> — 레이블 없이도 다운스트림 과제에 유용한 표현을 학습할 수 있습니다.</p>
    <p><strong>단점</strong> — 좋은 부정 쌍 구성(배치 크기, 메모리 뱅크 등)이 성능에 큰 영향을 미칩니다.</p>`,
    applications: `<p>이미지·텍스트·음성의 자기지도 사전학습, 얼굴 인식과 같은 메트릭 학습 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'dae',
    category: 'unsup',
    subcategory: 'neural',
    title: '잡음 제거 오토인코더 (DAE, Denoising Autoencoder)',
    subtitle: '손상된 입력으로부터 원본을 복원하도록 학습해 강건한 특징을 얻는 오토인코더',
    overview: `<p>입력에 인위적으로 잡음을 추가한 손상된 데이터를 인코더에 넣고, 디코더가 원래의 손상되지 않은 데이터를 복원하도록 학습하는
    오토인코더입니다. 단순히 항등함수를 학습하는 것을 방지하고, 데이터의 본질적인 구조를 포착하는 강건한 특징을 학습하도록 유도합니다.</p>`,
    formula: `L = ||x &#8722; g(f(x&#771;))||&#178;  (x&#771;는 잡음이 추가된 입력)`,
    features: `<p><strong>장점</strong> — 잡음·결측치에 강건한 표현을 학습하고 과적합 방지에 효과적입니다.</p>
    <p><strong>단점</strong> — 추가하는 잡음의 종류·강도 설정에 성능이 민감합니다.</p>`,
    applications: `<p>이미지 잡음 제거, 강건한 특징 사전학습, 재구성 오차 기반 이상치 탐지 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'mae-masked-autoencoder',
    category: 'unsup',
    subcategory: 'neural',
    title: '마스크 오토인코더 (MAE, Masked Autoencoders)',
    subtitle: '이미지 패치의 대부분을 가리고 복원하도록 학습해 ViT를 효율적으로 사전학습하는 방법',
    overview: `<p>입력 이미지를 패치 단위로 나눈 뒤 그중 상당 비율(예: 75%)을 무작위로 가리고, 비대칭 인코더-디코더 구조가 보이는 패치만으로
    가려진 패치의 픽셀을 복원하도록 학습하는 자기지도 학습법입니다. 인코더는 보이는 패치만 처리해 연산량을 크게 줄이면서도, 매우 큰
    비전 트랜스포머(ViT)를 효율적으로 사전학습할 수 있게 합니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 높은 마스킹 비율로 의미 있는 사전학습 과제를 만들고 대규모 ViT 학습을 가속합니다.</p>
    <p><strong>단점</strong> — 디코더 설계와 마스킹 전략에 따라 성능이 크게 좌우됩니다.</p>`,
    applications: `<p>비전 트랜스포머의 사전학습, 이미지 분류·검출·분할 백본의 사전학습 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: 'https://huggingface.co/facebook/vit-mae-base',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/masked-autoencoders-are-scalable-vision'
  },
  {
    id: 'moco',
    category: 'unsup',
    subcategory: 'neural',
    title: '모멘텀 대조 (MoCo, Momentum Contrast)',
    subtitle: '동적 사전(dictionary)과 모멘텀 인코더로 대규모 부정 샘플을 활용하는 대조 학습법',
    overview: `<p>큐(queue) 자료구조에 과거 미니배치들의 임베딩을 계속 쌓아 크고 일관된 &#39;동적 사전(dynamic dictionary)&#39;을 유지하고,
    이 사전과 대조 학습을 수행하는 자기지도 표현 학습법입니다. 사전을 만드는 키 인코더(key encoder)는 역전파 대신 쿼리 인코더의
    지수이동평균으로 서서히 갱신되어(모멘텀 업데이트), 큰 배치 없이도 많은 부정 샘플을 활용할 수 있습니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 큐를 통해 배치 크기와 무관하게 많은 부정 샘플을 확보할 수 있어 지도학습 사전학습과의 격차를 크게 줄였습니다.</p>
    <p><strong>단점</strong> — 큐 크기·모멘텀 계수 등 추가 하이퍼파라미터가 필요합니다.</p>`,
    applications: `<p>이미지 분류·검출·분할의 사전학습, 흉부 X-ray 등 의료 영상의 표현 학습 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/momentum-contrast-for-unsupervised-visual'
  },
  {
    id: 'sae',
    category: 'unsup',
    subcategory: 'neural',
    title: '희소 오토인코더 (SAE, Sparse Autoencoder)',
    subtitle: '은닉 활성화를 희소하게 강제해 해석 가능한 특징을 학습하는 오토인코더',
    overview: `<p>은닉층의 활성화 대부분이 0에 가깝도록(희소하게) 강제하는 벌점 항을 재구성 손실에 추가한 오토인코더입니다. 은닉 유닛
    수가 입력보다 많아도(과완전, overcomplete) 희소성 제약 덕분에 각 뉴런이 서로 다른 의미 있는 특징에 특화되도록 유도합니다.</p>`,
    formula: `L = ||x&#8722;x&#770;||&#178; + &#946;&#8901;&#8721;&#11388; KL(&#961; || &#961;&#770;&#11388;)  (&#961;는 목표 희소도, &#961;&#770;&#11388;는 뉴런 j의 평균 활성화)`,
    features: `<p><strong>장점</strong> — 해석 가능한 특징을 학습하고 과완전 표현에서도 유의미한 인코딩을 학습합니다.</p>
    <p><strong>단점</strong> — 목표 희소도와 벌점 계수 등 하이퍼파라미터 튜닝이 까다롭습니다.</p>`,
    applications: `<p>특징 학습 및 시각화, 최근에는 대형 언어모델의 내부 표현을 해석하는 메커니즘 해석가능성(mechanistic interpretability) 연구에도 활용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'self-supervised-learning',
    category: 'unsup',
    subcategory: 'neural',
    title: '자기지도학습 (Self-Supervised Learning)',
    subtitle: '레이블 없이 데이터 자체로 학습 신호를 만들어 표현을 학습하는 패러다임',
    overview: `<p>사람이 만든 레이블 없이, 데이터 자체로부터 학습 신호(pretext task)를 스스로 만들어 표현을 학습하는 패러다임입니다.
    대조 학습(SimCLR, MoCo), 비대조 학습(BYOL, Barlow Twins), 마스킹 기반(BERT, MAE) 등 다양한 방식이 있으며, 레이블이 부족한
    상황에서 대규모 비지도 데이터로 강력한 사전학습 표현을 얻는 핵심 기법으로 자리잡았습니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 레이블링 비용 없이 대규모 데이터를 활용할 수 있고 다운스트림 전이 성능이 뛰어납니다.</p>
    <p><strong>단점</strong> — 프리텍스트 과제 설계에 따라 학습되는 표현의 품질이 크게 달라집니다.</p>`,
    applications: `<p>비전·언어·음성 전반의 사전학습, 레이블이 부족한 의료·이상치 탐지 등 산업 도메인의 표현 학습에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'simclr',
    category: 'unsup',
    subcategory: 'neural',
    title: 'SimCLR (대조 학습을 위한 단순 프레임워크, A Simple framework for Contrastive Learning of visual Representations)',
    subtitle: '강한 데이터 증강과 대조 손실만으로 우수한 표현을 학습하는 단순한 자기지도 학습법',
    overview: `<p>하나의 이미지에 서로 다른 두 데이터 증강을 적용해 만든 긍정 쌍의 표현은 가깝게, 배치 내 다른 이미지들의 표현은 멀게 만드는
    대조 학습 방법입니다. 강한 데이터 증강 조합, 표현과 대조 손실 사이에 추가한 학습 가능한 비선형 투영 헤드(projection head), 큰
    배치 크기가 성능에 핵심적으로 기여한다는 점을 실험적으로 규명했습니다.</p>`,
    formula: `L = &#8722;log[ exp(sim(z&#7522;,z&#11388;)/&#964;) / &#8721;&#8342;&#8800;&#7522; exp(sim(z&#7522;,z&#8342;)/&#964;) ]  (NT-Xent 손실)`,
    features: `<p><strong>장점</strong> — 특수한 아키텍처나 메모리 뱅크 없이 단순한 구조로 우수한 성능을 달성합니다.</p>
    <p><strong>단점</strong> — 좋은 성능을 위해 매우 큰 배치 크기(수천 단위)가 필요합니다.</p>`,
    applications: `<p>이미지 자기지도 사전학습, 의료·위성 영상 등 레이블이 적은 도메인의 표현 학습 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: 'https://huggingface.co/keras-io/semi-supervised-classification-simclr',
    spaceURL: 'https://huggingface.co/spaces/keras-io/semi-supervised-classification',
    papersWithCodeURL: 'https://paperswithcode.com/paper/a-simple-framework-for-contrastive-learning'
  },
  {
    id: 'stacked-autoencoder',
    category: 'unsup',
    subcategory: 'neural',
    title: '적층 오토인코더 (Stacked Autoencoder)',
    subtitle: '여러 오토인코더를 층층이 쌓아 순차적으로 사전학습하는 심층 구조',
    overview: `<p>여러 개의 오토인코더를 층층이 쌓아, 한 층의 인코더 출력을 다음 층 오토인코더의 입력으로 사용하며 각 층을 순차적으로
    (탐욕적으로) 사전학습하는 구조입니다. 사전학습이 끝나면 인코더들을 이어붙여 심층 신경망을 구성하고 지도학습 신호로 전체를
    미세조정하며, DBN과 유사하게 심층 신경망 학습 초창기의 그래디언트 소실 문제를 완화하는 데 사용되었습니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 층별 사전학습으로 깊은 네트워크의 초기화를 개선합니다.</p>
    <p><strong>단점</strong> — 층별 그리디 학습이 전역 최적에는 못 미칠 수 있고, 현대 초기화·정규화 기법 등장 이후 필요성이 줄어들었습니다.</p>`,
    applications: `<p>계층적 특징 추출, 초기 딥러닝의 사전학습 전략, 차원 축소 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'swav',
    category: 'unsup',
    subcategory: 'neural',
    title: '교환 할당 뷰 (SwAV, Swapping Assignments between Views)',
    subtitle: '온라인 군집 할당을 서로 교환해 예측하도록 학습하는 자기지도 학습법',
    overview: `<p>이미지의 여러 증강 뷰를 학습 가능한 프로토타입(클러스터 중심) 집합에 온라인으로 할당하고, 한 뷰의 클러스터 할당으로
    다른 뷰의 할당을 예측하도록 학습하는 자기지도 학습법입니다. 두 뷰를 직접 비교하는 대신 각각의 클러스터 코드를 서로 교환하여
    비교함으로써, 쌍별 특징 비교 없이도 대조 학습과 유사한 효과를 온라인 군집화로 얻습니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 대규모 메모리 뱅크나 쌍별 비교 없이 메모리 효율적으로 학습하며, 멀티 크롭(multi-crop) 증강으로 성능이 향상됩니다.</p>
    <p><strong>단점</strong> — 클러스터 수·프로토타입 초기화 등 추가 설계 요소가 필요합니다.</p>`,
    applications: `<p>이미지 자기지도 사전학습, 레이블이 적은 환경에서의 분류·검출 전이학습 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/unsupervised-learning-of-visual-features-by'
  },
  {
    id: 'vicreg',
    category: 'unsup',
    subcategory: 'neural',
    title: '분산-불변-공분산 정규화 (VICReg, Variance-Invariance-Covariance Regularization)',
    subtitle: '분산·불변성·공분산 세 정규화 항으로 표현 붕괴를 명시적으로 방지하는 자기지도 학습법',
    overview: `<p>두 증강 뷰의 임베딩이 서로 가까워지도록 하는 불변성(invariance) 항, 각 임베딩 차원의 분산을 일정 값 이상으로 유지해
    붕괴를 막는 분산(variance) 항, 임베딩 차원 간 상관을 제거해 정보 중복을 줄이는 공분산(covariance) 항 세 가지를 결합한 자기지도
    학습 방법입니다. 음성 쌍·모멘텀 인코더·큰 배치 없이도 표현 붕괴를 명시적인 정규화만으로 방지한다는 점이 특징입니다.</p>`,
    formula: `L = &#955;&#8901;s(Z,Z&#8242;) + &#956;&#8901;[v(Z)+v(Z&#8242;)] + &#957;&#8901;[c(Z)+c(Z&#8242;)]  (불변성 s, 분산 v, 공분산 c 항의 가중합)`,
    features: `<p><strong>장점</strong> — 두 브랜치가 서로 다른 아키텍처·모달리티여도 적용할 수 있을 만큼 유연합니다.</p>
    <p><strong>단점</strong> — 세 손실 항의 가중치(&#955;,&#956;,&#957;) 균형을 맞추는 튜닝이 필요합니다.</p>`,
    applications: `<p>이미지·멀티모달 자기지도 표현 학습, 그래프 표현 학습 등에 응용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/vicreg-variance-invariance-covariance'
  },
  {
    id: 'winner-take-all-autoencoder',
    category: 'unsup',
    subcategory: 'neural',
    title: '승자 독식 오토인코더 (Winner-Take-All Autoencoder)',
    subtitle: '활성화 상위 k개만 남기는 규칙만으로 희소 표현을 얻는 오토인코더',
    overview: `<p>은닉층에서 각 특징 맵(또는 각 샘플)마다 활성화 값이 가장 큰 일부(흔히 상위 1개, k개) 뉴런만 남기고 나머지는 0으로
    강제하는 방식으로 희소성을 부여하는 오토인코더입니다. 명시적인 희소성 벌점 항 없이 &#39;승자만 살아남는&#39; 활성화 규칙만으로
    완전연결·합성곱 구조 모두에서 강한 희소 표현을 얻습니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 벌점 하이퍼파라미터 튜닝 없이 원하는 희소도를 정확히 제어할 수 있습니다.</p>
    <p><strong>단점</strong> — 승자 선택 비율(k) 설계가 표현 품질에 직접적인 영향을 미칩니다.</p>`,
    applications: `<p>희소 사전(dictionary) 학습, 비지도 특징 학습, 딥러닝 기반 군집화의 표현 추출 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/winner-take-all-autoencoders'
  },
  {
    id: 'corl',
    category: 'unsup',
    subcategory: 'neural',
    title: '클러스터링 지향 표현 학습 (CORL, Clustering-Oriented Representation Learning)',
    subtitle: '끌힘-밀침 손실로 잠재 공간이 자연스럽게 군집 구조를 갖도록 학습하는 방법',
    overview: `<p>표준 교차 엔트로피 손실 대신, 잠재 공간에서 같은 군집으로 묶이길 원하는 샘플들은 서로 끌어당기고(attractive) 다른
    군집의 샘플들은 밀어내는(repulsive) 손실을 사용해 표현이 자연스럽게 군집 구조를 갖도록 학습하는 방법입니다. 표현 학습과
    군집화를 별도 단계로 분리하지 않고 하나의 목적함수로 통합해 클러스터링에 유리한 잠재 공간을 직접 만들어냅니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 표현 학습 단계에서부터 군집 친화적인 구조를 확보할 수 있습니다.</p>
    <p><strong>단점</strong> — 끌힘/밀침 항의 가중치 균형 조정에 성능이 민감합니다.</p>`,
    applications: `<p>이미지·텍스트의 비지도·준지도 군집화, 딥러닝 기반 클러스터링 파이프라인의 표현 추출 단계 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/clustering-oriented-representation-learning'
  },
  {
    id: 'dac',
    category: 'unsup',
    subcategory: 'neural',
    title: '심층 적응 클러스터링 (DAC, Deep Adaptive Clustering)',
    subtitle: '군집화를 이진 쌍별 분류 문제로 재구성해 점진적으로 학습하는 딥러닝 기반 클러스터링',
    overview: `<p>군집화 문제를 이진 쌍별 분류(pairwise binary classification) 문제로 재구성하여, 두 이미지가 같은 군집인지 아닌지를
    딥러닝 기반 유사도로 판별하는 방법입니다. 합성곱 신경망이 만든 레이블 특징(label feature) 벡터 사이의 코사인 유사도로 유사성을
    계산하고, 학습 과정에서 레이블 특징이 원-핫 벡터에 가까워지도록 제약을 점진적으로 강화하는 적응적 학습 절차를 사용합니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 참 유사도 레이블이 없는 상황에서도 신뢰도 높은 샘플부터 점진적으로 학습에 포함시켜 안정적으로 수렴합니다.</p>
    <p><strong>단점</strong> — 학습 스케줄(임계값 조정)의 설계가 까다롭고 데이터셋에 민감합니다.</p>`,
    applications: `<p>MNIST·CIFAR-10·STL-10 등 이미지 데이터셋의 비지도 군집화 연구 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/deep-adaptive-image-clustering'
  },
  {
    id: 'dcn',
    category: 'unsup',
    subcategory: 'neural',
    title: '심층 클러스터링 신경망 (DCN, Deep Clustering Network)',
    subtitle: '오토인코더 재구성 손실과 K-평균 목적함수를 함께 최적화하는 딥러닝 기반 클러스터링',
    overview: `<p>오토인코더의 재구성 손실과 K-평균 군집화 목적함수를 하나의 손실 함수로 결합해 동시에 최적화하는 방법입니다.
    오토인코더가 데이터의 저차원 표현을 학습하는 동시에, 그 표현 공간이 K-평균에 유리하도록(&#39;K-means-friendly&#39;) 함께 조정됩니다.</p>`,
    formula: `L = ||x&#8722;g(f(x))||&#178; + &#955;&#8901;||f(x)&#8722;Wc&#8342;||&#178;  (재구성 손실 + K-평균 군집 할당 손실)`,
    features: `<p><strong>장점</strong> — 표현 학습과 군집화를 번갈아 최적화해 단순 파이프라인보다 나은 군집 품질을 얻습니다.</p>
    <p><strong>단점</strong> — K-평균의 하드 할당이 최적화를 비연속적으로 만들어 학습이 까다롭습니다.</p>`,
    applications: `<p>이미지·텍스트의 딥러닝 기반 군집화 연구 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/towards-k-means-friendly-spaces-simultaneous'
  },
  {
    id: 'dec',
    category: 'unsup',
    subcategory: 'neural',
    title: '심층 임베디드 클러스터링 (DEC, Deep Embedded Clustering)',
    subtitle: '오토인코더 임베딩과 소프트 군집 할당을 함께 미세조정하는 딥러닝 기반 클러스터링',
    overview: `<p>오토인코더로 사전학습한 저차원 임베딩 공간에서, 각 데이터가 군집 중심에 속할 소프트 할당 확률(Student&#39;s t-분포
    기반)을 계산하고, 이를 더 뾰족하게 만든 목표 분포와의 KL 발산을 최소화하도록 임베딩과 군집 중심을 함께 미세조정하는 방법입니다.
    딥러닝 기반 군집화의 대표적 초기 연구로, 이후 IDEC·DCN·DKM 등 다양한 후속 연구의 기반이 되었습니다.</p>`,
    formula: `q&#7522;&#11388; &#8733; (1+||z&#7522;&#8722;&#956;&#11388;||&#178;)&#8315;&#185;,  L = KL(P||Q)  (P는 Q를 뾰족하게 만든 목표 분포)`,
    features: `<p><strong>장점</strong> — 별도의 군집화 알고리즘 없이 임베딩 자체가 군집 구조를 갖도록 학습합니다.</p>
    <p><strong>단점</strong> — 재구성 손실을 제거하면 임베딩이 붕괴할 위험이 있습니다(이를 IDEC이 개선).</p>`,
    applications: `<p>이미지·텍스트의 비지도 군집화, 대규모 고차원 데이터의 군집 탐색 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/unsupervised-deep-embedding-for-clustering'
  },
  {
    id: 'dkm',
    category: 'unsup',
    subcategory: 'neural',
    title: '심층 K-평균 (DKM, Deep K-Means)',
    subtitle: 'K-평균의 하드 할당을 매끄럽게 재매개변수화해 표현 학습과 동시에 최적화하는 방법',
    overview: `<p>K-평균의 하드(0/1) 군집 할당을 매끄러운(soft) 재매개변수화로 근사하여, 표현 학습 신경망과 K-평균 군집화를 하나의
    미분 가능한 목적함수로 동시에 최적화하는 방법입니다. 온도 파라미터를 점진적으로 조절하는 어닐링을 통해 학습 초반에는 부드러운
    할당으로 최적화를 쉽게 하고, 학습 후반에는 실제 K-평균에 가까운 하드 할당으로 수렴시킵니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 하드 할당의 비연속성 문제를 완화해 경사하강법으로 안정적으로 최적화할 수 있습니다.</p>
    <p><strong>단점</strong> — 어닐링 스케줄(온도 조절) 설정이 결과에 영향을 미칩니다.</p>`,
    applications: `<p>딥러닝 기반 군집화, 표현 학습과 군집화를 동시에 요구하는 대규모 데이터 분석 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/deep-k-means-jointly-clustering-with-k-means'
  },
  {
    id: 'idec',
    category: 'unsup',
    subcategory: 'neural',
    title: '개선된 심층 임베디드 클러스터링 (IDEC, Improved Deep Embedded Clustering)',
    subtitle: '재구성 손실을 유지하여 DEC의 국소 구조 왜곡 문제를 보완한 클러스터링',
    overview: `<p>DEC이 군집화 손실만으로 미세조정하는 과정에서 임베딩 공간의 국소 구조(local structure)가 왜곡될 수 있다는 문제를
    보완한 방법입니다. 오토인코더의 디코더를 그대로 유지해 재구성 손실을 군집화 손실과 함께 계속 최적화함으로써, 데이터의 원래
    구조를 보존하면서도 군집 친화적인 임베딩을 얻습니다.</p>`,
    formula: `L = L&#8332;&#8332;&#8331;&#8331;&#8331;&#8331;&#8331;&#8331;&#8331; + &#947;&#8901;L&#8332;&#8332;&#8331;&#8331;&#8348;&#8348;&#8348;&#8348;&#8348;&#8348;&#8348;&#8348;(KL(P||Q))  (재구성 손실 + &#947;&#8901;군집화 손실)`,
    features: `<p><strong>장점</strong> — 재구성 손실을 함께 사용해 DEC보다 임베딩 붕괴에 강건하고 군집 품질이 향상됩니다.</p>
    <p><strong>단점</strong> — 재구성·군집화 손실의 가중치(&#947;) 조정이 필요합니다.</p>`,
    applications: `<p>이미지·텍스트의 비지도 군집화, DEC 기반 파이프라인의 개선판으로 널리 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'jule',
    category: 'unsup',
    subcategory: 'neural',
    title: '결합 비지도학습 (JULE, Joint Unsupervised LEarning)',
    subtitle: '병합적 군집화 과정을 순환 프레임워크로 표현해 표현 학습과 하나로 결합한 방법',
    overview: `<p>CNN이 만든 표현으로 병합적 군집화(agglomerative clustering)를 수행하는 과정을 순환 신경망 형태의 반복 프레임워크로
    표현하여, 전방향 계산에서는 이미지 군집화를 수행하고 역전파에서는 표현 학습을 수행하는 방식으로 두 과정을 하나의 엔드투엔드
    모델로 결합한 방법입니다. 군집화 결과가 표현 학습에 지도 신호를 제공하고, 좋아진 표현이 다시 더 정확한 군집화로 이어지는
    상호 강화 구조를 가집니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 표현 학습과 군집화가 서로를 개선하는 선순환 구조로 여러 이미지 데이터셋에서 우수한 성능을 보입니다.</p>
    <p><strong>단점</strong> — 병합적 군집화 스텝을 반복해야 해 대규모 데이터에는 연산 비용이 큽니다.</p>`,
    applications: `<p>이미지 데이터셋의 비지도 군집화 연구 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/joint-unsupervised-learning-of-deep'
  },
  {
    id: 'som',
    category: 'unsup',
    subcategory: 'neural',
    title: '자기조직화지도 (SOM, Self-Organizing Maps)',
    subtitle: '고차원 데이터를 위상을 보존하며 저차원 격자에 매핑하는 비지도 신경망',
    overview: `<p>고차원 입력 데이터를 저차원(흔히 2차원) 격자 위의 뉴런들에 비지도 방식으로 매핑하는 신경망입니다. 각 학습 샘플에
    대해 가장 유사한 뉴런(BMU, Best Matching Unit)을 찾고, 그 뉴런과 이웃 뉴런들의 가중치를 입력 쪽으로 함께 이동시켜 위상
    관계(topology)를 보존하는 지도를 형성하며, 군집화와 차원 축소·시각화 양쪽 목적으로 함께 쓰입니다.</p>`,
    formula: `w&#7522;(t+1) = w&#7522;(t) + &#951;(t)&#8901;h&#8332;&#7522;(t)&#8901;(x&#8722;w&#7522;(t))  (h&#8332;&#7522;는 이웃함수, c는 BMU)`,
    features: `<p><strong>장점</strong> — 위상 보존적 매핑으로 군집 구조를 2차원 지도로 직관적으로 시각화할 수 있습니다.</p>
    <p><strong>단점</strong> — 격자 크기·학습률·이웃 반경 등 하이퍼파라미터가 많고 군집 개수를 사전에 알기 어렵습니다.</p>`,
    applications: `<p>고차원 데이터 시각화, 시장 세분화, 이상 패턴 탐지, 문서 군집화 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'ae',
    category: 'unsup',
    subcategory: 'neural',
    title: '오토인코더 (AE, Autoencoder)',
    subtitle: '입력을 압축했다가 복원하는 병목 구조로 비선형 차원 축소를 수행하는 기본 신경망',
    overview: `<p>입력을 저차원 잠재 표현으로 압축하는 인코더와, 그 잠재 표현으로부터 원래 입력을 최대한 복원하는 디코더로 구성된
    비지도 신경망입니다. 병목(bottleneck) 구조 때문에 데이터의 가장 중요한 정보만 잠재 공간에 압축되도록 강제되어, 비선형
    차원 축소·특징 추출의 기본 도구로 널리 쓰입니다.</p>`,
    formula: `L = ||x &#8722; g(f(x))||&#178;  (f: 인코더, g: 디코더)`,
    features: `<p><strong>장점</strong> — PCA와 달리 비선형 관계까지 포착하는 차원 축소가 가능합니다.</p>
    <p><strong>단점</strong> — 잠재 공간이 매끄럽지 않아 생성 목적에는 VAE 등 확률적 변형이 더 적합합니다.</p>`,
    applications: `<p>재구성 오차 기반 이상치 탐지, 이미지 압축·잡음 제거, 추천 시스템의 특징 추출 전처리 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'cpc',
    category: 'unsup',
    subcategory: 'neural',
    title: '대조 예측 코딩 (CPC, Contrastive Predictive Coding)',
    subtitle: '미래의 잠재 표현을 예측하는 대조 손실로 시계열 표현을 학습하는 범용 자기지도 방법',
    overview: `<p>자기회귀 모델이 현재까지의 잠재 표현으로부터 미래 시점의 잠재 표현을 예측하되, 실제 미래 표현과 무작위로 뽑은
    다른(부정) 표현을 구분하는 대조 손실(InfoNCE)로 학습하는 자기지도 표현 학습법입니다. 음성·이미지·텍스트·강화학습 등 시계열적
    구조를 가진 다양한 도메인에 공통으로 적용 가능한 범용 프레임워크로 제안되었습니다.</p>`,
    formula: `L = &#8722;E[log( f&#8342;(x&#8348;&#8330;&#8342;,c&#8348;) / &#8721;&#11388; f&#8342;(x&#11388;,c&#8348;) )]  (InfoNCE, c&#8348;는 문맥 표현)`,
    features: `<p><strong>장점</strong> — 음성·이미지·텍스트·RL 등 여러 모달리티에 공통 적용 가능한 범용성을 가집니다.</p>
    <p><strong>단점</strong> — 예측 거리(k)와 부정 샘플 구성 방식에 성능이 민감합니다.</p>`,
    applications: `<p>음성 표현 학습(wav2vec 계열의 기반), 이미지 패치 예측 기반 표현 학습, 시계열 이상치 탐지 사전학습 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/representation-learning-with-contrastive'
  },
  {
    id: 'gnn-dim-reduction',
    category: 'unsup',
    subcategory: 'neural',
    title: '차원 축소를 위한 그래프 신경망 (Graph Neural Networks for Dimensionality Reduction)',
    subtitle: '그래프 구조 위의 메시지 전달로 저차원 노드 임베딩을 학습하는 차원 축소 접근',
    overview: `<p>데이터를 노드로, 유사도·이웃 관계를 엣지로 하는 그래프를 구성한 뒤, 그래프 신경망의 메시지 전달(message passing)로
    이웃 노드의 정보를 집계해 각 노드의 저차원 임베딩을 학습하는 접근입니다. 유클리드 거리만으로는 포착하기 어려운 그래프
    구조(연결 관계)를 임베딩에 직접 반영할 수 있어, 네트워크·분자 구조 등 그래프 형태 데이터의 차원 축소에 적합합니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 데이터 간 명시적 관계(그래프 구조)를 임베딩에 직접 반영할 수 있습니다.</p>
    <p><strong>단점</strong> — 그래프를 구성하는 방식(이웃 수, 유사도 척도)에 결과가 민감하고 대규모 그래프에서는 연산 비용이 큽니다.</p>`,
    applications: `<p>소셜 네트워크·분자 그래프의 저차원 임베딩, 그래프 데이터의 시각화 및 군집화 전처리 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'growing-neural-gas',
    category: 'unsup',
    subcategory: 'neural',
    title: '성장하는 뉴럴 가스 (Growing Neural Gas)',
    subtitle: '학습 중 노드를 동적으로 추가·삭제하며 데이터의 위상 구조를 학습하는 알고리즘',
    overview: `<p>뉴럴 가스에 노드를 동적으로 추가·삭제하는 기능을 더한 온라인 비지도 학습 알고리즘입니다. 학습이 진행되면서 오차가
    가장 큰 영역에 새 노드를 주기적으로 삽입하고, 오래 사용되지 않은 연결(에지)은 제거하여 네트워크 크기를 사전에 정하지 않고도
    데이터 분포의 위상 구조를 점진적으로 학습합니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 군집(노드) 개수를 미리 정할 필요가 없고 데이터 분포 변화에 적응적입니다.</p>
    <p><strong>단점</strong> — 삽입 주기·연령 임계값 등 여러 파라미터 설정이 결과에 영향을 미칩니다.</p>`,
    applications: `<p>스트리밍 데이터의 위상 학습, 로봇의 환경 지도 작성, 온라인 군집화 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'gsom',
    category: 'unsup',
    subcategory: 'neural',
    title: '성장하는 자기조직화지도 (GSOM, Growing Self-Organizing Maps)',
    subtitle: '경계 노드 주변에 뉴런을 동적으로 추가해 지도 크기를 데이터에 맞게 성장시키는 SOM',
    overview: `<p>고정된 격자 크기로 시작하는 SOM과 달리, 학습 오차가 큰 경계 노드 주변에 새로운 뉴런을 동적으로 추가하며 지도의
    크기와 모양을 데이터에 맞게 성장시키는 SOM의 변형입니다. 격자 크기를 사전에 정할 필요가 없어 데이터의 실제 구조에 더
    유연하게 적응하는 지도를 얻을 수 있습니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 격자 크기를 미리 정하지 않아도 되어 SOM보다 유연한 위상 학습이 가능합니다.</p>
    <p><strong>단점</strong> — 성장 임계값(spread factor) 등 추가 파라미터가 필요하고 학습 시간이 늘어납니다.</p>`,
    applications: `<p>문서·이미지의 계층적 군집 시각화, 데이터 분포 구조 탐색 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'neural-gas',
    category: 'unsup',
    subcategory: 'neural',
    title: '뉴럴 가스 (Neural Gas)',
    subtitle: '고정 격자 없이 순위 기반 갱신으로 데이터 밀도를 근사하는 벡터 양자화 알고리즘',
    overview: `<p>SOM처럼 고정된 격자 위상을 가정하지 않고, 각 학습 스텝에서 입력에 대한 모든 뉴런의 순위(가까운 순서)를 매겨
    순위에 따라 가중치를 갱신하는 벡터 양자화 알고리즘입니다. 데이터 공간에서 뉴런들이 기체 분자처럼 자유롭게 분포하며 데이터
    밀도를 근사한다는 뜻에서 이름이 붙었으며, 위상을 고정하지 않는 만큼 임의의 데이터 매니폴드에 더 유연하게 적응합니다.</p>`,
    formula: `&#8710;w&#7522; = &#949;&#8901;e&#8315;&#8342;&#7522;&#47;&#955;&#8901;(x&#8722;w&#7522;)  (k&#7522;는 뉴런 i의 순위)`,
    features: `<p><strong>장점</strong> — 고정 격자가 없어 임의 형태의 데이터 분포에 유연하게 적응합니다.</p>
    <p><strong>단점</strong> — SOM처럼 직관적인 2차원 시각화를 제공하지는 않습니다.</p>`,
    applications: `<p>벡터 양자화, 이미지 압축, 로봇 경로 계획을 위한 환경 표현 학습 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'neural-network-embeddings',
    category: 'unsup',
    subcategory: 'neural',
    title: '신경망 임베딩 (Neural Network Embeddings)',
    subtitle: '이산적인 개체를 학습 가능한 저차원 실수 벡터로 표현하는 범용 기법',
    overview: `<p>범주형 변수나 이산적인 개체(단어, 상품, 사용자 등)를 신경망 학습 과정에서 함께 최적화되는 저차원 실수 벡터로
    표현하는 일반적인 기법입니다. 원-핫 인코딩과 달리 벡터 공간에서 의미적으로 유사한 개체가 서로 가깝게 위치하도록 학습되어,
    희소하고 고차원적인 범주형 데이터를 조밀한 저차원 표현으로 압축합니다.</p>`,
    formula: ``,
    features: `<p><strong>장점</strong> — 범주형 데이터의 의미적 유사성을 벡터 연산으로 다룰 수 있게 하고 다운스트림 모델의 입력 차원을 크게 줄입니다.</p>
    <p><strong>단점</strong> — 임베딩 차원 선택에 성능이 민감하고 학습 데이터의 편향이 그대로 반영될 위험이 있습니다.</p>`,
    applications: `<p>단어 임베딩(word2vec 등), 추천 시스템의 사용자·상품 임베딩, 범주형 변수가 많은 정형 데이터의 딥러닝 입력 전처리 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'boltzmann-machines',
    category: 'unsup',
    subcategory: 'neural',
    title: '볼츠만 머신 (Boltzmann Machines)',
    subtitle: '완전연결 구조로 결합 확률분포를 표현하는 확률적 에너지 기반 신경망',
    overview: `<p>모든 뉴런이 확률적으로 켜지거나 꺼지는 이진 상태를 가지며, 뉴런 간 대칭적 연결 가중치로 정의되는 에너지 함수를
    통해 전체 시스템의 결합 확률분포를 표현하는 확률적 순환 신경망입니다. 가시층과 은닉층 뿐 아니라 같은 층 내부에도 연결이
    존재하는 완전연결 구조로, RBM은 이 구조에서 층 내부 연결을 제거해 학습을 쉽게 만든 제한된 버전입니다.</p>`,
    formula: `E(s) = &#8722;&#8721;&#7522;&#60;&#11388; w&#7522;&#11388;s&#7522;s&#11388; &#8722; &#8721;&#7522; &#952;&#7522;s&#7522;,  P(s) = exp(&#8722;E(s))/Z`,
    features: `<p><strong>장점</strong> — 임의의 결합 확률분포를 원칙적으로 표현할 수 있는 표현력을 가집니다.</p>
    <p><strong>단점</strong> — 완전연결 구조로 인해 학습(깁스 샘플링)이 매우 느려 실용적으로는 RBM 등 제한된 형태가 주로 사용됩니다.</p>`,
    applications: `<p>조합 최적화, 확률적 추론 연구, RBM·DBN 등 후속 모델의 이론적 토대로 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'hopfield-networks',
    category: 'unsup',
    subcategory: 'neural',
    title: '홉필드 신경망 (Hopfield Networks)',
    subtitle: '저장 패턴을 에너지 극소점으로 인코딩해 연상 기억을 구현하는 순환 신경망',
    overview: `<p>모든 뉴런이 서로 대칭적으로 연결된 순환 신경망으로, 저장하고자 하는 패턴들을 에너지 함수의 극소점(attractor)으로
    인코딩합니다. 손상되거나 불완전한 입력이 주어져도 에너지가 감소하는 방향으로 상태를 반복 갱신하면 가장 가까운 저장 패턴으로
    수렴하여, 연상 기억(associative memory)을 구현합니다.</p>`,
    formula: `E = &#8722;&#189;&#8721;&#7522;&#8721;&#11388; w&#7522;&#11388;s&#7522;s&#11388;,  w&#7522;&#11388; = &#8721;&#8346; &#958;&#7522;&#8346; &#958;&#11388;&#8346;  (헤비안 학습, &#958;&#8346;는 p번째 저장 패턴)`,
    features: `<p><strong>장점</strong> — 부분적이거나 잡음이 섞인 입력으로부터 완전한 패턴을 복원하는 연상 기억을 구현합니다.</p>
    <p><strong>단점</strong> — 저장 용량이 뉴런 수에 비례해 제한적이고, 패턴이 많아지면 거짓 기억(spurious state)이 발생합니다.</p>`,
    applications: `<p>연상 기억, 순회 외판원 문제 등 조합 최적화, 패턴 복원 연구 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'modern-hopfield-networks',
    category: 'unsup',
    subcategory: 'neural',
    title: '현대 홉필드 신경망 (Modern Hopfield Networks)',
    subtitle: '연속 상태와 지수적 저장 용량을 갖고 셀프 어텐션과 수학적으로 동일한 갱신 규칙을 가진 홉필드망',
    overview: `<p>연속적인 상태값과 지수적으로 많은 패턴을 저장할 수 있는 새로운 에너지 함수 및 갱신 규칙으로 고전 홉필드 신경망을
    확장한 모델입니다. 한 번의 갱신만으로 빠르게 수렴하며, 이 갱신 규칙이 트랜스포머의 셀프 어텐션(self-attention)과 수학적으로
    동일함이 밝혀져 어텐션 메커니즘을 연상 기억의 관점에서 재해석하는 계기가 되었습니다.</p>`,
    formula: `&#958;&#8348;&#8330;&#8321; = X&#8901;softmax(&#946;&#8901;X&#7488;&#958;&#8348;)  (X는 저장 패턴 행렬, 어텐션의 softmax(QK&#7488;)V와 동형)`,
    features: `<p><strong>장점</strong> — 지수적으로 많은 패턴을 저장할 수 있고 트랜스포머 계층으로 직접 통합할 수 있습니다.</p>
    <p><strong>단점</strong> — 온도 파라미터(&#946;) 등 설정에 따라 저장·검색 성능이 달라집니다.</p>`,
    applications: `<p>멀티플 인스턴스 학습, 면역 레퍼토리 분류, 트랜스포머 기반 메모리·어텐션 모듈 연구 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/hopfield-networks-is-all-you-need'
  },
  {
    id: 'anogan',
    category: 'unsup',
    subcategory: 'neural',
    title: 'GAN을 이용한 이상치 탐지 (AnoGAN, Anomaly detection with GAN)',
    subtitle: '정상 데이터로 학습한 GAN의 잠재 공간 탐색으로 이상치를 탐지하는 방법',
    overview: `<p>정상 데이터만으로 GAN을 학습시켜 정상 데이터의 매니폴드를 생성자가 학습하게 한 뒤, 테스트 시점에 입력 이미지와
    가장 유사한 이미지를 생성하는 잠재 벡터를 역으로 탐색(latent space search)합니다. 원본과 GAN이 생성한 최적 근사 이미지 사이의
    재구성 오차와 판별자 특징 차이를 결합한 이상 점수(anomaly score)로 정상 매니폴드에서 벗어난 정도를 측정합니다.</p>`,
    formula: `A(x) = (1&#8722;&#955;)&#8901;R(x) + &#955;&#8901;D(x)  (R: 재구성 오차, D: 판별자 특징 매칭 손실)`,
    features: `<p><strong>장점</strong> — 정상 데이터만으로 학습해 레이블이 부족한 이상치 탐지 문제에 적합합니다.</p>
    <p><strong>단점</strong> — 테스트마다 잠재 벡터를 최적화해야 해 추론 속도가 느립니다(후속 연구 f-AnoGAN이 인코더 도입으로 개선).</p>`,
    applications: `<p>망막 안저 영상 등 의료 영상의 병변 탐지, 제조 공정의 결함 탐지 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/unsupervised-anomaly-detection-with'
  },
  {
    id: 'autoencoder-based-detection',
    category: 'unsup',
    subcategory: 'neural',
    title: '오토인코더 기반 탐지 (Autoencoder-based Detection)',
    subtitle: '정상 데이터의 재구성 오차를 기준으로 이상치를 판정하는 방법',
    overview: `<p>정상 데이터만으로 오토인코더를 학습시켜 정상 패턴을 낮은 오차로 복원하도록 만든 뒤, 테스트 데이터의 재구성
    오차가 임계값을 넘으면 이상치로 판정하는 방법입니다. 오토인코더가 정상 데이터의 저차원 매니폴드만 잘 학습한다는 전제하에,
    이상 데이터는 이 매니폴드에서 벗어나 있어 복원이 잘 되지 않는다는 원리를 이용합니다.</p>`,
    formula: `score(x) = ||x &#8722; g(f(x))||&#178;  (임계값 초과 시 이상치로 판정)`,
    features: `<p><strong>장점</strong> — 구조가 단순하고 레이블 없는 정상 데이터만으로 학습할 수 있습니다.</p>
    <p><strong>단점</strong> — 오토인코더가 이상 데이터도 지나치게 잘 복원해버리는 경우 탐지 성능이 저하됩니다.</p>`,
    applications: `<p>설비 고장 예측, 신용카드 이상거래 탐지, 네트워크 침입 탐지 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: ''
  },
  {
    id: 'deep-svdd',
    category: 'unsup',
    subcategory: 'neural',
    title: '심층 서포트 벡터 데이터 설명 (Deep SVDD, Deep Support Vector Data Description)',
    subtitle: '정상 데이터를 특징 공간의 최소 초구 안으로 모으도록 신경망을 학습하는 원클래스 이상치 탐지',
    overview: `<p>얕은 커널 기반의 SVDD를 심층 신경망으로 확장하여, 정상 데이터를 특징 공간의 가장 작은 초구(hypersphere) 안에
    모이도록 신경망을 직접 학습시키는 원클래스 이상치 탐지 방법입니다. 테스트 샘플이 이 초구의 중심에서 멀리 떨어질수록 이상치일
    가능성이 높다고 판단하며, 별도의 오토인코더 재구성 단계 없이 이상치 탐지 목적함수로 표현을 직접 학습한다는 점이 특징입니다.</p>`,
    formula: `min&#8332;&#8348;&#8348; ||&#966;(x;W)&#8722;c||&#178;  (c는 초구 중심, &#966;는 신경망 표현)`,
    features: `<p><strong>장점</strong> — 표현 학습과 이상치 탐지 목적을 하나로 통합해 엔드투엔드 학습이 가능합니다.</p>
    <p><strong>단점</strong> — 모든 특징이 중심 c 하나로 수축(collapse)하는 자명해로 붕괴할 위험이 있어 구조적 제약(편향 없는 층 등)이 필요합니다.</p>`,
    applications: `<p>이미지 이상치 탐지, 산업 결함 탐지, 사이버 보안의 이상 트래픽 탐지 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/deep-one-class-classification'
  },
  {
    id: 'lstm-anomaly-detection',
    category: 'unsup',
    subcategory: 'neural',
    title: 'LSTM 기반 이상치 탐지 (LSTM, Long Short-Term Memory-based Anomaly Detection, 시계열)',
    subtitle: 'LSTM으로 정상 시계열 패턴을 학습하고 예측·복원 오차로 이상을 탐지하는 방법',
    overview: `<p>정상 시계열로 LSTM 인코더-디코더(또는 예측 모델)를 학습시켜, 다음 시점 값을 예측하거나 시퀀스를 복원하도록
    만든 뒤 실제 값과의 오차가 커지는 구간을 이상치로 탐지하는 방법입니다. LSTM의 장기 의존성 포착 능력 덕분에 단순 통계
    기법보다 복잡한 주기성과 추세를 가진 시계열에서도 정상 패턴을 잘 학습합니다.</p>`,
    formula: `score(t) = ||x&#8348; &#8722; x&#770;&#8348;||  (예측/복원 오차, 임계값 또는 오차 분포 기반 판정)`,
    features: `<p><strong>장점</strong> — 장기 시간 의존성과 복잡한 패턴을 가진 시계열에 효과적입니다.</p>
    <p><strong>단점</strong> — 학습에 충분한 정상 구간 데이터가 필요하고, 매우 긴 시퀀스에서는 학습·추론 비용이 큽니다.</p>`,
    applications: `<p>설비 센서 데이터의 고장 예측, 심전도 등 생체 신호 이상 탐지, 서버 지표 모니터링 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/lstm-based-encoder-decoder-for-multi-sensor'
  },
  {
    id: 'oc-nn',
    category: 'unsup',
    subcategory: 'neural',
    title: '일클래스 신경망 (OC-NN, One-Class Neural Networks)',
    subtitle: '특징 학습과 원클래스 경계 학습을 하나의 목적함수로 결합한 이상치 탐지 방법',
    overview: `<p>오토인코더로 특징을 추출한 뒤 별도의 One-Class SVM을 적용하는 하이브리드 방식과 달리, 신경망의 은닉 표현과
    원클래스 목적함수(정상 데이터를 원점에서 최대 마진으로 분리하는 초평면)를 하나의 목적함수로 결합해 동시에 최적화하는
    이상치 탐지 방법입니다. 표현이 이상치 탐지 목적에 맞춰 직접 학습된다는 점에서 Deep SVDD와 유사한 철학을 공유합니다.</p>`,
    formula: `min &#189;||w||&#178; + (1/&#957;n)&#8721;max(0, r&#8722;&#10216;w,&#966;(x&#7522;)&#10217;) &#8722; r`,
    features: `<p><strong>장점</strong> — 특징 추출과 이상치 탐지 경계 학습을 분리하지 않아 표현이 탐지 목적에 특화됩니다.</p>
    <p><strong>단점</strong> — 목적함수가 비볼록이라 최적화가 까다롭고 하이퍼파라미터(&#957;) 튜닝이 필요합니다.</p>`,
    applications: `<p>네트워크 침입 탐지, 사기 탐지 등 레이블이 거의 없는 이상치 탐지 문제에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/anomaly-detection-using-one-class-neural'
  },
  {
    id: 'tcn',
    category: 'unsup',
    subcategory: 'neural',
    title: '시간적 합성곱 신경망 (TCN, Temporal Convolutional Networks)',
    subtitle: '인과적 팽창 합성곱으로 긴 시퀀스 의존성을 병렬 연산으로 포착하는 신경망',
    overview: `<p>인과적(causal) 팽창 합성곱(dilated convolution)과 잔차 연결을 쌓아 시퀀스를 처리하는 합성곱 신경망 구조입니다.
    미래 시점의 정보가 과거 예측에 섞이지 않도록 인과성을 보장하면서, 팽창 합성곱으로 층이 깊어질수록 수용 영역(receptive field)을
    지수적으로 넓혀 RNN 계열 못지않은 긴 시퀀스 의존성을 병렬 연산으로 포착합니다.</p>`,
    formula: `y&#8348; = &#8721;&#8305;&#8320;&#8348;&#8320;&#8342;&#8315;&#185; f(i)&#8901;x&#8348;&#8322;&#8353;&#8305;  (d는 팽창 계수, k는 커널 크기)`,
    features: `<p><strong>장점</strong> — RNN과 달리 시퀀스를 병렬로 처리할 수 있어 학습이 빠르고, 여러 시퀀스 모델링 과제에서 LSTM/GRU를 능가하는 성능을 보입니다.</p>
    <p><strong>단점</strong> — 매우 긴 의존성을 다루려면 층 수나 팽창 계수를 크게 늘려야 해 메모리 사용량이 늘어납니다.</p>`,
    applications: `<p>시계열 이상치 탐지, WaveNet 계열의 음성 합성, 동작 인식·행동 예측 등에 사용됩니다.</p>`,
    sklearnFunction: '',
    sklearnGuideURL: '',
    sklearnAPIURL: '',
    sklearnExampleURL: '',
    huggingfaceURL: '',
    spaceURL: '',
    papersWithCodeURL: 'https://paperswithcode.com/paper/convolutional-sequence-modeling-revisited'
  }
];
