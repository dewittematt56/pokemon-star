import {BaseDialogBox} from "./baseDialogBox";

export class BasicUiDialogBox extends BaseDialogBox {
    constructor(scene: Phaser.Scene, width: number) {
        super(scene, (width / 2) - 40, 124 / 2);
        this.container.setDepth(11)
    }
}
