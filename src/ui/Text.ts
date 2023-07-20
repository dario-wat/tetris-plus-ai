import { TetrisScene } from "../scene";

const DEFAULT_FONT = {
  fontFamily: 'Arial',
  fontSize: '14px',
  color: '#FFFFFF' // White color
};

export default class Text extends Phaser.GameObjects.Text {

  constructor(
    scene: TetrisScene,
    x: number,
    y: number,
    style: Phaser.Types.GameObjects.Text.TextStyle = DEFAULT_FONT,
  ) {
    super(scene, x, y, '', style);
    scene.add.existing(this);
  }
}