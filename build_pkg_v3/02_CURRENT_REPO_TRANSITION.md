# Current Repository Transition Plan

## Preserve

- Vite 5;
- strict TypeScript;
- SpeedrunGames deployment contract;
- current Canvas runtime;
- GameScene;
- GameState;
- coordinate helpers;
- pathfinding;
- movement;
- harvesting;
- combat;
- fog/minimap concepts;
- Playwright infrastructure;
- relative-path enforcement.

## Repair immediately

1. Fog still uses incorrect coordinate conversion.
2. Movement owns or references the wrong pathfinder.
3. Harvesting compares world pixels against tile indices.
4. Credits are not yet proven by a visible deposit loop.
5. Template timer UI remains.
6. Several systems are dead/unwired.
7. Data is still hardcoded TS rather than validated external definitions.
8. Visual output is unreadable debug geometry.

## Dead-system policy

For every existing unreferenced system:

- `BuildPlacementSystem`
- `MissionSystem`
- `ShardBloomSystem`
- `WinLoseSystem`
- `BriefingSystem`
- `enemyUnits`

The assigned ticket must choose exactly one outcome:

- wire;
- rewrite;
- delete.

No dead code may remain without a ticket and status.

## Transition phases

### Transition A — rescue

Make the current code visible, controllable, and economically functional.

### Transition B — vertical slice

Add one complete mission with building, power, combat, planet event, UI, art, audio, and win/lose.

### Transition C — production game

Expand content and systems without changing the core architecture unless approved by an RFC.
