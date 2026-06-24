export interface Position {
    x: number;
    y: number;
}

// Position aliases for clarity
export type WorldCoord = Position;
export type TileCoord = { x: number; y: number };

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
    shardAmount: number;
    agitation: number;
    isBlocked: boolean;
    wormRisk: number;
    isExplored: boolean;
    isVisible: boolean;
}

export enum UnitType {
    HARVESTER = 'harvester',
    COMMANDER = 'commander',
    SCOUT = 'scout',
    RAIDER = 'raider'
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
    hp: number;
    maxHp: number;
    isDead: boolean;
    attackRange: number;
    attackDamage: number;
    attackCooldown: number;
    lastAttackTime: number;
}

export enum BuildingType {
    PROCESSOR = 'processor',
    SILO = 'silo',
    COMMAND_CENTER = 'command_center',
    ANCHOR_LATTICE = 'anchor_lattice',
    POWER_NODE = 'power_node',
    FORGE = 'forge',
    TURRET = 'turret',
    RESEARCH_LAB = 'research_lab',
    TITAN_WORM = 'titan_worm',
    VOLATILE_BLOOM = 'volatile_bloom',
    BARRACKS = 'barracks',
    FACTORY = 'factory'
}

export interface Building {
    id: string;
    type: BuildingType;
    position: Position;
    bounds: Bounds;
    power: number;
    maxPower: number;
    hp: number;
    maxHp: number;
    isPowered: boolean;
    isDead: boolean;
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
    projectiles: Projectile[];
    mission: MissionState | null;
}

export interface MissionState {
    active: boolean;
    objectives: MissionObjective[];
    briefing: string;
    startTime: number;
    endTime: number | null;
    winCondition: string;
    loseCondition: string;
    shardBloomActive: boolean;
    forgeRaidActive: boolean;
}

export interface MissionObjective {
    id: string;
    description: string;
    completed: boolean;
    target: string;
    current: number;
    required: number;
}

export enum ActionType {
    SELECT = 'select',
    MOVE = 'move',
    HARVEST = 'harvest',
    PLACE_BUILDING = 'place_building',
    ADD_TO_PRODUCTION = 'add_to_production'
}

export interface Action {
    type: ActionType;
    unitId?: string;
    target?: Position;
    buildingType?: string;
    buildingId?: string;
    unitType?: string;
    buildTime?: number;
}

export interface HarvestData {
    tileX: number;
    tileY: number;
    amount: number;
}

export enum WeaponType {
    PROJECTILE = 'projectile',
    HITSCAN = 'hitscan',
    MELEE = 'melee'
}

export interface Weapon {
    type: WeaponType;
    damage: number;
    range: number;
    cooldown: number;
    speed?: number; // For projectiles
}

export interface Projectile {
    id: string;
    position: Position;
    target: Position;
    speed: number;
    damage: number;
    ownerFaction: string;
    isDead: boolean;
}

export interface Camera {
    x: number;
    y: number;
    zoom: number;
}

export interface FogOfWar {
    visible: Set<string>;
    explored: Set<string>;
}

export interface Minimap {
    x: number;
    y: number;
    width: number;
    height: number;
    data: number[][];
}

export interface MoveQueueItem {
    unitId: string;
    target: Position;
    path: Position[];
}