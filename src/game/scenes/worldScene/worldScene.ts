import Phaser from 'phaser';
import { Controls } from '../../utils/controls/control';
import { DIRECTION } from '../../utils/controls/direction';
import { Character } from '../../characters/characters';
import { Player } from '../../characters/player/player';
import { CHARACTER_ASSET_KEYS } from '../../utils/assetKeys';
import { BasicUiDialogBox } from '../../../components/dialog/basicUiDialogBox';
import { getTargetPositionFromGameObjectPositionAndDirection } from '../../utils/gridUtils.ts/gridUtils';
import { TILE_SIZE } from '../../../commonData/configWorld';
import { SCENE_KEYS, SCENE_INFO } from '../../../commonData/dataScenes';
import { didPokemonAppearInZone, getPokemonEncountered } from './utils/encounterUtils';
import { SceneType, playerSessionType } from '../../../commonTypes/typeDefs';
import { writeGameDataToSave } from '../../utils/gameSaves/utils';

export default class StarterScene extends Phaser.Scene {
    player: Player | undefined;
    characters: Character[];
    controls: Controls | undefined;
    dialogUI: BasicUiDialogBox | undefined;
    signLayer: Phaser.Tilemaps.ObjectLayer | undefined;
    pokemonSpawnLayer: Phaser.Tilemaps.ObjectLayer | undefined;
    playerStartX: number;
    playerStartY: number;

    private currentWorldScene: keyof typeof SCENE_INFO;
    private currentWorldInfo: SceneType;
    private playerSession: playerSessionType | undefined;

    constructor() {
        super({ key: SCENE_KEYS.WORLD_SCENE });
        this.playerStartX = (29 * TILE_SIZE) + 8
        this.playerStartY = 46 * TILE_SIZE

        this.characters = [];

        this.currentWorldScene = "ROUTE_101";
        this.currentWorldInfo = SCENE_INFO[this.currentWorldScene];
    }

    preload() {
        let world_data = SCENE_INFO[this.currentWorldScene]
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
            this.currentWorldInfo = SCENE_INFO[this.currentWorldScene];
        }
        // Save Game Listeners
        window.addEventListener("beforeunload", () => this.saveGameHandler())
        window.addEventListener("unload", () => this.saveGameHandler())
        window.addEventListener("visibilitychange", () => this.saveGameHandler())
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

        this.createCharacters(collisionLayer);

        this.cameras.main.setBounds(0, 0, 32 * 32, 32 * 32);
        this.cameras.main.setZoom(2);

        this.controls = new Controls(this);

        this.dialogUI = new BasicUiDialogBox(this, this.scale.width);

        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    update(time: number, delta: number): void {
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

    createCharacters(collisionLayer: Phaser.Tilemaps.TilemapLayer | null) {
        // Create Player Object
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
                this.checkOpponentViewLogic()
                this.checkPokemonSpawnLogic()
            },
            spriteChangedDirectionCallback: () => {},
            collisionLayer: collisionLayer,
            isAggressive: false,
            sightRange: 0
        });
        this.cameras.main.startFollow(this.player.sprite);
        // Generate all NPC
        this.characters = this.currentWorldInfo.npcs.map((npc) => {
            return new Character({
                     scene: this,
                     position: { x: npc.location.x, y: npc.location.y },
                     assetKey: "NPC_SPRITE_SHEET",
                     idleFrames: npc.idleFrames,
                     scaleSize: npc.scaleSize,
                     direction: npc.location.direction,
                     spriteGridMovementFinishedCallback: npc.spriteGridMovementFinishedCallback,
                     spriteChangedDirectionCallback: npc.spriteChangedDirectionCallback,
                     collisionLayer: collisionLayer,
                     isAggressive: npc.isAggressive,
                     sightRange: npc.sightRange
                });
        })
        
    }

    isPlayerInputLocked() {
        return this.controls!.isInputLocked || this.dialogUI!.isVisible;
    }

    startNpcBattle(character: Character) {
        
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

    checkOpponentViewLogic() {
        if (!this.player || !this.player.sprite) {
            return; // Exit if the player or player sprite is not available
        }
    
        const playerPos = this.player.sprite.getBounds();
        const playerPosAdjustX = playerPos.x / TILE_SIZE + 0.5;
        const playerPosAdjustY = playerPos.y / TILE_SIZE;
    
        this.characters.forEach((character) => {
            if (character.isAggressive) {
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



    saveGameHandler(){
        this.playerSession!.location.x = this.player!._targetPosition.x;
        this.playerSession!.location.y = this.player!._targetPosition.y;
        this.playerSession!.location.direction = this.player!._direction;
        writeGameDataToSave(this.playerSession!)
    }
}
