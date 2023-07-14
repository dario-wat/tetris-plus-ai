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

// Depth for various UI components. Depth is the z component
export const DEBUG_GRAPHICS_DEPTH = 10;
export const GAME_OVER_BUTTON_DEPTH = 1;

// Events
export const ON_GAME_OVER_BUTTON_CLICK_EVENT = 'onGameOverButtonClick';
export const GAME_OVER_EVENT = 'gameOver';
export const NEXT_TETROMINO_UPDATED_EVENT = 'nextTetrominoUpdated';
export const HEURISTIC_TEXT_UPDATED_EVENT = 'heuristicTextUpdated';
export const DEBUG_GRAPHICS_TETROMINO_CENTER_EVENT = 'debugGraphicsTetrominoCenter';

// Config
export const DEBUG_GRAPHICS_ENABLED = false;