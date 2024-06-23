import { POKEMON_TYPES } from "../../commonData/dataType";


export class PokemonType {
    // METADATA
    public id: string;
    public name: string
    public primaryColor: number

    constructor(type: keyof typeof POKEMON_TYPES){
        let typeDict = POKEMON_TYPES[type];
        this.id = type;
        this.name = typeDict.name;
        this.primaryColor = typeDict.primaryColor;
    }
}

