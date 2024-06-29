import { Pokemon } from "../commonClass/pokemon/pokemon/pokemon";
import { playerSessionType } from "../commonTypes/typeDefs";

export function writeGameDataToSave(){

}


export const mockPlayerSession: playerSessionType = {
    party: [
        new Pokemon("TORCHIC", 6, undefined, undefined, 21, undefined, ["TACKLE", "EMBER", "GROWL"]),
        new Pokemon("BULBASAUR", 5, undefined, undefined, 19, undefined, ["TACKLE", "VINE_WHIP", "SCREECH"])
    ],
    location: {
        currentWorldScene: "ROUTE_101",
        x: 29,
        y: 46
    }
}