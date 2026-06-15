# 13 — QA Acceptance Criteria

## Always run

```bash
npm install
npm run typecheck
npm run build
npm test
```

If `npm test` does not exist or fails due to no tests, create tests or document why.

## Phase A acceptance

- unit can be selected
- right-click movement works to valid tile
- unit avoids blocked ridge
- deep crust can be traversed and raises agitation
- harvester finds shard field
- harvester gathers cargo
- harvester returns to processor
- credits increase on deposit
- Planet Agitation does not rise just because time passes
- Planet Agitation rises from harvesting/deep crust movement
- README is Shard Dominion-specific

## Phase B acceptance

- building ghost preview
- valid/invalid tile feedback
- Anchor Lattice placement
- raw-ground building penalty
- power generation/consumption
- power deficit warning
- build queue visible
- build radius enforced

## Phase C acceptance

- units have HP
- units can attack
- basic enemy can attack
- damage types exist
- units die and are removed
- player can win/lose
- combat readability is acceptable

## Phase D acceptance

- First Lattice mission starts from menu/dev flag
- objectives update
- tutorial prompts trigger
- shard bloom event occurs
- worm sign event occurs
- win state works
- lose state works

## Performance targets

Vertical slice:
- 60 FPS target on modern desktop
- no major GC spikes from per-frame allocations
- fog update throttled or chunked
- pathfinding not recomputed every frame for idle units

## Readability targets

- selected unit obvious
- harvester cargo visible
- build validity obvious
- power deficit obvious
- planet agitation obvious
- enemy units distinguishable
- objective status readable
