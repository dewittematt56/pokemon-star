import Phaser from 'phaser';
import { Controls } from '../../utils/controls/control';
import { DIRECTION } from '../../utils/controls/direction';
import { Player } from '../../../commonClass/characters/player/player';
import { CHARACTER_ASSET_KEYS } from '../../utils/assetKeys';
import { BasicUiDialogBox } from '../../../components/dialog/basicUiDialogBox';
import { getTargetPositionFromGameObjectPositionAndDirection } from '../../utils/gridUtils.ts/gridUtils';
import { TILE_SIZE } from '../../../commonData/configWorld';
import { SCENE_KEYS, SCENE_INFO } from '../../../commonData/dataScenes';
import { didPokemonAppearInZone, getPokemonEncountered } from './utils/encounterUtils';
import { SceneType, playerSessionType } from '../../../commonTypes/typeDefs';
import { writeGameDataToSave } from '../../utils/gameSaves/utils';
import { NpcTrainer } from '../../../commonClass/characters/npcTrainer/npcTrainer';
import { findPlayerObjectIntersect } from '../../../commonUtils/tileUtils';
import { sceneLightingEngine } from '../../../commonEngine/sceneLightingEngine/sceneLightingEngine';
import { SceneAudioEngine } from '../../../commonEngine/sceneSoundEngine/sceneAudioEngine';

export default class StarterScene extends Phaser.Scene {
    player: Player | undefined;
    npcTrainers: NpcTrainer[];
    controls: Controls | undefined;
    dialogUI: BasicUiDialogBox | undefined;

    // Object Layers
    public signLayer: Phaser.Tilemaps.ObjectLayer | undefined;
    public pokemonSpawnLayer: Phaser.Tilemaps.ObjectLayer | undefined;
    public jumpableLayer: Phaser.Tilemaps.ObjectLayer | undefined;
    
    private lightingEngine: sceneLightingEngine | undefined
    private audioEngine: SceneAudioEngine | undefined

    playerStartX: number;
    playerStartY: number;
    private interactionInProgress: boolean = false;

    private currentWorldScene: keyof typeof SCENE_INFO;
    private currentWorldInfo: SceneType;
    private playerSession: playerSessionType | undefined;

    constructor() {
        super({ key: SCENE_KEYS.WORLD_SCENE });
        this.playerStartX = (29 * TILE_SIZE) + 8
        this.playerStartY = 46 * TILE_SIZE

        this.npcTrainers = []

        this.currentWorldScene = "BREADBURG";
        this.currentWorldInfo = SCENE_INFO[this.currentWorldScene];

        
    }

    preload() {
        let world_data = SCENE_INFO[this.currentWorldScene]
        this.load.image("standardTileSet", "/assets/pokemonStarStandradTileSet.png");
        this.load.image("alertIcon", "/assets/misc/alertIcon.png");
        this.load.spritesheet("PLAYER", CHARACTER_ASSET_KEYS.PATH, { frameWidth: 64, frameHeight: 64 });
        // Load NPC World Image Info
        world_data.npcs.forEach((npc) => {
            if(npc.spriteInfo){
                this.load.spritesheet(npc.spriteInfo.portraitImage.assetKey, npc.spriteInfo.portraitImage.path, { frameWidth: npc.spriteInfo.portraitImage.width, frameHeight: npc.spriteInfo.portraitImage.height });
                this.load.spritesheet(npc.spriteInfo.worldImage.spriteKey, npc.spriteInfo.worldImage.spritePath, { frameWidth: npc.spriteInfo.worldImage.spriteWidth, frameHeight: npc.spriteInfo.worldImage.spriteHeight });
            }
        })
        this.load.audio("backgroundMusic", "/assets/music/happyTune.mp3")
        this.load.tilemapTiledJSON(this.currentWorldInfo.mapKey, this.currentWorldInfo.mapPath);
    }

