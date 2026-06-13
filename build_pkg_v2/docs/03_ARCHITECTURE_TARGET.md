# 03 — Architecture Target

## Target layout

```text
src/
  core/
    coords.ts
    ids.ts
    types.ts
    WorldState.ts
    CommandBus.ts
  data/
    factions.ts
    units.ts
    buildings.ts
    terrain.ts
    weapons.ts
    planetEvents.ts
    missions.ts
  systems/
    MovementSystem.ts
    PathfindingSystem.ts
    FogSystem.ts
    EconomySystem.ts
    ConstructionSystem.ts
    PowerSystem.ts
    CombatSystem.ts
    ProductionSystem.ts
    PlanetAgitationSystem.ts
    PlanetEventSystem.ts
    AISystem.ts
    MissionSystem.ts
  scenes/
    BootScene.ts
    GameScene.ts
    UIScene.ts
    MenuScene.ts
  render/
    SpriteRegistry.ts
    SelectionRenderer.ts
    TerrainRenderer.ts
    FogRenderer.ts
    MinimapRenderer.ts
  ui/
    Sidebar.ts
    CommandPanel.ts
    ResourceBar.ts
    Alerts.ts
  tests/
```

## Coordinate model

Use three coordinate types:

```ts
export type WorldPx = number;

export interface WorldCoord {
  x: WorldPx;
  y: WorldPx;
}

export interface TileCoord {
  tx: number;
  ty: number;
}

export const TILE_SIZE = 32;
```

Rules:
- Rendering uses WorldCoord.
- Pathfinding uses TileCoord.
- Tile data is indexed by TileCoord.
- Entity movement stores WorldCoord plus optional path of TileCoord.
- Building placement uses TileCoord + footprint.

## State model

WorldState is the single source of truth.

Do not let systems keep permanent copies of entities. Systems may cache indexes but must rebuild or update them from WorldState.

```ts
interface WorldState {
  tick: number;
  players: Record<PlayerId, PlayerState>;
  units: Record<UnitId, UnitEntity>;
  buildings: Record<BuildingId, BuildingEntity>;
  map: MapState;
  planet: PlanetState;
  selection: SelectionState;
  mission: MissionRuntimeState;
}
```

## Commands

All player/AI input should become commands:

```ts
type Command =
  | { type: "select"; unitIds: UnitId[] }
  | { type: "move"; unitIds: UnitId[]; target: WorldCoord }
  | { type: "attack"; unitIds: UnitId[]; targetId: EntityId }
  | { type: "harvest"; unitId: UnitId; depositId?: BuildingId }
  | { type: "build"; playerId: PlayerId; buildingType: BuildingTypeId; tile: TileCoord }
  | { type: "train"; playerId: PlayerId; unitType: UnitTypeId; producerId: BuildingId }
  | { type: "repair"; playerId: PlayerId; buildingId: BuildingId };
```

## Simulation order per tick

1. input commands
2. AI commands
3. construction/production progress
4. power recalculation
5. movement/path following
6. harvesting/deposit
7. combat target resolution
8. damage/death
9. planet agitation accumulation
10. planet event triggers
11. fog/minimap update
12. mission objective update
13. render

## Phaser migration

The current custom canvas renderer can remain through T06 if it helps speed, but final architecture should either migrate to Phaser Scenes/sprites/camera/input/tilemap layers or explicitly keep custom Canvas and remove Phaser dependency.

Preferred: Phaser for rendering/input/camera; custom deterministic systems for RTS logic.
