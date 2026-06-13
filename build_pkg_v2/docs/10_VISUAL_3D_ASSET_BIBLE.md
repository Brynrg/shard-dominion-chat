# 10 — Visual and 3D Asset Bible

## Visual target

Retro-modern readable RTS:
- top-down/isometric-ish readability
- 2D sprite gameplay
- 3D models rendered to sprite sheets
- strong silhouettes
- faction color language
- terrain with crystal/mineral identity

## Do not visually imitate

- existing Westwood/C&C/Dune UI
- tan desert spice fields
- familiar sandworm silhouettes
- exact unit silhouettes from classic RTS games

## Environment

Aether Prime should feel alien and mineral:
- black glass flats
- blue-white crystal veins
- rust-red storm basins
- violet shard reefs
- fractured crust
- old colony ruins
- rib-like mineral arches
- heat haze around power structures

## Faction shape language

Vanguard: clean angular silhouettes, white/blue/steel accents, radar fins, sensor dishes, hover/air support motifs.

Forge: bulky vertical mass, dark iron/rust/orange glow, smokestacks, treads, furnace cores, heavy plating.

Phantom: thin asymmetric silhouettes, dark violet/teal accents, triangular sensor masks, cloaking shimmer, split hulls.

Planet: crystalline organic-mineral hybrid, seismic cracks, luminous internal veins, no fleshy gore.

## Asset pipeline

Final gameplay uses sprite sheets:
1. model in Blender or generate model concept
2. render 8 directions for units if possible
3. render idle/move/attack/death frames
4. export PNG sprite sheets
5. create JSON atlas metadata
6. load into Phaser or canvas renderer

## Minimum asset list for vertical slice

Terrain:
- ground_base
- shard_blue
- shard_red
- ridge
- deep_crust
- lattice_basic
- old_relay
- bloom_warning
- bloom_explosion

Buildings:
- command_core_vanguard
- power_node_vanguard
- processor_vanguard
- barracks_vanguard
- vehicle_bay_vanguard
- radar_relay_vanguard

Units:
- mcv_vanguard
- harvester_vanguard
- surveyor_vanguard
- rifle_team_vanguard
- combat_tank_vanguard
- engineer_vanguard
- forge_raider
- forge_light_tank

Effects:
- selection_ring
- move_marker
- harvest_beam/dust
- deposit_flash
- power_warning
- worm_ripple
- glass_storm_overlay
- explosion_small
- projectile_kinetic
- projectile_missile

UI:
- resource bar
- power bar
- agitation meter
- command card buttons
- minimap frame
- objective panel
- alert badges
