import Phaser from "phaser";
import { PokemonPartyType } from "../commonTypes/typeDefs";
import { hpBarColorGenerator } from "./battleMenuComponents/utils/common";

export class PokemonOverviewMenu {
    private _scene: Phaser.Scene
    public menuContainer: Phaser.GameObjects.Container | undefined
    public pokemonParty: PokemonPartyType

    private pokemonContainers: Phaser.GameObjects.Container;
    // Callback Functions
    public pokemonPartyChangeCallback: Function;

    constructor(scene: Phaser.Scene, pokemonParty: PokemonPartyType, pokemonPartyChangeCallback: Function){
        this._scene = scene;
        this.pokemonParty = pokemonParty
        this.pokemonContainers = this.displayPokemon()
        this.menuContainer = this._scene.add.container(1012, 0, [
            this._scene.add.rectangle(0, 0, 250, 678, 0x353b48).setOrigin(0).setStrokeStyle(2, 0x13161a),
            this._scene.add.text(90, 10, "Team", {fontFamily: 'Audiowide', fontStyle: 'bolder', fontSize: '25px', color: 'white'}).setOrigin(0),
            this.pokemonContainers
        ])

         

        // Callbacks
        this.pokemonPartyChangeCallback = pokemonPartyChangeCallback;
        
    }

    displayPokemon() {
        let pokemonContainers = this.pokemonParty.map((pokemon, index) => {
            let y_padding = 25
            let pokemonContainer = this._scene.add.container(0, 0);

            pokemonContainer.add(this._scene.add.rectangle(0, 37 + index * 64, 250, 63, 0x7f8c8d).setOrigin(0).setVisible(false).setName(`${pokemon.pokemon.uniqueId}_SELECTED_INDICATOR`));

            pokemonContainer.add(this._scene.add.sprite(0, y_padding + index * 64 , pokemon.pokemon.pokemonImageData.iconImage.assetKey, 0).setOrigin(0).setScale(1));
            let pokemonMetadataContainer = this._scene.add.container(55, y_padding + index * 64 + 35, [
                this._scene.add.text(0, 0, pokemon.pokemon.name.substring(0, 10), {fontFamily: 'Audiowide', fontStyle: 'bolder', fontSize: '12px', color: 'white'}).setOrigin(0),
                this._scene.add.text(0, 20, `Lvl. ${pokemon.pokemon.level}`, {fontFamily: 'Audiowide', fontSize: '12px', color: 'white'}).setOrigin(0)
            ])
            

            let hpPercentFilled = (pokemon.pokemon.pokemonStatData.currentHp / pokemon.pokemon.pokemonStatData.maxHp)
            let hpContainer = this._scene.add.container(130, y_padding + 35 + index * 64, [
                this._scene.add.rectangle(0, 0, 100, 15).setOrigin(0).setStrokeStyle(3, 0x13161a).setName(`${pokemon.pokemon.uniqueId}_HP_OUTLINE`),
                this._scene.add.rectangle(0, 0,  hpPercentFilled * 100, 15, hpBarColorGenerator(hpPercentFilled)).setOrigin(0).setName(`${pokemon.pokemon.uniqueId}_HP_BOX`),
                this._scene.add.text(0, 20, `HP: `, {fontFamily: 'Audiowide', fontStyle: 'bolder', fontSize: '12px', color: 'white'}).setOrigin(0).setName(`${pokemon.pokemon.uniqueId}_HP_LABEL`),
                this._scene.add.text(30, 20, `${pokemon.pokemon.pokemonStatData.currentHp}/${pokemon.pokemon.pokemonStatData.maxHp}`, {fontFamily: 'Audiowide', fontStyle: 'bolder', fontSize: '12px', color: 'white'}).setOrigin(0).setName(`${pokemon.pokemon.uniqueId}_HP_TEXT`)
            ]).setName(`${pokemon.pokemon.uniqueId}_HP_Container`)

            // Add to Container
            pokemonContainer.add(pokemonMetadataContainer);
            pokemonContainer.add(hpContainer);
            
            let pokemonContainer_bounds = pokemonContainer.getBounds();
            pokemonContainer.add(this._scene.add.rectangle(0, 37 + index * 64, 250, 2, 0x111417).setOrigin(0).setVisible(true));
            if(index == this.pokemonParty.length - 1){
                pokemonContainer.add(this._scene.add.rectangle(0, 37 + index * 64 + 64, 250, 2, 0x111417).setOrigin(0).setVisible(true));
            }
            pokemonContainer.setInteractive(new Phaser.Geom.Rectangle(0, y_padding + index * 64, pokemonContainer_bounds.width, pokemonContainer_bounds.height), Phaser.Geom.Rectangle.Contains);
            
            pokemonContainer.on("pointerover", () => {
                this._scene.input.manager.canvas.style.cursor = "pointer"
            })
            pokemonContainer.on("pointerout", () => {
                this._scene.input.manager.canvas.style.cursor = "default"
            })
            pokemonContainer.on("pointerdown", (e: any) => {
                let highlighted_pokemon: string = ""
                pokemonContainers.forEach((container) => {
                    container.each((element: any) => {
                        if(element.name.includes("_SELECTED_INDICATOR")){
                            if(element.visible){
                                let pokemonClicked = element.name.split("_")[0];
                                if(pokemonClicked == pokemon.pokemon.uniqueId || highlighted_pokemon.length > 0){
                                    element.setVisible(false)
                                    return
                                } 
                                highlighted_pokemon = pokemonClicked
                            }
                            if(element.name == `${pokemon.pokemon.uniqueId}_SELECTED_INDICATOR`){
                                element.setVisible(true)
                            }
                            else if(highlighted_pokemon.length > 0) {
                                this.pokemonOrderSwitch(highlighted_pokemon, pokemon.pokemon.uniqueId)
                            } 
                            else {
                            }
                        }
                    })
                })
            })
            pokemonContainer.setName(pokemon.pokemon.uniqueId)
            return pokemonContainer;
        });
        return this._scene.add.container(0, 15, pokemonContainers).setName("POKEMON-DISPLAY-BOX");
    }

