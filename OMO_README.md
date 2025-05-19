# OnMatOut - 요가원 관리자 백오피스

OnMatOut은 요가원 운영을 위한 관리자용 백오피스 시스템입니다. 수업, 회원, 출석, 수강권 관리 기능을 제공하여 요가원 운영을 더욱 효율적으로 도와줍니다.

## 주요 기능

- 🧘‍♀️ **수업 관리**: 수업 일정 관리, 출석 현황 파악
- 👥 **회원 관리**: 회원 정보 관리, 수강권 현황 확인
- ✅ **출석 관리**: 수동 출석 체크, 출석 상태 변경, 출석 이력 조회
- 📊 **통계 및 리포트**: 출석률 차트, 회원 현황 통계, 수강권 사용 현황

## 기술 스택

- **프론트엔드**: Vue 3, TypeScript, Vite, Tailwind CSS
- **상태 관리**: Pinia
- **라우팅**: Vue Router
- **차트**: Chart.js
- **UI 컴포넌트**: Headless UI, Heroicons
- **백엔드**: Supabase
- **배포**: Vercel

## 시작하기

### 필수 요구사항

- Node.js 14 이상
- npm 또는 yarn
- Supabase 계정

### 설치 방법

1. 저장소 클론

```bash
git clone https://github.com/your-username/onmatout.git
cd onmatout
```

2. 의존성 설치

```bash
npm install
# 또는
yarn install
```

3. 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열고 Supabase URL과 API 키를 설정하세요.

4. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

5. 빌드 및 배포

```bash
npm run build
# 또는
yarn build
```

## Supabase 설정

Supabase에서 다음 테이블이 필요합니다:

1. **profiles**: 회원 정보 (Auth 연동)
2. **classes**: 수업 정보
3. **attendances**: 출석 정보

### 테이블 스키마

#### profiles
- id: uuid (primary key)
- name: text
- phone: text
- email: text
- remainingTickets: integer
- lastAttendance: date
- status: text (active, inactive)
- created_at: timestamp
- updated_at: timestamp

#### classes
- id: integer (primary key)
- name: text
- instructor: text
- dateTime: timestamp
- capacity: integer
- status: text (scheduled, in-progress, completed, cancelled)
- createdAt: timestamp
- updatedAt: timestamp

#### attendances
- id: integer (primary key)
- memberId: uuid (foreign key -> profiles.id)
- classId: integer (foreign key -> classes.id)
- date: date
- status: text (present, late, absent, cancelled)
- createdAt: timestamp
- updatedAt: timestamp

## Vercel 배포

1. Vercel CLI 설치

```bash
npm i -g vercel
```

2. 배포 실행

```bash
vercel
```

## 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다. 자세한 내용은 LICENSE 파일을 참조하세요.
