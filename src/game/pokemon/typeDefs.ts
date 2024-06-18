export type PokemonBattleData = {

}

export type PokemonImageData = {

} 

export type PokemonMetaData = {

}

export type BasePokemon = {
    uniqueId: string,
    name: string,
    level: number,
    sex: "MALE" | "FEMALE" | "UNK",
    experience: number,
    pokemonBattleData: PokemonBattleData,
    pokemonImageData: PokemonImageData,
    pokemonMetaData: PokemonMetaData
}

/*------------------------- Pokemon Party Types -------------------------*/
export type PokemonPartyType = []

export type PokemonPartyMember = {
    pokemon: BasePokemon,
    // To-Do Item
}


export const constMockPokemonParty: PokemonPartyType = [

]