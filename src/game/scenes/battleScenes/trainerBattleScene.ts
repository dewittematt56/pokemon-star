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
            setTimeout(() => {
                // Trainer Animation Sprite
                this.tweens.add({
                    targets: this.npcTrainer?.npcTrainerSprite    ,
                    x: '-=100',
                    alpha: 0,     // Fade out to alpha 0
                    duration: 1000,  // Duration of 2 seconds
                    ease: 'Linear', // Easing function
                    onComplete: () => {
                        // Hide Opponent Trainer Sprite
                        this.npcTrainer?.npcTrainerSprite?.setVisible(false);
                        if(this.opponentPokemonSprite){
                            let opponent_start_x = this.opponentPokemonSprite?.pokemonSprite?.x as number
                            let opponent_start_y = this.opponentPokemonSprite?.pokemonSprite?.y as number
                            this.pokemonChangeAnimation(this.opponentPokemonSprite!, opponent_start_x + 100, opponent_start_y - 200, opponent_start_x, opponent_start_y as number, "NORMAL")
                        }
                        if(this.yourPokemonSprite){
                            this.makePokemonAppearSprite(this.yourPokemonSprite)
                        }
                        this.battleSelectMenu?.updateDialogVisibility(false)
                    }
                });
            }, 1000 )

        });    
    }


    exitRun = () => {
        this.battleSelectMenu?.displayDialog(["Cannot run from a trainer while in a battle."], true, () => {
            this.npcTrainer!.hasBeenBeaten = false;
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
        this.battleSelectMenu?.displayDialog(this.npcTrainer!.dialog.victoryMessages, true, () => {
            this.cameras.main.fadeOut(2000, 0, 0, 0)
            this.scene.start(SCENE_KEYS.WORLD_SCENE, {
                playerSession: this.playerSession
            })
        });
    }
}