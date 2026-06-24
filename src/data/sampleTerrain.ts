import type { Tile } from '../core/types';
import { TileType } from '../core/types';

// Generate a more complex grid
const width = 30;
const height = 20;

// Initialize the terrain array
const sampleTerrain: Tile[][] = [];

for (let y = 0; y < height; y++) {
    sampleTerrain[y] = [];
    for (let x = 0; x < width; x++) {
        // Create blocked ridges
        let type: TileType;
        let isBlocked = false;
        let wormRisk = 0;

        // Ridge lines (blocked)
        if ((x >= 5 && x <= 8 && y >= 3 && y <= 5) ||
            (x >= 20 && x <= 23 && y >= 12 && y <= 14) ||
            (x >= 10 && x <= 12 && y >= 8 && y <= 10)) {
            type = TileType.RIDGE;
            isBlocked = true;
        }
        // Deep crust areas (slow movement, high worm risk)
        else if ((x >= 15 && x <= 18 && y >= 5 && y <= 8) ||
                 (x >= 3 && x <= 5 && y >= 12 && y <= 15)) {
            type = TileType.DEEP_CRUST;
            wormRisk = 0.8;
        }
        // Shard fields in specific areas
        else if ((x >= 8 && x <= 12 && y >= 5 && y <= 10) ||
            (x >= 15 && x <= 18 && y >= 2 && y <= 7) ||
            (x >= 20 && x <= 24 && y >= 8 && y <= 12)) {
            type = TileType.SHARD_FIELD;
        }
        else if (Math.random() < 0.15) {
            type = TileType.STONE;
        }
        else if (Math.random() < 0.25) {
            type = TileType.DIRT;
        }
        else {
            type = TileType.GRASS;
        }

        // Set movement cost based on terrain type
        let cost = 1;
        switch (type) {
            case TileType.GRASS:
            case TileType.DIRT:
            case TileType.SHARD_FIELD:
                cost = 1;
                break;
            case TileType.STONE:
                cost = 2;
                break;
            case TileType.DEEP_CRUST:
                cost = 3;
                break;
            case TileType.RIDGE:
                cost = 999; // Effectively blocked
                break;
        }

        sampleTerrain[y][x] = {
            type,
            x,
            y,
            cost,
            hasShards: type === TileType.SHARD_FIELD && Math.random() < 0.7,
            shardAmount: type === TileType.SHARD_FIELD ? Math.floor(Math.random() * 50) + 20 : 0,
            agitation: 0,
            isBlocked,
            wormRisk,
            isExplored: false,
            isVisible: false
        };
    }
}

export { sampleTerrain };