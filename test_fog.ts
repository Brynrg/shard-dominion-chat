// Test for fog coordinate conversion
// P0-01: Fix fog coordinate conversion - use worldToTile in updateFogOfWar

import { GameState } from './src/core/GameState';
import { type Position } from './src/core/types';
import { worldToTile } from './src/core/coords';

// Mock unit with position at world coordinates (40, 50)
const mockUnit = {
    id: 'test-unit',
    type: 'scout' as const,
    position: { x: 40, y: 50 }, // World coordinates - should be tile (1, 1) since TILE_SIZE = 32
    speed: 100,
    visionRadius: 2,
    carrying: 0,
    maxCarrying: 50,
    targetPosition: null
};

// Mock tiles (30x20 grid of grass tiles)
const mockTiles = Array.from({ length: 20 }, (_, y) =>
    Array.from({ length: 30 }, (_, x) => ({
        x, y,
        type: 'grass' as const,
        hasShards: false,
        isVisible: false,
        passable: true
    }))
);

// Create game state
const gameState = GameState.getInstance();
gameState.setState({
    units: [mockUnit],
    buildings: [],
    tiles: mockTiles,
    camera: { x: 0, y: 0, zoom: 1 },
    selectedUnits: new Set(),
    fogOfWar: {
        visible: new Set(),
        explored: new Set()
    },
    minimap: {
        data: []
    },
    moveQueue: [],
    cameraTarget: null
});

// Test 1: Verify worldToTile conversion
const tileCoord = worldToTile(mockUnit.position);
console.log('World position:', mockUnit.position);
console.log('Tile position:', tileCoord);

// Test 2: Check updateFogOfWar works
console.log('\nBefore fog update:');
gameState.updateFogOfWar();

const visibleTiles = Array.from(gameState.getState().fogOfWar.visible);
console.log('Visible tiles:', visibleTiles.length);

// Expected: tile (1,1) and tiles within vision radius should be visible
const expectedVisible = [
    '0,0', '0,1', '0,2', '0,3', '0,4',
    '1,0', '1,1', '1,2', '1,3', '1,4',
    '2,0', '2,1', '2,2', '2,3', '2,4',
    '3,0', '3,1', '3,2', '3,3', '3,4'
];

console.log('Expected visible:', expectedVisible.length);
console.log('Match:', visibleTiles.length === expectedVisible.length);

// Test 3: Check tile visibility 
const isVisible = (x: number, y: number) => gameState.getState().tiles[y][x].isVisible;
console.log('Tile (1,1) visible:', isVisible(1, 1));
console.log('Tile (0,0) visible:', isVisible(0, 0));
console.log('Tile (3,3) visible:', isVisible(3, 3));