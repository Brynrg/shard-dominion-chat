export const sampleBuildings = {
  constructionYard: {
    id: 'construction_yard',
    name: 'Construction Yard',
    faction: 'shared',
    cost: 0,
    hp: 3000,
    footprint: { w: 3, h: 3 },
    powerGenerated: 10,
    powerUsed: 0,
    requiresLattice: false,
    produces: ['lattice', 'power_node', 'processor', 'barracks'],
    abilities: ['buildRadius']
  },
  processor: {
    id: 'processor',
    name: 'Processor',
    faction: 'shared',
    cost: 1200,
    hp: 1800,
    footprint: { w: 3, h: 3 },
    powerGenerated: 0,
    powerUsed: 8,
    requiresLattice: true,
    produces: ['harvester'],
    abilities: ['processAether']
  }
} as const;
