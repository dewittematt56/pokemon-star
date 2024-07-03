import {BaseDialogBox} from "./baseDialogBox";


export class BattleMenuDialog extends BaseDialogBox {
    constructor(scene: Phaser.Scene, relX: number, relY: number, width: number, height: number, isDefaultVisible: boolean) {
        super(scene, width - 8, height - 10, 0, isDefaultVisible);
        this.uiText.setPosition(relX + 14, relY + 20).setDepth(1);
        this.uiText.setStyle({
            wordWrap: { width: this.width - 36 },
            fontFamily: "Audiowide",
            fontSize: "16px",
            color: "0x2d3436"
        })
        this.container.setPosition(relX, relY).setDepth(2);

        // Cast to Phaser.GameObjects.Rectangle to access setPosition method
        const panel = this.container.list[0] as Phaser.GameObjects.Rectangle;
        panel.setPosition(relX + 4, relY + 10).setInteractive().addListener("pointerdown", () => {
            this.displayMessage();
        });
    }

    showDialogModal(messages: string[], autoComplete: boolean = false, callBackFunction?: Function) {
        this.messageQueue = [...messages];
        this.updateVisibility(true);
        if (autoComplete) {
            this.displayMessageAutoComplete(30, 30, callBackFunction);
        } else {
            this.displayMessage();
        }
    }
}