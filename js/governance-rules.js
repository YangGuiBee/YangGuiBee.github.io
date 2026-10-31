/* AI거버넌스 체크리스트 — 판정 규칙(데이터)
 * 근거: AI기본법·시행령, 개인정보 보호법, 과기정통부 가이드라인 5종(고영향 판단 2026.4.29 수정본 등),
 *       개인정보위 생성형 AI 이용자 가이드(2026.5.19), 대한민국 인공지능 윤리원칙(2026.8.21).
 * 고시 발령·가이드라인 개정 시 이 파일만 수정한다. 기준일은 GOV_DATE.
 * 근거 표기의 {법:34|표기} 토큰은 governance.js가 law.go.kr 조문 링크로 바꾼다.
 */
const GOV_DATE = '2026.10.31';

const GOV_LAWS = {
  '법':   '인공지능 발전과 신뢰 기반 조성 등에 관한 기본법',
  '영':   '인공지능 발전과 신뢰 기반 조성 등에 관한 기본법 시행령',
  '개보': '개인정보 보호법',
  '개보영': '개인정보 보호법 시행령'
};

/* ── 조직 입력 ── */
// st: AI기본법 "국가기관등"(시행령 제8조① — 국가·지자체·공운법 공공기관)
// pp: 개인정보 보호법 "공공기관"(제2조제6호, 시행령 제2조 — 지방공기업·특수법인·각급 학교까지)
// 학교의 st는 설립 주체(SCHOOL_FOUND)로 정한다
const ORG_TYPES = [
  { v: 'state',   label: '국가기관·지방자치단체', st: true, pp: true },
  { v: 'public',  label: '공공기관(「공공기관의 운영에 관한 법률」 제4조)', st: true, pp: true },
  { v: 'quasi',   label: '지방공사·공단, 특수법인 등(개인정보 보호법상 공공기관)', st: false, pp: true },
  { v: 'school',  label: '학교(유·초·중등·고등교육기관)', st: false, pp: true },
  { v: 'private', label: '민간 기업', st: false, pp: false },
  { v: 'etc',     label: '그 밖의 단체(비영리법인·협회 등)', st: false, pp: false }
];
const SCHOOL_FOUND = [
  { v: 'pub',  label: '국립·공립(국립대학법인 제외)' },
  { v: 'priv', label: '사립·국립대학법인' }
];

// 시행령 제29조① 국내대리인 지정 기준(해외 사업자만)
const FOREIGN_CRITERIA = [
  { v: 'sales',  label: '전년도 매출액 1조원 이상' },
  { v: 'aisales', label: '인공지능서비스 부문 전년도 매출액 100억원 이상' },
  { v: 'users',  label: '직전 3개월 국내 이용자 1일 평균 100만명 이상' },
  { v: 'fine',   label: 'AI기본법 제43조①3호 과태료를 받은 적 있음' }
];

// 개인정보 보호법 시행령 제35조 — 공공기관 개인정보 영향평가 대상 개인정보파일
const PI_SCALE = [
  { v: 'none',  label: '해당 없음 / 기준 미만' },
  { v: 's5',    label: '민감정보·고유식별정보 5만명 이상 파일' },
  { v: 'l50',   label: '다른 개인정보파일과 연계해 50만명 이상' },
  { v: 'a100',  label: '정보주체 100만명 이상 파일' }
];

/* ── 시스템 입력 ── */
const SYS_ORIGIN = [
  { v: 'self',   label: '자체 개발' },
  { v: 'vendor', label: '외부 AI 제품·서비스 도입' },
  { v: 'api',    label: '외부 AI 모델·API를 결합해 직접 구성' }
];
const SYS_PROVIDE = [
  { v: 'internal', label: '조직 내부 업무에만 사용' },
  { v: 'external', label: '외부 이용자(고객·국민·지원자 등)에게 제공' },
  { v: 'resell',   label: '다른 사업자·기관에 AI 제품·서비스로 공급' }
];
const SYS_GEN = [
  { v: 'none',     label: '생성 기능 없음(분류·예측·추천 등)' },
  { v: 'gen',      label: '글·이미지·음성·영상 등을 생성' },
  { v: 'deepfake', label: '실제와 구분하기 어려운 음향·이미지·영상 생성' }
];
const SYS_PI = [
  { v: 'none',      label: '개인정보 처리 안 함' },
  { v: 'general',   label: '일반 개인정보 처리' },
  { v: 'sensitive', label: '민감정보·고유식별정보 처리(개인 식별 목적 생체정보 포함)' }
];
const SYS_FRONTIER = [
  { v: 'no',  label: '아니오 / 해당 없음' },
  { v: 'yes', label: '예 — 시행령 제24조① 3요건 모두 충족' }
];

