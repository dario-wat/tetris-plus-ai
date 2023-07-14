import { TetrisScene } from "../scene";

export default class Text extends Phaser.GameObjects.Text {

  constructor(
    scene: TetrisScene,
    x: number,
    y: number,
    fontSize: number,
    eventName: string,
  ) {
    super(scene, x, y, '', {
      fontFamily: 'Arial',
      fontSize: `${fontSize}px`,
      color: '#FFFFFF' // White color
    });
    scene.add.existing(this);

    scene.events.on(eventName, (text: string) => this.setText(text));
  }
}