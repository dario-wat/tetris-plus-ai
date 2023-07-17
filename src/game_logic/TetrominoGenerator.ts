import { shuffle } from "lodash";
import { I, J, L, O, S, T, Tetromino, Z } from "../game_objects/Tetromino";
import { TetrominoEnum } from "../lib/tetromino_enum";

// TODO random generation is really weird

export default class TetrominoGenerator {

  private queue: TetrominoEnum[];

  constructor() {
    this.queue = newShuffledQueue();
  }

  /** Creates a new tetromino. */
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
        return new I();
      case TetrominoEnum.J:
        return new J();
      case TetrominoEnum.L:
        return new L();
      case TetrominoEnum.O:
        return new O();
      case TetrominoEnum.S:
        return new S();
      case TetrominoEnum.T:
        return new T();
      case TetrominoEnum.Z:
        return new Z();
    }
  }

  /** Next tetromino in the queue. */
  public next(): TetrominoEnum {
    return this.queue[0];
  }

  public copy(): TetrominoGenerator {
    const tetrominoGenerator = new TetrominoGenerator();
    tetrominoGenerator.queue = [...this.queue];
    return tetrominoGenerator;
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

