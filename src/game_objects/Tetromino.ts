import * as Phaser from 'phaser';
import { TetrisScene } from '../scene';
import { BLUE, GREEN, I_TEXTURE, J_TEXTURE, LIGHT_BLUE, L_TEXTURE, ORANGE, O_TEXTURE, PURPLE, RED, S_TEXTURE, T_TEXTURE, YELLOW, Z_TEXTURE } from '../lib/textures';
import { SCALE, TETRIS_WIDTH } from '../lib/consts';
import { cx, cy } from '../lib/grid';
import { Coord, DropPosition } from '../types';
import { range, zip } from 'lodash';

type RotationSize = [number, number]

// TODO I tetromino starts weird

/**
 * Abstract class for a tetromino containing most of the movement logic.
 * Most of the rotation logic complexity stems directly from us rendering
 * the tetromino sprites starting from the top left corner and then having
 * to rotate around the center.
 */
export abstract class Tetromino {

  /** Texture of the individual blocks. */
  public abstract readonly blockTexture: string;

  /** Width and height for each individual rotation */
  protected abstract readonly rotations: RotationSize[];
  /** Coordinate offsets for each individual block in a tetromino. */
  protected abstract readonly rotationCoords: Coord[][];
  /** Coordinate offset for the center of the tetromino. */
  protected abstract readonly rotationCenterOffset: Coord[];
  public currRotation: number = 0;

  // TODO all public, and not readonly ?
  protected constructor(
    public xCoord: number,
    public yCoord: number,
    public readonly texture: string,
  ) { }

  public getWidth(): number {
    return this.rotations[this.currRotation][0];
  }

  public getHeight(): number {
    return this.rotations[this.currRotation][1];
  }

  public moveRight(): void {
    this.xCoord += 1;
  }

  public moveLeft(): void {
    this.xCoord -= 1;
  }

  public drop(): void {
    this.yCoord += 1;
  }

  public rotateRight(): void {
    this.currRotation = (this.currRotation + 1) % this.rotations.length;
  }

  public rotateLeft(): void {
    this.currRotation =
      (this.currRotation + this.rotations.length - 1) % this.rotations.length;
  }

  /** 
   * Forces a tetromino into a specific position (and rotation).
   * This is used for AI.
   */
  public forceDropPosition(dropPosition: DropPosition): void {
    this.currRotation = dropPosition.rotation;
    this.xCoord = dropPosition.coord[0];
    this.yCoord = dropPosition.coord[1];
  }

  // TODO is this still useful?
  /** 
   * This is used only for debugging. It is the same as unlock because all
   * tetrominoes are locked to center by default.
   */
  public getCenterPoint(): Coord {
    const dx = this.rotationCenterOffset[this.currRotation][0];
    const dy = this.rotationCenterOffset[this.currRotation][1];
    return [this.xCoord + dx, this.yCoord + dy];
  }

  /** Gets coordinates of all individual blocks of a tetromino. */
  public getAllCoords(): Coord[] {
    const currRotationCoords = this.rotationCoords[this.currRotation];
    return currRotationCoords.map(([dx, dy]) =>
      [this.xCoord + dx, this.yCoord + dy]
    );
  }

  /** 
   * Gives the list of all positions where we can drop the tetromino.
   * Think of all the positions at the top of the tetris board with
   * all possible rotations of the tetromino.
   * There is a static list for each tetromino.
   * When the tetrominoes are put into these positions, they need to be
   * rotated first and then translated.
   */
  public enumerateDropPositions(): DropPosition[] {
    return this.rotations.flatMap((rotationSize, i) => {
      const width = rotationSize[0];
      const xCoords = range(TETRIS_WIDTH - width + 1);
      const yCoords: number[] = Array(xCoords.length).fill(0);
      return zip(xCoords, yCoords).map(coord => ({ coord, rotation: i }));
    });
  }

  public copy(): Tetromino {
    const tetromino = this.create();
    tetromino.currRotation = this.currRotation;
    return tetromino;
  }

  protected abstract create(): Tetromino;
}

export class I extends Tetromino {

  protected rotations: RotationSize[] = [[1, 4], [4, 1]];
  protected rotationCoords: Coord[][] = [
    [[0, 0], [0, 1], [0, 2], [0, 3]],
    [[0, 0], [1, 0], [2, 0], [3, 0]],
  ];
  protected rotationCenterOffset: Coord[] = [[0, 0], [1, 0]];

  public readonly blockTexture: string = LIGHT_BLUE;

  constructor() {
    super(4, 0, I_TEXTURE);
    this.rotateRight();
  }

  protected create(): Tetromino {
    return new I();
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

  public readonly blockTexture: string = BLUE;

  constructor() {
    super(3, 0, J_TEXTURE);
  }

  protected create(): Tetromino {
    return new J();
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

  public readonly blockTexture: string = ORANGE;

  constructor() {
    super(3, 0, L_TEXTURE);
  }

  protected create(): Tetromino {
    return new L();
  }
}

export class O extends Tetromino {

  protected rotations: RotationSize[] = [[2, 2]];
  protected rotationCoords: Coord[][] = [
    [[0, 0], [1, 0], [0, 1], [1, 1]],
  ];
  protected rotationCenterOffset: Coord[] = [[0, 0]];

  public readonly blockTexture: string = YELLOW;

  constructor() {
    super(4, 0, O_TEXTURE);
  }

  protected create(): Tetromino {
    return new O();
  }
}

export class S extends Tetromino {

  protected rotations: RotationSize[] = [[3, 2], [2, 3]];
  protected rotationCoords: Coord[][] = [
    [[1, 0], [2, 0], [0, 1], [1, 1]],
    [[0, 0], [0, 1], [1, 1], [1, 2]],
  ];
  protected rotationCenterOffset: Coord[] = [[1, 1], [0, 1], [1, 0], [1, 1]];

  public readonly blockTexture: string = GREEN;

  constructor() {
    super(3, 0, S_TEXTURE);
  }

  protected create(): Tetromino {
    return new S();
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

  public readonly blockTexture: string = PURPLE;

  constructor() {
    super(3, 0, T_TEXTURE);
  }

  protected create(): Tetromino {
    return new T();
  }
}

export class Z extends Tetromino {

  protected rotations: RotationSize[] = [[3, 2], [2, 3]];
  protected rotationCoords: Coord[][] = [
    [[0, 0], [1, 0], [2, 1], [1, 1]],
    [[1, 0], [0, 1], [1, 1], [0, 2]],
  ];
  protected rotationCenterOffset: Coord[] = [[1, 1], [0, 1], [1, 0], [1, 1]];

  public readonly blockTexture: string = RED;

  constructor() {
    super(3, 0, Z_TEXTURE);
  }

  protected create(): Tetromino {
    return new Z();
  }
}
