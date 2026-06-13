import { type Unit } from '../core/types';
import { PathfindingSystem } from './PathfindingSystem';

export class MovementSystem {
    private units: Map<string, Unit> = new Map();
    private pathfinding: PathfindingSystem = new PathfindingSystem();

    addUnit(unit: Unit): void {
        this.units.set(unit.id, { ...unit });
    }

    updateUnit(unitId: string, updates: Partial<Unit>): void {
        const unit = this.units.get(unitId);
        if (unit) {
            Object.assign(unit, updates);
            this.units.set(unitId, unit);
        }
    }

    setPathfinding(pathfinding: PathfindingSystem): void {
        this.pathfinding = pathfinding;
    }

    moveUnits(deltaTime: number): void {
        for (const [unitId, unit] of this.units) {
            if (unit.targetPosition) {
                // Find path to target
                const path = this.pathfinding.findPath(unit.position, unit.targetPosition);

                if (path.length > 0) {
                    // Move along the path
                    const nextTile = path[0];
                    const dx = nextTile.x - unit.position.x;
                    const dy = nextTile.y - unit.position.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance > 0.5) { // Close enough to next tile
                        const moveDistance = unit.speed * deltaTime / 1000;
                        const ratio = Math.min(moveDistance / distance, 1);

                        unit.position.x += dx * ratio;
                        unit.position.y += dy * ratio;

                        // Update the unit in the map
                        this.units.set(unitId, unit);
                    } else {
                        // Reached next tile, move to next in path
                        path.shift();
                        if (path.length > 0) {
                            const nextTile = path[0];
                            unit.position.x = nextTile.x;
                            unit.position.y = nextTile.y;
                            this.units.set(unitId, unit);
                        } else {
                            // Reached target
                            unit.targetPosition = null;
                            this.units.set(unitId, unit);
                        }
                    }
                } else {
                    // No path found, stay at current position
                    unit.targetPosition = null;
                    this.units.set(unitId, unit);
                }
            }
        }
    }

    getUnits(): Unit[] {
        return Array.from(this.units.values());
    }

    getUnit(unitId: string): Unit | undefined {
        return this.units.get(unitId);
    }
}