import { flatten, groupBy, max, min, range, sum, uniq } from "lodash";
import Block from "../game_objects/Block";
import { Tetromino } from "../game_objects/Tetromino";
import { TETRIS_HEIGHT, TETRIS_WIDTH } from "../lib/consts";
import { TetrisScene } from "../scene";

const X_INDICES_STR = JSON.stringify(range(0, TETRIS_WIDTH));

/**
 * Represents an individual immovable block that is created once the
 * tetromino hits the bottom.
 */
export default class BlockHandler {

  private debugText: Phaser.GameObjects.Text;

  private blocks: Block[] = [];

  constructor(public scene: TetrisScene) {
    this.debugText = this.scene.add.text(
      100,
      100,
      '',
      {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#FFFFFF' // White color
      }
    );
  }

  /** Converts a Tetromino into immovable individual blocks. */
  public destructureTetromino(tetromino: Tetromino): void {
    const coords = tetromino.getAllCoords();
    for (const [xCoord, yCoord] of coords) {
      this.blocks.push(
        new Block(this.scene, xCoord, yCoord, tetromino.blockTexture)
      );
    }
  }

  /**
   * Crushes all rows that are full. Does it by finding rows where blocks
   * cover all X indices, removing them from the list and destroying the
   * sprites, and drop all blocks above the rows by 1.
   */
  public crush(): void {
    const rows = Object.values(groupBy(this.blocks, block => block.yCoord));
    const rowsToCrush = rows.filter(row =>
      // Blocks cover all X indices (entire row)
      JSON.stringify(row.map(block => block.xCoord).sort()) === X_INDICES_STR
    );
    const rowIndicesToCrush = uniq(
      flatten(rowsToCrush).map(block => block.yCoord)
    );

    for (const indexToCrush of rowIndicesToCrush.sort()) {
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
    const columns = Object.values(groupBy(this.blocks, block => block.xCoord));
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