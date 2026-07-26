# SourcePriority.md — 모델별 콘텐츠 작성 시 참조 소스 우선순위

algorithms.html의 각 모델 항목(개요/수식/특징/적용분야/링크)을 작성할 때 참조하는 사이트의 부문별 우선순위표.

## 원칙
- **TextBook-##(https://github.com/YangGuiBee/ML/tree/main/TextBook-##)은 모든 부문에서 특징(장단점)의 1순위 출처**로 고정 — 본인 강의자료라 신뢰도 높음.
- 단, TextBook-##은 2024년 작성 — 고전/안정적 알고리즘(K-평균, DBSCAN 등)은 그대로 신뢰 가능하나, 딥러닝·LLM처럼 빠르게 변하는 영역은 Hugging Face·Papers with Code 등 살아있는 소스를 우선 확인하고 TextBook-##은 보조 자료로 취급할 필요 있음 (2026-07-25 논의, 표에는 아직 미반영 — 추후 정리 예정).
- 개요·수식·URL은 그다음 우선순위 소스에서 검증.

## 부문별 우선순위표

| 부문 | 1순위 | 2순위 | 3순위 | 4순위+ |
|---|---|---|---|---|
| **범용** | TextBook-## (특징 우선) | scikit-learn (해당 시) | Machine Learning Mastery | GeeksforGeeks → saedsayad → Wikipedia(사실검증) → StatQuest(개념보강) |
| **통계도구/회귀/GLM** | TextBook-## | scikit-learn (해당 시) | StatsModels (GLM·ARIMA 등) | Penn State STAT(수식검증) |
| **이상치 탐지** | TextBook-## | scikit-learn (LOF·OC-SVM·Isolation Forest·EllipticEnvelope) | PyOD (나머지 전부) | — |
| **연관규칙/패턴마이닝** | TextBook-## | mlxtend (Apriori·FP-Growth) | SPMF (시퀀스 패턴류) | — |
| **그래프/부분공간 군집화** | TextBook-## | scikit-learn (Spectral·Affinity Propagation) | NetworkX (그래프 커뮤니티) | ELKI (부분공간류) |
| **딥러닝/신경망** | TextBook-## | Hugging Face 공식문서 (모델카드) | Lilian Weng 블로그 (개념) | D2L.ai(수식검증) → Papers with Code(원논문+코드) |
| **강화학습** | TextBook-## | OpenAI Spinning Up (수식+의사코드) | Hugging Face Deep RL Course | Sutton & Barto 원서(정본검증) |
| **앙상블** | TextBook-## | scikit-learn (Voting·Bagging·AdaBoost·GBM) | XGBoost/LightGBM/CatBoost 공식문서 | — |

## 사이트 목록 (전체)

### 범용
- Machine Learning Mastery — https://machinelearningmastery.com
- GeeksforGeeks — https://geeksforgeeks.org
- saedsayad.com — https://www.saedsayad.com
- Wikipedia
- StatQuest (Josh Starmer) — https://statquest.org

### 통계 도구 / 회귀 / GLM
- StatsModels 공식문서 — https://statsmodels.org
- Penn State STAT Online — https://online.stat.psu.edu

### 이상치 탐지
- PyOD 공식문서 — https://pyod.readthedocs.io

### 연관규칙 / 시퀀스 패턴 마이닝
- mlxtend 공식문서 — https://rasbt.github.io/mlxtend
- SPMF — https://www.philippe-fournier-viger.com/spmf

### 그래프 기반 / 부분공간 군집화
- NetworkX 공식문서 — https://networkx.org
- ELKI 프로젝트 — https://elki-project.github.io

### 딥러닝 / 신경망 기반
- Lilian Weng 블로그 — https://lilianweng.github.io
- D2L.ai (Dive into Deep Learning) — https://d2l.ai
- Hugging Face 공식문서 — https://huggingface.co/docs

### 강화학습
- OpenAI Spinning Up — https://spinningup.openai.com
- Hugging Face Deep RL Course — https://huggingface.co/learn/deep-rl-course
- Sutton & Barto 원서 — http://incompleteideas.net/book/the-book.html

### 앙상블 / 부스팅
- scikit-learn 공식문서 — https://scikit-learn.org
- XGBoost 공식문서 — https://xgboost.readthedocs.io
- LightGBM 공식문서 — https://lightgbm.readthedocs.io
- CatBoost 공식문서 — https://catboost.ai/docs

---
사용자가 추가로 선정할 사이트 목록은 이후 병합 예정 (2026-07-26 예고).



[#.#.#.##] 영어명* : 한글명
*약어가 있다면 약어(영어명) : 한글명
▣ 개요 : 
▣ 수식 : 
▣ 특징(장점, 단점) : 
▣ 적용분야 : 
▣ sk-learn에서 제공하는 함수명 : 
▣ sk-learn 가이드 URL : 
▣ sk-learn API URL : 
▣ sk-learn 예제 URL : 
▣ Hugging Face URL :
▣ Space URL : 
▣ Papers with Code URL : 

