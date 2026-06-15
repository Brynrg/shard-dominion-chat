import type { GameStateType } from '../core/GameState';
import type { MissionState, MissionObjective } from '../core/types';

export class MissionSystem {
    private gameState: GameStateType;

    constructor(gameState: GameStateType) {
        this.gameState = gameState;
    }

    setGameState(gameState: GameStateType): void {
        this.gameState = gameState;
    }

    // Create a new mission
    createMission(briefing: string, objectives: MissionObjective[]): void {
        const mission: MissionState = {
            active: true,
            objectives,
            briefing,
            startTime: Date.now(),
            endTime: null,
            winCondition: 'all_objectives_complete',
            loseCondition: 'all_vanguard_units_destroyed',
            shardBloomActive: false,
            forgeRaidActive: false
        };

        this.gameState.mission = mission;
    }

    // Check if mission is complete
    checkMissionCompletion(): void {
        const mission = this.gameState.mission;
        if (!mission || !mission.active) return;

        const allComplete = mission.objectives.every(obj => obj.completed);
        if (allComplete) {
            mission.active = false;
        }
    }

    // Check if mission is failed
    checkMissionFailure(): void {
        const mission = this.gameState.mission;
        if (!mission || !mission.active) return;

        // Check if all vanguard units are dead
        const vanguardUnits = this.gameState.units.filter(u => u.faction === 'vanguard');
        if (vanguardUnits.length === 0) {
            mission.active = false;
        }
    }

    // Update mission progress
    updateMissionProgress(): void {
        const mission = this.gameState.mission;
        if (!mission || !mission.active) return;

        mission.objectives.forEach(objective => {
            if (objective.completed) return;

            // Check if target is built
            const building = this.gameState.buildings.find(
                b => b.id === objective.target && !b.isDead
            );
            if (building) {
                objective.completed = true;
            }
        });
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

    // Get mission status
    getMissionStatus(): string {
        const mission = this.gameState.mission;
        if (!mission) return 'none';

        return mission.active ? 'active' : 'completed';
    }

    // Get mission briefing
    getMissionBriefing(): string {
        const mission = this.gameState.mission;
        if (!mission) return '';

        return mission.briefing;
    }

    // Get mission objectives
    getMissionObjectives(): MissionObjective[] {
        const mission = this.gameState.mission;
        if (!mission) return [];

        return mission.objectives;
    }

    // Add a new objective
    addObjective(objective: MissionObjective): void {
        const mission = this.gameState.mission;
        if (!mission) {
            this.createMission('New Mission', [objective]);
        } else {
            mission.objectives.push(objective);
        }
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
}