import { SCALE } from "../lib/consts";
import { cx, cy } from "../lib/grid";
import { TetrisScene } from "../scene";

export default class TetrominoSprite extends Phaser.GameObjects.Sprite {

  constructor(
    scene: TetrisScene,
    private xCoord: number,
    private yCoord: number,
    private tetrWidth: number,
    private tetrHeight: number,
    private rotationIndex: number,
    texture: string,
  ) {
    super(scene, 0, 0, texture);
    scene.add.existing(this);

    this.setScale(SCALE);

    this.updatePosition();
    this.updateRotation();
  }

  /**
   * Updates the position of the tetromino based on the coordinates and
   * the tetromino dimensions (width and height) at the current rotation.
   */
  private updatePosition(): void {
    this.setPosition(
      cx(this.xCoord, this.tetrWidth),
      cy(this.yCoord, this.tetrHeight),
    );
  }

  private updateRotation(): void {
    this.setRotation(this.rotation + this.rotationIndex * Math.PI / 2);
  }
}