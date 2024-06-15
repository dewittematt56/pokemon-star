import Phaser from "phaser";
import { SCENE_KEYS } from "../sceneKeys";
import { BATTLE_BACKGROUND_ASSETS } from "./battleSceneKeys";
import { POKEMON, PokemonObjectType } from "../../pokemon/pokemon";
import { typeColorMap } from "../../configs/gameConfig";
import { DIRECTION, DIRECTION_TYPE } from "../../utils/controls/direction";
import { UI_ASSET_KEYS } from "../../utils/assetKeys";

class MoveSelectionButton {
    public id: string;
    public moveName: string;
    private _scene: Phaser.Scene;
    private _type: string;
    public buttonBox: Phaser.GameObjects.Rectangle
    public typeBox: Phaser.GameObjects.Rectangle
    public buttonText: Phaser.GameObjects.Text
    
    constructor(id: string, type: keyof typeof typeColorMap, moveName: string, x_pos: number, y_pos: number, scene: Phaser.Scene){
        
        this.id = id;
        this._type = type;
        this.moveName = moveName
        this._scene = scene
        
        // Local Vars
        let width = 305;
        let height = 40;
        let font_size = 17; 
        let type_padding = 10;

        this.buttonBox = this._scene.add.rectangle(x_pos + 10, y_pos + 5, width, height, 0xFFFFFF).setAlpha(0.9).setOrigin(0).setStrokeStyle(4, 0x262b33, 1)
        this.typeBox = this._scene.add.rectangle(x_pos + 10 + (type_padding / 4) , y_pos + 5 + (type_padding / 4), width - (type_padding / 2), height - (type_padding / 2)).setAlpha(1).setOrigin(0).setStrokeStyle(4, typeColorMap[type].primaryColor, .9)
        this.buttonText = this._scene.add.text(x_pos + ((width - ((font_size * moveName?.length) / 2)) / 2), y_pos - 1 + ((height - (font_size / 2)) / 2), this.moveName, {fontFamily: 'Audiowide', fontStyle: 'bolder', fontSize: `${font_size}px`, color: '#fffff'}).setOrigin(0);
    }
}

export class BattleScene extends Phaser.Scene {
    private _opponentPokemon: Phaser.GameObjects.Sprite | undefined;
    private _yourPokemon: Phaser.GameObjects.Sprite | undefined;
    private _backgroundImageBoundsObject: {x: number, y: number, width: number, height: number} | undefined; 
    public cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    public battleMenuContainer: Phaser.GameObjects.Container | undefined;
    public battleMenuCursorImageGameObject: Phaser.GameObjects.Image | undefined
    constructor(){
        super({
            key: SCENE_KEYS.BATTLE_SCENE
        })
    }

    init(){

    }

    preload(){
        this.load.image(BATTLE_BACKGROUND_ASSETS.FOREST.key, BATTLE_BACKGROUND_ASSETS.FOREST.path);
        this.load.image(UI_ASSET_KEYS.CURSOR.KEY, UI_ASSET_KEYS.CURSOR.PATH);
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

        this.cursorKeys = this.input.keyboard?.createCursorKeys();


        // To-Do Allow for Array of Inputs
        this.createBattleMenu()
        this.loadOpponentPokemonOntoPage(POKEMON["BULBASAUR"])
        this.loadYourPokemonOntoPage(POKEMON["TORCHIC"])

    }

    createBattleMenu(){
        this.battleMenuCursorImageGameObject = this.add.image(42, 38, UI_ASSET_KEYS.CURSOR.KEY, 0)
        this.add.container()
        this.createHealthBarBox()
        this.createUserInputButtons()
        this.createMoveSelectionButtons()
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
        this.createTopBar("Bulbasaur", 6, true);
        this.createBottomBar("Torchic", 5, 10);
    }

    createTopBar(pokemonName: string, pokemonLevel: number, hasBeenCaught: boolean){
        let relative_x = -2
        let relative_y = 24
        this.createStandardBar(relative_x, relative_y, pokemonName, pokemonLevel)
        if(hasBeenCaught){
            this.add.image(relative_x + 13, relative_y + 41, "POKEBALL-ICON").setOrigin(0).setScale(0.08).setDepth(99)
        }
    }

    createBottomBar(pokemonName: string, pokemonLevel: number, experience: number){
        this.createStandardBar(642, 450, pokemonName, pokemonLevel)
        this.add.rectangle(645, 521, 350, 7.5, 0x0097e6).setAlpha(0.9).setOrigin(0).setStrokeStyle(2, 0x13161a, 1)
    }

