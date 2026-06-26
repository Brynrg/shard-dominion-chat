import type { GameStateType } from '../core/GameState';
import type { Position, Building } from '../core/types';
import { BuildingType } from '../core/types';

export interface PowerSource {
    id: string;
    type: BuildingType;
    position: Position;
    powerOutput: number;
    powerConsumption: number;
    isActive: boolean;
}

export class PowerSystem {
    private gameState: GameStateType;
    private powerSources: PowerSource[] = [];
    private totalPowerOutput: number = 0;
    private totalPowerConsumption: number = 0;

    constructor(gameState: GameStateType) {
        this.gameState = gameState;
    }

    setGameState(gameState: GameStateType): void {
        this.gameState = gameState;
    }

    addPowerSource(source: PowerSource): void {
        this.powerSources.push(source);
        this.calculateTotalPower();
    }

    removePowerSource(sourceId: string): void {
        this.powerSources = this.powerSources.filter(s => s.id !== sourceId);
        this.calculateTotalPower();
    }

    private calculateTotalPower(): void {
        this.totalPowerOutput = this.powerSources
            .filter(s => s.isActive)
            .reduce((sum, source) => sum + source.powerOutput, 0);

        this.totalPowerConsumption = this.powerSources
            .reduce((sum, source) => sum + source.powerConsumption, 0);
    }

    getTotalPowerOutput(): number {
        return this.totalPowerOutput;
    }

    getTotalPowerConsumption(): number {
        return this.totalPowerConsumption;
    }

    getPowerSurplus(): number {
        return this.totalPowerOutput - this.totalPowerConsumption;
    }

    hasPower(): boolean {
        return this.totalPowerOutput > 0;
    }

    isPowerAvailable(requiredPower: number = 0): boolean {
        return this.totalPowerOutput >= requiredPower;
    }

    updatePowerSources(): void {
        const buildings = this.gameState.buildings;
        const activeSources = new Set<string>();

        buildings.forEach(building => {
            if (!building.isDead) {
                activeSources.add(building.id);
            }
        });

        this.powerSources.forEach(source => {
            source.isActive = activeSources.has(source.id);
        });

        this.calculateTotalPower();
    }

    updatePowerConsumption(increase: number = 0): void {
        this.totalPowerConsumption += increase;
        this.calculateTotalPower();
    }

    updatePowerProduction(increase: number = 0): void {
        this.totalPowerOutput += increase;
        this.calculateTotalPower();
    }

    getPowerSources(): PowerSource[] {
        return [...this.powerSources];
    }

    getPowerStatus(): {
        totalOutput: number;
        totalConsumption: number;
        surplus: number;
        sources: PowerSource[];
    } {
        return {
            totalOutput: this.totalPowerOutput,
            totalConsumption: this.totalPowerConsumption,
            surplus: this.getPowerSurplus(),
            sources: this.getPowerSources()
        };
    }

    addPowerFromBuilding(building: Building): void {
        const powerType = this.getBuildingPowerType(building.type);
        if (powerType.output > 0) {
            this.powerSources.push({
                id: building.id,
                type: building.type,
                position: building.position,
                powerOutput: powerType.output,
                powerConsumption: powerType.consumption,
                isActive: !building.isDead
            });
            this.updatePowerProduction(powerType.output);
        }
    }

    private getBuildingPowerType(type: BuildingType): { output: number; consumption: number } {
        switch (type) {
            case BuildingType.POWER_NODE:
                return { output: 50, consumption: 5 };
            case BuildingType.PROCESSOR:
                return { output: 0, consumption: 10 };
            case BuildingType.FORGE:
                return { output: 0, consumption: 15 };
            case BuildingType.TURRET:
                return { output: 0, consumption: 5 };
            case BuildingType.COMMAND_CENTER:
                return { output: 0, consumption: 20 };
            default:
                return { output: 0, consumption: 0 };
        }
    }

    initializeFromBuildings(): void {
        this.powerSources = [];
        this.totalPowerOutput = 0;
        this.totalPowerConsumption = 0;

        this.gameState.buildings.forEach(building => {
            this.addPowerFromBuilding(building);
        });
    }

    update(): void {
        this.updatePowerSources();
    }
}