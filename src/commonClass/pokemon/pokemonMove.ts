import { POKEMON_TYPES} from "../../commonData/dataType";
import { POKEMON_MOVES } from "../../commonData/dataMoves";
import { PokemonType } from "./pokemonType";

export class PokemonMove {
    public id: string;
    public name: string;
    public type: PokemonType;

    constructor(move: keyof typeof POKEMON_MOVES){
        this.id = move
        let moveDict = POKEMON_MOVES[move];
        this.name = moveDict.name;
        this.type = new PokemonType(moveDict.type as keyof typeof POKEMON_TYPES);
    }
}