    pokemonOrderSwitch(pokemonToSwap: string, pokemonToSwapWith: string){
        let indexOfPokemonToSwap = this.pokemonParty.findIndex((pokemon) => pokemon.pokemon.uniqueId == pokemonToSwap);
        let indexOfPokemonToSwapWith = this.pokemonParty.findIndex((pokemon) => pokemon.pokemon.uniqueId == pokemonToSwapWith);
        [this.pokemonParty[indexOfPokemonToSwap], this.pokemonParty[indexOfPokemonToSwapWith]] = [this.pokemonParty[indexOfPokemonToSwapWith], this.pokemonParty[indexOfPokemonToSwap]];
        this.clearPokemonDisplay();
        this.menuContainer?.addAt(this.displayPokemon(), 2)
        this.pokemonPartyChangeCallback(this.pokemonParty[indexOfPokemonToSwapWith])
    }

    clearPokemonDisplay(){
        this.menuContainer?.each((container: any) => {
            if(container.name == "POKEMON-DISPLAY-BOX"){
                container?.removeAll(true)
            }  
        })
    }

    // To-Do Add Status Change
    updatePokemonHp(idOfPokemonToUpdate: string, newHp: number, maxHp: number){
        this.pokemonContainers.each((container: Phaser.GameObjects.Container) => {
            if(container.name == idOfPokemonToUpdate){
                container.each((subContainer: Phaser.GameObjects.Container) => {
                    if(subContainer.name == `${idOfPokemonToUpdate}_HP_Container`){
                        subContainer.each((gameObject: Phaser.GameObjects.Rectangle) => {
                            if(gameObject.name == `${idOfPokemonToUpdate}_HP_BOX`){
                                let percentHpLeft = (newHp / maxHp)
                                // 100 = width of box 
                                gameObject.width = percentHpLeft * 100
                                gameObject.setFillStyle(hpBarColorGenerator(percentHpLeft))
                            }
                        })
                    }
                })
            }
        })
    }


}