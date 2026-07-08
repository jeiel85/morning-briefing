# zam-dun · 잠든 사이 🌅

잠든 사이, 세상은 움직입니다. 밤사이 뉴스를 당신의 소스에서 모아 AI로 요약하고, 아침에 **웹 푸시**로 3분짜리 브리핑을 전달합니다.

> Repo/패키지 코드네임은 `dawnbrief`, 제품명은 `zam-dun`입니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **소스 수집** | RSS/API 피드 (HN, Ars Technica, GitHub Blog, Yozm, ITWorld, Clien 등) |
| **중복 제거** | Jaccard 유사도 기반 클러스터링 |
| **우선순위** | 7가지 가중치 기반 랭킹 (시급성, 신뢰도, 관심도 등) |
| **AI 요약** | GPT-4o-mini 요약 (API 키 미설정 시 snippet 기반 fallback + Google Translate 한글 번역) |
| **웹 푸시 전달** | VAPID + Service Worker, 사용자 설정 시간에 전달 |
| **개인화** | 관심/차단 키워드, 시간대, 브리핑 모드 설정 |
| **다국어** | 한국어/영어 UI (next-intl) |

## 기술 스택

```
Frontend   Next.js 15 (App Router) + Tailwind CSS v4 + TypeScript
Backend    Next.js Route Handlers + Server Actions
Database   PostgreSQL + Prisma ORM
Session    익명 방문자 쿠키 (db_visitor, httpOnly) — 로그인/비밀번호 없음
Delivery   Web Push (web-push, VAPID, Service Worker)
Scheduling Vercel Cron (일일 발송) + GitHub Actions (수집)
Translation Google Translate API (@vitalets/google-translate-api)
Hosting    Vercel + Vercel Postgres
```

## 시작하기

### 요구사항
- Node.js 22+, pnpm 10+
- PostgreSQL (로컬 개발)
- (선택) OpenAI API 키 — GPT 요약. 없으면 snippet + 번역 fallback

### 로컬 개발

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp schemas/env.example .env

# DB 스키마 적용 + 시드 (이 프로젝트는 마이그레이션 대신 db push 사용)
pnpm db:push
pnpm db:seed

# 개발 서버
pnpm dev
```

### VAPID 키 생성 (웹 푸시)

```bash
npx web-push generate-vapid-keys
# 출력된 Public/Private 키를 VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY 에 설정
```

## 환경 변수

| 변수 | 설명 | 필수 |
|------|------|------|
| `POSTGRES_PRISMA_URL` | PostgreSQL 연결 문자열 (Vercel Postgres가 자동 주입) | ✅ |
| `INTERNAL_JOB_TOKEN` | 내부 잡 라우트 인증 시크릿 (GitHub Actions secret에도 등록) | ✅ |
| `CRON_SECRET` | Vercel Cron 인증. 미설정 시 크론 엔드포인트가 모든 요청 거부 | ✅ (배포) |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | 웹 푸시 VAPID 키쌍 | ✅ (푸시) |
| `NEXT_PUBLIC_APP_URL` | 배포 URL (크론 self-call, 푸시 subject) | ✅ (배포) |
| `OPENAI_API_KEY` | GPT 요약 (없으면 fallback) | ❌ |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | 클라이언트 공개키 (VAPID_PUBLIC_KEY와 동일해야 함, 미설정 시 내장 폴백) | ❌ |
| `ADMIN_VISITOR_IDS` | 소스 토글 허용 방문자 ID 목록(쉼표 구분). 미설정 시 소스 관리 읽기전용 | ❌ |
| `APP_ENV` | `production`이면 로그를 JSON으로 출력 | ❌ |

## 데이터베이스 스키마 관리

이 프로젝트는 **`prisma db push`** 워크플로를 사용합니다(마이그레이션 히스토리 미사용).
스키마(`prisma/schema.prisma`)를 바꾸면 `pnpm db:push`로 DB에 반영합니다.
프로덕션 배포 시에도 스키마 변경이 있으면 대상 DB에 `db push`를 한 번 실행하세요.

## 배포 (Vercel)

1. Vercel Postgres 연동 → `POSTGRES_PRISMA_URL` 자동 주입
2. 환경 변수 등록: `INTERNAL_JOB_TOKEN`, `CRON_SECRET`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `NEXT_PUBLIC_APP_URL` (+ 선택 항목)
3. `pnpm db:push`로 스키마 최초 반영
4. Cron은 `vercel.json`에 정의됨 (`/api/cron/briefing`, 일 1회) — `CRON_SECRET`으로 인증
5. 수집(ingestion)은 GitHub Actions(`.github/workflows/ingestion.yml`)가 `INTERNAL_JOB_TOKEN` secret으로 호출

## 데이터 소스

### 글로벌
- Hacker News (API)
- Ars Technica (RSS)
- GitHub Blog (RSS)
- GitHub / Vercel / Cloudflare Status (RSS)

### 한국어
- 요즘IT (Yozm, RSS)
- ITWorld Korea (RSS)
- Clien 뉴스 (RSS)

## 라이선스

MIT
