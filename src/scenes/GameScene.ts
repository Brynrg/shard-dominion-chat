import { GameState } from '../core/GameState';
import type { Position } from '../core/types';
import { TileType, UnitType, BuildingType } from '../core/types';
import { InputSystem } from '../systems/InputSystem';
import { MovementSystem } from '../systems/MovementSystem';
import { PathfindingSystem } from '../systems/PathfindingSystem';
import { HarvestSystem } from '../systems/HarvestSystem';
import { PlanetAgitationSystem } from '../systems/PlanetAgitationSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { PowerSystem } from '../systems/PowerSystem';
import { ConstructionSystem } from '../systems/ConstructionSystem';
import { ProductionSystem } from '../systems/ProductionSystem';
import { LatticeSystem } from '../systems/LatticeSystem';
import { Hud } from '../ui/Hud';
import { sampleBuildings } from '../data/sampleBuildings';
import { sampleUnits } from '../data/sampleUnits';
import { sampleTerrain } from '../data/sampleTerrain';

class GameScene {
    private canvas: HTMLCanvasElement;
    private gameState: GameState;
    private movementSystem: MovementSystem;
    private pathfindingSystem: PathfindingSystem;
    private harvestSystem: HarvestSystem;
    private _planetAgitationSystem: PlanetAgitationSystem;
    private combatSystem: CombatSystem;
    private powerSystem: PowerSystem;
    private constructionSystem: ConstructionSystem;
    private productionSystem: ProductionSystem;
    private latticeSystem: LatticeSystem;
    private hud: Hud;
    private debugMode: boolean = false;
    private inputSystem: InputSystem;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        // Resize canvas to match parent element
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }
        this.gameState = GameState.getInstance();
        // Center the camera on the map (30x20 tiles @ 32px each = 960x640)
        this.gameState.setCamera(-480, -320, 1);
        this.harvestSystem = new HarvestSystem();
        this._planetAgitationSystem = new PlanetAgitationSystem();
        this.combatSystem = new CombatSystem(this.gameState);
        this.powerSystem = new PowerSystem();
        this.constructionSystem = new ConstructionSystem();
        this.productionSystem = new ProductionSystem();
        this.latticeSystem = new LatticeSystem();
        this.inputSystem = new InputSystem(canvas, this.handleAction.bind(this));

        // Initialize systems
        this.movementSystem = new MovementSystem();
        this.movementSystem.setPlanetAgitationSystem(this._planetAgitationSystem);
        this.pathfindingSystem = new PathfindingSystem();
        this.hud = new Hud(this.canvas);

        this.initializeGame();
        this.setupEventListeners();
        this.start();
    }

    private initializeGame(): void {
        const state = this.gameState;

        // Add sample data
        // Add buildings
        sampleBuildings.forEach(building => {
            this.gameState.addBuilding(building);
        });

        // Add units
        sampleUnits.forEach(unit => {
            this.gameState.addUnit(unit);
            this.harvestSystem.addUnit(unit);
        });

        // Add terrain
        sampleTerrain.forEach((row: any[], y: number) => {
            row.forEach((tile: any, x: number) => {
                this.gameState.setTile(x, y, tile);
                this.harvestSystem.setTile(x, y, tile);
            });
        });

        // Set processor position for harvest system
        this.harvestSystem.setProcessorPosition({ x: 400, y: 300 });
        this.harvestSystem.setPlanetAgitationSystem(this._planetAgitationSystem);

        // Initialize pathfinding system
        this.pathfindingSystem.setTiles(state.tiles);
        this.movementSystem.setTiles(state.tiles);
        this.movementSystem.setPathfinding(this.pathfindingSystem);

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
            case 'place_building':
                this.handlePlaceBuilding(action.buildingType);
                break;
            case 'add_to_production':
                this.handleAddToProduction(action.buildingId, action.unitType, action.buildTime);
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

    private handlePlaceBuilding(buildingType: string): void {
        const state = this.gameState.getState();
        const tile = this.worldToTile(state.camera);

        // Use LatticeSystem for anchor lattice placement
        if (buildingType === 'anchor_lattice') {
            this.latticeSystem.setPlacementPreview(state, tile);
            if (this.latticeSystem.placeLattice(state)) {
                // Success - clear preview
                this.latticeSystem.clearPlacementPreview();
            }
        } else {
            // Use ConstructionSystem for other buildings
            this.constructionSystem.setPlacementPreview(state, tile, buildingType);
            if (this.constructionSystem.placeBuilding(state, buildingType)) {
                // Success - clear preview
                this.constructionSystem.clearPlacementPreview();
            }
        }
    }

    private handleAddToProduction(buildingId: string, unitType: string, rallyPoint: Position): void {
        const state = this.gameState.getState();

        if (this.productionSystem.addToQueue(state, buildingId, unitType, rallyPoint)) {
            // Success
        }
    }

    private worldToTile(pos: Position): { x: number; y: number } {
        const tileSize = 32;
        return {
            x: Math.floor(pos.x / tileSize),
            y: Math.floor(pos.y / tileSize)
        };
    }

    private handleSelection(target: Position): void {
        const state = this.gameState;
        const units = state.units;
        const isShift = this.inputSystem.isShiftPressed();

        // Find all units in selection box
        const selectedUnits = units.filter(unit => {
            const dx = unit.position.x - target.x;
            const dy = unit.position.y - target.y;
            return Math.sqrt(dx * dx + dy * dy) < 30;
        });

        if (selectedUnits.length > 0) {
            if (isShift) {
                // Toggle selection - add if not selected, remove if already selected
                selectedUnits.forEach(unit => {
                    const currentSelection = this.gameState.getSelectedUnitIds();
                    if (currentSelection.includes(unit.id)) {
                        // Remove from selection
                        const newSelection = currentSelection.filter(id => id !== unit.id);
                        this.gameState.selectUnits(newSelection);
                        unit.isSelected = false;
                    } else {
                        // Add to selection
                        const newSelection = [...currentSelection, unit.id];
                        this.gameState.selectUnits(newSelection);
                        unit.isSelected = true;
                    }
                });
            } else {
                // Single selection - clear all, then select these
                units.forEach(unit => unit.isSelected = false);
                const newSelection = selectedUnits.map(unit => unit.id);
                this.gameState.selectUnits(newSelection);
                selectedUnits.forEach(unit => unit.isSelected = true);
            }
        } else {
            // Clicked on empty space - clear selection
            units.forEach(unit => unit.isSelected = false);
            this.gameState.selectUnits([]);
        }
    }

    gameLoop = () => {
        const state = this.gameState;

        // Fixed timestep (P0-06: bounded delta)
        const deltaTime = 16; // 60 FPS

        // Update systems
        this.harvestSystem.updateUnits();
        this._planetAgitationSystem.update();
        this.powerSystem.update(state);
        this.constructionSystem.update(state);
        this.latticeSystem.update(state);
        this.productionSystem.update(deltaTime);
        this.combatSystem.autoAcquireTargets();
        this.combatSystem.updateUnits();
        this.combatSystem.updateProjectiles(deltaTime);
        this.combatSystem.checkUnitDeaths();
        this.combatSystem.checkBuildingDeaths();

        // Apply power effects
        const powerState = this.powerSystem.getState();
        if (powerState.defenseShutdown) {
            // Defense shutdown: disable combat
            this.combatSystem.setEnabled(false);
        } else {
            this.combatSystem.setEnabled(true);
        }

        // Apply production slowdown
        const radarElement = document.querySelector(".minimap-container") as HTMLElement;
        // Radar interruption effect
        if (radarElement) {
            if (powerState.radarEnabled) {
                radarElement.style.opacity = "1.0";
                radarElement.style.filter = "none";
            } else {
                radarElement.style.opacity = "0.3";
                radarElement.style.filter = "grayscale(100%) blur(2px)";
            }
        }
        const productionSlowdown = powerState.productionSlowdown;
        if (productionSlowdown > 0) {
            // TODO: implement production slowdown
        }

        // Update movement
        this.movementSystem.moveUnits(this.gameState.getState().units, deltaTime);

        // Update fog of war
        this.gameState.updateFogOfWar();

        // Update HUD (P0-05: real RTS status HUD)
        this.hud.update(this.gameState.getState(), this.powerSystem.getState());

        // Debug overlay
        let debugInfo: any;
        if (this.debugMode) {
            debugInfo = {
                units: this.gameState.getState().units.length,
                buildings: this.gameState.getState().buildings.length,
                credits: this.gameState.getState().credits,
                power: this.gameState.getState().power,
                agitation: this._planetAgitationSystem.getAgitationPercentage() + '%',
                fogVisible: this.gameState.getState().fogOfWar.visible.size,
                fogExplored: this.gameState.getState().fogOfWar.explored.size
            };
            this.hud.setDebugInfo(debugInfo);
        }

        // Render
        this.render();

        // Continue game loop
        requestAnimationFrame(this.gameLoop);
    };

    private render(): void {
        const ctx = this.canvas.getContext('2d')!;
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        // Clear canvas
        ctx.fillStyle = '#0b0b10';
        ctx.fillRect(0, 0, width, height);

        // Get camera position
        const state = this.gameState;
        const camera = state.camera;

        // Save context and apply camera transform
        ctx.save();
        ctx.translate(-camera.x, -camera.y);
        ctx.scale(camera.zoom, camera.zoom);

        // Draw terrain - simplified for vertical slice
        this.renderTerrain(ctx, width, height);

        // Draw buildings
        this.renderBuildings(ctx);

        // Draw units
        this.renderUnits(ctx);

        // Draw move markers
        this.renderMoveMarkers(ctx);

        // Draw processor
        this.renderProcessor(ctx);

        // Draw fog of war
        this.renderFogOfWar(ctx);

        // Draw minimap
        this.renderMinimap(ctx, width, height);

        // Restore context
        ctx.restore();
    }

    private renderTerrain(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const state = this.gameState;
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
        const state = this.gameState;

        state.buildings.forEach(building => {
            ctx.fillStyle = building.type === BuildingType.COMMAND_CENTER ? '#4169e1' : '#228b22';
            ctx.fillRect(building.position.x, building.position.y, 40, 40);

            // Building label
            ctx.fillStyle = 'white';
            ctx.font = '12px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(building.type, building.position.x + 20, building.position.y + 25);
        });
    }

    private renderUnits(ctx: CanvasRenderingContext2D): void {
        const state = this.gameState;

        state.units.forEach(unit => {
            // Unit body
            ctx.fillStyle = unit.isSelected ? '#ffff00' : '#87ceeb';
            ctx.beginPath();
            ctx.arc(unit.position.x, unit.position.y, 10, 0, Math.PI * 2);
            ctx.fill();

            // Selection ring for selected units
            if (unit.isSelected) {
                ctx.strokeStyle = '#ffff00';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(unit.position.x, unit.position.y, 14, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Harvester cargo indicator
            if (unit.type === UnitType.HARVESTER && unit.carrying > 0) {
                ctx.fillStyle = '#ffd700';
                const cargoPercent = unit.carrying / unit.maxCarrying;
                ctx.fillRect(unit.position.x - 8, unit.position.y - 20, 16 * cargoPercent, 4);
            }

            // Type label
            ctx.fillStyle = 'white';
            ctx.font = '10px system-ui';
            ctx.textAlign = 'center';
            const typeLabel = unit.type === UnitType.HARVESTER ? 'H' : 'U';
            ctx.fillText(typeLabel, unit.position.x, unit.position.y + 20);
        });
    }

    private renderMoveMarkers(ctx: CanvasRenderingContext2D): void {
        const state = this.gameState;
        const selectedUnitIds = state.selectedUnits;

        // Draw move markers for selected units
        state.units.forEach(unit => {
            if (selectedUnitIds.includes(unit.id) && unit.targetPosition) {
                // Draw a cross marker at the target position
                const x = unit.targetPosition.x;
                const y = unit.targetPosition.y;
                const size = 8;

                ctx.strokeStyle = '#00ff00';
                ctx.lineWidth = 2;
                ctx.beginPath();
                // Horizontal line
                ctx.moveTo(x - size, y);
                ctx.lineTo(x + size, y);
                // Vertical line
                ctx.moveTo(x, y - size);
                ctx.lineTo(x, y + size);
                ctx.stroke();
            }
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
            const state = this.gameState;
            const tileSize = 32;

            state.tiles.forEach((row: any[], y: number) => {
                row.forEach((tile: any, x: number) => {
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
            const state = this.gameState;
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

export { GameScene };

