#!/usr/bin/env node

import { HarvestSystem } from './src/systems/HarvestSystem.js';
import { TileType } from './src/core/types.js';
import { tileToWorldCenter } from './src/core/coords.js';

const harvestSystem = new HarvestSystem();

// Create a shard tile
const shardTile = {
  type: TileType.SHARD_FIELD,
  x: 10,
  y: 10,
  cost: 1,
  hasShards: true,
  shardAmount: 50,
  agitation: 0,
  isBlocked: false,
  wormRisk: 0,
  isExplored: false,
  isVisible: false
};

console.log('Setting up shard tile at tile coordinates (10, 10)...');
harvestSystem.setTile(10, 10, shardTile);

const processorPosition = { x: 400, y: 300 };
harvestSystem.setProcessorPosition(processorPosition);

// Create a harvester at a position closer to the shard tile
// Shard tile world position: (336, 336)
const harvester = {
  id: 'harvester-1',
  type: 'harvester',
  position: { x: 336, y: 336 }, // Start at the shard tile
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

console.log('Adding harvester at world position (336, 336)...');
harvestSystem.addUnit(harvester);

console.log('\nInitial state:');
console.log('Harvester position:', harvester.position);
console.log('Shard tile:', shardTile);
console.log('Processor position:', processorPosition);
console.log('Shard tile world position:', tileToWorldCenter({ x: 10, y: 10 }));

// Advance time to allow harvester to move to shard
const deltaTime = 2000; // 2 seconds
console.log('\nUpdating for', deltaTime, 'ms...');

harvestSystem.updateUnits(deltaTime);

console.log('\nAfter update:');
console.log('Harvester position:', harvester.position);
console.log('Harvester carrying:', harvester.carrying);
console.log('Shard tile hasShards:', shardTile.hasShards);
console.log('Shard tile shardAmount:', shardTile.shardAmount);

// Get tiles from system
const tiles = harvestSystem.getTiles();
console.log('\nTiles in system:', tiles.length);
tiles.forEach(tile => {
  console.log('  - Tile at', tile.x, tile.y, 'type:', tile.type, 'hasShards:', tile.hasShards, 'shardAmount:', tile.shardAmount);
});

if (harvester.carrying > 0) {
  console.log('\n✓ Test PASSED: Harvester is harvesting');
  process.exit(0);
} else {
  console.log('\n✗ Test FAILED: Harvester is not harvesting');
  process.exit(1);
}