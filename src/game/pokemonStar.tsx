import { useRef, useEffect } from "react";
import StarterScene from "./scenes/starterScene";

const config = {
    type: Phaser.AUTO,
	width: 1280,
	height: 2400,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
		}
	},
	scene: [
        StarterScene
    ],
    parent: 'game-container',
}

export default function PokemonStar(){
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        gameRef.current = new Phaser.Game(config);

        return () => {
            gameRef.current?.destroy(true);
        };
    }, []);

    return <div id="game-container" />;
};