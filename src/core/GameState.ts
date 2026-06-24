// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Unit, Building, Tile, Position, Projectile, MissionState } from './types';
import { TileType } from './types';
import { worldToTile } from './coords';

export interface GameStateType {
    units: Unit[];
    buildings: Building[];
    tiles: Tile[][];
    credits: number;
    power: number;
    maxPower: number;
    planetAgitation: number;
    selectedUnits: string[];
    camera: {
        x: number;
        y: number;
        zoom: number;
    };
    fogOfWar: {
        visible: Set<string>;
        explored: Set<string>;
    };
    minimap: {
        x: number;
        y: number;
        width: number;
        height: number;
        data: number[][];
    };
    moveQueue: Array<{
        unitId: string;
        target: Position;
    }>;
    projectiles: Projectile[];
    mission: MissionState | null;
}

export class GameState {
    private static instance: GameState;
    private state: GameStateType;

    private constructor() {
        this.state = {
            units: [],
            buildings: [],
            tiles: [],
            credits: 100,
            power: 50,
            maxPower: 100,
            planetAgitation: 0,
            selectedUnits: [],
            camera: {
                x: 0,
                y: 0,
                zoom: 1
            },
            fogOfWar: {
                visible: new Set<string>(),
                explored: new Set<string>()
            },
            minimap: {
                x: 0,
                y: 0,
                width: 30,
                height: 20,
                data: []
            },
            moveQueue: [],
            projectiles: [],
            mission: null
        };
    }

    static getInstance(): GameState {
        if (!GameState.instance) {
            GameState.instance = new GameState();
        }
        return GameState.instance;
    }

    getState(): GameStateType {
        return this.state;
    }

    addUnit(unit: GameStateType['units'][number]): void {
        this.state.units.push(unit);
    }

    addBuilding(building: GameStateType['buildings'][number]): void {
        this.state.buildings.push(building);
    }

    setTile(x: number, y: number, tile: GameStateType['tiles'][number][number]): void {
        if (!this.state.tiles[y]) {
            this.state.tiles[y] = [];
        }
        this.state.tiles[y][x] = tile;
    }

    getTile(x: number, y: number): GameStateType['tiles'][number][number] | null {
        if (this.state.tiles[y] && this.state.tiles[y][x]) {
            return this.state.tiles[y][x];
        }
        return null;
    }

    setCredits(amount: number): void {
        this.state.credits = amount;
    }

    addCredits(amount: number): void {
        this.state.credits += amount;
    }

    addCreditsOnDeposit(amount: number): void {
        this.state.credits += amount;
    }

    setPower(amount: number, max?: number): void {
        this.state.power = amount;
        if (max !== undefined) {
            this.state.maxPower = max;
        }
    }

    addPower(amount: number): void {
        this.state.power = Math.min(this.state.power + amount, this.state.maxPower);
    }

    setPlanetAgitation(amount: number): void {
        this.state.planetAgitation = amount;
    }

    addPlanetAgitation(amount: number): void {
        this.state.planetAgitation += amount;
    }

    selectUnit(unitId: string): void {
        this.state.selectedUnits = [unitId];
    }

    selectUnits(unitIds: string[]): void {
        this.state.selectedUnits = unitIds;
    }

    addToMoveQueue(unitId: string, target: Position): void {
        this.state.moveQueue.push({ unitId, target });
    }

    getMoveQueue(): Array<{ unitId: string; target: Position }> {
        return this.state.moveQueue;
    }

    clearMoveQueue(): void {
        this.state.moveQueue = [];
    }

    addProjectile(projectile: Projectile): void {
        this.state.projectiles.push(projectile);
    }

    updateProjectiles(deltaTime: number): void {
        const state = this.state;
        const toRemove: string[] = [];

        state.projectiles.forEach(projectile => {
            if (projectile.isDead) {
                toRemove.push(projectile.id);
                return;
            }

            const dx = projectile.target.x - projectile.position.x;
            const dy = projectile.target.y - projectile.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 5) {
                projectile.isDead = true;
                toRemove.push(projectile.id);
            } else {
                const speed = projectile.speed * deltaTime;
                projectile.position.x += (dx / dist) * speed;
                projectile.position.y += (dy / dist) * speed;
            }
        });

        toRemove.forEach(id => {
            const idx = state.projectiles.findIndex(p => p.id === id);
            if (idx !== -1) {
                state.projectiles.splice(idx, 1);
            }
        });
    }

    setMission(mission: MissionState | null): void {
        this.state.mission = mission;
    }

    getMission(): MissionState | null {
        return this.state.mission;
    }

    getSelectedUnits(): GameStateType['units'] {
        return this.state.units.filter(unit => this.state.selectedUnits.includes(unit.id));
    }

    getSelectedUnitIds(): string[] {
        return [...this.state.selectedUnits];
    }

    setCamera(x: number, y: number, zoom: number): void {
        this.state.camera = { x, y, zoom };
    }

    getCamera() {
        return this.state.camera;
    }

    initializeFogOfWar(): void {
        const state = this.state;
        state.fogOfWar.visible.clear();
        state.fogOfWar.explored.clear();
    }

    updateFogOfWar(): void {
        const state = this.state;
        const visible = new Set<string>();

        // Reset visibility
        state.tiles.forEach((row) => {
            row.forEach((tile) => {
                tile.isVisible = false;
            });
        });

        // Mark tiles visible to each unit
        state.units.forEach(unit => {
            const visionRadius = unit.visionRadius;
            const unitTile = worldToTile(unit.position);
            const unitX = unitTile.x;
            const unitY = unitTile.y;

            for (let dy = -visionRadius; dy <= visionRadius; dy++) {
                for (let dx = -visionRadius; dx <= visionRadius; dx++) {
                    const checkX = unitX + dx;
                    const checkY = unitY + dy;

                    if (checkX >= 0 && checkX < state.tiles[0].length &&
                        checkY >= 0 && checkY < state.tiles.length) {
                        const dist = Math.abs(dx) + Math.abs(dy);
                        if (dist <= visionRadius) {
                            const tile = state.tiles[checkY][checkX];
                            tile.isVisible = true;
                            visible.add(`${checkX},${checkY}`);
                        }
                    }
                }
            }
        });

        // Mark explored tiles
        state.tiles.forEach((row, y) => {
            row.forEach((tile, x) => {
                if (tile.isVisible) {
                    state.fogOfWar.explored.add(`${x},${y}`);
                }
            });
        });

        state.fogOfWar.visible = visible;
    }

    initializeMinimap(): void {
        const state = this.state;
        state.minimap.data = [];

        state.tiles.forEach((row, y) => {
            state.minimap.data[y] = [];
            row.forEach((tile, x) => {
                // Encode tile type into minimap data: 0=grass, 1=dirt, 2=stone, 3=shard, 4=ridge, 5=deep_crust
                let encoded = 0;
                switch (tile.type) {
                    case TileType.GRASS: encoded = 0; break;
                    case TileType.DIRT: encoded = 1; break;
                    case TileType.STONE: encoded = 2; break;
                    case TileType.SHARD_FIELD: encoded = 3; break;
                    case TileType.RIDGE: encoded = 4; break;
                    case TileType.DEEP_CRUST: encoded = 5; break;
                }
                state.minimap.data[y][x] = encoded;
            });
        });
    }
}