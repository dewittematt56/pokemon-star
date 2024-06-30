import { Pokemon } from "../../../commonClass/pokemon/pokemon/pokemon";
import { playerSessionType } from "../../../commonTypes/typeDefs";

function setCookie(name: string, value: string) {
    document.cookie = name + "=" + value + ";";
}

function getCookie(name: string) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

export function writeGameDataToSave(playerSession: playerSessionType){
    setCookie(playerSession.id, JSON.stringify(playerSession))
}

export function loadSave(id: string): playerSessionType | undefined{
    let retriedGameFile = getCookie(id)
    if(retriedGameFile){
        let saveGameDict = JSON.parse(retriedGameFile);
        let pokemonParty = saveGameDict["party"].map((pokemon: any) => {
            return new Pokemon(pokemon["uniqueId"], pokemon["pokemonKey"], pokemon["level"], pokemon["ivData"], pokemon["evData"], pokemon["currentHp"], pokemon["name"], pokemon["moves"].map((move: any) => move["id"]))
        }) 
        return {
            id: saveGameDict["id"],
            party: pokemonParty,
            location: saveGameDict["location"]
        } as playerSessionType
    }
    return undefined
}

export const mockPlayerSession: playerSessionType = {
    id: "1",
    party: [
        new Pokemon(undefined, "BULBASAUR", 5, undefined, undefined, 19, undefined, ["TACKLE", "VINE_WHIP", "SCREECH"]),
        new Pokemon(undefined, "TORCHIC", 6, undefined, undefined, 21, undefined, ["TACKLE", "EMBER", "GROWL"])
    ],
    location: {
        currentWorldScene: "ROUTE_101",
        x: 472,
        y: 736,
        direction: "UP"
    }
}