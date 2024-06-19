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

export type PokemonBattleMove = {
    id: string
    name: string,
    // To-Do Create Generic Types
    type: string
}

export type PokemonBattleDataType = {
    moves: []
} 

export type PokemonMetaDataType = {

}

export type BasePokemon = {
    uniqueId: string,
    pokeDexKey: string,
    name: string,
    level: number,
    sex: "MALE" | "FEMALE" | "UNK",
    experience: number,
    pokemonBattleData: PokemonBattleDataType,
    pokemonImageData: PokemonImageDataType,
    pokemonMetaData: PokemonMetaDataType
}

/*------------------------- Pokemon Party Types -------------------------*/
export type PokemonPartyMemberType = {
    pokemon: BasePokemon,
}

export type PokemonPartyType = PokemonPartyMemberType[];



