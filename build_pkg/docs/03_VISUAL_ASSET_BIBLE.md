# Shard Dominion — Visual Asset Bible

## Art Direction
Retro-modern sci-fi RTS. 2D rendered sprites from simple 3D models. Strong silhouettes. Readability over realism.

## Camera Style
Top-down oblique or pseudo-isometric 2D.

Recommended:
- 2D grid logic.
- 64x64 or 96x96 terrain tiles.
- Units rendered from 8 directions.
- Buildings rendered as 1x1, 2x2, 3x3, and 4x4 sprites.

## Color Palette
Avoid tan desert dominance.

World:
- Black glass ground.
- Blue-white crystal veins.
- Red-orange volatile basins.
- Pale violet storm haze.
- Sickly green corrosion glow for unstable lattice.

Factions:
- Vanguard: white, cobalt, steel gray.
- Forge: iron, ember orange, dark red.
- Phantom: black, violet, teal signal glow.

## Terrain Tiles
Required v1 tile types:
- black_glass_flat
- shard_reef_blue
- shard_reef_red
- shard_reef_black
- deep_crust
- ridge_blocker
- ruin_floor
- relay_platform
- storm_basin
- cracked_lattice
- basic_lattice
- reinforced_lattice

## Unit Silhouette Rules
- Vanguard: clean angular hulls, sensor masts, aircraft-like fins.
- Forge: bulky vertical armor, treads, smokestacks, heat vents.
- Phantom: thin asymmetrical frames, hover skids, antennae, stealth shimmer.

## Building Silhouette Rules
Shared:
- Construction Yard: deployed crawler core with unfolding arms.
- Processor: intake maw, shard grinder, glowing storage chambers.
- Silo: vertical crystal containment pods.
- Power Node: turbine/coil tower with visible charge arcs.
- Barracks: low armored habitat module.
- Factory: large bay doors and crane arms.
- Research Lab: sensor dishes and containment chambers.
- Command Nexus: tall signal spire.

## 3D Source Model Requirements
Models should be simple low-poly, renderable to sprites.

Per unit:
- `.blend` or `.glb` source.
- Naming convention: `unit_<faction>_<unit_id>_v001.blend`.
- Must fit within unit footprint.
- Must be rendered in 8 directions: N, NE, E, SE, S, SW, W, NW.
- Export sprite sheet PNG and JSON atlas.

Per building:
- Source model.
- Idle sprite.
- Damaged sprite.
- Construction animation optional.
- Destruction animation optional.

## Placeholder Strategy
Phase 0-2 may use colored geometric placeholders.
Phase 3 should replace major buildings with silhouette placeholders.
Phase 6 should start final faction visual pass.

## Asset Sources Allowed
- Original generated assets.
- Human-created assets owned by the project.
- CC0 assets, with source noted in `assets/ASSET_LEDGER.md`.

## Asset Sources Forbidden
- Ripped game assets.
- Lookalike logos/icons from existing IP.
- AI outputs explicitly prompted to copy a named game's art style or specific assets.

