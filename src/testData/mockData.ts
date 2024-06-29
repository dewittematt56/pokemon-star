import { PokemonPartyType } from "../commonTypes/typeDefs";
import { PokemonMove } from '../commonClass/pokemon/pokemonMove';
import { Pokemon } from "../commonClass/pokemon/pokemon/pokemon";

export const constMockPokemonParty: PokemonPartyType = [
    new Pokemon(undefined, "TORCHIC", 6, undefined, undefined, 21, undefined, ["TACKLE", "EMBER", "GROWL"]),
    new Pokemon(undefined, "BULBASAUR", 5, undefined, undefined, 19, undefined, ["TACKLE", "VINE_WHIP", "SCREECH"])
]

export const constWildPokemonParty: PokemonPartyType = [
    new Pokemon(undefined, "POOCHYENA", 6, undefined, undefined, undefined, undefined, ["TACKLE", "GROWL"])
]
