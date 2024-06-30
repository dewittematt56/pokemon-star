import { Character, CharacterConfig } from "../characters";
import { DIRECTION_TYPE, DIRECTION } from "../../utils/controls/direction";
import { ANIMATIONS } from "../../../commonData/commonAnimations";
import { AnimatedImageType, NpcWorldImage, PokemonConfig, PokemonPartyType, npcDialog } from "../../../commonTypes/typeDefs";
import { Pokemon } from "../../../commonClass/pokemon/pokemon/pokemon";

export type NpcTrainerConfig = {
    pokemon: PokemonConfig[],
    dialog: npcDialog,
    portrait: AnimatedImageType,
    npcWorldImage: NpcWorldImage,
    movementPattern: DIRECTION_TYPE[]
}

export class NpcTrainer extends Character {
    public pokemonParty: PokemonPartyType;
    public dialog: npcDialog;
    private npcPortraitInfo: AnimatedImageType | undefined;
    public npcTrainerSprite: Phaser.GameObjects.Sprite | undefined;

    public movementPattern: DIRECTION_TYPE[];
    public movementIndex: number;

    constructor(config: CharacterConfig, trainerConfig: NpcTrainerConfig){
        super({
            ...config,
            assetKey: config.assetKey
        })
        // Create NPC Movement Animations
        trainerConfig.npcWorldImage.animations.forEach((animationObject) => {
            const frames = animationObject.frames
                ? this._scene.anims.generateFrameNames(animationObject.assetKey, { frames: animationObject.frames })
                : this._scene.anims.generateFrameNames(animationObject.assetKey);

                this._scene.anims.create({
                key: animationObject.key,
                frames: frames,
                frameRate: animationObject.frameRate * 2,
                repeat: animationObject.repeat,
                delay: animationObject.delay,
                yoyo: animationObject.yoyo,
                
            });
        });

        this.pokemonParty = trainerConfig.pokemon.map((pokemon) => new Pokemon(undefined, pokemon.pokemon, pokemon.level, pokemon.ivData, pokemon.evData, pokemon.currentHp, undefined, pokemon.moves))
        this.dialog = trainerConfig.dialog
        this.npcPortraitInfo = trainerConfig.portrait
        
        this.movementIndex = 0
        this.movementPattern = trainerConfig.movementPattern
        
        this.spriteSpeedFactor = 1.25;
        this._spriteGridMovementFinishedCallback = () => {
            this.movementIndex++;
            if(this.movementIndex > this.movementPattern.length){
                this.movementIndex = 0;
            }
            this.moveCharacter(this.movementPattern[this.movementIndex])
        }
        this.moveCharacter(this.movementPattern[this.movementIndex])
    }

    // To-Do Implement Game Sprite and Dialog
    buildTrainerSpite(x: number, y: number){
        if(this.npcPortraitInfo){
            // new Phaser.GameObjects.Sprite(this._scene, x, y, this.npcPortraitInfo.assetKey);
            this.npcTrainerSprite = this._scene.add.sprite((x + (this.npcPortraitInfo.width / 2)), y + (this.npcPortraitInfo.height / 2), this.npcPortraitInfo.assetKey).setScale(4)
            this._scene.anims.create({
                key: this.npcPortraitInfo.assetKey,
                frames: this._scene.anims.generateFrameNumbers(this.npcPortraitInfo.assetKey, { start: this.npcPortraitInfo.animStart, end: this.npcPortraitInfo.animFinish }),
                frameRate: this.npcPortraitInfo.frameRate,
                repeat: 0
            });
            this.npcTrainerSprite.play(this.npcPortraitInfo.assetKey)
        }

    }

    
    // To-Do Implement Walking Movement Pattern
    performCharacterMovements(){
        
    }


}