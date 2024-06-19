import { useRef, useEffect } from "react";
import StarterScene from "./scenes/starterScene";
import { SCENE_KEYS } from "./scenes/sceneKeys";
import { BattleScene, pokemonBattleSceneData } from "./scenes/battleScene/battleScene";
import { constMockPokemonParty, constWildPokemonParty } from "./pokemon/mockData";
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
        gameRef.current.scene.add(SCENE_KEYS.BATTLE_SCENE, BattleScene);
        gameRef.current.scene.start(SCENE_KEYS.BATTLE_SCENE, {
            battleFieldBackgroundAssetKey: "FOREST",
            opponentParty: constWildPokemonParty,
            pokemonParty: constMockPokemonParty
        } as pokemonBattleSceneData)
        return () => {
            gameRef.current?.destroy(true);
        };
    }, []);

    return <div id="game-container" />;
};