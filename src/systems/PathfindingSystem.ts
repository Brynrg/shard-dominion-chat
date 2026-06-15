import { type Position, type Tile } from '../core/types';
import { worldToTile, tileToWorldCenter } from '../core/coords';

export class PathfindingSystem {
    private tiles: Tile[][] = [];

    setTiles(tiles: Tile[][]): void {
        this.tiles = tiles;
    }

    findPath(start: Position, end: Position): Position[] {
        const startTile = worldToTile(start);
        const endTile = worldToTile(end);

        // Check bounds
        if (!this.isTileValid(startTile) || !this.isTileValid(endTile)) {
            return [];
        }

        // Check if end tile is blocked
        if (this.tiles[endTile.y][endTile.x].isBlocked) {
            return [];
        }

        // A* algorithm
        const openSet: Array<{ x: number; y: number; f: number; g: number; parent?: { x: number; y: number } }> = [];
        const closedSet = new Set<string>();
        const cameFrom = new Map<string, { x: number; y: number }>();
        const gScore = new Map<string, number>();
        const fScore = new Map<string, number>();

        const startKey = `${startTile.x},${startTile.y}`;

        gScore.set(startKey, 0);
        fScore.set(startKey, this.heuristic(startTile.x, startTile.y, endTile.x, endTile.y));
        openSet.push({ x: startTile.x, y: startTile.y, f: fScore.get(startKey)!, g: 0 });

        while (openSet.length > 0) {
            // Get node with lowest f score
            openSet.sort((a, b) => a.f - b.f);
            const current = openSet.shift()!;

            const currentKey = `${current.x},${current.y}`;

            // Check if we reached the goal
            if (current.x === endTile.x && current.y === endTile.y) {
                const path = this.reconstructPath(cameFrom, current);
                // Convert tile positions back to world positions (center of tiles)
                return path.map(tile => tileToWorldCenter(tile));
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
                    const f = tentativeG + this.heuristic(neighbor.x, neighbor.y, endTile.x, endTile.y);
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

    private isTileValid(tile: { x: number; y: number }): boolean {
        return tile.x >= 0 && tile.x < this.tiles[0].length &&
               tile.y >= 0 && tile.y < this.tiles.length;
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

            if (this.isTileValid({ x: nx, y: ny }) &&
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

        path.unshift({ x: current.x, y: current.y });
        while (cameFrom.has(currentKey)) {
            const parent = cameFrom.get(currentKey)!;
            path.unshift({ x: parent.x, y: parent.y });
            currentKey = `${parent.x},${parent.y}`;
        }

        return path;
    }
}