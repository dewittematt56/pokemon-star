import { Pokemon } from "../../commonClass/pokemon/pokemon/pokemon";
import { PokemonMove } from "../../commonClass/pokemon/pokemonMove";

import { calculateMoveDamage, calculateDidMoveHitOpponent, calculateCriticalHit, calculateTypeDamageMultiplier } from "./combatUtils";

type moveExecutionType = {
    executor: "PLAYER" | "OPPONENT",
    pokemon: Pokemon
    move: PokemonMove
} 

export class CombatEngine{
    public playerPokemon: Pokemon
    public opponentPokemon: Pokemon

    // Callback Functions
    public dialogCallback: Function
    public updateHpCallback: Function

    constructor(playerPokemon: Pokemon, opponentPokemon: Pokemon, dialogCallback: Function, updateHpCallback: Function){
        this.playerPokemon = playerPokemon;
        this.opponentPokemon = opponentPokemon;

        this.dialogCallback = dialogCallback;
        this.updateHpCallback = updateHpCallback;
    }

    switchPokemon(newPokemon: Pokemon, party: "PLAYER" | "OPPONENT"){
        if(party == "PLAYER"){this.playerPokemon = newPokemon}
        else if(party == "OPPONENT"){this.opponentPokemon = newPokemon}
    }

    opponentMoveSelector(): PokemonMove{
        let moves = this.opponentPokemon.moves
        let movesAvailable = moves.length
        let randomMove = Math.floor(Math.random() * ((movesAvailable - 1)  - 0 + 1)) + 0;
        return moves[randomMove];
    }

    determineMovePriority(playerMove: PokemonMove, opponentMove: PokemonMove): moveExecutionType[]{
        let playerMoveExecution: moveExecutionType = {executor: "PLAYER", pokemon: this.playerPokemon, move: playerMove};
        let opponentMoveExecution: moveExecutionType =  {executor: "OPPONENT", pokemon: this.opponentPokemon, move: opponentMove};
        // Toggle Move Priority Logic if Different
        if(playerMove.movePriority !== opponentMove.movePriority){
            // Player Move First
            if(playerMove.movePriority > opponentMove.movePriority){
                return [playerMoveExecution, opponentMoveExecution];
            } else {
                return [opponentMoveExecution, playerMoveExecution];
            }
        }
        // Toggle Speed Check if Different
        else if(this.playerPokemon.stats.speed !== this.opponentPokemon.stats.speed){
            if(this.playerPokemon.stats.speed > this.opponentPokemon.stats.speed){
                // Player Move First
                return [playerMoveExecution, opponentMoveExecution];
            } else {
                return [opponentMoveExecution, playerMoveExecution];
            }
        } 
        // Final Case to have player move go first in case of ties
        else {
            return [playerMoveExecution, opponentMoveExecution];
        }
    }

    executeCombatTurn(playerMove: PokemonMove){
        let opponentMove = this.opponentMoveSelector();
        let moveExecutions = this.determineMovePriority(playerMove, opponentMove); 
        moveExecutions.forEach((moveToExecute, index) => {
            if(moveToExecute.pokemon.currentHp > 0){
                this.executeMove(moveToExecute)
            }
        })
        this.dialogCallback([], true)
    }

    executeMove(moveToExecute: moveExecutionType): void{
        let messages = []
        if(moveToExecute.executor == "PLAYER"){
            messages.unshift(`Your ${this.playerPokemon.name} uses ${moveToExecute.move.name}.`)
            if(calculateDidMoveHitOpponent()){
                let damageGiven = calculateMoveDamage(this.playerPokemon, moveToExecute.move, this.opponentPokemon, moveToExecute.move.moveClass);
                this.updateHpCallback(Math.max(this.opponentPokemon.currentHp -= damageGiven, 0), "OPPONENT");            }
        } else if(moveToExecute.executor == "OPPONENT"){
            messages.unshift(`Foe ${this.opponentPokemon.name} uses ${moveToExecute.move.name}.`)
            if(calculateDidMoveHitOpponent()){
                let damageGiven = calculateMoveDamage(this.opponentPokemon, moveToExecute.move, this.playerPokemon, moveToExecute.move.moveClass);
                this.updateHpCallback(Math.max(this.playerPokemon.currentHp -= damageGiven, 0), "PLAYER");
            }
        }
        this.dialogCallback(messages, false)
    }
}