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
    public currentExperience: number = 0;
    public experienceToNextLevel: number = 0;

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
        
        // Experience Calculations
        this.calculateExperienceToNextLevel()
    }


    calculateExperienceGain(baseExpGain: number, levelOfDefeatedPokemon: number, isWildPokemon: boolean = false, s: number = 1,): number {
        console.log("CHECK")
        const roundToNearest4096 = (x: number): number => {return Math.round(x * 4096) / 4096;};
      
        // Calculate the terms inside the formula
        const term1 = (baseExpGain * levelOfDefeatedPokemon) / 5;
        const sqrtTerm1 = roundToNearest4096(Math.sqrt(2 * levelOfDefeatedPokemon + 10));
        const term2 = Math.floor(sqrtTerm1 * Math.pow(2 * levelOfDefeatedPokemon + 10, 2));
        const sqrtTerm2 = roundToNearest4096(Math.sqrt(levelOfDefeatedPokemon + this.level + 10));
        const term3 = Math.floor(sqrtTerm2 * Math.pow(levelOfDefeatedPokemon + this.level + 10, 2));
        
        // Calculate the fractional part of the formula
        const fractional = term2 / term3;
      
        // Final experience calculation

        // To Do Update based on help item
        let isHoldingLuckyEgg = false;
        let expGain = (term1 * (isWildPokemon ? 1 : 1.5) * (1 / s) * fractional + 1) * (isHoldingLuckyEgg ? 2 : 1);
      
        // Cap experience gain at 100,000 for Black 2 and White 2
        expGain = Math.min(expGain, 100000);
      
        this.currentExperience += Math.floor(expGain);
        this.applyLeveling()
        console.log(this.level, this.currentExperience, this.experienceToNextLevel)
        return this.level;
    }

    applyLeveling() {
        if(this.currentExperience > this.experienceToNextLevel){
            this.level++
            this.calculateExperienceToNextLevel();
            this.applyLeveling();
        }
    }

    calculateExperienceToNextLevel(){
        // https://bulbapedia.bulbagarden.net/wiki/Experience#Gain_formula
        if(this.baseData.experienceGainRate == "MEDIUM_FAST"){
            this.experienceToNextLevel = Math.pow(this.level, 3)
        }
        else if(this.baseData.experienceGainRate == "FAST"){
            this.experienceToNextLevel = Math.round(Math.pow(this.level, 3) / 5)
        }
        else if(this.baseData.experienceGainRate == "SLOW"){
            this.experienceToNextLevel = Math.round(Math.pow(this.level * 5, 3) / 4)
        }
    }
}