import Phaser from "phaser";
import { SCENE_KEYS } from "../sceneKeys";
import { BATTLE_BACKGROUND_ASSETS } from "./battleSceneKeys";
import { typeColorMap } from "../../configs/gameConfig";
import { PokemonOverviewMenu } from "../../components/pokemonOverviewMenu";
import { PokemonPartyType, PokemonPartyMemberType } from "../../pokemon/typeDefs";

class MoveSelectionButton {
    public id: string;
    public moveName: string;
    private _scene: Phaser.Scene;
    private _type: string;
    public buttonContainer: Phaser.GameObjects.Container
    public isVisible: boolean;
    public buttonRectangle: Phaser.GameObjects.Rectangle 
    constructor(id: string, type: keyof typeof typeColorMap, moveName: string, x_pos: number, y_pos: number, scene: Phaser.Scene, isVisible: boolean){
        
        this.id = id;
        this._type = type;
        this.moveName = moveName
        this._scene = scene
        this.isVisible = isVisible;

        // Local Vars
        let width = 305;
        let height = 40;
        let font_size = 17; 
        let type_padding = 10;
        
        this.buttonRectangle = this._scene.add.rectangle(x_pos + 10, y_pos + 5, width, height, 0xFFFFFF).setAlpha(0.9).setOrigin(0).setStrokeStyle(4, 0x262b33, 1).setInteractive();
        this.buttonRectangle.on("pointerover", () => {this.buttonRectangle.setStrokeStyle(4, 0xffffff, 1)})
        this.buttonRectangle.on("pointerout", () => {this.buttonRectangle.setStrokeStyle(4, 0x262b33, 1)})

        this.buttonContainer = this._scene.add.container(0, 0, [
            this.buttonRectangle,
            this._scene.add.rectangle(x_pos + 10 + (type_padding / 4) , y_pos + 5 + (type_padding / 4), width - (type_padding / 2), height - (type_padding / 2)).setAlpha(1).setOrigin(0).setStrokeStyle(4, typeColorMap[type].primaryColor, .9),
            this._scene.add.text(x_pos + ((width - ((font_size * moveName?.length) / 2)) / 2), y_pos - 1 + ((height - (font_size / 2)) / 2), this.moveName, {fontFamily: 'Audiowide', fontStyle: 'bolder', fontSize: `${font_size}px`, color: '#fffff'}).setOrigin(0)
        ]);
        this.buttonContainer.visible = this.isVisible;
        
    }
}

class BattleMenuSelectButton {
    public id: string;
    private _scene: Phaser.Scene;
    public isVisible: boolean;
    public container: Phaser.GameObjects.Container
    public buttonRectangle: Phaser.GameObjects.Rectangle 
    constructor(id: string, x_pos: number, y_pos: number, backgroundColor: number, scene: Phaser.Scene, isVisible: boolean, text: string, callbackFunction: Function){
        
        this.id = id;
        this._scene = scene
        this.isVisible = isVisible;

        // Local Vars
        let font_size = 17; 
        let width = 170;
        let height = 40;
        
        this.buttonRectangle = this._scene.add.rectangle(x_pos, y_pos, width, height, backgroundColor).setOrigin(0).setStrokeStyle(3, 0x262b33, .75).setName("FIGHT-BOX").setInteractive()
        
        // EVENT Handlers
        this.buttonRectangle.on("pointerdown", () => {
            callbackFunction(!this.isVisible);
            this.isVisible = !this.isVisible
        })
        this.buttonRectangle.on("pointerover", () => {this.buttonRectangle.setStrokeStyle(3, 0xffffff, .75)})
        this.buttonRectangle.on("pointerout", () => {this.buttonRectangle.setStrokeStyle(3, 0x262b33)})

        let textWidth = text.length * font_size * 0.8;
        let textX = x_pos + (width - textWidth) / 2;
        let textY = y_pos + (height - font_size) / 2;

        this.container = this._scene.add.container(0, 0, [
            this.buttonRectangle,
            //this._scene.add.text(x_pos + ((width * 1.1 - (text.length * font_size)) / 2), y_pos - 1 + ((height - (font_size / 2)) / 2), text, {fontFamily: 'Audiowide', fontStyle: 'bolder', fontSize: `${font_size}px`, color: 'white'}).setOrigin(0)
            this._scene.add.text(textX , textY, text, {fontFamily: 'Audiowide', fontStyle: 'bolder', fontSize: '17px', color: 'white'}).setOrigin(0).setName("FIGHT-TEXT"),
        ]);
        this.container.visible = this.isVisible;
    }
}

