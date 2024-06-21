import Phaser from "phaser";
import { SCENE_KEYS } from "../../../commonData/keysScene";
import { BATTLE_BACKGROUND_ASSETS } from "../../../commonData/keysBattleScene";
import { PokemonOverviewMenu } from "../../../components/pokemonOverviewMenu";
import { PokemonPartyType, PokemonPartyMemberType } from "../../../commonTypes/typeDefs";

import { BattleSelectMenu } from "../../../components/battleMenuComponents/battleMenu";
import { YourBattleBarComponent, OpponentBattleBarComponent } from "../../../components/battleMenuComponents/battlePokemonStatusBar";

export type pokemonBattleSceneData = {
    battleFieldBackgroundAssetKey: string,
    opponentParty: PokemonPartyType
    pokemonParty: PokemonPartyType
}

export class BattleScene extends Phaser.Scene {
    public opponentPokemon: PokemonPartyMemberType | undefined;
    private _opponentPokemonSprite: Phaser.GameObjects.Sprite | undefined;
    public yourPokemon: PokemonPartyMemberType | undefined;
    private _yourPokemonSprite: Phaser.GameObjects.Sprite | undefined;
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
            this.loadOpponentPokemonOntoPage(this.opponentPokemon)
            this.opponentBattleBarComponent = new OpponentBattleBarComponent(this, -2, 24, this.opponentPokemon);
            // Your Pokemon
            this.loadYourPokemonOntoPage(this.yourPokemon);
            this.yourBattleBarComponent = new YourBattleBarComponent(this, 642, 450, this.yourPokemon)
        }
        if(this.playerPokemonParty){
            new PokemonOverviewMenu(this, this.playerPokemonParty, this.newPlayerPokemon);
        }
    }


    // Refactor -- into battleBokemon.ts class
    loadOpponentPokemonOntoPage(pokemon: PokemonPartyMemberType){
        if(this._backgroundImageBoundsObject){
            let x_pos = (this._backgroundImageBoundsObject.width / 2) - pokemon.pokemon.pokemonImageData.frontImage.width + 225;
            let y_pos = (this._backgroundImageBoundsObject.height / 2) - pokemon.pokemon.pokemonImageData.frontImage.height - 25;
            this._opponentPokemonSprite = this.add.sprite(x_pos, y_pos, pokemon.pokemon.pokemonImageData.frontImage.assetKey).setOrigin(0).setScale(4);
            this.anims.create({
                key: pokemon.pokemon.pokemonImageData.frontImage.assetKey,
                frames: this.anims.generateFrameNumbers(pokemon.pokemon.pokemonImageData.frontImage.assetKey, { start: 0, end: 31 }),
                frameRate: pokemon.pokemon.pokemonImageData.frontImage.frameRate,
                repeat: 0
            });
            this._opponentPokemonSprite.play(pokemon.pokemon.pokemonImageData.frontImage.assetKey)
        }
    }

    // Refactor
    loadYourPokemonOntoPage(pokemon: PokemonPartyMemberType){
        if(this._backgroundImageBoundsObject){
            let x_pos = (this._backgroundImageBoundsObject.width / 2) - pokemon.pokemon.pokemonImageData.backImage.height - 225;
            let y_pos = (this._backgroundImageBoundsObject.height / 2) - pokemon.pokemon.pokemonImageData.backImage.height + 125;
            this._yourPokemonSprite = this.add.sprite(x_pos, y_pos, pokemon.pokemon.pokemonImageData.backImage.assetKey).setOrigin(0).setScale(4)
            this.anims.create({
                key: pokemon.pokemon.pokemonImageData.backImage.assetKey,
                frames: this.anims.generateFrameNumbers(pokemon.pokemon.pokemonImageData.backImage.assetKey, { start: pokemon.pokemon.pokemonImageData.backImage.animStart, end: pokemon.pokemon.pokemonImageData.backImage.animFinish }),
                frameRate: pokemon.pokemon.pokemonImageData.backImage.frameRate,
                repeat: 0
            });
            this._yourPokemonSprite.play(pokemon.pokemon.pokemonImageData.backImage.assetKey)           
        }
    }

    newPlayerPokemon = (newPokemon: PokemonPartyMemberType) => {
        this._yourPokemonSprite?.destroy()
        this.loadYourPokemonOntoPage(newPokemon)
        this.yourBattleBarComponent?.switchPokemon(newPokemon);
        this.battleSelectMenu?.switchPokemon(newPokemon);
    }
    
    // Called every frame of the game
    update(){

    }

}