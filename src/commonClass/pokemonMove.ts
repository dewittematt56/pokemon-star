import { PokemonType } from "./pokemonType";

export class PokemonMove {
    public id: string;
    public name: string;
    public type: PokemonType;
    constructor(id: string, name: string){
        this.id = id
        this.name = name;
        this.type = new PokemonType();
    }
}