import { minBy } from "lodash";
import { DropPosition } from "../types";
import TetrisState from "./TetrisState";

export default class AI {

  private heightsSumFactor: number = 1;
  private heightsDiffSumFactor: number = 0;
  private holeCountFactor: number = 10;

  constructor(private tetrisState: TetrisState) { }

  /** Heuristic score for the current state. */
  private heuristic(tetrisState: TetrisState): number {
    return this.heightsSumFactor * tetrisState.heightsSum()
      + this.heightsDiffSumFactor + tetrisState.heightsDifferenceSum()
      + this.holeCountFactor * tetrisState.holeCount();
  }

  /** What is the best next position to drop this tetromino. */
  public bestMove(): DropPosition {
    const heuristicScores = this.tetrisState.tetromino.enumerateDropPositions()
      .map(dropPosition => {
        const tetrisState = this.tetrisState.copy();
        tetrisState.tetromino.forceDropPosition(dropPosition);
        tetrisState.tetrominoTotalDrop();
        const hScore = this.heuristic(tetrisState);
        return [dropPosition, hScore] as const;
      });
    return minBy(heuristicScores, h => h[1])[0];
  }
}