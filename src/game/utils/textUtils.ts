import Phaser from "phaser";

type animatedTextConfig = {
    callback: Function,
    delay: number
}

export function animateText(scene: Phaser.Scene, target: Phaser.GameObjects.Text, text: string, config: animatedTextConfig) {
    const length = text.length;
    let i = 0;
    scene.time.addEvent({
      callback: () => {
        target.text += text[i];
        ++i;
        if (i === length - 1 && config?.callback) {
          config.callback();
        }
      },
      repeat: length - 1,
      delay: config?.delay || 25,
    });
  }