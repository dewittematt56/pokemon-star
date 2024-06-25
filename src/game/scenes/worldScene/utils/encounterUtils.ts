import { pokemonRouteEncounters } from "../../../../commonData/dataEncounters";
import { PokemonEncounterType, activePokemonEncounterType } from "../../../../commonTypes/typeDefs";

export function didPokemonAppearInZone(): boolean{
    return Math.random() * 100 > 90
}

function generateRandomLevel(minLevel: number, maxLevel: number): number {
    return Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
}

export function getPokemonEncountered(routeKey: keyof typeof pokemonRouteEncounters): activePokemonEncounterType {
    const encounters = pokemonRouteEncounters[routeKey];
    const selectedEncounter = selectPokemonEncounter(encounters);
    const level = generateRandomLevel(selectedEncounter.minLevel, selectedEncounter.maxLevel);

    return {
        pokemon: selectedEncounter.pokemon,
        level: level
    };
}

function selectPokemonEncounter(encounters: PokemonEncounterType[]): PokemonEncounterType {
    const totalRate = encounters.reduce((acc, encounter) => acc + encounter.rate, 0);
    const randomValue = Math.random() * totalRate;
    let cumulativeRate = 0;

    for (const encounter of encounters) {
        cumulativeRate += encounter.rate;
        if (randomValue <= cumulativeRate) {
            return encounter;
        }
    }
    return encounters[encounters.length - 1];
}