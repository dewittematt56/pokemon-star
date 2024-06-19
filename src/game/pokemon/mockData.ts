import { v4 as uuidv4 } from 'uuid';
import { PokemonPartyType } from "./typeDefs";

export const constMockPokemonParty: PokemonPartyType = [
    {
        pokemon: {
            uniqueId: "2",
            pokeDexKey: "TORCHIC",
            name: "Torchic",
            level: 1,
            sex: "MALE",
            experience: 0,
            pokemonBattleData: {
                moves: []
            },
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
            pokemonMetaData: {}
        }
    },
    {
        pokemon: {
            uniqueId: "1",
            pokeDexKey: "BULBASAUR",
            name: "Bulbasaur",
            level: 1,
            sex: "FEMALE",
            experience: 0,
            pokemonBattleData: {
                moves: []
            },
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
                    path: "/assets/pokemon/bulbasaur/frontSpriteSheet.png",
                    height: 46,
                    width: 30,
                    animStart: 0,
                    animFinish: 31,
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
            pokemonMetaData: {}
        }
    }
]



export const constWildPokemonParty: PokemonPartyType = [
    {
        pokemon: {
            uniqueId: "1",
            pokeDexKey: "BULBASAUR",
            name: "Bulbasaur",
            level: 1,
            sex: "FEMALE",
            experience: 0,
            pokemonBattleData: {
                moves: []
            },
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
                    path: "/assets/pokemon/bulbasaur/frontSpriteSheet.png",
                    height: 46,
                    width: 30,
                    animStart: 0,
                    animFinish: 31,
                    frameRate: 10
                },
                iconImage: {
                    assetKey: "BULBASAUR_ICON_0",
                    path: "/assets/sprites/pokemon/bulbasaur/001.png",
                    height: 64,
                    width: 64,
                    animStart: 0,
                    animFinish: 0,
                    frameRate: 0
                }
            },
            pokemonMetaData: {}
        }
    }
]
