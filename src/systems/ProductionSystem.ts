import type { GameState } from '../core/GameState';
import type { Position, Unit } from '../core/types';
import { UnitType } from '../core/types';
import { BuildingType } from '../core/types';

export interface ProductionQueueItem {
    id: string;
    type: UnitType;
    producerId: string;
    position: Position;
    progress: number;
    cost: number;
    timeRequired: number;
}

export interface ProductionCapability {
    buildingType: BuildingType;
    canProduce: UnitType[];
    productionSpeed: number;
}

export class ProductionSystem {
    private gameState: GameState;
    private productionQueue: ProductionQueueItem[] = [];
    private productionCapabilities: Map<BuildingType, ProductionCapability> = new Map();

    constructor(gameState: GameState) {
        this.gameState = gameState;
        this.initializeProductionCapabilities();
    }

    setGameState(gameState: GameState): void {
        this.gameState = gameState;
    }

    private initializeProductionCapabilities(): void {
        // Each building type's production capabilities
        this.productionCapabilities.set(BuildingType.FORGE, {
            buildingType: BuildingType.FORGE,
            canProduce: [UnitType.HARVESTER, UnitType.SCOUT, UnitType.COMMANDER],
            productionSpeed: 1.0
        });

        this.productionCapabilities.set(BuildingType.COMMAND_CENTER, {
            buildingType: BuildingType.COMMAND_CENTER,
            canProduce: [UnitType.COMMANDER, UnitType.SCOUT],
            productionSpeed: 0.8
        });

        this.productionCapabilities.set(BuildingType.PROCESSOR, {
            buildingType: BuildingType.PROCESSOR,
            canProduce: [UnitType.HARVESTER],
            productionSpeed: 1.2
        });
    }

    addToProductionQueue(buildingId: string, unitType: UnitType, position: Position = { x: 0, y: 0 }): boolean {
        const building = this.gameState.getState().buildings.find(b => b.id === buildingId);
        if (!building) return false;

        const capability = this.productionCapabilities.get(building.type);
        if (!capability || !capability.canProduce.includes(unitType)) return false;

        // Check if building has power
        if (!building.isPowered) return false;

        // Check player has enough credits
        const unitCost = this.getUnitCost(unitType);
        if (this.gameState.getState().credits < unitCost) return false;

        // Deduct cost
        this.gameState.getState().credits -= unitCost;

        // Add to queue
        const queueItem: ProductionQueueItem = {
            id: `${buildingId}-${unitType}-${Date.now()}`,
            type: unitType,
            producerId: buildingId,
            position: position,
            progress: 0,
            cost: unitCost,
            timeRequired: this.getProductionTime(unitType)
        };

        this.productionQueue.push(queueItem);
        return true;
    }

    private getProductionTime(unitType: UnitType): number {
        switch (unitType) {
            case UnitType.HARVESTER:
                return 3000; // 3 seconds
            case UnitType.SCOUT:
                return 2000; // 2 seconds
            case UnitType.COMMANDER:
                return 4000; // 4 seconds
            default:
                return 3000;
        }
    }

    private getUnitCost(unitType: UnitType): number {
        switch (unitType) {
            case UnitType.HARVESTER:
                return 50;
            case UnitType.SCOUT:
                return 75;
            case UnitType.COMMANDER:
                return 100;
            default:
                return 50;
        }
    }

    updateProductionQueue(deltaTime: number): void {
        for (let i = this.productionQueue.length - 1; i >= 0; i--) {
            const item = this.productionQueue[i];
            item.progress += deltaTime;

            if (item.progress >= item.timeRequired) {
                // Production complete, create unit
                this.createUnit(item);
                this.productionQueue.splice(i, 1);
            }
        }
    }

    private createUnit(productionItem: ProductionQueueItem): void {
        const producerBuilding = this.gameState.getState().buildings.find(b => b.id === productionItem.producerId);
        if (!producerBuilding) return;

        const unit: Unit = {
            id: `unit-${Date.now()}-${Math.random()}`,
            type: productionItem.type,
            position: { 
                x: producerBuilding.position.x + Math.random() * 40 - 20,
                y: producerBuilding.position.y + Math.random() * 40 - 20
            },
            targetPosition: null,
            speed: this.getUnitSpeed(productionItem.type),
            carrying: 0,
            maxCarrying: this.getUnitMaxCarrying(productionItem.type),
            faction: 'vanguard',
            isSelected: false,
            visionRadius: this.getUnitVisionRadius(productionItem.type),
            hp: this.getUnitMaxHp(productionItem.type),
            maxHp: this.getUnitMaxHp(productionItem.type),
            isDead: false,
            attackRange: this.getUnitAttackRange(productionItem.type),
            attackDamage: this.getUnitAttackDamage(productionItem.type),
            attackCooldown: this.getUnitAttackCooldown(productionItem.type),
            lastAttackTime: 0
        };

        this.gameState.addUnit(unit);
    }

