import { useRef, useEffect } from "react";
import StarterScene from "./scenes/starterScene";

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
	scene: [
        StarterScene
    ],
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

        return () => {
            gameRef.current?.destroy(true);
        };
    }, []);

    return <div id="game-container" />;
};