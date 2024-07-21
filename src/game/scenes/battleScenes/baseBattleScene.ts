import Phaser from "phaser";
import { SCENE_KEYS } from "../../../commonData/dataScenes";
import { BATTLE_BACKGROUND_ASSETS } from "../../../commonData/keysBattleScene";
import { PokemonOverviewMenu } from "../../../components/pokemonOverviewMenu";
import { PokemonPartyType, playerSessionType } from "../../../commonTypes/typeDefs";

import { BattleSelectMenu } from "../../../components/battleMenuComponents/battleMenu";
import { YourBattleBarComponent, OpponentBattleBarComponent } from "../../../components/battleMenuComponents/battlePokemonStatusBar";
import { BattlePokemonSprite } from "../../../components/pokemon/battlePokemonSprite";
import { PokemonMove } from "../../../commonClass/pokemon/pokemonMove";
import { CombatEngine } from "../../../commonEngine/combatEngine/combatEngine";
import { Pokemon } from "../../../commonClass/pokemon/pokemon/pokemon";
import { POKEBALL_THROW } from "../../../commonData/commonAnimations";
import { SceneAudioEngine } from "../../../commonEngine/sceneSoundEngine/sceneAudioEngine";

export function findEligiblePokemonPartyMember(pokemonParty: PokemonPartyType): number {
    return pokemonParty.findIndex((pokemon) => pokemon.currentHp > 0);
}

export class baseBattleScene extends Phaser.Scene {
    public opponentPokemon: Pokemon | undefined;
    public opponentPokemonSprite: BattlePokemonSprite | undefined;
    public yourPokemon: Pokemon | undefined;
    public yourPokemonSprite: BattlePokemonSprite | undefined;
    public _backgroundImageBoundsObject: {x: number, y: number, width: number, height: number} | undefined; 
    
    public opponentPokemonParty: PokemonPartyType | undefined

    public pokemonOverviewMenu: PokemonOverviewMenu | undefined;

    public battleSelectMenu: BattleSelectMenu | undefined;
    public yourBattleBarComponent: YourBattleBarComponent | undefined;
    public opponentBattleBarComponent: OpponentBattleBarComponent | undefined;
    public fightSubMenuContainer: Phaser.GameObjects.Container | undefined;
    public audioEngine: SceneAudioEngine | undefined;

    public combatEngine: CombatEngine | undefined;

    public playerSession: playerSessionType | undefined;
    public backgroundAssetKey: string;

    constructor(key: string){
        super({
            key: key
        })
        this.backgroundAssetKey = "FOREST";
    }

    init(data: {playerSession: playerSessionType, backgroundAssetKey: string, opponentParty: PokemonPartyType}){

        if(data.playerSession){
            this.playerSession = data.playerSession;
        }
        if(data.opponentParty){this.opponentPokemonParty = data.opponentParty;}
        if(data.backgroundAssetKey){this.backgroundAssetKey = data.backgroundAssetKey}
        // Default to first pokemon in Party
        this.yourPokemon = this.playerSession?.party[findEligiblePokemonPartyMember(this.playerSession.party)]
        this.opponentPokemon = data.opponentParty[findEligiblePokemonPartyMember(data.opponentParty)]
    }

    preload(){
        this.load.image(BATTLE_BACKGROUND_ASSETS.FOREST.key, BATTLE_BACKGROUND_ASSETS.FOREST.path);
        this.opponentPokemonParty?.forEach((pokemon) => {
            this.load.spritesheet(pokemon.baseData.pokemonImageData.frontImage.assetKey, pokemon.baseData.pokemonImageData.frontImage.path, {
                frameWidth: pokemon.baseData.pokemonImageData.frontImage.width,
                frameHeight: pokemon.baseData.pokemonImageData.frontImage.height,
                startFrame: pokemon.baseData.pokemonImageData.frontImage.animStart,
                endFrame: pokemon.baseData.pokemonImageData.frontImage.animFinish,
                margin: 0,
            });
        })
        this.playerSession?.party?.forEach((pokemon) => {
            this.load.spritesheet(pokemon.baseData.pokemonImageData.backImage.assetKey, pokemon.baseData.pokemonImageData.backImage.path, {
                frameWidth: pokemon.baseData.pokemonImageData.backImage.width,
                frameHeight: pokemon.baseData.pokemonImageData.backImage.height,
                startFrame: pokemon.baseData.pokemonImageData.backImage.animStart,
                endFrame: pokemon.baseData.pokemonImageData.backImage.animFinish,
                
            });
        })

        this.load.image("POKEBALL-ICON", "/assets/misc/pokeball-icon.png")
        this.load.spritesheet("POKEBALL-ANIMATIONS", "/assets/misc/pokeball-animations.png", {frameWidth: 41, frameHeight: 40})
        this.loadPokemonIconSprites()
    }

