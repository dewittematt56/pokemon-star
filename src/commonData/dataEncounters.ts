import { PokemonEncounterType } from "../commonTypes/typeDefs";

export const pokemonRouteEncounters = Object.freeze<{[key: string]: PokemonEncounterType[]}>({
    "ROUTE_101": [
            {
                pokemon: "POOCHYENA",
                rate: 0.66,
                minLevel: 4,
                maxLevel: 6
            },
            {
                pokemon: "BULBASAUR",
                rate: 0.33,
                minLevel: 4,
                maxLevel: 6
            }
        ]
})