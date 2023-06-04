import { CELL_SIZE, X_ORIGIN, Y_ORIGIN } from "./consts";

/* 
  Level builder is built as a grid of cells. We use the following
  functions to convert between cell coordinates and pixel coordinates.
  
  ox and oy convert the grid coordinates into top left pixel coordinates.
  cx and cy convert the grid coordiantes into center pixel coordinates.
  
  cx and cy additionally take a size parameter, which is the number of
  cells the object spans. This is used to calculate the center of the
  object.
*/

export function ox(x: number): number {
  return X_ORIGIN + x * CELL_SIZE;
}

export function oy(y: number): number {
  return Y_ORIGIN + y * CELL_SIZE;
}

export function cx(x: number, size: number = 1): number {
  return ox(x) + CELL_SIZE * size / 2;
}

export function cy(y: number, size: number = 1): number {
  return oy(y) + CELL_SIZE * size / 2;
}