import * as Phaser from 'phaser';
import { TetrisScene } from '../scene';
import { DynamicSprite } from '../lib/sprite';
import { I_TEXTURE, J_TEXTURE, L_TEXTURE, O_TEXTURE, S_TEXTURE, T_TEXTURE, Z_TEXTURE } from '../lib/textures';

export abstract class Tetromino extends DynamicSprite {

  constructor(
    scene: TetrisScene,
    x: number,
    y: number,
    texture: string,
  ) {
    super(scene, x, y, texture);
    // TODO this shouldnt have physics
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}

export class I extends Tetromino {

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, I_TEXTURE);
  }
}

export class J extends Tetromino {

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, J_TEXTURE);
  }
}

export class L extends Tetromino {

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, L_TEXTURE);
  }
}

export class O extends Tetromino {

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, O_TEXTURE);
  }
}

export class S extends Tetromino {

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, S_TEXTURE);
  }
}

export class T extends Tetromino {

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, T_TEXTURE);
  }
}

export class Z extends Tetromino {

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, Z_TEXTURE);
  }
}
