import * as Phaser from 'phaser';
import { TetrisScene } from '../scene';
import { BLUE, GREEN, I_TEXTURE, J_TEXTURE, LIGHT_BLUE, L_TEXTURE, ORANGE, O_TEXTURE, PURPLE, RED, S_TEXTURE, T_TEXTURE, YELLOW, Z_TEXTURE } from '../lib/textures';
import { DEBUG_GRAPHICS_TETROMINO_CENTER_EVENT, SCALE, TETRIS_WIDTH } from '../lib/consts';
import { cx, cy } from '../lib/grid';
import { Coord, DropPosition } from '../types';
import { range, zip } from 'lodash';

type RotationSize = [number, number]

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
  public currRotation: number = 0;

  protected constructor(
    public scene: TetrisScene,
    texture: string,
    public xCoord: number,
    public yCoord: number,
  ) {
    super(scene, 0, 0, texture);
    scene.add.existing(this);

    this.setVisible(false);

    this.setScale(SCALE);

    this.scene.events.on('update', () => {
      this.updatePosition();

      this.scene &&
        this.scene.events.emit(
          DEBUG_GRAPHICS_TETROMINO_CENTER_EVENT,
          this.getCenterPoint(),
        );
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

  public getTetrWidth(): number {
    return this.rotations[this.currRotation][0];
  }

  public getTetrHeight(): number {
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
   * Updates this.currRotation by unlocking it first, updating and then
   * locking it again.
   */
  private updateCurrRotation(newCurrRotation: number): void {
    const rotationDx = newCurrRotation > this.currRotation
      ? newCurrRotation - this.currRotation
      : - (this.currRotation - newCurrRotation);
    this.currRotation = newCurrRotation;
  }

  /** 
   * Forces a tetromino into a specific position (and rotation).
   * This is used for AI.
   */
  public forceDropPosition(dropPosition: DropPosition): void {
    this.updateCurrRotation(dropPosition.rotation);
    this.xCoord = dropPosition.coord[0];
    this.yCoord = dropPosition.coord[1];
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
  private getCenterPoint(): Coord {
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
    const tetromino = this.create(this.scene);
    tetromino.currRotation = this.currRotation;
    return tetromino;
  }

  protected abstract create(scene: TetrisScene): Tetromino;
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

  protected create(scene: TetrisScene): Tetromino {
    return new I(scene);
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

  protected create(scene: TetrisScene): Tetromino {
    return new J(scene);
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

  protected create(scene: TetrisScene): Tetromino {
    return new L(scene);
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

  protected create(scene: TetrisScene): Tetromino {
    return new O(scene);
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

  protected create(scene: TetrisScene): Tetromino {
    return new S(scene);
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

  protected create(scene: TetrisScene): Tetromino {
    return new T(scene);
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

  protected create(scene: TetrisScene): Tetromino {
    return new Z(scene);
  }
}


export class TetrominoSprite extends Phaser.GameObjects.Sprite {

  constructor(
    scene: TetrisScene,
    private xCoord: number,
    private yCoord: number,
    private tetrWidth: number,
    private tetrHeight: number,
    private rotationIndex: number,
    texture: string,
  ) {
    super(scene, 0, 0, texture);
    scene.add.existing(this);

    this.setScale(SCALE);

    this.updatePosition();
    this.updateRotation();
  }

  /**
   * Updates the position of the tetromino based on the coordinates and the
   * rotation. This is called inside each tetromino constructor even
   * though it probably shouldn't.
   */
  private updatePosition(): void {
    this.setPosition(
      cx(this.xCoord, this.tetrWidth),
      cy(this.yCoord, this.tetrHeight),
    );
  }

  private updateRotation(): void {
    this.setRotation(this.rotation + this.rotationIndex * Math.PI / 2);
  }
}