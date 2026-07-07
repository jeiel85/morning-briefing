# 08. Frontend Design

## 1. Pages

### Public Pages

- `/` Landing page.
- `/login` Login.
- `/privacy` Privacy policy.
- `/terms` Terms.

### Authenticated Pages

- `/app` Today's briefing.
- `/app/history` Briefing history.
- `/app/settings` Preferences.
- `/app/sources` Source settings.
- `/app/feedback` Feedback summary.
- `/app/account` Account settings.

### Admin Pages

- `/admin/sources` Source health.
- `/admin/jobs` Worker jobs.
- `/admin/costs` Cost metrics.
- `/admin/errors` Error events.

## 2. Main UX Flow

### Onboarding

1. User logs in with email.
2. Select timezone.
3. Set inactive window.
4. Set briefing delivery time.
5. Choose categories.
6. Add interest keywords.
7. Choose email/push delivery.
8. Generate sample briefing preview.

### Daily Use

1. User receives email or push.
2. Opens today's briefing.
3. Scans top 5 items.
4. Expands details if needed.
5. Provides feedback.

## 3. Dashboard Layout

```text
┌──────────────────────────────────────────────┐
│ Good morning. Here is what you missed.       │
│ Window: 2026-07-06 23:30 → 2026-07-07 07:00 │
├──────────────────────────────────────────────┤
│ Critical Updates                             │
│ [Card] [Card]                                │
├──────────────────────────────────────────────┤
│ Domestic News                                │
│ [Card] [Card] [Card]                         │
├──────────────────────────────────────────────┤
│ Global News                                  │
│ [Card] [Card]                                │
├──────────────────────────────────────────────┤
│ AI / Developer                               │
│ [Card] [Card] [Card]                         │
├──────────────────────────────────────────────┤
│ Trends                                       │
│ [Trend Signal Card]                          │
└──────────────────────────────────────────────┘
```

## 4. Briefing Card Components

### Compact Card

Fields:

- Category badge.
- Confidence/status badge.
- Title.
- 2-3 bullet summary.
- Source count.
- Published/fetched time.
- Relevance reason.
- Expand button.

### Expanded Card

Additional fields:

- Why it matters.
- Confirmed facts.
- Uncertainties.
- Source links.
- Feedback buttons.

## 5. Status Badges

| Status | Badge Text | UX Meaning |
|---|---|---|
| confirmed | Confirmed | Reliable enough for main briefing |
| developing | Developing | Details may change |
| trend_signal | Trend signal | Attention spike, not fact confirmation |
| low_confidence | Low confidence | Weak evidence |

## 6. Settings UX

### Inactive Window Control

Use time pickers:

- Start: 23:30.
- End: 07:00.

Handle overnight window explicitly.

### Briefing Mode

Radio cards:

- 3-minute: concise.
- 10-minute: balanced.
- Full: detailed.
- Developer: tech-heavy.
- Global: international-heavy.

### Interest Keywords

Tag input with suggestions:

- Android.
- Kotlin.
- GitHub.
- Vercel.
- LLM.
- AI coding.

### Blocked Keywords

Tag input. Warn that blocking broad terms can hide relevant items.

## 7. Email Template UX

Email should be readable without opening the web app.

Structure:

1. Header with inactive window.
2. Top 5 summary.
3. Category sections.
4. Source links.
5. Coverage notes.
6. Settings link.
7. Unsubscribe link.

## 8. Mobile UX

The web app must be mobile-first:

- Large cards.
- Clear badges.
- Sticky category nav.
- Minimal horizontal layout.
- Fast loading.

## 9. Accessibility

- Semantic headings.
- Keyboard navigation.
- Color-independent status indicators.
- ARIA labels on feedback controls.
- Sufficient contrast.

## 10. Empty States

### No briefing yet

Show setup completion and next scheduled delivery.

### No items found

Show:

```text
No major items were found for your selected window and categories.
You can widen your categories or add more sources.
```

### Source failure

Show category-level coverage warning, not a vague error.
