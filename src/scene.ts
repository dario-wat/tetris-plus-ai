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

  public tetrominoGenerator: TetrominoGenerator;
  public tetrisState: TetrisState;

  private tetromino: Tetromino;
  private gameOverButton: GameOverButton;
  private gameOver: boolean = false;

  constructor() {
    super({ key: 'TetrisScene' })
  }

  preload(): void {
    preloadTextures(this);
  }

  create(): void {
    this.keys = new KeyboardInput(this);
    this.debugGraphics = this.add.graphics();
    this.debugGraphics.depth = 10;

    this.tetrisState = new TetrisState(this);
    new TetrisArena(this);
    this.tetrominoGenerator = new TetrominoGenerator(this);
    this.tetromino = this.tetrominoGenerator.create();
    new NextTetromino(this);
    this.gameOverButton = new GameOverButton(this, () => {
      this.tetrominoGenerator.reset();
      this.tetrisState.reset();
      this.gameOver = false;
      this.tetromino.destroy();
      this.createNewTetromino();
    });

    this.keys.w.on('down', () => {
      if (!this.gameOver) {
        this.tetromino.rotate();
      }
    });
    this.keys.d.on('down', () => {
      if (!this.gameOver) {
        this.tetromino.moveRight();
      }
    });
    this.keys.a.on('down', () => {
      if (!this.gameOver) {
        this.tetromino.moveLeft();
      }
    });
    this.keys.s.on('down', () => {
      if (!this.gameOver && this.tetromino.scene) {
        this.tetromino.drop();
      }
    });
    this.keys.space.on('down', () => {
      if (!this.gameOver && this.tetromino.scene) {
        this.tetromino.totalDrop();
        this.createNewTetromino();
      }
    });

    this.time.addEvent({
      delay: DELAY_MS,
      callback: this.makeStep,
      callbackScope: this,
      loop: true,
    });
  }

  // This is not ideal since it's used in many places and ideally it should
  // be used in only one place. But it works
  private createNewTetromino(): void {
    if (!this.tetromino.scene) {
      this.tetromino = this.tetrominoGenerator.create();

      // Game Over logic
      if (this.tetrisState.isOverlapping(this.tetromino)) {
        this.gameOver = true;
      }
    }
  }

  makeStep(): void {
    if (this.gameOver) {
      return;
    }

    this.tetromino.drop();
    this.tetrisState.crush();
    this.createNewTetromino();
  }

  update(): void {
    this.debugGraphics.clear();
    this.gameOverButton.setVisible(this.gameOver);
    debugPoint(this.debugGraphics, this.tetromino.getCenterPoint());
    this.tetrisState.debugHeuristic();
  }
}