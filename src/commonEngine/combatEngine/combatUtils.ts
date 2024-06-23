import { PokemonMove, moveClasses } from "../../commonClass/pokemon/pokemonMove";
import { PokemonPartyMemberType } from "../../commonTypes/typeDefs";

export function calculateMoveDamage(attacker: PokemonPartyMemberType, attackerMove: PokemonMove, defender: PokemonPartyMemberType, attackType: moveClasses): number {
    // Base calculation for damage
    const baseDamage = Math.floor((2 * attacker.pokemon.level) / 5 + 2);
    if (attackType == "PHYSICAL_ATTACK") {
        return Math.floor(
            Math.floor(
                (baseDamage * attacker.pokemon.pokemonStatData.physicalAttack * attackerMove.moveAttack) /
                defender.pokemon.pokemonStatData.physicalDefense
            ) / 50
        ) + 2;
    } else if (attackType == "SPECIAL_ATTACK") {
        return Math.floor(
            Math.floor(
                (baseDamage * attacker.pokemon.pokemonStatData.specialAttack * attackerMove.moveAttack) /
                defender.pokemon.pokemonStatData.specialDefense
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

