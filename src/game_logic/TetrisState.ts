import { flatten, groupBy, min, sum, uniq } from "lodash";
import Block from "../game_objects/Block";
import { Tetromino } from "../game_objects/Tetromino";
import { DEBUG_TEXT_X, DEBUG_TEXT_Y, TETRIS_HEIGHT, TETRIS_WIDTH } from "../lib/consts";
import { TetrisScene } from "../scene";
import TetrominoGenerator from "./TetrominoGenerator";
import GameOverButton from "../game_objects/GameOverButton";

/**
 * Represents an individual immovable block that is created once the
 * tetromino hits the bottom.
 */
export default class TetrisState {

  private debugText: Phaser.GameObjects.Text;

  private blocks: Block[] = [];
  private tetromino: Tetromino;
  private gameOverButton: GameOverButton; // TODO maybe should be outside
  private gameOver: boolean = false;

  // TODO should be private
  public tetrominoGenerator: TetrominoGenerator;

  /**
   * Initialized tetris state in the scene.
   * 1. Create a new tetromino queue (generator)
   * 2. Creates the first tetromino
   * 3. Initializes the game over button and state
   * 4. Creates the heuristic debug text
   */
  constructor(public scene: TetrisScene) {
    this.tetrominoGenerator = new TetrominoGenerator(scene);
    this.tetromino = this.tetrominoGenerator.create();

    this.gameOverButton = new GameOverButton(scene, () => {
      this.tetrominoGenerator.reset();
      this.reset();
      this.gameOver = false;
      this.tetromino.destroy();
      this.createNewTetromino();
    });

    this.debugText = this.scene.add.text(
      DEBUG_TEXT_X,
      DEBUG_TEXT_Y,
      '',
      {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#FFFFFF' // White color
      }
    );
  }

  // This is not ideal since it's used in many places and ideally it should
  // be used in only one place. But it works
  // TODO what to do with this
  private createNewTetromino(): void {
    if (!this.tetromino.scene) {
      this.tetromino = this.tetrominoGenerator.create();

      // Game Over logic
      if (this.isTetrominoOverlapping()) {
        this.gameOver = true;
      }
    }
  }


  /******************************************************************
   * Following are the tetris state manipulation functions that are
   * exposed outside (usually means that user has control over them). 
   * Things like dropping, rotating and moving tetrominoes.
   *****************************************************************/

  /** 
   * Makes a step in the tetris game. This usually means dropping the
   * tetromino and removing full rows if there are any.
   */
  public makeStep(): void {
    if (this.gameOver) {
      return;
    }

    this.tetrominoDrop();
    this.crush();
    this.createNewTetromino();
  }

  // TODO should include resetting other stuff from game over button
  // TODO maybe private?
  public reset(): void {
    this.blocks.map(block => block.destroy());
    this.blocks = [];
  }

  /** 
   * Rotates only if the ending state is valid (not outside of bounds
   * nor overlapping).
   */
  public tetrominoRotate(): void {
    if (this.gameOver) {
      return;
    }

    this.tetromino.rotateRight();
    if (!this.isValidState()) {
      this.tetromino.rotateLeft();
    }
  }

  /** 
   * Moves right only if the ending state is valid (not outside of bounds
   * nor overlapping).
   */
  public tetrominoMoveRight(): void {
    if (this.gameOver) {
      return;
    }

    this.tetromino.moveRight();
    if (!this.isValidState()) {
      this.tetromino.moveLeft();
    }
  }

  /** 
   * Moves left only if the ending state is valid (not outside of bounds
   * nor overlapping).
   */
  public tetrominoMoveLeft(): void {
    if (this.gameOver) {
      return;
    }

    this.tetromino.moveLeft();
    if (!this.isValidState()) {
      this.tetromino.moveRight();
    }
  }

  /**
   * Drops the tetromino once if possible and returns true if the tetromino
   * dropped. The tetromino cannot drop if it's touching the bottom of the
   * board or the top of the stack.
   */
  public tetrominoDrop(): boolean {
    if (this.gameOver || !this.tetromino.scene) {
      return false;
    }

    if (this.canTetrominoDrop()) {
      this.tetromino.drop();
      return true;
    }

    this.destructureTetromino();
    this.tetromino.destroy();
    return false;
  }

  /** Drops the tetromino to the bottom. */
  public tetrominoTotalDrop(): void {
    if (!this.gameOver && this.tetromino.scene) {
      while (this.tetrominoDrop()) { }
      this.createNewTetromino();
    }
  }


  /******************************************************************
   * A collections of private functions to check the state of the
   * tetromino, e.g. is out of bounds, can it drop, ...
   *****************************************************************/

