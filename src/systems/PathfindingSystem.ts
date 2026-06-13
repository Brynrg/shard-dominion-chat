import { type Position, type Tile } from '../core/types';

export class PathfindingSystem {
    private tiles: Tile[][] = [];

    setTiles(tiles: Tile[][]): void {
        this.tiles = tiles;
    }

    findPath(start: Position, end: Position): Position[] {
        const startX = Math.floor(start.x);
        const startY = Math.floor(start.y);
        const endX = Math.floor(end.x);
        const endY = Math.floor(end.y);

        // Check bounds
        if (startX < 0 || startX >= this.tiles[0].length ||
            startY < 0 || startY >= this.tiles.length ||
            endX < 0 || endX >= this.tiles[0].length ||
            endY < 0 || endY >= this.tiles.length) {
            return [];
        }

        // Check if end tile is blocked
        if (this.tiles[endY][endX].isBlocked) {
            return [];
        }

        // A* algorithm
        const openSet: Array<{ x: number; y: number; f: number; g: number; parent?: { x: number; y: number } }> = [];
        const closedSet = new Set<string>();
        const cameFrom = new Map<string, { x: number; y: number }>();
        const gScore = new Map<string, number>();
        const fScore = new Map<string, number>();

        const startKey = `${startX},${startY}`;

        gScore.set(startKey, 0);
        fScore.set(startKey, this.heuristic(startX, startY, endX, endY));
        openSet.push({ x: startX, y: startY, f: fScore.get(startKey)!, g: 0 });

        while (openSet.length > 0) {
            // Get node with lowest f score
            openSet.sort((a, b) => a.f - b.f);
            const current = openSet.shift()!;

            const currentKey = `${current.x},${current.y}`;

            // Check if we reached the goal
            if (current.x === endX && current.y === endY) {
                return this.reconstructPath(cameFrom, current);
            }

            closedSet.add(currentKey);

            // Check neighbors
            const neighbors = this.getNeighbors(current.x, current.y);
            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.x},${neighbor.y}`;

                if (closedSet.has(neighborKey)) {
                    continue;
                }

                const tentativeG = gScore.get(currentKey)! + this.tiles[neighbor.y][neighbor.x].cost;

                if (!gScore.has(neighborKey) || tentativeG < gScore.get(neighborKey)!) {
                    cameFrom.set(neighborKey, current);
                    gScore.set(neighborKey, tentativeG);
                    const f = tentativeG + this.heuristic(neighbor.x, neighbor.y, endX, endY);
                    fScore.set(neighborKey, f);

                    // Check if neighbor is already in open set
                    const existing = openSet.find(n => n.x === neighbor.x && n.y === neighbor.y);
                    if (existing) {
                        existing.f = f;
                        existing.g = tentativeG;
                    } else {
                        openSet.push({ x: neighbor.x, y: neighbor.y, f, g: tentativeG });
                    }
                }
            }
        }

        // No path found
        return [];
    }

    private getNeighbors(x: number, y: number): Position[] {
        const neighbors: Position[] = [];
        const directions = [
            { dx: 0, dy: -1 }, // up
            { dx: 0, dy: 1 },  // down
            { dx: -1, dy: 0 }, // left
            { dx: 1, dy: 0 }   // right
        ];

        for (const dir of directions) {
            const nx = x + dir.dx;
            const ny = y + dir.dy;

            if (nx >= 0 && nx < this.tiles[0].length &&
                ny >= 0 && ny < this.tiles.length &&
                !this.tiles[ny][nx].isBlocked) {
                neighbors.push({ x: nx, y: ny });
            }
        }

        return neighbors;
    }

    private heuristic(x1: number, y1: number, x2: number, y2: number): number {
        // Manhattan distance
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    private reconstructPath(
        cameFrom: Map<string, { x: number; y: number }>,
        current: { x: number; y: number }
    ): Position[] {
        const path: Position[] = [];
        let currentKey = `${current.x},${current.y}`;

        while (cameFrom.has(currentKey)) {
            path.unshift({ x: current.x, y: current.y });
            const parent = cameFrom.get(currentKey)!;
            currentKey = `${parent.x},${parent.y}`;
        }

        return path;
    }
}