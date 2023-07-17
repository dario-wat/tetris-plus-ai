import { flatten, groupBy, min, minBy, sum, uniq } from "lodash";
import { Tetromino } from "../game_objects/Tetromino";
import { GAME_OVER_EVENT, HEURISTIC_TEXT_UPDATED_EVENT, NEXT_TETROMINO_UPDATED_EVENT, ON_GAME_OVER_BUTTON_CLICK_EVENT, TETRIS_HEIGHT, TETRIS_WIDTH } from "../lib/consts";
import { TetrisScene } from "../scene";
import TetrominoGenerator from "./TetrominoGenerator";
import { Coord, DropPosition } from "../types";
import { Block } from "../game_objects/Block";

export default class TetrisState {

  public blocks: Block[] = [];
  public tetromino: Tetromino;
  private gameOver: boolean = false;
  private tetrominoGenerator: TetrominoGenerator;

  private isSandbox: boolean = false;

  /**
   * Initialized tetris state in the scene.
   * 1. Create a new tetromino queue (generator)
   * 2. Creates the first tetromino
   * 3. Initializes the game over state
   * 4. Creates the heuristic debug text
   */
  constructor(
    private scene: TetrisScene,
    isCopy: boolean = false,
  ) {
    this.tetrominoGenerator = new TetrominoGenerator(scene);
    this.tetromino = this.tetrominoGenerator.create();

    if (!isCopy) {
      this.scene.events.on(ON_GAME_OVER_BUTTON_CLICK_EVENT, () => this.reset());
      this.scene.events.on('update', () => {
        this.isSandbox && this.makeInvisible();
        this.emitHeuristicTextUpdated();
      });
    }
  }

  // This is not ideal since it's used in many places and ideally it should
  // be used in only one place. But it works
  private createNewTetromino(): void {
    if (!this.tetromino.scene) {
      this.tetromino = this.tetrominoGenerator.create();

      !this.isSandbox && this.scene.events.emit(
        NEXT_TETROMINO_UPDATED_EVENT,
        this.tetrominoGenerator.next(),
      );

      // Game Over logic
      if (this.isTetrominoOverlapping()) {
        this.gameOver = true;
        !this.isSandbox &&
          this.scene.events.emit(GAME_OVER_EVENT, this.gameOver);
      }
    }

    // if (!this.isSandbox) {
    //   const move = this.bestMove();
    //   // console.log(move);
    //   this.tetromino.forceDropPosition(move);
    //   console.log(this.scene.children.getAll())
    // }
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

  private reset(): void {
    this.blocks = [];
    this.tetrominoGenerator.reset();

    this.tetromino.destroy();
    this.createNewTetromino();

    this.gameOver = false;
    !this.isSandbox &&
      this.scene.events.emit(GAME_OVER_EVENT, this.gameOver);
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
  private heightsSum(): number {
    return sum(this.heights());
  }

  /** Heuristic: sum of differences of heights between adjacent columns. */
  private heightsDifferenceSum(): number {
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
  private holeCount(): number {
    const holesPerColumn = this.columns().map(column =>
      TETRIS_HEIGHT - min(column.map(block => block.yCoord)) - column.length
    );
    return sum(holesPerColumn);
  }

  /** Heuristic score for the current state. */
  private heuristic(
    heightsSumFactor: number,
    heightsDifferenceSumFactor: number,
    holeCountFactor: number,
  ): number {
    return heightsSumFactor * this.heightsSum()
      + heightsDifferenceSumFactor + this.heightsDifferenceSum()
      + holeCountFactor * this.holeCount();
  }

  /** Used for the heuristic debug text */
  private emitHeuristicTextUpdated(): void {
    !this.isSandbox && this.scene.events.emit(
      HEURISTIC_TEXT_UPDATED_EVENT,
      'Height sum: ' + this.heightsSum()
      + '\nHeight diff sum: ' + this.heightsDifferenceSum()
      + '\nHole count: ' + this.holeCount(),
    );
  }

  /** Turn this state into sandbox mode. Nothing is visible in the scene. */
  private sandbox(): void {
    this.makeInvisible();
    this.isSandbox = true;
  }

  /** Makes all game objects invisible and thus this state invisible. */
  private makeInvisible(): void {
    this.tetromino.setVisible(false);
  }

  private copy(): TetrisState {
    const tetrisState = new TetrisState(this.scene, true);
    tetrisState.blocks = [...this.blocks];
    tetrisState.tetromino.destroy();
    tetrisState.tetromino = this.tetromino.copy();
    tetrisState.gameOver = this.gameOver;
    tetrisState.tetrominoGenerator = this.tetrominoGenerator.copy();
    tetrisState.sandbox();
    return tetrisState;
  }

  private destroy(): void {
    this.tetromino.destroy();
    this.tetromino = undefined;
    this.blocks = undefined;
    this.tetrominoGenerator = undefined;
    this.scene = undefined;
  }

  /** What is the best next position to drop this tetromino. */
  private bestMove(): DropPosition {
    const heuristicScores = this.tetromino.enumerateDropPositions()
      .map(dropPosition => {
        const tetrisState = this.copy();
        tetrisState.sandbox();
        tetrisState.tetromino.forceDropPosition(dropPosition);
        tetrisState.tetrominoTotalDrop();
        const hScore = tetrisState.heuristic(1, 0, 10);
        tetrisState.destroy();
        return [dropPosition, hScore] as const;
      });
    return minBy(heuristicScores, h => h[1])[0];
  }
}