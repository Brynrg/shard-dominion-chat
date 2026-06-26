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
        visionRadius: 5,
        hp: 100,
        maxHp: 100,
        isDead: false,
        attackRange: 0,
        attackDamage: 0,
        attackCooldown: 0,
        lastAttackTime: 0
    },
    {
        id: 'harvester-2',
        type: UnitType.HARVESTER,
        position: { x: 400, y: 300 },
        targetPosition: null,
        speed: 50,
        carrying: 0,
        maxCarrying: 100,
        faction: 'vanguard',
        isSelected: false,
        visionRadius: 5,
        hp: 100,
        maxHp: 100,
        isDead: false,
        attackRange: 0,
        attackDamage: 0,
        attackCooldown: 0,
        lastAttackTime: 0
    }
];