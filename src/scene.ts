import * as Phaser from 'phaser';
import TetrisArena from './game_objects/TetrisArena';
import KeyboardInput from './lib/keyboard_input';
import { preloadTextures } from './lib/textures';
import TetrisState from './game_logic/TetrisState';
import NextTetromino from './game_objects/NextTetromino';
import { DEBUG_GRAPHICS_DEPTH, DEBUG_TEXT_FONT_SIZE, DEBUG_TEXT_X, DEBUG_TEXT_Y } from './lib/consts';
import GameOverButton from './game_objects/GameOverButton';
import Text from './game_objects/Text';

// TODO show where the tetromino will drop (ghost tetromino)
// TODO score & speed
// TODO heuristic
// TODO add config
// TODO remove scene from non objects

const DELAY_MS = 400;

export class TetrisScene extends Phaser.Scene {

  private keys: KeyboardInput;
  private debugGraphics: Phaser.GameObjects.Graphics;

  // TODO should be private
  public tetrisState: TetrisState;

  constructor() {
    super({ key: 'TetrisScene' })
  }

  preload(): void {
    preloadTextures(this);
  }

  create(): void {
    this.keys = new KeyboardInput(this);
    this.debugGraphics = this.add.graphics();
    this.debugGraphics.depth = DEBUG_GRAPHICS_DEPTH;

    this.tetrisState = new TetrisState(this);
    new TetrisArena(this);
    new NextTetromino(this);
    new GameOverButton(this);
    new Text(this, DEBUG_TEXT_X, DEBUG_TEXT_Y, DEBUG_TEXT_FONT_SIZE);

    this.keys.w.on('down', () => {
      this.tetrisState.tetrominoRotate();
    });
    this.keys.d.on('down', () => {
      this.tetrisState.tetrominoMoveRight();
    });
    this.keys.a.on('down', () => {
      this.tetrisState.tetrominoMoveLeft();
    });
    this.keys.s.on('down', () => {
      this.tetrisState.tetrominoDrop();
    });
    this.keys.space.on('down', () => {
      this.tetrisState.tetrominoTotalDrop();
    });

    this.time.addEvent({
      delay: DELAY_MS,
      callback: this.makeStep,
      callbackScope: this,
      loop: true,
    });
  }

  makeStep(): void {
    this.tetrisState.makeStep();
  }

  update(): void {
    this.debugGraphics.clear();
    // debugPoint(this.debugGraphics, this.tetromino.getCenterPoint());
  }
}