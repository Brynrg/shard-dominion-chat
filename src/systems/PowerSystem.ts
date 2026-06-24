import type { GameStateType } from "../core/GameState";

export interface PowerState {
  generated: number;
  consumed: number;
  reserve: number;
  deficitSeverity: number;
  poweredBuildings: Set<string>;
  unpoweredBuildings: Set<string>;
  productionSlowdown: number;
  defenseShutdown: boolean;
  radarEnabled: boolean;
}

export class PowerSystem {
  private state: PowerState;

  constructor() {
    this.state = {
      generated: 0,
      consumed: 0,
      reserve: 0,
      deficitSeverity: 0,
      poweredBuildings: new Set(),
      unpoweredBuildings: new Set(),
      productionSlowdown: 0,
      defenseShutdown: false,
      radarEnabled: true
    };
  }

  update(gameState: GameStateType): void {
    const buildings = gameState.buildings;
    const powerNodes = buildings.filter(b => b.type === "power_node");

    // Calculate total power generation
    const generated = powerNodes.reduce((sum, b) => sum + b.power, 0);

    // Calculate total power consumption from buildings
    const totalPowerConsumption = buildings.reduce((sum, b) => {
      if (b.isPowered) {
        return sum + b.maxPower;
      }
      return sum;
    }, 0);

    // Calculate reserve
    const reserve = generated - totalPowerConsumption;

    // Calculate deficit severity
    let deficitSeverity = 0;
    if (reserve < 0) {
      deficitSeverity = Math.min(Math.abs(reserve) / 100, 1);
    }

    // Calculate production slowdown (0-1 scale based on deficit)
    const productionSlowdown = deficitSeverity * 0.5;

    // Defense shutdown if deficit is severe
    const defenseShutdown = deficitSeverity >= 0.8;

    // Update powered/unpowered buildings
    const poweredSet = new Set<string>();
    const unpoweredSet = new Set<string>();

    buildings.forEach(b => {
      if (b.isPowered) {
        poweredSet.add(b.id);
      } else {
        unpoweredSet.add(b.id);
      }
    });

    this.state = {
      generated,
      consumed: totalPowerConsumption,
      reserve,
      deficitSeverity,
      poweredBuildings: poweredSet,
      unpoweredBuildings: unpoweredSet,
      productionSlowdown,
      defenseShutdown,
      radarEnabled: deficitSeverity < 0.5
    };
  }

  getState(): PowerState {
    return this.state;
  }

  isBuildingPowered(buildingId: string, gameState: GameStateType): boolean {
    const building = gameState.buildings.find(b => b.id === buildingId);
    if (!building) return false;
    return building.isPowered;
  }

  getPowerDeficit(): number {
    return this.state.consumed - this.state.generated;
  }

  isPowerDeficit(): boolean {
    return this.state.reserve < 0;
  }
}
