import * as Phaser from 'phaser';
import { SCALE } from '../lib/consts';
import { cx, cy } from '../lib/grid';
import { TetrisScene } from '../scene';

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
  }
}