import type { GameStateType } from '../core/GameState';
import type { Building, Position } from '../core/types';
import { BuildingType } from '../core/types';

export interface Buildable {
    type: BuildingType;
    name: string;
    cost: number;
    power: number;
    maxPower: number;
    hp: number;
    maxHp: number;
    footprint: { width: number; height: number };
    buildRadius: number;
    description?: string;
    tier?: 'standard' | 'reinforced';
    commandRadius?: number;
}

export class BuildPlacementSystem {
    private gameState: GameStateType;
    private buildMenuOpen: boolean = false;
    private selectedBuildType: BuildingType | null = null;
    private ghostPosition: Position | null = null;
    private buildQueue: Array<{ type: BuildingType; position: Position; progress: number }> = [];

    constructor(gameState: GameStateType) {
        this.gameState = gameState;
    }

    setGameState(gameState: GameStateType): void {
        this.gameState = gameState;
    }

    toggleBuildMenu(): void {
        this.buildMenuOpen = !this.buildMenuOpen;
        if (!this.buildMenuOpen) {
            this.selectedBuildType = null;
            this.ghostPosition = null;
        }
    }

    selectBuildType(buildType: BuildingType): void {
        if (this.buildMenuOpen) {
            this.selectedBuildType = buildType;
        }
    }

    getBuildMenuOpen(): boolean {
        return this.buildMenuOpen;
    }

    getSelectedBuildType(): BuildingType | null {
        return this.selectedBuildType;
    }

    setGhostPosition(position: Position): void {
        this.ghostPosition = position;
    }

    getGhostPosition(): Position | null {
        return this.ghostPosition;
    }

    getBuildables(): Buildable[] {
        return [
            {
                type: BuildingType.ANCHOR_LATTICE,
                name: 'Anchor Lattice',
                cost: 100,
                power: 0,
                maxPower: 0,
                hp: 200,
                maxHp: 200,
                footprint: { width: 2, height: 2 },
                buildRadius: 100,
                description: 'Expands command radius and enables advanced building placement',
                tier: 'standard',
                commandRadius: 150
            },
            {
                type: BuildingType.ANCHOR_LATTICE,
                name: 'Anchor Lattice (Reinforced)',
                cost: 150,
                power: 0,
                maxPower: 0,
                hp: 300,
                maxHp: 300,
                footprint: { width: 2, height: 2 },
                buildRadius: 150,
                description: 'Enhanced anchor lattice with larger command radius',
                tier: 'reinforced',
                commandRadius: 200
            },
            {
                type: BuildingType.POWER_NODE,
                name: 'Power Node',
                cost: 50,
                power: 50,
                maxPower: 50,
                hp: 100,
                maxHp: 100,
                footprint: { width: 1, height: 1 },
                buildRadius: 100,
                description: 'Generates power for other buildings',
                tier: 'standard'
            },
            {
                type: BuildingType.FORGE,
                name: 'Forge',
                cost: 75,
                power: 25,
                maxPower: 25,
                hp: 150,
                maxHp: 150,
                footprint: { width: 1, height: 1 },
                buildRadius: 100,
                description: 'Produces military units',
                tier: 'standard'
            },
            {
                type: BuildingType.TURRET,
                name: 'Turret',
                cost: 60,
                power: 20,
                maxPower: 20,
                hp: 80,
                maxHp: 80,
                footprint: { width: 1, height: 1 },
                buildRadius: 100,
                description: 'Automatically attacks nearby enemies',
                tier: 'standard'
            }
        ];
    }

    canBuild(buildType: BuildingType, position: Position): boolean {
        const buildable = this.getBuildables().find(b => b.type === buildType);

        if (!buildable) return false;

        // Check credits
        if (this.gameState.credits < buildable.cost) return false;

        // Check power
        if (this.gameState.power < buildable.power) return false;

        // Check build radius from command center
        const commandCenter = this.gameState.buildings.find(
            b => b.type === BuildingType.COMMAND_CENTER
        );
        if (!commandCenter) return false;

        const dx = position.x - commandCenter.position.x;
        const dy = position.y - commandCenter.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > buildable.buildRadius) return false;

        // Check footprint overlap
        for (let y = 0; y < buildable.footprint.height; y++) {
            for (let x = 0; x < buildable.footprint.width; x++) {
                const checkX = Math.floor(position.x) + x;
                const checkY = Math.floor(position.y) + y;

                const tile = this.gameState.tiles[checkY]?.[checkX];
                if (!tile || tile.isBlocked) return false;
            }
        }

