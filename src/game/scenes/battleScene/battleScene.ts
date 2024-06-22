import Phaser from "phaser";
import { SCENE_KEYS } from "../../../commonData/keysScene";
import { BATTLE_BACKGROUND_ASSETS } from "../../../commonData/keysBattleScene";
import { PokemonOverviewMenu } from "../../../components/pokemonOverviewMenu";
import { PokemonPartyType, PokemonPartyMemberType } from "../../../commonTypes/typeDefs";

import { BattleSelectMenu } from "../../../components/battleMenuComponents/battleMenu";
import { YourBattleBarComponent, OpponentBattleBarComponent } from "../../../components/battleMenuComponents/battlePokemonStatusBar";
import { BattlePokemonSprite } from "../../../components/pokemon/battlePokemonSprite";

export type pokemonBattleSceneData = {
    battleFieldBackgroundAssetKey: string,
    opponentParty: PokemonPartyType
    pokemonParty: PokemonPartyType
}

export class BattleScene extends Phaser.Scene {
    public opponentPokemon: PokemonPartyMemberType | undefined;
    public opponentPokemonSprite: BattlePokemonSprite | undefined;
    public yourPokemon: PokemonPartyMemberType | undefined;
    public yourPokemonSprite: BattlePokemonSprite | undefined;
    private _backgroundImageBoundsObject: {x: number, y: number, width: number, height: number} | undefined; 
    
    public playerPokemonParty: PokemonPartyType | undefined
    public opponentPokemonParty: PokemonPartyType | undefined

    public battleSelectMenu: BattleSelectMenu | undefined;
    public yourBattleBarComponent: YourBattleBarComponent | undefined;
    public opponentBattleBarComponent: OpponentBattleBarComponent | undefined;
    public fightSubMenuContainer: Phaser.GameObjects.Container | undefined;

    constructor(){
        super({
            key: SCENE_KEYS.BATTLE_SCENE
        })
    }

    init(data: pokemonBattleSceneData){
        this.playerPokemonParty = data.pokemonParty;
        this.opponentPokemonParty = data.opponentParty;

        // Default to first pokemon in Party
        this.yourPokemon = data.pokemonParty[0]
        this.opponentPokemon = data.opponentParty[0]
    }

    preload(){
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

        if(this.opponentPokemon && this.yourPokemon){
            // Battle Select Menu
            this.battleSelectMenu = new BattleSelectMenu(this, this.yourPokemon, () => this.scene.switch(SCENE_KEYS.WORLD_SCENE));
            
            // Opponent
            this.opponentPokemonSprite = new BattlePokemonSprite(this, this.opponentPokemon, (this._backgroundImageBoundsObject.width / 2)  * 1.5, (this._backgroundImageBoundsObject.height / 2) * 1.1, true);
            this.opponentBattleBarComponent = new OpponentBattleBarComponent(this, -2, 24, this.opponentPokemon, true);
            
            // Your Pokemon
            this.yourPokemonSprite =  new BattlePokemonSprite(this, this.yourPokemon, (this._backgroundImageBoundsObject.width / 2) * .5, (this._backgroundImageBoundsObject.height / 2) * 1.75, false);
            this.yourBattleBarComponent = new YourBattleBarComponent(this, 642, 450, this.yourPokemon)
        }
        if(this.playerPokemonParty){
            new PokemonOverviewMenu(this, this.playerPokemonParty, this.newPlayerPokemon);
        }
    }

    newPlayerPokemon = (newPokemon: PokemonPartyMemberType) => {
        this.yourPokemonSprite?.updatePokemon(newPokemon);
        this.yourBattleBarComponent?.switchPokemon(newPokemon);
        this.battleSelectMenu?.switchPokemon(newPokemon);
    }
    
    // Called every frame of the game
    update(){

    }

}