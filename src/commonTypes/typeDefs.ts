import { Pokemon } from "../commonClass/pokemon/pokemon/pokemon"
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

// Define the type for the dialog
export type Dialog = {
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
    dialog: Dialog;
    location: Location;
    idleFrames: IdleFrames;
    scaleSize: number;
    spriteGridMovementFinishedCallback: Function;
    spriteChangedDirectionCallback: Function;
    pokemonParty: PokemonPartyType; 
    isAggressive: boolean;
    sightRange: number
}

