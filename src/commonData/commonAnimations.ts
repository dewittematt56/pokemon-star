export const ANIMATIONS = Object.freeze({
    "PLAYER": [
        {
            "key": "PLAYER_DOWN",
            "frames": [1, 2, 3],
            "frameRate": 6,
            "repeat": -1,
            "delay": 0,
            "yoyo": true,
            "assetKey": "PLAYER"
        },
        {
            "key": "PLAYER_UP",
            "frames": [12, 13, 14],
            "frameRate": 6,
            "repeat": -1,
            "delay": 0,
            "yoyo": true,
            "assetKey": "PLAYER"
        },
        {
            "key": "PLAYER_RIGHT",
            "frames": [9, 10, 11],
            "frameRate": 6,
            "repeat": -1,
            "delay": 0,
            "yoyo": true,
            "assetKey": "PLAYER"
        },
        {
            "key": "PLAYER_LEFT",
            "frames": [5, 6, 7],
            "frameRate": 6,
            "repeat": -1,
            "delay": 0,
            "yoyo": true,
            "assetKey": "PLAYER"
        }
    ],
});

export const POKEBALL_THROW = Object.freeze({
    "NORMAL":
        {
            "throw_key": "THROW_NORMAL_BALL",
            "throw_animation": [3, 20, 37, 54, 71, 88, 105, 122, 139, 156, 173],
            "open_key": "OPEN_NORMAL_BALL",
            "open_animation": [3, 20, 37, 54, 71, 88, 105, 122, 139, 156, 173],
            "frameRate": 6,
            "repeat": 0,
            "delay": 0,
            "yoyo": false,
            "assetKey": "POKEBALL-ANIMATIONS",
        }
})
