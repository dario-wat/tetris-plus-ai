import Block from "../game_objects/Block";
import { Tetromino } from "../game_objects/Tetromino";
import { TetrisScene } from "../scene";

export default class BlockHandler {

  private blocks: Block[] = [];

  constructor(public scene: TetrisScene) { }

  public create(xCoord: number, yCoord: number, texture: string): void {
    this.blocks.push(new Block(this.scene, xCoord, yCoord, texture));
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
}