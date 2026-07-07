# QA Checklist

## Time Window

- [ ] Overnight window works.
- [ ] Same-day window works.
- [ ] Asia/Seoul timezone works.
- [ ] Future/past date boundary works.
- [ ] Briefing date is correct.

## Preferences

- [ ] Categories save correctly.
- [ ] Keywords save correctly.
- [ ] Blocked keywords suppress items.
- [ ] Email toggle works.
- [ ] Push toggle placeholder does not break.

## Ingestion

- [ ] RSS adapter handles empty feeds.
- [ ] RSS adapter handles malformed item.
- [ ] HN adapter handles API failure.
- [ ] URL tracking params removed.
- [ ] Duplicate URLs skipped.

## Ranking

- [ ] Official source boosted.
- [ ] User interest boosted.
- [ ] Blocked source suppressed.
- [ ] Low-confidence item not in main section.
- [ ] Trend signal shown only in trend section.

## Briefing

- [ ] Briefing generates with source links.
- [ ] Briefing handles partial source failure.
- [ ] Briefing history displays.
- [ ] Empty briefing state displays.

## Email

- [ ] Email renders on desktop Gmail.
- [ ] Email renders on mobile Gmail.
- [ ] Plain text fallback readable.
- [ ] Unsubscribe link works.
- [ ] Duplicate delivery prevented.

## Security

- [ ] Logged-out user redirected.
- [ ] Cross-user briefing access denied.
- [ ] Internal endpoints reject missing token.
- [ ] Feedback endpoint validates ownership.
