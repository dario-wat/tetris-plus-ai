import * as Phaser from 'phaser';
import { SCALE } from '../lib/consts';
import { cx, cy } from '../lib/grid';
import { TetrisScene } from '../scene';

/** Immovable single block of a tetromino once it hits the bottom. */
export default class Block extends Phaser.GameObjects.Sprite {

  constructor(
    scene: TetrisScene,
    public xCoord: number,
    public yCoord: number,
    texture: string,
  ) {
    super(scene, cx(xCoord), cy(yCoord), texture);
    scene.add.existing(this);

    this.setScale(SCALE);

    this.scene.events.on('update', () => {
      this.setPosition(cx(this.xCoord), cy(this.yCoord));
    });
  }
}