        return true;
    }

    startBuild(buildType: BuildingType, position: Position): boolean {
        if (!this.canBuild(buildType, position)) return false;

        const buildable = this.getBuildables().find(b => b.type === buildType);

        if (!buildable) return false;

        // Deduct credits
        this.gameState.credits -= buildable.cost;

        // Add to build queue
        this.buildQueue.push({
            type: buildType,
            position,
            progress: 0
        });

        return true;
    }

    updateBuildQueue(deltaTime: number): void {
        const buildables = this.getBuildables();

        for (let i = this.buildQueue.length - 1; i >= 0; i--) {
            const build = this.buildQueue[i];
            const buildable = buildables.find(b => b.type === build.type);

            if (!buildable) continue;

            // Build time: 2 seconds per 100 HP
            const buildTime = (buildable.maxHp / 100) * 2;
            build.progress += deltaTime;

            if (build.progress >= buildTime) {
                // Complete build
                const newBuilding: Building = {
                    id: `${build.type}-${Date.now()}-${Math.random()}`,
                    type: build.type,
                    position: build.position,
                    bounds: {
                        x: build.position.x,
                        y: build.position.y,
                        width: buildable.footprint.width * 32,
                        height: buildable.footprint.height * 32
                    },
                    power: buildable.power,
                    maxPower: buildable.maxPower,
                    hp: buildable.maxHp,
                    maxHp: buildable.maxHp,
                    isPowered: true,
                    isDead: false
                };

                this.gameState.buildings.push(newBuilding);

                // Add power if it's a power node
                if (build.type === BuildingType.POWER_NODE) {
                    this.gameState.power += buildable.power;
                }

                this.buildQueue.splice(i, 1);
            }
        }
    }

    getBuildQueue(): Array<{ type: BuildingType; position: Position; progress: number }> {
        return [...this.buildQueue];
    }

    clearBuildQueue(): void {
        this.buildQueue = [];
    }
    getBuildProgress(buildType: BuildingType, position: Position): number {
        const build = this.buildQueue.find(
            b => b.type === buildType && b.position.x === position.x && b.position.y === position.y
        );
        return build ? build.progress : 0;
    }

    // P1-04: Anchor Lattice features
    getCommandRadius(): number {
        const commandCenter = this.gameState.buildings.find(
            b => b.type === BuildingType.COMMAND_CENTER
        );
        if (!commandCenter) return 100;

        let maxRadius = 100;
        this.gameState.buildings.forEach(building => {
            if (building.type === BuildingType.ANCHOR_LATTICE) {
                const buildable = this.getBuildables().find(b => b.type === building.type);
                if (buildable && buildable.commandRadius) {
                    maxRadius = Math.max(maxRadius, buildable.commandRadius);
                }
            }
        });
        return maxRadius;
    }

    getBuildingTier(buildType: BuildingType): 'standard' | 'reinforced' {
        const buildable = this.getBuildables().find(b => b.type === buildType);
        return buildable?.tier || 'standard';
    }

    getBuildableByType(buildType: BuildingType): Buildable | undefined {
        return this.getBuildables().find(b => b.type === buildType);
    }

    getBuildableCost(buildType: BuildingType): number {
        const buildable = this.getBuildables().find(b => b.type === buildType);
        return buildable?.cost || 0;
    }

    getBuildablePower(buildType: BuildingType): number {
        const buildable = this.getBuildables().find(b => b.type === buildType);
        return buildable?.power || 0;
    }

    getBuildableHp(buildType: BuildingType): number {
        const buildable = this.getBuildables().find(b => b.type === buildType);
        return buildable?.hp || 100;
    }

    getBuildableMaxHp(buildType: BuildingType): number {
        const buildable = this.getBuildables().find(b => b.type === buildType);
        return buildable?.maxHp || 100;
    }

    getBuildableDescription(buildType: BuildingType): string {
        const buildable = this.getBuildables().find(b => b.type === buildType);
        return buildable?.description || '';
    }

    // Check if position is within command radius
    isWithinCommandRadius(position: Position): boolean {
        const commandCenter = this.gameState.buildings.find(
            b => b.type === BuildingType.COMMAND_CENTER
        );
        if (!commandCenter) return false;

        const dx = position.x - commandCenter.position.x;
        const dy = position.y - commandCenter.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        return dist <= this.getCommandRadius();
    }

    // Get all valid positions for building placement
    getValidPositions(buildType: BuildingType): Position[] {
        const validPositions: Position[] = [];
        const buildable = this.getBuildableByType(buildType);
        if (!buildable) return validPositions;

        // Check all positions within command radius
        for (let y = 0; y < this.gameState.tiles.length; y++) {
            for (let x = 0; x < this.gameState.tiles[0].length; x++) {
                const position = { x: x * 32, y: y * 32 };
                
                if (this.canBuild(buildType, position)) {
                    validPositions.push(position);
                }
            }
        }
        return validPositions;
    }

    // Get placement preview info
    getPlacementPreview(buildType: BuildingType, position: Position): {
        isValid: boolean;
        cost: number;
        power: number;
        hp: number;
        description: string;
        tier: 'standard' | 'reinforced';
        commandRadius: number;
        reasons: string[];
    } {
        const buildable = this.getBuildableByType(buildType);
        if (!buildable) {
            return {
                isValid: false,
                cost: 0,
                power: 0,
                hp: 0,
                description: '',
                tier: 'standard',
                commandRadius: 0,
                reasons: ['Invalid building type']
            };
        }

        const reasons: string[] = [];
        
        // Check credits
        if (this.gameState.credits < buildable.cost) {
            reasons.push(`Not enough credits: ${this.gameState.credits}/${buildable.cost}`);
        }

        // Check power
        if (this.gameState.power < buildable.power) {
            reasons.push(`Not enough power: ${this.gameState.power}/${buildable.power}`);
        }

        // Check command radius
        if (!this.isWithinCommandRadius(position)) {
            reasons.push(`Outside command radius (${this.getCommandRadius()}px)`);
        }

        // Check footprint
        for (let y = 0; y < buildable.footprint.height; y++) {
            for (let x = 0; x < buildable.footprint.width; x++) {
                const checkX = Math.floor(position.x) + x;
                const checkY = Math.floor(position.y) + y;

                const tile = this.gameState.tiles[checkY]?.[checkX];
                if (!tile || tile.isBlocked) {
                    reasons.push(`Position blocked at (${checkX}, ${checkY})`);
                    break;
                }
            }
        }

        return {
            isValid: reasons.length === 0,
            cost: buildable.cost,
            power: buildable.power,
            hp: buildable.hp,
            description: buildable.description || '',
            tier: buildable.tier || 'standard',
            commandRadius: buildable.commandRadius || 0,
            reasons
        };
    }
}