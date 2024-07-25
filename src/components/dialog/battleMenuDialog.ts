import { animateText } from "../../game/utils/textUtils";
import { BaseDialogBox } from "./baseDialogBox";

export class BattleMenuDialog extends BaseDialogBox {
    constructor(scene: Phaser.Scene, relX: number, relY: number, width: number, height: number, isDefaultVisible: boolean) {
        super(scene, width - 8, height - 10, 0, isDefaultVisible);
        this.uiText.setPosition(relX + 14, relY + 20).setDepth(1);
        this.uiText.setStyle({
            wordWrap: { width: this.width - 36 },
            fontFamily: "Audiowide",
            fontSize: "16px",
            color: "0x2d3436"
        });
        this.container.setPosition(relX, relY).setDepth(2);

        // Cast to Phaser.GameObjects.Rectangle to access setPosition method
        const panel = this.container.list[0] as Phaser.GameObjects.Rectangle;
        panel.setPosition(relX + 4, relY + 10).setInteractive().on("pointerdown", () => {
            this.displayMessage();
        });
    }

    showDialogModal(messages: string[], autoComplete: boolean = false, callBackFunction?: Function) {
        this.messageQueue.push(...messages); // Enqueue messages instead of replacing
        this.updateVisibility(true);

        if (!this.isAnimating) { // Start the message display if not already animating
            if (autoComplete) {
                this.displayMessageAutoComplete(30, 30, callBackFunction);
            } else {
                this.displayMessage();
            }
        }
    }

    async displayMessage() {
        if (this.isAnimating || this.messageQueue.length === 0) {
            return;
        }
        this.isAnimating = true;
        this.uiText.setText('');
        const message = this.messageQueue.shift() as string;
        await this.animateTextWithPromise(message, 50);
        this.isAnimating = false;
        if (this.messageQueue.length > 0) {
            this.displayMessage();
        }
    }

    async displayMessageAutoComplete(speed: number, pauseDelayFactor: number, callBackFunction?: Function) {
        if (this.isAnimating || this.messageQueue.length === 0) {
            if (callBackFunction) {
                callBackFunction();
            }
            return;
        }
        this.isAnimating = true;
        this.uiText.setText('');
        const message = this.messageQueue.shift() as string;
        await this.animateTextWithPromise(message, speed);
        this.isAnimating = false;
        if (this.messageQueue.length > 0) {
            this.scene.time.addEvent({
                delay: pauseDelayFactor * message.length,
                callback: () => this.displayMessageAutoComplete(speed, pauseDelayFactor, callBackFunction)
            });
        } else if (callBackFunction) {
            callBackFunction();
        }
    }

    animateTextWithPromise(text: string, delay: number): Promise<void> {
        return new Promise((resolve) => {
            animateText(this.scene, this.uiText, text, {
                delay: delay,
                callback: resolve
            });
        });
    }
}
