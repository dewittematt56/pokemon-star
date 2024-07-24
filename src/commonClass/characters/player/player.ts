import { Character, CharacterConfig } from "../../../commonClass/characters/characters";
import { DIRECTION, DIRECTION_TYPE } from "../../../game/utils/controls/direction";
import { ANIMATIONS } from "../../../commonData/commonAnimations";
import { getTargetPositionFromGameObjectPositionAndDirection } from "../../../game/utils/gridUtils.ts/gridUtils";
import { CoordinateType } from "../../../game/utils/typeDefs/coordinate";
import { findPlayerPositionIntersectsObject } from "../../../commonUtils/tileUtils";
import { sceneTransferType } from "../../../commonTypes/typeDefs";

export type playerConfig = {
    sceneTransferLayer: Phaser.Tilemaps.ObjectLayer,
    sceneTransferCallback: Function
}

export class Player extends Character {
    private _collisionCharacterSprites?: Character[]
    private sceneTransferLayer: Phaser.Tilemaps.ObjectLayer;
    private sceneTransferCallback: Function

    constructor(config: CharacterConfig, playerConfig: playerConfig){
        super({
            ...config,
            assetKey: "PLAYER"
        })
        this.sceneTransferLayer = playerConfig.sceneTransferLayer;
        this.sceneTransferCallback = playerConfig.sceneTransferCallback;

        this.spriteSpeedFactor = .5;
        ANIMATIONS.PLAYER.forEach((animationObject) => {
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
        this._collisionCharacterSprites = []

        this.sprite.setDepth(3)
    }

    setCollisionCharacterSprites(characters: Character[]){
        this._collisionCharacterSprites = characters;
    }

    /**
     * Move player -- called via Scene Control
     *
     * @param {DIRECTION_TYPE} direction
     */
    moveCharacter(direction: DIRECTION_TYPE): void {
        super.moveCharacter(direction);
        // Custom Logic after movement
        switch(this._direction){
            case DIRECTION.DOWN:
            case DIRECTION.UP:
            case DIRECTION.RIGHT:
            case DIRECTION.LEFT:
                if(!this._phaserGameObject.anims.isPlaying || 
                    this._phaserGameObject.anims.currentAnim?.key !== `PLAYER_${direction}`
                ){
                    this._phaserGameObject.play(`PLAYER_${direction}`)
                }
            break;
            case DIRECTION.NONE:
                break;
            default: 
                break;
        }
    }

    _isBlockingTile() {
        if (this._direction === DIRECTION.NONE) {
            return false;
        }
        
        const targetPosition = { ...this._targetPosition };
        const updatedPosition = getTargetPositionFromGameObjectPositionAndDirection(targetPosition, this._direction);
        let result: boolean = this.doesMovementCollideWithCharacters(updatedPosition) || this.doesCollisionCollideWithPosition(updatedPosition)
        return result;
    }

    doesMovementCollideWithCharacters(targetPosition: CoordinateType): boolean{
        return this._collisionCharacterSprites?.findIndex((character) => {
            return character.position.x == targetPosition.x && character.position.y == targetPosition.y
        }) !== -1
    }

    _moveSprite(direction: DIRECTION_TYPE) {
        const changedDirection = this._direction !== direction;
        this._direction = direction;

        if (changedDirection && this._spriteChangedDirectionCallback) {
            this._spriteChangedDirectionCallback();
        }

        if (this._isBlockingTile()) {
            if (this._isJumpableTile()){
                this.handleSpriteJump()
            }
            this.handleSceneTransfer()
            return;
        }

        this._isMoving = true;
        this._phaserGameObject.anims.play(`${this._phaserGameObject.texture.key}-${direction}`, true);
        this.handleSpriteMovement();
    }

    handleSceneTransfer(){
        const targetPosition = { ...this._targetPosition };
        const updatedPosition = getTargetPositionFromGameObjectPositionAndDirection(targetPosition, this._direction);

        if (this._direction === DIRECTION.NONE) {
            return false;
        }

        let found_object = findPlayerPositionIntersectsObject(updatedPosition, this.sceneTransferLayer)
        // A Scene Transfer has been found.
        if(found_object){
            let newSceneKey = found_object?.properties.find((prop: any) => prop.name == "NEW_SCENE_KEY")?.value
            let newScenePositionX = found_object?.properties.find((prop: any) => prop.name == "START_X")?.value
            let newScenePositionY = found_object?.properties.find((prop: any) => prop.name == "START_Y")?.value
            let newSceneDirection = found_object?.properties.find((prop: any) => prop.name == "START_DIR")?.value
            let newSceneInfo: sceneTransferType = {newSceneKey: newSceneKey, newScenePositionX: newScenePositionX, newScenePositionY: newScenePositionY, newSceneDirection: newSceneDirection}
            this.sceneTransferCallback(newSceneInfo)
        }
    }
}