    init(data: {playerSession: playerSessionType}){
        if(data.playerSession){
            this.playerSession = data.playerSession
            this.playerStartX = data.playerSession.location.x
            this.playerStartY = data.playerSession.location.y
            this.currentWorldScene = data.playerSession.location.currentWorldScene 
            this.currentWorldScene = "BREADBURG"
            this.currentWorldInfo = SCENE_INFO[this.currentWorldScene];

            let scene = data.playerSession.scenes.find((scene) => scene.sceneId == this.currentWorldScene)
            this.currentWorldInfo.npcs.forEach((npc) => {
                if(scene){
                    let npcToUpdate = scene.npcInfo.find((saveNpc) => saveNpc.npcId == npc.id);
                    if(npcToUpdate){
                        // If beaten make no longer aggressive
                        npc.isAggressive = !npcToUpdate.hasBeenBeaten
                    }
                }
            })
        }
        // Save Game Listeners
        window.addEventListener("beforeunload", () => this.saveGameHandler())
        window.addEventListener("unload", () => this.saveGameHandler())
        window.addEventListener("visibilitychange", () => this.saveGameHandler())
    }

    create() {
        const map = this.make.tilemap({ key: this.currentWorldInfo.mapKey, tileHeight: 16, tileWidth: 16 });
        const tileSet = map.addTilesetImage("pokemonStarStandradTileSet", "standardTileSet");
        const collisionLayer = map.createLayer("CollisionLayer", tileSet as Phaser.Tilemaps.Tileset, 0, 0);
        collisionLayer?.setVisible(false);
        const terrainLayer = map.createLayer("TerrainLayer", tileSet as Phaser.Tilemaps.Tileset, 0, 0);
        const intermediaryLayer = map.createLayer("IntermediaryLayer", tileSet as Phaser.Tilemaps.Tileset, 0, 0);
        const vegetationLayer = map.createLayer("VegetationLayer", tileSet as Phaser.Tilemaps.Tileset, 0, 0);
        const objectLayer = map.createLayer("ObjectLayer", tileSet as Phaser.Tilemaps.Tileset, 0, 0);
        // this.lights.setAmbientColor(0x555555);

        if (map.getObjectLayer('Sign')) {
            this.signLayer = map.getObjectLayer('Sign')!;
        }
        if (map.getObjectLayer("PokemonSpawns")){
            this.pokemonSpawnLayer = map.getObjectLayer('PokemonSpawns')!;
        }
        if (map.getObjectLayer("Jumpable")){
            this.jumpableLayer = map.getObjectLayer('Jumpable')!;
        }
        if(collisionLayer && this.jumpableLayer){
            this.createCharacters(collisionLayer, this.jumpableLayer);
        }   

        this.cameras.main.setBounds(0, 0, 32 * 32, 32 * 32);
        this.cameras.main.setZoom(3);

        this.controls = new Controls(this);

        this.dialogUI = new BasicUiDialogBox(this, this.scale.width);
        console.log(map.getObjectLayer('Lighting'))
        // Generate Lighting Engine for Scene
        this.lightingEngine = new sceneLightingEngine(
            this, 
            [terrainLayer, intermediaryLayer, vegetationLayer, objectLayer], 
            map.getObjectLayer('Lighting')!, 
            this.npcTrainers, 
            this.player, 
            this.currentWorldInfo.lightingLevel
        )
        this.audioEngine = new SceneAudioEngine(this, this.currentWorldInfo.music);
        this.cameras.main.fadeIn(1000, 0, 0, 0);

    }

    update(time: number, delta: number): void {
        if(this.interactionInProgress){
            return;
        }
        const selectedDirectionHeldDown = this.controls!.getDirectionKeyPressedDown();

        if (selectedDirectionHeldDown !== DIRECTION.NONE && !this.isPlayerInputLocked()) {
            this.player?.moveCharacter(selectedDirectionHeldDown);
        }
        if (this.controls?.wasSpaceKeyPressed() && !this.player?.isMoving) {
            this.handlePlayerObjectInteractions();
        }
       
        this.checkOpponentViewLogic()
        this.player?.update(time);
    }

