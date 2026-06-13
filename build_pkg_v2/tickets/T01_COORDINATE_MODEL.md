# T01 — Repair Coordinate Model

## Problem
Current pathfinding treats world pixels as tile coordinates.

## Tasks
- Add `src/core/coords.ts`
- Define `TILE_SIZE`, `WorldCoord`, `TileCoord`
- Add `worldToTile`, `tileToWorldCenter`, `tileKey`, bounds helpers
- Update pathfinding API to take TileCoord
- Update movement target conversion from pointer world position to tile path
- Ensure rendering still uses world coordinates

## Acceptance
- selected harvester can move to clicked location
- cannot path through ridges
- deep crust can be traversed if walkable
- no out-of-bounds failures from pixel/tile mismatch
