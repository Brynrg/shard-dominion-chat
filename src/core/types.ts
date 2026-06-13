export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface Bounds extends Position, Size {}

export enum TileType {
    GRASS = 'grass',
    DIRT = 'dirt',
    STONE = 'stone',
    SHARD_FIELD = 'shard_field',
    RIDGE = 'ridge',
    DEEP_CRUST = 'deep_crust'
}

export interface Tile {
    type: TileType;
    x: number;
    y: number;
    cost: number;
    hasShards: boolean;
    agitation: number;
    isBlocked: boolean;
    wormRisk: number;
    isExplored: boolean;
    isVisible: boolean;
}

export enum UnitType {
    HARVESTER = 'harvester',
    COMMANDER = 'commander',
    SCOUT = 'scout'
}

export interface Unit {
    id: string;
    type: UnitType;
    position: Position;
    targetPosition: Position | null;
    speed: number;
    carrying: number;
    maxCarrying: number;
    faction: string;
    isSelected: boolean;
    visionRadius: number;
}

export enum BuildingType {
    PROCESSOR = 'processor',
    SILO = 'silo',
    COMMAND_CENTER = 'command_center'
}

export interface Building {
    id: string;
    type: BuildingType;
    position: Position;
    bounds: Bounds;
    power: number;
    maxPower: number;
}

export interface GameState {
    units: Unit[];
    buildings: Building[];
    tiles: Tile[][];
    credits: number;
    power: number;
    maxPower: number;
    planetAgitation: number;
    selectedUnits: string[];
    camera: {
        x: number;
        y: number;
        zoom: number;
    };
    fogOfWar: {
        visible: Set<string>;
        explored: Set<string>;
    };
    minimap: {
        width: number;
        height: number;
        data: number[][];
    };
}

export enum ActionType {
    SELECT = 'select',
    MOVE = 'move',
    HARVEST = 'harvest'
}

export interface Action {
    type: ActionType;
    unitId?: string;
    target?: Position;
}

export interface HarvestData {
    tileX: number;
    tileY: number;
    amount: number;
}