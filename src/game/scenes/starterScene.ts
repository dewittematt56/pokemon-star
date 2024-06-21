import Phaser from 'phaser'
import { Controls } from '../utils/controls/control';
import { DIRECTION } from '../utils/controls/direction';
import { Character } from '../characters/characters';
import { Player } from '../characters/player/player';
import animations from "../configs/animations.json"
import { CHARACTER_ASSET_KEYS } from '../utils/assetKeys';
import { DialogUI } from '../world/dialog-ui';
import { getTargetPositionFromGameObjectPositionAndDirection } from '../utils/gridUtils.ts/gridUtils';
import { TILE_SIZE } from '../../commonData/configWorld';
import { SCENE_KEYS } from '../../commonData/keysScene';

export default class StarterScene extends Phaser.Scene {
    player: Character | undefined;
    controls: Controls | undefined; 
    dialogUI: DialogUI | undefined;
    signLayer: Phaser.Tilemaps.ObjectLayer | undefined

    constructor(){
        super({key: SCENE_KEYS.WORLD_SCENE})
        
    }

    // Load source files for scene
    preload(){
        this.load.image("standardTileSet", "/assets/pokemonStarStandradTileSet.png");
        this.load.image("backgroundImage", "/assets/maps/routes/route_101/route_101.png");
        this.load.spritesheet("PLAYER", CHARACTER_ASSET_KEYS.PATH, {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet("NPC_SPRITE_SHEET", "/assets/sprites/npcs/trAceTrainer_F.png", {frameWidth: 64, frameHeight: 64})

        this.load.tilemapTiledJSON("map", "/assets/maps/routes/route_101/route_101.json");
    }

    create(){
        // To-do abstract to other method
        const map = this.make.tilemap({key: "map", tileHeight: 16, tileWidth: 16});
        const tileSet = map.addTilesetImage("pokemonStarStandradTileSet", "standardTileSet");
        const collisionLayer = map.createLayer("CollisionLayer", tileSet as Phaser.Tilemaps.Tileset, 0, 0);
        collisionLayer?.setVisible(true)
        const terrainLayer = map.createLayer("TerrainLayer", tileSet as Phaser.Tilemaps.Tileset, 0, 0);
        const intermediaryLayer = map.createLayer("IntermediaryLayer", tileSet as Phaser.Tilemaps.Tileset, 0, 0);
        const vegetationLayer = map.createLayer("VegetationLayer", tileSet as Phaser.Tilemaps.Tileset, 0, 0);
        vegetationLayer?.setDepth(1)
        const objectLayer = map.createLayer("ObjectLayer", tileSet as Phaser.Tilemaps.Tileset, 0, 0);

        if(map.getObjectLayer('Sign')){
            this.signLayer = map.getObjectLayer('Sign')!;
        }

        this.createPlayers(collisionLayer);
        this.createAnimations()

        this.cameras.main.setBounds(0, 0, 32 * 32, 32 * 32)
        this.cameras.main.setZoom(2)

        this.controls = new Controls(this);

        this.dialogUI = new DialogUI(this, this.scale.width)

        // Set Animation for scene start
        this.cameras.main.fadeIn(1000, 0, 0, 0)
    }

    update(time: number, delta: number): void {
        const selectedDirection = this.controls!.getDirectionKeyJustPressed();
        const selectedDirectionHeldDown = this.controls!.getDirectionKeyPressedDown();
        if(selectedDirectionHeldDown !== DIRECTION.NONE && !this.isPlayerInputLocked()){
            this.player?.moveCharacter(selectedDirection);
        }
        if(this.controls?.wasSpaceKeyPressed() && !this.player?.isMoving){
            this.handlePlayerObjectInteractions();
        }
        this.player?.update(time);

    }

    
    /**
     * Handle a Players Interaction with an object on the map
     */
    handlePlayerObjectInteractions(){
        if(this.dialogUI?.isAnimatonPlaying){
            return
        }
        // Current Player XY Position
        const {x, y} = this.player!.sprite
        // Position Player is interacting with
        const targetPosition = getTargetPositionFromGameObjectPositionAndDirection({x, y}, this.player!.direction)
        // Find nearby sign
        const nearbySign = this.signLayer?.objects.find((object) => {
            if (!object.x || !object.y) {
              return false;
            }
            return object.x === targetPosition.x - 8 && object.y - TILE_SIZE === targetPosition.y;
        });
        // If there is a nearby sign and no more messages to show
        if(nearbySign && !this.dialogUI?.isVisible){
            this.dialogUI?.showDialogModal(String(nearbySign.properties.find((property: any) => property.name == "message").value).split("::"))
            return
        }
        // If Dialog is visible and there are more messages to show
        if(this.dialogUI?.isVisible && this.dialogUI.moreMessagesToShow){
            this.dialogUI.showNextMessage();
            return
        }
        // If visible and no more messages to show
        if(this.dialogUI?.isVisible && !this.dialogUI.moreMessagesToShow){
            this.dialogUI.hideDialogModal();
            return;
        }  
    }

    createPlayers(collisionLayer: Phaser.Tilemaps.TilemapLayer | null){
        this.player = new Player({
            scene: this,
            // position: {x: 472, y: 752}, 
            position: {x: (41 * TILE_SIZE) + 8, y: 13 * TILE_SIZE}, 
            assetKey: "PLAYER",
            idleFrames: {
                DOWN: 0,
                UP: 12,
                NONE: 0,
                LEFT: 4,
                RIGHT: 8
            },
            scaleSize: .5, 
            direction: DIRECTION.UP,
            spriteGridMovementFinishedCallback: () => {},
            spriteChangedDirectionCallback: () => {},
            collisionLayer: collisionLayer
        })
        this.cameras.main.startFollow(this.player.sprite);

        new Character({
            scene: this,
            position: {x: 472, y: 390}, 
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
        })
    }

    createAnimations(){
        animations.forEach((animationObject) => {
            // Generate Dynamic Frames
            const frames = animationObject.frames ? 
                this.anims.generateFrameNames(animationObject.assetKey, {frames: animationObject.frames}) 
                : 
                this.anims.generateFrameNames(animationObject.assetKey)
            
            this.anims.create({
                key: animationObject.key,
                frames: frames,
                frameRate: animationObject.frameRate,
                repeat: animationObject.repeat,
                delay: animationObject.delay,
                yoyo: animationObject.yoyo
            })
        })
    }

    isPlayerInputLocked() {
        return this.controls!.isInputLocked || this.dialogUI!.isVisible
    }
}