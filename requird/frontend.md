#project-overview (프로젝트 개요)

요가원 관리자용 백오피스는 Flutter 앱 기반의 요가원 운영 시스템에서 관리자가 효율적으로 수업, 회원, 출석, 수강권 정보를 관리할 수 있는 웹 기반 시스템입니다. Vue.js 3와 TailwindCSS를 사용하여 구현되며, MVVM 패턴을 적용하여 개발됩니다.

#feature-requirements (기능 요구사항)

## 1. 인증 및 권한 관리
- JWT 기반 인증 시스템 구현
- 관리자 권한 레벨에 따른 기능 접근 제어
- 세션 관리 및 자동 로그아웃

## 2. 대시보드
- 오늘의 수업 일정 표시
- 출석 현황 요약 (출석/결석/미체크)
- 수강권 소진 예정 회원 알림

## 3. 수업 관리
- 수업 CRUD 기능
- 달력/리스트 뷰 전환
- 수업별 출석 관리 인터페이스

## 4. 회원 관리
- 회원 CRUD 기능
- 회원 검색 및 필터링
- 수강권 관리 인터페이스

## 5. 출석 관리
- 수동 출석 체크 기능
- 출석 상태 변경 (출석/지각/결석)
- 출석 이력 조회

## 6. QR 코드 관리
- QR 코드 생성 및 다운로드
- QR 코드 만료 시간 설정
- QR 코드 사용 이력 조회

## 7. 통계 및 리포트
- 수업별/회원별 출석률 차트
- 수강권 사용 현황 리포트
- 월별 수업 요약 통계

#relevant-codes (관련 코드)

## 주요 라이브러리
- Vue.js 3
- Vue Router 4
- Pinia (상태 관리)
- TailwindCSS
- Axios
- Chart.js + Vue-ChartJS
- Headless UI
- Heroicons
- VueUse

#Current-file-instruction (현재 파일 구조)

```
src/
├── assets/
│   ├── images/
│   └── styles/
├── components/
│   ├── common/
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseModal.vue
│   │   └── BaseTable.vue
│   ├── layout/
│   │   ├── TheHeader.vue
│   │   ├── TheSidebar.vue
│   │   └── TheFooter.vue
│   └── features/
│       ├── class/
│       ├── member/
│       ├── attendance/
│       └── qr-code/
├── views/
│   ├── auth/
│   │   ├── LoginView.vue
│   │   └── RegisterView.vue
│   ├── DashboardView.vue
│   ├── ClassView.vue
│   ├── MemberView.vue
│   ├── AttendanceView.vue
│   ├── QrCodeView.vue
│   └── StatisticsView.vue
├── stores/
│   ├── auth.store.ts
│   ├── class.store.ts
│   ├── member.store.ts
│   └── attendance.store.ts
├── services/
│   ├── api.service.ts
│   ├── auth.service.ts
│   └── storage.service.ts
├── types/
│   ├── class.types.ts
│   ├── member.types.ts
│   └── attendance.types.ts
├── utils/
│   ├── constants.ts
│   ├── helpers.ts
│   └── validators.ts
├── router/
│   └── index.ts
└── App.vue
```

#rules (규칙)

## 1. 코드 스타일
- ESLint와 Prettier를 사용한 코드 포맷팅
- TypeScript strict 모드 사용
- 컴포넌트는 함수형 컴포넌트로 작성
- Props는 interface로 타입 정의

## 2. MVVM 패턴 적용
- View: React 컴포넌트
- ViewModel: 비즈니스 로직 처리
- Model: 데이터 구조 및 API 통신

## 3. 상태 관리
- 전역 상태는 Zustand 사용
- 컴포넌트 내부 상태는 useState 사용
- 서버 상태는 React Query 사용

## 4. 성능 최적화
- React.memo 적절히 사용
- 이미지 최적화
- 코드 스플리팅 적용

## 5. 보안
- API 키는 환경변수로 관리
- XSS 방지
- CSRF 토큰 사용

## 6. 접근성
- ARIA 레이블 사용
- 키보드 네비게이션 지원
- 색상 대비 준수

## 7. 테스트
- Jest와 React Testing Library 사용
- 컴포넌트 단위 테스트 작성
- E2E 테스트는 Cypress 사용

## 작업 계획

### Phase 1: 프로젝트 설정 및 구조화 (1주)
- [x] Vue 3 + TypeScript + Vite 프로젝트 설정
- [x] 라우팅 구조 설정 (Vue Router)
- [x] 상태 관리 설정 (Pinia)
- [x] UI 프레임워크 통합 (Tailwind CSS)
- [x] 기본 컴포넌트 설계 (레이아웃, 헤더, 푸터 등)

### Phase 2: 인증 및 보안 (1주)
- [x] 로그인 페이지
- [x] 토큰 기반 인증 구현
- [x] 권한 관리 및 라우트 보호
- [x] 사용자 프로필 관리

### Phase 3: 클래스 관리 (2주)
- [x] 클래스 목록 표시
- [x] 클래스 생성/수정/삭제 기능
- [x] 클래스 검색 및 필터링
- [x] 클래스 상세 정보 표시

### Phase 4: 회원 관리 (2주)
- [x] 회원 목록 표시
- [x] 회원 등록/수정/삭제 기능
- [x] 회원 검색 및 필터링
- [x] 회원 상세 정보 표시
- [x] 수강권 관리 기능

### Phase 5: 출석 관리 (2주)
- [x] 클래스별 출석 관리
- [x] 수동 출석 체크 기능
- [x] 출석 상태 변경 기능 (출석, 지각, 결석, 취소)
- [x] 날짜별 출석 조회
- [x] 회원별 출석 이력 관리

### Phase 6: QR 코드 시스템 (1주)
- [ ] QR 코드 생성 기능
- [ ] QR 코드 스캔 기능
- [ ] 스캔을 통한 자동 출석 체크

### Phase 7: 출석 관리 시스템 고도화 (1주)
- [x] 수동 출석 체크 기능 개선
- [x] 출석 상태 관리 (출석, 지각, 결석, 취소)
- [x] 출석 이력 조회 및 필터링

### Phase 8: 통계 및 리포트 (1주)
- [x] 출석률 차트 구현
- [x] 회원 현황 통계
- [x] 수강권 사용 현황
- [x] 기간별 통계 조회
- [x] 리포트 생성 및 다운로드

### Phase 9: 배포 및 문서화 (1주)
- [x] Supabase 연동
- [x] Vercel 배포 설정
- [x] 사용자 매뉴얼 작성
- [x] API 문서화

## 현재 진행 상황

### 완료된 기능
1. 프로젝트 설정 및 기본 구조 구현
2. 인증 시스템 구현
3. 클래스 관리 기능 구현
4. 회원 관리 기능 구현
5. 출석 관리 기능 구현
6. 통계 및 리포트 기능 구현
7. Supabase 연동 및 Vercel 배포 설정

### 진행 중인 기능
1. QR 코드 시스템 구현

### 다음 단계
1. QR 코드 시스템 구현 완료
2. 전체 시스템 테스트 및 최적화