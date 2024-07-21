import {BaseDialogBox} from "./baseDialogBox";

export class BasicUiDialogBox extends BaseDialogBox {
    constructor(scene: Phaser.Scene, width: number) {
        super(scene, (width / 2) - 250  , 80 / 2);
        this.container.setDepth(11)
        this.uiText.setStyle({
            wordWrap: { width: this.width - 18 },
            fontFamily: "Audiowide",
            fontSize: "8px",
            color: "0x2d3436"
        })
    }
}
