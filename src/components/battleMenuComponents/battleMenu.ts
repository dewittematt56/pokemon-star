import Phaser from "phaser";
import { BattleMenuSelectButton, MoveSelectionButton } from "./microComponents/battleMenuButtons";
import { BattleMenuDialog } from "./microComponents/battleMenuDialog";
import { PokemonMove } from "../../commonClass/pokemon/pokemonMove";
import { Pokemon } from "../../commonClass/pokemon/pokemon/pokemon";

export class BattleSelectMenu {
    private scene: Phaser.Scene;
    public pokemon: Pokemon;
    public battleMenuContainer: Phaser.GameObjects.Container;
    public battleMenuOptionsContainer: Phaser.GameObjects.Container;
    public fightOptionsContainer: Phaser.GameObjects.Container;
    public battleMenuDialog: BattleMenuDialog;

    public runCallback: Function;
    public moveSelectCallBack: Function;

    constructor(scene: Phaser.Scene, pokemon: Pokemon, runCallback: Function, moveSelectCallback: Function){
        this.scene = scene
        this.pokemon = pokemon

        this.battleMenuDialog = new BattleMenuDialog(this.scene, 0, 0, 650, 100, false);

        this.battleMenuContainer = this.scene.add.container(0, 570, [
            this.battleMenuOptionsContainer = this.createBattleMenu(),
            this.fightOptionsContainer = this.scene.add.container(0, 0, [...this.createMoveSelectionButtons(true)]),
            this.battleMenuDialog.dialogContainer
        ])

        // Callback Functions
        this.runCallback = runCallback;
        this.moveSelectCallBack = moveSelectCallback;
    }

    createBattleMenu(){
        return this.scene.add.container(0, 0, [
            this.scene.add.rectangle(0, 2.5, 1012.5, 105, 0x353b48).setOrigin(0).setStrokeStyle(1),
            this.scene.add.rectangle(2, 5, 640, 100, 0x353b48).setOrigin(0),
            new BattleMenuSelectButton("FIGHT", 652.5, 10, 0xc23616, this.scene, true, "FIGHT", (visibility: boolean) => {this.setFightMenuVisibility(!visibility)}).container,
            new BattleMenuSelectButton("BAG", 832.5, 10, 0xe1b12c, this.scene, true, "BAG", () => {}).container,
            new BattleMenuSelectButton("POKEMON", 652.5, 60, 0x44bd32, this.scene, true, "POKEMON", () => {}).container,
            new BattleMenuSelectButton("RUN", 832.5, 60, 0x0097e6, this.scene, true, "RUN", () => {this.runCallback()}).container,
        ])
    }

    createMoveSelectionButtons(isDefaultVisible: boolean){
        console.log(this.moveSelectCallBack)

        return this.pokemon.moves.map((move, i) => {
            if( i == 0){
                return new MoveSelectionButton(move, 0, 5, this.scene, isDefaultVisible, (move: PokemonMove) => this.moveSelectCallBack(move)).buttonContainer
            } else if(i == 1) {
                return new MoveSelectionButton(move, 315, 5, this.scene, isDefaultVisible, (move: PokemonMove) => this.moveSelectCallBack(move)).buttonContainer
            } else if(i == 2) {
                return new MoveSelectionButton(move, 0, 55, this.scene, isDefaultVisible, (move: PokemonMove) => this.moveSelectCallBack(move)).buttonContainer
            } else if(i == 3) {
                return new MoveSelectionButton(move, 315, 55, this.scene, isDefaultVisible, (move: PokemonMove) => this.moveSelectCallBack(move)).buttonContainer
            }
            return new MoveSelectionButton(move, 315, 55, this.scene, isDefaultVisible, (move: PokemonMove) => this.moveSelectCallBack(move)).buttonContainer
        })
    }

    setFightMenuVisibility(isVisible: boolean){
        if(this.fightOptionsContainer){
            this.fightOptionsContainer.list.forEach((gameObject: any) => {
                gameObject.setVisible(isVisible)
            })
            this.fightOptionsContainer.visible = isVisible;
        }
    }

    switchPokemon(pokemon: Pokemon){
        this.pokemon = pokemon;
        this.fightOptionsContainer.removeAll(true);
        this.fightOptionsContainer.add(this.createMoveSelectionButtons(true))

    }

    displayDialog(messages: string[], autoComplete: boolean, callBackFunction: Function){
        this.fightOptionsContainer.setVisible(false)
        this.battleMenuDialog.displayDialog(messages, autoComplete, callBackFunction)
    }

    updateDialogVisibility(visibility: boolean){
        this.battleMenuDialog.updateVisibility(visibility);
        this.fightOptionsContainer.setVisible(!visibility)
    }
}