    loadPokemonIconSprites = () => {
        this.playerSession?.party?.forEach((pokemon) => {
            this.load.spritesheet(pokemon.baseData.pokemonImageData.iconImage.assetKey, pokemon.baseData.pokemonImageData.iconImage.path, {
                frameWidth: pokemon.baseData.pokemonImageData.iconImage.width,
                frameHeight: pokemon.baseData.pokemonImageData.iconImage.height,
                startFrame: pokemon.baseData.pokemonImageData.iconImage.animStart,
                endFrame: pokemon.baseData.pokemonImageData.iconImage.animFinish,
            });
        })
    }

    create(){
        let backgroundImage = this.add.image(0, 0, BATTLE_BACKGROUND_ASSETS.FOREST.key).setOrigin(0).setScale(4)
        this._backgroundImageBoundsObject = {...backgroundImage.getBounds()}

        if(this.opponentPokemon && this.yourPokemon){
            // Battle Select Menu
            this.battleSelectMenu = new BattleSelectMenu(this, this.yourPokemon, () => this.exitRun(), (move: PokemonMove) => this.moveSelectionHandler(move));
            
            // Opponent
            this.opponentPokemonSprite = new BattlePokemonSprite(this, this.opponentPokemon, (this._backgroundImageBoundsObject.width / 2)  * 1.5, (this._backgroundImageBoundsObject.height / 2) * 1.1, true);
            this.opponentPokemonSprite.pokemonSprite?.setVisible(false);
            this.opponentBattleBarComponent = new OpponentBattleBarComponent(this, -2, 24, this.opponentPokemon, true);
            
            // Your Pokemon
            this.yourPokemonSprite =  new BattlePokemonSprite(this, this.yourPokemon, (this._backgroundImageBoundsObject.width / 2) * .5, (this._backgroundImageBoundsObject.height / 2) * 1.75, false);
            this.yourPokemonSprite.pokemonSprite?.setVisible(false);
            this.yourBattleBarComponent = new YourBattleBarComponent(this, 642, 450, this.yourPokemon)

            this.combatEngine = new CombatEngine(
                this.yourPokemon, 
                this.opponentPokemon, 
                (messages: string[], endOfSequence: boolean) => this.combatMoveDialogCallback(messages, endOfSequence),
                (newHp: number, executeOn: "PLAYER" | "OPPONENT") => this.combatHpCallback(newHp, executeOn)
            );
        }
        if(this.playerSession?.party){
            this.pokemonOverviewMenu = new PokemonOverviewMenu(this, this.playerSession.party, this.changePlayerPokemon);
        }
        this.cameras.main.fadeIn(1000, 0, 0, 0)
        this.audioEngine = new SceneAudioEngine(this, [])
        this.initialBattleLoad();
    }

    initialBattleLoad(){}

    moveSelectionHandler(move: PokemonMove){
        if(this.combatEngine){
            this.combatEngine?.executeCombatTurn(move);
        }
    }

    combatMoveDialogCallback(messages: string[], endOfSequence: boolean){
        this.battleSelectMenu?.displayDialog(messages, true, () => {
            setTimeout(() => {
                this.battleSelectMenu?.updateDialogVisibility(endOfSequence)  
            }, 500)
        }); 
    }

