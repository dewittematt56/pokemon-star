import Phaser from 'phaser'
import { Controls } from '../utils/control';
import { DIRECTION } from '../utils/controls/direction';
import { Character } from '../characters/characters';
import { Player } from '../characters/player/player';
import animations from "../configs/animations.json"
import { CHARACTER_ASSET_KEYS } from '../utils/assetKeys';

export default class StarterScene extends Phaser.Scene {
    player: Character | undefined;
    controls: Controls | undefined; 

    constructor(){
        super("starter-scene")
        
    }

    // Load source files for scene
    preload(){
        this.load.image("standardTileSet", "/assets/pokemonStarStandradTileSet.png");
        this.load.spritesheet("PLAYER", CHARACTER_ASSET_KEYS.PATH, {frameWidth: 64, frameHeight: 88})
        this.load.tilemapTiledJSON("map", "/assets/maps/routes/route_101/route_101.json");
    }

    create(){
        const map = this.make.tilemap({key: "map", tileHeight: 32, tileWidth: 32});
        const tileset = map.addTilesetImage("pokemonStarStandradTileSet", "standardTileSet");
        const terrainLayer = map.createLayer("TerrainLayer", tileset as Phaser.Tilemaps.Tileset, 0, 0);
        const vegetationLayer = map.createLayer("VegetationLayer", tileset as Phaser.Tilemaps.Tileset, 0, 0);
        const objectLayer = map.createLayer("ObjectLayer", tileset as Phaser.Tilemaps.Tileset, 0, 0);
        const intermediaryLayer = map.createLayer("IntermediaryLayer", tileset as Phaser.Tilemaps.Tileset, 0, 0);

        this.player = new Player({
            scene: this,
            position: {x: 480, y: 750}, 
            assetKey: "PLAYER",
            idleFrames: {
                DOWN: 7,
                UP: 1,
                NONE: 7,
                LEFT: 10,
                RIGHT: 4
            },
            scaleSize: 0.5, 
            direction: DIRECTION.UP,
            spriteGridMovementFinishedCallback: () => {}
        })
        this.createAnimations()
        this.controls = new Controls(this);
    }

    update(time: number, delta: number): void {
        const selectedDirection = this.controls!.getDirectionKeyJustPressed();
        if(selectedDirection !== DIRECTION.NONE){
            this.player?.moveCharacter(selectedDirection);
        }

        this.player?.update(time);

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
}