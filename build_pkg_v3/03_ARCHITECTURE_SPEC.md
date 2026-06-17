# Architecture Specification

## Coordinate spaces

Three spaces only:

- ScreenCoord
- WorldCoord
- TileCoord

All conversion occurs through `src/core/coords.ts`.

Required helpers:

```ts
worldToTile(world: WorldCoord): TileCoord
tileToWorldCenter(tile: TileCoord): WorldCoord
screenToWorld(screen: ScreenCoord, camera: CameraState): WorldCoord
worldToScreen(world: WorldCoord, camera: CameraState): ScreenCoord
tileKey(tile: TileCoord): string
isTileInBounds(tile: TileCoord, map: MapState): boolean
```

No direct terrain indexing from world pixels.

## State ownership

`GameState` owns:

- players;
- units;
- buildings;
- resource nodes;
- map;
- projectiles;
- effects;
- power networks;
- mission state;
- AI state;
- global agitation;
- regional agitation;
- camera;
- selection;
- game mode;
- clock.

Systems receive references to GameState and mutate through defined APIs.

## Simulation loop

Required order:

1. input commands;
2. mission script;
3. AI decisions;
4. order processing;
5. movement;
6. harvesting;
7. construction;
8. production;
9. power;
10. combat targeting;
11. projectiles;
12. damage/death;
13. planet agitation;
14. planet events;
15. fog;
16. victory/defeat;
17. audio/event dispatch;
18. render.

Use bounded delta and deterministic-friendly logic.

## Typed IDs

Use branded or aliased IDs:

```ts
type EntityId = string;
type UnitDefinitionId = string;
type BuildingDefinitionId = string;
type WeaponDefinitionId = string;
type FactionId = string;
type PlayerId = string;
type MissionId = string;
```

## Data validation

At startup in development:

- every referenced ID exists;
- every unit has a valid weapon;
- every build prerequisite exists;
- every faction roster entry exists;
- every mission entity exists;
- every map spawn is valid;
- every footprint fits map bounds;
- every audio/visual asset path exists.

## Event bus

Required event categories:

- economy;
- construction;
- production;
- combat;
- planet;
- mission;
- UI;
- audio.

## Save format

Use versioned JSON in localStorage.

Required:

```ts
interface SaveEnvelope {
  schemaVersion: number;
  gameVersion: string;
  timestamp: number;
  campaign: CampaignProgress;
  settings: UserSettings;
}
```

Do not serialize classes, Sets, Maps, or functions directly.

## Engine decision

Do not migrate to Phaser during rescue or vertical slice.

At the end of vertical slice, produce one RFC:

- remain on Canvas runtime; or
- migrate.

Default decision is remain unless there is a demonstrated blocker.

## Performance budgets

- 60 FPS target;
- 30 FPS minimum;
- 150 active units;
- 300 active projectiles burst;
- fog updates max 10 Hz unless source changes;
- pathfinding queue max N per frame from data;
- no O(map-size) allocations every frame;
- no A* recompute every frame for unchanged orders.
