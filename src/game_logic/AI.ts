import { minBy } from "lodash";
import { DropPosition } from "../types";
import TetrisState from "./TetrisState";
import { Move } from "../game_objects/Tetromino";
import { check } from "../lib/require";

type GraphNode = {
  tetrisState: TetrisState,
  dropPositions: DropPosition[],
};

export default class AI {

  public readonly minValue: number = -1;
  public readonly maxValue: number = 1;

  // Very good starting set of parameters
  public heightsSumFactor: number = 0.1;
  public heightsDiffSumFactor: number = 0.1;
  public holeCountFactor: number = 1;
  public maxHeightFactor: number = 0;

  // TODO should this be here ?
  public isActive: boolean = false;

  constructor(private tetrisState: TetrisState) { }

  public setIsActive(value: boolean): void {
    this.isActive = value;
  }

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
  public bestPosition(depth: number = 1): DropPosition {
    check(depth > 0);

    // Initialize first node
    let currNodes: GraphNode[] = [{
      tetrisState: this.tetrisState,
      dropPositions: [],
    }];

    // Do BFS to find all states at a certain depth
    for (let i = 0; i < depth; i++) {
      const nextNodes: GraphNode[] = currNodes.flatMap(node =>
        node.tetrisState.tetromino.enumerateDropPositions().map(dropPosition => {
          const tetrisState = node.tetrisState.copy();
          tetrisState.tetromino.forceDropPosition(dropPosition);
          tetrisState.tetrominoTotalDrop();
          return {
            tetrisState,
            dropPositions: [...node.dropPositions, dropPosition],
          };
        })
      );
      currNodes = nextNodes;
    }

    // Evaluate heuristic and take only the first drop position of the best state
    const heuristicScores = currNodes.map(node => {
      const hScore = this.heuristic(node.tetrisState);
      return [node.dropPositions[0], hScore] as const;
    });
    return minBy(heuristicScores, h => h[1])[0];
  }
}