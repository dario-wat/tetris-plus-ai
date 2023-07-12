import * as Phaser from 'phaser';
import TetrisArena from './game_objects/TetrisArena';
import { Tetromino } from './game_objects/Tetromino';
import { debugPoint, debugPoints } from './lib/debug';
import KeyboardInput from './lib/keyboard_input';
import TetrominoGenerator from './game_logic/TetrominoGenerator';
import { preloadTextures } from './lib/textures';
import TetrisState from './game_logic/TetrisState';
import GameOverButton from './game_objects/GameOverButton';
import NextTetromino from './game_objects/NextTetromino';
import { DEBUG_GRAPHICS_DEPTH } from './lib/consts';

// TODO show where the tetromino will drop
// TODO score & speed
// TODO finish ghost tetromino
// TODO heuristic
// To clean up:
// - NextTetromino
// - Tetromino
// - TetrisState
// TODO add config

const DELAY_MS = 400;

export class TetrisScene extends Phaser.Scene {

  private keys: KeyboardInput;
  private debugGraphics: Phaser.GameObjects.Graphics;

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
    // TODO fix game over button visibility
    // this.gameOverButton.setVisible(this.gameOver);
    // debugPoint(this.debugGraphics, this.tetromino.getCenterPoint());
    this.tetrisState.debugHeuristic();
  }
}