import { useRef, useEffect } from "react";
import StarterScene from "./scenes/worldScene/worldScene";
import { SCENE_KEYS } from "../commonData/keysScene";
import { baseBattleScene } from "./scenes/battleScenes/baseBattleScene";
import { constMockPokemonParty, constWildPokemonParty } from "../testData/mockData";
import { WildEncounterScene } from "./scenes/battleScenes/wildEncounterScene";

const config = {
    type: Phaser.AUTO,
	width: "1280",
	height: "720",
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
		}
	},
	scene: [],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: 'game-container',
}

export default function PokemonStar(){
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        gameRef.current = new Phaser.Game(config);
        gameRef.current.scene.add(SCENE_KEYS.WORLD_SCENE, StarterScene);
        gameRef.current.scene.add(SCENE_KEYS.WILD_ENCOUNTER_SCENE, WildEncounterScene);
        // gameRef.current.scene.start(SCENE_KEYS.WORLD_SCENE, {
        //     battleFieldBackgroundAssetKey: "FOREST",
        // })
        gameRef.current.scene.start(SCENE_KEYS.WILD_ENCOUNTER_SCENE, {
            originatorKey: SCENE_KEYS.WORLD_SCENE,
            playerEndX: 0,
            playerEndY: 0, 
            pokemonEncountered: {
                pokemon: "BULBASAUR",
                level: 5
            },
            yourPokemonParty: constMockPokemonParty
        })
        
        return () => {
            gameRef.current?.destroy(true);
        };
    }, []);

    return <div id="game-container" />;
};