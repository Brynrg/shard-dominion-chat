import type { GameStateType } from '../core/GameState';
import type { Building, Position } from '../core/types';
import { BuildingType } from '../core/types';

export class ShardBloomSystem {
    private gameState: GameStateType;

    constructor(gameState: GameStateType) {
        this.gameState = gameState;
    }

    setGameState(gameState: GameStateType): void {
        this.gameState = gameState;
    }

    // Check if shard bloom is active
    isShardBloomActive(): boolean {
        const mission = this.gameState.mission;
        if (!mission) return false;

        return mission.shardBloomActive;
    }

    // Activate shard bloom
    activateShardBloom(): void {
        const mission = this.gameState.mission;
        if (mission) {
            mission.shardBloomActive = true;
        }
    }

    // Deactivate shard bloom
    deactivateShardBloom(): void {
        const mission = this.gameState.mission;
        if (mission) {
            mission.shardBloomActive = false;
        }
    }

    // Check if forge raid is active
    isForgeRaidActive(): boolean {
        const mission = this.gameState.mission;
        if (!mission) return false;

        return mission.forgeRaidActive;
    }

    // Activate forge raid
    activateForgeRaid(): void {
        const mission = this.gameState.mission;
        if (mission) {
            mission.forgeRaidActive = true;
        }
    }

    // Deactivate forge raid
    deactivateForgeRaid(): void {
        const mission = this.gameState.mission;
        if (mission) {
            mission.forgeRaidActive = false;
        }
    }

    // Get nearest forge
    getNearestForge(position: Position): Building | null {
        const forges = this.gameState.buildings.filter(
            b => b.type === BuildingType.FORGE && !b.isDead
        );

        if (forges.length === 0) return null;

        let nearestForge: Building | null = null;
        let nearestDist = Infinity;

        forges.forEach(forge => {
            const dx = forge.position.x - position.x;
            const dy = forge.position.y - position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < nearestDist) {
                nearestDist = dist;
                nearestForge = forge;
            }
        });

        return nearestForge;
    }

    // Get nearest anchor lattice
    getNearestAnchorLattice(position: Position): Building | null {
        const anchorLattices = this.gameState.buildings.filter(
            b => b.type === BuildingType.ANCHOR_LATTICE && !b.isDead
        );

        if (anchorLattices.length === 0) return null;

        let nearestAnchor: Building | null = null;
        let nearestDist = Infinity;

        anchorLattices.forEach(anchor => {
            const dx = anchor.position.x - position.x;
            const dy = anchor.position.y - position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < nearestDist) {
                nearestDist = dist;
                nearestAnchor = anchor;
            }
        });

        return nearestAnchor;
    }

    // Get nearest power node
    getNearestPowerNode(position: Position): Building | null {
        const powerNodes = this.gameState.buildings.filter(
            b => b.type === BuildingType.POWER_NODE && !b.isDead
        );

        if (powerNodes.length === 0) return null;

        let nearestPowerNode: Building | null = null;
        let nearestDist = Infinity;

        powerNodes.forEach(powerNode => {
            const dx = powerNode.position.x - position.x;
            const dy = powerNode.position.y - position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < nearestDist) {
                nearestDist = dist;
                nearestPowerNode = powerNode;
            }
        });

        return nearestPowerNode;
    }

    // Check if position is within build radius of command center
    isWithinBuildRadius(position: Position, radius: number): boolean {
        const commandCenter = this.gameState.buildings.find(
            b => b.type === BuildingType.COMMAND_CENTER && !b.isDead
        );

        if (!commandCenter) return false;

        const dx = position.x - commandCenter.position.x;
        const dy = position.y - commandCenter.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        return dist <= radius;
    }

    // Get all forges
    getForges(): Building[] {
        return this.gameState.buildings.filter(
            b => b.type === BuildingType.FORGE && !b.isDead
        );
    }

    // Get all anchor lattices
    getAnchorLattices(): Building[] {
        return this.gameState.buildings.filter(
            b => b.type === BuildingType.ANCHOR_LATTICE && !b.isDead
        );
    }

    // Get all power nodes
    getPowerNodes(): Building[] {
        return this.gameState.buildings.filter(
            b => b.type === BuildingType.POWER_NODE && !b.isDead
        );
    }

    // Get total power output
    getTotalPowerOutput(): number {
        return this.gameState.power;
    }

    // Get total power capacity
    getTotalPowerCapacity(): number {
        return this.gameState.maxPower;
    }

    // Get power deficit
    getPowerDeficit(): number {
        return Math.max(0, this.gameState.maxPower - this.gameState.power);
    }

    // Get power surplus
    getPowerSurplus(): number {
        return Math.max(0, this.gameState.power - this.gameState.maxPower);
    }
}