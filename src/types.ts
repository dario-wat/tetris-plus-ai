export type Coord = [number, number];

/** 
 * Position where the tetromino can drop. Only needs x coordinate and
 * the rotation index because the y coordinate is always 0 (or whatever
 * is the current height of the tetromino).
 */
export type DropPosition = {
  xCoord: number,
  rotation: number,
};