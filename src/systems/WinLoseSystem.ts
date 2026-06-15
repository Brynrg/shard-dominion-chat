import type { GameStateType } from '../core/GameState';
import type { MissionState } from '../core/types';

export class WinLoseSystem {
    private gameState: GameStateType;

    constructor(gameState: GameStateType) {
        this.gameState = gameState;
    }

    setGameState(gameState: GameStateType): void {
        this.gameState = gameState;
    }

    // Check if mission is complete (win)
    checkMissionWin(): boolean {
        const mission = this.gameState.mission;
        if (!mission || !mission.active) return false;

        // Check if all objectives are complete
        const allComplete = mission.objectives.every(obj => obj.completed);
        if (allComplete) {
            mission.active = false;
            return true;
        }

        return false;
    }

    // Check if mission is failed (lose)
    checkMissionLose(): boolean {
        const mission = this.gameState.mission;
        if (!mission || !mission.active) return false;

        // Check if all vanguard units are dead
        const vanguardUnits = this.gameState.units.filter(u => u.faction === 'vanguard');
        if (vanguardUnits.length === 0) {
            mission.active = false;
            return true;
        }

        return false;
    }

    // Check if mission is complete
    checkMissionComplete(): boolean {
        return this.checkMissionWin() || this.checkMissionLose();
    }

    // Get mission status
    getMissionStatus(): 'active' | 'completed' | 'failed' {
        const mission = this.gameState.mission;
        if (!mission) return 'active';

        if (mission.active) return 'active';
        if (this.checkMissionWin()) return 'completed';
        if (this.checkMissionLose()) return 'failed';

        return 'active';
    }

    // Get win reason
    getWinReason(): string {
        const mission = this.gameState.mission;
        if (!mission) return '';

        const allComplete = mission.objectives.every(obj => obj.completed);
        if (allComplete) {
            return 'All objectives completed';
        }

        return '';
    }

    // Get lose reason
    getLoseReason(): string {
        const mission = this.gameState.mission;
        if (!mission) return '';

        const vanguardUnits = this.gameState.units.filter(u => u.faction === 'vanguard');
        if (vanguardUnits.length === 0) {
            return 'All vanguard units destroyed';
        }

        return '';
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
}