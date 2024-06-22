import Phaser from "phaser";
import { animateText } from "../../../game/utils/textUtils";



export class BattleMenuDialog {
    public scene: Phaser.Scene;
    public dialogContainer: Phaser.GameObjects.Container;
    public textComponent: Phaser.GameObjects.Text;

    public textMessagesToShow: string[];

    constructor(scene: Phaser.Scene, relX: number, relY: number, width: number, height: number, isDefaultVisible: boolean){
        this.scene = scene
        this.textMessagesToShow = [];

        this.textComponent = this.scene.add.text(relX + 14, relY + 20, "", {wordWrap: {width: width - 18}, fontFamily: "Audiowide", fontSize: "16px", color: "0x2d3436"}).setOrigin(0).setDepth(1);

        this.dialogContainer = this.scene.add.container(0, 0, [
            this.scene.add.rectangle(
                relX + 4,
                relY + 10,
                width - 8,
                height - 10,
                0xede4f3,
                0.9
            ).setOrigin(0).setStrokeStyle(3, 0x303541).setInteractive().addListener("pointerdown", () => {
                this.displayMessage()
            }),
            this.textComponent
        ]).setVisible(isDefaultVisible).setDepth(2);
    }

    updateVisibility(visibility: boolean){
        this.dialogContainer.setVisible(visibility);
    }

    displayDialog(messages: string[], autoComplete: boolean, callBackFunction: Function){
        this.updateVisibility(true);
        this.textMessagesToShow = messages;
        if(autoComplete){
            this.displayMessage_r(30, 500, callBackFunction)
            
            return
        }
        this.displayMessage();
    }

    displayMessage(){
        if(this.textMessagesToShow.length == 0){
            return;
        }
        this.textComponent.setText('')
        animateText(this.scene, this.textComponent, this.textMessagesToShow.shift() as string, {
            delay: 50,
            callback: () => {
                
            }
        })
    }

    displayMessage_r(speed: number, pauseDelay: number, callBackFunction: any){
        if(this.textMessagesToShow.length == 0){
            callBackFunction();
            return;
        }
        this.textComponent.setText('')
        animateText(this.scene, this.textComponent, this.textMessagesToShow.shift() as string, {
            delay: speed,
            callback: () => {
                setTimeout(() => {this.displayMessage_r(speed, pauseDelay, callBackFunction)}, pauseDelay);
            }
        })
    }
}


// showNextMessage(){
//     if(this.textMessagesToShow.length === 0){
//         return;
//     }
//     this.uiText.setText('').setAlpha(1);

//     animateText(this.scene, this.uiText, this.textMessagesToShow.shift() as string, {
//         delay: 50,
//         callback: () => {
//             this.isTextAnimationPlaying = false;
//         }
//     })
//     this.isTextAnimationPlaying = true
// }