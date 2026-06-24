import { GameState } from '../core/GameState';
import type { Building } from '../core/types';
import type { ProductionQueueItem } from '../core/GameState';
import type { GameStateType } from '../core/GameState';

export interface ProductionData {
    unitType: string;
    buildTime: number;
    cost: number;
    powerCost: number;
    prerequisites: string[];
    techUnlocks?: string[];
    rallyPoint?: { x: number; y: number };
}

export class ProductionSystem {
    private productionData: Map<string, ProductionData> = new Map();
    private queues: Map<string, ProductionQueueItem[]> = new Map();

    constructor() {
        this.initializeProductionData();
    }

    private initializeProductionData(): void {
        // Barracks production
        this.productionData.set('scout', {
            unitType: 'scout',
            buildTime: 10,
            cost: 50,
            powerCost: 5,
            prerequisites: ['barracks'],
            rallyPoint: { x: 0, y: 0 }
        });

        this.productionData.set('raider', {
            unitType: 'raider',
            buildTime: 15,
            cost: 80,
            powerCost: 8,
            prerequisites: ['barracks'],
            rallyPoint: { x: 0, y: 0 }
        });

        // Factory production
        this.productionData.set('commander', {
            unitType: 'commander',
            buildTime: 30,
            cost: 200,
            powerCost: 20,
            prerequisites: ['factory'],
            rallyPoint: { x: 0, y: 0 }
        });
    }

    update(_deltaTime: number): void {
        // TODO: implement production queue updates
    }

    addToQueue(
        state: GameStateType,
        buildingId: string,
        unitType: string,
        rallyPoint?: { x: number; y: number }
    ): boolean {
        const building = state.buildings.find((b: Building) => b.id === buildingId);
        if (!building) return false;

        // Check if building can produce
        if (building.type !== 'barracks' && building.type !== 'factory') {
            return false;
        }

        // Get production data
        const data = this.productionData.get(unitType);
        if (!data) return false;

        // Check prerequisites
        if (!this.checkPrerequisites(data.prerequisites)) {
            return false;
        }

        // Check tech unlocks
        if (data.techUnlocks) {
            for (const tech of data.techUnlocks) {
                if (!this.hasTechUnlocked(tech)) {
                    return false;
                }
            }
        }

        // Check power
        if (data.powerCost > state.power) {
            return false;
        }

        // Check credits
        if (data.cost > state.credits) {
            return false;
        }

        // Deduct cost
        state.credits -= data.cost;
        state.power -= data.powerCost;

        // Add to queue
        if (!this.queues.has(buildingId)) {
            this.queues.set(buildingId, []);
        }

        this.queues.get(buildingId)!.push({
            unitType,
            unitId: buildingId,
            buildingId,
            progress: 0,
            buildTime: data.buildTime,
            isComplete: false,
            rallyPoint: rallyPoint || building.position
        });

        return true;
    }

    private checkPrerequisites(prerequisites: string[]): boolean {
        for (const prereq of prerequisites) {
            const gameState = GameState.getInstance();
            const hasBuilding = gameState.getState().buildings.some((b: Building) => b.type === prereq);
            if (!hasBuilding) return false;
        }
        return true;
    }

    private hasTechUnlocked(tech: string): boolean {
        // Check if any building has the tech flag
        const gameState = GameState.getInstance();
        return gameState.getState().buildings.some((b: Building) => b.type === tech);
    }

    removeFromQueue(buildingId: string, index: number): boolean {
        const queue = this.queues.get(buildingId);
        if (!queue || index < 0 || index >= queue.length) return false;

        const item = queue[index];
        if (item.isComplete) return false;

        // Refund cost
        const data = this.productionData.get(item.unitType);
        if (data) {
            const gameState = GameState.getInstance();
            gameState.addCredits(data.cost);
            gameState.addPower(data.powerCost);
        }

        queue.splice(index, 1);
        if (queue.length === 0) {
            this.queues.delete(buildingId);
        }

        return true;
    }

    cancelQueue(buildingId: string): boolean {
        const queue = this.queues.get(buildingId);
        if (!queue) return false;

        // Refund all items
        queue.forEach(item => {
            const data = this.productionData.get(item.unitType);
            if (data) {
                const gameState = GameState.getInstance();
                gameState.addCredits(data.cost);
                gameState.addPower(data.powerCost);
            }
        });

        this.queues.delete(buildingId);
        return true;
    }

    getQueue(buildingId: string): ProductionQueueItem[] | undefined {
        return this.queues.get(buildingId);
    }

    getQueues(): Map<string, ProductionQueueItem[]> {
        return this.queues;
    }
}