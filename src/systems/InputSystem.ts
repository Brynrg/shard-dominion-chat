import type { Action } from '../core/types';
import { ActionType } from '../core/types';
import { GameState } from '../core/GameState';

export class InputSystem {
    private canvas: HTMLCanvasElement;
    private selectedUnits: Set<string> = new Set();
    private onAction: (action: Action) => void;
    private shiftPressed: boolean = false;

    constructor(canvas: HTMLCanvasElement, onAction: (action: Action) => void) {
        this.canvas = canvas;
        this.onAction = onAction;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Left click to select
        this.canvas.addEventListener('pointerdown', (e) => {
            if (e.button === 0) { // Left click
                this.handleLeftClick(e);
            }
        });

        // Right click to move
        this.canvas.addEventListener('pointerdown', (e) => {
            if (e.button === 2) { // Right click
                this.handleRightClick(e);
                e.preventDefault();
            }
        });

        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // ESC key to clear selection
        this.canvas.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const state = GameState.getInstance();
                state.selectUnits([]);
                const allUnits = state.getState().units;
                allUnits.forEach(unit => unit.isSelected = false);
            }
        });

        // Track shift key for queueing
        this.canvas.addEventListener('keydown', (e) => {
            if (e.key === 'Shift') {
                this.shiftPressed = true;
            }
        });

        this.canvas.addEventListener('keyup', (e) => {
            if (e.key === 'Shift') {
                this.shiftPressed = false;
            }
        });

        // Camera pan with WASD
        this.canvas.addEventListener('keydown', (e) => {
            if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
                const state = GameState.getInstance();
                const camera = state.getCamera();
                const panSpeed = 10;
                switch (e.key.toLowerCase()) {
                    case 'w':
                        state.setCamera(camera.x, camera.y - panSpeed, camera.zoom);
                        break;
                    case 's':
                        state.setCamera(camera.x, camera.y + panSpeed, camera.zoom);
                        break;
                    case 'a':
                        state.setCamera(camera.x - panSpeed, camera.y, camera.zoom);
                        break;
                    case 'd':
                        state.setCamera(camera.x + panSpeed, camera.y, camera.zoom);
                        break;
                }
            }
        });

        // Camera pan with edge dragging
        let isEdgeDragging = false;
        let lastMouseX = 0;
        let lastMouseY = 0;

        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 1) { // Middle mouse button
                isEdgeDragging = true;
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (isEdgeDragging) {
                const dx = e.clientX - lastMouseX;
                const dy = e.clientY - lastMouseY;
                const state = GameState.getInstance();
                const camera = state.getCamera();
                state.setCamera(camera.x + dx, camera.y + dy, camera.zoom);
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            isEdgeDragging = false;
        });

        // Zoom with mouse wheel
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const state = GameState.getInstance();
            const camera = state.getCamera();
            const zoomSpeed = 0.001;
            const newZoom = Math.max(0.5, Math.min(3, camera.zoom - e.deltaY * zoomSpeed));
            state.setCamera(camera.x, camera.y, newZoom);
        }, { passive: false });

        // Drag to select multiple units (no Shift required)
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let selectionBox: HTMLElement | null = null;

        this.canvas.addEventListener('pointerdown', (e) => {
            if (e.button === 0) { // Left click for drag select
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;

                selectionBox = document.createElement('div');
                selectionBox.style.position = 'absolute';
                selectionBox.style.border = '2px dashed #4CAF50';
                selectionBox.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                selectionBox.style.pointerEvents = 'none';
                selectionBox.style.zIndex = '1000';

                selectionBox.style.left = startX + 'px';
                selectionBox.style.top = startY + 'px';
                selectionBox.style.width = '0px';
                selectionBox.style.height = '0px';

                this.canvas.parentElement?.appendChild(selectionBox);
                e.preventDefault();
            }
        });

        this.canvas.addEventListener('pointermove', (e) => {
            if (isDragging && selectionBox) {
                const width = e.clientX - startX;
                const height = e.clientY - startY;

                selectionBox.style.width = Math.abs(width) + 'px';
                selectionBox.style.height = Math.abs(height) + 'px';
                if (width < 0) selectionBox.style.left = e.clientX + 'px';
                if (height < 0) selectionBox.style.top = e.clientY + 'px';
            }
        });

        this.canvas.addEventListener('pointerup', () => {
            if (isDragging && selectionBox) {
                isDragging = false;
                selectionBox.remove();
                selectionBox = null;
            }
        });

        // Add click handler for minimap panning
        this.canvas.addEventListener('click', (e) => {
            this.handleMinimapClick(e);
        });
    }

    private handleLeftClick(event: PointerEvent): void {
        const canvasRect = this.canvas.getBoundingClientRect();
        const x = event.clientX - canvasRect.left;
        const y = event.clientY - canvasRect.top;

        const action: Action = {
            type: ActionType.SELECT,
            target: { x, y }
        };

        this.onAction(action);
    }

    private handleRightClick(event: PointerEvent): void {
        const canvasRect = this.canvas.getBoundingClientRect();
        const x = event.clientX - canvasRect.left;
        const y = event.clientY - canvasRect.top;

        const action: Action = {
            type: ActionType.MOVE,
            target: { x, y }
        };

        // If Shift is pressed, add to move queue
        if (this.shiftPressed && this.selectedUnits.size > 0) {
            const state = GameState.getInstance();
            this.selectedUnits.forEach(unitId => {
                state.addToMoveQueue(unitId, { x, y });
            });
        }

        this.onAction(action);
    }

    isShiftPressed(): boolean {
        return this.shiftPressed;
    }

    private handleMinimapClick(event: PointerEvent): void {
        const canvasRect = this.canvas.getBoundingClientRect();
        const x = event.clientX - canvasRect.left;
        const y = event.clientY - canvasRect.top;
        
        const state = GameState.getInstance();
        const camera = state.getCamera();
        const minimap = state.getState().minimap;
        
        // Calculate minimap position
        const minimapSize = 150;
        const minimapX = canvasRect.width - minimapSize - 10;
        const minimapY = 10;
        
        // Check if click is within minimap bounds
        if (x >= minimapX && x <= minimapX + minimapSize && 
            y >= minimapY && y <= minimapY + minimapSize) {
            
            // Convert minimap click to world coordinates
            const clickX = (x - minimapX) / minimapSize * minimap.width;
            const clickY = (y - minimapY) / minimapSize * minimap.height;
            
            // Convert to world coordinates (assuming map size and camera zoom)
            const worldX = clickX * 32; // Each tile is 32px
            const worldY = clickY * 32;
            
            // Center camera on clicked minimap position
            state.setCamera(worldX, worldY, camera.zoom);
        }
    }

    setSelectedUnits(unitIds: string[]): void {
        this.selectedUnits.clear();
        unitIds.forEach(id => this.selectedUnits.add(id));
    }

    getSelectedUnits(): string[] {
        return Array.from(this.selectedUnits);
    }
}