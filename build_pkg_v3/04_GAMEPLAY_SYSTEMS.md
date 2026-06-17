# Gameplay Systems Specification

## Economy

### Resource nodes

Each node has:

- kind: blue, red, black;
- current amount;
- max amount;
- value per unit;
- harvest difficulty;
- volatility;
- agitation multiplier;
- regeneration rule;
- visual state.

### Harvester FSM

```text
IDLE
SEEK_RESOURCE
MOVE_TO_RESOURCE
HARVEST
MOVE_TO_PROCESSOR
QUEUE_AT_PROCESSOR
DEPOSIT
EVADE
DISABLED
```

### Economy acceptance

- cargo only increases while harvesting;
- credits only increase on deposit;
- resource amount falls;
- empty nodes visibly change;
- destroyed storage may lose resources;
- multiple harvesters can queue without overlap deadlock.

## Construction

### Anchor Lattice

Tier 0 raw ground:
- weak structure;
- degradation;
- power leakage.

Tier 1 standard lattice:
- full health;
- normal power.

Tier 2 reinforced:
- storm and tremor resistance;
- advanced structures.

### Placement rules

- map bounds;
- terrain validity;
- footprint clear;
- build radius;
- lattice requirement;
- power availability where applicable;
- credits;
- prerequisites.

## Power

Track:

- generated;
- consumed;
- reserve;
- deficit severity.

Effects:

- warning;
- radar interruption;
- production slowdown;
- defense shutdown;
- advanced systems offline.

## Production

- queue;
- cancel/refund;
- build time;
- rally point;
- blocked exit handling;
- faction prerequisites;
- tech unlocks.

## Orders

Required:

- move;
- attack;
- attack-move;
- stop;
- guard;
- patrol;
- harvest;
- repair;
- capture;
- deploy;
- rally.

## Combat

Required properties:

- HP;
- armor class;
- damage type;
- range;
- cooldown;
- projectile speed;
- splash;
- accuracy;
- target filters;
- line-of-sight rule;
- death effect.

## Armor matrix

At minimum:

- infantry;
- light vehicle;
- heavy vehicle;
- structure;
- aircraft;
- worm/planet.

## Fog and detection

- permanent explored;
- current visibility;
- stealth;
- detection;
- radar contacts;
- false contacts;
- storm interference.

## Planet Agitation

Global and regional.

Sources:

- blue harvest;
- red harvest;
- black harvest;
- heavy movement;
- construction;
- power spike;
- explosions;
- thumpers;
- apex weapons.

Events must have:

- trigger;
- warning;
- duration;
- effect;
- counterplay;
- cooldown;
- AI response.

## Planet events

### Shard Bloom
Resource instability and spread/explosion.

### Glass Storm
Radar disruption, air danger, visibility effects.

### Crust Collapse
Terrain changes and route disruption.

### Sensor Echoes
False contacts and command uncertainty.

### Titan Worm
Warning, emergence, pathing hazard, lure/counterplay.

## Mission system

Objectives:

- build;
- gather;
- protect;
- destroy;
- capture;
- survive;
- escort;
- investigate;
- optional;
- timed;
- choice.

Mission script must be data-driven.
