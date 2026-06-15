# 01 — Current Repo Audit

Repo reviewed: `Brynrg/shard-dominion-chat`

## Summary judgment

The current repo is a useful early stub but not yet the intended game. It contains Shard Dominion nouns and a few proto-systems, but it is still structurally close to the SpeedrunGames template and has architecture issues that will block proper RTS development.

## What exists

- Vite + TypeScript project.
- Phaser dependency exists, but gameplay rendering currently uses a custom canvas path rather than a Phaser scene pipeline.
- `GameScene` initializes GameState, InputSystem, MovementSystem, PathfindingSystem, HarvestSystem, PlanetAgitationSystem, HUD, sample terrain, sample buildings, and sample units.
- Terrain includes shard fields, ridges, deep crust, and worm risk.
- Unit roster currently contains a harvester.
- Building samples include processor and command center.
- There is fog/minimap scaffolding.
- Planet agitation exists as a number.

## Critical blockers

### B1 — Coordinate mismatch

Units use pixel/world positions, but pathfinding treats those directly as tile coordinates. The sample map is only 30x20 tiles, so pathfinding from pixel coordinates will fail.

Required fix:
- introduce `WorldCoord` and `TileCoord`
- add `worldToTile()` and `tileToWorldCenter()`
- make all pathfinding operate on tile coordinates
- make rendering operate on world/pixel coordinates

### B2 — State duplication

MovementSystem copies units into its own Map while rendering uses GameState units. Movement may update a copy that the renderer never sees.

Required fix:
- GameState/WorldState must be the single source of truth
- systems should receive state references or entity IDs and mutate through a central command API

### B3 — Economy is fake

Credits are currently tied to total cargo carried, not deposited cargo. Harvesters clearing cargo do not actually add delivered credits.

Required fix:
- harvesters mine cargo from resource deposits
- return to processor
- deposit cargo
- player credits increase by delivered amount
- field amount decreases

### B4 — Planet Agitation is passive

Agitation currently rises over time. It must rise from player actions: harvesting, deep-crust movement, high power draw, raw-ground construction, explosive combat, thumpers, and large vehicle groups.

### B5 — No base building

There is no build queue, placement grid, anchor lattice/foundation, power network, or production.

### B6 — No combat

No health, weapons, targets, enemies, attack orders, turrets, or counters.

### B7 — No design docs in repo

The repo needs canonical specs in `/docs` so local agents do not improvise the game.

## Do not proceed to faction/combat/campaign work until B1–B4 are fixed.
