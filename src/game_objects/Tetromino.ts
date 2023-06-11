import * as Phaser from 'phaser';
import { TetrisScene } from '../scene';
import { BLUE, GREEN, I_TEXTURE, J_TEXTURE, LIGHT_BLUE, L_TEXTURE, ORANGE, O_TEXTURE, PURPLE, RED, S_TEXTURE, T_TEXTURE, YELLOW, Z_TEXTURE } from '../lib/textures';
import { SCALE, TETRIS_HEIGHT, TETRIS_WIDTH } from '../lib/consts';
import { cx, cy } from '../lib/grid';
import Block from './Block';

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

  public abstract readonly blockTexture: string;

  constructor(public scene: TetrisScene, texture: string) {
    // TODO(fix 0 0 here)
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

  /** Basic rotation only if new position is valid. */
  public rotate(): void {
    this.updateCurrRotation((this.currRotation + 1) % this.rotations.length);

    if (!this.isValidPosition()) {
      this.updateCurrRotation(
        (this.currRotation + this.rotations.length - 1) % this.rotations.length
      );
    } else {
      this.setRotation(this.rotation + Math.PI / 2);
    }
  }

  /** 
   * Updates this.currRotation by unlocking it first, updating and then
   * locking it again.
   */
  private updateCurrRotation(newCurrRotation: number): void {
    this.unlockFromCenter();
    this.currRotation = newCurrRotation;
    this.lockToCenter();
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

  /** Drops the tetromino by one and return true if it got dropped. */
  public drop(): boolean {
    if (this.isAtBottom()) {
      this.scene.blockHandler.destructureTetromino(this);
      this.destroy();
      return false;
    }
    this.yCoord += 1;
    return true;
  }

  /** Drops to the bottom. */
  public totalDrop(): void {
    while (this.drop()) { }
  }

  /** 
   * Checks whether the tetromino is touching the bottom of the arena
   * or the top of the tetromino tower.
   */
  private isAtBottom(): boolean {
    const coords = this.getAllCoords();
    return coords.some(([_, yCoord]) => yCoord === TETRIS_HEIGHT - 1)
      || this.scene.blockHandler.isTetrominoAtTheBottom(this);
  }

  /** Gets coordinates of all individual blocks of a tetromino. */
  public getAllCoords(): Coord[] {
    const currRotationCoords = this.rotationCoords[this.currRotation];
    return currRotationCoords.map(([dx, dy]) =>
      [this.xCoord + dx, this.yCoord + dy]
    );
  }

  /** Checks whether a tetromino is in a valid position (inside the arena). */
  private isValidPosition(): boolean {
    const allCoords = this.getAllCoords();
    return allCoords.every(([xCoord, yCoord]) => inBounds(xCoord, yCoord))
      && !this.scene.blockHandler.isOverlapping(this);
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

  public readonly blockTexture: string = LIGHT_BLUE;

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

  public readonly blockTexture: string = BLUE;

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

  public readonly blockTexture: string = ORANGE;

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

  public readonly blockTexture: string = YELLOW;

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

  public readonly blockTexture: string = GREEN;

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

  public readonly blockTexture: string = PURPLE;

  constructor(scene: TetrisScene) {
    super(scene, T_TEXTURE);
    this.xCoord = 3;
    this.yCoord = 0;
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

  constructor(scene: TetrisScene) {
    super(scene, Z_TEXTURE);
    this.xCoord = 3;
    this.yCoord = 0;
  }
}