    combatHpCallback(newHp: number, executeOn: "PLAYER" | "OPPONENT"){
        if(executeOn == "PLAYER"){
            this.yourPokemon!.currentHp = newHp;
            this.yourBattleBarComponent?.updatePokemonHp(newHp);
            this.pokemonOverviewMenu?.updatePokemonHp(this.yourPokemon!.uniqueId, newHp, this.yourPokemon!.stats.hp);
            // A Pokemon has fainted
            if(newHp == 0){
                let newPokemonIndex = findEligiblePokemonPartyMember(this.playerSession?.party!);
                if(newPokemonIndex == -1){
                    this.exitDefeat();
                } else {
                    this.changePlayerPokemon(this.playerSession!.party[newPokemonIndex], false)
                }
            }
        } else if (executeOn == "OPPONENT"){
            this.opponentPokemon!.currentHp = newHp;
            this.opponentBattleBarComponent?.updatePokemonHp(newHp);
            // A Pokemon has fainted
            if(newHp == 0){
                let newPokemonIndex = findEligiblePokemonPartyMember(this.opponentPokemonParty!);
                if(newPokemonIndex == -1){
                    this.exitVictory();
                } else {
                    this.changeOpponentPokemon(this.opponentPokemonParty![newPokemonIndex]);
                }
            }            
        }
    }

    changePlayerPokemon = async (newPokemon: Pokemon, isFainted: boolean = false) => {
        // Not Fainted, just a new pokemon change (need to allow for combat turn in this case).
        if(!isFainted){
            await this.combatEngine?.executeCombatTurn(undefined);
            this.battleSelectMenu?.switchPokemon(newPokemon);
            this.combatEngine?.switchPokemon(newPokemon, "PLAYER");
            setTimeout(() => {
                this.updatePokemonPlayerSessionData();
                this.yourPokemon = newPokemon;
                this.makePokemonSpriteDisappear(this.yourPokemonSprite!)
                this.yourPokemonSprite?.updatePokemon(newPokemon);
                this.makePokemonSpriteAppear(this.yourPokemonSprite!)
                this.yourBattleBarComponent?.switchPokemon(newPokemon);
                this.battleSelectMenu?.updateDialogVisibility(false)
            }, 1000)
        } else {
            this.battleSelectMenu?.switchPokemon(newPokemon);
            this.combatEngine?.switchPokemon(newPokemon, "PLAYER");
            this.battleSelectMenu?.displayDialog([`Nice work ${this.yourPokemon?.name}...`, `Go ${newPokemon.name}, show em what you got!`], true, () => {
                this.updatePokemonPlayerSessionData();
                this.yourPokemon = newPokemon;
                this.makePokemonSpriteDisappear(this.yourPokemonSprite!)
                this.yourPokemonSprite?.updatePokemon(newPokemon);
                this.makePokemonSpriteAppear(this.yourPokemonSprite!)
                this.yourBattleBarComponent?.switchPokemon(newPokemon);
                this.battleSelectMenu?.updateDialogVisibility(false)
            }); 
        }
    }
    
    changeOpponentPokemon = (newPokemon: Pokemon) => {
        this.combatEngine?.switchPokemon(newPokemon, "OPPONENT");
        this.opponentPokemonSprite?.updatePokemon(newPokemon);
        this.opponentBattleBarComponent?.switchPokemon(newPokemon);
        // To-Do Play Animations
        this.opponentPokemon = newPokemon;
    }

    updatePokemonPlayerSessionData(){
        let indexToUpdate= this.playerSession?.party.findIndex((pokemon) => this.yourPokemon?.uniqueId == pokemon.uniqueId);
        if(indexToUpdate){
            this.playerSession!.party[indexToUpdate] = this.yourPokemon!;
        }
    }

    exitVictory = () => {
        this.updatePokemonPlayerSessionData();
        this.cameras.main.fadeOut(2000, 0, 0, 0)
        this.scene.start(SCENE_KEYS.WORLD_SCENE, {
            playerSession: this.playerSession
        })
    }

    exitRun = () => {
        this.updatePokemonPlayerSessionData();
        this.cameras.main.fadeOut(2000, 0, 0, 0)
        this.scene.start(SCENE_KEYS.WORLD_SCENE, {
            playerSession: this.playerSession
        })
    }

    exitDefeat = () => {
        this.updatePokemonPlayerSessionData();
        this.scene.switch("")
    }

    // Called every frame of the game
    update(){

    }

