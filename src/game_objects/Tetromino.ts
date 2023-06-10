import * as Phaser from 'phaser';
import { TetrisScene } from '../scene';
import { I_TEXTURE, J_TEXTURE, L_TEXTURE, O_TEXTURE, S_TEXTURE, T_TEXTURE, Z_TEXTURE } from '../lib/textures';
import { SCALE, TETRIS_HEIGHT, TETRIS_WIDTH } from '../lib/consts';
import { cx, cy } from '../lib/grid';

type RotationSize = [number, number]
type Coord = [number, number];

export abstract class Tetromino extends Phaser.GameObjects.Sprite {

  public xCoord: number;
  public yCoord: number;

  protected abstract readonly rotations: RotationSize[];
  protected abstract readonly rotationCoords: Coord[][];
  protected currRotation: number = 0;

  constructor(
    scene: TetrisScene,
    x: number,
    y: number,
    texture: string,
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);

    this.xCoord = 0;
    this.yCoord = 0;

    this.setScale(SCALE);

    this.scene.events.on('update', () => {
      const tetrWidth = this.rotations[this.currRotation][0];
      const tetrHeight = this.rotations[this.currRotation][1];
      this.setPosition(
        cx(this.xCoord, tetrWidth),
        cy(this.yCoord, tetrHeight),
      );
    });
  }

  public drop(): void {
    this.yCoord += 1;
  }

  public rotate(): void {
    this.currRotation = (this.currRotation + 1) % this.rotations.length;
    this.setRotation(this.rotation + Math.PI / 2);
  }

  public moveRight(): void {
    this.xCoord += 1;
    if (!this.isValidPosition()) {
      this.xCoord -= 1;
    }
  }

  public moveLeft(): void {
    this.xCoord -= 1;
    if (!this.isValidPosition()) {
      this.xCoord += 1;
    }
  }

  private getAllCoords(): Coord[] {
    const currRotationCoords = this.rotationCoords[this.currRotation];
    return currRotationCoords.map(([dx, dy]) =>
      [this.xCoord + dx, this.yCoord + dy]
    );
  }

  private isValidPosition(): boolean {
    const allCoords = this.getAllCoords();
    return allCoords.every(([xCoord, yCoord]) => inBounds(xCoord, yCoord));
  }
}

function inBounds(xCoord: number, yCoord: number): boolean {
  return xCoord >= 0
    && xCoord < TETRIS_WIDTH
    && yCoord >= 0
    && yCoord < TETRIS_HEIGHT;
}

export class I extends Tetromino {

  protected rotations: RotationSize[] = [[1, 4], [4, 1]];
  protected rotationCoords: Coord[][] = [
    [[0, 0], [0, 1], [0, 2], [0, 3]],
    [[0, 0], [1, 0], [2, 0], [3, 0]],
  ];

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, I_TEXTURE);
  }
}

export class J extends Tetromino {

  protected rotations: RotationSize[] = [[3, 2], [2, 3], [3, 2], [2, 3]];
  protected rotationCoords: Coord[][] = [
    [[0, 0], [0, 1], [1, 1], [2, 1]],
    [[0, 0], [0, 1], [1, 0], [0, 2]],
    [[0, 0], [1, 0], [2, 0], [2, 1]],
    [[1, 0], [0, 2], [1, 1], [1, 2]],
  ];

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, J_TEXTURE);
  }
}

export class L extends Tetromino {

  protected rotations: RotationSize[] = [[3, 2], [2, 3], [3, 2], [2, 3]];
  protected rotationCoords: Coord[][] = [
    [[2, 0], [0, 1], [1, 1], [2, 1]],
    [[0, 0], [0, 1], [1, 2], [0, 2]],
    [[0, 0], [1, 0], [2, 0], [0, 1]],
    [[1, 0], [0, 0], [1, 1], [1, 2]],
  ];

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, L_TEXTURE);
  }
}

export class O extends Tetromino {

  protected rotations: RotationSize[] = [[2, 2]];
  protected rotationCoords: Coord[][] = [
    [[0, 0], [1, 0], [0, 1], [1, 1]],
  ];

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, O_TEXTURE);
  }
}

export class S extends Tetromino {

  protected rotations: RotationSize[] = [[3, 2], [2, 3]];
  protected rotationCoords: Coord[][] = [
    [[1, 0], [2, 0], [0, 1], [1, 1]],
    [[0, 0], [0, 1], [1, 1], [1, 2]],
  ];

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, S_TEXTURE);
  }
}

export class T extends Tetromino {

  protected rotations: RotationSize[] = [[3, 2], [2, 3], [3, 2], [2, 3]];
  protected rotationCoords: Coord[][] = [
    [[1, 0], [0, 1], [1, 1], [2, 1]],
    [[0, 0], [0, 1], [1, 1], [0, 2]],
    [[0, 0], [1, 0], [2, 0], [1, 1]],
    [[1, 0], [0, 1], [1, 1], [1, 2]],
  ];

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, T_TEXTURE);
  }
}

export class Z extends Tetromino {

  protected rotations: RotationSize[] = [[3, 2], [2, 3]];
  protected rotationCoords: Coord[][] = [
    [[0, 0], [1, 0], [2, 1], [1, 1]],
    [[1, 0], [0, 1], [1, 1], [0, 2]],
  ];

  constructor(scene: TetrisScene, x: number, y: number) {
    super(scene, x, y, Z_TEXTURE);
  }
}
