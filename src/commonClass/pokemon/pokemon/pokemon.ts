import { POKEMON_MOVES } from "../../../commonData/dataMoves";
import { POKEMON } from "../../../commonData/dataPokemon";
import { PokemonMove } from "../pokemonMove";
import { PokemonKey, IvData, EvData, StatData } from "./typeDefs";
import { generateBaseEvData, generateIvData, calculateMaxHp, calculatePokemonStats } from "./utils";
import { v4 as uuidv4 } from 'uuid';

export type pokemonMoves = keyof typeof POKEMON_MOVES

export class Pokemon {
    public uniqueId: string;
    public baseData: typeof POKEMON[PokemonKey];
    private ivData: IvData;
    private evData: EvData;
    private pokemonKey: PokemonKey
    public stats: StatData
    public moves: PokemonMove[]
    
    // To-Do Implement Natures

    public name: string;
    public level: number; 

    public currentHp: number;
    

    constructor(uniqueId: string | undefined, pokemon: PokemonKey, level: number, ivData: IvData | undefined, evData: EvData | undefined, currentHp: number | undefined, name: string | undefined, moves: pokemonMoves[]){
        this.uniqueId = uniqueId ? uniqueId : uuidv4();
        
        this.pokemonKey = pokemon;
        this.baseData = POKEMON[pokemon];
        this.ivData = ivData ? ivData : generateIvData();
        this.evData = evData ? evData : generateBaseEvData();
        
        this.level = level;
        this.name = name ? name : this.baseData.name;
        this.moves = moves.map((move) => new PokemonMove(move))

        // Stat Calculations
        this.stats = calculatePokemonStats(this.baseData.pokemonBaseStats, this.ivData, this.evData, this.level);
        this.currentHp = currentHp || currentHp == 0 ? currentHp : this.stats.hp; 
    }
}