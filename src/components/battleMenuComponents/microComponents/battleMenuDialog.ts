import Phaser from "phaser";
import { animateText } from "../../../game/utils/textUtils";

export class BattleMenuDialog {
    public scene: Phaser.Scene;
    public dialogContainer: Phaser.GameObjects.Container;
    public textComponent: Phaser.GameObjects.Text;
    public textMessagesToShow: string[];
    private isAnimating: boolean;
    private messageQueue: string[];

    constructor(scene: Phaser.Scene, relX: number, relY: number, width: number, height: number, isDefaultVisible: boolean) {
        this.scene = scene;
        this.textMessagesToShow = [];
        this.isAnimating = false;
        this.messageQueue = [];

        this.textComponent = this.scene.add.text(relX + 14, relY + 20, "", {
            wordWrap: { width: width - 18 },
            fontFamily: "Audiowide",
            fontSize: "16px",
            color: "0x2d3436"
        }).setOrigin(0).setDepth(1);

        this.dialogContainer = this.scene.add.container(0, 0, [
            this.scene.add.rectangle(
                relX + 4,
                relY + 10,
                width - 8,
                height - 10,
                0xede4f3,
                0.9
            ).setOrigin(0).setStrokeStyle(3, 0x303541).setInteractive().addListener("pointerdown", () => {
                this.displayMessage();
            }),
            this.textComponent
        ]).setVisible(isDefaultVisible).setDepth(2);
    }

    updateVisibility(visibility: boolean) {
        this.dialogContainer.setVisible(visibility);
    }

    displayDialog(messages: string[], autoComplete: boolean, callBackFunction: Function) {
        this.updateVisibility(true);
        this.messageQueue.push(...messages);
        if (autoComplete) {
            this.displayMessage_r(30, 30, callBackFunction);
        } else {
            this.displayMessage();
        }
    }

    async displayMessage() {
        if (this.isAnimating || this.messageQueue.length === 0) {
            return;
        }
        this.isAnimating = true;
        this.textComponent.setText('');
        const message = this.messageQueue.shift() as string;
        await this.animateTextWithPromise(message, 50);
        this.isAnimating = false;
        this.displayMessage();
    }

    async displayMessage_r(speed: number, pauseDelayFactor: number, callBackFunction: any) {
        if (this.isAnimating || this.messageQueue.length === 0) {
            callBackFunction();
            return;
        }
        this.isAnimating = true;
        this.textComponent.setText('');
        const message = this.messageQueue.shift() as string;
        await this.animateTextWithPromise(message, speed);
        this.isAnimating = false;
        this.scene.time.addEvent({
            delay: pauseDelayFactor * message.length,
            callback: () => { this.displayMessage_r(speed, pauseDelayFactor, callBackFunction); }
        });
    }

    private animateTextWithPromise(text: string, delay: number): Promise<void> {
        return new Promise((resolve) => {
            animateText(this.scene, this.textComponent, text, {
                delay: delay,
                callback: resolve
            });
        });
    }
}
