import { Pokemon } from "../../../commonClass/pokemon/pokemon/pokemon";
import { SCENE_KEYS } from "../../../commonData/dataScenes";
import { PokemonPartyType, activePokemonEncounterType, playerSessionType } from "../../../commonTypes/typeDefs";
import { baseBattleScene, findEligiblePokemonPartyMember } from "./baseBattleScene";
 

export class WildEncounterScene extends baseBattleScene {
    constructor(){
        super(SCENE_KEYS.WILD_ENCOUNTER_SCENE)
    }

    init(data: any){
        this.playerSession = data.playerSession;
        
        console.log(this.playerSession)
        if(data.backgroundAssetKey){this.backgroundAssetKey = data.backgroundAssetKey}
        // To-Do Generate Random Move Sets
        let encounteredPokemon = data.pokemonEncountered
        this.opponentPokemonParty = [new Pokemon(undefined, encounteredPokemon.pokemon, encounteredPokemon.level, undefined, undefined, undefined, undefined, ["TACKLE", "GROWL"])]
        
        this.yourPokemon = this.playerSession?.party[findEligiblePokemonPartyMember(this.playerSession.party)]
        this.opponentPokemon = this.opponentPokemonParty[findEligiblePokemonPartyMember(this.opponentPokemonParty)]

    }
    
    // Overwrite Parent Method
    initialBattleLoad(){
        this.opponentPokemonSprite!.pokemonSprite?.setVisible(true)
        this.battleSelectMenu?.displayDialog([`Oh no, a wild ${this.opponentPokemon?.name} has appeared......`, `Go ${this.yourPokemon?.name}!`], true, () => {
            this.yourPokemonSprite?.pokemonSprite?.setVisible(true);
            this.battleSelectMenu?.updateDialogVisibility(false)
        });    
    }
}