// 사람 개입 방식 — 여러 분야에서 공통으로 쓰는 질문
const Q_HUMAN = {
  id: 'human', label: '사람은 AI 결과에 어떻게 개입하나요?',
  opts: [
    { v: 'auto', label: 'AI가 최종 결정 — 사람 검토 없음' },
    { v: 'main', label: '사람이 결정하지만 AI 결과가 주된 근거이거나 검토가 형식적' },
    { v: 'ref',  label: '권한 있는 사람이 독립적으로 판단하고 AI 결과는 참고만' },
    { v: 'aux',  label: '모니터링·자료 정리 등 보조 기능만' }
  ]
};
const YN = [{ v: 'yes', label: '예' }, { v: 'no', label: '아니오' }];
const YNU = [{ v: 'yes', label: '예' }, { v: 'no', label: '아니오' }, { v: 'unknown', label: '모름' }];

/* ── 고영향 분야(AI기본법 제2조제4호, 판단 가이드라인 2.1~2.13) ──
 * judge(a, ctx) → { lv: 'high' | 'review' | 'low' | 'out', why }
 *   high = 해당 가능성 높음, review = 검토 필요(확인 요청 권장), low = 비해당 가능, out = 분야 범위 밖
 */
const AREAS = [
  { v: 'energy', label: '에너지 공급(전력 발전·송배전·소비)', ref: '판단 가이드라인 2.1',
    qs: [{ id: 'fn', label: 'AI가 맡는 기능은?', opts: [
      { v: 'ctrl', label: '발전·송배전·부하 분배·에너지저장장치를 직접 제어' },
      { v: 'pred', label: '수요·발전량 예측, 설비 상태 모니터링' },
      { v: 'office', label: '요금 안내·고객 응대 등 전력망 운영과 무관' }] }, Q_HUMAN],
    judge: a => {
      if (a.fn === 'office') return { lv: 'low', why: '전력망 안정성·효율성에 영향을 주지 않는 기능' };
      if (a.fn === 'ctrl') return a.human === 'ref' || a.human === 'aux'
        ? { lv: 'review', why: '전력망 제어 기능이지만 사람이 독립 판단 — 5개 기준(기능 중요도·잠재적 위험성·신뢰성·데이터·자율성) 종합 검토' }
        : { lv: 'high', why: '전력망에 직접 영향을 주는 필수 기능을 자율적으로 수행' };
      return { lv: 'review', why: '부하 예측·설비 모니터링도 가이드라인의 기능 중요도 예시 — 오류 시 영향과 자율성으로 판단' };
    } },

  { v: 'water', label: '먹는물 생산 공정', ref: '판단 가이드라인 2.2',
    qs: [{ id: 'stage', label: 'AI가 맡는 단계는?', opts: [
      { v: 's1', label: '1단계 기초 모니터링·데이터 수집' },
      { v: 's2', label: '2단계 수질 진단·예측(사람이 검토 후 조치)' },
      { v: 's3', label: '3단계 처리설비 자동 조정·약품 자동 투입' },
      { v: 's4', label: '4단계 완전 자동화·독립 운영' },
      { v: 'sewage', label: '하수처리(먹는물 공급 아님)' }] }],
    judge: a => ({
      sewage: { lv: 'out', why: '하수처리는 고영향 분야가 아님(가이드라인 2.2.2)' },
      s1: { lv: 'low', why: '위험도 낮은 기초 모니터링 단계 — 데이터 정확성은 관리' },
      s2: { lv: 'review', why: '예측 결과는 반드시 사람이 검토해야 하는 단계' },
      s3: { lv: 'high', why: '잘못된 자동 조정이 건강에 직접 영향' },
      s4: { lv: 'high', why: '사람 개입이 최소화된 완전 자동 운영' }
    }[a.stage]) },

  { v: 'health', label: '보건의료 제공·이용체계', ref: '판단 가이드라인 2.3',
    qs: [{ id: 'fn', label: 'AI가 맡는 기능은?', opts: [
      { v: 'diag', label: '진단·치료·예후 등 보건의료적 판단(최종 결정이 아니어도 의사결정에 영향)' },
      { v: 'care', label: '건강 상태 예측·생활습관 관리 제시' },
      { v: 'admin', label: '예약·접수·청구 등 행정 업무' }] },
      { id: 'harm', label: '오작동 시 생명·신체·정신에 중대한 피해가 생길 수 있나요?', opts: YN }],
    judge: a => {
      if (a.fn === 'admin') return { lv: 'low', why: '보건의료적 판단 기능이 아님' };
      if (a.fn === 'diag' && a.harm === 'yes') return { lv: 'high', why: '보건의료적 판단 기능 + 중대 피해 우려' };
      if (a.harm === 'yes') return { lv: 'review', why: '건강관리 기능이지만 중대 피해 우려 — 기여도와 위험의 중대성으로 판단' };
      return { lv: a.fn === 'diag' ? 'review' : 'low', why: '중대 피해 우려가 낮음 — 기여도에 따라 판단' };
    } },

  { v: 'device', label: '의료기기·디지털의료기기', ref: '판단 가이드라인 2.3',
    qs: [{ id: 'grade', label: '디지털의료기기 등급은?', opts: [
      { v: 'g34', label: '3등급 또는 4등급' },
      { v: 'g12', label: '1등급 또는 2등급' },
      { v: 'tbd', label: '인허가 전 / 등급 미정' }] }],
    judge: a => ({
      g34: { lv: 'high', why: '3등급 이상 디지털의료기기는 고영향 — 「디지털의료제품법」 조치 이행 시 AI기본법 제34조① 조치를 이행한 것으로 봄(시행령 별표1)' },
      g12: { lv: 'low', why: '1·2등급은 고영향 디지털의료기기 기준(3등급 이상)에 해당하지 않음' },
      tbd: { lv: 'review', why: '식약처 등급 지정 결과에 따라 결정' }
    }[a.grade]) },

  { v: 'nuclear', label: '원자력(핵물질·원자력시설)', ref: '판단 가이드라인 2.4',
    qs: [{ id: 'safety', label: 'AI가 쓰이는 설비·기능은?', opts: [
      { v: 'grade', label: '안전등급 1·2·3 안전기능 또는 안전등급 규정 제8조②각호 기능' },
      { v: 'non', label: '그 밖의 비안전 기능' }] },
      { id: 'exc', label: 'AI의 역할은?', opts: [
        { v: 'direct', label: '설비나 기능을 직접 운전' },
        { v: 'monitor', label: '모니터링만 수행' },
        { v: 'cross', label: '기능 수행 전 사람이 Cross-check' },
        { v: 'aux', label: '사람 판단에 보조 자료 제공' },
        { v: 'addl', label: '기존 안전기능에 추가 안전기능 제공' }] }],
    judge: a => {
      if (a.safety === 'non') return { lv: 'low', why: '안전등급 기능을 수행하지 않음' };
      return a.exc === 'direct'
        ? { lv: 'high', why: '안전등급 기능을 AI가 직접 수행' }
        : { lv: 'low', why: '안전등급 기능이지만 예외(i~iv) 해당 — 가이드라인 2.4.3' };
    } },

  { v: 'crime', label: '범죄 수사·체포용 생체인식정보 분석', ref: '판단 가이드라인 2.5',
    qs: [{ id: 'scope', label: '어떤 업무인가요?', opts: [
      { v: 'inv', label: '범죄 수사·체포 업무에서 생체인식정보를 분석·활용' },
      { v: 'other', label: '치안·범죄 예방·출입국 심사·교정 등, 또는 생체정보가 아님' }] },
      { id: 'crit', label: '다음에 해당하나요?', opts: [
        { v: 'list', label: 'i~iv 중 하나(무작위 안면 수집·인식 / 인종·신체 특징 추론 분류 / 대량 감시 / 사람이 추천 결과를 검토할 수 없음)' },
        { v: 'score', label: '위에는 없지만 점수표(A그룹 4점·B그룹 3점) 합계 8점 이상' },
        { v: 'no', label: '둘 다 아님' }] }],
    judge: a => {
      if (a.scope === 'other') return { lv: 'out', why: '치안·예방·출입국·교정은 수사·체포 업무 범위가 아님(가이드라인 2.5.2)' };
      if (a.crit === 'no') return { lv: 'low', why: 'i~iv에 해당하지 않고 점수 8점 미만' };
      return { lv: 'high', why: a.crit === 'list' ? '가이드라인 2.5.3 i~iv 해당' : '점수표 합계 8점 이상' };
    } },

  { v: 'hire', label: '채용', ref: '판단 가이드라인 2.6',
    qs: [{ id: 'use', label: 'AI가 하는 일은?', opts: [
      { v: 'score', label: '지원서 프로파일링·점수·등급화, 서·논술형 채점' },
      { v: 'bio', label: '면접·실기에서 표정·음성 등 생체정보 분석' },
      { v: 'info', label: '모집 과정에서 AI가 스스로 판단해 채용정보 제공' },
      { v: 'exam', label: '필기 평가 문제 출제' },
      { v: 'admin', label: '일정 안내·FAQ 응답 등 판단·평가 없음' }] }, Q_HUMAN],
    judge: a => {
      if (a.use === 'admin') return { lv: 'low', why: '채용 판단·평가를 하지 않음 — 평가성 답변은 기능에서 빼야 함' };
      if (a.use === 'bio') return { lv: 'high', why: '생체정보를 면접·실기에 활용(2.6.3 ⅱ)' };
      if (a.use === 'info') return { lv: 'high', why: 'AI가 스스로 판단해 채용정보 제공(2.6.3 ⅰ)' };
      if (a.use === 'exam') return a.human === 'auto'
        ? { lv: 'high', why: '구인자 검수 없이 최종 출제(2.6.3 ⅲ)' }
        : { lv: 'low', why: '구인자가 검수 후 출제' };
      if (a.human === 'auto' || a.human === 'main')
        return { lv: 'high', why: 'AI 결과만으로 결정하거나 사람 개입이 형식적(2.6.3 ⅱ·ⅳ)' };
      return { lv: 'review', why: '점수화(2.6.3 ⅱ)지만 점수를 참고로만 쓰고 심사위원이 전수 평가하면 비해당 가능(사례 14)' };
    } },

  { v: 'loan', label: '대출 심사 등 금융', ref: '판단 가이드라인 2.7',
    qs: [{ id: 'task', label: '어떤 업무인가요?', opts: [
      { v: 'decide', label: '대출 승인 여부·조건 결정에 직접 관련(개인사업자 포함)' },
      { v: 'other', label: '상담 챗봇·이상거래탐지(FDS)·카드발급·리스·내부 업무' }] },
      { id: 'role', label: 'AI 결과의 역할은?', opts: [
        { v: 'final', label: '최종 결정, 또는 중간 단계에서 최종 결정에 상당한 영향' },
        { v: 'ref', label: '단순 참고' }] },
      { id: 'sens', label: '차별적 데이터나 민감한 데이터를 쓰나요?', opts: YN },
      { id: 'pts', label: '점수표 — 해당 항목을 모두 고르세요', multi: true, opts: [
        { v: 'a1', label: '[A·2점] 기존보다 복잡도가 커진 신규 모델' },
        { v: 'a2', label: '[A·2점] 금융소비자 1만명 이상 대상' },
        { v: 'a3', label: '[A·2점] 자동화·속도 때문에 사람 개입이 사실상 불가능' },
        { v: 'b1', label: '[B·1점] 대리변수를 자주 사용' },
        { v: 'b2', label: '[B·1점] 다른 업무용 AI를 일시·단기 전용' },
        { v: 'b3', label: '[B·1점] 국외 데이터로 학습한 국외 AI 사용' }] }],
    judge: a => {
      if (a.task === 'other') return { lv: 'out', why: '대출 심사 범위가 아님(챗봇·FDS·카드발급·리스·내부 업무 제외, 2.7.2)' };
      const pts = (a.pts || []).reduce((s, p) => s + (p[0] === 'a' ? 2 : 1), 0);
      if (a.role === 'final') return { lv: 'high', why: '최종 결정 또는 최종 결정에 상당한 영향' };
      if (a.sens === 'yes') return { lv: 'high', why: '차별적·민감 데이터 사용' };
      if (pts >= 4) return { lv: 'high', why: `점수표 ${pts}점(4점 이상)` };
      return { lv: 'low', why: `단순 참고, 점수표 ${pts}점 — 금융 관련 법 조치로 이행 간주 특례 있음(금융소비자보호법·신용정보법)` };
    } },

  { v: 'road', label: '도로교통(자동차·교통시설·교통체계)', ref: '판단 가이드라인 2.8',
    qs: [{ id: 'kind', label: '어떤 시스템인가요?', opts: [
      { v: 'l45', label: '조건부 완전자율주행(레벨4)·완전자율주행(레벨5)' },
      { v: 'l3', label: '부분 자율주행(레벨3)' },
      { v: 'car', label: '자율주행 외 차량 탑재 AI' },
      { v: 'infra', label: '교통시설·교통체계(신호·관제 등)' }] },
      { id: 'sub', label: '차량 AI라면 / 교통시설이라면', opts: [
        { v: 'replace', label: '차량: 기존 필수 수단을 대체 / 시설: 교통량 25,000대 이상 도로나 스쿨존·교차로·철도건널목에 영향' },
        { v: 'addon', label: '차량: 편의 목적 보조 기능 / 시설: 위 장소에 영향 없음' },
        { v: 'na', label: '해당 없음(레벨3~5)' }] },
      { id: 'std', label: '법정 성능평가·안전기준을 충족해 중대 영향 가능성을 극히 낮출 수 있나요?', opts: YN }, Q_HUMAN],
    judge: a => {
      if (a.kind === 'l45') return { lv: 'high', why: '운전자 개입 없이 운행하는 자율주행시스템' };
      if (a.kind === 'l3') return a.std === 'yes'
        ? { lv: 'review', why: '레벨3은 해당 가능성이 높으나 안전기준 준수로 피해를 현저히 낮추면 비해당 가능' }
        : { lv: 'high', why: '레벨3 자율주행시스템 — AI가 주행 제어' };
      if (a.std === 'yes') return { lv: 'low', why: '법정 안전기준 충족으로 중대 영향 가능성이 극히 낮음' };
      if (a.human === 'ref' || a.human === 'aux') return { lv: 'low', why: 'AI가 사람 의사결정의 보조 역할만 함' };
      if (a.sub === 'addon') return { lv: 'low', why: a.kind === 'car' ? '필수 수단을 유지한 편의 보조' : '특별 주의 장소에 영향 없음 — 잠재적 피해로 판단' };
      return { lv: 'high', why: '주요한 작동·운영의 의사결정에 관여하고 잠재적 피해가 큼' };
    } },

  { v: 'sea', label: '해상교통', ref: '판단 가이드라인 2.9',
    qs: [{ id: 'fn', label: 'AI 기능의 중요도는?', opts: [
      { v: 'core', label: '필수 — 자동 항해·충돌 회피·비상 대응 등' },
      { v: 'assist', label: '보조 — AI가 없어도 대체 시스템이 있음' },
      { v: 'opt', label: '선택 — 운항에 직접 영향 없음' }] }],
    judge: a => ({
      core: { lv: 'high', why: '인명과 직접 연결된 탐지·판단·조치 기능' },
      assist: { lv: 'review', why: '데이터 정확성·신뢰성·오작동 위험·비상 대응 능력으로 판단' },
      opt: { lv: 'low', why: '선박 운항에 직접 영향 없음' }
    }[a.fn]) },

  { v: 'air', label: '항공교통', ref: '판단 가이드라인 2.10',
    qs: [{ id: 'indep', label: 'AI가 전부 또는 일부를 독립적으로 최종 결정하나요?', opts: YN },
      { id: 'sev', label: '관련 사고 심각도가 C 이상인가요?', opts: YNU },
      { id: 'freq', label: '발생 가능성이 \'높음\' 이상인가요?', opts: YNU }],
    judge: a => {
      if (a.indep === 'no') return { lv: 'low', why: 'AI가 독립적으로 최종 결정하지 않음' };
      if (a.sev === 'yes' && a.freq === 'yes') return { lv: 'high', why: '독립 결정 + 심각도 C 이상 + 발생 가능성 높음 이상' };
      if (a.sev === 'no' || a.freq === 'no') return { lv: 'low', why: '심각도·발생 가능성 기준 미달' };
      return { lv: 'review', why: '항공안전데이터 규정의 심각도·발생 가능성 평가 필요' };
    } },

  { v: 'rail', label: '철도교통', ref: '판단 가이드라인 2.11',
    qs: [{ id: 'indep', label: 'AI가 전부 또는 일부를 독립적으로 최종 결정하나요?', opts: YN },
      { id: 'risk', label: '충돌·탈선·화재, 3명 이상 사상, 5천만원 이상 피해를 일으킬 수 있나요?', opts: YNU }],
    judge: a => {
      if (a.indep === 'no') return { lv: 'low', why: 'AI가 독립적으로 최종 결정하지 않음' };
      if (a.risk === 'yes') return { lv: 'high', why: '독립 결정 + 철도사고 수준 위험' };
      if (a.risk === 'no') return { lv: 'low', why: '철도사고 수준 위험 없음' };
      return { lv: 'review', why: '철도 위험도 평가 세부기준으로 확인 필요' };
    } },

  { v: 'public', label: '공공서비스 자격 확인·결정·비용징수', ref: '판단 가이드라인 2.12',
    qs: [{ id: 'use', label: 'AI가 쓰이는 곳은?', opts: [
      { v: 'decide', label: '공공서비스 제공 여부·순위 결정' },
      { v: 'qual', label: '판단 재량이 있는 자격 확인' },
      { v: 'qual_s', label: '객관적·단순한 자격 확인(재량 없음, 즉시 반박 가능)' },
      { v: 'fee', label: '주관적·정책적 판단이 필요한 비용 산정·징수' },
      { v: 'fee_s', label: '정액화·공개된 기준의 비용 징수' },
      { v: 'other', label: '안내·민원 응대 등' }] }, Q_HUMAN],
    judge: (a, ctx) => {
      if (!ctx.isState) return ctx.sys.provide === 'resell'
        ? { lv: 'review', why: '국가기관등의 의사결정에 쓰이도록 공급 — 공급받는 기관 기준으로 판단' }
        : { lv: 'out', why: '국가기관등의 의사결정에만 해당' };
      if (a.use === 'other') return { lv: 'low', why: '자격 확인·결정·비용징수가 아님' };
      if (a.human === 'auto' && a.use === 'decide') return { lv: 'high', why: '사람 개입 없는 최종 결정(2.12.3 ⅳ)' };
      if (a.use === 'qual_s') return { lv: 'low', why: '객관적·단순한 자격 확인(2.12.3 ⅰ 단서)' };
      if (a.use === 'fee_s') return { lv: 'low', why: '정액화·공개된 비용(2.12.3 ⅱ 단서)' };
      return { lv: 'high', why: { decide: '제공 여부·순위 결정(ⅲ)', qual: '재량 있는 자격 확인(ⅰ)', fee: '주관적 비용 산정(ⅱ)' }[a.use] };
    } },

  { v: 'edu', label: '유아·초등·중등교육 학생 평가', ref: '판단 가이드라인 2.13',
    qs: [{ id: 'level', label: '학교급은?', opts: [
      { v: 'k12', label: '유치원·초등학교·중고등학교' },
      { v: 'higher', label: '대학·평생교육 등' }] },
      { id: 'task', label: 'AI가 쓰이는 업무는?', opts: [
        { v: 'diag', label: '기초학력 진단검사' },
        { v: 'exam', label: '정기시험·수행평가(문항·기준·시행·결과 분석)' },
        { v: 'rec', label: '학생부 교과학습·행동발달 등 교사 주관 항목 작성' },
        { v: 'rec_admin', label: '학생부 서류 판독·분류·요약 등 업무 효율화' }] },
      { id: 'teacher', label: '교사 등 전문가가 최종 검토·수정하나요?', opts: YN }],
    judge: a => {
      if (a.level === 'higher') return { lv: 'out', why: '유·초·중등교육 학생 평가에 한정(2.13.2)' };
      if (a.task === 'rec_admin') return { lv: 'low', why: '교사 업무 효율화만을 위한 기능은 제외' };
      return a.teacher === 'no'
        ? { lv: 'high', why: '교사 검토·수정 없이 AI 결과를 그대로 사용' }
        : { lv: 'low', why: '고영향 분야에서 쓰이지만 교사가 최종 검토·수정' };
    } },

  { v: 'none', label: '해당없음', ref: '', qs: [],
    judge: () => ({ lv: 'out', why: 'AI기본법 제2조제4호 가~차목 분야에서 쓰이지 않음' }) }
];

