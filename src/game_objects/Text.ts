import { HEURISTIC_TEXT_UPDATED } from "../lib/consts";
import { TetrisScene } from "../scene";

export default class Text extends Phaser.GameObjects.Text {

  constructor(scene: TetrisScene, x: number, y: number, fontSize: number) {
    super(scene, x, y, '', {
      fontFamily: 'Arial',
      fontSize: `${fontSize}px`,
      color: '#FFFFFF' // White color
    });
    scene.add.existing(this);

    scene.events.on(HEURISTIC_TEXT_UPDATED, (heuristicText: string) =>
      this.setText(heuristicText)
    );
  }
}