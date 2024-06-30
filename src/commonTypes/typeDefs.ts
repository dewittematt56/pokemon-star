import { Pokemon, pokemonMoves } from "../commonClass/pokemon/pokemon/pokemon"
import { IvData, EvData } from "../commonClass/pokemon/pokemon/typeDefs"
import { PokemonMove } from "../commonClass/pokemon/pokemonMove"
import { POKEMON } from "../commonData/dataPokemon"
import { SCENE_KEYS, SCENE_INFO } from "../commonData/dataScenes"
import { DIRECTION } from "../game/utils/controls/direction"

export type PokemonImageDataType = {
    frontImage: AnimatedImageType,
    backImage: AnimatedImageType,
    iconImage: AnimatedImageType
}

export type AnimatedImageType = {
    assetKey: string
    path: string,
    height: number,
    width: number,
    animStart: number,
    animFinish: number,
    frameRate: number
} 

export type PokemonStatsType = {
    currentHp: number,
    maxHp: number,
    currentExperience: number,
    maxExperience: number,
    speed: number,
    physicalAttack: number,
    specialAttack: number,
    physicalDefense: number,
    specialDefense: number
}

export type PokemonBattleDataType = {
    moves: PokemonMove []
} 

export type PokemonMetaDataType = {

}

export type BasePokemon = {
    uniqueId: string,
    pokeDexKey: string,
    name: string,
    level: number,
    sex: "MALE" | "FEMALE" | "UNK",
    pokemonStatData: PokemonStatsType
    pokemonBattleData: PokemonBattleDataType,
    pokemonImageData: PokemonImageDataType,
    pokemonMetaData: PokemonMetaDataType
}

export type PokemonConfig = {
    pokemon: keyof typeof POKEMON,
    level: number,
    ivData: IvData | undefined,
    evData: EvData | undefined,
    currentHp: number | undefined,
    moves: pokemonMoves[]
}

/*------------------------- Game Types -------------------------*/
export type playerSessionType = {
    id: string
    // Add Trainer Class (name, badges, money...etc)
    party: PokemonPartyType
    location: playerLocation
}

export type playerLocation = {
    currentWorldScene: keyof typeof SCENE_INFO
    x: number,
    y: number,
    direction: keyof typeof DIRECTION
}


/*------------------------- Scene Types -------------------------*/

// Define the type for a scene
export interface SceneType {
    mapPath: string;
    mapKey: string;
    npcs: NPC[];
}

// Define the type for SCENE_INFO
export interface SceneInfoType {
    [key: string]: SceneType;
}

/*------------------------- Pokemon Party Types -------------------------*/
export type PokemonPartyType = Pokemon[];

export type PokemonEncounterType = {
    pokemon: keyof typeof POKEMON,
    rate: number,
    minLevel: number,
    maxLevel: number
}

export type activePokemonEncounterType = {
    pokemon: keyof typeof POKEMON,
    level: number,
}

/*------------------------- NPC Types -------------------------*/

export type npcType = "TRAINER" | "NPC"

// Define the type for the dialog
export type npcDialog = {
    openingMessages: string[];
}

// Define the type for the location
export type Location = {
    x: number;
    y: number;
    direction: keyof typeof DIRECTION;
}

// Define the type for idleFrames
export type IdleFrames = {
    DOWN: number;
    UP: number;
    NONE: number;
    LEFT: number;
    RIGHT: number;
}

// Define the type for an NPC
export type NPC = {
    id: string;
    name: string;
    type: npcType
    dialog: npcDialog;
    location: Location;
    idleFrames: IdleFrames;
    scaleSize: number;
    spriteGridMovementFinishedCallback: Function;
    spriteChangedDirectionCallback: Function;
    pokemonParty: PokemonConfig[]; 
    isAggressive: boolean;
    sightRange: number,
    spriteInfo: {
        worldImage: undefined,
        portraitImage: AnimatedImageType 
    } | undefined
}

