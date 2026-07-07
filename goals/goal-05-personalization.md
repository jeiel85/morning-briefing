# Goal 05. Personalization

## Objective

Improve briefing relevance through feedback and richer user controls.

## Deliverables

- Feedback actions.
- Source controls.
- Ranking explanation.
- Personalization weights.
- Briefing modes.

## Tasks

### 1. Feedback UI

Actions:

- Useful.
- Not useful.
- Duplicate.
- Too many like this.
- Show more like this.
- Block source.
- Block keyword.

### 2. Feedback Persistence

Store user feedback linked to briefing item and cluster.

### 3. Ranking Adjustments

Use feedback to influence:

- Category score.
- Source score.
- Keyword boost.
- Similar topic suppression.

### 4. Briefing Modes

Implement:

- 3-minute.
- 10-minute.
- Full.
- Developer.
- Global.

### 5. Source Settings

Let user enable/disable source presets.

## Acceptance Criteria

- Feedback is saved.
- Block source affects future briefings.
- Block keyword affects future briefings.
- Ranking explanation is shown on cards.
- Briefing modes produce different item counts and category weights.

## Suggested Commit Names

- `feat: add briefing feedback actions`
- `feat: apply personalization weights to ranking`
- `feat: add source preference controls`