    handlePlayerObjectInteractions() {
        if (this.dialogUI?.isAnimating) {
            return;
        }
        const { x, y } = this.player!.sprite;
        const targetPosition = getTargetPositionFromGameObjectPositionAndDirection({ x, y }, this.player!.direction);
        const nearbySign = this.signLayer?.objects.find((object) => {
            if (!object.x || !object.y) {
                return false;
            }
            return object.x === targetPosition.x - 8 && object.y - TILE_SIZE === targetPosition.y;
        });

        if (nearbySign && !this.dialogUI?.isVisible) {
            this.dialogUI?.showDialogModal(String(nearbySign.properties.find((property: any) => property.name == "message").value).split("::"), true);
            return;
        }
        if (this.dialogUI?.isVisible && this.dialogUI.moreMessagesToShow) {
            this.dialogUI.displayMessage();
            return;
        }
        if (this.dialogUI?.isVisible && !this.dialogUI.moreMessagesToShow) {
            this.dialogUI.hideDialogModal();
            return;
        }
    }

    createCharacters(collisionLayer: Phaser.Tilemaps.TilemapLayer | undefined, jumpableLayer: Phaser.Tilemaps.ObjectLayer | undefined) {
        this.player = new Player({
            scene: this,
            position: { x: this.playerStartX, y: this.playerStartY },
            assetKey: "PLAYER",
            idleFrames: {
                DOWN: 0,
                UP: 12,
                NONE: 0,
                LEFT: 4,
                RIGHT: 8
            },
            scaleSize: .5,
            direction: this.playerSession!.location.direction,
            spriteGridMovementFinishedCallback: () => {
                this.checkPokemonSpawnLogic()
            },
            spriteChangedDirectionCallback: () => {},
            collisionLayer: collisionLayer,
            jumpableLayer: jumpableLayer,
            isAggressive: false,
            sightRange: 0,
            
        });
        this.cameras.main.startFollow(this.player.sprite);
        this.npcTrainers = this.currentWorldInfo.npcs.filter((npc) => npc.type == "TRAINER" && npc.spriteInfo).map((npc) => {
            return new NpcTrainer({
                scene: this,
                position: { x: npc.location.x, y: npc.location.y },
                assetKey: npc.spriteInfo!.worldImage.spriteKey,
                idleFrames: npc.idleFrames,
                scaleSize: npc.scaleSize,
                direction: npc.location.direction,
                spriteGridMovementFinishedCallback: npc.spriteGridMovementFinishedCallback,
                spriteChangedDirectionCallback: npc.spriteChangedDirectionCallback,
                collisionLayer: collisionLayer,
                jumpableLayer: jumpableLayer,
                isAggressive: npc.isAggressive,
                sightRange: npc.sightRange
            }, {
                id: npc.id,
                name: npc.name,
                pokemon: npc.pokemonParty,
                dialog: npc.dialog,
                portrait: npc.spriteInfo!.portraitImage,
                npcWorldImage: npc.spriteInfo!.worldImage,
                movementPattern: npc.movementPattern,
                collisionSprites: [this.player!]
            });
        })
        this.player.setCollisionCharacterSprites(this.npcTrainers)
    }

    isPlayerInputLocked() {
        return this.controls!.isInputLocked || this.dialogUI!.isVisible;
    }

