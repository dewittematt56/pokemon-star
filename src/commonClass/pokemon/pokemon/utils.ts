import { EvData, IvData, StatData } from "./typeDefs";

export function generateIvData(): IvData {
    return {
        hp: 1,
        attack: 1,
        defense: 1,
        specialAttack: 1,
        specialDefense: 1,
        speed: 1
    }
}

export function generateBaseEvData(): IvData {
    return {
        hp: 1,
        attack: 1,
        defense: 1,
        specialAttack: 1,
        specialDefense: 1,
        speed: 1
    }
}

export function calculatePokemonStats(baseStats: StatData, ivData: IvData, evData: EvData, level: number): StatData {
    return {
        hp: calculateMaxHp(baseStats.hp, ivData.hp, evData.hp, level),
        attack: calculateStat(baseStats.attack, ivData.attack, evData.attack, level),
        defense: calculateStat(baseStats.defense, ivData.defense, evData.defense, level),
        specialAttack: calculateStat(baseStats.specialAttack, ivData.specialAttack, evData.specialAttack, level),
        specialDefense: calculateStat(baseStats.specialDefense, ivData.specialDefense, evData.specialDefense, level),
        speed: calculateStat(baseStats.speed, ivData.speed, evData.speed, level)
    }
}

export function calculateStat(base: number, iv: number, ev: number, level: number): number{
    return Math.floor(Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100 + 5) * 1);
}

export function calculateMaxHp(baseHp: number, ivHp: number, evHp: number, level: number): number{
    return Math.floor((2 * baseHp + ivHp + evHp) * level / 100 + level + 10)
}