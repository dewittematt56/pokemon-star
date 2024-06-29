import { Character, CharacterConfig } from "../characters";
import { DIRECTION_TYPE, DIRECTION } from "../../utils/controls/direction";
import { ANIMATIONS } from "../../../commonData/commonAnimations";

export class Player extends Character {
    constructor(config: CharacterConfig){
        super({
            ...config,
            assetKey: "PLAYER"
        })
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

        this.sprite.setDepth(3)
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

    

}