    async startNpcBattle (npcTrainer: NpcTrainer) {
        if(!this.interactionInProgress){
            this.interactionInProgress = true
            this.updateGameSession()
            npcTrainer.displayAlertIcon();
            await new Promise(resolve => setTimeout(resolve, 1000))
            npcTrainer.hideAlertIcon();
            this.audioEngine?.stopCurrentMusic();
            this.audioEngine?.playSceneMusic("BASIC_BATTLE_THEME", true)
            await npcTrainer.moveToTargetPosition(this.player!.position)
            this.dialogUI?.showDialogModal(npcTrainer.dialog.openingWorldMessages, true, () => {
                this.dialogUI?.hideDialogModal();
                this.cleanupScene();
                this.cameras.main.fadeOut(2000, 0, 0, 0, () => {
                    this.scene.start(SCENE_KEYS.TRAINER_BATTLE_SCENE, {
                        playerSession: this.playerSession,
                        npcTrainer: npcTrainer,
                    })
                });
            })
        }


    }

    checkPokemonSpawnLogic() {
        // Get the player's position
        let playerPos = this.player?.sprite?.getBounds()!;
    
        if (!playerPos && !this.pokemonSpawnLayer) {
            return;
        }
    
        if(findPlayerObjectIntersect(playerPos, this.pokemonSpawnLayer!)){
            if(didPokemonAppearInZone()){
                let pokemonEncountered = getPokemonEncountered(this.currentWorldScene)
                this.updateGameSession();
                this.cleanupScene();
                this.scene.start(SCENE_KEYS.WILD_ENCOUNTER_SCENE, {
                    playerSession: this.playerSession,
                    pokemonEncountered: pokemonEncountered,
                })
            }
        }
    }

    checkOpponentViewLogic() {
        if (!this.player || !this.player.sprite) {
            return; // Exit if the player or player sprite is not available
        }
    
        const playerPos = this.player.sprite.getBounds();
        const playerPosAdjustX = playerPos.x / TILE_SIZE + 0.5;
        const playerPosAdjustY = playerPos.y / TILE_SIZE;
        if(!this.interactionInProgress){
            this.npcTrainers.forEach((character) => {
                if (character.isAggressive && !character.hasBeenBeaten) {
                    const characterPos = character.sprite.getBounds();
                    const characterPosAdjustX = characterPos.x / TILE_SIZE + 0.5;
                    const characterPosAdjustY = characterPos.y / TILE_SIZE;
        
                    switch (character.direction) {
                        case "DOWN":
                            if (playerPosAdjustX === characterPosAdjustX &&
                                playerPosAdjustY >= characterPosAdjustY &&
                                playerPosAdjustY <= characterPosAdjustY + character.sightRange) {
                                this.startNpcBattle(character)
                            }
                            break;
                        case "UP":
                            if (playerPosAdjustX === characterPosAdjustX &&
                                playerPosAdjustY <= characterPosAdjustY &&
                                playerPosAdjustY >= characterPosAdjustY - character.sightRange) {
                                this.startNpcBattle(character)
                            }
                            break;
                        case "LEFT":
                            if (playerPosAdjustY === characterPosAdjustY &&
                                playerPosAdjustX <= characterPosAdjustX &&
                                playerPosAdjustX >= characterPosAdjustX - character.sightRange) {
                                this.startNpcBattle(character)
                            }
                            break;
                        case "RIGHT":
                            if (playerPosAdjustY === characterPosAdjustY &&
                                playerPosAdjustX >= characterPosAdjustX &&
                                playerPosAdjustX <= characterPosAdjustX + character.sightRange) {
                                this.startNpcBattle(character)
                            }
                            break;
                    }
                }
            });
        }
    }

    updateGameSession(){
        this.playerSession!.location.x = this.player!._targetPosition.x;
        this.playerSession!.location.y = this.player!._targetPosition.y;
        this.playerSession!.location.direction = this.player!._direction;
    }

    saveGameHandler(){
        this.updateGameSession()
        console.log(this.playerSession)
        writeGameDataToSave(this.playerSession!)
    }

    cleanupScene(){

    }

    musicHandler(){
        let backgroundMusic = this.sound.add("backgroundMusic", {
            volume: 0.5,
            loop: true
        })
        backgroundMusic.play();
    }
}
