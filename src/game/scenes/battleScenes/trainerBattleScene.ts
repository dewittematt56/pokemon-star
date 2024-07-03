import { NpcTrainer } from "../../../commonClass/characters/npcTrainer/npcTrainer";
import { Pokemon } from "../../../commonClass/pokemon/pokemon/pokemon";
import { SCENE_INFO, SCENE_KEYS } from "../../../commonData/dataScenes";
import { PokemonPartyType, activePokemonEncounterType, playerSessionType } from "../../../commonTypes/typeDefs";
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
        this.battleSelectMenu?.displayDialog(this.npcTrainer!.dialog.openingBattleMessages, true, () => {
            // Hide Opponent Trainer Sprite
            this.npcTrainer?.npcTrainerSprite?.setVisible(false);
            // Display Pokemon
            this.opponentPokemonSprite?.pokemonSprite?.setVisible(true)
            this.yourPokemonSprite?.pokemonSprite?.setVisible(true);
            this.battleSelectMenu?.updateDialogVisibility(false)
        });    
    }


    exitRun = () => {
        this.battleSelectMenu?.displayDialog(this.npcTrainer!.dialog.defeatMessages, true, () => {
            this.npcTrainer!.hasBeenBeaten = true;
            this.battleSelectMenu?.updateDialogVisibility(false)
        })
    }

    updateSceneInfo = (isTrainerBeaten: boolean) => {
        let currentWorldScene = this.playerSession!.location.currentWorldScene;
        if(!this.playerSession?.scenes){
            this.playerSession!.scenes = [{
                sceneId: this.playerSession!.location.currentWorldScene,
                npcInfo: []
            }]
        }
        let playerSessionScene = this.playerSession?.scenes.find((scene) => scene.sceneId == currentWorldScene)
        let currentNpcData = playerSessionScene?.npcInfo.find((npcInfo) => npcInfo.npcId == this.npcTrainer!.id);
        if(currentNpcData){
            currentNpcData.hasBeenBeaten = isTrainerBeaten;
        } else {
            playerSessionScene!.npcInfo.push({npcId: this.npcTrainer!.id, hasBeenBeaten: isTrainerBeaten});
        }
        console.log(this.playerSession)
    }

    exitVictory = () => {
        this.updatePokemonPlayerSessionData();
        this.updateSceneInfo(true);
        this.battleSelectMenu?.displayDialog([], true, () => {
            this.cameras.main.fadeOut(2000, 0, 0, 0)
            this.scene.start(SCENE_KEYS.WORLD_SCENE, {
                playerSession: this.playerSession
            })
        });
    }
}