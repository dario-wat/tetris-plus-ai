import * as Phaser from 'phaser';
import { SCALE } from '../lib/consts';
import { cx, cy } from '../lib/grid';
import { TetrisScene } from '../scene';

/** Immovable single block of a tetromino once it hits the bottom. */
export default class Block extends Phaser.GameObjects.Sprite {

  constructor(
    public scene: TetrisScene,
    public xCoord: number,
    public yCoord: number,
    private textureStr: string,
    isVisible: boolean = true,
  ) {
    super(scene, cx(xCoord), cy(yCoord), textureStr);
    this.setVisible(isVisible);

    scene.add.existing(this);

    this.setScale(SCALE);

    this.scene.events.on('update', () => {
      this.setPosition(cx(this.xCoord), cy(this.yCoord));
    });
  }

  public copyInvisible(): Block {
    const block = new Block(this.scene, this.xCoord, this.yCoord, this.textureStr, false);
    block.setVisible(false);
    return block;
  }
}