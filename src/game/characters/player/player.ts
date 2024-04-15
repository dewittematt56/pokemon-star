import { Character, CharacterConfig } from "../characters";
import { DIRECTION_TYPE, DIRECTION } from "../../utils/controls/direction";

export class Player extends Character {
    constructor(config: CharacterConfig){
        super({
            ...config,
            assetKey: "PLAYER"
        })
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