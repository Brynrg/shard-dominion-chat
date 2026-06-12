# Phase 0 — Vertical Slice Skeleton

## Goal
Create a runnable browser RTS prototype that already expresses Shard Dominion's identity: harvesting Aether Shards increases Planet Agitation.

## Deliverables
- Vite + TypeScript + Phaser 3 project.
- Main game scene.
- Tile map placeholder.
- Camera pan/zoom.
- Selectable unit.
- Right-click movement.
- Harvester loop.
- Shard field.
- Processor/dropoff.
- Credits counter.
- Power counter.
- Planet Agitation meter.
- Debug overlay toggle.

## Required Files
- `src/main.ts`
- `src/scenes/GameScene.ts`
- `src/core/types.ts`
- `src/core/GameState.ts`
- `src/systems/InputSystem.ts`
- `src/systems/MovementSystem.ts`
- `src/systems/HarvestSystem.ts`
- `src/systems/PlanetAgitationSystem.ts`
- `src/ui/Hud.ts`
- `src/data/sampleUnits.ts`
- `src/data/sampleBuildings.ts`
- `src/data/sampleTerrain.ts`

## Acceptance Criteria
- `npm install` works.
- `npm run dev` starts local server.
- Map displays.
- Player can select harvester.
- Player can right-click shard field or ground.
- Harvester gathers and deposits Aether.
- Aether count increases.
- Planet Agitation increases while harvesting.
- Power display exists, even if static.
- Debug overlay shows tile and agitation info.

## Do Not Implement Yet
- Combat.
- Enemy AI.
- Full building placement.
- Full fog of war.
- Multiplayer.
- Final art.

## Phase Report Required
After implementation, write `PHASE_0_REPORT.md` with:
1. Summary.
2. How to run.
3. Controls.
4. Files changed.
5. Acceptance checklist.
6. Known issues.
7. Recommended Phase 1.
