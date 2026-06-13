# 08 — Aether Prime Planet System

Aether Prime is the fourth faction.

## State

```ts
interface PlanetState {
  globalAgitation: number;
  localAgitation: number[][];
  eventCooldowns: Record<string, number>;
  activeEvents: ActivePlanetEvent[];
  warningEvents: PendingPlanetEvent[];
}
```

## Agitation levels

- 0–20: dormant
- 21–40: uneasy
- 41–60: warning signs
- 61–80: hostile
- 81–100: catastrophic

## Events

### Worm Sign

Trigger: heavy movement over deep crust, thumper, high local agitation.

Warning: screen shake, dust ripple, minimap pulse.

Effect: forces player to move or risk Titan Worm attack.

### Titan Worm

Trigger: sustained local agitation, worm sign ignored, deep crust convoy.

Effect: emerges, destroys or damages units in path. Must be avoidable with warning.

### Shard Bloom

Trigger: overharvest red field, field volatility high.

Effect: field expands or explodes, may create temporary resource surge, damages nearby units/buildings.

### Glass Storm

Trigger: high global agitation, power surplus spike.

Effect: radar interference, air damage, visibility distortion.

### Crust Collapse

Trigger: siege/explosions on fragile terrain.

Effect: terrain changes, slows or blocks path, may expose new shard veins.

### Aether Echo

Trigger: advanced tech usage, black shard extraction.

Effect: false radar contacts, ghost silhouettes, story/lore messages.
