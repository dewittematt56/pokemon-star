import Phaser from 'phaser';
import { SCENE_KEYS } from '../../../commonData/dataScenes';
import { SceneMusicEngine } from '../../../commonEngine/sceneSoundEngine/sceneMusicEngine';


export default class MenuScene extends Phaser.Scene {
    public audioEngine: SceneMusicEngine | undefined


    constructor() {
        super({ key: SCENE_KEYS.MENU_SCENE });


    }

    preload() {
        for (let i = 1; i <= 94; i++) { // Replace 10 with the actual number of frames
            this.load.image(`frame_${i}`, `/assets/misc/menuScreenFrames/frame_${String(i).padStart(2, '0')}_delay.gif`);
        }
    }

    init(){

    }

    create() {
        const frames = [];
        for (let i = 1; i <= 94; i++) { // Replace 10 with the actual number of frames
            frames.push({ key: `frame_${i}` });
        }


        this.anims.create({
            key: 'gifAnimation',
            frames: frames,
            frameRate: 10, // Adjust frame rate as needed
            repeat: 0 // Set to -1 for infinite loop, 0 to play once
        });
        this.audioEngine = new SceneMusicEngine(this, ["QUASAR_THEME"])
        const sprite = this.add.sprite(625, 350, 'frame_1'); // Position the sprite as needed
        console.log("CHECK")
        sprite.play('gifAnimation');

    }

}
