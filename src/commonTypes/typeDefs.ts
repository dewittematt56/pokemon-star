import { PokemonMove } from "../commonClass/pokemon/pokemonMove"

export type PokemonImageDataType = {
    frontImage: AnimatedImageType,
    backImage: AnimatedImageType,
    iconImage: AnimatedImageType
}

export type AnimatedImageType = {
    assetKey: string
    path: string,
    height: number,
    width: number,
    animStart: number,
    animFinish: number,
    frameRate: number
} 

export type PokemonStatsType = {
    currentHp: number,
    maxHp: number,
    currentExperience: number,
    maxExperience: number,
    speed: number,
    physicalAttack: number,
    specialAttack: number,
    physicalDefense: number,
    specialDefense: number
}

export type PokemonBattleDataType = {
    moves: PokemonMove []
} 

export type PokemonMetaDataType = {

}

export type BasePokemon = {
    uniqueId: string,
    pokeDexKey: string,
    name: string,
    level: number,
    sex: "MALE" | "FEMALE" | "UNK",
    pokemonStatData: PokemonStatsType
    pokemonBattleData: PokemonBattleDataType,
    pokemonImageData: PokemonImageDataType,
    pokemonMetaData: PokemonMetaDataType
}

/*------------------------- Pokemon Party Types -------------------------*/
export type PokemonPartyMemberType = {
    pokemon: BasePokemon,
}

export type PokemonPartyType = PokemonPartyMemberType[];



