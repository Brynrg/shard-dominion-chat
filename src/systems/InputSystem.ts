import type { Action } from '../core/types';
import { ActionType } from '../core/types';

export class InputSystem {
    private canvas: HTMLCanvasElement;
    private selectedUnits: Set<string> = new Set();
    private onAction: (action: Action) => void;

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

        // Drag to select multiple units
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let selectionBox: HTMLElement | null = null;

        this.canvas.addEventListener('pointerdown', (e) => {
            if (e.button === 0 && e.shiftKey) { // Shift + left click for drag select
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

        this.onAction(action);
    }

    setSelectedUnits(unitIds: string[]): void {
        this.selectedUnits.clear();
        unitIds.forEach(id => this.selectedUnits.add(id));
    }

    getSelectedUnits(): string[] {
        return Array.from(this.selectedUnits);
    }
}