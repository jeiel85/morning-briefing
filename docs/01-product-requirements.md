# 01. Product Requirements

## 1. Product Vision

**DawnBrief** is a morning briefing web app that helps users catch up on important events that occurred while they were not using their phone or were asleep.

The product is not a generic news reader. It is a **personal information gap recovery system**.

## 2. Target Users

### Primary Persona: Busy Developer / Parent / Side-Project Operator

- Has limited time in the morning.
- Wants only important updates, not a full news feed.
- Needs source-backed summaries.
- Cares about tech, AI, platform changes, GitHub/Vercel/cloud issues, and selected mainstream news.
- Prefers email or push over opening multiple apps.

### Secondary Personas

- Small business owner tracking market and local news.
- Investor tracking global macro and market-moving events.
- Church/community operator tracking local/community/news/social issues.
- Knowledge worker who wants a daily custom briefing.

## 3. Core Problem

Users miss fast-moving updates while they sleep or are offline. Existing news apps push too many alerts, lack personalization, and often do not distinguish confirmed facts from rumors.

## 4. Product Promise

Every morning, the user receives:

1. What happened while they were away.
2. Why it matters.
3. What is confirmed.
4. What is uncertain.
5. Links to original sources.

## 5. MVP Scope

### Included

- User account.
- Inactive window configuration.
- Interest keywords and blocked keywords.
- Source configuration.
- Scheduled ingestion.
- News/RSS/Hacker News/GDELT/Naver DataLab source adapters.
- Deduplication and clustering.
- LLM-assisted briefing generation.
- Email delivery.
- Web dashboard for current and past briefings.

### Excluded from MVP

- Native Android usage detection.
- iOS Screen Time integration.
- Real-time breaking-news push for every event.
- Full social media crawling.
- Full article storage.
- Team/workspace billing.

## 6. Product Principles

### Principle 1: Factuality over speed

A late but accurate briefing is better than a fast misleading one.

### Principle 2: Source visibility

Every item must show source, timestamp, URL, and confidence status.

### Principle 3: Low-noise delivery

The morning briefing is the main interaction. Push notifications should be rare and meaningful.

### Principle 4: User-controlled personalization

The user can edit interests, exclude topics, tune categories, and provide feedback.

### Principle 5: Compliance-aware aggregation

The app must not rely on unauthorized article scraping as a core business dependency.

## 7. Key User Stories

### Account and Setup

- As a user, I can create an account with email.
- As a user, I can set my inactive window, for example 23:30 to 07:00.
- As a user, I can choose a briefing delivery time.
- As a user, I can choose categories such as domestic news, global news, AI, development, economy, and social trends.
- As a user, I can add interest keywords.
- As a user, I can block keywords or categories.

### Briefing Consumption

- As a user, I receive an email briefing every morning.
- As a user, I can open the web app and see the same briefing.
- As a user, I can inspect each item and open sources.
- As a user, I can mark items as useful or not useful.
- As a user, I can ask for fewer items from a category.

### Trust and Control

- As a user, I can see whether an item is confirmed, developing, or low-confidence.
- As a user, I can see when the source was published and when the app fetched it.
- As a user, I can delete my account and personal preferences.

## 8. Functional Requirements

| ID | Requirement | Priority |
|---|---|---:|
| FR-001 | User can configure inactive window | P0 |
| FR-002 | System fetches items from configured sources | P0 |
| FR-003 | System deduplicates near-identical items | P0 |
| FR-004 | System clusters related items into briefing topics | P0 |
| FR-005 | System scores topics by relevance and urgency | P0 |
| FR-006 | System generates source-linked summaries | P0 |
| FR-007 | System sends daily email briefing | P0 |
| FR-008 | User can view briefing history | P1 |
| FR-009 | User can provide feedback on briefing items | P1 |
| FR-010 | User can receive web push notification | P1 |
| FR-011 | System can send urgent alerts for critical topics | P2 |
| FR-012 | Native Android usage detection | P3 |

## 9. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Accuracy | Briefing must not include unsupported claims. |
| Reliability | Daily briefing generation success rate should be above 99% after production hardening. |
| Latency | Morning briefing should be generated within 5 minutes of scheduled time under normal load. |
| Cost | MVP should run within low monthly cost for fewer than 1,000 users. |
| Privacy | Store only necessary user preference and briefing metadata. |
| Security | Encrypt secrets; protect user data with row-level access controls. |
| Observability | Track ingestion failures, summarization failures, delivery failures, and source API errors. |

## 10. Success Metrics

### Activation

- User completes onboarding.
- User receives first briefing.
- User opens at least one source from briefing.

### Retention

- 7-day active briefing open rate.
- 30-day active briefing open rate.
- Email unsubscribe rate.

### Quality

- Useful item feedback ratio.
- Duplicate item complaints.
- Low-confidence item display rate.
- Source coverage per cluster.

### Cost

- LLM cost per briefing.
- Email delivery cost per user.
- Source API cost per user.
