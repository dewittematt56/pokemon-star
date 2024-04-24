import Phaser from "phaser";
import { SCENE_KEYS } from "../sceneKeys";
import { BATTLE_BACKGROUND_ASSETS } from "./battleSceneKeys";
import { POKEMON, PokemonObjectType } from "../../pokemon/pokemon";


export class BattleScene extends Phaser.Scene {
    private _opponentPokemon: Phaser.GameObjects.Sprite | undefined;
    private _yourPokemon: Phaser.GameObjects.Sprite | undefined;
    private _backgroundImageBoundsObject: {x: number, y: number, width: number, height: number} | undefined; 

    constructor(){
        super({
            key: SCENE_KEYS.BATTLE_SCENE
        })
    }

    init(){

    }

    preload(){
        this.load.image(BATTLE_BACKGROUND_ASSETS.FOREST.key, BATTLE_BACKGROUND_ASSETS.FOREST.path);
        this.load.spritesheet(POKEMON.BULBASAUR.key, POKEMON.BULBASAUR.frontImage.path, {
            frameWidth: POKEMON.BULBASAUR.frontImage.width,
            frameHeight: POKEMON.BULBASAUR.frontImage.height,
            startFrame: POKEMON.BULBASAUR.frontImage.animStart,
            endFrame: POKEMON.BULBASAUR.frontImage.animFinish,
        });
        this.load.spritesheet(POKEMON.TORCHIC.key, POKEMON.TORCHIC.backImage.path, {
            frameWidth: POKEMON.TORCHIC.backImage.width,
            frameHeight: POKEMON.TORCHIC.backImage.height,
            startFrame: POKEMON.TORCHIC.backImage.animStart,
            endFrame: POKEMON.TORCHIC.backImage.animFinish
        })
        this.load.image("POKEBALL-ICON", "/assets/misc/pokeball-icon.png")
        
    }

    create(){
        let backgroundImage = this.add.image(0, 0, BATTLE_BACKGROUND_ASSETS.FOREST.key).setOrigin(0).setScale(4)
        this._backgroundImageBoundsObject = {...backgroundImage.getBounds()}

        // To-Do Allow for Array of Inputs
        this.loadOpponentPokemonOntoPage(POKEMON["BULBASAUR"])
        this.loadYourPokemonOntoPage(POKEMON["TORCHIC"])
        this.createHealthBarBox()
    }

    // Refactor
    loadOpponentPokemonOntoPage(pokemon: PokemonObjectType){
        if(this._backgroundImageBoundsObject){
            let x_pos = (this._backgroundImageBoundsObject.width / 2) - pokemon.backImage.width + 225;
            let y_pos = (this._backgroundImageBoundsObject.height / 2) - pokemon.backImage.height - 25;
            this._opponentPokemon = this.add.sprite(x_pos, y_pos, pokemon.key).setOrigin(0).setScale(4);
            this.anims.create({
                key: pokemon.key,
                frames: this.anims.generateFrameNumbers(pokemon.key, { start: 0, end: 31 }),
                frameRate: pokemon.backImage.frameRate,
                repeat: 0
            });
            this._opponentPokemon.play(pokemon.key)
        }
    }

    // Refactor
    loadYourPokemonOntoPage(pokemon: PokemonObjectType){
        if(this._backgroundImageBoundsObject){
            let x_pos = (this._backgroundImageBoundsObject.width / 2) - pokemon.backImage.width - 225;
            let y_pos = (this._backgroundImageBoundsObject.height / 2) - pokemon.backImage.height + 125;
            this._yourPokemon = this.add.sprite(x_pos, y_pos, POKEMON.TORCHIC.key).setOrigin(0).setScale(4)
            this.anims.create({
                key: pokemon.key,
                frames: this.anims.generateFrameNumbers(pokemon.key, { start: 0, end: 31 }),
                frameRate: pokemon.backImage.frameRate,
                repeat: 0
            });
            this._yourPokemon.play(pokemon.key)
        }
    }

    createHealthBarBox(){
        this.createTopBar();
        
        // To-Do Pokeball Icon
        // Lower Bar
        this.add.rectangle(this._backgroundImageBoundsObject!.width - 400 + 2, 425, 400, 100, 0x000).setOrigin(0).setAlpha(0.5).setStrokeStyle(2)

        
    }

    createTopBar(){
        let hasBeenCaught: boolean = true;
        if(hasBeenCaught){
            this.add.image(15, 53, "POKEBALL-ICON").setOrigin(0).setScale(0.09).setDepth(99)
        }
        // Top Bar
        // Parent Box
        this.add.rectangle(0 - 2, 24, 371, 72, 0x2f3640).setOrigin(0).setAlpha(0.7).setStrokeStyle(1)
        this.add.rectangle(0 - 2, 25, 370, 70, 0x353b48).setOrigin(0).setAlpha(0.7).setStrokeStyle(2)
        // Hp Box
        this.add.rectangle(105, 60, 250, 20, 0x4cd137).setOrigin(0).setAlpha(.9).setStrokeStyle(3, 0x2f3640)
        // this.add.rectangle(105, 60, 252, 20, 0x4cd137).setOrigin(0).setAlpha(1).setStrokeStyle(3, 0x353b48)
        // HP Label
        this.add.rectangle(65, 60, 40, 20, 0x353b48).setOrigin(0).setStrokeStyle(3, 0x2f3640)
        // this.add.rectangle(65, 60, 40, 20, 0x353b48).setOrigin(0).setStrokeStyle(3, 0x353b48)
        this.add.text(70, 60, "HP", {fontFamily: 'Audiowide', fontStyle: 'bolder', fontSize: '17px', color: '#e1b12c'}).setOrigin(0)
        // Pokemon Name
        this.add.text(5, 30, "Bulbasaur", {fontFamily: 'Audiowide', fontStyle: 'italic', fontSize: '20px'}).setOrigin(0)
        // Level Information
        this.add.text(275, 30, "Lv. 6", {fontFamily: 'Audiowide', fontStyle: 'italic', fontSize: '20px'}).setOrigin(0)
    }

    createBottomBar(){
        
    }

    update(){

    }
}