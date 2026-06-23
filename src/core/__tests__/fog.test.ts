import { GameState } from '../GameState';
import { worldToTile } from '../coords';
import { TileType } from '../types';

describe('Fog of War coordinate conversion', () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = GameState.getInstance();
    gameState.initializeFogOfWar();
  });

  afterEach(() => {
    (GameState as any).instance = null;
  });

  describe('updateFogOfWar', () => {
    it('uses worldToTile for visibility sources', () => {
      // Create a unit at world position (200, 200)
      const unit: any = {
        id: 'test-unit',
        type: 'harvester' as any,
        position: { x: 200, y: 200 },
        targetPosition: null,
        speed: 50,
        carrying: 0,
        maxCarrying: 100,
        faction: 'vanguard',
        isSelected: false,
        visionRadius: 5,
        hp: 100,
        maxHp: 100,
        isDead: false,
        attackRange: 0,
        attackDamage: 0,
        attackCooldown: 0,
        lastAttackTime: 0
      };

      gameState.addUnit(unit);
      // Create a 30x20 tile grid
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 30; x++) {
          gameState.setTile(x, y, {
            type: TileType.GRASS,
            x,
            y,
            cost: 1,
            hasShards: false,
            agitation: 0,
            isBlocked: false,
            wormRisk: 0,
            isExplored: false,
            isVisible: false
          });
        }
      }

      gameState.updateFogOfWar();

      // The unit at (200, 200) should have vision radius 5
      // worldToTile(200, 200) = (6, 6) because 200 / 32 = 6.25 -> floor = 6
      const unitTile = worldToTile(unit.position);
      expect(unitTile).toEqual({ x: 6, y: 6 });

      // Tiles within vision radius should be marked as visible
      // Vision radius 5 means tiles with Manhattan distance <= 5
      const visibleTiles = [];
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 30; x++) {
          const dist = Math.abs(x - unitTile.x) + Math.abs(y - unitTile.y);
          if (dist <= 5) {
            const tile = gameState.getTile(x, y);
            if (tile) {
              expect(tile.isVisible).toBe(true);
              visibleTiles.push(`${x},${y}`);
            }
          }
        }
      }

      // At least some tiles should be visible
      expect(visibleTiles.length).toBeGreaterThan(0);
    });

    it('does not use pixel coordinates as tile indices', () => {
      // Create a unit at world position (200, 200)
      const unit: any = {
        id: 'test-unit',
        type: 'harvester' as any,
        position: { x: 200, y: 200 },
        targetPosition: null,
        speed: 50,
        carrying: 0,
        maxCarrying: 100,
        faction: 'vanguard',
        isSelected: false,
        visionRadius: 5,
        hp: 100,
        maxHp: 100,
        isDead: false,
        attackRange: 0,
        attackDamage: 0,
        attackCooldown: 0,
        lastAttackTime: 0
      };

      gameState.addUnit(unit);

      // Create a 30x20 tile grid
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 30; x++) {
          gameState.setTile(x, y, {
            type: TileType.GRASS,
            x,
            y,
            cost: 1,
            hasShards: false,
            agitation: 0,
            isBlocked: false,
            wormRisk: 0,
            isExplored: false,
            isVisible: false
          });
        }
      }

      gameState.updateFogOfWar();

      // The unit at (200, 200) should have vision radius 5
      // If we used pixel coordinates as tile indices, we'd be checking tiles around (200, 200)
      // which is way outside the 30x20 grid, so all tiles would be invisible
      // But with worldToTile, we correctly convert to (6, 6) and mark tiles around it as visible
      const visibleTiles = [];
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 30; x++) {
          const tile = gameState.getTile(x, y);
          if (tile && tile.isVisible) {
            visibleTiles.push(`${x},${y}`);
          }
        }
      }

      // At least some tiles should be visible
      expect(visibleTiles.length).toBeGreaterThan(0);
    });

    it('marks explored tiles when they become visible', () => {
      // Create a unit at world position (200, 200)
      const unit: any = {
        id: 'test-unit',
        type: 'harvester' as any,
        position: { x: 200, y: 200 },
        targetPosition: null,
        speed: 50,
        carrying: 0,
        maxCarrying: 100,
        faction: 'vanguard',
        isSelected: false,
        visionRadius: 5,
        hp: 100,
        maxHp: 100,
        isDead: false,
        attackRange: 0,
        attackDamage: 0,
        attackCooldown: 0,
        lastAttackTime: 0
      };

      gameState.addUnit(unit);

      // Create a 30x20 tile grid
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 30; x++) {
          gameState.setTile(x, y, {
            type: TileType.GRASS,
            x,
            y,
            cost: 1,
            hasShards: false,
            agitation: 0,
            isBlocked: false,
            wormRisk: 0,
            isExplored: false,
            isVisible: false
          });
        }
      }

      gameState.updateFogOfWar();

      // Check that explored tiles are marked
      const exploredTiles = [];
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 30; x++) {
          const tile = gameState.getTile(x, y);
          if (tile && tile.isExplored) {
            exploredTiles.push(`${x},${y}`);
          }
        }
      }

      // At least some tiles should be explored
      expect(exploredTiles.length).toBeGreaterThan(0);
    });
  });
});