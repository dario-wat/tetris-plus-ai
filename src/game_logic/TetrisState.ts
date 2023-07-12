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
   * 3. Initialized the game over button and state
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
  private createNewTetromino(): void {
    if (!this.tetromino.scene) {
      this.tetromino = this.tetrominoGenerator.create();

      // Game Over logic
      if (this.isOverlapping(this.tetromino)) {
        this.gameOver = true;
      }
    }
  }

  public makeStep(): void {
    if (this.gameOver) {
      return;
    }

    this.tetromino.drop();
    this.crush();
    this.createNewTetromino();
  }

  public tetrominoRotate(): void {
    if (!this.gameOver) {
      this.tetromino.rotate();
    }
  }

  public tetrominoMoveRight(): void {
    if (!this.gameOver) {
      this.tetromino.moveRight();
    }
  }

  public tetrominoMoveLeft(): void {
    if (!this.gameOver) {
      this.tetromino.moveLeft();
    }
  }

  public tetrominoDrop(): void {
    if (!this.gameOver && this.tetromino.scene) {
      this.tetromino.drop();
    }
  }

  public tetrominoTotalDrop(): void {
    if (!this.gameOver && this.tetromino.scene) {
      this.tetromino.totalDrop();
      this.createNewTetromino();
    }
  }

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
  public destructureTetromino(tetromino: Tetromino): void {
    // TODO only allowed when touching the top of the stack
    const coords = tetromino.getAllCoords();
    for (const [xCoord, yCoord] of coords) {
      this.blocks.push(
        new Block(this.scene, xCoord, yCoord, tetromino.blockTexture)
      );
    }
  }

  // TODO this should check for bottom of arena or block stack
  public isTetrominoAtTheBottom(tetromino: Tetromino): boolean {
    const coords = tetromino.getAllCoords();
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

  public isOverlapping(tetromino: Tetromino): boolean {
    const coords = tetromino.getAllCoords();
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

  public reset(): void {
    this.blocks.map(block => block.destroy());
    this.blocks = [];
  }

  private heights(): number[] {
    const heights = Array(TETRIS_WIDTH).fill(0);
    const columns = this.columns();
    columns.forEach(column => {
      const height = min(column.map(block => block.yCoord));
      heights[column[0].xCoord] = TETRIS_HEIGHT - height;
    });
    return heights;
  }

  public heightsSum(): number {
    return sum(this.heights());
  }

  public debugHeuristic(): void {
    this.debugText.setText(
      'Heights: ' + this.heights().toString()
      + '\nHeight sum: ' + this.heightsSum()
    );
  }
}