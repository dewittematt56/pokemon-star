export type PokemonObjectType = {
    key: string,
    name: string,
    frontImage: PokemonImageType,
    backImage: PokemonImageType,
    iconImage: PokemonImageType
}

export type PokemonImageType = {
    path: string,
    height: number,
    width: number,
    animStart: number,
    animFinish: number;
    frameRate: number
}

export const POKEMON: { [key: string]: PokemonObjectType } = {
    BULBASAUR: {
        key: "BULBASAUR",
        name: "Bulbsaur",
        frontImage: {
            path: "/assets/pokemon/bulbasaur/frontSpriteSheet.png",
            height: 38,
            width: 37,
            animStart: 0,
            animFinish: 50,
            frameRate: 10
        },
        backImage: {
            path: "/assets/pokemon/torchic/frontSpriteSheet.png",
            height: 46,
            width: 30,
            animStart: 0,
            animFinish: 149,
            frameRate: 20
        },
        iconImage: {
            path: "/assets/sprites/pokemon/iconSprites/001.png",
            height: 64,
            width: 64,
            animStart: 0,
            animFinish: 0,
            frameRate: 0
        }
    },
    TORCHIC: {
        key: "TORCHIC",
        name: "Torchic",
        frontImage: {
            path: "/assets/pokemon/bulbasaur/frontSpriteSheet.png",
            height: 38,
            width: 37,
            animStart: 0,
            animFinish: 50,
            frameRate: 10
        },
        backImage: {
            path: "/assets/pokemon/torchic/frontSpriteSheet.png",
            height: 46,
            width: 30,
            animStart: 0,
            animFinish: 149,
            frameRate: 20
        },
        iconImage: {
            path: "/assets/sprites/pokemon/iconSprites/255.png",
            height: 64,
            width: 64,
            animStart: 0,
            animFinish: 0,
            frameRate: 0
        }
    },
    TREEKO: {
        key: "TREEKO",
        name: "Treeko",
        frontImage: {
            path: "/assets/pokemon/bulbasaur/frontSpriteSheet.png",
            height: 38,
            width: 37,
            animStart: 0,
            animFinish: 50,
            frameRate: 10
        },
        backImage: {
            path: "/assets/pokemon/torchic/frontSpriteSheet.png",
            height: 46,
            width: 30,
            animStart: 0,
            animFinish: 149,
            frameRate: 20
        },
        iconImage: {
            path: "/assets/sprites/pokemon/iconSprites/252.png",
            height: 64,
            width: 64,
            animStart: 0,
            animFinish: 0,
            frameRate: 0
        }
    }
}