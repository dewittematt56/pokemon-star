import { Character, CharacterConfig } from "../characters";
import { DIRECTION_TYPE, DIRECTION } from "../../utils/controls/direction";
import { ANIMATIONS } from "../../../commonData/commonAnimations";
import { PokemonConfig, PokemonPartyType } from "../../../commonTypes/typeDefs";
import { Pokemon } from "../../../commonClass/pokemon/pokemon/pokemon";

export type NpcTrainerConfig = {
    pokemon: PokemonConfig[]
}

export class NpcTrainer extends Character {
    public pokemonParty: PokemonPartyType;

    constructor(config: CharacterConfig, trainerConfig: NpcTrainerConfig){
        super({
            ...config,
            assetKey: config.assetKey
        })
        this.pokemonParty = trainerConfig.pokemon.map((pokemon) => new Pokemon(undefined, pokemon.pokemon, pokemon.level, pokemon.ivData, pokemon.evData, pokemon.currentHp, undefined, pokemon.moves))
    }

    // To-Do Implement Game Sprite and Dialog

    // To-Do Implement Walking Movement Pattern


}