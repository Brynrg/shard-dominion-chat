export type EntityId = string;
export type PlayerId = string;

export interface Vec2 { x: number; y: number }
export interface TilePos { tx: number; ty: number }

export interface Entity {
  id: EntityId;
  typeId: string;
  ownerId: PlayerId | 'neutral';
  position: Vec2;
  facing: number;
  hp: number;
  maxHp: number;
  components: Record<string, unknown>;
}

export interface GameState {
  entities: Map<EntityId, Entity>;
  players: Map<PlayerId, PlayerState>;
  planet: PlanetState;
  tick: number;
}

export interface PlayerState {
  id: PlayerId;
  factionId: string;
  aether: number;
  blackShard: number;
  powerGenerated: number;
  powerUsed: number;
}

export interface PlanetState {
  globalAgitation: number;
  eventQueue: PlanetEventRuntime[];
}

export interface PlanetEventRuntime {
  id: string;
  startsAtTick: number;
  target?: TilePos;
}
