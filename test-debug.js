#!/usr/bin/env node

import { HarvestSystem } from './src/systems/HarvestSystem.js';
import { TileType } from './src/core/types.js';

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

harvestSystem.setTile(10, 10, shardTile);
harvestSystem.setProcessorPosition({ x: 400, y: 300 });

// Create a harvester at a different position (far from processor)
const harvester = {
  id: 'harvester-1',
  type: 'harvester',
  position: { x: 100, y: 100 },
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

console.log('Initial state:');
console.log('Harvester position:', harvester.position);
console.log('Shard tile:', shardTile);
console.log('Processor position:', harvestSystem['processorPosition']);

// Advance time to allow harvester to move to shard
const deltaTime = 2000; // 2 seconds
console.log('\nUpdating for', deltaTime, 'ms...');

harvestSystem.updateUnits(deltaTime);

console.log('\nAfter update:');
console.log('Harvester position:', harvester.position);
console.log('Harvester carrying:', harvester.carrying);
console.log('Shard tile hasShards:', shardTile.hasShards);
console.log('Shard tile shardAmount:', shardTile.shardAmount);

if (harvester.carrying > 0) {
  console.log('\n✓ Test PASSED: Harvester is harvesting');
} else {
  console.log('\n✗ Test FAILED: Harvester is not harvesting');
  process.exit(1);
}