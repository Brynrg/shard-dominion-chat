import type { GameStateType } from '../core/GameState';
import { UnitType } from '../core/types';
import type { Unit } from '../core/types';
import type { PowerState } from '../systems/PowerSystem';

export class Hud {
    private root: HTMLElement;
    private creditsElement: HTMLElement | null = null;
    private powerElement: HTMLElement | null = null;
    private planetAgitationElement: HTMLElement | null = null;
    private debugOverlayElement: HTMLElement | null = null;
    private debugVisible: boolean = false;
    private currentBuildingElement: HTMLElement | null = null;
    private productionQueueElement: HTMLElement | null = null;

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

        // RTS Status Header
        const statusHeader = document.createElement('div');
        statusHeader.innerHTML = '<strong>SHARD DOMINION</strong>';
        statusHeader.style.marginBottom = '8px';
        statusHeader.style.borderBottom = '1px solid #444';
        statusHeader.style.paddingBottom = '5px';
        hudContainer.appendChild(statusHeader);

        // Credits
        const creditsRow = document.createElement('div');
        creditsRow.innerHTML = 'Credits: <span id="credits">100</span>';
        hudContainer.appendChild(creditsRow);

        // Power
        const powerRow = document.createElement('div');
        powerRow.innerHTML = 'Power: <span id="power">50</span>/<span id="power-max">100</span>';
        powerRow.dataset.powerStatus = 'normal';
        powerRow.style.color = 'white';
        hudContainer.appendChild(powerRow);

        // Planet Agitation
        const agitationRow = document.createElement('div');
        agitationRow.innerHTML = 'Agitation: <span id="agitation">0</span>%';
        hudContainer.appendChild(agitationRow);

        // Harvester Status
        const harvesterRow = document.createElement('div');
        harvesterRow.innerHTML = 'Harvesters: <span id="harvesters">0</span>';
        hudContainer.appendChild(harvesterRow);

        // Building Placement
        const buildingRow = document.createElement('div');
        buildingRow.innerHTML = 'Building: <span id="current-building">None</span>';
        buildingRow.style.marginTop = '5px';
        hudContainer.appendChild(buildingRow);

        // Production Queue
        const productionRow = document.createElement('div');
        productionRow.innerHTML = 'Production: <span id="production-queue">Empty</span>';
        productionRow.style.marginTop = '5px';
        hudContainer.appendChild(productionRow);

        // Production Queue Items Container
        const productionItemsContainer = document.createElement('div');
        productionItemsContainer.id = 'production-items';
        productionItemsContainer.style.marginTop = '5px';
        productionItemsContainer.style.maxHeight = '150px';
        productionItemsContainer.style.overflowY = 'auto';
        productionItemsContainer.style.fontSize = '12px';
        productionItemsContainer.style.fontFamily = 'system-ui, sans-serif';
        hudContainer.appendChild(productionItemsContainer);

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
        this.currentBuildingElement = document.getElementById('current-building');
        this.productionQueueElement = document.getElementById('production-queue');
    }

    update(state: GameStateType, powerState?: PowerState): void {
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

        // Update power status and warnings
        const powerRow = document.getElementById('power')?.parentElement;
        if (powerRow) {
            let status = 'normal';
            let color = 'white';
            
            if (powerState) {
                if (powerState.defenseShutdown) {
                    status = 'critical';
                    color = '#ff6b6b';
                } else if (powerState.deficitSeverity > 0.5) {
                    status = 'warning';
                    color = '#ffd93d';
                } else if (powerState.deficitSeverity > 0) {
                    status = 'low';
                    color = '#ffa500';
                }
                
                // Add severity indicator
                const severityIndicator = Math.round(powerState.deficitSeverity * 100);
                const indicator = powerRow.querySelector('.power-severity') as HTMLElement;
                if (indicator) {
                    indicator.textContent = `(${severityIndicator}%)`;
                    indicator.style.color = color;
                } else {
                    const span = document.createElement('span');
                    span.className = 'power-severity';
                    span.textContent = ` (${severityIndicator}%)`;
                    span.style.color = color;
                    span.style.marginLeft = '4px';
                    powerRow.appendChild(span);
                }
            }
            
            powerRow.dataset.powerStatus = status;
            powerRow.style.color = color;
        }

        // Update planet agitation
        if (this.planetAgitationElement) {
            const aggPercentage = Math.round((state.planetAgitation / 100) * 100);
            this.planetAgitationElement.textContent = aggPercentage.toString();
        }

        // Update harvester count
        const harvesterElement = document.getElementById('harvesters');
        if (harvesterElement) {
            const harvesterCount = state.units.filter((u: Unit) => u.type === UnitType.HARVESTER).length;
            harvesterElement.textContent = harvesterCount.toString();
        }

        // Update current building
        if (this.currentBuildingElement) {
            // This would be set by the game when a building is selected
            this.currentBuildingElement.textContent = 'None';
        }

        // Update production queue
        if (this.productionQueueElement) {
            // This would be set by the game when production is active
            this.productionQueueElement.textContent = 'Empty';
        }

        // Update production queue items
        const productionItemsContainer = document.getElementById('production-items');
        if (productionItemsContainer) {
            productionItemsContainer.innerHTML = '';
            
            // Get production queues from state
            const productionQueues = state.productionQueues || [];
            
            if (productionQueues.length === 0) {
                productionItemsContainer.innerHTML = '<div style="color: #888;">No active production</div>';
            } else {
                productionQueues.forEach((item, index) => {
                    const itemElement = document.createElement('div');
                    itemElement.style.marginBottom = '4px';
                    itemElement.style.padding = '4px';
                    itemElement.style.background = 'rgba(0, 0, 0, 0.5)';
                    itemElement.style.borderRadius = '3px';
                    itemElement.style.display = 'flex';
                    itemElement.style.justifyContent = 'space-between';
                    itemElement.style.alignItems = 'center';
                    
                    const progressPercent = Math.round((item.progress / item.buildTime) * 100);
                    itemElement.innerHTML = `
                        <div>
                            <div style="font-weight: bold;">${item.unitType}</div>
                            <div style="font-size: 11px; color: #aaa;">${progressPercent}%</div>
                        </div>
                        <button style="background: #ff6b6b; border: none; color: white; padding: 2px 8px; border-radius: 3px; cursor: pointer; font-size: 11px;" data-index="${index}">Cancel</button>
                    `;
                    
                    // Add click handler for cancel button
                    const cancelBtn = itemElement.querySelector('button');
                    if (cancelBtn) {
                        cancelBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            // This would call the game's cancel production function
                            console.log(`Cancel production at index ${index}`);
                        });
                    }
                    
                    productionItemsContainer.appendChild(itemElement);
                });
            }
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