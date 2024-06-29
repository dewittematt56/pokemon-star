import Phaser from 'phaser';
import { Controls } from '../../utils/controls/control';
import { DIRECTION } from '../../utils/controls/direction';
import { Character } from '../../characters/characters';
import { Player } from '../../characters/player/player';
import animations from "../../configs/animations.json";
import { CHARACTER_ASSET_KEYS } from '../../utils/assetKeys';
import { BasicUiDialogBox } from '../../../components/dialog/basicUiDialogBox';
import { getTargetPositionFromGameObjectPositionAndDirection } from '../../utils/gridUtils.ts/gridUtils';
import { TILE_SIZE } from '../../../commonData/configWorld';
import { SCENE_KEYS, WORLD_KEYS } from '../../../commonData/keysScene';
import { didPokemonAppearInZone, getPokemonEncountered } from './utils/encounterUtils';
import { constMockPokemonParty } from '../../../testData/mockData';
import { PokemonPartyType, playerSessionType } from '../../../commonTypes/typeDefs';
import { writeGameDataToSave } from '../../../gameSaves/utils';

export default class StarterScene extends Phaser.Scene {
    player: Character | undefined;
    controls: Controls | undefined;
    dialogUI: BasicUiDialogBox | undefined;
    signLayer: Phaser.Tilemaps.ObjectLayer | undefined;
    pokemonSpawnLayer: Phaser.Tilemaps.ObjectLayer | undefined;
    playerStartX: number;
    playerStartY: number;

    private currentWorldScene: keyof typeof WORLD_KEYS;
    private playerSession: playerSessionType | undefined;

    constructor() {
        super({ key: SCENE_KEYS.WORLD_SCENE });
        this.playerStartX = (29 * TILE_SIZE) + 8
        this.playerStartY = 46 * TILE_SIZE

        this.currentWorldScene = "ROUTE_101";
    }

