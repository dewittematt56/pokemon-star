import { POKEMON_TYPES} from "../commonData/dataType";
import { PokemonType } from "./pokemonType";

export class PokemonMove {
    public id: string;
    public name: string;
    public type: PokemonType;
    constructor(id: string, name: string, type: keyof typeof POKEMON_TYPES){
        this.id = id
        this.name = name;
        this.type = new PokemonType(type);
    }
}