import { flatten, groupBy, max, min, sum, uniq } from "lodash";
import { Move, Tetromino } from "../game_objects/Tetromino";
import { TETRIS_HEIGHT, TETRIS_WIDTH } from "../lib/consts";
import TetrominoGenerator from "./TetrominoGenerator";
import Block from "../game_objects/Block";

export default class TetrisState {

  public blocks: Block[] = [];
  public tetromino: Tetromino | null = null;
  public gameOver: boolean = false;
  public tetrominoGenerator: TetrominoGenerator;

  private crushedRows: number = 0;
  private tetrominoesCreated: number = 0;

  /**
   * Initialized tetris state.
   * 1. Create a new tetromino queue (generator)
   * 2. Creates the first tetromino
   */
  constructor() {
    this.tetrominoGenerator = new TetrominoGenerator();
    this.tetromino = this.tetrominoGenerator.create();
    this.tetrominoesCreated = 1;
  }

  // This is not ideal since it's used in many places and ideally it should
  // be used in only one place. But it works
  private createNewTetromino(): void {
    if (this.tetromino === null) {
      this.tetromino = this.tetrominoGenerator.create();
      this.tetrominoesCreated += 1;

      // Game Over logic
      if (this.isTetrominoOverlapping()) {
        this.gameOver = true;
      }
    }
  }

  public getCrushedRows(): number {
    return this.crushedRows;
  }

  public getTetrominoesCreated(): number {
    return this.tetrominoesCreated;
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

  public reset(): void {
    this.blocks = [];
    this.tetrominoGenerator = new TetrominoGenerator();

    this.crushedRows = 0;
    this.tetrominoesCreated = 0;

    this.tetromino = null
    this.createNewTetromino();

    this.gameOver = false;
  }

  /** Does a given move. */
  public doMove(move: Move): void {
    switch (move) {
      case Move.LEFT:
        this.tetrominoMoveLeft();
        break;
      case Move.RIGHT:
        this.tetrominoMoveRight();
        break;
      case Move.ROTATE:
        this.tetrominoRotate();
        break;
      case Move.TOTAL_DROP:
        this.tetrominoTotalDrop();
        break;
    }
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
    if (this.gameOver || !this.tetromino) {
      return false;
    }

    if (this.canTetrominoDrop()) {
      this.tetromino.drop();
      return true;
    }

    this.destructureTetromino();
    this.tetromino = null;
    return false;
  }

  /** Drops the tetromino to the bottom. */
  public tetrominoTotalDrop(): void {
    if (!this.gameOver && this.tetromino) {
      while (this.tetrominoDrop()) { }
      this.crush();
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
      // Remove Blocks that should be crushed
      this.blocks = this.blocks.filter(block => block.yCoord !== indexToCrush);

      // Drop blocks that are above the crushed row
      this.blocks.filter(block => block.yCoord < indexToCrush)
        .forEach(block => {
          block.yCoord += 1;
        });
    }

    this.crushedRows += fullRows.length;
  }

  /** Converts a Tetromino into immovable individual blocks. */
  public destructureTetromino(): void {
    if (this.canTetrominoDrop()) {
      throw Error('Tetromino should not be destructured in this position');
    }

    const coords = this.tetromino.getAllCoords();
    for (const [xCoord, yCoord] of coords) {
      this.blocks.push(new Block(xCoord, yCoord, this.tetromino.blockTexture)
      );
    }
  }


  /******************************************************************
   * Heuristic & AI
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

  /** Heuristic: sum of heights of all columns. */
  public heightsSum(): number {
    return sum(this.heights());
  }

  /** Heuristic: sum of differences of heights between adjacent columns. */
  public heightsDifferenceSum(): number {
    const heights = this.heights();
    return sum(
      heights.slice(1).map((height, i) => Math.abs(height - heights[i]))
    );
  }

  /**
   * Heuristic: number of holes in the stack. A hole is defined as a
   * grid cell without a tetris block that has a tetris block anywhere
   * above it in the stack.
   */
  public holeCount(): number {
    const holesPerColumn = this.columns().map(column =>
      TETRIS_HEIGHT - min(column.map(block => block.yCoord)) - column.length
    );
    return sum(holesPerColumn);
  }

  public maxHeight(): number {
    const height = min(this.blocks.map(block => block.yCoord)) ?? TETRIS_HEIGHT;
    return TETRIS_HEIGHT - height;
  }

  // TODO move out
  /** Used for the heuristic debug text */
  public getHeuristicText(): string {
    return 'Height sum: ' + this.heightsSum()
      + '\nHeight diff sum: ' + this.heightsDifferenceSum()
      + '\nHole count: ' + this.holeCount()
      + '\nMax height: ' + this.maxHeight()
  }

  public copy(): TetrisState {
    const tetrisState = new TetrisState();
    tetrisState.blocks = this.blocks.map(block => block.copy());
    tetrisState.tetromino = this.tetromino.copy();
    tetrisState.gameOver = this.gameOver;
    tetrisState.tetrominoGenerator = this.tetrominoGenerator.copy();
    return tetrisState;
  }
}