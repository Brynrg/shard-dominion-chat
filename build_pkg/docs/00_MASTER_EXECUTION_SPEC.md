# Shard Dominion — Master Execution Spec

## Purpose
Build **Shard Dominion**, an original browser-based retro-modern sci-fi RTS for SpeedrunGames.net or local deployment. The package targets a local AI coding stack that can perform planning, code generation, asset generation, review, and iterative implementation.

## Non-negotiable Product Identity
Shard Dominion is not a clone. It preserves general RTS ideas—harvesting, base building, fog of war, power management, scouting, counters, factions—but expresses them through an original game world:

> Three human successor factions fight over Aether Prime, a living mineral planet that reacts to extraction, vibration, power emissions, and battlefield destruction.

The signature mechanic is **Planet Agitation**. The economy wakes the planet.

## Target Platform
- Browser-first.
- Vite + TypeScript + Phaser 3.
- No backend for v1.
- Single-player skirmish and campaign first.
- Optional multiplayer is post-v1 only.

## Visual Approach
The game should use 2D rendered sprites generated from simple 3D source models.

Pipeline:
1. Design unit/building silhouettes.
2. Generate or model low-poly 3D sources.
3. Render 8-direction or 16-direction sprite sheets.
4. Import sprite sheets into Phaser.
5. Use 2D game logic with pseudo-3D/isometric presentation.

Do not attempt full 3D gameplay in Phaser v1. Phaser Mesh/OBJ support may be used for special effects or previews, but production gameplay should remain 2D/sprite-based.

## Execution Roles
Use local agents in these roles:

### 1. Orchestrator
Reads this package, assigns work, maintains phase gates, prevents scope drift.

### 2. Game Designer
Owns mechanics, balance tables, factions, mission flow, player experience.

### 3. Technical Architect
Owns code architecture, TypeScript interfaces, systems, performance.

### 4. Implementation Agent
Writes code one ticket at a time.

### 5. Asset Director
Creates art prompts, Blender specs, sprite sheet requirements, UI style rules.

### 6. Narrative Designer
Owns world bible, campaign, mission briefings, faction voices.

### 7. QA / Verifier
Runs build, tests acceptance criteria, flags bugs and clone-risk issues.

## Build Philosophy
- One playable vertical slice before broad content.
- One complete faction before three incomplete factions.
- Mechanics first, polish second, content third.
- Data-driven configs where useful, but avoid premature overengineering.
- Every phase must end with runnable code and a review report.

## Originality Guardrails
Do not copy:
- Existing faction names, house structures, logos, insignia, iconography.
- Existing unit names or exact unit roles when expressive rather than generic.
- Specific UI layouts that evoke a protected game too directly.
- Desert/spice/sandworm expression.
- Campaign premises involving noble houses, imperial monopoly, or prophecy around a spice-like resource.

Use instead:
- Aether Shards as living crystalline memory-mineral.
- Aether Prime as reactive ecology.
- Anchor Lattice instead of concrete.
- Titan Leviathans as crystalline seismic organisms, not sandworms.
- Black glass flats, crystal reefs, red storm basins, relay ruins.

## Phase Gates
Each phase must produce:
1. What changed.
2. How to run.
3. Screenshots or recorded GIF if possible.
4. Known limitations.
5. Test results.
6. Next recommended tasks.
7. Clone-risk check.

## Required Final v1 Features
- Main menu.
- Single-player skirmish vs AI.
- 3 factions.
- 6+ skirmish maps.
- 9-mission campaign minimum.
- Save/load skirmish optional but preferred.
- Full controls: select, move, attack, attack-move, guard, stop, rally, hotkeys, control groups.
- Economy: harvesters, processors, silos, depletion/regrowth, raiding.
- Base building: MCV, Construction Yard, lattice, power, repair, placement rules.
- Fog/shroud/minimap.
- Combat: infantry, vehicles, air/logistics, turrets, faction specials.
- Planet Agitation: worms/leviathans, shard blooms, glass storms, crust collapse.
- Data-driven units/buildings/factions/missions.
- Performance target: 60fps on modern desktop browser with 150-250 active entities.

