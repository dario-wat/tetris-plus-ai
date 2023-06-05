import * as Phaser from 'phaser';
import { TetrisScene } from '../scene';
import { DynamicSprite, StaticSprite } from '../lib/sprite';
import { I_TEXTURE, J_TEXTURE, L_TEXTURE, O_TEXTURE, S_TEXTURE, T_TEXTURE, Z_TEXTURE } from '../lib/textures';
import { SCALE } from '../lib/consts';
import { cx, cy, ox, oy } from '../lib/grid';

type RotationSize = [number, number]

export abstract class Tetromino extends Phaser.GameObjects.Sprite {

  public xCoord: number;
  public yCoord: number;

  protected tetrWidth: number;
  protected tetrHeight: number;

  protected abstract readonly rotations: RotationSize[];
  protected currRotation: number = 0;

  constructor(
    scene: TetrisScene,
    x: number,
    y: number,
    texture: string,
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);

    this.setScale(SCALE);

    this.scene.events.on('update', () => {
      this.updateRotationSize();
      this.updatePosition();
    });
  }

  public drop(): void {
    this.yCoord += 1;
  }

  public rotate(): void {
    this.currRotation = (this.currRotation + 1) % this.rotations.length;
    this.setRotation(this.rotation + Math.PI / 2);
  }

  private updatePosition(): void {
    this.setPosition(
      cx(this.xCoord, this.tetrWidth),
      cy(this.yCoord, this.tetrHeight),
    );
  }

  private updateRotationSize(): void {
    this.tetrWidth = this.rotations[this.currRotation][0];
    this.tetrHeight = this.rotations[this.currRotation][1];
  }
}

export class I extends Tetromino {

  protected rotations: RotationSize[] = [[1, 4], [4, 1]];

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, I_TEXTURE);
  }
}

export class J extends Tetromino {

  protected rotations: RotationSize[] = [[3, 2], [2, 3]];

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, J_TEXTURE);
  }
}

export class L extends Tetromino {

  protected rotations: RotationSize[] = [[3, 2], [2, 3]];

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, L_TEXTURE);
    this.xCoord = 0;
    this.yCoord = 0;
  }
}

export class O extends Tetromino {

  protected rotations: RotationSize[] = [[2, 2]];

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, O_TEXTURE);
    this.xCoord = 0;
    this.yCoord = 0;
  }
}

export class S extends Tetromino {

  protected rotations: RotationSize[] = [[3, 2], [2, 3]];

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, S_TEXTURE);
  }
}

export class T extends Tetromino {

  protected rotations: RotationSize[] = [[3, 2], [2, 3]];

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, T_TEXTURE);
  }
}

export class Z extends Tetromino {

  protected rotations: RotationSize[] = [[3, 2], [2, 3]];

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, Z_TEXTURE);
  }
}
