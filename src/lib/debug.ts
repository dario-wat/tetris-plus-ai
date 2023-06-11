import * as Phaser from 'phaser';
import { cx, cy, ox, oy } from './grid';

export function debugPoint(
  graphics: Phaser.GameObjects.Graphics,
  point: [number, number],
): void {
  const pointSize = 4;
  const pointColor = 0xff0000;

  graphics.fillStyle(pointColor);
  graphics.fillCircle(cx(point[0]), cy(point[1]), pointSize);
}

export function debugPoints(
  scene: Phaser.GameObjects.Graphics,
  coords: [number, number][],
): void {
  for (const coord of coords) {
    debugPoint(scene, coord);
  }
}