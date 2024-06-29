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
    spriteChangedDirectionCallback: Function
    idleFrames: CharacterIdleFrameConfig,
    collisionLayer?: Phaser.Tilemaps.TilemapLayer | null,
    isAggressive: boolean
    sightRange: number
}

export class Character {
    _scene: Phaser.Scene;
    _phaserGameObject: Phaser.GameObjects.Sprite;
    _direction: DIRECTION_TYPE;
    _isMoving: boolean;
    _targetPosition: CoordinateType;
    _previousTargetPosition: CoordinateType;
    _spriteGridMovementFinishedCallback: Function;
    _spriteChangedDirectionCallback: Function;
    _collisionLayer?: Phaser.Tilemaps.TilemapLayer | null;
    public isAggressive: boolean = false;
    public sightRange: number = 5;

    constructor(config: CharacterConfig) {
        this._scene = config.scene;
        this._direction = config.direction;
        this._isMoving = false;
        this._targetPosition = { ...config.position };
        this._previousTargetPosition = { ...config.position };

        this._phaserGameObject = this._scene.add.sprite(config.position.x, config.position.y, config.assetKey, config.idleFrames[config.direction]);
        this._phaserGameObject.setScale(config.scaleSize ? config.scaleSize : 1);
        this._phaserGameObject.setDepth(2)

        this._spriteGridMovementFinishedCallback = config.spriteGridMovementFinishedCallback;
        this._spriteChangedDirectionCallback = config.spriteChangedDirectionCallback;
        this._collisionLayer = config.collisionLayer;

        this.isAggressive = config.isAggressive
        this.sightRange = config.sightRange
    }

    get isMoving(): boolean {
        return this._isMoving;
    }

    get direction(): DIRECTION_TYPE {
        return this._direction;
    }

    get sprite(): Phaser.GameObjects.Sprite {
        return this._phaserGameObject;
    }

    get position(): CoordinateType {
        return this._previousTargetPosition
    }

    moveCharacter(direction: DIRECTION_TYPE): void {
        if (this._isMoving) {
            return;
        }
        this._moveSprite(direction);
    }

    update(time: DOMHighResTimeStamp) {
        if (this._isMoving) {
            return;
        }
        const idleFrame = this._phaserGameObject.anims.currentAnim?.frames[0].frame.name;

        if (!idleFrame) {
            return;
        }
        this._phaserGameObject.setFrame(idleFrame);
    }

    _moveSprite(direction: DIRECTION_TYPE) {
        const changedDirection = this._direction !== direction;
        this._direction = direction;

        if (changedDirection && this._spriteChangedDirectionCallback) {
            this._spriteChangedDirectionCallback();
        }

        if (this._isBlockingTile()) {
            return;
        }

        this._isMoving = true;
        this._phaserGameObject.anims.play(`${this._phaserGameObject.texture.key}-${direction}`, true);
        this.handleSpriteMovement();
    }

    _isBlockingTile() {
        if (this._direction === DIRECTION.NONE) {
            return false;
        }

        const targetPosition = { ...this._targetPosition };
        const updatedPosition = getTargetPositionFromGameObjectPositionAndDirection(targetPosition, this._direction);

        return this.doesCollisionCollideWithPosition(updatedPosition);
    }

    handleSpriteMovement() {
        if (this._direction === DIRECTION.NONE) {
            return;
        }

        const updatedPosition = getTargetPositionFromGameObjectPositionAndDirection(this._targetPosition, this._direction);
        this._previousTargetPosition = { ...this._targetPosition };
        this._targetPosition = { ...updatedPosition };

        this._scene.add.tween({
            delay: 0,
            duration: 300 * .5,
            y: {
                from: this._phaserGameObject.y,
                to: this._targetPosition.y
            },
            x: {
                from: this._phaserGameObject.x,
                to: this._targetPosition.x
            },
            targets: this._phaserGameObject,
            onComplete: () => {
                this._isMoving = false;
                this._phaserGameObject.anims.stop();
                if (this._spriteGridMovementFinishedCallback) {
                    this._spriteGridMovementFinishedCallback();
                }
            }
        });
    }

    doesCollisionCollideWithPosition(position: CoordinateType) {
        if (!this._collisionLayer) {
            return false;
        }

        const { x, y } = position;
        const tile = this._collisionLayer.getTileAtWorldXY(x, y, true);
        return tile.index !== -1;
    }
}
