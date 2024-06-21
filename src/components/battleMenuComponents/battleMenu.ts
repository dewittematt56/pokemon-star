import Phaser from "phaser";
import { PokemonPartyMemberType } from "../../commonTypes/typeDefs";
import { BattleMenuSelectButton, MoveSelectionButton } from "./microComponents/battleMenuButtons";

export class BattleSelectMenu {
    private scene: Phaser.Scene;
    public pokemon: PokemonPartyMemberType;
    public battleMenuContainer: Phaser.GameObjects.Container;
    public battleMenuOptionsContainer: Phaser.GameObjects.Container;
    public fightOptionsContainer: Phaser.GameObjects.Container;
    
    public runCallback: Function;

    constructor(scene: Phaser.Scene, pokemon: PokemonPartyMemberType, runCallback: Function){
        this.scene = scene
        this.pokemon = pokemon
        this.battleMenuContainer = this.scene.add.container(0, 570, [
            this.battleMenuOptionsContainer = this.createBattleMenu(),
            this.fightOptionsContainer = this.scene.add.container(0, 0, [...this.createMoveSelectionButtons(true)])
        ])

        // Callback Functions
        this.runCallback = runCallback;
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
        return this.pokemon.pokemon.pokemonBattleData.moves.map((move, i) => {
            if( i == 0){
                return new MoveSelectionButton(move, 0, 5, this.scene, isDefaultVisible).buttonContainer
            } else if(i == 1) {
                return new MoveSelectionButton(move, 315, 5, this.scene, isDefaultVisible).buttonContainer
            } else if(i == 2) {
                return new MoveSelectionButton(move, 0, 55, this.scene, isDefaultVisible).buttonContainer
            } else if(i == 3) {
                return new MoveSelectionButton(move, 315, 55, this.scene, isDefaultVisible).buttonContainer
            }
            return new MoveSelectionButton(move, 315, 55, this.scene, isDefaultVisible).buttonContainer
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

    switchPokemon(pokemon: PokemonPartyMemberType){
        this.pokemon = pokemon;
        this.fightOptionsContainer.removeAll(true);
        this.fightOptionsContainer.add(this.createMoveSelectionButtons(true))

    }
}




