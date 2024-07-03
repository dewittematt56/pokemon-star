import { Character, CharacterConfig } from "../../../commonClass/characters/characters";
import { DIRECTION, DIRECTION_TYPE } from "../../../game/utils/controls/direction";
import { ANIMATIONS } from "../../../commonData/commonAnimations";
import { getTargetPositionFromGameObjectPositionAndDirection } from "../../../game/utils/gridUtils.ts/gridUtils";
import { CoordinateType } from "../../../game/utils/typeDefs/coordinate";


export class Player extends Character {
    private _collisionCharacterSprites?: Character[]

    constructor(config: CharacterConfig){
        super({
            ...config,
            assetKey: "PLAYER"
        })
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
}