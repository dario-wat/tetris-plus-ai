import * as Phaser from 'phaser';
import TetrisArena from './game_objects/TetrisArena';
import { Tetromino } from './game_objects/Tetromino';
import { debugPoint, debugPoints } from './lib/debug';
import KeyboardInput from './lib/keyboard_input';
import TetrominoGenerator from './game_logic/TetrominoGenerator';
import { preloadTextures } from './lib/textures';
import BlockHandler from './game_logic/BlockHandler';
import GameOverButton from './game_objects/GameOverButton';

// TODO show where the tetromino will drop
// TODO show next tetromino

export class TetrisScene extends Phaser.Scene {

  private keys: KeyboardInput;
  private debugGraphics: Phaser.GameObjects.Graphics;

  private tetrominoGenerator: TetrominoGenerator;
  public blockHandler: BlockHandler;

  private tetromino: Tetromino;
  private c: number = 0;    // TODO replace this and add speed
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

    this.blockHandler = new BlockHandler(this);
    new TetrisArena(this);
    this.tetrominoGenerator = new TetrominoGenerator(this);
    this.tetromino = this.tetrominoGenerator.create();
    this.gameOverButton = new GameOverButton(this, () => {
      this.tetrominoGenerator.reset();
      this.blockHandler.reset();
      this.gameOver = false;
      this.tetromino.destroy();
    });

    this.keys.e.on('down', () => {
      this.tetromino.rotate();
    });
    this.keys.d.on('down', () => {
      this.tetromino.moveRight();
    });
    this.keys.a.on('down', () => {
      this.tetromino.moveLeft();
    });
    this.keys.s.on('down', () => {
      this.tetromino.drop();
    });
    this.keys.space.on('down', () => {
      this.tetromino.totalDrop();
    });
  }


  update(): void {
    this.debugGraphics.clear();
    this.gameOverButton.setVisible(this.gameOver);
    if (!this.tetromino.scene) {
      this.tetromino = this.tetrominoGenerator.create();

      if (this.blockHandler.isOverlapping(this.tetromino)) {
        console.log('what')
        this.gameOver = true;
      }
    }


    if (!this.gameOver) {
      this.c++;
      // Empty for now
      if (this.c >= 40) {
        this.tetromino.drop();
        this.blockHandler.crush();  // TODO do this better with repeating function
        // TODO better crushing logic, more seamless
        this.c = 0;
      }
      // debugPoints(this.debugGraphics, this.tetr.getAllCoords());
      debugPoint(this.debugGraphics, this.tetromino.getCenterPoint());
    }
  }
}