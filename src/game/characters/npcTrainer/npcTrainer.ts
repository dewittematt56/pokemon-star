import { Character, CharacterConfig } from "../characters";
import { DIRECTION_TYPE, DIRECTION } from "../../utils/controls/direction";
import { AnimatedImageType, NpcWorldImage, PokemonConfig, PokemonPartyType, npcDialog } from "../../../commonTypes/typeDefs";
import { Pokemon } from "../../../commonClass/pokemon/pokemon/pokemon";
import { getTargetPositionFromGameObjectPositionAndDirection } from "../../utils/gridUtils.ts/gridUtils";
import { CoordinateType } from "../../utils/typeDefs/coordinate";

export type NpcTrainerConfig = {
    pokemon: PokemonConfig[],
    dialog: npcDialog,
    portrait: AnimatedImageType,
    npcWorldImage: NpcWorldImage,
    movementPattern: DIRECTION_TYPE[],
    collisionSprites: Character[]
}

export class NpcTrainer extends Character {
    public pokemonParty: PokemonPartyType;
    public dialog: npcDialog;
    private npcPortraitInfo: AnimatedImageType | undefined;
    public npcTrainerSprite: Phaser.GameObjects.Sprite | undefined;
    public alertIcon: Phaser.GameObjects.Image | undefined;

    public movementPattern: DIRECTION_TYPE[];
    public movementIndex: number;

    public _collisionCharacterSprites: Character[]
    public hasBeenBeaten: boolean = false;
    public lockMovementPattern: boolean = false

    constructor(config: CharacterConfig, trainerConfig: NpcTrainerConfig){
        super({
            ...config,
            assetKey: config.assetKey
        })
        // Create NPC Movement Animations
        trainerConfig.npcWorldImage.animations.forEach((animationObject) => {
            const frames = animationObject.frames
                ? this._scene.anims.generateFrameNames(animationObject.assetKey, { frames: animationObject.frames })
                : this._scene.anims.generateFrameNames(animationObject.assetKey);

                this._scene.anims.create({
                key: animationObject.key,
                frames: frames,
                frameRate: animationObject.frameRate * 2,
                repeat: animationObject.repeat,
                delay: animationObject.delay,
                yoyo: animationObject.yoyo,
                
            });
        });

        this.pokemonParty = trainerConfig.pokemon.map((pokemon) => new Pokemon(undefined, pokemon.pokemon, pokemon.level, pokemon.ivData, pokemon.evData, pokemon.currentHp, undefined, pokemon.moves))
        this.dialog = trainerConfig.dialog
        this.npcPortraitInfo = trainerConfig.portrait
        


        this.movementIndex = 0
        this.movementPattern = trainerConfig.movementPattern
        
        this.spriteSpeedFactor = 1.25;
        this._spriteGridMovementFinishedCallback = () => {
            if(!this.lockMovementPattern){
                this.movementIndex++;
                if(this.movementIndex > this.movementPattern.length){
                    this.movementIndex = 0;
                }
                this.moveCharacter(this.movementPattern[this.movementIndex])
            }
        }
        this._collisionCharacterSprites = trainerConfig.collisionSprites
        this.moveCharacter(this.movementPattern[this.movementIndex])
        this.buildAlertIcon()
    }

    // To-Do Implement Game Sprite and Dialog
    buildTrainerSpite(x: number, y: number){
        if(this.npcPortraitInfo){
            // new Phaser.GameObjects.Sprite(this._scene, x, y, this.npcPortraitInfo.assetKey);
            this.npcTrainerSprite = this._scene.add.sprite((x + (this.npcPortraitInfo.width / 2)), y + (this.npcPortraitInfo.height / 2), this.npcPortraitInfo.assetKey).setScale(4)
            this._scene.anims.create({
                key: this.npcPortraitInfo.assetKey,
                frames: this._scene.anims.generateFrameNumbers(this.npcPortraitInfo.assetKey, { start: this.npcPortraitInfo.animStart, end: this.npcPortraitInfo.animFinish }),
                frameRate: this.npcPortraitInfo.frameRate,
                repeat: 0
            });
            this.npcTrainerSprite.play(this.npcPortraitInfo.assetKey)
        }

    }

    // ------------------------- MOVEMENT 
    _isBlockingTile() {
        if (this._direction === DIRECTION.NONE) {
            return false;
        }
        
        const targetPosition = { ...this._targetPosition };
        const updatedPosition = getTargetPositionFromGameObjectPositionAndDirection(targetPosition, this._direction);
        let result: boolean = this.doesMovementCollideWithCharacters(updatedPosition) || this.doesCollisionCollideWithPosition(updatedPosition)
        return result;
    }

    _moveSprite(direction: DIRECTION_TYPE, stopBlock: boolean = false) {
        const changedDirection = this._direction !== direction;
        this._direction = direction;

        if (changedDirection && this._spriteChangedDirectionCallback) {
            this._spriteChangedDirectionCallback();
        }

        if (this._isBlockingTile()) {
            if(!stopBlock){
                return setTimeout(() => this.moveCharacter(this.handleBlockedMovement(direction), stopBlock), 500);
            } else {
                return
            }
        }

        this._isMoving = true;
        this._phaserGameObject.anims.play(`${this._phaserGameObject.texture.key}-${direction}`, true);
        this.handleSpriteMovement();
    }

    moveCharacter(direction: DIRECTION_TYPE, stopBlock: boolean = false): void {
        if (this._isMoving) {
            return;
        }
        this._moveSprite(direction, stopBlock);
    }

    doesMovementCollideWithCharacters(targetPosition: CoordinateType): boolean{
        return this._collisionCharacterSprites?.findIndex((character) => {
            return character.position.x == targetPosition.x && character.position.y == targetPosition.y
        }) !== -1
    }

    handleBlockedMovement(direction: DIRECTION_TYPE){
        let anticipatedDirectionIndex = this.movementPattern.findIndex((movement, index) => movement !== direction && index > this.movementIndex) 
        this.movementIndex = Math.max(anticipatedDirectionIndex, 0);
        return this.movementPattern[this.movementIndex];
    }

    async moveToTargetPosition (targetPosition: CoordinateType){
        this.lockMovementPattern = true

        let differenceX = targetPosition.x - this.position.x
        let numberOfXMoves = differenceX / 16

        let differenceY = targetPosition.y - this.position.y
        let numberOfYMoves = differenceY / 16

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        if(numberOfXMoves > 0){for(let i: number = 0; i < numberOfXMoves; i++){
            await delay(i * 150);
            this.moveCharacter("RIGHT", true);
        }}
        else if(numberOfXMoves < 0){for(let i: number = 0; i < numberOfXMoves; i++){
            await delay(i * 150);
            this.moveCharacter("LEFT", true);
        }} 
        
        // Y-Axis Movements
        if(numberOfYMoves < 0){for(let i: number = 0; i < numberOfYMoves; i++){
            await delay(i * 400);
            this.moveCharacter("UP", true);
        }}
        else if(numberOfYMoves > 0){
            for (let i: number = 0; i < numberOfYMoves; i++){
                await delay(i * 150);
                this.moveCharacter("DOWN", true);
            }
        } 
        return
    }

    // ------------------------- AlertIcon
    buildAlertIcon(){
        this.alertIcon = this._scene.add.image(0, 0, "alertIcon").setScale(1).setVisible(false).setDepth(4)
    }

    displayAlertIcon(){
        this.alertIcon?.setX(this.position.x)
        this.alertIcon?.setY(this.position.y - 16);
        this.alertIcon?.setVisible(true)
    }

    hideAlertIcon(){
        this.alertIcon?.setVisible(false)
    }
}

