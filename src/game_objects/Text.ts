import { TetrisScene } from "../scene";

/** It's just a text added to the scene with listener. */
export default class Text extends Phaser.GameObjects.Text {

  constructor(
    scene: TetrisScene,
    x: number,
    y: number,
    style: Phaser.Types.GameObjects.Text.TextStyle,
    eventName: string,
  ) {
    super(scene, x, y, '', style);
    scene.add.existing(this);

    scene.events.on(eventName, (text: string) => this.setText(text));
  }
}