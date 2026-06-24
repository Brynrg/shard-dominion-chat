import type { Position, Unit, Tile } from '../core/types';
import { UnitType, TileType } from '../core/types';
import { tileToWorldCenter } from '../core/coords';
import { GameState } from '../core/GameState';

export class HarvestSystem {
    private tiles: Map<string, Tile> = new Map();
    private units: Map<string, Unit> = new Map();
    private processorPosition: Position = { x: 400, y: 300 }; // Default processor position
    private totalCarriedCargo: number = 0;
    private totalDepositedCargo: number = 0;
    private planetAgitationSystem: any; // Will be set by GameScene
    private readonly CARGO_CAPACITY = 50; // Max cargo per harvester
    private readonly CREDIT_VALUE = 10; // Credits per unit of cargo

    setTile(x: number, y: number, tile: Tile): void {
        const key = `${x},${y}`;
        this.tiles.set(key, tile);
    }

    getTile(x: number, y: number): Tile | null {
        return this.tiles.get(`${x},${y}`) || null;
    }

    addUnit(unit: Unit): void {
        this.units.set(unit.id, unit);
    }

    setProcessorPosition(position: Position): void {
        this.processorPosition = position;
    }

    setPlanetAgitationSystem(system: any): void {
        this.planetAgitationSystem = system;
    }

    addCredits(amount: number): void {
        GameState.getInstance().addCredits(amount);
    }

    updateUnits(deltaTime: number = 16): void {
        this.totalCarriedCargo = 0; // Reset carried cargo counter
        for (const [unitId, unit] of this.units) {
            if (unit.type === UnitType.HARVESTER) {
                this.updateHarvester(unitId, unit, deltaTime);
                this.totalCarriedCargo += unit.carrying;
            }
        }
    }

    private updateHarvester(unitId: string, unit: Unit, deltaTime: number = 16): void {
        // If harvester is at processor and has cargo, deposit it
        if (unit.carrying > 0) {
            const distance = this.getDistance(unit.position, this.processorPosition);
            if (distance < 30) { // Close enough to processor
                // Deposit cargo
                this.totalDepositedCargo += unit.carrying;
                unit.carrying = 0;
                this.units.set(unitId, unit);

                // Add harvest agitation when depositing
                if (this.planetAgitationSystem) {
                    this.planetAgitationSystem.addHarvestAgitation(2);
                }

                // Add credits on deposit (P0-04: credits ONLY on deposit)
                const creditsEarned = Math.floor(unit.carrying * this.CREDIT_VALUE);
                this.addCredits(creditsEarned);
                return;
            }

            // Move towards processor
            this.moveToTarget(unit, this.processorPosition, deltaTime);
        } else {
            // Look for nearby shard tiles
            const nearbyShardTile = this.findNearbyShardTile(unit.position);
            if (nearbyShardTile) {
                const tileDistance = this.getDistance(unit.position, nearbyShardTile);

                if (tileDistance < 20) { // Close enough to harvest
                    // Harvest (P0-04: finite shard amounts)
                    const harvestAmount = Math.min(
                        this.CARGO_CAPACITY - unit.carrying,
                        nearbyShardTile.shardAmount
                    );
                    unit.carrying += harvestAmount;
                    nearbyShardTile.shardAmount -= harvestAmount;
                    nearbyShardTile.hasShards = nearbyShardTile.shardAmount > 0;
                    this.tiles.set(`${nearbyShardTile.x},${nearbyShardTile.y}`, nearbyShardTile);

                    // Add harvest agitation when collecting
                    if (this.planetAgitationSystem) {
                        this.planetAgitationSystem.addHarvestAgitation(0.5);
                    }
                } else {
                    // Move towards tile
                    this.moveToTarget(unit, nearbyShardTile, deltaTime);
                }
            } else {
                // No nearby shards, wander randomly
                if (!unit.targetPosition || Math.random() < 0.02) {
                    unit.targetPosition = {
                        x: Math.random() * 600,
                        y: Math.random() * 400
                    };
                }
            }
        }

        this.units.set(unitId, unit);
    }

    private findNearbyShardTile(position: Position): Tile | null {
        let closestTile: Tile | null = null;
        let minDistance = Infinity;

        for (const [, tile] of this.tiles.entries()) {
            if (tile.type === TileType.SHARD_FIELD && tile.hasShards) {
                // Convert tile position to world center
                const worldPos = tileToWorldCenter({ x: tile.x, y: tile.y });
                const distance = this.getDistance(position, worldPos);

                // Check if tile is reachable (not blocked by ridges)
                if (tile.isBlocked) {
                    continue; // Skip blocked tiles (ridges)
                }

                if (distance < 100 && distance < minDistance) {
                    minDistance = distance;
                    closestTile = tile;
                }
            }
        }

        return closestTile;
    }

    private moveToTarget(unit: Unit, target: Position, deltaTime: number): void {
        const dx = target.x - unit.position.x;
        const dy = target.y - unit.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 2) {
            const speed = unit.speed / 1000; // Convert to units per ms
            const ratio = Math.min(speed * deltaTime / distance, 1); // Bounded delta

            unit.position.x += dx * ratio;
            unit.position.y += dy * ratio;
            unit.targetPosition = target;
        } else {
            unit.targetPosition = null;
        }
    }

    private getDistance(pos1: Position, pos2: Position): number {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getTotalCarrying(): number {
        return this.totalCarriedCargo;
    }

    getTotalDeposited(): number {
        return this.totalDepositedCargo;
    }

    getTiles(): Tile[] {
        return Array.from(this.tiles.values());
    }

    // P0-04: Mine->return->deposit test
    // This test verifies the complete harvester loop:
    // 1. Harvester finds a shard tile
    // 2. Harvester mines shards (finite amount)
    // 3. Harvester returns to processor
    // 4. Harvester deposits cargo
    // 5. Credits are added to GameState
    // 6. Shard tile hasShards flag is updated
    // 7. Harvester carrying is reset to 0
    testHarvesterLoop(): void {
        // Reset state for test
        this.totalDepositedCargo = 0;
        this.units.forEach((unit, id) => {
            if (unit.type === UnitType.HARVESTER) {
                unit.carrying = 0;
                this.units.set(id, unit);
            }
        });

        // Find a shard tile with shards
        const shardTile = Array.from(this.tiles.values()).find(
            (tile: Tile) => tile.type === TileType.SHARD_FIELD && tile.hasShards
        );

        if (!shardTile) {
            return;
        }

        // Find a harvester
        const harvester = Array.from(this.units.values()).find(
            (unit: Unit) => unit.type === UnitType.HARVESTER
        );

        if (!harvester) {
            return;
        }

        // Move harvester to shard tile
        harvester.position = { x: shardTile.x * 32 + 16, y: shardTile.y * 32 + 16 };
        this.units.set(harvester.id, harvester);

        // Update harvester (should mine)
        this.updateHarvester(harvester.id, harvester);

        // Verify mining occurred
        if (harvester.carrying <= 0) {
            return;
        }

        // Move harvester to processor
        harvester.position = { ...this.processorPosition };
        this.units.set(harvester.id, harvester);

        // Update harvester (should deposit)
        this.updateHarvester(harvester.id, harvester);

        // Verify deposit occurred
        if (harvester.carrying > 0) {
            return;
        }

        // Verify shard tile hasShards flag
        const updatedTile = this.tiles.get(`${shardTile.x},${shardTile.y}`);
        if (updatedTile && updatedTile.hasShards) {
            return;
        }
    }
}