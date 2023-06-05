import * as Phaser from 'phaser';
import TetrisArena from './game_objects/TetrisArena';
import { L, O, Tetromino } from './game_objects/Tetromino';
import KeyboardInput from './lib/keyboard_input';
import { preloadTextures } from './lib/textures';

export class TetrisScene extends Phaser.Scene {

  private keys: KeyboardInput;

  private tetr: Tetromino;
  private c: number = 0;

  constructor() {
    super({ key: 'TetrisScene' })
  }

  preload(): void {
    preloadTextures(this);
  }

  create(): void {
    this.keys = new KeyboardInput(this);
    // Create the ball sprite at the center of the screen
    // const ball = this.physics.add.sprite(400, 300, 'o');
    const g = this.add.group();
    const arena = new TetrisArena(this);
    this.tetr = new L(this, 100, 100)

    this.keys.d.on('down', () => {
      this.tetr.rotate();
    });
  }


  update(): void {
    this.c++;
    // Empty for now
    if (this.c >= 40) {
      this.tetr.drop();
      this.c = 0;
    }

    // this.tetr.update
  }
}