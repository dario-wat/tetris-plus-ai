export const CELL_SIZE = 24;

export const TETRIS_WIDTH = 10;
export const TETRIS_HEIGHT = 20;

export const X_ORIGIN = 400;
export const Y_ORIGIN = 100;

const IMAGE_SIZE = 64; // Hardcoded (image size)
export const SCALE = CELL_SIZE / IMAGE_SIZE;

// Position of the next tetromino
export const NEXT_TETROMINO_X = 800;
export const NEXT_TETROMINO_Y = 200;

// Position of the heuristic debug text
export const DEBUG_TEXT_X = 700;
export const DEBUG_TEXT_Y = 300;
export const DEBUG_TEXT_FONT_SIZE = 14;

// Position of the draggable bars
export const DRAGGABLE_BAR_X = 100;
export const DRAGGABLE_BAR_Y = 150;
export const DRAGGABLE_BAR_GAP = 80;

// AI toggle position
export const AI_TOGGLE_X = 150;
export const AI_TOGGLE_Y = 60;

// Depth for various UI components. Depth is the z component
export const DEBUG_GRAPHICS_DEPTH = 10;
export const GAME_OVER_BUTTON_DEPTH = 1;
export const DRAGGABLE_BAR_DEPTH = 1;

// Config
export const DEBUG_GRAPHICS_ENABLED = false;