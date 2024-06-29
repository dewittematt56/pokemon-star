import { POKEMON_TYPES} from "../../commonData/dataType";
import { POKEMON_MOVES } from "../../commonData/dataMoves";
import { PokemonType } from "./pokemonType";

export type moveClasses = "PHYSICAL_ATTACK" | "SPECIAL_ATTACK" | "STAT" | "NONE"

export class PokemonMove {
    public id: string;
    public name: string;

    // Game Data
    public moveType: PokemonType
    public movePriority: number
    public moveClass: moveClasses
    public moveAttack: number
    public moveAccuracy: number
    public criticalHitRatio: number
    // To-Do things like One-Hit Ko and other attacks need to be implemented here
    public moveEffect: string

    constructor(move: keyof typeof POKEMON_MOVES){
        this.id = move
        let moveDict = POKEMON_MOVES[move];
        this.name = moveDict.name;
        this.moveType = new PokemonType(moveDict.type as keyof typeof POKEMON_TYPES);

        this.movePriority = moveDict.priority
        this.moveClass = moveDict.class as moveClasses
        this.moveAttack = moveDict.attack
        this.moveAccuracy = moveDict.accuracy;
        this.moveEffect = moveDict.effect
        this.criticalHitRatio = moveDict.criticalHitRatio
    }
}