# 12 — Local AI Orchestration

## Recommended agent roles

### Architect Agent
Owns architecture, system boundaries, data schemas, phase gates, and rejects shortcuts that corrupt structure.

### Implementation Agent
Owns TypeScript code, tests, feature tickets, and bug fixes.

### Game Design Agent
Owns tuning, mechanics, unit counters, faction identity, and mission fun.

### Asset Agent
Owns visual bible execution, Blender prompts/scripts, sprite sheet plans, UI skin, and asset ledger.

### QA Agent
Owns acceptance tests, playtest checklists, regression hunting, and build verification.

### IP/Originality Reviewer
Owns similarity risk review, renaming/re-theming risky concepts, and ensuring original expression.

## Execution loop

For each ticket:
1. Architect restates scope.
2. Implementation Agent edits code.
3. QA Agent runs checks.
4. Game Design Agent checks whether mechanic supports intended fun.
5. IP Reviewer checks naming/visual/lore risks.
6. Architect decides pass/fail.
7. Update build log.

## No-go rules

Agents may not:
- add a second state store
- add combat before movement/economy are repaired
- add faction content before base RTS systems
- copy existing IP expression
- add paid service dependencies
- disable TypeScript strictness
- bypass build/typecheck
- commit generated assets without ledger entry

## Build log template

```md
## YYYY-MM-DD — Ticket TXX

Goal:
Files changed:
How to test:
Result:
Known issues:
Next recommended ticket:
```
