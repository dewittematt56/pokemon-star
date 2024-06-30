import { Pokemon } from "../../../commonClass/pokemon/pokemon/pokemon";
import { SCENE_KEYS } from "../../../commonData/dataScenes";
import { PokemonPartyType, activePokemonEncounterType, playerSessionType } from "../../../commonTypes/typeDefs";
import { NpcTrainer } from "../../characters/npcTrainer/npcTrainer";
import { baseBattleScene, findEligiblePokemonPartyMember } from "./baseBattleScene";
 

export class TrainerBattleScene extends baseBattleScene {
    public npcTrainer: NpcTrainer | undefined;

    constructor(){
        super(SCENE_KEYS.TRAINER_BATTLE_SCENE)
    }

    init(data: any){
        this.playerSession = data.playerSession;
        
        if(data.backgroundAssetKey){this.backgroundAssetKey = data.backgroundAssetKey}
        // To-Do Generate Random Move Sets
        this.npcTrainer = data.npcTrainer;
        this.npcTrainer!._scene = this;
        this.opponentPokemonParty = this.npcTrainer!.pokemonParty;

        this.yourPokemon = this.playerSession?.party[findEligiblePokemonPartyMember(this.playerSession.party)]
        this.opponentPokemon = this.opponentPokemonParty[findEligiblePokemonPartyMember(this.opponentPokemonParty)]

    }
    
    initialBattleLoad(){
        // To-Do Display Trainer Sprite
        this.npcTrainer?.buildTrainerSpite((this._backgroundImageBoundsObject!.width / 1.45), (this._backgroundImageBoundsObject!.height / 3.3));
        this.battleSelectMenu?.displayDialog(this.npcTrainer!.dialog.openingMessages, true, () => {
            // Hide Opponent Trainer Sprite
            this.npcTrainer?.npcTrainerSprite?.setVisible(false);
            // Display Pokemon
            this.opponentPokemonSprite?.pokemonSprite?.setVisible(true)
            this.yourPokemonSprite?.pokemonSprite?.setVisible(true);
            this.battleSelectMenu?.updateDialogVisibility(false)
        });    
    }


    exitRun = () => {
        this.battleSelectMenu?.displayDialog(["Cannot run during a trainer battle."], true, () => {
            this.battleSelectMenu?.updateDialogVisibility(false)
        })
    }
}