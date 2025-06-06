# 요가원 관리자용 백오피스 기능 정의서 (PRD)

**문서명**: 요가원 관리자용 백오피스 기능 정의서  
**작성일**: 2025-05-13  
**버전**: v1.0  
**작성자**: 박준섭

---

## 📌 목적

Flutter 앱 기반의 요가원 운영 시스템에서 관리자의 효율적인 수업, 회원, 출석, 수강권 정보를 관리할 수 있는 웹 기반 **Back Office(BO)**를 구현한다.  
BO는 **데스크탑 중심**이며, **수업 등록/수정, 회원 등록, 수강권 부여 및 출석 기록 관리**가 핵심 기능이다.

---

## 👥 사용자 역할

| 사용자 | 역할 |
|--------|------|
| 관리자 (선생님 또는 운영자) | 수업 등록/수정/삭제, 회원 등록 및 수강권 관리, 출석 기록 관리 |
| 시스템 관리자 (선택 사항) | 전체 요가원 운영을 총괄하며 여러 관리자의 접근 권한 관리 가능 |

---

## 🧩 주요 기능 요약

| 모듈 | 주요 기능 |
|------|----------|
| 수업 관리 | 수업 생성/수정/삭제, 수업별 출석 인원 관리 |
| 회원 관리 | 회원 등록/수정/삭제, 수업별 참여자 관리 |
| 수강권 관리 | 회원별 수강권 등록/수정, 출석 시 자동 차감 |
| 출석 관리 | 수업별 출석 현황 조회, 수동 출석 등록/수정 |
| QR 출석 코드 | QR 코드 자동 생성 및 출력 지원 |
| 통계 및 로그 | 회원별 출석률, 수업별 출석 요약 등 리포트 제공 |

---

## 🖥️ 화면 및 기능 정의

### 1. 로그인 화면
- 이메일/비밀번호 입력
- 관리자 권한 확인
- JWT 기반 인증 처리 (Firebase Auth 또는 자체 백엔드)

---

### 2. 대시보드
- 오늘 날짜의 수업 리스트
- 출석 인원 간략 요약 (출석/결석/미체크)
- 수강권 소진 예상 회원 리스트

---

### 3. 수업 관리

| 기능 | 상세 설명 |
|------|-----------|
| 수업 생성 | 수업명, 강사, 날짜/시간, 최대 인원 등록 |
| 수업 수정 | 등록된 수업의 시간/강사/정원 변경 가능 |
| 수업 삭제 | 수업 삭제 시 출석 로그 함께 제거 여부 확인 |
| 수업 리스트 | 달력형, 리스트형 모두 지원 (월/주별) |
| 수업별 출석 관리 | 등록된 회원 리스트 확인 및 출석 체크 버튼 제공 |

---

### 4. 회원 관리

| 기능 | 상세 설명 |
|------|-----------|
| 회원 등록 | 이름, 전화번호, 참여 수업 추가, 수강권 입력 |
| 회원 수정 | 이름, 연락처, 수강권 정보 수정 가능 |
| 회원 삭제 | 해당 회원의 과거 출석 기록은 남기고 탈퇴 처리 |
| 회원 검색/필터 | 이름, 전화번호, 수강권 상태로 검색 가능 |

---

### 5. 수강권 관리

| 기능 | 상세 설명 |
|------|-----------|
| 수강권 등록 | 5회, 10회, 20회 등 수동 등록 |
| 수강권 수정 | 수동으로 사용/잔여 횟수 조정 가능 |
| 자동 차감 | 출석 처리 시 남은 수강권에서 1회 차감 |
| 수강권 내역 조회 | 총 횟수, 사용 횟수, 잔여 횟수 표기 |

---

### 6. 출석 관리

| 기능 | 상세 설명 |
|------|-----------|
| 출석 체크 | 수업별 회원 리스트에서 출석 버튼 클릭 |
| 지각/결석 체크 | 출석 상태를 직접 선택 가능 (선택사항) |
| 출석 로그 확인 | 회원별, 수업별 로그 확인 가능 (날짜, 시간) |
| 출석 수정 | 출석 처리 실수 시 수동 변경 허용 |
| 이중 출석 방지 | 동일 회원 동일 날짜 중복 출석 제한 처리

---

### 7. QR 출석 코드 관리

| 기능 | 상세 설명 |
|------|-----------|
| QR 생성 | 수업별 고유 QR 자동 생성 (출석용 링크 포함) |
| QR 다운로드 | 출력용 PNG 또는 PDF 다운로드 |
| QR 만료 관리 | 일정 시간 후 자동 만료되는 QR 설정 가능 |
| 로그 확인 | QR로 출석한 회원 기록 별도 표기

---

### 8. 통계/리포트

| 기능 | 상세 설명 |
|------|-----------|
| 수업별 출석률 | 전체 등록 회원 대비 출석률 |
| 회원별 출석 이력 | 출석일자 리스트, 누적 횟수, 결석 횟수 등 |
| 수강권 만료 리포트 | 잔여 1회 이하 회원 리스트 |
| 월별 수업 요약 | 수업별 평균 출석률, 인기 수업 파악 |

---

## 📦 데이터 모델 연동 (Flutter 앱과 공유)

- 모든 출석/회원/수업 데이터는 **공통 DB**를 사용
- 백오피스는 관리자 편의성 중심 / 앱은 QR출석 중심

---

## 📐 기술 스택 제안

| 영역 | 스택 |
|------|------|
| 프론트엔드 | Next.js 또는 React + TailwindCSS |
| 백엔드 | Firebase, Supabase 또는 NestJS + PostgreSQL |
| 인증 | Firebase Auth 또는 JWT 기반 커스텀 인증 |
| 배포 | Vercel, Netlify 또는 자체 서버 (Nginx 등)

---

## 🛡️ 보안 고려사항

- 관리자 인증 필요
- 수강생 정보는 개인정보 보호법에 따라 최소 저장
- 출석 정보 변경 로그 기록 및 제한 권한 설정 가능

---

## ✅ 릴리즈 우선순위 (MVP 기준)

1. 수업 등록/조회  
2. 회원 등록 + 수강권 입력  
3. 출석 체크 + 수강권 차감  
4. QR 생성 및 출석 기록  
5. 출석 로그/통계 확인  

---

## 📄 부록: 관리자 UI 예시 구조

```
[대시보드]
  ├─ 오늘 수업 리스트
  ├─ 금주 출석률 요약

[수업 관리]
  ├─ 수업 생성/수정
  ├─ 수업별 출석 관리

[회원 관리]
  ├─ 회원 등록/검색/수정
  ├─ 수강권 입력

[출석 관리]
  ├─ 수업별 출석
  ├─ 출석 로그 확인

[QR 출석 코드]
  ├─ QR 생성 및 다운로드

[통계]
  ├─ 수업별/회원별 출석률
```
