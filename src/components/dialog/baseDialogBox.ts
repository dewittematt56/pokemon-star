import { animateText } from "../../game/utils/textUtils";

export class BaseDialogBox {
    scene: Phaser.Scene;
    width: number;
    height: number;
    container: Phaser.GameObjects.Container;
    uiText: Phaser.GameObjects.Text;
    isAnimating: boolean;
    messageQueue: string[];

    private _isVisible: boolean;
    private padding: number;

    constructor(scene: Phaser.Scene, width: number, height: number, padding: number = 20, isDefaultVisible: boolean = false) {
        this.scene = scene;
        this.padding = padding;
        this.width = width;
        this.height = height;

        this.messageQueue = [];
        this.isAnimating = false;
        this._isVisible = isDefaultVisible;

        const panel = this.scene.add.rectangle(
            0,
            0,
            this.width,
            this.height,
            0xede4f3,
            0.9
        ).setOrigin(0).setStrokeStyle(4, 0x2c3e50, 1);

        // Setup Container on screen
        this.container = this.scene.add.container(0, 0, [panel]);
        this.uiText = this.scene.add.text(18, 12, "", {
            wordWrap: { width: this.width - 36 },
            fontFamily: "Audiowide",
            fontSize: "12px",
            color: "0x2d3436"
        });
        this.container.add(this.uiText);

        // Default modal to hidden
        this.updateVisibility(isDefaultVisible);
    }

    updateVisibility(visibility: boolean) {
        this.container.setAlpha(visibility ? 1 : 0);
        this._isVisible = visibility;
    }

    get isVisible() {
        return this._isVisible;
    }

    get isAnimationPlaying(): boolean {
        return this.isAnimating;
    }

    get moreMessagesToShow(): boolean {
        return this.messageQueue.length > 0;
    }

    showDialogModal(messages: string[], autoComplete: boolean = false, callBackFunction?: Function) {
        this.messageQueue = [...messages];
        const { x, bottom } = this.scene.cameras.main.worldView;
        const startX = x + this.padding;
        const startY = bottom - this.height - this.padding / 4;

        this.container.setPosition(startX, startY);
        this.updateVisibility(true);

        if (autoComplete) {
            this.displayMessageAutoComplete(50, 30, callBackFunction);
        } else {
            this.displayMessage();
        }
    }

    hideDialogModal() {
        this.updateVisibility(false);
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
        this.displayMessage();
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
        this.scene.time.addEvent({
            delay: pauseDelayFactor * message.length,
            callback: () => { this.displayMessageAutoComplete(speed, pauseDelayFactor, callBackFunction); }
        });
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