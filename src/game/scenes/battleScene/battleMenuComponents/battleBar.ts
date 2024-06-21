import Phaser from "phaser";
import { PokemonPartyMemberType } from "../../../../commonTypes/typeDefs";


export class StandardBattleBarComponent {
    public scene: Phaser.Scene;
    public id: string
    public container: Phaser.GameObjects.Container;
    public pokemon: PokemonPartyMemberType

    constructor(scene: Phaser.Scene, relativeXPos: number, relativeYPos: number, pokemon: PokemonPartyMemberType, id: string){
        this.scene = scene;
        this.id = id
        this.pokemon = pokemon;
        this.container = this.scene.add.container(relativeXPos, relativeYPos, []).setName(id);
        this.generateBattleBar()
    }

    generateBattleBar(){
        this.container.add([
            this.scene.add.rectangle(0, 0, 371, 72, 0x2f3640).setOrigin(0).setAlpha(0.7).setStrokeStyle(1),
            this.scene.add.rectangle(0, 0 + 1, 370, 70, 0x353b48).setOrigin(0).setAlpha(0.7).setStrokeStyle(2),
            // Hp Box
            this.scene.add.rectangle(103, 46, 250, 20, 0x4cd137).setOrigin(0).setAlpha(.8).setStrokeStyle(3, 0x2f3640),
            // HP Label
            this.scene.add.rectangle(63, 46, 40, 20, 0x353b48).setOrigin(0).setStrokeStyle(3, 0x2f3640),
            this.scene.add.text(68, 46, "HP", {fontFamily: 'Audiowide', fontStyle: 'bolder', fontSize: '17px', color: '#e1b12c'}).setOrigin(0),
            // Pokemon Name
            this.scene.add.text(3, 6, this.pokemon.pokemon.name, {fontFamily: 'Audiowide', fontStyle: 'italic', fontSize: '20px'}).setOrigin(0),
            // Level Information
            this.scene.add.text(273, 6, `Lv. ${this.pokemon.pokemon.level}`, {fontFamily: 'Audiowide', fontStyle: 'italic', fontSize: '20px'}).setOrigin(0),
            this.scene.add.rectangle(3,35, 350, 1, 0x4f5a67).setOrigin(0).setAlpha(1).setStrokeStyle(.25, 0x4f5a67, 1)
        ])
    }

    removeBattleMenu(){
        this.container.removeAll(true)
    }

    switchPokemon(pokemon: PokemonPartyMemberType){
        this.pokemon = pokemon;
        this.removeBattleMenu()
        this.generateBattleBar();
    }
}

export class YourBattleBarComponent extends StandardBattleBarComponent{

    constructor(scene: Phaser.Scene, relativeXPos: number, relativeYPos: number, pokemon: PokemonPartyMemberType){
        super(scene, relativeXPos, relativeYPos, pokemon, "Your_Battle_Bar_Component")
        this.generateExpBar()
    }

    generateExpBar(){
        this.container.add([
            this.scene.add.rectangle(3, 71, 350, 7.5, 0x0097e6).setAlpha(0.9).setOrigin(0).setStrokeStyle(2, 0x13161a, 1).setName(`${this.id}_XP_BAR`)
        ])
    }
}

export class OpponentBattleBarComponent extends StandardBattleBarComponent{

    constructor(scene: Phaser.Scene, relativeXPos: number, relativeYPos: number, pokemon: PokemonPartyMemberType){
        super(scene, relativeXPos, relativeYPos, pokemon, "Opponent_Battle_Bar_Component")
    }
}

