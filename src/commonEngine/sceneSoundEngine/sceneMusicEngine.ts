import { GAME_MUSIC } from "../../commonData/dataMusic";

export class SceneMusicEngine {
    public scene: Phaser.Scene;
    public backgroundMusicToUse: (keyof typeof GAME_MUSIC)[];

    constructor(scene: Phaser.Scene, backgroundMusicToUse: (keyof typeof GAME_MUSIC)[]){
        this.scene = scene;
        this.backgroundMusicToUse = backgroundMusicToUse;

        this.playSceneMusic(backgroundMusicToUse[0])
    }

    // typeof GAME_MUSIC[keyof typeof GAME_MUSIC]
    playSceneMusic(musicToPlay:  keyof typeof GAME_MUSIC){
        this.loadMusic(musicToPlay, () => {
            let sound = this.scene.sound.get(musicToPlay);
            sound?.play()
        });
    }

    loadMusic(audioToLoad: keyof typeof GAME_MUSIC, callbackFunction: Function){
        this.scene.load.audio(GAME_MUSIC[audioToLoad].assetKey, GAME_MUSIC[audioToLoad].path)
        this.scene.load.once('complete', () => {
            this.scene.sound.add(GAME_MUSIC[audioToLoad].assetKey, {
                volume: 0.5,
                loop: true
            });
            callbackFunction();
        })
        this.scene.load.start()
    }
}