# Goal 01. Foundation

## Objective

Create the baseline Next.js application, database schema, authentication, layout, and user preference management.

## Deliverables

- Next.js App Router project.
- TypeScript strict mode.
- Tailwind CSS and shadcn/ui.
- Prisma + PostgreSQL.
- Auth.js email login.
- User preference screens.
- Basic dashboard shell.

## Tasks

### 1. Project Setup

```bash
pnpm create next-app dawnbrief --ts --eslint --app
cd dawnbrief
pnpm add prisma @prisma/client zod
pnpm add next-auth
pnpm add tailwind-merge clsx
```

### 2. Environment Variables

Create `.env.local` based on `schemas/env.example`.

### 3. Database

- Add Prisma schema.
- Run migration.
- Generate Prisma client.

### 4. Auth

- Email magic link provider.
- Session middleware.
- Protected `/app` routes.

### 5. Preferences

Implement:

- Timezone.
- Inactive window start/end.
- Delivery time.
- Categories.
- Interest keywords.
- Blocked keywords.
- Email enabled.
- Push enabled placeholder.

## Acceptance Criteria

- User can login.
- User can save preferences.
- User can reload and see saved preferences.
- Invalid time values are rejected.
- `/app` is protected.
- Unit tests cover inactive window calculation.

## Suggested Commit Names

- `feat: initialize dawnbrief web app`
- `feat: add prisma schema and auth`
- `feat: implement user briefing preferences`
