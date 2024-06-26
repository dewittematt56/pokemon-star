import { PokemonPartyType } from "../commonTypes/typeDefs";
import { PokemonMove } from '../commonClass/pokemon/pokemonMove';
import { Pokemon } from "../commonClass/pokemon/pokemon/pokemon";

// export const constMockPokemonParty: PokemonPartyType = [
//     {
//         pokemon: {
//             uniqueId: "2",
//             pokeDexKey: "TORCHIC",
//             name: "Torchic",
//             level: 6,
//             sex: "MALE",
//             pokemonStatData: {
//                 currentHp: 9,
//                 maxHp: 10,
//                 currentExperience: 0,
//                 maxExperience: 0,
//                 speed: 0,
//                 specialAttack: 70,
//                 specialDefense: 50,
//                 physicalAttack: 60,
//                 physicalDefense: 40    
//             },
//             pokemonBattleData: {
//                 moves: [
//                     new PokemonMove("EMBER"),
//                     new PokemonMove("GROWL"),
//                     new PokemonMove("TACKLE")
//                 ]
//             },
//             pokemonImageData: {
//                 frontImage: {
//                     assetKey: "TORCHIC_FRONT_0",
//                     path: "/assets/pokemon/torchic/backSpriteSheet.png",
//                     height: 38,
//                     width: 37,
//                     animStart: 0,
//                     animFinish: 31,
//                     frameRate: 10
//                 },
//                 backImage: {
//                     assetKey: "TORCHIC_BACK_0",
//                     path: "/assets/pokemon/torchic/backSpriteSheet.png",
//                     height: 46,
//                     width: 30,
//                     animStart: 0,
//                     animFinish: 31,
//                     frameRate: 20
//                 },
//                 iconImage: {
//                     assetKey: "TORCHIC_ICON_0",
//                     path: "/assets/pokemon/torchic/255.png",
//                     height: 64,
//                     width: 64,
//                     animStart: 0,
//                     animFinish: 0,
//                     frameRate: 0
//                 }
//             },
//             pokemonMetaData: {}
//         }
//     },
//     {
//         pokemon: {
//             uniqueId: "1",
//             pokeDexKey: "BULBASAUR",
//             name: "Bulbasaur",
//             level: 5,
//             sex: "FEMALE",
//             pokemonStatData: {
//                 currentHp: 12,
//                 maxHp: 12,
//                 currentExperience: 0,
//                 maxExperience: 0,
//                 speed: 0,
//                 specialAttack: 65,
//                 specialDefense: 65,
//                 physicalAttack: 49,
//                 physicalDefense: 49    
//             },
//             pokemonBattleData: {
//                 moves: [
//                     new PokemonMove("TACKLE"),
//                     new PokemonMove("VINE_WHIP"),
//                     new PokemonMove("SCREECH"),
//                 ]
//             },
//             pokemonImageData: {
//                 frontImage: {
//                     assetKey: "BULBASAUR_FRONT_0",
//                     path: "/assets/pokemon/bulbasaur/frontSpriteSheet.png",
//                     height: 38,
//                     width: 37,
//                     animStart: 0,
//                     animFinish: 31,
//                     frameRate: 10
//                 },
//                 backImage: {
//                     assetKey: "BULBASAUR_BACK_0",
//                     path: "/assets/pokemon/bulbasaur/backSpriteSheet.png",
//                     height: 37,
//                     width: 32,
//                     animStart: 0,
//                     animFinish: 50,
//                     frameRate: 10
//                 },
//                 iconImage: {
//                     assetKey: "BULBASAUR_ICON_0",
//                     path: "/assets/pokemon/bulbasaur/001.png",
//                     height: 64,
//                     width: 64,
//                     animStart: 0,
//                     animFinish: 0,
//                     frameRate: 0
//                 }
//             },
//             pokemonMetaData: {}
//         }
//     }
// ]

