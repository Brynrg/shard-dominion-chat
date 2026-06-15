# Shard Dominion - Chat Version

A browser-based retro-modern sci-fi RTS where the economy wakes a hostile living planet. Harvest Aether Shards, build Anchor Lattice, manage Planet Agitation, and command your forces across the crystalline surface of Aether Prime.

## What You Get

- **Real-time Strategy** with classic mechanics reimagined for a living planet
- **Harvesting System** - Extract Aether Shards and deliver them to the processor
- **Planet Agitation** - The planet reacts to your actions with shard blooms, glass storms, and Titan Worms
- **Fog of War** - Explore the hostile terrain and expand your vision
- **Vertical Slice** - Working prototype with harvester units, terrain types, and basic economy
- **Canvas Rendering** - Custom game engine with smooth 60fps gameplay

## Current Phase

Phase 0: Vertical Slice Complete
- ✅ Basic terrain with multiple tile types (grass, dirt, stone, shard fields, ridges, deep crust)
- ✅ Harvester units that can move and carry resources
- ✅ Processor building for resource deposit
- ✅ Planet Agitation system (currently time-based)
- ✅ Fog of war and minimap
- ✅ Basic selection and movement

## Controls

- **Click** - Select units or move selected units
- **D** - Toggle debug overlay (shows movement cost, worm risk, system stats)

## Current Mechanics

### Terrain Types
- **Grass** - Basic terrain, low movement cost
- **Dirt** - Standard terrain
- **Stone** - Higher movement cost
- **Shard Fields** - Resource-rich areas, medium cost
- **Ridges** - Impassable terrain
- **Deep Crust** - Heavy terrain, slows units

### Units
- **Harvester** - Collects Aether Shards and delivers to processor
  - Carries up to 100 resource units
  - Moves faster on open terrain

### Buildings
- **Processor** - Where harvesters deposit resources
- **Command Center** - Central hub (placeholder)

### Economy
- Harvesters collect resources from shard fields
- Resources must be deposited at processor to gain credits
- Credits increase: 100 base + deposited resources ÷ 10

### Planet Agitation
- Currently increases over time
- Planned: Will rise from harvesting, movement, construction, and combat

## How to Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run typecheck

# Lint paths for relative URLs
npm run lint:paths
```

## Next Tickets (T10-T30)

After architecture repairs (T00-T06) are complete:

- **T10** - Selection, commands, camera controls
- **T14** - Build placement, lattice foundation, power network
- **T20** - Basic combat with health, weapons, enemies
- **T30** - First lattice mission objective

## Build & Deploy

This project auto-deploys to SpeedrunGames.net on every push to main:

1. Set `game.manifest.json` slug
2. Build with Vite + TypeScript
3. CI runs: typecheck, build, path lint, smoke test
4. Push to main → auto-deploy portal PR

## Originality Note

Shard Dominion is not a clone of any existing RTS IP. Its unique identity is a living mineral planet where harvesting, power emissions, and construction increase Planet Agitation, causing the map to react with dynamic environmental events.

## Stack

| | |
|---|---|
| Language | TypeScript (strict) |
| Bundler | Vite 5 |
| Runtime | Node 22 |
| Rendering | Custom Canvas |
| Game Loop | RequestAnimationFrame |

## See Also

- [AGENTS.md](AGENTS.md) - Full build playbook and API references
- [docs/BUILD_LOG.md](docs/BUILD_LOG.md) - Implementation progress
- [build_pkg_v2/](build_pkg_v2/) - Complete execution plan and specifications