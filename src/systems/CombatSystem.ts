import type { GameStateType } from '../core/GameState';
import type { Unit, Position, Projectile } from '../core/types';

export class CombatSystem {
    private gameState: GameStateType;

    constructor(gameState: GameStateType) {
        this.gameState = gameState;
    }

    setGameState(gameState: GameStateType): void {
        this.gameState = gameState;
    }

    // Attack command
    attackUnit(unitId: string, targetId: string): boolean {
        const unit = this.gameState.units.find(u => u.id === unitId);
        const target = this.gameState.units.find(u => u.id === targetId);

        if (!unit || !target) return false;
        if (unit.faction === target.faction) return false;

        unit.targetPosition = target.position;
        return true;
    }

    attackBuilding(unitId: string, buildingId: string): boolean {
        const unit = this.gameState.units.find(u => u.id === unitId);
        const building = this.gameState.buildings.find(b => b.id === buildingId);

        if (!unit || !building) return false;
        if (unit.faction === building.type) return false;

        unit.targetPosition = building.position;
        return true;
    }

    // Auto-acquire hostile targets
    autoAcquireTargets(): void {
        const state = this.gameState;

        for (const unit of state.units) {
            if (unit.faction === 'vanguard') {
                // Find nearest hostile unit
                let nearestHostile: Unit | null = null;
                let nearestDist = Infinity;

                for (const other of state.units) {
                    if (other.faction !== 'vanguard' && !other.isDead) {
                        const dx = other.position.x - unit.position.x;
                        const dy = other.position.y - unit.position.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < nearestDist && dist <= unit.attackRange) {
                            nearestDist = dist;
                            nearestHostile = other;
                        }
                    }
                }

                if (nearestHostile) {
                    unit.targetPosition = nearestHostile.position;
                }
            }
        }
    }

    // Update units (attack cooldown, damage)
    updateUnits(): void {
        const state = this.gameState;

        state.units.forEach(unit => {
            if (unit.isDead) return;

            // Check if unit has a target
            if (unit.targetPosition) {
                const dx = unit.targetPosition.x - unit.position.x;
                const dy = unit.targetPosition.y - unit.position.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // If in range, attack
                if (dist <= unit.attackRange) {
                    if (Date.now() - unit.lastAttackTime >= unit.attackCooldown) {
                        this.performAttack(unit);
                        unit.lastAttackTime = Date.now();
                    }
                }
            }
        });
    }
    private performAttack(unit: Unit): void {
            const state = this.gameState;

            // Find target at unit's position
            const target = state.units.find(u =>
                u.id !== unit.id &&
                u.faction !== unit.faction &&
                !u.isDead &&
                Math.abs(u.position.x - unit.position.x) < 10 &&
                Math.abs(u.position.y - unit.position.y) < 10
            );

            if (target) {
                // Apply damage
                target.hp -= unit.attackDamage;
                if (target.hp <= 0) {
                    target.hp = 0;
                    target.isDead = true;
                }
            }
        }

    // Create projectile
    fireProjectile(source: Position, target: Position, damage: number, ownerFaction: string): Projectile {
        const projectile: Projectile = {
            id: `projectile-${Date.now()}-${Math.random()}`,
            position: { ...source },
            target: { ...target },
            speed: 500,
            damage,
            ownerFaction,
            isDead: false
        };

        this.gameState.projectiles.push(projectile);
        return projectile;
    }

    // Update projectiles
    updateProjectiles(deltaTime: number): void {
        const state = this.gameState;
        const toRemove: string[] = [];

        state.projectiles.forEach(projectile => {
            if (projectile.isDead) {
                toRemove.push(projectile.id);
                return;
            }

            const dx = projectile.target.x - projectile.position.x;
            const dy = projectile.target.y - projectile.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 5) {
                projectile.isDead = true;
                toRemove.push(projectile.id);

                // Apply damage to target
                const target = state.units.find(u =>
                    !u.isDead &&
                    Math.abs(u.position.x - projectile.position.x) < 10 &&
                    Math.abs(u.position.y - projectile.position.y) < 10
                );

                if (target) {
                    target.hp -= projectile.damage;
                    if (target.hp <= 0) {
                        target.hp = 0;
                        target.isDead = true;
                    }
                }
            } else {
                const speed = projectile.speed * deltaTime;
                projectile.position.x += (dx / dist) * speed;
                projectile.position.y += (dy / dist) * speed;
            }
        });

        toRemove.forEach(id => {
            const idx = state.projectiles.findIndex(p => p.id === id);
            if (idx !== -1) {
                state.projectiles.splice(idx, 1);
            }
        });
    }

    // Check if any unit is dead
    checkUnitDeaths(): void {
        const state = this.gameState;
        state.units = state.units.filter(unit => !unit.isDead);
    }

    // Check if any building is dead
    checkBuildingDeaths(): void {
        const state = this.gameState;
        state.buildings = state.buildings.filter(building => !building.isDead);
    }
}