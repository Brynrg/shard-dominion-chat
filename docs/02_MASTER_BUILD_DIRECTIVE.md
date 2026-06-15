# 02 — Master Build Directive

## Product target

Build **Shard Dominion**, a browser-based retro-modern sci-fi RTS.

Engine target:
- Vite
- TypeScript strict
- Phaser 3 preferred for final rendering/scenes
- Single-player only for v1
- Deployable on SpeedrunGames.net / Netlify
- Works with generated or placeholder assets early; final assets must be original or properly licensed

## Core loop

1. Scout hostile terrain.
2. Deploy MCV into a Command Core.
3. Build Anchor Lattice.
4. Place processor and power nodes.
5. Harvest Aether Shards.
6. Defend vulnerable harvesters.
7. Manage power and storage.
8. Expand to better shard fields.
9. Choose whether to harvest aggressively and wake the planet.
10. Build army.
11. Counter enemy composition.
12. Use planet events tactically.
13. Complete mission/skirmish victory condition.

## Signature mechanic

Planet Agitation is the central differentiator.

Agitation rises from:
- resource extraction
- heavy unit movement on deep crust
- raw-ground buildings
- overloaded power grids
- explosions
- thumpers
- superweapons

Agitation causes:
- worm sign
- Titan Worm attacks
- shard blooms
- glass storms
- crust collapse
- false radar contacts
- shard field mutations

The player should constantly feel:

> I need this resource, but the planet is noticing.

## Originality guardrails

Do not use:
- names, terminology, or exact unit concepts from existing RTS IP
- desert-house political structures copied from any franchise
- spice-like resource visuals
- sandworm silhouette or behavior copied from existing media
- UI layout copied one-to-one from Westwood/C&C/Dune games
- faction names or lore structures that map directly onto known IP

Use:
- Aether Shards as crystalline/luminous resource reefs
- Titan Worms as crystalline seismic leviathans
- Anchor Lattice instead of concrete
- living-planet ecology as primary twist
- three original faction ideologies

## Required game modes

V1 target:
- Tutorial / First Lattice vertical slice
- Skirmish vs AI
- 9-mission campaign, 3 missions per faction

Post-v1:
- map editor
- challenge/speedrun missions
- additional doctrines
- optional multiplayer only after single-player is solid

## Required repo quality

- strict TypeScript
- no unchecked `any` except inside narrow adapter boundaries
- data-driven configs
- deterministic sim tick where practical
- snapshot-friendly state
- small PRs/tickets
- acceptance criteria per phase