  /** 
   * Checks whether the tetromino is touching the bottom of the arena
   * or the top of the tetromino stack.
   */
  private canTetrominoDrop(): boolean {
    return !this.isTetrominoAtTheBottom() && !this.isTetrominoOnTheStack();
  }

  /** 
   * Checks whether the tetromino is on top of the stack, meaning, it's
   * touching the existing blocks and can't move further down.
   */
  private isTetrominoOnTheStack(): boolean {
    const coords = this.tetromino.getAllCoords();
    for (const [xCoord, yCoord] of coords) {
      const atTheBottom = this.blocks.some(block =>
        xCoord === block.xCoord && yCoord + 1 === block.yCoord
      );
      if (atTheBottom) {
        return true;
      }
    }
    return false;
  }

  /** Checks whether the tetromino is touching the bottom border. */
  private isTetrominoAtTheBottom(): boolean {
    const coords = this.tetromino.getAllCoords();
    return coords.some(([_, yCoord]) => yCoord === TETRIS_HEIGHT - 1);
  }

  /**
   * State is invalid if the tetromino overlaps with the existing blocks
   * or if the tetromino is outside of the bounds.
   */
  private isValidState(): boolean {
    return this.isTetrominoInBounds() && !this.isTetrominoOverlapping();
  }

  /** Checks whether the tetromino is in bound of the board. */
  private isTetrominoInBounds(): boolean {
    const coords = this.tetromino.getAllCoords();
    return coords.every(([xCoord, yCoord]) =>
      xCoord >= 0
      && xCoord < TETRIS_WIDTH
      && yCoord >= 0
      && yCoord < TETRIS_HEIGHT
    );
  }

  /** Checks whether the tetromino is overlapping with any existing blocks. */
  private isTetrominoOverlapping(): boolean {
    const coords = this.tetromino.getAllCoords();
    for (const [xCoord, yCoord] of coords) {
      const overlaps = this.blocks.some(block =>
        xCoord === block.xCoord && yCoord === block.yCoord
      );
      if (overlaps) {
        return true;
      }
    }
    return false;
  }


  /******************************************************************
   * Crushing the rows and destructuring tetrominoes.
   *****************************************************************/

  /** Groups rows of blocks together. */
  private rows(): Block[][] {
    return Object.values(groupBy(this.blocks, block => block.yCoord));
  }

  /** Groups columns of blocks together. */
  private columns(): Block[][] {
    return Object.values(groupBy(this.blocks, block => block.xCoord));
  }

  /** Row indices fully covered by blocks. These rows need to be crushed. */
  private fullRows(): number[] {
    const rows = this.rows();
    const rowsToCrush = rows.filter(row => row.length === TETRIS_WIDTH);
    return uniq(flatten(rowsToCrush).map(block => block.yCoord));
  }

  /**
   * Crushes all rows that are full. Does it by finding rows where blocks
   * cover all X indices, removing them from the list and destroying the
   * sprites, and drop all blocks above the rows by 1.
   */
  public crush(): void {
    const fullRows = this.fullRows();

    for (const indexToCrush of fullRows.sort()) {
      // Destroy Blocks that should be crushed
      this.blocks.filter(block => block.yCoord === indexToCrush)
        .forEach(block => block.destroy());

      // Remove Blocks that should be crushed
      this.blocks = this.blocks.filter(block => block.yCoord !== indexToCrush);

      // Drop blocks that are above the crushed row
      this.blocks.filter(block => block.yCoord < indexToCrush)
        .forEach(block => {
          block.yCoord += 1;
        });
    }
  }

  /** Converts a Tetromino into immovable individual blocks. */
  public destructureTetromino(): void {
    if (this.canTetrominoDrop()) {
      throw Error('Tetromino should not be destructured in this position');
    }

    const coords = this.tetromino.getAllCoords();
    for (const [xCoord, yCoord] of coords) {
      this.blocks.push(
        new Block(this.scene, xCoord, yCoord, this.tetromino.blockTexture)
      );
    }
  }


  /******************************************************************
   * Heuristic
   *****************************************************************/

  /** An array of the heights of each column */
  private heights(): number[] {
    const heights = Array(TETRIS_WIDTH).fill(0);
    const columns = this.columns();
    columns.forEach(column => {
      const height = min(column.map(block => block.yCoord));
      heights[column[0].xCoord] = TETRIS_HEIGHT - height;
    });
    return heights;
  }

  /** Heuristic: sum of heights of all columns */
  public heightsSum(): number {
    return sum(this.heights());
  }

  // TODO should be private
  /** Debug function to show the heuristic data on the screen. */
  public debugHeuristic(): void {
    this.debugText.setText(
      'Heights: ' + this.heights().toString()
      + '\nHeight sum: ' + this.heightsSum()
    );
  }
}