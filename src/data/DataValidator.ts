export interface ValidationError {
  field: string;
  message: string;
}

import type { Unit, Building, Tile } from '../core/types';

export class DataValidator {
  static validateUnits(units: Unit[]): ValidationError[] {
    const errors: ValidationError[] = [];

    units.forEach((unit, index) => {
      if (!unit.id) {
        errors.push({ field: `units[${index}].id`, message: 'Missing required field: id' });
      }
      if (!unit.type) {
        errors.push({ field: `units[${index}].type`, message: 'Missing required field: type' });
      }
      if (!unit.position || typeof unit.position.x !== 'number' || typeof unit.position.y !== 'number') {
        errors.push({ field: `units[${index}].position`, message: 'Invalid position: must be {x: number, y: number}' });
      }
      if (unit.speed !== undefined && typeof unit.speed !== 'number') {
        errors.push({ field: `units[${index}].speed`, message: 'Invalid speed: must be number' });
      }
      if (unit.visionRadius !== undefined && typeof unit.visionRadius !== 'number') {
        errors.push({ field: `units[${index}].visionRadius`, message: 'Invalid visionRadius: must be number' });
      }
      if (unit.hp !== undefined && typeof unit.hp !== 'number') {
        errors.push({ field: `units[${index}].hp`, message: 'Invalid hp: must be number' });
      }
      if (unit.maxHp !== undefined && typeof unit.maxHp !== 'number') {
        errors.push({ field: `units[${index}].maxHp`, message: 'Invalid maxHp: must be number' });
      }
      if (unit.attackRange !== undefined && typeof unit.attackRange !== 'number') {
        errors.push({ field: `units[${index}].attackRange`, message: 'Invalid attackRange: must be number' });
      }
      if (unit.attackDamage !== undefined && typeof unit.attackDamage !== 'number') {
        errors.push({ field: `units[${index}].attackDamage`, message: 'Invalid attackDamage: must be number' });
      }
      if (unit.attackCooldown !== undefined && typeof unit.attackCooldown !== 'number') {
        errors.push({ field: `units[${index}].attackCooldown`, message: 'Invalid attackCooldown: must be number' });
      }
    });

    return errors;
  }

  static validateBuildings(buildings: Building[]): ValidationError[] {
    const errors: ValidationError[] = [];

    buildings.forEach((building, index) => {
      if (!building.id) {
        errors.push({ field: `buildings[${index}].id`, message: 'Missing required field: id' });
      }
      if (!building.type) {
        errors.push({ field: `buildings[${index}].type`, message: 'Missing required field: type' });
      }
      if (!building.position || typeof building.position.x !== 'number' || typeof building.position.y !== 'number') {
        errors.push({ field: `buildings[${index}].position`, message: 'Invalid position: must be {x: number, y: number}' });
      }
      if (building.power !== undefined && typeof building.power !== 'number') {
        errors.push({ field: `buildings[${index}].power`, message: 'Invalid power: must be number' });
      }
      if (building.maxPower !== undefined && typeof building.maxPower !== 'number') {
        errors.push({ field: `buildings[${index}].maxPower`, message: 'Invalid maxPower: must be number' });
      }
      if (building.hp !== undefined && typeof building.hp !== 'number') {
        errors.push({ field: `buildings[${index}].hp`, message: 'Invalid hp: must be number' });
      }
      if (building.maxHp !== undefined && typeof building.maxHp !== 'number') {
        errors.push({ field: `buildings[${index}].maxHp`, message: 'Invalid maxHp: must be number' });
      }
    });

    return errors;
  }

  static validateTiles(tiles: Tile[][]): ValidationError[] {
    const errors: ValidationError[] = [];

    tiles.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (!tile.type) {
          errors.push({ field: `tiles[${y}][${x}].type`, message: 'Missing required field: type' });
        }
        if (tile.cost !== undefined && typeof tile.cost !== 'number') {
          errors.push({ field: `tiles[${y}][${x}].cost`, message: 'Invalid cost: must be number' });
        }
        if (tile.hasShards !== undefined && typeof tile.hasShards !== 'boolean') {
          errors.push({ field: `tiles[${y}][${x}].hasShards`, message: 'Invalid hasShards: must be boolean' });
        }
        if (tile.shardAmount !== undefined && typeof tile.shardAmount !== 'number') {
          errors.push({ field: `tiles[${y}][${x}].shardAmount`, message: 'Invalid shardAmount: must be number' });
        }
        if (tile.agitation !== undefined && typeof tile.agitation !== 'number') {
          errors.push({ field: `tiles[${y}][${x}].agitation`, message: 'Invalid agitation: must be number' });
        }
        if (tile.isBlocked !== undefined && typeof tile.isBlocked !== 'boolean') {
          errors.push({ field: `tiles[${y}][${x}].isBlocked`, message: 'Invalid isBlocked: must be boolean' });
        }
        if (tile.wormRisk !== undefined && typeof tile.wormRisk !== 'number') {
          errors.push({ field: `tiles[${y}][${x}].wormRisk`, message: 'Invalid wormRisk: must be number' });
        }
        if (tile.isExplored !== undefined && typeof tile.isExplored !== 'boolean') {
          errors.push({ field: `tiles[${y}][${x}].isExplored`, message: 'Invalid isExplored: must be boolean' });
        }
        if (tile.isVisible !== undefined && typeof tile.isVisible !== 'boolean') {
          errors.push({ field: `tiles[${y}][${x}].isVisible`, message: 'Invalid isVisible: must be boolean' });
        }
      });
    });

    return errors;
  }

  static validateUnitType(type: string): boolean {
    const validTypes = ['harvester', 'commander', 'scout', 'raider'];
    return validTypes.includes(type);
  }

  static validateBuildingType(type: string): boolean {
    const validTypes = ['processor', 'silo', 'command_center', 'anchor_lattice', 'power_node', 'forge', 'turret', 'research_lab', 'titan_worm', 'volatile_bloom'];
    return validTypes.includes(type);
  }

  static validateTileType(type: string): boolean {
    const validTypes = ['grass', 'dirt', 'stone', 'shard_field', 'ridge', 'deep_crust'];
    return validTypes.includes(type);
  }
}