export type pokemonBattleSceneData = {
    battleFieldBackgroundAssetKey: string,
    opponentParty: PokemonPartyType
    pokemonParty: PokemonPartyType
}

export class BattleScene extends Phaser.Scene {
    private _opponentPokemon: Phaser.GameObjects.Sprite | undefined;
    private _yourPokemon: Phaser.GameObjects.Sprite | undefined;
    private _backgroundImageBoundsObject: {x: number, y: number, width: number, height: number} | undefined; 
    
    public playerPokemonParty: PokemonPartyType | undefined
    public opponentPokemonParty: PokemonPartyType | undefined

    public battleMenuContainer: Phaser.GameObjects.Container | undefined;
    public battleMenuCursorImageGameObject: Phaser.GameObjects.Image | undefined
    public fightSubMenuContainer: Phaser.GameObjects.Container | undefined;

    constructor(){
        super({
            key: SCENE_KEYS.BATTLE_SCENE
        })
    }

    init(data: pokemonBattleSceneData){
        console.log(data.opponentParty)
        this.playerPokemonParty = data.pokemonParty
        this.opponentPokemonParty = data.opponentParty
    }

    preload(){
        console.log(this.playerPokemonParty)
        this.load.image(BATTLE_BACKGROUND_ASSETS.FOREST.key, BATTLE_BACKGROUND_ASSETS.FOREST.path);
        this.opponentPokemonParty?.forEach((pokemon) => {
            this.load.spritesheet(pokemon.pokemon.pokemonImageData.frontImage.assetKey, pokemon.pokemon.pokemonImageData.frontImage.path, {
                frameWidth: pokemon.pokemon.pokemonImageData.frontImage.width,
                frameHeight: pokemon.pokemon.pokemonImageData.frontImage.height,
                startFrame: pokemon.pokemon.pokemonImageData.frontImage.animStart,
                endFrame: pokemon.pokemon.pokemonImageData.frontImage.animFinish,
            });
        })
        this.playerPokemonParty?.forEach((pokemon) => {
            console.log(pokemon)
            this.load.spritesheet(pokemon.pokemon.pokemonImageData.backImage.assetKey, pokemon.pokemon.pokemonImageData.backImage.path, {
                frameWidth: pokemon.pokemon.pokemonImageData.backImage.width,
                frameHeight: pokemon.pokemon.pokemonImageData.backImage.height,
                startFrame: pokemon.pokemon.pokemonImageData.backImage.animStart,
                endFrame: pokemon.pokemon.pokemonImageData.backImage.animFinish,
            });
        })

        this.load.image("POKEBALL-ICON", "/assets/misc/pokeball-icon.png")
        this.loadPokemonIconSprites()
    }

    loadPokemonIconSprites = () => {
        this.playerPokemonParty?.forEach((pokemon) => {
            this.load.spritesheet(pokemon.pokemon.pokemonImageData.iconImage.assetKey, pokemon.pokemon.pokemonImageData.iconImage.path, {
                frameWidth: pokemon.pokemon.pokemonImageData.iconImage.width,
                frameHeight: pokemon.pokemon.pokemonImageData.iconImage.height,
                startFrame: pokemon.pokemon.pokemonImageData.iconImage.animStart,
                endFrame: pokemon.pokemon.pokemonImageData.iconImage.animFinish,
            });
        })
    }

    create(){
        let backgroundImage = this.add.image(0, 0, BATTLE_BACKGROUND_ASSETS.FOREST.key).setOrigin(0).setScale(4)
        this._backgroundImageBoundsObject = {...backgroundImage.getBounds()}



        // To-Do Allow for Array of Inputs
        this.createBattleMenu()
        this.createHealthBarBox()
        if(this.opponentPokemonParty){
            this.loadOpponentPokemonOntoPage(this.opponentPokemonParty[0])
        }
        if(this.playerPokemonParty){
            this.loadYourPokemonOntoPage(this.playerPokemonParty[0]);
        }
        if(this.playerPokemonParty){
            new PokemonOverviewMenu(this, this.playerPokemonParty, this.newPlayerPokemon);
        }
    }

