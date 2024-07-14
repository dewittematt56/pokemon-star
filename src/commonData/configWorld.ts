export const TILE_SIZE = 16;

export const LIGHTING_CONFIG = Object.freeze({
    "SUNRISE": {
        sceneLightsOn: false,
        ambientColor: 0x666666
    },
    "MORNING": {
        sceneLightsOn: false,
        ambientColor: 0x888888
    },
    "AFTERNOON": {
        sceneLightsOn: false,
        ambientColor: 0xffffff
    },
    "SUNSET": {
        sceneLightsOn: false,
        ambientColor: 0xe47025
    },
    "NIGHT": {
        sceneLightsOn: true,
        ambientColor: 0x333333
    },
    "CAVE": {
        sceneLightsOn: true,
        ambientColor: 0x000000
    }
})