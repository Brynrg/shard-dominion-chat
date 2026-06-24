import type { GameState } from '../core/types';
import type { Building, TileCoord, Position } from '../core/types';

export interface PlacementPreview {
    isValid: boolean;
    position: Position;
    tile: TileCoord;
    cost: number;
    commandRadius: number;
    tier: 'standard' | 'reinforced';
    message?: string;
    buildingType?: string;
}

export class ConstructionSystem {
    private placementPreview: PlacementPreview | null = null;
    private buildingData: Record<string, {
        cost: number;
        powerConsumption: number;
        prerequisites: string[];
    }>;

    constructor() {
        // Load building data from JSON
        this.buildingData = {
            anchor_lattice: {
                cost: 50,
                powerConsumption: 0,
                prerequisites: []
            },
            power_node: {
                cost: 150,
                powerConsumption: 0,
                prerequisites: ['anchor_lattice']
            },
            forge: {
                cost: 300,
                powerConsumption: 75,
                prerequisites: ['anchor_lattice', 'power_node']
            },
            turret: {
                cost: 200,
                powerConsumption: 25,
                prerequisites: ['anchor_lattice', 'power_node']
            },
            processor: {
                cost: 100,
                powerConsumption: 50,
                prerequisites: []
            },
            command_center: {
                cost: 200,
                powerConsumption: 100,
                prerequisites: []
            },
            silo: {
                cost: 250,
                powerConsumption: 60,
                prerequisites: ['anchor_lattice', 'power_node']
            },
            barracks: {
                cost: 180,
                powerConsumption: 40,
                prerequisites: ['anchor_lattice', 'power_node']
            },
            factory: {
                cost: 400,
                powerConsumption: 120,
                prerequisites: ['anchor_lattice', 'power_node', 'forge']
            },
            research_lab: {
                cost: 350,
                powerConsumption: 90,
                prerequisites: ['anchor_lattice', 'power_node', 'forge']
            }
        };
    }

    update(state: GameState): void {
        // Update placement preview if active
        if (this.placementPreview) {
            this.validatePlacement(state);
        }
    }

    setPlacementPreview(state: GameState, tile: TileCoord, buildingType: string): void {
        const buildingData = this.buildingData[buildingType];
        if (!buildingData) {
            this.placementPreview = null;
            return;
        }

        const tileSize = 32;
        const worldPos = {
            x: tile.x * tileSize + tileSize / 2,
            y: tile.y * tileSize + tileSize / 2
        };

        this.placementPreview = {
            isValid: false,
            position: worldPos,
            tile,
            cost: buildingData.cost,
            commandRadius: 150,
            tier: 'standard',
            buildingType
        };

        this.validatePlacement(state);
    }

    clearPlacementPreview(): void {
        this.placementPreview = null;
    }

    getPlacementPreview(): PlacementPreview | null {
        return this.placementPreview;
    }

    private validatePlacement(state: GameState): void {
        if (!this.placementPreview) return;

        const { tile, buildingType } = this.placementPreview;
        if (!buildingType) return;
        const buildingData = this.buildingData[buildingType] || { cost: 0, powerConsumption: 0, prerequisites: [] };

        // Check map bounds
        const mapWidth = state.tiles[0]?.length || 100;
        const mapHeight = state.tiles.length || 100;
        if (tile.x < 0 || tile.x >= mapWidth || tile.y < 0 || tile.y >= mapHeight) {
            this.placementPreview!.isValid = false;
            this.placementPreview!.message = 'Out of bounds';
            return;
        }

        // Check terrain validity
        const tileRow = state.tiles[tile.y];
        if (!tileRow) {
            this.placementPreview!.isValid = false;
            this.placementPreview!.message = 'Invalid terrain';
            return;
        }
        const tileData = tileRow[tile.x];
        if (!tileData) {
            this.placementPreview!.isValid = false;
            this.placementPreview!.message = 'Invalid terrain';
            return;
        }
        if (tileData.type === 'deep_crust' || tileData.type === 'ridge') {
            this.placementPreview!.isValid = false;
            this.placementPreview!.message = 'Invalid terrain';
            return;
        }

        // Check footprint clear
        const footprintSize = 1; // 1x1 building
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

        // Check prerequisites
        const currentBuildingData = this.buildingData[buildingType] || { cost: 0, powerConsumption: 0, prerequisites: [] };

        for (const prereq of currentBuildingData.prerequisites) {
            const hasPrereq = state.buildings.some(
                (b: Building) => b.type === prereq && !b.isDead
            );
            if (!hasPrereq) {
                this.placementPreview!.isValid = false;
                this.placementPreview!.message = `Requires ${prereq}`;
                return;
            }
        }

        // Check power availability
        const powerNodes = state.buildings.filter(b => b.type === 'power_node');
        const totalPowerGenerated = powerNodes.reduce((sum, b) => sum + b.power, 0);
        const totalPowerConsumption = state.buildings.reduce((sum, b) => {
            if (b.isPowered) {
                return sum + b.maxPower;
            }
            return sum;
        }, 0);
        const availablePower = totalPowerGenerated - totalPowerConsumption;

        if (availablePower < currentBuildingData.powerConsumption) {
            this.placementPreview!.isValid = false;
            this.placementPreview!.message = 'Insufficient power';
            return;
        }

        // Check credits
        if (state.credits < buildingData.cost) {
            this.placementPreview!.isValid = false;
            this.placementPreview!.message = 'Insufficient credits';
            return;
        }

        this.placementPreview!.isValid = true;
    }

    placeBuilding(state: GameState, buildingType: string): boolean {
        if (!this.placementPreview || !this.placementPreview.isValid) {
            return false;
        }

        const { tile, cost } = this.placementPreview;
        const tileSize = 32;
        const buildingData = this.buildingData[buildingType];
        if (!buildingData) return false;

        const building: Building = {
            id: `${buildingType}-${Date.now()}-${Math.random()}`,
            type: buildingType as any,
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
            power: 0,
            maxPower: 0,
            hp: 100,
            maxHp: 100,
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
}