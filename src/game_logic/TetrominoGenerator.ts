import { shuffle } from "lodash";
import { I, J, L, O, S, T, Tetromino, Z } from "../game_objects/Tetromino";
import { TetrisScene } from "../scene";
import { TetrominoEnum } from "../lib/tetromino_enum";

export default class TetrominoGenerator {

  private queue: TetrominoEnum[];

  // TODO maybe should not have a scene input
  constructor(private scene: TetrisScene) {
    this.queue = newShuffledQueue();
  }

  /** Creates a new tetromino in the scene. */
  public create(): Tetromino {
    if (this.queue.length <= 1) {
      this.queue = [...this.queue, ...newShuffledQueue()];
    }

    const tetromino = this.queue.shift();
    return this.createTetromino(tetromino);
  }

  private createTetromino(index: TetrominoEnum): Tetromino {
    switch (index) {
      case TetrominoEnum.I:
        return new I(this.scene);
      case TetrominoEnum.J:
        return new J(this.scene);
      case TetrominoEnum.L:
        return new L(this.scene);
      case TetrominoEnum.O:
        return new O(this.scene);
      case TetrominoEnum.S:
        return new S(this.scene);
      case TetrominoEnum.T:
        return new T(this.scene);
      case TetrominoEnum.Z:
        return new Z(this.scene);
    }
  }

  /** Next tetromino in the queue. */
  public next(): TetrominoEnum {
    return this.queue[0];
  }

  public reset(): void {
    this.queue = [];
  }
}

/** Creates shuffled indices for 7 unique tetrominoes. */
function newShuffledQueue(): TetrominoEnum[] {
  return shuffle([
    TetrominoEnum.I,
    TetrominoEnum.J,
    TetrominoEnum.L,
    TetrominoEnum.O,
    TetrominoEnum.S,
    TetrominoEnum.T,
    TetrominoEnum.Z,
  ]);
}