    createStandardBar(relativeX: number, relativeY: number, pokemonName: string, pokemonLevel: number){
        // Parent Box
        this.add.rectangle(relativeX, relativeY, 371, 72, 0x2f3640).setOrigin(0).setAlpha(0.7).setStrokeStyle(1)
        this.add.rectangle(relativeX, relativeY + 1, 370, 70, 0x353b48).setOrigin(0).setAlpha(0.7).setStrokeStyle(2)
        // Hp Box
        this.add.rectangle(relativeX + 103, relativeY + 46, 250, 20, 0x4cd137).setOrigin(0).setAlpha(.8).setStrokeStyle(3, 0x2f3640)
        // this.add.rectangle(105, 60, 252, 20, 0x4cd137).setOrigin(0).setAlpha(1).setStrokeStyle(3, 0x353b48)
        // HP Label
        this.add.rectangle(relativeX + 63, relativeY + 46, 40, 20, 0x353b48).setOrigin(0).setStrokeStyle(3, 0x2f3640)
        // this.add.rectangle(65, 60, 40, 20, 0x353b48).setOrigin(0).setStrokeStyle(3, 0x353b48)
        this.add.text(relativeX + 68, relativeY + 46, "HP", {fontFamily: 'Audiowide', fontStyle: 'bolder', fontSize: '17px', color: '#e1b12c'}).setOrigin(0)
        // Pokemon Name
        this.add.text(relativeX + 3, relativeY + 6, pokemonName, {fontFamily: 'Audiowide', fontStyle: 'italic', fontSize: '20px'}).setOrigin(0)
        // Level Information
        this.add.text(relativeX + 273, relativeY + 6, `Lv. ${pokemonLevel}`, {fontFamily: 'Audiowide', fontStyle: 'italic', fontSize: '20px'}).setOrigin(0)
        this.add.rectangle(relativeX + 3, relativeY + 35, 350, 1, 0x4f5a67).setOrigin(0).setAlpha(1).setStrokeStyle(.25, 0x4f5a67, 1)

    }

    createUserInputButtons(){
        this.add.rectangle(0, 572.5, 1012.5, 105, 0x353b48).setOrigin(0).setStrokeStyle(1)
        this.add.rectangle(2, 575, 640, 100, 0x353b48).setOrigin(0)
        
        // "FIGHT"
        this.add.rectangle(652.5, 580, 170, 40, 0xc23616).setOrigin(0).setStrokeStyle(3, 0x262b33)
        this.add.text(652.5 + 55, 580 + 10, "FIGHT", {fontFamily: 'Audiowide', fontStyle: 'bolder', fontSize: '17px', color: 'white'})
        // "BAG"
        this.add.rectangle(832.5, 580, 170, 40, 0xe1b12c).setOrigin(0).setStrokeStyle(3, 0x262b33)
        this.add.text(832.5 + 60, 580 + 10, "BAG", {fontFamily: 'Audiowide', fontStyle: 'bolder', fontSize: '17px', color: 'white'})
        // "Pokemon"
        this.add.rectangle(652.5, 630, 170, 40, 0x44bd32).setOrigin(0).setStrokeStyle(3, 0x262b33)
        this.add.text(652.5 + 32.5, 630 + 10, "POKEMON", {fontFamily: 'Audiowide', fontStyle: 'bolder', fontSize: '17px', color: 'white'})
        // Run
        this.add.rectangle(832.5, 630, 170, 40, 0x0097e6).setOrigin(0).setStrokeStyle(3, 0x262b33)
        this.add.text(832.5 + 60, 630 + 10, "RUN", {fontFamily: 'Audiowide', fontStyle: 'bolder', fontSize: '17px', color: 'white'})
    }

    createMoveSelectionButtons(){
        let moves = ["TACKLE", "TOSS", "TRAP", "SNAG"]
        for(let i = 0; i < moves.length; i++){
            if( i == 0){
                new MoveSelectionButton("tackle", "FIRE", moves[i], 0, 575, this)
            } else if(i == 1) {
                new MoveSelectionButton("tackle", "FIGHTING", moves[i], 315, 575, this)
            } else if(i == 2) {
                new MoveSelectionButton("tackle", "GHOST", moves[i], 0, 625, this)
            } else if(i == 3) {
                new MoveSelectionButton("tackle", "WATER", moves[i], 315, 625, this)
            }
        }
        
    }
    
    handlePlayerInput(input: 'OK' | 'CANCEL' | 'LEFT' | 'RIGHT' | 'UP' | 'DOWN'){
        console.log(input)
        if(input == 'CANCEL'){

            return
        } else if(input == 'OK'){
            return
        }
    }
    // Called every frame of the game
    update(){
        // Singular Input
        const wasSpaceKeyPressed = Phaser.Input.Keyboard.JustDown(this.cursorKeys?.space!);
        if(wasSpaceKeyPressed) {
            this.handlePlayerInput('OK');
            return
        }
        // SHIFT KEY ON KEYBOARD
        if(Phaser.Input.Keyboard.JustDown(this.cursorKeys?.shift!)){
            this.handlePlayerInput('CANCEL');
            return
        }
        let selectedDirection: DIRECTION_TYPE = DIRECTION.NONE
        if(this.cursorKeys?.left.isDown){
            selectedDirection = DIRECTION.LEFT
        } else if(this.cursorKeys?.right.isDown){
            selectedDirection = DIRECTION.RIGHT
        } else if(this.cursorKeys?.up.isDown){
            selectedDirection = DIRECTION.UP
        } else if(this.cursorKeys?.down.isDown){
            selectedDirection = DIRECTION.DOWN
        }
        if(selectedDirection !== DIRECTION.NONE){
            this.handlePlayerInput(selectedDirection)
        }
    }
}