    pokemonChangeAnimation = (pokemon_sprite: BattlePokemonSprite, start_x : number, start_y: number, end_x: number, end_y: number, pokeball_type: keyof typeof POKEBALL_THROW) => {
        this.throwPokeBall(start_x, start_y, end_x, end_y as number, pokeball_type, () => {this.makePokemonSpriteAppear(pokemon_sprite)});
    }

    
    /**
     * Take a Pokemon Sprite, Animate it with a flash and make it appear on screen
     *
     * @param {BattlePokemonSprite} pokemon_sprite
     */
    makePokemonSpriteAppear = (pokemon_sprite: BattlePokemonSprite) => {
        this.audioEngine?.playSingularAudio(pokemon_sprite.pokemon.baseData.sounds.cryKey, pokemon_sprite.pokemon.baseData.sounds.cryPath)
        if(pokemon_sprite.pokemonSprite){
            let white_flash_animation_circle = this.add.circle(pokemon_sprite.pokemonSprite.x, pokemon_sprite.pokemonSprite.y, 50, 0xffffff).setAlpha(0);
            pokemon_sprite.pokemonSprite?.setVisible(true).setAlpha(0);
            this.tweens.add({targets: pokemon_sprite.pokemonSprite, duration: 250, x: pokemon_sprite.pokemonSprite!.x + 15, ease: 'linear', onComplete: () => {
                this.tweens.add({targets: pokemon_sprite.pokemonSprite, duration: 250, x: pokemon_sprite.pokemonSprite!.x - 30, ease: 'linear', onComplete: () => {
                    this.tweens.add({targets: pokemon_sprite.pokemonSprite, duration: 250, x: pokemon_sprite.pokemonSprite!.x + 15, ease: 'linear'})
                }})
            }})
            // Pokemon Appear Animation
            this.tweens.add({alpha: 1, targets: pokemon_sprite.pokemonSprite, duration: 2000, ease: 'Power2',}); 
            this.tweens.add({
                targets: white_flash_animation_circle,
                alpha: .8,       
                scale: 2.5,       
                duration: 500,  
                ease: 'Power2',
                onComplete: () => {
                    // Create the second tween to handle the shrink effect
                    this.tweens.add({
                        targets: white_flash_animation_circle,
                        alpha: .6,
                        scale: 1.5, 
                        duration: 250,
                        ease: 'Power2',
                        onComplete: () => {
                            white_flash_animation_circle.destroy()
                        }
                    });
                }
            });
        }
    }

    
    /**
     * Take a Pokemon Sprite, Animate it and make it disappear from screen
     *
     * @param {BattlePokemonSprite} pokemon_sprite
     */
    makePokemonSpriteDisappear = (pokemon_sprite: BattlePokemonSprite) => {
        this.tweens.add({
            targets: pokemon_sprite.pokemonSprite,
            y: pokemon_sprite.pokemonSprite!.y + 100,
            alpha: 0,
            duration: 250,
            ease: 'Power2'
        });
    }

    
    /**
     * Animation to throw a pokeball 
     *
     * @param {number} start_x
     * @param {number} start_y
     * @param {number} end_x
     * @param {number} end_y
     * @param {keyof typeof POKEBALL_THROW} pokeball_type
     * @param {Function} endThrowCallback
     */
    throwPokeBall = (start_x : number, start_y: number, end_x: number, end_y: number, pokeball_type: keyof typeof POKEBALL_THROW, endThrowCallback: Function) => {
        let animation_info = POKEBALL_THROW[pokeball_type];
        let pokeballSprite = this.add.sprite(start_x, start_y, animation_info.assetKey, animation_info.throw_animation[0]).setScale(1.75);
        this.anims.create({
            key: animation_info.throw_key,
            frames: this.anims.generateFrameNames(animation_info.assetKey, { frames: animation_info.throw_animation }),
            frameRate: animation_info.frameRate * 2.2,
            repeat: 0,
            delay: animation_info.delay,
            yoyo: false,
        });
        pokeballSprite.on('animationcomplete', () => {
            setTimeout(() => {
                // Fade Ball and remove sprite
                endThrowCallback()
                this.tweens.add({
                    targets: pokeballSprite,
                    alpha: 0,          
                    duration: 500,  
                    ease: 'Power2',
                    onComplete: () => {
                        pokeballSprite.destroy();
                    }
                });
            }, 100)
        }, this);

        // Move Ball & Play Animiation
        pokeballSprite.anims.play(animation_info.throw_key, true)
        this.tweens.add({
            targets: pokeballSprite,
            x: end_x,
            y: end_y,
            duration: 750,
            ease: 'Linear',
        });
    }

}