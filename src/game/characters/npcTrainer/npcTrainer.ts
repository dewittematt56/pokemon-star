import { Character, CharacterConfig } from "../characters";
import { DIRECTION_TYPE, DIRECTION } from "../../utils/controls/direction";
import { ANIMATIONS } from "../../../commonData/commonAnimations";
import { AnimatedImageType, PokemonConfig, PokemonPartyType, npcDialog } from "../../../commonTypes/typeDefs";
import { Pokemon } from "../../../commonClass/pokemon/pokemon/pokemon";

export type NpcTrainerConfig = {
    pokemon: PokemonConfig[],
    dialog: npcDialog,
    portrait: AnimatedImageType
}

export class NpcTrainer extends Character {
    public pokemonParty: PokemonPartyType;
    public dialog: npcDialog;
    private npcPortraitInfo: AnimatedImageType | undefined;
    public npcTrainerSprite: Phaser.GameObjects.Sprite | undefined;
    

    constructor(config: CharacterConfig, trainerConfig: NpcTrainerConfig){
        super({
            ...config,
            assetKey: config.assetKey
        })
        this.pokemonParty = trainerConfig.pokemon.map((pokemon) => new Pokemon(undefined, pokemon.pokemon, pokemon.level, pokemon.ivData, pokemon.evData, pokemon.currentHp, undefined, pokemon.moves))
        this.dialog = trainerConfig.dialog
        this.npcPortraitInfo = trainerConfig.portrait
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


}