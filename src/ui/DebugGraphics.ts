import { DEBUG_GRAPHICS_DEPTH } from "../lib/consts";
import { debugPoint } from "../lib/debug";
import { TetrisScene } from "../scene";
import { Coord } from "../types";

export default class DebugGraphics extends Phaser.GameObjects.Graphics {

  public tetrominoPoint: Coord = null;

  constructor(scene: TetrisScene) {
    super(scene);
    scene.add.existing(this);

    this.depth = DEBUG_GRAPHICS_DEPTH;

    scene.events.on('update', () => {
      this.clear();

      this.tetrominoPoint && debugPoint(this, this.tetrominoPoint);
    });
  }
}