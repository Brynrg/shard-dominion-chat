export const sampleUnits = {
  surveyor: {
    id: 'surveyor',
    name: 'Surveyor',
    faction: 'shared',
    cost: 250,
    hp: 120,
    speed: 120,
    vision: 8,
    footprint: { w: 1, h: 1 },
    armorType: 'lightVehicle',
    weaponIds: [],
    abilities: ['scanTerrain'],
    tags: ['scout', 'vehicle']
  },
  harvester: {
    id: 'harvester',
    name: 'Harvester',
    faction: 'shared',
    cost: 800,
    hp: 600,
    speed: 70,
    vision: 5,
    footprint: { w: 1, h: 1 },
    armorType: 'heavyVehicle',
    weaponIds: [],
    abilities: ['harvestAether'],
    tags: ['economy', 'vehicle']
  }
} as const;
