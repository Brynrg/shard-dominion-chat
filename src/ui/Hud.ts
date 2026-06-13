import type { GameState } from '../core/types';

export class Hud {
    private root: HTMLElement;
    private creditsElement: HTMLElement | null = null;
    private powerElement: HTMLElement | null = null;
    private planetAgitationElement: HTMLElement | null = null;
    private debugOverlayElement: HTMLElement | null = null;
    private debugVisible: boolean = false;

    constructor(root: HTMLElement) {
        this.root = root;
        this.createHudElements();
    }

    private createHudElements(): void {
        // Create HUD container
        const hudContainer = document.createElement('div');
        hudContainer.style.position = 'absolute';
        hudContainer.style.top = '10px';
        hudContainer.style.left = '10px';
        hudContainer.style.background = 'rgba(0, 0, 0, 0.7)';
        hudContainer.style.color = 'white';
        hudContainer.style.padding = '10px';
        hudContainer.style.borderRadius = '5px';
        hudContainer.style.fontSize = '14px';
        hudContainer.style.fontFamily = 'system-ui, sans-serif';
        hudContainer.style.zIndex = '1000';

        // Credits
        const creditsRow = document.createElement('div');
        creditsRow.innerHTML = 'Credits: <span id="credits">100</span>';
        hudContainer.appendChild(creditsRow);

        // Power
        const powerRow = document.createElement('div');
        powerRow.innerHTML = 'Power: <span id="power">50</span>/<span id="power-max">100</span>';
        hudContainer.appendChild(powerRow);

        // Planet Agitation
        const agitationRow = document.createElement('div');
        agitationRow.innerHTML = 'Agitation: <span id="agitation">0</span>%';
        hudContainer.appendChild(agitationRow);

        // Debug overlay toggle
        const debugToggle = document.createElement('div');
        debugToggle.innerHTML = 'Debug: OFF (press D)';
        debugToggle.style.marginTop = '5px';
        debugToggle.style.cursor = 'pointer';
        debugToggle.addEventListener('click', () => this.toggleDebug());
        hudContainer.appendChild(debugToggle);

        this.root.appendChild(hudContainer);

        // Store references to elements
        this.creditsElement = document.getElementById('credits');
        this.powerElement = document.getElementById('power');
        this.planetAgitationElement = document.getElementById('agitation');
    }

    update(state: GameState): void {
        // Update credits
        if (this.creditsElement) {
            this.creditsElement.textContent = state.credits.toString();
        }

        // Update power
        if (this.powerElement) {
            this.powerElement.textContent = state.power.toString();
        }
        const powerMaxElement = document.getElementById('power-max');
        if (powerMaxElement) {
            powerMaxElement.textContent = state.maxPower.toString();
        }

        // Update planet agitation
        if (this.planetAgitationElement) {
            const aggPercentage = Math.round((state.planetAgitation / 100) * 100);
            this.planetAgitationElement.textContent = aggPercentage.toString();
        }
    }

    addDebugInfo(debugContainer: HTMLElement, info: { [key: string]: any }): void {
        debugContainer.innerHTML = '';
        
        for (const [key, value] of Object.entries(info)) {
            const row = document.createElement('div');
            row.innerHTML = `${key}: ${JSON.stringify(value)}`;
            debugContainer.appendChild(row);
        }

        this.root.appendChild(debugContainer);
        this.debugOverlayElement = debugContainer;
    }

    toggleDebug(): void {
        this.debugVisible = !this.debugVisible;
        if (this.debugOverlayElement) {
            this.debugOverlayElement.style.display = this.debugVisible ? 'block' : 'none';
        }
    }

    setDebugInfo(info: { [key: string]: any }): void {
        if (this.debugVisible && this.debugOverlayElement) {
            this.addDebugInfo(this.debugOverlayElement, info);
        }
    }

    clearDebug(): void {
        if (this.debugOverlayElement) {
            this.debugOverlayElement.remove();
            this.debugOverlayElement = null;
        }
    }
}