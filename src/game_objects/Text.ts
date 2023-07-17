import { TetrisScene } from "../scene";

export default class Text extends Phaser.GameObjects.Text {

  constructor(
    scene: TetrisScene,
    x: number,
    y: number,
    style: Phaser.Types.GameObjects.Text.TextStyle,
  ) {
    super(scene, x, y, '', style);
    scene.add.existing(this);
  }
}