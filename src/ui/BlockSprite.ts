import { SCALE } from "../lib/consts";
import { cx, cy } from "../lib/grid";
import { TetrisScene } from "../scene";

/** Immovable single block of a tetromino once it hits the bottom. */
export default class BlockSprite extends Phaser.GameObjects.Sprite {

  constructor(
    scene: TetrisScene,
    xCoord: number,
    yCoord: number,
    texture: string,
  ) {
    super(scene, cx(xCoord), cy(yCoord), texture);
    scene.add.existing(this);

    this.setScale(SCALE);

    this.setPosition(cx(xCoord), cy(yCoord));
  }
}