// export const constWildPokemonParty: PokemonPartyType = [
//     {
//         pokemon: {
//             uniqueId: "1",
//             pokeDexKey: "POOCHYENA",
//             name: "Poocheyna",
//             level: 1,
//             sex: "FEMALE",
//             pokemonStatData: {
//                 currentHp: 10,
//                 maxHp: 10,
//                 currentExperience: 0,
//                 maxExperience: 0,
//                 speed: 0,
//                 specialAttack: 30,
//                 specialDefense: 30,
//                 physicalAttack: 55,
//                 physicalDefense: 35  
//             },
//             pokemonBattleData: {
//                 moves: [
//                     new PokemonMove("TACKLE"),
//                     new PokemonMove("GROWL"),
//                 ]
//             },
//             pokemonImageData: {
//                 frontImage: {
//                     assetKey: "POOCHYENA_FRONT_0",
//                     path: "/assets/pokemon/poochyena/frontSpriteSheet.png",
//                     height: 44,
//                     width: 52,
//                     animStart: 0,
//                     animFinish: 58,
//                     frameRate: 10
//                 },
//                 backImage: {
//                     assetKey: "POOCHYENA_BACK_0",
//                     path: "/assets/pokemon/poochyena/backSpriteSheet.png",
//                     height: 53,
//                     width: 44,
//                     animStart: 0,
//                     animFinish: 52,
//                     frameRate: 10
//                 },
//                 iconImage: {
//                     assetKey: "POOCHYENA_ICON_0",
//                     path: "/assets/sprites/pokemon/poochyena/261.png",
//                     height: 64,
//                     width: 64,
//                     animStart: 0,
//                     animFinish: 0,
//                     frameRate: 0
//                 }
//             },
//             pokemonMetaData: {}
//         }
//     },
//     {
//         pokemon: {
//             uniqueId: "1",
//             pokeDexKey: "BULBASAUR",
//             name: "Bulbasaur",
//             level: 4,
//             sex: "FEMALE",
//             pokemonStatData: {
//                 currentHp: 10,
//                 maxHp: 10,
//                 currentExperience: 0,
//                 maxExperience: 0,
//                 speed: 1,
//                 specialAttack: 65,
//                 specialDefense: 65,
//                 physicalAttack: 49,
//                 physicalDefense: 49    
//             },
//             pokemonBattleData: {
//                 moves: [
//                     new PokemonMove("TACKLE"),
//                     new PokemonMove("VINE_WHIP"),
//                 ]
//             },
//             pokemonImageData: {
//                 frontImage: {
//                     assetKey: "BULBASAUR_FRONT_0",
//                     path: "/assets/pokemon/bulbasaur/frontSpriteSheet.png",
//                     height: 38,
//                     width: 37,
//                     animStart: 0,
//                     animFinish: 31,
//                     frameRate: 10
//                 },
//                 backImage: {
//                     assetKey: "BULBASAUR_BACK_0",
//                     path: "/assets/pokemon/bulbasaur/backSpriteSheet.png.png",
//                     height: 37,
//                     width: 32,
//                     animStart: 0,
//                     animFinish: 51,
//                     frameRate: 10
//                 },
//                 iconImage: {
//                     assetKey: "BULBASAUR_ICON_0",
//                     path: "/assets/sprites/pokemon/bulbasaur/001.png",
//                     height: 64,
//                     width: 64,
//                     animStart: 0,
//                     animFinish: 0,
//                     frameRate: 0
//                 }
//             },
//             pokemonMetaData: {}
//         }
//     }
// ]

export const constMockPokemonParty: PokemonPartyType = [
    new Pokemon("TORCHIC", 6, undefined, undefined, 21, undefined, ["TACKLE", "EMBER", "GROWL"]),
    new Pokemon("BULBASAUR", 5, undefined, undefined, 19, undefined, ["TACKLE", "VINE_WHIP", "SCREECH"])
]

export const constWildPokemonParty: PokemonPartyType = [
    new Pokemon("POOCHYENA", 6, undefined, undefined, undefined, undefined, ["TACKLE", "GROWL"])
]
