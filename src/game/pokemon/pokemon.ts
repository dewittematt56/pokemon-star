export type PokemonObjectType = {
    key: string,
    name: string,
    frontImage: PokemonImageType,
    backImage: PokemonImageType
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
        }
    }
}