    createBattleMenu(){
        this.battleMenuContainer = this.add.container(0, 0, [
            this.add.rectangle(0, 572.5, 1012.5, 105, 0x353b48).setOrigin(0).setStrokeStyle(1),
            this.add.rectangle(2, 575, 640, 100, 0x353b48).setOrigin(0),
            new BattleMenuSelectButton("FIGHT", 652.5, 580, 0xc23616, this, true, "FIGHT", (visibility: boolean) => {this.setFightMenuVisibility(!visibility)}).container,
            new BattleMenuSelectButton("BAG", 832.5, 580, 0xe1b12c, this, true, "BAG", () => {}).container,
            new BattleMenuSelectButton("POKEMON", 652.5, 630, 0x44bd32, this, true, "POKEMON", () => {}).container,
            new BattleMenuSelectButton("RUN", 832.5, 630, 0x0097e6, this, true, "RUN", () => {this.scene.switch(SCENE_KEYS.WORLD_SCENE)}).container,
        ])
        this.fightSubMenuContainer = this.add.container(0, 0 , this.createMoveSelectionButtons(false)); 
        
    }

    // Refactor
    loadOpponentPokemonOntoPage(pokemon: PokemonPartyMemberType){
        console.log(pokemon)
        if(this._backgroundImageBoundsObject){
            let x_pos = (this._backgroundImageBoundsObject.width / 2) - pokemon.pokemon.pokemonImageData.frontImage.width + 225;
            let y_pos = (this._backgroundImageBoundsObject.height / 2) - pokemon.pokemon.pokemonImageData.frontImage.height - 25;
            this._opponentPokemon = this.add.sprite(x_pos, y_pos, pokemon.pokemon.pokemonImageData.frontImage.assetKey).setOrigin(0).setScale(4);
            this.anims.create({
                key: pokemon.pokemon.pokemonImageData.frontImage.assetKey,
                frames: this.anims.generateFrameNumbers(pokemon.pokemon.pokemonImageData.frontImage.assetKey, { start: 0, end: 31 }),
                frameRate: pokemon.pokemon.pokemonImageData.frontImage.frameRate,
                repeat: 0
            });
            this._opponentPokemon.play(pokemon.pokemon.pokemonImageData.frontImage.assetKey)
        }
    }

    // Refactor
    loadYourPokemonOntoPage(pokemon: PokemonPartyMemberType){
        if(this._backgroundImageBoundsObject){
            let x_pos = (this._backgroundImageBoundsObject.width / 2) - pokemon.pokemon.pokemonImageData.backImage.height - 225;
            let y_pos = (this._backgroundImageBoundsObject.height / 2) - pokemon.pokemon.pokemonImageData.backImage.height + 125;
            this._yourPokemon = this.add.sprite(x_pos, y_pos, pokemon.pokemon.pokemonImageData.backImage.assetKey).setOrigin(0).setScale(4)
            this.anims.create({
                key: pokemon.pokemon.pokemonImageData.backImage.assetKey,
                frames: this.anims.generateFrameNumbers(pokemon.pokemon.pokemonImageData.backImage.assetKey, { start: pokemon.pokemon.pokemonImageData.backImage.animStart, end: pokemon.pokemon.pokemonImageData.backImage.animFinish }),
                frameRate: pokemon.pokemon.pokemonImageData.backImage.frameRate,
                repeat: 0
            });
            this._yourPokemon.play(pokemon.pokemon.pokemonImageData.backImage.assetKey)           
        }
    }

    newPlayerPokemon = (newPokemon: PokemonPartyMemberType) => {
        this._yourPokemon?.destroy()
        this.loadYourPokemonOntoPage(newPokemon)
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

    createMoveSelectionButtons(isDefaultVisible: boolean){
        let moves = ["TACKLE", "TOSS", "TRAP", "SNAG"]
        return moves.map((move, i) => {
            if( i == 0){
                return new MoveSelectionButton("tackle", "FIRE", move, 0, 575, this, isDefaultVisible).buttonContainer
            } else if(i == 1) {
                return new MoveSelectionButton("tackle", "FIGHTING", move, 315, 575, this, isDefaultVisible).buttonContainer
            } else if(i == 2) {
                return new MoveSelectionButton("tackle", "GHOST", move, 0, 625, this, isDefaultVisible).buttonContainer
            } else if(i == 3) {
                return new MoveSelectionButton("tackle", "WATER", move, 315, 625, this, isDefaultVisible).buttonContainer
            }
            return new MoveSelectionButton("tackle", "WATER", move, 315, 625, this, isDefaultVisible).buttonContainer
        })
    }
    
    // Called every frame of the game
    update(){

    }


    // Display Functions
    setFightMenuVisibility(isVisible: boolean){
        if(this.fightSubMenuContainer){
            this.fightSubMenuContainer.list.forEach((gameObject: any) => {
                gameObject.setVisible(isVisible)
            })
            this.fightSubMenuContainer.visible = isVisible;
        }
    }
}