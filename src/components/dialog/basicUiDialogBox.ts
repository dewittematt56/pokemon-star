import { animateText } from "../../game/utils/textUtils";

export class BasicUiDialogBox {
    scene: Phaser.Scene;
    width: number;
    height: number;
    container: Phaser.GameObjects.Container;
    uiText: Phaser.GameObjects.Text;
    isTextAnimationPlaying: boolean;
    textMessagesToShow: string[];

    private _isVisible: boolean;
    private padding: number;

    constructor(scene: Phaser.Scene, width: number){
        this.scene = scene;
        this.padding = 20;
        this.width = (width / 2) - this.padding * 2;
        this.height = 124 / 2;
        
        this.textMessagesToShow = []
        this.isTextAnimationPlaying = false;
        this._isVisible = false;

        const panel = this.scene.add.rectangle(
            0,
            0,
            this.width,
            this.height,
            0xede4f3,
            0.9
        ).setOrigin(0).setStrokeStyle(4, 0x2c3e50, 1);

        //Setup Container on screen
        this.container = this.scene.add.container(0,0, [panel]);
        this.uiText = this.scene.add.text(18, 12, "",  {
            wordWrap: { width: width - 18 },
            fontFamily: "Audiowide",
            fontSize: "12px",
            color: "0x2d3436"
        })
        this.container.add(this.uiText);

        // Default modal to hidden
        this.hideDialogModal();
    }

    showDialogModal(messages: string[]){
        this.textMessagesToShow = [...messages];
        // Destructure WorldView object to get specific props
        const {x, bottom} = this.scene.cameras.main.worldView;
        const startX = x + this.padding;
        const startY = bottom - this.height - this.padding / 4;

        this.container.setPosition(startX, startY);
        this.container.setAlpha(1);
        this.container.setDepth(2)
        this._isVisible = true;

        this.showNextMessage()
    }

    hideDialogModal(){
        this.container.setAlpha(0)
        this._isVisible = false;
    }

    get isVisible(){
        return this._isVisible
    }

    get isAnimatonPlaying(): boolean{
        return this.isTextAnimationPlaying;
    }

    get moreMessagesToShow(): boolean{
        return this.textMessagesToShow.length > 0
    }

    showNextMessage(){
        if(this.textMessagesToShow.length === 0){
            return;
        }
        this.uiText.setText('').setAlpha(1);
        animateText(this.scene, this.uiText, this.textMessagesToShow.shift() as string, {
            delay: 50,
            callback: () => {
                this.isTextAnimationPlaying = false;
            }
        })
        this.isTextAnimationPlaying = true
    }

}