import {DIRECTION} from './controls/direction'

export class Controls {
    scene: Phaser.Scene
    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    lockPlayerInput: boolean

    /**
     * Creates an instance of Controls.
     *
     * @constructor
     * @param {Phaser.Scene} scene
     */
    constructor(scene: Phaser.Scene){
        this.scene = scene
        this.cursorKeys = this.scene.input.keyboard!.createCursorKeys();
        // Default to player input not being locked
        this.lockPlayerInput = false;
    }

    get isInputocked(){
        return this.lockInput
    }

    set lockInput(val :boolean){    
        this.lockInput = val;
    }

    wasSpaceKeyPressed() {
        if(this.cursorKeys === undefined){
            return false
        }
        return Phaser.Input.Keyboard.JustDown(this.cursorKeys.space)
    }

    wasBackKeyPressed() {
        if(this.cursorKeys === undefined){
            return false
        }
        return Phaser.Input.Keyboard.JustDown(this.cursorKeys.shift)
    }

    getDirectionKeyPressedDown(){
        let selectedDirection: any = DIRECTION.NONE
        if(this.cursorKeys.left.isDown){
            selectedDirection = DIRECTION.LEFT
        } else if(this.cursorKeys.right.isDown){
            selectedDirection = DIRECTION.RIGHT
        } else if(this.cursorKeys.up.isDown){
            selectedDirection = DIRECTION.UP
        } else if(this.cursorKeys.down.isDown){
            selectedDirection = DIRECTION.DOWN
        }
        return selectedDirection
    }

    getDirectionKeyJustPressed(){
        let selectedDirection: any = DIRECTION.NONE
        if(Phaser.Input.Keyboard.JustDown(this.cursorKeys.left)){
            selectedDirection = DIRECTION.LEFT
        } else if(Phaser.Input.Keyboard.JustDown(this.cursorKeys.right)){
            selectedDirection = DIRECTION.RIGHT
        } else if(Phaser.Input.Keyboard.JustDown(this.cursorKeys.up)){
            selectedDirection = DIRECTION.UP
        } else if(Phaser.Input.Keyboard.JustDown(this.cursorKeys.down)){
            selectedDirection = DIRECTION.DOWN
        }
        return selectedDirection
    }
}