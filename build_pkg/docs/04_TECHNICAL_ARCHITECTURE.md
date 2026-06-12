# Shard Dominion — Technical Architecture

## Stack
- Vite
- TypeScript strict mode
- Phaser 3
- Vitest for tests
- ESLint/Prettier

## Rendering
Use Phaser 2D sprites and tilemaps. The game may use WebGL renderer via Phaser. Gameplay simulation remains 2D grid/world coordinates.

## Coordinate Systems
- Tile coordinates: `{tx, ty}`.
- World coordinates: pixels.
- Grid size: 64x64 recommended.
- Entity positions stored as world coordinates.
- Building placement uses tile footprints.

## Core Modules

### GameState
Global simulation state:
- entities
- resources
- power
- map
- fog
- players
- planet agitation
- mission objectives

### Entity
Fields:
- id
- type
- ownerId
- position
- facing
- hp
- maxHp
- components

### Components
Use simple typed component objects:
- MovementComponent
- CombatComponent
- HarvesterComponent
- BuilderComponent
- PowerComponent
- ProductionComponent
- StorageComponent
- VisionComponent
- StealthComponent
- CaptureComponent
- DecayComponent

### Systems
Run in fixed or semi-fixed update order:
1. InputSystem
2. OrderSystem
3. MovementSystem
4. HarvestSystem
5. ProductionSystem
6. ConstructionSystem
7. PowerSystem
8. CombatSystem
9. FogSystem
10. PlanetAgitationSystem
11. EventSystem
12. AISystem
13. UISystem
14. RenderSyncSystem

## Data-driven Configs
Use `src/data/*.ts` or JSON imported as modules.

Required config categories:
- units
- buildings
- weapons
- factions
- terrain
- planetEvents
- missions
- doctrines
- audio

## Pathfinding
Phase 1:
- A* on tile grid.
- Movement costs from terrain config.
- Block buildings and ridges.

Later:
- Flow fields for groups if needed.
- Local avoidance for unit clumping.

## Fog of War
- Per-player explored mask.
- Per-player visible mask.
- Update when units cross tile thresholds or at throttled intervals.
- Vision radius from unit/building config.

## AI
V1 uses rule-based AI:
- Economy manager.
- Build-order manager.
- Scouting manager.
- Attack wave manager.
- Defense response manager.
- Planet-risk manager.

## Performance Guidelines
- Avoid per-frame global scans when possible.
- Use spatial hashing for entity queries.
- Throttle fog/path recalculations.
- Pool projectiles/effects.
- Cap simultaneous expensive events.

## Save Data
Optional v1:
- Serialize GameState to JSON.
- Avoid storing Phaser objects.
- Store entity configs by ID and runtime state separately.

