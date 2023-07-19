import { minBy } from "lodash";
import { DropPosition } from "../types";
import TetrisState from "./TetrisState";

export default class AI {

  // Very good starting set of parameters
  public heightsSumFactor: number = 0.1;
  public heightsDiffSumFactor: number = 0.1;
  public holeCountFactor: number = 1;
  public maxHeightFactor: number = 0;

  constructor(private tetrisState: TetrisState) { }

  public setHeightsSumFactor(value: number): void {
    this.heightsSumFactor = value;
  }

  public setHeightsDiffSumFactor(value: number): void {
    this.heightsDiffSumFactor = value;
  }

  public setHoleCountFactor(value: number): void {
    this.holeCountFactor = value;
  }

  public setMaxHeightFactor(value: number): void {
    this.maxHeightFactor = value;
  }

  /** Heuristic score for the current state. */
  private heuristic(tetrisState: TetrisState): number {
    return this.heightsSumFactor * tetrisState.heightsSum()
      + this.heightsDiffSumFactor * tetrisState.heightsDifferenceSum()
      + this.holeCountFactor * tetrisState.holeCount()
      + this.maxHeightFactor * tetrisState.maxHeight();
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