export type DIRECTION_TYPE = keyof typeof DIRECTION;

/**
 * @typedef DIRECTION_TYPE
 */

/** @enum {DirectionType} */
export const DIRECTION = Object.freeze({
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    UP: 'UP',
    DOWN: 'DOWN',
    NONE: 'NONE',
});

