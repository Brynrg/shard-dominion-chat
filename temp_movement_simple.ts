import type { Position } from "../core/types";

export class MovementSystem {
    private pathfinding: PathfindingSystem = new PathfindingSystem();
    private planetAgitationSystem: any; // Will be set by GameScene

    setPathfinding(pathfinding: PathfindingSystem): void {
        this.pathfinding = pathfinding;
    }

    setPlanetAgitationSystem(system: any): void {
        this.planetAgitationSystem = system;
    }
}
