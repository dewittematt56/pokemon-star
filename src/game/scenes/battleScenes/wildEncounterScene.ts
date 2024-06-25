import { Pokemon } from "../../../commonClass/pokemon/pokemon/pokemon";
import { SCENE_KEYS } from "../../../commonData/keysScene";
import { PokemonPartyType, activePokemonEncounterType } from "../../../commonTypes/typeDefs";
import { baseBattleScene, findEligiblePokemonPartyMember } from "./baseBattleScene";
 

export class WildEncounterScene extends baseBattleScene {
    constructor(){
        super(SCENE_KEYS.WILD_ENCOUNTER_SCENE)
    }

    init(data: any){
        this.playerPokemonParty = data.yourPokemonParty as PokemonPartyType
        
        if(data.playerEndX){this.playerEndX = data.playerEndX}
        if(data.playerEndY){this.playerEndY = data.playerEndY}
        if(data.backgroundAssetKey){this.backgroundAssetKey = data.backgroundAssetKey}
        // To-Do Generate Random Move Sets
        let encounteredPokemon = data.pokemonEncountered as activePokemonEncounterType
        this.opponentPokemonParty = [new Pokemon(encounteredPokemon.pokemon, encounteredPokemon.level, undefined, undefined, undefined, undefined, ["TACKLE", "GROWL"])]
        
        this.yourPokemon = this.playerPokemonParty[findEligiblePokemonPartyMember(this.playerPokemonParty)]
        this.opponentPokemon =  this.opponentPokemonParty[findEligiblePokemonPartyMember( this.opponentPokemonParty)]

    }   
}