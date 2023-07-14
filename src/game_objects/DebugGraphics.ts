import { DEBUG_GRAPHICS_DEPTH, DEBUG_GRAPHICS_TETROMINO_CENTER_EVENT } from "../lib/consts";
import { debugPoint } from "../lib/debug";
import { TetrisScene } from "../scene";
import { Coord } from "./Tetromino";

export default class DebugGraphics extends Phaser.GameObjects.Graphics {

  private tetrominoPoint: Coord = null;

  constructor(scene: TetrisScene) {
    super(scene);
    scene.add.existing(this);

    this.depth = DEBUG_GRAPHICS_DEPTH;

    scene.events.on(
      DEBUG_GRAPHICS_TETROMINO_CENTER_EVENT,
      (coord: Coord) => {
        this.tetrominoPoint = coord;
      },
    );

    scene.events.on('update', () => {
      this.clear();

      this.tetrominoPoint && debugPoint(this, this.tetrominoPoint);
    });
  }
}