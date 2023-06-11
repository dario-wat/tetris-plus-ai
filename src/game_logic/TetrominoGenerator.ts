import { I, J, L, O, S, T, Tetromino, Z } from "../game_objects/Tetromino";
import { TetrisScene } from "../scene";

export default class TetrominoGenerator {

  private queue: number[] = [];

  constructor(public scene: TetrisScene) { }

  /** Creates a new tetromino in the scene. */
  public create(): Tetromino {
    if (this.queue.length === 0) {
      this.queue = newShuffledQueue();
    }

    const index = this.queue.shift();
    return this.createTetromino(index);
  }

  private createTetromino(index: number): Tetromino {
    switch (index) {
      case 0:
        return new I(this.scene);
      case 1:
        return new J(this.scene);
      case 2:
        return new L(this.scene);
      case 3:
        return new O(this.scene);
      case 4:
        return new S(this.scene);
      case 5:
        return new T(this.scene);
      case 6:
        return new Z(this.scene);
    }
  }
}

function newShuffledQueue(): number[] {
  return shuffleArray([0, 1, 2, 3, 4, 5, 6]);
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}