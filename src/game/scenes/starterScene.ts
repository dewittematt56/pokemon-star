import Phaser from 'phaser'

export default class StarterScene extends Phaser.Scene {
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
    cursor: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    constructor(){
        super("starter-scene")

    }

    // Load source files for scene
    preload(){
        this.load.image("standardTileSet", "/assets/pokemonStarStandradTileSet.png");
        this.load.image('player', '/assets/sprites/players/player.png')
        this.load.tilemapTiledJSON("map", "/assets/maps/routes/route_101/route_101.json");
    }

    create(){
        const map = this.make.tilemap({key: "map", tileHeight: 32, tileWidth: 32});
        const tileset = map.addTilesetImage("pokemonStarStandradTileSet", "standardTileSet");
        const terrainLayer = map.createLayer("TerrainLayer", tileset as Phaser.Tilemaps.Tileset, 0, 0);
        const vegetationLayer = map.createLayer("VegetationLayer", tileset as Phaser.Tilemaps.Tileset, 0, 0);
        const objectLayer = map.createLayer("ObjectLayer", tileset as Phaser.Tilemaps.Tileset, 0, 0);
        const intermediaryLayer = map.createLayer("IntermediaryLayer", tileset as Phaser.Tilemaps.Tileset, 0, 0);
        this.player = this.physics.add.sprite(475, 750, "player")
        this.player.setScale(0.1);

        this.cursor = this.input.keyboard!.createCursorKeys();
    }

    update(time: number, delta: number): void {
        if(this.player && this.cursor){
            this.player.setVelocityY(0);
            this.player.setVelocityX(0)
            if(this.cursor.up.isDown){
                this.player.setVelocityY(-100)
            } else if(this.cursor.down.isDown){
                this.player.setVelocityY(100)
            } else if(this.cursor.left.isDown){
                this.player.setVelocityX(-100)
            } else if(this.cursor.right.isDown){
                this.player.setVelocityX(100)
            }
        }

    }
}