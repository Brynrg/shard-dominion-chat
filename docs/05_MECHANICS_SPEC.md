# 05 — Mechanics Spec

## Economy

### Aether Shards

Shard fields have:
- type: blue, red, black
- total amount
- regen rate
- volatility
- agitation multiplier
- visibility value

Blue fields are safe, low yield, low agitation. Red fields are high yield, high volatility, high agitation. Black fields are rare tech/story resources and trigger stronger planet responses.

### Harvester loop

1. Find assigned field or nearest valid field.
2. Navigate to harvest tile.
3. Fill cargo over time.
4. Return to nearest valid Processor.
5. Deposit cargo.
6. Add credits to player.
7. Increase field depletion.
8. Increase agitation based on field type and extraction rate.

Harvester should be vulnerable and strategically important.

## Anchor Lattice

Buildings can be placed only on valid buildable tiles, within build radius from Command Core or lattice-connected structure, and preferably on Anchor Lattice.

Placement modes:
- raw ground: fast, cheap, degrades
- basic lattice: standard
- reinforced lattice: expensive, slow, resilient

Raw-ground buildings lose max HP slowly, leak power, increase local agitation, and may fail during glass storms or tremors.

## Power

Power state:
- generated
- consumed
- surplus/deficit

Deficit effects:
- production queues slowed
- radar disabled
- advanced defenses offline
- repair slower
- some faction powers unavailable

Surplus spike effects:
- may attract glass storms
- raises signature if sudden and large

## Fog of war

Three states:
- unseen: black
- explored but not visible: dim
- visible: full detail

Radar reveals blips, not full identity. It is disabled under power deficit and disrupted by glass storms.

## Combat

Core stats:
- hp
- armorType
- speed
- sight
- weapon
- range
- damage
- damageType
- reload
- projectileSpeed
- splash
- accuracy

Damage relationships:
- kinetic vs infantry/vehicles
- explosive vs vehicles/buildings
- energy vs shields/light units
- seismic vs buildings/worm interactions
- disruption vs systems/stealth/control

## Construction

Build flow:
1. player selects building
2. ghost preview appears
3. valid/invalid footprint display
4. pay credits when placement starts
5. construction progress visible
6. building becomes operational if enough power

## Production

Barracks/Vehicle Bay/Air Pad/Starport produce units. Queues are visible. Rally points work.

## Planet Agitation

Tracked globally and locally.

Global:
- 0–100 threat bar
- affects chance/intensity of planet events

Local:
- tile/chunk agitation
- determines where events occur

Sources:
- harvesting
- deep crust movement
- raw buildings
- power spikes
- explosions
- thumpers
- superpowers

Sinks:
- time decay
- stabilizer structures
- pausing harvest
- low-vibration faction tech
