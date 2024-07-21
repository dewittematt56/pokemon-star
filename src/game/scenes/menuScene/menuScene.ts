import Phaser from 'phaser';
import { SCENE_KEYS } from '../../../commonData/dataScenes';
import { SceneMusicEngine } from '../../../commonEngine/sceneSoundEngine/sceneMusicEngine';
import { getSaveGames, loadSave, mockPlayerSession } from '../../utils/gameSaves/utils';


export default class MenuScene extends Phaser.Scene {
    public audioEngine: SceneMusicEngine | undefined
    private titleAnimationSprite: Phaser.GameObjects.Sprite | undefined;
    private titleText: Phaser.GameObjects.Text | undefined;
    private titlePreviewContainer: Phaser.GameObjects.Container | undefined;
    private gameLoadContainer: Phaser.GameObjects.Container | undefined;
    
    // Used for new save game Ids.
    private saveGameHighestNumber: number = 1;

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
            frameRate: 20, // Adjust frame rate as needed
            repeat: 0 // Set to -1 for infinite loop, 0 to play once
        });
        this.audioEngine = new SceneMusicEngine(this, ["QUASAR_THEME"], false)

        this.createTitle()
        this.createTitlePreview()
        this.createGameLoadMenu()
    }

    createTitle(){
        this.titleAnimationSprite = this.add.sprite(1280 / 2, 350, 'frame_1').setVisible(false).setInteractive().setOrigin(0.5);
        let titleText = "Click to Go To Menu"
        this.titleText = this.add.text(1280 / 2, 30, titleText, {fontFamily: 'Audiowide', fontSize: '10px', color: 'white'}).setVisible(false).setOrigin(0.5, 0)
        this.titleAnimationSprite.on("pointerdown", () => {
            this.handleTitleClick()
        })
    }

    handleTitleClick(){
        this.titleText?.setVisible(false)
        this.tweens.add({
            targets: this.titleAnimationSprite,
            alpha: 0,
            duration: 2000,
            ease: 'Power2'
        });
        this.gameLoadContainer?.setVisible(true)
        this.tweens.add({
            targets: this.gameLoadContainer,
            alpha: 1,
            duration: 2000,
            ease: 'Power2'
        });
    }
    
    handleTitlePreviewClick(){
        this.titlePreviewContainer?.setVisible(false);
        this.titleAnimationSprite?.setAlpha(0).setVisible(true);
        this.titleText?.setVisible(true)
        this.tweens.add({
            targets: this.titleAnimationSprite,
            alpha: 1,
            duration: 2000,
            ease: 'Power2'
        });
        this.audioEngine?.playCurrentMusic();
        this.titleAnimationSprite?.play('gifAnimation');
    }

    createTitlePreview(){
        let gamePreviewText = "Click to Begin Your Adventure";

        let backgroundRectangle = this.add.rectangle(0, 0, 1280, 720, 0x00000).setOrigin(0).setInteractive()

        this.titlePreviewContainer = this.add.container(0, 0, [
            backgroundRectangle,
            this.add.text(1280 / 2, 720 / 2, gamePreviewText, {fontFamily: 'Audiowide', fontStyle: 'bolder', fontSize: '20px', color: 'white'}).setOrigin(0.5)
        ]).setAlpha(0);

        this.tweens.add({
            targets: this.titlePreviewContainer,
            alpha: 1,
            duration: 2000,
            ease: 'Power2'
        });

        // Handle Title Preview Click when a user clicks on container on screen -- shows menu
        backgroundRectangle.on("pointerdown", () => {this.handleTitlePreviewClick()})
    }

    createGameLoadMenu(){
        let game_saves_raw = getSaveGames();
        let newGameButton = this.add.rectangle(0, 0, 500, 30, 0xffffff).setOrigin(0.5, 0.5).setStrokeStyle(5, 0x1b1e24).setInteractive()
        newGameButton.on("pointerdown", () => {
            this.handleNewGameClick()
        })

        let saveGameContainers = game_saves_raw.map((save, index) => {
            let save_game_id = save.split("=")[0];
            if(save_game_id){
                let save_game_button =  this.add.rectangle(0, 0, 500, 30, 0xffffff).setOrigin(0.5, 0.5).setStrokeStyle(5, 0x1b1e24).setInteractive();
                save_game_button.on("pointerdown", () => {this.handleSaveGameLoad(save_game_id);})
                this.saveGameHighestNumber = Math.max(parseInt(save_game_id), this.saveGameHighestNumber + 1)
                return this.add.container(0, -320 + ((index + 1) * 40), [
                    save_game_button,
                    this.add.text(-240, 0, "Load Save Game: " + String(save_game_id), {fontFamily: 'Audiowide', fontSize: '15px', color: 'black'}).setOrigin(0, 0.5)
                ]); 
            }
        })
        saveGameContainers = saveGameContainers.filter((saveGame) => saveGame != undefined);

        this.gameLoadContainer = this.add.container(1280 / 2, 720 / 2, [
            this.add.rectangle(0, -100, 600, 500, 0x252932).setOrigin(0.5).setInteractive().setStrokeStyle(2, 0xffffff),
            this.add.text(0, -325, "Click to Load A Game", {fontFamily: 'Audiowide', fontSize: '20px', color: 'white'}).setOrigin(0.5, 0.5),
            ...saveGameContainers as Phaser.GameObjects.Container[],
            this.add.container(0, 125, [
                newGameButton,
                this.add.text(0, 0, "New Game", {fontFamily: 'Audiowide', fontSize: '20px', color: 'black'}).setOrigin(0.5, 0.5),
            ])
        ]).setVisible(false).setAlpha(0)
    }

    handleSaveGameLoad(save_game_id: string){
        let playerSession = loadSave(save_game_id);
        this.audioEngine?.stopCurrentMusic();
        this.scene.start(SCENE_KEYS.WORLD_SCENE, {
            playerSession: playerSession,
            battleFieldBackgroundAssetKey: "FOREST",
        })
    }

    handleNewGameClick(){
        this.tweens.add({
            targets: this.gameLoadContainer,
            alpha: 0,
            duration: 1000,
            ease: 'Power2'
        });
        this.audioEngine?.stopCurrentMusic()
        let new_game_session = mockPlayerSession;
        new_game_session.id = String(this.saveGameHighestNumber);
        this.scene.start(SCENE_KEYS.WORLD_SCENE, {
            playerSession: new_game_session,
            battleFieldBackgroundAssetKey: "FOREST",
        })
    }
}
