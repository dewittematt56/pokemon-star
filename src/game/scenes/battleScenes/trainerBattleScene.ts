import { Pokemon } from "../../../commonClass/pokemon/pokemon/pokemon";
import { SCENE_KEYS } from "../../../commonData/dataScenes";
import { PokemonPartyType, activePokemonEncounterType, playerSessionType } from "../../../commonTypes/typeDefs";
import { baseBattleScene, findEligiblePokemonPartyMember } from "./baseBattleScene";
 

export class TrainerBattleScene extends baseBattleScene {
    constructor(){
        super(SCENE_KEYS.TRAINER_BATTLE_SCENE)
    }

    init(data: any){
        this.playerSession = data.playerSession;
        
        if(data.backgroundAssetKey){this.backgroundAssetKey = data.backgroundAssetKey}
        // To-Do Generate Random Move Sets
        let encounteredPokemon = data.pokemonEncountered
        this.opponentPokemonParty = [new Pokemon(undefined, encounteredPokemon.pokemon, encounteredPokemon.level, undefined, undefined, undefined, undefined, ["TACKLE", "GROWL"])]
        
        this.yourPokemon = this.playerSession?.party[findEligiblePokemonPartyMember(this.playerSession.party)]
        this.opponentPokemon = this.opponentPokemonParty[findEligiblePokemonPartyMember(this.opponentPokemonParty)]

    }   
}