import * as Phaser from 'phaser';
import { TetrisScene } from '../scene';
import { BLUE, GREEN, I_TEXTURE, J_TEXTURE, LIGHT_BLUE, L_TEXTURE, ORANGE, O_TEXTURE, PURPLE, RED, S_TEXTURE, T_TEXTURE, YELLOW, Z_TEXTURE } from '../lib/textures';
import { SCALE } from '../lib/consts';
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

  /** Texture of the individual blocks. */
  public abstract readonly blockTexture: string;

  /** Width and height for each individual rotation */
  protected abstract readonly rotations: RotationSize[];
  /** Coordinate offsets for each individual block in a tetromino. */
  protected abstract readonly rotationCoords: Coord[][];
  /** Coordinate offset for the center of the tetromino. */
  protected abstract readonly rotationCenterOffset: Coord[];
  protected currRotation: number = 0;

  protected constructor(
    public scene: TetrisScene,
    texture: string,
    public xCoord: number,
    public yCoord: number,
  ) {
    super(scene, 0, 0, texture);
    scene.add.existing(this);

    this.setScale(SCALE);

    this.scene.events.on('update', () => {
      this.updatePosition();
    });
  }

  /**
   * Updates the position of the tetromino based on the coordinates and the
   * rotation. This is called inside each tetromino constructor even
   * though it probably shouldn't.
   */
  protected updatePosition(): void {
    const tetrWidth = this.rotations[this.currRotation][0];
    const tetrHeight = this.rotations[this.currRotation][1];
    this.setPosition(
      cx(this.xCoord, tetrWidth),
      cy(this.yCoord, tetrHeight),
    );
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
    this.updateCurrRotation((this.currRotation + 1) % this.rotations.length);
    this.setRotation(this.rotation + Math.PI / 2);
  }

  public rotateLeft(): void {
    this.updateCurrRotation(
      (this.currRotation + this.rotations.length - 1) % this.rotations.length
    );
    this.setRotation(this.rotation - Math.PI / 2);
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
    super(scene, I_TEXTURE, 4, 0);
    this.updatePosition();
    this.rotateRight();
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
    super(scene, J_TEXTURE, 3, 0);
    this.updatePosition();
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
    super(scene, L_TEXTURE, 3, 0);
    this.updatePosition();
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
    super(scene, O_TEXTURE, 4, 0);
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
    super(scene, S_TEXTURE, 3, 0);
    this.updatePosition();
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
    super(scene, T_TEXTURE, 3, 0);
    this.updatePosition();
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
    super(scene, Z_TEXTURE, 3, 0);
    this.updatePosition();
  }
}
