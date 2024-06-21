import { DIRECTION_TYPE, DIRECTION } from "../controls/direction";
import { CoordinateType } from "../typeDefs/coordinate";
import { TILE_SIZE } from "../../../commonData/configWorld";

/**
 * Take in current position and update it with given direction to find new position.
 *
 * @export
 * @param {CoordinateType} currentPosition
 * @param {DIRECTION_TYPE} direction
 * @returns {*}
 */
export function getTargetPositionFromGameObjectPositionAndDirection(currentPosition: CoordinateType, direction: DIRECTION_TYPE){
    const targetPosition = {...currentPosition};
    switch(direction){
        case DIRECTION.DOWN:
            targetPosition.y += TILE_SIZE
            break;
        case DIRECTION.UP:
            targetPosition.y -= TILE_SIZE
            break;
        case DIRECTION.LEFT:
            targetPosition.x -= TILE_SIZE
            break;
        case DIRECTION.RIGHT:
            targetPosition.x += TILE_SIZE
            break;
        case DIRECTION.NONE:
            break;
        default:
            break;
    }
    return targetPosition;
}