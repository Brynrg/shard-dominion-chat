export class PlanetAgitationSystem {
    private currentAgitation: number = 0;
    private maxAgitation: number = 100;
    private lastUpdate: number = Date.now();

    update(): void {
        // Simple agitation growth over time
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastUpdate;
        this.lastUpdate = currentTime;

        // Agitation grows slowly over time
        this.currentAgitation = Math.min(this.currentAgitation + deltaTime / 10000, this.maxAgitation);
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