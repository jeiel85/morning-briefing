# DawnBrief 🌅

매일 아침, 당신만의 맞춤형 브리핑을 이메일로 받아보세요.

기술 뉴스, 개발자 업데이트, 관심 키워드 기반 콘텐츠를 수집·요약·전달합니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **소스 수집** | RSS/API 피드 (HN, Ars Technica, GitHub Blog, Yozm, ITWorld, Clien 등) |
| **중복 제거** | Jaccard 유사도 기반 클러스터링 |
| **우선순위** | 7가지 가중치 기반 랭킹 (시급성, 신뢰도, 관심도 등) |
| **AI 요약** | GPT-4o-mini 요약 (API 키 미설정 시 snippet 기반 fallback, Google Translate로 한글 번역) |
| **이메일 발송** | Resend 연동, 사용자 설정 시간에 전달 |
| **개인화** | 관심/차단 키워드, 시간대, 전달 방식 설정 |
| **다국어** | 한국어/영어 UI (next-intl) |

## 기술 스택

```
Frontend   Next.js 15 (App Router) + Tailwind CSS v4 + TypeScript
Backend    Next.js Route Handlers + Server Actions
Database   PostgreSQL + Prisma ORM
Auth       Auth.js (NextAuth v5, Credentials + Resend adapter)
Email      Resend
Queue      Vercel Cron (scheduled briefing generation)
Translation Google Translate API (@vitalets/google-translate-api)
Hosting    Vercel + Vercel Postgres
```

## 시작하기

### 요구사항

- Node.js 22+, pnpm 10+
- PostgreSQL 18 (로컬 개발)
- Resend API 키 (이메일 전송)
- (선택) OpenAI API 키 (GPT 요약)

### 로컬 개발

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env

# DB 마이그레이션 + 시드
pnpm db:migrate
pnpm db:seed

# 개발 서버 실행
pnpm dev
```

## 환경 변수

| 변수 | 설명 | 필수 |
|------|------|------|
| `DATABASE_URL` | PostgreSQL 연결 문자열 | ✅ |
| `AUTH_SECRET` | Auth.js 암호화 키 | ✅ |
| `RESEND_API_KEY` | Resend 이메일 API 키 | ✅ |
| `OPENAI_API_KEY` | OpenAI API 키 (GPT 요약) | ❌ |
| `AUTH_URL` | 배포 URL | ✅ (배포 시) |

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
