import { UnitType } from '../core/types';

export const sampleUnits: any[] = [
    {
        id: 'harvester-1',
        type: UnitType.HARVESTER,
        position: { x: 200, y: 200 },
        targetPosition: null,
        speed: 50,
        carrying: 0,
        maxCarrying: 100,
        faction: 'vanguard',
        isSelected: false,
        visionRadius: 5
    }
];