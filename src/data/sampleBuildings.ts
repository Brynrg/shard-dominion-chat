import type { Building } from '../core/types';
import { BuildingType } from '../core/types';

export const sampleBuildings: Building[] = [
    {
        id: 'processor-1',
        type: BuildingType.PROCESSOR,
        position: { x: 400, y: 300 },
        bounds: { x: 400, y: 300, width: 40, height: 40 },
        power: 50,
        maxPower: 50,
        hp: 100,
        maxHp: 100,
        isPowered: true,
        isDead: false
    },
    {
        id: 'command-center-1',
        type: BuildingType.COMMAND_CENTER,
        position: { x: 100, y: 100 },
        bounds: { x: 100, y: 100, width: 60, height: 60 },
        power: 100,
        maxPower: 100,
        hp: 200,
        maxHp: 200,
        isPowered: true,
        isDead: false
    }
];