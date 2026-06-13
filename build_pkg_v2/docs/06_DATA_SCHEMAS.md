# 06 — Data Schemas

Store these as TypeScript data files first. JSON can come later if desired.

## Unit definition

```ts
export interface UnitDef {
  id: string;
  displayName: string;
  faction?: string;
  role: string;
  cost: { credits: number; blackShards?: number };
  buildTimeSec: number;
  producer: string[];
  hp: number;
  armorType: ArmorType;
  speedPxPerSec: number;
  turnRate?: number;
  sightTiles: number;
  cargo?: {
    capacity: number;
    harvestRatePerSec: number;
  };
  weaponIds?: string[];
  abilities?: string[];
  tags: string[];
  agitation: {
    movement: number;
    deepCrustMultiplier: number;
    harvesting?: number;
  };
}
```

## Building definition

```ts
export interface BuildingDef {
  id: string;
  displayName: string;
  faction?: string;
  footprint: { w: number; h: number };
  cost: { credits: number; blackShards?: number };
  buildTimeSec: number;
  hp: number;
  armorType: ArmorType;
  requiresLattice: boolean;
  powerGenerated: number;
  powerConsumed: number;
  providesBuildRadius: number;
  producesUnits?: string[];
  storesCredits?: number;
  abilities?: string[];
  tags: string[];
}
```

## Terrain definition

```ts
export interface TerrainDef {
  id: string;
  displayName: string;
  walkable: boolean;
  buildable: boolean;
  moveCost: number;
  blocksLos: boolean;
  wormRisk: number;
  agitationMultiplier: number;
}
```

## Planet event definition

```ts
export interface PlanetEventDef {
  id: string;
  displayName: string;
  warningSec: number;
  minGlobalAgitation: number;
  localAgitationRequired?: number;
  cooldownSec: number;
  triggers: PlanetEventTrigger[];
  effects: PlanetEventEffect[];
}
```

## Mission definition

```ts
export interface MissionDef {
  id: string;
  title: string;
  faction: string;
  briefing: string;
  mapId: string;
  startingUnits: SpawnDef[];
  startingBuildings: SpawnDef[];
  startingCredits: number;
  objectives: ObjectiveDef[];
  optionalObjectives: ObjectiveDef[];
  scriptedEvents: ScriptedEventDef[];
  winConditions: WinConditionDef[];
  loseConditions: LoseConditionDef[];
}
```
