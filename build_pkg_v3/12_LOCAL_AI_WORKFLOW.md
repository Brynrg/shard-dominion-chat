# Local AI Workflow

## Roles

Orchestrator:
- selects next unblocked ticket;
- creates branch;
- enforces scope;
- merges only after acceptance.

Implementer:
- code;
- tests;
- docs;
- no scope expansion.

Architecture reviewer:
- state;
- coordinates;
- timing;
- performance;
- dead code.

Gameplay reviewer:
- player-visible behavior;
- usability;
- balance.

Visual reviewer:
- readability;
- faction language;
- asset consistency.

QA:
- commands;
- browser;
- screenshot;
- console;
- status.

## Ticket template

```text
ID:
Title:
Depends on:
Goal:
Current defect:
Files expected:
Implementation:
Tests:
Player-visible acceptance:
Performance acceptance:
Out of scope:
Evidence required:
Rollback:
```

## Completion report

- branch;
- commits;
- files;
- before;
- after;
- commands;
- exact results;
- tests;
- screenshot/video;
- console status;
- limitations;
- dead-code impact;
- next ticket.

## Stop conditions

Stop if:

- engine migration appears necessary;
- strictness would be weakened;
- PR spans more than two major systems;
- acceptance is not observable;
- generated assets resemble protected work;
- CI remains red.
