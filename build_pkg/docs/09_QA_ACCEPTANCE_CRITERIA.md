# Shard Dominion — QA and Acceptance Criteria

## Global Definition of Done
A phase is done only when:
- Game runs locally with documented command.
- TypeScript build passes.
- No console error during normal play.
- Core acceptance criteria pass.
- New data config has validation or type coverage.
- Clone-risk checklist reviewed.

## Phase 0 Acceptance
- `npm install` and `npm run dev` work.
- Map renders.
- Camera pans/zooms.
- Unit can be selected and moved.
- Harvester gathers from shard field and deposits at Processor.
- Credits update.
- Power display appears.
- Planet Agitation meter changes when harvesting.
- Debug overlay can be toggled.

## Phase 1 Acceptance
- Terrain costs affect movement.
- Ridges block movement.
- Fog reveals around units.
- Explored shroud remains.
- Units can path around obstacles.

## Phase 2 Acceptance
- Multiple harvesters can work.
- Shard fields deplete.
- Red shards produce more resources and more agitation.
- Harvester can be attacked/destroyed.

## Phase 3 Acceptance
- Buildings require placement rules.
- Lattice affects durability.
- Raw-ground buildings decay.
- Power deficit slows production.
- Radar disabled in deficit.

## Phase 4 Acceptance
- At least 5 combat units work.
- Damage types and armor multipliers work.
- Turrets attack enemies.
- Engineers capture neutral structures.

## Clone-Risk Review
For every phase, answer:
1. Did we add names too similar to known RTS IP?
2. Did we add unit silhouettes that too closely resemble known units?
3. Did UI drift toward a protected layout/look?
4. Did story use protected-like faction/political structure?
5. Did we document original expression?

