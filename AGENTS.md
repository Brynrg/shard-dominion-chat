# AGENTS.md — Shard Dominion

You are working on Shard Dominion, a browser-based retro-modern RTS.

## Read first

1. `docs/02_MASTER_BUILD_DIRECTIVE.md`
2. `docs/03_ARCHITECTURE_TARGET.md`
3. `docs/11_IMPLEMENTATION_PHASES.md`
4. the active ticket under `tickets/`

## Current priority

Do not add new game features until Phase A repo repair is complete:
- coordinate model
- single WorldState
- real economy credits
- action-driven Planet Agitation
- Shard Dominion README/docs

## Hard rules

- Strict TypeScript.
- Keep WorldState as single source of truth.
- Pathfinding uses tile coordinates; rendering uses world coordinates.
- Planet Agitation must be action-driven.
- No direct copying of existing RTS IP expression.
- Do not add paid service dependencies.
- Run typecheck/build after every code change.

## Commit style

One ticket per branch/PR where possible.

Format: `TXX: short imperative summary`

Example: `T01: repair world and tile coordinate model`