/* ── 공통부문 — 모든 조직에 항상 나오는 항목 ── */
const COMMON_ITEMS = [
  { st: 1, t: 'AI 거버넌스 책임자와 실무 협의체(주관·법무·정보보안·개인정보·민원 부서) 지정, 역할 분담', b: '사업자 책무 가이드라인 3.1', lv: 'rec' },
  { st: 1, t: '대한민국 인공지능 윤리원칙(3대 가치·7대 원칙)을 반영한 내부 AI 활용 규정', b: '윤리원칙(2026.8.21)', lv: 'rec' },
  { st: 1, t: '시스템별 지위(개발사업자/이용사업자/이용자) 판정 기록', b: '{법:2|AI기본법 제2조} 7·8호, 사례 01·02·14', lv: 'rec' },
  { st: 2, t: 'AI 목록 작성 — 자체 개발·외부 도입·외부 API를 모두 올리고 용도·분야·사람 개입·개인정보·생성형·외부 제공 여부 기록', b: '이 체크리스트 입력 항목', lv: 'rec' },
  { st: 3, t: '시스템별 위험 목록(편향·오류·설명 불가·개인정보 목적 외 이용·공급업체 데이터 재사용 등)과 처리 방안', b: '{법:34|AI기본법 제34조①}1호(준용), 사업자 책무 가이드라인 3.1', lv: 'rec' },
  { st: 4, t: '직원 생성형 AI 사용 지침 — 개인정보·내부자료 입력 금지, 학습 활용 거부 설정 확인', b: '개인정보위 「생성형 AI 서비스 이용자를 위한 개인정보 보호 가이드」', lv: 'rec' },
  { st: 5, t: 'AI 관련 문의·이의제기 창구 운영과 처리 기록', b: '사업자 책무 가이드라인 3.3', lv: 'rec' },
  { st: 5, t: '정기 자가점검(자가점검 항목·윤리원칙 7대 원칙 기준)', b: '사업자 책무 가이드라인 부록2', lv: 'rec' },
  { st: 6, t: '재평가 계기 정의 — 모델 교체·기능 추가·용도 변경·외부 제공 시작·사고·민원 발생 시 2~3단계 재수행', b: '사례 14 경계 사례', lv: 'rec' },
  { st: 6, t: '제도 변동 추적 — 사업자 책무 고시·안전성 고시 미발령(2026.10 기준), 판단·책무 가이드라인 2027 상반기 재개정 예정', b: 'AI기본법 지원데스크 게시판', lv: 'rec' }
];

const STAGES = [
  { n: 1, name: '준비', sub: '지위 판정·책임 체계·정책' },
  { n: 2, name: '식별', sub: 'AI 목록·고영향/투명성 분류' },
  { n: 3, name: '평가', sub: '위험관리·영향평가·개인정보' },
  { n: 4, name: '통제', sub: '의무별 조치·계약·문서화' },
  { n: 5, name: '운영', sub: '모니터링·이의제기·점검' },
  { n: 6, name: '개선', sub: '재평가·제도 변동 반영' }
];

const LEVELS = {
  must:   { label: '필수',     cls: 'lv-must' },
  ifhigh: { label: '해당 시 필수', cls: 'lv-if' },
  effort: { label: '노력 의무', cls: 'lv-effort' },
  apply:  { label: '준용',     cls: 'lv-apply' },
  rec:    { label: '권장',     cls: 'lv-rec' }
};

const HIGH_LABEL = {
  high:   { label: '해당 가능성 높음', cls: 'hi-high' },
  review: { label: '검토 필요',       cls: 'hi-review' },
  low:    { label: '비해당 가능',     cls: 'hi-low' },
  out:    { label: '분야 해당 없음',   cls: 'hi-out' }
};
