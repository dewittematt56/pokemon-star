import { Pokemon } from "../../commonClass/pokemon/pokemon/pokemon";

export class BattlePokemonSprite {
    public scene: Phaser.Scene
    public pokemon: Pokemon
    public pokemonSprite: Phaser.GameObjects.Sprite | undefined
    public assetKey: string;
    public isFront: boolean;
    public xPos : number;
    public yPos : number;
    
    constructor(scene: Phaser.Scene, pokemon: Pokemon, x_pos: number, y_pos: number, isFront: boolean){
        this.scene = scene;
        this.pokemon = pokemon;
        this.isFront = isFront;
        this.xPos = x_pos;
        this.yPos = y_pos;
        this.assetKey = "";

        this.buildPokemonSprite();
        this.playAnimation();
    }

    buildPokemonSprite(){
        this.assetKey = this.isFront ? this.pokemon.baseData.pokemonImageData.frontImage.assetKey : this.pokemon.baseData.pokemonImageData.backImage.assetKey;
        let frameRate = this.isFront ? this.pokemon.baseData.pokemonImageData.frontImage.frameRate : this.pokemon.baseData.pokemonImageData.backImage.frameRate;
        let spriteHeight = this.isFront ? this.pokemon.baseData.pokemonImageData.frontImage.height : this.pokemon.baseData.pokemonImageData.backImage.height;
        let spriteWidth = this.isFront ? this.pokemon.baseData.pokemonImageData.frontImage.width : this.pokemon.baseData.pokemonImageData.backImage.width;
        let startFrame = this.isFront ? this.pokemon.baseData.pokemonImageData.frontImage.animStart : this.pokemon.baseData.pokemonImageData.backImage.animStart;
        let endFrame = this.isFront ? this.pokemon.baseData.pokemonImageData.frontImage.animFinish : this.pokemon.baseData.pokemonImageData.backImage.animFinish

        this.pokemonSprite = this.scene.add.sprite((this.xPos + (spriteWidth / 2)), this.yPos - (spriteHeight / 2), this.assetKey).setScale(4);
        this.scene.anims.create({
            key: this.assetKey,
            frames: this.scene.anims.generateFrameNumbers(this.assetKey, { start: startFrame, end: endFrame }),
            frameRate: frameRate,
            repeat: 0
        });
    }

    removeSprite(){
        this.pokemonSprite?.destroy(true);
    }

    updatePokemon(pokemon: Pokemon){
        this.pokemon = pokemon;
        this.removeSprite();
        this.buildPokemonSprite();
        this.playAnimation();
    }

    playAnimation(){
        this.pokemonSprite?.play(this.assetKey);
    }
}