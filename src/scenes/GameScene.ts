import { Game } from 'speedrungames-sdk/game';
import { GameState } from '../core/GameState';
import type { Position } from '../core/types';
import { TileType } from '../core/types';
import { InputSystem } from '../systems/InputSystem';
import { MovementSystem } from '../systems/MovementSystem';
import { PathfindingSystem } from '../systems/PathfindingSystem';
import { HarvestSystem } from '../systems/HarvestSystem';
import { PlanetAgitationSystem } from '../systems/PlanetAgitationSystem';
import { Hud } from '../ui/Hud';
import { sampleBuildings } from '../data/sampleBuildings';
import { sampleUnits } from '../data/sampleUnits';
import { sampleTerrain } from '../data/sampleTerrain';

export class GameScene {
    private game: Game;
    private canvas: HTMLCanvasElement;
    private gameState: GameState;
    private _inputSystem: InputSystem;
    private movementSystem: MovementSystem;
    private pathfindingSystem: PathfindingSystem;
    private harvestSystem: HarvestSystem;
    private _planetAgitationSystem: PlanetAgitationSystem;
    private hud: Hud;
    private debugMode: boolean = false;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.game = new Game(canvas);
        this.gameState = GameState.getInstance();
        this.harvestSystem = new HarvestSystem();
        this._planetAgitationSystem = new PlanetAgitationSystem();

        // Initialize systems
        this._inputSystem = new InputSystem(canvas, this.handleAction.bind(this));
        this.movementSystem = new MovementSystem();
        this.pathfindingSystem = new PathfindingSystem();
        this.hud = new Hud(document.getElementById('app')!);

