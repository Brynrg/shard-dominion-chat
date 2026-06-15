import { type Unit } from '../core/types';
import { PathfindingSystem } from './PathfindingSystem';
import { GameState } from '../core/GameState';

export class MovementSystem {
    private pathfinding: PathfindingSystem = new PathfindingSystem();
    private planetAgitationSystem: any; // Will be set by GameScene

    setPathfinding(pathfinding: PathfindingSystem): void {
        this.pathfinding = pathfinding;
    }

    setPlanetAgitationSystem(system: any): void {
        this.planetAgitationSystem = system;
    }

    moveUnits(units: Unit[], deltaTime: number): void {
        const state = GameState.getInstance();
        const moveQueue = state.getMoveQueue();

        // Process queued moves first
        for (const queueItem of moveQueue) {
            const unit = units.find(u => u.id === queueItem.unitId);
            if (unit && !unit.targetPosition) {
                unit.targetPosition = queueItem.target;
            }
        }

        // Clear processed queue items
        state.clearMoveQueue();

        // Move units
        for (const unit of units) {
            if (unit.targetPosition) {
                // Find path to target
                const path = this.pathfinding.findPath(unit.position, unit.targetPosition);

                if (path.length > 0) {
                    // Move along the path - add movement agitation
                    if (this.planetAgitationSystem) {
                        this.planetAgitationSystem.addMovementAgitation();
                    }

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
                    } else {
                        // Reached next tile, move to next in path
                        path.shift();
                        if (path.length > 0) {
                            const nextTile = path[0];
                            unit.position.x = nextTile.x;
                            unit.position.y = nextTile.y;
                        } else {
                            // Reached target
                            unit.targetPosition = null;
                        }
                    }
                } else {
                    // No path found, stay at current position
                    unit.targetPosition = null;
                }
            }
        }
    }

    getUnits(): Unit[] {
        // This method is kept for compatibility but units are now managed externally
        return [];
    }

    getUnit(_unitId: string): Unit | undefined {
        // This method is kept for compatibility but units are now managed externally
        return undefined;
    }
}