    preload() {
        let world_data = WORLD_KEYS[this.currentWorldScene]
        this.load.image("standardTileSet", "/assets/pokemonStarStandradTileSet.png");
        this.load.image("backgroundImage", world_data.mapPath);
        this.load.spritesheet("PLAYER", CHARACTER_ASSET_KEYS.PATH, { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("NPC_SPRITE_SHEET", "/assets/sprites/npcs/trAceTrainer_F.png", { frameWidth: 64, frameHeight: 64 });

        this.load.tilemapTiledJSON("map", "/assets/maps/routes/route_101/route_101.json");
    }

    init(data: {playerSession: playerSessionType}){
        if(data.playerSession){
            this.playerSession = data.playerSession
            this.playerStartX = data.playerSession.location.x
            this.playerStartY = data.playerSession.location.y
            this.currentWorldScene = data.playerSession.location.currentWorldScene
        }
        // Save Game Listeners
        window.addEventListener("beforeunload", () => {writeGameDataToSave(this.playerSession!)})
        window.addEventListener("unload", () => {writeGameDataToSave(this.playerSession!)})
        window.addEventListener("visibilitychange", () => {writeGameDataToSave(this.playerSession!)})
    }

    create() {
        const map = this.make.tilemap({ key: "map", tileHeight: 16, tileWidth: 16 });
        const tileSet = map.addTilesetImage("pokemonStarStandradTileSet", "standardTileSet");
        const collisionLayer = map.createLayer("CollisionLayer", tileSet as Phaser.Tilemaps.Tileset, 0, 0);
        collisionLayer?.setVisible(true);
        const terrainLayer = map.createLayer("TerrainLayer", tileSet as Phaser.Tilemaps.Tileset, 0, 0);
        const intermediaryLayer = map.createLayer("IntermediaryLayer", tileSet as Phaser.Tilemaps.Tileset, 0, 0);
        const vegetationLayer = map.createLayer("VegetationLayer", tileSet as Phaser.Tilemaps.Tileset, 0, 0);
        vegetationLayer?.setDepth(1);
        const objectLayer = map.createLayer("ObjectLayer", tileSet as Phaser.Tilemaps.Tileset, 0, 0);

        if (map.getObjectLayer('Sign')) {
            this.signLayer = map.getObjectLayer('Sign')!;
        }
        if (map.getObjectLayer("PokemonSpawns")){
            this.pokemonSpawnLayer = map.getObjectLayer('PokemonSpawns')!;
        }

        this.createPlayers(collisionLayer);
        this.createAnimations();

        this.cameras.main.setBounds(0, 0, 32 * 32, 32 * 32);
        this.cameras.main.setZoom(2);

        this.controls = new Controls(this);

        this.dialogUI = new BasicUiDialogBox(this, this.scale.width);

        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    update(time: number, delta: number): void {
        const selectedDirection = this.controls!.getDirectionKeyJustPressed();
        const selectedDirectionHeldDown = this.controls!.getDirectionKeyPressedDown();

        if (selectedDirectionHeldDown !== DIRECTION.NONE && !this.isPlayerInputLocked()) {
            this.player?.moveCharacter(selectedDirectionHeldDown);
        }
        if (this.controls?.wasSpaceKeyPressed() && !this.player?.isMoving) {
            this.handlePlayerObjectInteractions();
        }
        this.player?.update(time);
    }

    handlePlayerObjectInteractions() {
        if (this.dialogUI?.isAnimatonPlaying) {
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
            this.dialogUI?.showDialogModal(String(nearbySign.properties.find((property: any) => property.name == "message").value).split("::"));
            return;
        }
        if (this.dialogUI?.isVisible && this.dialogUI.moreMessagesToShow) {
            this.dialogUI.showNextMessage();
            return;
        }
        if (this.dialogUI?.isVisible && !this.dialogUI.moreMessagesToShow) {
            this.dialogUI.hideDialogModal();
            return;
        }
    }

    createPlayers(collisionLayer: Phaser.Tilemaps.TilemapLayer | null) {
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
            collisionLayer: collisionLayer
        });
        this.cameras.main.startFollow(this.player.sprite);

        new Character({
            scene: this,
            position: { x: 472, y: 390 },
            assetKey: "NPC_SPRITE_SHEET",
            idleFrames: {
                DOWN: 0,
                UP: 12,
                NONE: 0,
                LEFT: 4,
                RIGHT: 8
            },
            scaleSize: .5,
            direction: DIRECTION.DOWN,
            spriteGridMovementFinishedCallback: () => {},
            spriteChangedDirectionCallback: () => {},
            collisionLayer: collisionLayer
        });
    }

    createAnimations() {
        animations.forEach((animationObject) => {
            const frames = animationObject.frames
                ? this.anims.generateFrameNames(animationObject.assetKey, { frames: animationObject.frames })
                : this.anims.generateFrameNames(animationObject.assetKey);

            this.anims.create({
                key: animationObject.key,
                frames: frames,
                frameRate: animationObject.frameRate,
                repeat: animationObject.repeat,
                delay: animationObject.delay,
                yoyo: animationObject.yoyo
            });
        });
    }

    isPlayerInputLocked() {
        return this.controls!.isInputLocked || this.dialogUI!.isVisible;
    }


    checkPokemonSpawnLogic() {
        // Get the player's position
        let playerPos = this.player?.sprite?.getBounds()!;
    
        if (!playerPos) {
            return; // Exit if the player's position is not available
        }
    
        this.pokemonSpawnLayer?.objects.forEach((object) => {
            // Get object bounds
            let xMin = Math.round(object.x!);
            let xMax = Math.round(object.x!) + Math.round(object.width!);
            let yMin = Math.round(object.y!);
            let yMax = Math.round(object.y!) + Math.round(object.height!);
    
            // Check if the player's position is within the object's bounds
            if (playerPos.left >= xMin && playerPos.right <= xMax && playerPos.top >= yMin && playerPos.bottom <= yMax) {
                if(didPokemonAppearInZone()){
                    let pokemonEncountered = getPokemonEncountered(this.currentWorldScene)
                    this.playerSession!.location.x = this.player!._targetPosition.x;
                    this.playerSession!.location.y = this.player!._targetPosition.y;
                    this.playerSession!.location.direction = this.player!._direction;
                    this.scene.start(SCENE_KEYS.WILD_ENCOUNTER_SCENE, {
                        playerSession: this.playerSession,
                        pokemonEncountered: pokemonEncountered,
                    })
                }
            }
        });
    }
}
