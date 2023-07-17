import * as Phaser from 'phaser';
import { SCALE } from '../lib/consts';
import { cx, cy } from '../lib/grid';
import { TetrisScene } from '../scene';

/** Type containing block for game logic. */
export class Block {

  constructor(
    public xCoord: number,
    public yCoord: number,
    public readonly texture: string,
  ) { }
};

/** Immovable single block of a tetromino once it hits the bottom. */
export class BlockSprite extends Phaser.GameObjects.Sprite {

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