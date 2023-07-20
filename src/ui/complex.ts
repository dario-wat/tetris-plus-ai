import AI from "../game_logic/AI";
import { DRAGGABLE_BAR_GAP, DRAGGABLE_BAR_X, DRAGGABLE_BAR_Y, DRAGGABLE_LINE_WIDTH } from "../lib/consts";
import { TetrisScene } from "../scene";
import Dragger from "./Dragger";

export function addAiControls(scene: TetrisScene, ai: AI): void {
  new Dragger(
    scene,
    DRAGGABLE_BAR_X,
    DRAGGABLE_BAR_Y,
    DRAGGABLE_LINE_WIDTH,
    ai.minValue,
    ai.maxValue,
    (value: number) => ai.setHeightsSumFactor(value),
    'Heights sum factor',
    ai.heightsSumFactor,
  );

  new Dragger(
    scene,
    DRAGGABLE_BAR_X,
    DRAGGABLE_BAR_Y + DRAGGABLE_BAR_GAP,
    DRAGGABLE_LINE_WIDTH,
    ai.minValue,
    ai.maxValue,
    (value: number) => ai.setHeightsDiffSumFactor(value),
    'Heights diff sum factor',
    ai.heightsDiffSumFactor,
  );

  new Dragger(
    scene,
    DRAGGABLE_BAR_X,
    DRAGGABLE_BAR_Y + 2 * DRAGGABLE_BAR_GAP,
    DRAGGABLE_LINE_WIDTH,
    ai.minValue,
    ai.maxValue,
    (value: number) => ai.setHoleCountFactor(value),
    'Hole count factor',
    ai.holeCountFactor,
  );

  new Dragger(
    scene,
    DRAGGABLE_BAR_X,
    DRAGGABLE_BAR_Y + 3 * DRAGGABLE_BAR_GAP,
    DRAGGABLE_LINE_WIDTH,
    ai.minValue,
    ai.maxValue,
    (value: number) => ai.setMaxHeightFactor(value),
    'Max height factor',
    ai.maxHeightFactor,
  );
}