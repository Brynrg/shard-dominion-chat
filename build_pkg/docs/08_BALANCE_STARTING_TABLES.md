# Shard Dominion — Starting Balance Tables

These are initial values only. Tune after playtests.

## Economy
- Starting Aether: 2500
- Harvester cost: 800
- Harvester cargo: 700
- Blue shard harvest rate: 12/sec
- Red shard harvest rate: 18/sec
- Processor deposit time: 2 sec
- Silo capacity: 3000

## Buildings
| Building | Cost | Power Gen | Power Use | HP | Footprint |
|---|---:|---:|---:|---:|---|
| Construction Yard | 0 | 10 | 0 | 3000 | 3x3 |
| Power Node | 600 | 30 | 0 | 900 | 2x2 |
| Processor | 1200 | 0 | 8 | 1800 | 3x3 |
| Barracks | 500 | 0 | 4 | 800 | 2x2 |
| Vehicle Foundry | 1500 | 0 | 10 | 1800 | 3x3 |
| Radar Relay | 900 | 0 | 8 | 700 | 2x2 |
| Research Lab | 1800 | 0 | 12 | 1000 | 2x2 |
| Stabilizer Tower | 700 | 0 | 6 | 900 | 1x1 |

## Units
| Unit | Cost | HP | Speed | Role |
|---|---:|---:|---:|---|
| Surveyor | 250 | 120 | fast | scout |
| Rifle Team | 120 | 80 | medium | infantry |
| Engineer | 350 | 60 | medium | capture |
| Harvester | 800 | 600 | slow | economy |
| Light Rover | 400 | 250 | fast | harassment |
| Combat Tank | 700 | 600 | medium | armor |
| Missile Carrier | 650 | 350 | medium | anti-armor/air |
| Mobile Repair Rig | 600 | 300 | medium | support |

## Planet Agitation
| Action | Agitation |
|---|---:|
| Blue shard harvest tick | +0.01 local |
| Red shard harvest tick | +0.03 local |
| Heavy unit on deep crust | +0.02/sec local |
| Explosion | +0.5 local |
| Raw-ground building | +0.02/sec local |
| Power spike >20 surplus delta | +2 global |
| Thumper active | +1/sec local |

