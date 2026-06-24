// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { GameStateType } from '../core/GameState';
import type { Building, TileCoord, Position } from '../core/types';
import { BuildingType } from '../core/types';

export interface LatticeTier {
  name: 'standard' | 'reinforced';
  cost: number;
  health: number;
  power: number;
  commandRadius: number;
  degradation: number;
  powerLeakage: number;
}

export interface LatticePlacementPreview {
  isValid: boolean;
  position: Position;
  tile: TileCoord;
  cost: number;
  commandRadius: number;
  tier: 'standard' | 'reinforced';
  message?: string;
}

export class LatticeSystem {
  private placementPreview: LatticePlacementPreview | null = null;
  private currentTier: 'standard' | 'reinforced' = 'standard';

  private readonly TIER_CONFIGS: Record<'standard' | 'reinforced', LatticeTier> = {
    standard: {
      name: 'standard',
      cost: 100,
      health: 100,
      power: 0,
      commandRadius: 150,
      degradation: 0.1,
      powerLeakage: 0.05
    },
    reinforced: {
      name: 'reinforced',
      cost: 200,
      health: 200,
      power: 0,
      commandRadius: 200,
      degradation: 0.05,
      powerLeakage: 0.02
    }
  };

  setTier(tier: 'standard' | 'reinforced'): void {
    this.currentTier = tier;
  }

  getTier(): 'standard' | 'reinforced' {
    return this.currentTier;
  }

  getTierConfig(tier: 'standard' | 'reinforced'): LatticeTier {
    return this.TIER_CONFIGS[tier];
  }

  setPlacementPreview(state: GameStateType, tile: TileCoord): void {
    const config = this.TIER_CONFIGS[this.currentTier];
    const tileSize = 32;
    const worldPos = {
      x: tile.x * tileSize + tileSize / 2,
      y: tile.y * tileSize + tileSize / 2
    };

    this.placementPreview = {
      isValid: false,
      position: worldPos,
      tile,
      cost: config.cost,
      commandRadius: config.commandRadius,
      tier: this.currentTier
    };

    this.validatePlacement(state);
  }

  clearPlacementPreview(): void {
    this.placementPreview = null;
  }

  getPlacementPreview(): LatticePlacementPreview | null {
    return this.placementPreview;
  }

  private validatePlacement(state: GameStateType): void {
    if (!this.placementPreview) return;

    const { tile } = this.placementPreview;
    const config = this.TIER_CONFIGS[this.currentTier];

    // Check map bounds
    const mapWidth = state.tiles[0]?.length || 100;
    const mapHeight = state.tiles.length || 100;

    if (tile.x < 0 || tile.x >= mapWidth || tile.y < 0 || tile.y >= mapHeight) {
      this.placementPreview!.isValid = false;
      this.placementPreview!.message = 'Out of bounds';
      return;
    }

    // Check terrain validity
    const tileData = state.tiles[tile.y][tile.x];
    if (tileData.type === 'deep_crust' || tileData.type === 'ridge') {
      this.placementPreview!.isValid = false;
      this.placementPreview!.message = 'Invalid terrain';
      return;
    }

    // Check footprint clear
    const footprintSize = 1;
    for (let dy = 0; dy < footprintSize; dy++) {
      for (let dx = 0; dx < footprintSize; dx++) {
        const checkX = tile.x + dx;
        const checkY = tile.y + dy;

        if (checkX < 0 || checkX >= mapWidth || checkY < 0 || checkY >= mapHeight) {
          this.placementPreview!.isValid = false;
          this.placementPreview!.message = 'Out of bounds';
          return;
        }

        const existingBuilding = state.buildings.find(b => {
          const bTile = this.worldToTile(b.position);
          return bTile.x === checkX && bTile.y === checkY;
        });

        if (existingBuilding) {
          this.placementPreview!.isValid = false;
          this.placementPreview!.message = 'Footprint occupied';
          return;
        }
      }
    }

    // Check build radius - must be within build radius of existing anchor lattice
    const existingLattices = state.buildings.filter(b => b.type === BuildingType.ANCHOR_LATTICE && !b.isDead);
    if (existingLattices.length === 0) {
      this.placementPreview!.isValid = false;
      this.placementPreview!.message = 'Requires existing anchor lattice';
      return;
    }

    const buildRadius = 200; // 200 world units
    const tileSize = 32;
    const newTileX = tile.x;
    const newTileY = tile.y;

    let withinBuildRadius = false;
    for (const lattice of existingLattices) {
      const latticeTile = this.worldToTile(lattice.position);
      const dist = Math.abs(newTileX - latticeTile.x) + Math.abs(newTileY - latticeTile.y);
      if (dist <= buildRadius / tileSize) {
        withinBuildRadius = true;
        break;
      }
    }

    if (!withinBuildRadius) {
      this.placementPreview!.isValid = false;
      this.placementPreview!.message = 'Outside build radius';
      return;
    }

    // Check credits
    if (state.credits < config.cost) {
      this.placementPreview!.isValid = false;
      this.placementPreview!.message = 'Insufficient credits';
      return;
    }

    this.placementPreview!.isValid = true;
  }

  placeLattice(state: GameStateType): boolean {
    if (!this.placementPreview || !this.placementPreview.isValid) {
      return false;
    }

    const { tile, cost, tier } = this.placementPreview;
    const config = this.TIER_CONFIGS[tier];
    const tileSize = 32;

    const building: Building = {
      id: `anchor_lattice-${Date.now()}-${Math.random()}`,
      type: BuildingType.ANCHOR_LATTICE,
      position: {
        x: tile.x * tileSize + tileSize / 2,
        y: tile.y * tileSize + tileSize / 2
      },
      bounds: {
        x: tile.x * tileSize,
        y: tile.y * tileSize,
        width: tileSize,
        height: tileSize
      },
      power: config.power,
      maxPower: config.power,
      hp: config.health,
      maxHp: config.health,
      isPowered: true,
      isDead: false
    };

    state.buildings.push(building);
    state.credits -= cost;

    this.clearPlacementPreview();
    return true;
  }

  private worldToTile(pos: Position): TileCoord {
    const tileSize = 32;
    return {
      x: Math.floor(pos.x / tileSize),
      y: Math.floor(pos.y / tileSize)
    };
  }

  update(state: GameStateType): void {
    // Update placement preview if active
    if (this.placementPreview) {
      this.validatePlacement(state);
    }
  }
}