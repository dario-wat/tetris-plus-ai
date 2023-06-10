import * as Phaser from 'phaser';
import { cx, cy, ox, oy } from './grid';

export function debugPoint(
  graphics: Phaser.GameObjects.Graphics,
  xCoord: number,
  yCoord: number,
): void {
  const pointSize = 4;
  const pointColor = 0xff0000;

  graphics.fillStyle(pointColor);
  graphics.fillCircle(cx(xCoord), cy(yCoord), pointSize);
}

export function debugPoints(
  scene: Phaser.GameObjects.Graphics,
  coords: [number, number][],
): void {
  for (const [xCoord, yCoord] of coords) {
    debugPoint(scene, xCoord, yCoord);
  }
}