    private getUnitSpeed(unitType: UnitType): number {
        switch (unitType) {
            case UnitType.HARVESTER:
                return 30;
            case UnitType.SCOUT:
                return 50;
            case UnitType.COMMANDER:
                return 40;
            default:
                return 40;
        }
    }

    private getUnitMaxCarrying(unitType: UnitType): number {
        switch (unitType) {
            case UnitType.HARVESTER:
                return 100;
            default:
                return 0;
        }
    }

    private getUnitVisionRadius(unitType: UnitType): number {
        switch (unitType) {
            case UnitType.HARVESTER:
                return 5;
            case UnitType.SCOUT:
                return 8;
            case UnitType.COMMANDER:
                return 6;
            default:
                return 5;
        }
    }

    private getUnitMaxHp(unitType: UnitType): number {
        switch (unitType) {
            case UnitType.HARVESTER:
                return 100;
            case UnitType.SCOUT:
                return 80;
            case UnitType.COMMANDER:
                return 120;
            default:
                return 100;
        }
    }

    private getUnitAttackRange(unitType: UnitType): number {
        switch (unitType) {
            case UnitType.HARVESTER:
                return 0;
            case UnitType.SCOUT:
                return 80;
            case UnitType.COMMANDER:
                return 60;
            default:
                return 0;
        }
    }

    private getUnitAttackDamage(unitType: UnitType): number {
        switch (unitType) {
            case UnitType.HARVESTER:
                return 0;
            case UnitType.SCOUT:
                return 10;
            case UnitType.COMMANDER:
                return 15;
            default:
                return 0;
        }
    }

    private getUnitAttackCooldown(unitType: UnitType): number {
        switch (unitType) {
            case UnitType.HARVESTER:
                return 0;
            case UnitType.SCOUT:
                return 1000;
            case UnitType.COMMANDER:
                return 1500;
            default:
                return 0;
        }
    }

    canProduce(buildingId: string, unitType: UnitType): boolean {
        const building = this.gameState.getState().buildings.find(b => b.id === buildingId);
        if (!building) return false;

        const capability = this.productionCapabilities.get(building.type);
        return capability ? capability.canProduce.includes(unitType) : false;
    }

    getProductionQueue(): ProductionQueueItem[] {
        return [...this.productionQueue];
    }

    getQueueLength(): number {
        return this.productionQueue.length;
    }

    clearProductionQueue(): void {
        this.productionQueue = [];
    }

    getQueueProgress(buildingId: string, unitType: UnitType): number {
        const item = this.productionQueue.find(i => 
            i.producerId === buildingId && i.type === unitType
        );
        return item ? item.progress : 0;
    }

    getQueueProgressPercentage(buildingId: string, unitType: UnitType): number {
        const timeRequired = this.getProductionTime(unitType);
        const progress = this.getQueueProgress(buildingId, unitType);
        return timeRequired > 0 ? (progress / timeRequired) * 100 : 0;
    }

    getProductionStatus(): {
        queue: ProductionQueueItem[];
        queueLength: number;
        buildingStatus: { [buildingId: string]: { canProduce: UnitType[]; currentQueue: ProductionQueueItem[] } };
    } {
        const buildingStatus: { [buildingId: string]: { canProduce: UnitType[]; currentQueue: ProductionQueueItem[] } } = {};

        this.gameState.getState().buildings.forEach(building => {
            const capability = this.productionCapabilities.get(building.type);
            buildingStatus[building.id] = {
                canProduce: capability ? capability.canProduce : [],
                currentQueue: this.productionQueue.filter(item => item.producerId === building.id)
            };
        });

        return {
            queue: this.productionQueue,
            queueLength: this.getQueueLength(),
            buildingStatus
        };
    }
}