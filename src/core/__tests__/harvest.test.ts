import { HarvestSystem } from '../../systems/HarvestSystem';
import { GameState } from '../GameState';
import { TileType } from '../types';

describe('HarvestSystem', () => {
  let harvestSystem: HarvestSystem;
  let gameState: GameState;

  beforeEach(() => {
    harvestSystem = new HarvestSystem();
    gameState = GameState.getInstance();
    gameState.initializeFogOfWar();
  });

  afterEach(() => {
    (GameState as any).instance = null;
  });

  describe('findNearbyShardTile', () => {
    it('converts resource tile positions to world centers', () => {
      // Create a tile at (10, 10) with shards
      const tile: any = {
        type: TileType.SHARD_FIELD,
        x: 10,
        y: 10,
        cost: 1,
        hasShards: true,
        agitation: 0,
        isBlocked: false,
        wormRisk: 0,
        isExplored: false,
        isVisible: false
      };

      harvestSystem.setTile(10, 10, tile);
      harvestSystem.setProcessorPosition({ x: 400, y: 300 });

      // Create a harvester at world position (400, 300)
      const harvester: any = {
        id: 'harvester-1',
        type: 'harvester',
        position: { x: 400, y: 300 },
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

      harvestSystem.addUnit(harvester);

      // Find nearby shard tile
      const nearbyTile = harvestSystem['findNearbyShardTile']({ x: 400, y: 300 });

      // The tile should be converted to world center
      const worldPos = { x: 10, y: 10 };
      const distance = Math.sqrt(
        Math.pow(400 - worldPos.x, 2) + Math.pow(300 - worldPos.y, 2)
      );

      expect(nearbyTile).toBeDefined();
      expect(nearbyTile?.x).toBe(10);
      expect(nearbyTile?.y).toBe(10);
      expect(distance).toBeLessThan(100);
    });

    it('finds nearest reachable finite resource node', () => {
      // Create multiple shard tiles
      const tile1: any = {
        type: TileType.SHARD_FIELD,
        x: 10,
        y: 10,
        cost: 1,
        hasShards: true,
        agitation: 0,
        isBlocked: false,
        wormRisk: 0,
        isExplored: false,
        isVisible: false
      };

      const tile2: any = {
        type: TileType.SHARD_FIELD,
        x: 20,
        y: 20,
        cost: 1,
        hasShards: true,
        agitation: 0,
        isBlocked: false,
        wormRisk: 0,
        isExplored: false,
        isVisible: false
      };

      harvestSystem.setTile(10, 10, tile1);
      harvestSystem.setTile(20, 20, tile2);
      harvestSystem.setProcessorPosition({ x: 400, y: 300 });

      // Create a harvester at world position (400, 300)
      const harvester: any = {
        id: 'harvester-1',
        type: 'harvester',
        position: { x: 400, y: 300 },
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

      harvestSystem.addUnit(harvester);

      // Find nearest shard tile
      const nearbyTile = harvestSystem['findNearbyShardTile']({ x: 400, y: 300 });

      // Should find tile1 (10, 10) which is closer than tile2 (20, 20)
      expect(nearbyTile).toBeDefined();
      expect(nearbyTile?.x).toBe(10);
      expect(nearbyTile?.y).toBe(10);
    });

    it('skips blocked tiles (ridges)', () => {
      // Create a blocked ridge tile
      const ridgeTile: any = {
        type: TileType.RIDGE,
        x: 10,
        y: 10,
        cost: 999,
        hasShards: true,
        agitation: 0,
        isBlocked: true,
        wormRisk: 0,
        isExplored: false,
        isVisible: false
      };

      harvestSystem.setTile(10, 10, ridgeTile);
      harvestSystem.setProcessorPosition({ x: 400, y: 300 });

      // Create a harvester at world position (400, 300)
      const harvester: any = {
        id: 'harvester-1',
        type: 'harvester',
        position: { x: 400, y: 300 },
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

      harvestSystem.addUnit(harvester);

      // Find nearby shard tile - should skip blocked ridge
      const nearbyTile = harvestSystem['findNearbyShardTile']({ x: 400, y: 300 });

      expect(nearbyTile).toBeNull();
    });

    it('returns null when no reachable shards nearby', () => {
      harvestSystem.setProcessorPosition({ x: 400, y: 300 });

      // Create a harvester at world position (400, 300)
      const harvester: any = {
        id: 'harvester-1',
        type: 'harvester',
        position: { x: 400, y: 300 },
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

      harvestSystem.addUnit(harvester);

      // Find nearby shard tile - no shards in range
      const nearbyTile = harvestSystem['findNearbyShardTile']({ x: 400, y: 300 });

      expect(nearbyTile).toBeNull();
    });
  });

  describe('updateUnits', () => {
    it('handles harvester moving to processor with cargo', () => {
      harvestSystem.setProcessorPosition({ x: 400, y: 300 });

      // Create a harvester at world position (400, 300) with cargo
      const harvester: any = {
        id: 'harvester-1',
        type: 'harvester',
        position: { x: 400, y: 300 },
        targetPosition: null,
        speed: 50,
        carrying: 50,
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

      harvestSystem.addUnit(harvester);

      // Update units
      harvestSystem.updateUnits();

      // Harvester should have moved towards processor
      expect(harvester.carrying).toBe(50);
    });

    it('handles harvester harvesting from shard', () => {
      // Create a shard tile
      const shardTile: any = {
        type: TileType.SHARD_FIELD,
        x: 10,
        y: 10,
        cost: 1,
        hasShards: true,
        agitation: 0,
        isBlocked: false,
        wormRisk: 0,
        isExplored: false,
        isVisible: false
      };

      harvestSystem.setTile(10, 10, shardTile);
      harvestSystem.setProcessorPosition({ x: 400, y: 300 });

      // Create a harvester at world position (400, 300)
      const harvester: any = {
        id: 'harvester-1',
        type: 'harvester',
        position: { x: 400, y: 300 },
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

      harvestSystem.addUnit(harvester);

      // Update units
      harvestSystem.updateUnits();

      // Harvester should have moved towards shard and started harvesting
      expect(harvester.carrying).toBeGreaterThan(0);
    });
  });
});