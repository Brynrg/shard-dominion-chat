# First 10 Builder Prompts

## Prompt 1 — P0-01 Fog

Fix fog coordinate conversion only. Use `worldToTile` for visibility sources. Add tests. Do not touch movement or harvesting.

## Prompt 2 — P0-02 Movement

Use one configured pathfinder. Cache world-space waypoints. Right-click must route around ridges. Do not modify economy.

## Prompt 3 — P0-03 Harvesting

Convert resource tile positions to world centers. Implement nearest reachable finite resource node. Do not change UI.

## Prompt 4 — P0-04 Economy

Credits only on deposit. Add cargo and finite node amounts. Add mine-return-deposit test.

## Prompt 5 — P0-05 Presentation

Remove timer/PB/start text. Add RTS status HUD. Do not add gameplay.

## Prompt 6 — P0-06 Cleanup

One loop owner, bounded delta, duplicate type cleanup, dead-system audit, console clean.

## Prompt 7 — P1-01 Selection

Implement click, drag, Shift add/remove, selection rings, Escape clear.

## Prompt 8 — P1-02 Camera

Implement pan, zoom, screen/world conversion, minimap click-pan, clamping.

## Prompt 9 — P1-03 Data

Move definitions to JSON/validated TS. Remove `any[]`. Add ID validation.

## Prompt 10 — P1-04 Lattice

Implement placement preview, validity, costs, command radius, standard/reinforced tiers.
