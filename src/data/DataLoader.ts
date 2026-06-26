import { UnitType } from '../core/types';
import { BuildingType } from '../core/types';

export interface UnitData {
    id: string;
    type: string;
    position: { x: number; y: number };
    targetPosition: null | { x: number; y: number };
    speed: number;
    carrying: number;
    maxCarrying: number;
    faction: string;
    isSelected: boolean;
    visionRadius: number;
    hp: number;
    maxHp: number;
    isDead: boolean;
    attackRange: number;
    attackDamage: number;
    attackCooldown: number;
    lastAttackTime: number;
}

export interface BuildingData {
    id: string;
    type: string;
    position: { x: number; y: number };
    bounds: { x: number; y: number; width: number; height: number };
    power: number;
    maxPower: number;
    hp: number;
    maxHp: number;
    isPowered: boolean;
    isDead: boolean;
}

export class DataLoader {
    private static validateUnitData(data: any): UnitData {
        const requiredFields = ['id', 'type', 'position', 'speed', 'carrying', 'maxCarrying', 'faction', 'isSelected', 'visionRadius', 'hp', 'maxHp', 'isDead', 'attackRange', 'attackDamage', 'attackCooldown', 'lastAttackTime'];
        
        for (const field of requiredFields) {
            if (!(field in data)) {
                throw new Error(`Missing required field '${field}' in unit data`);
            }
        }

        if (typeof data.id !== 'string') {
            throw new Error('Unit id must be a string');
        }
        
        if (!Object.values(UnitType).includes(data.type)) {
            throw new Error(`Invalid unit type: ${data.type}. Must be one of: ${Object.values(UnitType).join(', ')}`);
        }

        if (!data.position || typeof data.position.x !== 'number' || typeof data.position.y !== 'number') {
            throw new Error('Unit position must be an object with x and y numbers');
        }

        return data as UnitData;
    }

    private static validateBuildingData(data: any): BuildingData {
        const requiredFields = ['id', 'type', 'position', 'bounds', 'power', 'maxPower', 'hp', 'maxHp', 'isPowered', 'isDead'];
        
        for (const field of requiredFields) {
            if (!(field in data)) {
                throw new Error(`Missing required field '${field}' in building data`);
            }
        }

        if (typeof data.id !== 'string') {
            throw new Error('Building id must be a string');
        }
        
        if (!Object.values(BuildingType).includes(data.type)) {
            throw new Error(`Invalid building type: ${data.type}. Must be one of: ${Object.values(BuildingType).join(', ')}`);
        }

        if (!data.position || typeof data.position.x !== 'number' || typeof data.position.y !== 'number') {
            throw new Error('Building position must be an object with x and y numbers');
        }

        if (!data.bounds || typeof data.bounds.x !== 'number' || typeof data.bounds.y !== 'number' || 
            typeof data.bounds.width !== 'number' || typeof data.bounds.height !== 'number') {
            throw new Error('Building bounds must be an object with x, y, width, height numbers');
        }

        return data as BuildingData;
    }

    static async loadUnits(): Promise<UnitData[]> {
        try {
            const response = await fetch('/src/data/units.json');
            if (!response.ok) {
                throw new Error(`Failed to load units: ${response.statusText}`);
            }
            const data = await response.json();
            
            if (!Array.isArray(data)) {
                throw new Error('Units data must be an array');
            }
            
            return data.map(item => this.validateUnitData(item));
        } catch (error) {
            console.error('Error loading units:', error);
            throw error;
        }
    }

    static async loadBuildings(): Promise<BuildingData[]> {
        try {
            const response = await fetch('/src/data/buildings.json');
            if (!response.ok) {
                throw new Error(`Failed to load buildings: ${response.statusText}`);
            }
            const data = await response.json();
            
            if (!Array.isArray(data)) {
                throw new Error('Buildings data must be an array');
            }
            
            return data.map(item => this.validateBuildingData(item));
        } catch (error) {
            console.error('Error loading buildings:', error);
            throw error;
        }
    }
}