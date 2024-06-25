export const POKEMON = Object.freeze({
    "TORCHIC": {
        name: "Torchic",
        pokeDexNumber: 255,
        pokemonImageData: {
            frontImage: {
                assetKey: "TORCHIC_FRONT_0",
                path: "/assets/pokemon/torchic/backSpriteSheet.png",
                height: 38,
                width: 37,
                animStart: 0,
                animFinish: 31,
                frameRate: 10
            },
            backImage: {
                assetKey: "TORCHIC_BACK_0",
                path: "/assets/pokemon/torchic/backSpriteSheet.png",
                height: 46,
                width: 30,
                animStart: 0,
                animFinish: 31,
                frameRate: 20
            },
            iconImage: {
                assetKey: "TORCHIC_ICON_0",
                path: "/assets/pokemon/torchic/255.png",
                height: 64,
                width: 64,
                animStart: 0,
                animFinish: 0,
                frameRate: 0
            }
        },
        pokemonBaseStats: {
            hp: 45,
            attack: 60,
            defense: 40,
            specialAttack: 70,
            specialDefense: 50,
            speed: 45
        }
    },
    "BULBASAUR": {
        name: "Bulbasaur",
        pokeDexNumber: 1,
        pokemonImageData: {
            frontImage: {
                assetKey: "BULBASAUR_FRONT_0",
                path: "/assets/pokemon/bulbasaur/frontSpriteSheet.png",
                height: 38,
                width: 37,
                animStart: 0,
                animFinish: 31,
                frameRate: 10
            },
            backImage: {
                assetKey: "BULBASAUR_BACK_0",
                path: "/assets/pokemon/bulbasaur/backSpriteSheet.png",
                height: 37,
                width: 32,
                animStart: 0,
                animFinish: 50,
                frameRate: 10
            },
            iconImage: {
                assetKey: "BULBASAUR_ICON_0",
                path: "/assets/pokemon/bulbasaur/001.png",
                height: 64,
                width: 64,
                animStart: 0,
                animFinish: 0,
                frameRate: 0
            }
        },
        pokemonBaseStats: {
            hp: 45,
            attack: 49,
            defense: 49,
            specialAttack: 49,
            specialDefense: 65,
            speed: 45
        }
    },
    "POOCHYENA": {
        name: "Poochyena",
        pokeDexNumber: 261,
        pokemonImageData: {
            frontImage: {
                assetKey: "POOCHYENA_FRONT_0",
                path: "/assets/pokemon/poochyena/frontSpriteSheet.png",
                height: 44,
                width: 52,
                animStart: 0,
                animFinish: 58,
                frameRate: 10
            },
            backImage: {
                assetKey: "POOCHYENA_BACK_0",
                path: "/assets/pokemon/poochyena/backSpriteSheet.png",
                height: 53,
                width: 44,
                animStart: 0,
                animFinish: 52,
                frameRate: 10
            },
            iconImage: {
                assetKey: "POOCHYENA_ICON_0",
                path: "/assets/sprites/pokemon/poochyena/261.png",
                height: 64,
                width: 64,
                animStart: 0,
                animFinish: 0,
                frameRate: 0
            }
        },
        pokemonBaseStats: {
            hp: 35,
            attack: 55,
            defense: 35,
            specialAttack: 30,
            specialDefense: 30,
            speed: 35
        }
    }
})