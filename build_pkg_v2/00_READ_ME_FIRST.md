# Shard Dominion — Local AI Execution Plan v2

Purpose: guide a local AI coding stack through completing **Shard Dominion** as intended: a retro-modern sci-fi RTS where the economy wakes a hostile living planet.

Repo: `Brynrg/shard-dominion-chat`

Current state: Phase 0 prototype. It has useful scaffolding, but it is not the full game yet.

Required next action: repair architecture before feature expansion.

## Non-negotiable product identity

Shard Dominion is not a clone of any existing RTS IP. It uses general RTS mechanics only: harvesting, base building, fog of war, scouting, power, unit counters, faction asymmetry, and campaign missions.

Its unique identity is:

> Aether Prime is a living mineral planet. Harvesting, power emissions, heavy movement, construction, and combat increase Planet Agitation. The map reacts with shard blooms, glass storms, crust collapse, sensor ghosts, and Titan Worms.

## How local agents should use this package

1. Read `docs/01_CURRENT_REPO_AUDIT.md`.
2. Read `docs/02_MASTER_BUILD_DIRECTIVE.md`.
3. Apply `repo_patch_files/AGENTS.md` into repo root.
4. Apply `repo_patch_files/PROJECT_PLAN.md` into repo root or `/docs`.
5. Execute tickets in numerical order.
6. Do not skip phase gates.
7. After every ticket, run typecheck/build/test and update `docs/BUILD_LOG.md`.
8. Do not add feature layers until architecture tickets T00–T06 are complete.

## Final product expectation

The final game should ship as a browser-based single-player RTS on SpeedrunGames.net with a playable vertical slice, skirmish mode, three asymmetric factions, 9-mission campaign, original visuals and sound direction, data-driven content, and no borrowed IP expression.
