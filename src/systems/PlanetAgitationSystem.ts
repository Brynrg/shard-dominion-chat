export class PlanetAgitationSystem {
    private currentAgitation: number = 0;
    private maxAgitation: number = 100;
    private lastUpdate: number = Date.now();
    private agitationEvents: Array<{ type: string; amount: number; time: number }> = [];

    update(): void {
        // Simple base agitation growth over time
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastUpdate;
        this.lastUpdate = currentTime;

        // Small passive agitation
        this.currentAgitation = Math.min(this.currentAgitation + deltaTime / 20000, this.maxAgitation);
    }

    // Agitation from harvesting
    addHarvestAgitation(amount: number = 1): void {
        this.currentAgitation = Math.min(this.currentAgitation + amount, this.maxAgitation);
        this.agitationEvents.push({ type: 'harvest', amount, time: Date.now() });
    }

    // Agitation from movement over deep crust
    addMovementAgitation(amount: number = 0.5): void {
        this.currentAgitation = Math.min(this.currentAgitation + amount, this.maxAgitation);
        this.agitationEvents.push({ type: 'movement', amount, time: Date.now() });
    }

    // Agitation from explosions/combat (placeholder)
    addExplosionAgitation(amount: number = 2): void {
        this.currentAgitation = Math.min(this.currentAgitation + amount, this.maxAgitation);
        this.agitationEvents.push({ type: 'explosion', amount, time: Date.now() });
    }

    // Agitation from buildings (placeholder)
    addBuildingAgitation(amount: number = 1.5): void {
        this.currentAgitation = Math.min(this.currentAgitation + amount, this.maxAgitation);
        this.agitationEvents.push({ type: 'building', amount, time: Date.now() });
    }

    // Get local agitation around a position (for visual effects)
    getLocalAgitation(_x: number, _y: number, _radius: number = 100): number {
        // For now, just return current agitation
        // Later, could calculate based on nearby events
        return this.currentAgitation;
    }

    increaseAgitation(amount: number): void {
        this.currentAgitation = Math.min(this.currentAgitation + amount, this.maxAgitation);
    }

    decreaseAgitation(amount: number): void {
        this.currentAgitation = Math.max(this.currentAgitation - amount, 0);
    }

    resetAgitation(): void {
        this.currentAgitation = 0;
        this.lastUpdate = Date.now();
    }

    getCurrentAgitation(): number {
        return this.currentAgitation;
    }

    getMaxAgitation(): number {
        return this.maxAgitation;
    }

    getAgitationPercentage(): number {
        return Math.round((this.currentAgitation / this.maxAgitation) * 100);
    }

    isAgitated(): boolean {
        return this.currentAgitation > this.maxAgitation * 0.5;
    }

    isFullyAgitated(): boolean {
        return this.currentAgitation >= this.maxAgitation;
    }
}