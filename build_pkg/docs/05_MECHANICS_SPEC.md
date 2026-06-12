# Shard Dominion — Mechanics Spec

## Economy

### Resource Types
- `aether`: primary currency.
- `blackShard`: rare tech/campaign resource.

### Harvesting Loop
1. Harvester receives gather order or auto-harvest task.
2. Finds nearest valid shard tile.
3. Moves to tile.
4. Harvests until cargo full or tile depleted.
5. Returns to nearest Processor.
6. Deposits cargo.
7. Repeats unless interrupted.

### Harvester Threat Model
Harvesters must be:
- Valuable.
- Vulnerable.
- Rescue-able by Carryall later.
- Upgradeable through modules.

## Lattice / Building

### Placement Rules
- Must be near owned Construction Yard or expansion hub.
- Buildings receive full HP only on lattice.
- Raw-ground placement allowed for some factions/buildings but causes decay.

### Decay
Raw-ground buildings lose max HP slowly and leak power.
Repair can heal HP but not max HP unless lattice is later installed.

## Power

Power states:
- Normal: generated >= consumed.
- Deficit: generated < consumed.
- Critical: generated < 70% consumed.

Deficit modifiers:
- Production speed x0.5.
- Radar disabled if deficit persists >10s.
- Advanced defenses disabled.
- Repair speed x0.5.

## Planet Agitation

### Values
- Global agitation: 0-100.
- Local agitation grid: per map cell or chunk.

### Sources
- Harvest blue shard: +small.
- Harvest red shard: +medium.
- Heavy unit movement over deep crust: +medium.
- Explosive weapon: +medium local.
- Building raw-ground: +small persistent.
- Power spike: +medium global.
- Thumper: +large local.

### Thresholds
- 20: minor warnings.
- 40: shard bloom chance.
- 60: glass storm chance.
- 75: worm sign.
- 90: Titan emergence chance.

### Counterplay
- Stabilizer building lowers local agitation.
- Silent Harvester lowers harvest agitation.
- Survey Tower reveals risk zones.
- Decoy Thumper redirects worms.

## Combat

### Damage Types
- kinetic
- explosive
- energy
- siege
- antiAir
- corrosive
- signal

### Armor Types
- infantry
- lightVehicle
- heavyVehicle
- aircraft
- building
- leviathan

Use a damage multiplier table.

## Stealth and Detection
- Stealthed units invisible unless within detector radius or attacking.
- Phantom units gain stealth near shard fields with Signal Veil.
- Glass storms can create false radar contacts.

## Capture
Engineers capture neutral or enemy buildings if they reach the structure and channel for N seconds.
Damage interrupts capture.

