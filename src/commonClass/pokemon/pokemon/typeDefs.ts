import { POKEMON } from "../../../commonData/dataPokemon";

export type PokemonKey = keyof typeof POKEMON

export type PokemonBase = typeof POKEMON[PokemonKey]

export type PokemonBaseStats = {
    hp: number,
    attack: number,
    defense: number,
    specialAttack: number,
    specialDefense: number,
    speed: number
}

export type IvData = {
    hp: number,
    attack: number,
    defense: number,
    specialAttack: number,
    specialDefense: number,
    speed: number
}

export type EvData = {
    hp: number,
    attack: number,
    defense: number,
    specialAttack: number,
    specialDefense: number,
    speed: number
}


export type StatData = {
    hp: number,
    attack: number,
    defense: number,
    specialAttack: number,
    specialDefense: number,
    speed: number
}