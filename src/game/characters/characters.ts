import { DIRECTION, DIRECTION_TYPE } from "../utils/controls/direction";
import { CoordinateType } from "../utils/typeDefs/coordinate";
import { getTargetPositionFromGameObjectPositionAndDirection } from "../utils/gridUtils.ts/gridUtils";

export type CharacterIdleFrameConfig = {
    DOWN: number,
    UP: number,
    NONE: number,
    LEFT: number,
    RIGHT: number
}

export type CharacterConfig = {
    scene: Phaser.Scene,
    assetKey: string,
    position: CoordinateType
    scaleSize?: number;
    direction: DIRECTION_TYPE;
    spriteGridMovementFinishedCallback: Function;
    idleFrames: CharacterIdleFrameConfig,
    collisionLayer?: Phaser.Tilemaps.TilemapLayer | null
}

export class Character {
    _scene: Phaser.Scene;
    _phaserGameObject: Phaser.GameObjects.Sprite;
    _direction: DIRECTION_TYPE;
    _isMoving: boolean;
    _targetPosition: CoordinateType;
    _previousTargetPosition: CoordinateType;
    _spriteGridMovementFinishedCallback: Function;
    _collisionLayer?: Phaser.Tilemaps.TilemapLayer | null;

    constructor(config: CharacterConfig){
        this._scene = config.scene
        this._direction = config.direction;
        this._isMoving = false;
        this._targetPosition = {...config.position};
        this._previousTargetPosition = {...config.position};
        
        this._phaserGameObject = this._scene.add.sprite(config.position.x, config.position.y, config.assetKey, config.idleFrames[config.direction]);
        this._phaserGameObject.setScale(config.scaleSize ? config.scaleSize : 1);

        this._spriteGridMovementFinishedCallback = config.spriteGridMovementFinishedCallback;

        this._collisionLayer = config.collisionLayer;
    }

    get isMoving(): boolean {
        return this._isMoving
    }

    get direction(): DIRECTION_TYPE {
        return this._direction
    }

    get sprite(): Phaser.GameObjects.Sprite {
        return this._phaserGameObject
    }

    
    /**
     * Move Character on Map
     *
     * @param {DIRECTION_TYPE} direction
     */
    moveCharacter(direction: DIRECTION_TYPE): void {
        if(this._isMoving){
            return;
        } else {
        this._moveSprite(direction);
        }
    }

    /**
     * Description placeholder
     *
     * @param {DOMHighResTimeStamp} time 
     */
    update(time: DOMHighResTimeStamp) {
        if(this._isMoving){
            return;
        } 
        const idleFrame = this._phaserGameObject.anims.currentAnim?.frames[1].frame.name;

        // If destination reached, stop animation
        this._phaserGameObject.anims.stop();
        if(!idleFrame){
            return;
        }
        // Set to the Idle Frame when done moving
        switch(this._direction){
            case DIRECTION.DOWN:
            case DIRECTION.UP:
            case DIRECTION.RIGHT:
            case DIRECTION.LEFT:
                this._phaserGameObject.setFrame(idleFrame)
            break;
            case DIRECTION.NONE:
                break;
            default: 
                break;
        }
    }

    _moveSprite(direction: DIRECTION_TYPE){
        // Update Direction of input
        this._direction = direction;
        if(this._isBlockingTile()){
            return
        }
        this.handleSpriteMovement()
        this._isMoving = true;
    }

    
    /**
     * Check if tile character is moving to is a blocking tile
     *
     * @returns {boolean}
     */
    _isBlockingTile(){
        if(this._direction === DIRECTION.NONE){return}

        const targetPosition = {...this._targetPosition};
        const updatedPosition = getTargetPositionFromGameObjectPositionAndDirection(targetPosition, this._direction)

        return this.doesCollisionCollideWithPosition(updatedPosition);
    }

    
    /**
     * Apply animation to movement of playing via 'tween'
     */
    handleSpriteMovement(){
        if(this._direction === DIRECTION.NONE){return;}
        const updatedPosition = getTargetPositionFromGameObjectPositionAndDirection(this._targetPosition, this._direction);
        this._previousTargetPosition = {...this._targetPosition};
        this._targetPosition = {...updatedPosition};
        this._scene.add.tween({
            delay: 0,
            duration: 300,
            y: {
                from: this._phaserGameObject.y,
                start: this._phaserGameObject.y,
                to: this._targetPosition.y
            }, 
            x: {
                from: this._phaserGameObject.x,
                start: this._phaserGameObject.x,
                to: this._targetPosition.x
            },
            targets: this._phaserGameObject,
            onComplete: () => {
                this._isMoving = false;
                this._previousTargetPosition = {...this._targetPosition}
                if(this._spriteGridMovementFinishedCallback){
                    this._spriteGridMovementFinishedCallback();
                }
            }
        });
    }

    
    /**
     * Check if position character is moving to is within the collision layer specified for the character
     *
     * @param {CoordinateType} position
     * @returns {boolean}
     */
    doesCollisionCollideWithPosition(position: CoordinateType){
        if(!this._collisionLayer){
            return false
        }

        const { x, y } = position;
        const tile = this._collisionLayer.getTileAtWorldXY(x, y, true);
        return tile.index !== -1;
        
    }
}