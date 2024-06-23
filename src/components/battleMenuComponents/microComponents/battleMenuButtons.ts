import Phaser from "phaser";
import { PokemonPartyMemberType } from "../../../commonTypes/typeDefs";
import { PokemonMove } from "../../../commonClass/pokemon/pokemonMove";

export class MoveSelectionMenu {
    private scene: Phaser.Scene;
    public pokemon: PokemonPartyMemberType

    constructor(scene: Phaser.Scene, pokemon: PokemonPartyMemberType){
        this.scene = scene
        this.pokemon = pokemon
    }

    generateMoveSelectionButtons(){

    }
}

export class MoveSelectionButton {
    public move: PokemonMove;
    private _scene: Phaser.Scene;
    public buttonContainer: Phaser.GameObjects.Container
    public isVisible: boolean;
    public buttonRectangle: Phaser.GameObjects.Rectangle
    public moveSelectionCallback: any
    
    constructor(move: PokemonMove, x_pos: number, y_pos: number, scene: Phaser.Scene, isVisible: boolean, callbackFunction: any){
        this.move = move
        
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
        this.buttonRectangle.on("pointerdown", () => callbackFunction(move))

        this.buttonContainer = this._scene.add.container(0, 0, [
            this.buttonRectangle,
            this._scene.add.rectangle(x_pos + 10 + (type_padding / 4) , y_pos + 5 + (type_padding / 4), width - (type_padding / 2), height - (type_padding / 2)).setAlpha(1).setOrigin(0).setStrokeStyle(4, move.moveType.primaryColor, .9),
            this._scene.add.text(x_pos + ((width - ((font_size * move.name?.length) / 2)) / 2), y_pos - 1 + ((height - (font_size / 2)) / 2), move.name, {fontFamily: 'Audiowide', fontStyle: 'bolder', fontSize: `${font_size}px`, color: '#fffff'}).setOrigin(0)
        ]);
        this.buttonContainer.visible = this.isVisible;
        
    }
}

export class BattleMenuSelectButton {
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