import type { GameStateType } from '../core/GameState';
import type { MissionState } from '../core/types';

export interface ScriptedEvent {
    id: string;
    description: string;
    triggerTime: number;
    action: () => void;
    completed: boolean;
}

export class BriefingSystem {
    private gameState: GameStateType;
    private scriptedEvents: ScriptedEvent[] = [];

    constructor(gameState: GameStateType) {
        this.gameState = gameState;
    }

    setGameState(gameState: GameStateType): void {
        this.gameState = gameState;
    }

    // Add a scripted event
    addScriptedEvent(event: ScriptedEvent): void {
        this.scriptedEvents.push(event);
    }

    // Execute all triggered events
    executeScriptedEvents(): void {
        const now = Date.now();
        this.scriptedEvents.forEach(event => {
            if (event.completed) return;
            if (now >= event.triggerTime) {
                event.action();
                event.completed = true;
            }
        });
    }

    // Get all scripted events
    getScriptedEvents(): ScriptedEvent[] {
        return [...this.scriptedEvents];
    }

    // Clear all scripted events
    clearScriptedEvents(): void {
        this.scriptedEvents = [];
    }

    // Get mission briefing
    getMissionBriefing(): string {
        const mission = this.gameState.mission;
        if (!mission) return '';

        return mission.briefing;
    }

    // Set mission briefing
    setMissionBriefing(briefing: string): void {
        const mission = this.gameState.mission;
        if (mission) {
            mission.briefing = briefing;
        }
    }

    // Get mission state
    getMissionState(): MissionState | null {
        return this.gameState.mission;
    }

    // Set mission state
    setMissionState(mission: MissionState | null): void {
        this.gameState.mission = mission;
    }

    // Check if mission is active
    isMissionActive(): boolean {
        const mission = this.gameState.mission;
        return mission !== null && mission.active;
    }

    // Get mission time remaining
    getTimeRemaining(): number {
        const mission = this.gameState.mission;
        if (!mission || !mission.active) return 0;

        // Default mission duration: 5 minutes
        const missionDuration = 5 * 60 * 1000;
        const elapsed = Date.now() - mission.startTime;
        return Math.max(0, missionDuration - elapsed);
    }

    // Get mission time elapsed
    getTimeElapsed(): number {
        const mission = this.gameState.mission;
        if (!mission) return 0;

        return Date.now() - mission.startTime;
    }

    // Get mission score
    getMissionScore(): number {
        const mission = this.gameState.mission;
        if (!mission) return 0;

        let score = 0;
        mission.objectives.forEach(objective => {
            if (objective.completed) {
                score += 100;
            }
        });

        // Bonus for time remaining
        const timeRemaining = this.getTimeRemaining();
        if (timeRemaining > 0) {
            score += Math.floor(timeRemaining / 1000);
        }

        return score;
    }

    // Get mission objectives
    getMissionObjectives(): any[] {
        const mission = this.gameState.mission;
        if (!mission) return [];

        return mission.objectives;
    }

    // Complete an objective
    completeObjective(objectiveId: string): void {
        const mission = this.gameState.mission;
        if (!mission) return;

        const objective = mission.objectives.find(obj => obj.id === objectiveId);
        if (objective) {
            objective.completed = true;
        }
    }

    // Fail an objective
    failObjective(objectiveId: string): void {
        const mission = this.gameState.mission;
        if (!mission) return;

        const objective = mission.objectives.find(obj => obj.id === objectiveId);
        if (objective) {
            objective.completed = true; // Treat as completed for now
        }
    }
}