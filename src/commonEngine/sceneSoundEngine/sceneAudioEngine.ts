import { GAME_MUSIC } from "../../commonData/dataMusic";

export class SceneAudioEngine {
    public scene: Phaser.Scene;
    public backgroundMusicToUse: (keyof typeof GAME_MUSIC)[];
    public currentMusicSound: any

    constructor(scene: Phaser.Scene, backgroundMusicToUse: (keyof typeof GAME_MUSIC)[], defaultPlayMusic: boolean = true){
        this.scene = scene;
        this.backgroundMusicToUse = backgroundMusicToUse;

        if(backgroundMusicToUse.length > 0){
            this.playSceneMusic(backgroundMusicToUse[0], defaultPlayMusic)
        }
    }

    // typeof GAME_MUSIC[keyof typeof GAME_MUSIC]
    playSceneMusic(musicToPlay:  keyof typeof GAME_MUSIC, defaultPlayMusic: boolean){
        this.loadMusic(musicToPlay, () => {
            this.currentMusicSound = this.scene.sound.get(musicToPlay);
            if(defaultPlayMusic){
                this.currentMusicSound?.play()
            }
        });
    }

    playSingularAudio(assetKey: string, audioPath: string){
        this.scene.load.audio(assetKey, audioPath)
        this.scene.load.once('complete', () => {
            this.scene.sound.add(assetKey, {
                volume: 1,
                loop: false
            });
            let singularAudio = this.scene.sound.get(assetKey);
            if(singularAudio){
                singularAudio.play()
            }
        })
        this.scene.load.start()
    }

    playCurrentMusic(){
        this.currentMusicSound?.play()
    }

    stopCurrentMusic(){
        this.currentMusicSound?.stop()
    }

    loadMusic(audioToLoad: keyof typeof GAME_MUSIC, callbackFunction: Function, loop: boolean = true){
        this.scene.load.audio(GAME_MUSIC[audioToLoad].assetKey, GAME_MUSIC[audioToLoad].path)
        this.scene.load.once('complete', () => {
            this.scene.sound.add(GAME_MUSIC[audioToLoad].assetKey, {
                volume: 0.5,
                loop: loop
            });
            callbackFunction();
        })
        this.scene.load.start()
    }
}