import { PokemonMove, moveClasses } from "../../commonClass/pokemon/pokemonMove";
import { Pokemon } from "../../commonClass/pokemon/pokemon/pokemon";

export function calculateMoveDamage(attacker: Pokemon, attackerMove: PokemonMove, defender: Pokemon, attackType: moveClasses): number {
    // Base calculation for damage
    const baseDamage = Math.floor((2 * attacker.level) / 5 + 2);
    if (attackType == "PHYSICAL_ATTACK") {
        return Math.floor(
            Math.floor(
                (baseDamage * attacker.stats.attack * attackerMove.moveAttack) /
                defender.stats.defense
            ) / 50
        ) + 2;
    } else if (attackType == "SPECIAL_ATTACK") {
        return Math.floor(
            Math.floor(
                (baseDamage * attacker.stats.specialAttack * attackerMove.moveAttack) /
                defender.stats.specialDefense
            ) / 50
        ) + 2;
    } else {
        return 0;
    }
}

export function calculateCriticalHit(critHitFactor: number): boolean {
    return false
}

export function calculateTypeDamageMultiplier(): boolean {
    return false
}

export function calculateDidMoveHitOpponent(): boolean{
    return true
}