        this.initializeGame();
        this.setupEventListeners();
    }

    private initializeGame(): void {
        const state = this.gameState.getState();

        // Add sample data
        // Add buildings
        sampleBuildings.forEach(building => {
            this.gameState.addBuilding(building);
        });

        // Add units
        sampleUnits.forEach(unit => {
            this.gameState.addUnit(unit);
            this.movementSystem.addUnit(unit);
            this.harvestSystem.addUnit(unit);
        });

        // Add terrain
        sampleTerrain.forEach((row, y) => {
            row.forEach((tile, x) => {
                this.gameState.setTile(x, y, tile);
                this.harvestSystem.setTile(x, y, tile);
            });
        });

        // Set processor position for harvest system
        this.harvestSystem.setProcessorPosition({ x: 400, y: 300 });

        // Initialize pathfinding system
        this.pathfindingSystem.setTiles(state.tiles);

        // Initialize fog of war and minimap
        this.gameState.initializeFogOfWar();
        this.gameState.initializeMinimap();
    }

    private setupEventListeners(): void {
        // Debug toggle
        window.addEventListener('keydown', (e) => {
            if (e.key === 'd' || e.key === 'D') {
                this.debugMode = !this.debugMode;
            }
        });
    }

    private handleAction(action: any): void {
        switch (action.type) {
            case 'select':
                this.handleSelection(action.target);
                break;
            case 'move':
                this.handleMove(action.target);
                break;
        }
    }

    private handleMove(target: Position): void {
        const state = this.gameState.getState();
        const selectedUnits = state.selectedUnits;

        if (selectedUnits.length > 0) {
            selectedUnits.forEach(unitId => {
                const unit = state.units.find(u => u.id === unitId);
                if (unit) {
                    unit.targetPosition = { x: target.x, y: target.y };
                }
            });
        }
    }

    private handleSelection(target: Position): void {
        const state = this.gameState.getState();
        const units = state.units;
        
        // Simple selection: select first unit near click
        const selectedUnit = units.find(unit => {
            const dx = unit.position.x - target.x;
            const dy = unit.position.y - target.y;
            return Math.sqrt(dx * dx + dy * dy) < 30;
        });

        if (selectedUnit) {
            this.gameState.selectUnit(selectedUnit.id);
            selectedUnit.isSelected = true;
            units.forEach(unit => {
                unit.isSelected = unit.id === selectedUnit.id;
            });
        } else {
            // Clear selection
            units.forEach(unit => unit.isSelected = false);
            this.gameState.selectUnits([]);
        }
    }

    gameLoop = () => {
        // Update systems
        this.harvestSystem.updateUnits();
        this._planetAgitationSystem.update();

        // Update movement
        this.movementSystem.moveUnits(16);

        // Update fog of war
        this.gameState.updateFogOfWar();

        // Update HUD
        const state = this.gameState.getState();
        const totalCarrying = this.harvestSystem.getTotalCarrying();
        this.gameState.setCredits(100 + Math.floor(totalCarrying / 10));
        this.gameState.setPlanetAgitation(this._planetAgitationSystem.getCurrentAgitation());
        this.hud.update(state);

        // Debug overlay
        let debugInfo: any;
        if (this.debugMode) {
            debugInfo = {
                units: state.units.length,
                buildings: state.buildings.length,
                credits: state.credits,
                power: state.power,
                agitation: this._planetAgitationSystem.getAgitationPercentage() + '%',
                fogVisible: state.fogOfWar.visible.size,
                fogExplored: state.fogOfWar.explored.size
            };
            this.hud.setDebugInfo(debugInfo);
        }

        // Render
        this.render();

        // Continue game loop
        requestAnimationFrame(this.gameLoop);
    };

    private render(): void {
        const ctx = this.game.ctx;
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        // Clear canvas
        ctx.fillStyle = '#0b0b10';
        ctx.fillRect(0, 0, width, height);

        // Draw terrain - simplified for vertical slice
        this.renderTerrain(ctx, width, height);

        // Draw buildings
        this.renderBuildings(ctx);

        // Draw units
        this.renderUnits(ctx);

        // Draw processor
        this.renderProcessor(ctx);

        // Draw fog of war
        this.renderFogOfWar(ctx);

        // Draw minimap
        this.renderMinimap(ctx, width, height);
    }

    private renderTerrain(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const state = this.gameState.getState();
        const tileSize = 32;
        const cols = Math.ceil(width / tileSize);
        const rows = Math.ceil(height / tileSize);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                // Get actual tile data
                const tile = state.tiles[y]?.[x];
                if (!tile) continue;

                let color: string;
                switch (tile.type) {
                    case TileType.GRASS:
                        color = '#4a7c4e';
                        break;
                    case TileType.DIRT:
                        color = '#8b6f47';
                        break;
                    case TileType.STONE:
                        color = '#708090';
                        break;
                    case TileType.SHARD_FIELD:
                        color = '#9370db';
                        break;
                    case TileType.RIDGE:
                        color = '#555555';
                        break;
                    case TileType.DEEP_CRUST:
                        color = '#2d4a3e';
                        break;
                    default:
                        color = '#4a7c4e';
                }

                ctx.fillStyle = color;
                ctx.fillRect(x * tileSize, y * tileSize, tileSize - 1, tileSize - 1);

                // Debug overlay: show movement cost and worm risk
                if (this.debugMode) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                    ctx.font = '10px monospace';
                    ctx.textAlign = 'left';
                    ctx.fillText(`C:${tile.cost}`, x * tileSize + 2, y * tileSize + 12);
                    if (tile.wormRisk > 0) {
                        ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
                        ctx.fillText(`W:${tile.wormRisk.toFixed(1)}`, x * tileSize + 2, y * tileSize + 22);
                    }
                }
            }
        }
    }

    private renderBuildings(ctx: CanvasRenderingContext2D): void {
        const state = this.gameState.getState();

        state.buildings.forEach(building => {
            ctx.fillStyle = building.type === 'processor' ? '#4169e1' : '#228b22';
            ctx.fillRect(building.position.x, building.position.y, 40, 40);

            // Building label
            ctx.fillStyle = 'white';
            ctx.font = '12px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(building.type, building.position.x + 20, building.position.y + 25);
        });
    }

    private renderUnits(ctx: CanvasRenderingContext2D): void {
        const state = this.gameState.getState();

        state.units.forEach(unit => {
            // Unit body
            ctx.fillStyle = unit.isSelected ? '#ffff00' : '#87ceeb';
            ctx.beginPath();
            ctx.arc(unit.position.x, unit.position.y, 10, 0, Math.PI * 2);
            ctx.fill();

            // Harvester cargo indicator
            if (unit.type === 'harvester' && unit.carrying > 0) {
                ctx.fillStyle = '#ffd700';
                const cargoPercent = unit.carrying / unit.maxCarrying;
                ctx.fillRect(unit.position.x - 8, unit.position.y - 20, 16 * cargoPercent, 4);
            }

            // Type label
            ctx.fillStyle = 'white';
            ctx.font = '10px system-ui';
            ctx.textAlign = 'center';
            const typeLabel = unit.type === 'harvester' ? 'H' : 'U';
            ctx.fillText(typeLabel, unit.position.x, unit.position.y + 20);
        });
    }

    private renderProcessor(ctx: CanvasRenderingContext2D): void {
            ctx.fillStyle = '#4169e1';
            ctx.fillRect(400, 300, 40, 40);
            ctx.fillStyle = 'white';
            ctx.font = '12px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText('PROC', 420, 325);
        }

        private renderFogOfWar(ctx: CanvasRenderingContext2D): void {
            const state = this.gameState.getState();
            const tileSize = 32;

            state.tiles.forEach((row, y) => {
                row.forEach((tile, x) => {
                    if (!tile.isVisible) {
                        // Unexplored - completely black
                        ctx.fillStyle = '#000000';
                        ctx.fillRect(x * tileSize, y * tileSize, tileSize - 1, tileSize - 1);
                    } else if (!tile.isExplored) {
                        // Explored but not currently visible - dim
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                        ctx.fillRect(x * tileSize, y * tileSize, tileSize - 1, tileSize - 1);
                    }
                });
            });
        }

        private renderMinimap(ctx: CanvasRenderingContext2D, width: number, height: number): void {
            const state = this.gameState.getState();
            const minimap = state.minimap;
            const minimapSize = 150;
            const minimapX = width - minimapSize - 10;
            const minimapY = 10;
            const tileWidth = minimapSize / minimap.width;
            const tileHeight = minimapSize / minimap.height;

            // Draw minimap background
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);
            ctx.strokeStyle = '#333';
            ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize);

            // Draw minimap tiles
            for (let y = 0; y < minimap.height; y++) {
                for (let x = 0; x < minimap.width; x++) {
                    const encoded = minimap.data[y][x];
                    let color: string;

                    switch (encoded) {
                        case 0: // Grass
                            color = '#4a7c4e';
                            break;
                        case 1: // Dirt
                            color = '#8b6f47';
                            break;
                        case 2: // Stone
                            color = '#708090';
                            break;
                        case 3: // Shard field
                            color = '#9370db';
                            break;
                        case 4: // Ridge
                            color = '#555555';
                            break;
                        case 5: // Deep crust
                            color = '#2d4a3e';
                            break;
                        default:
                            color = '#333333';
                    }

                    ctx.fillStyle = color;
                    ctx.fillRect(
                        minimapX + x * tileWidth,
                        minimapY + y * tileHeight,
                        tileWidth - 1,
                        tileHeight - 1
                    );
                }
            }

            // Draw camera viewport
            const camera = state.camera;
            const viewportWidth = (width / camera.zoom) * (minimapSize / width);
            const viewportHeight = (height / camera.zoom) * (minimapSize / height);
            const viewportX = minimapX + (camera.x / width) * minimapSize;
            const viewportY = minimapY + (camera.y / height) * minimapSize;

            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.strokeRect(viewportX, viewportY, viewportWidth, viewportHeight);
        }

    start(): void {
        this.gameLoop();
    }
}