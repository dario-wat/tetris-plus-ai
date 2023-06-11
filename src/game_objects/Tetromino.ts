import * as Phaser from 'phaser';
import { TetrisScene } from '../scene';
import { I_TEXTURE, J_TEXTURE, L_TEXTURE, O_TEXTURE, S_TEXTURE, T_TEXTURE, Z_TEXTURE } from '../lib/textures';
import { SCALE, TETRIS_HEIGHT, TETRIS_WIDTH } from '../lib/consts';
import { cx, cy } from '../lib/grid';

type RotationSize = [number, number]
type Coord = [number, number];

/**
 * Abstract class for a tetromino containing most of the movement logic.
 * Most of the rotation logic complexity stems directly from us rendering
 * the tetromino sprites starting from the top left corner and then having
 * to rotate around the center.
 */
export abstract class Tetromino extends Phaser.GameObjects.Sprite {

  public xCoord: number;
  public yCoord: number;

  /** Width and height for each individual rotation */
  protected abstract readonly rotations: RotationSize[];
  /** Coordinate offsets for each individual block in a tetromino. */
  protected abstract readonly rotationCoords: Coord[][];
  /** Coordinate offset for the center of the tetromino. */
  protected abstract readonly rotationCenterOffset: Coord[];
  protected currRotation: number = 0;

  constructor(scene: TetrisScene, texture: string) {
    super(scene, 0, 0, texture);
    scene.add.existing(this);

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
    this.unlockFromCenter();
    this.currRotation = (this.currRotation + 1) % this.rotations.length;
    this.lockToCenter();
    this.setRotation(this.rotation + Math.PI / 2);
  }

  /**
   * Tetrominoes are not properly centered by default. This will translate
   * the tetromino so that it's centered. NOTE: tetrominoes need to be
   * uncentered before any other rotations.
   */
  private lockToCenter(): void {
    this.xCoord -= this.rotationCenterOffset[this.currRotation][0];
    this.yCoord -= this.rotationCenterOffset[this.currRotation][1];
  }

  /**
   * It will reset the tetromino into its default position where coordinates
   * are set to the top left corner instead of the center. This needs to be
   * called before a new rotation is done.
   */
  private unlockFromCenter(): void {
    this.xCoord += this.rotationCenterOffset[this.currRotation][0];
    this.yCoord += this.rotationCenterOffset[this.currRotation][1];
  }

  /** 
   * This is used only for debugging. It is the same as unlock because all
   * tetrominoes are locked t center by default.
   */
  public getCenterPoint(): Coord {
    const dx = this.rotationCenterOffset[this.currRotation][0];
    const dy = this.rotationCenterOffset[this.currRotation][1];
    return [this.xCoord + dx, this.yCoord + dy];
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

  /** Gets coordinates of all individual blocks of a tetromino. */
  public getAllCoords(): Coord[] {
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
  protected rotationCenterOffset: Coord[] = [[0, 0], [1, 0]];

  constructor(scene: TetrisScene) {
    super(scene, I_TEXTURE);
    this.xCoord = 4;
    this.yCoord = 0;
    this.rotate();
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
  protected rotationCenterOffset: Coord[] = [[1, 1], [0, 1], [1, 0], [1, 1]];

  constructor(scene: TetrisScene) {
    super(scene, J_TEXTURE);
    this.xCoord = 3;
    this.yCoord = 0;
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
  protected rotationCenterOffset: Coord[] = [[1, 1], [0, 1], [1, 0], [1, 1]];

  constructor(scene: TetrisScene) {
    super(scene, L_TEXTURE);
    this.xCoord = 3;
    this.yCoord = 0;
  }
}

export class O extends Tetromino {

  protected rotations: RotationSize[] = [[2, 2]];
  protected rotationCoords: Coord[][] = [
    [[0, 0], [1, 0], [0, 1], [1, 1]],
  ];
  protected rotationCenterOffset: Coord[] = [[0, 0]];

  constructor(scene: TetrisScene) {
    super(scene, O_TEXTURE);
    this.xCoord = 4;
    this.yCoord = 0;
  }
}

export class S extends Tetromino {

  protected rotations: RotationSize[] = [[3, 2], [2, 3]];
  protected rotationCoords: Coord[][] = [
    [[1, 0], [2, 0], [0, 1], [1, 1]],
    [[0, 0], [0, 1], [1, 1], [1, 2]],
  ];
  protected rotationCenterOffset: Coord[] = [[1, 1], [0, 1], [1, 0], [1, 1]];

  constructor(scene: TetrisScene) {
    super(scene, S_TEXTURE);
    this.xCoord = 3;
    this.yCoord = 0;
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
  protected rotationCenterOffset: Coord[] = [[1, 1], [0, 1], [1, 0], [1, 1]];

  constructor(scene: TetrisScene) {
    super(scene, T_TEXTURE);
    this.xCoord = 4;
    this.yCoord = 4;
  }
}

export class Z extends Tetromino {

  protected rotations: RotationSize[] = [[3, 2], [2, 3]];
  protected rotationCoords: Coord[][] = [
    [[0, 0], [1, 0], [2, 1], [1, 1]],
    [[1, 0], [0, 1], [1, 1], [0, 2]],
  ];
  protected rotationCenterOffset: Coord[] = [[1, 1], [0, 1], [1, 0], [1, 1]];

  constructor(scene: TetrisScene) {
    super(scene, Z_TEXTURE);
    this.xCoord = 3;
    this.yCoord = 0;
  }
}
