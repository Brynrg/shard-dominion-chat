// Coordinate system for Shard Dominion
// World coordinates (pixels) vs Tile coordinates (grid indices)

export const TILE_SIZE = 32; // pixels per tile

export interface WorldCoord {
    x: number; // pixel position
    y: number; // pixel position
}

export interface TileCoord {
    x: number; // tile index
    y: number; // tile index  
}

/**
 * Convert world coordinates to tile coordinates
 */
export function worldToTile(world: WorldCoord): TileCoord {
    return {
        x: Math.floor(world.x / TILE_SIZE),
        y: Math.floor(world.y / TILE_SIZE)
    };
}

/**
 * Convert tile coordinates to world coordinates (center of tile)
 */
export function tileToWorldCenter(tile: TileCoord): WorldCoord {
    return {
        x: tile.x * TILE_SIZE + TILE_SIZE / 2,
        y: tile.y * TILE_SIZE + TILE_SIZE / 2
    };
}

/**
 * Convert tile coordinates to world coordinates (top-left corner)
 */
export function tileToWorldTopLeft(tile: TileCoord): WorldCoord {
    return {
        x: tile.x * TILE_SIZE,
        y: tile.y * TILE_SIZE
    };
}

/**
 * Get a string key for a tile coordinate
 */
export function tileKey(tile: TileCoord): string {
    return `${tile.x},${tile.y}`;
}

/**
 * Get a string key for a world coordinate (rounded to tile size)
 */
export function worldKey(world: WorldCoord): string {
    const tile = worldToTile(world);
    return tileKey(tile);
}

/**
 * Check if a tile coordinate is within bounds
 */
export function isTileInBounds(tile: TileCoord, width: number, height: number): boolean {
    return tile.x >= 0 && tile.x < width && tile.y >= 0 && tile.y < height;
}

/**
 * Check if a world coordinate is within bounds
 */
export function isWorldInBounds(world: WorldCoord, width: number, height: number): boolean {
    return world.x >= 0 && world.x < width && world.y >= 0 && world.y < height;
}

/**
 * Clamp a tile coordinate to bounds
 */
export function clampTile(tile: TileCoord, width: number, height: number): TileCoord {
    return {
        x: Math.max(0, Math.min(width - 1, tile.x)),
        y: Math.max(0, Math.min(height - 1, tile.y))
    };
}

/**
 * Clamp a world coordinate to bounds
 */
export function clampWorld(world: WorldCoord, width: number, height: number): WorldCoord {
    return {
        x: Math.max(0, Math.min(width - 1, world.x)),
        y: Math.max(0, Math.min(height - 1, world.y))
    };
}

/**
 * Calculate distance between two tile coordinates
 */
export function tileDistance(t1: TileCoord, t2: TileCoord): number {
    const dx = t1.x - t2.x;
    const dy = t1.y - t2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate distance between two world coordinates
 */
export function worldDistance(w1: WorldCoord, w2: WorldCoord): number {
    const dx = w1.x - w2.x;
    const dy = w1.y - w2.y;
    return Math.sqrt(dx * dx + dy * dy);
}