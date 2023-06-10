import * as Phaser from 'phaser';
import TetrisArena from './game_objects/TetrisArena';
import { I, J, L, O, S, T, Tetromino, Z } from './game_objects/Tetromino';
import { debugPoint, debugPoints } from './lib/debug';
import KeyboardInput from './lib/keyboard_input';
import { preloadTextures } from './lib/textures';

export class TetrisScene extends Phaser.Scene {

  private keys: KeyboardInput;
  private debugGraphics: Phaser.GameObjects.Graphics;

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
    this.debugGraphics = this.add.graphics();
    this.debugGraphics.depth = 1;


    // debugPoint(this, 1, 1);
    // Create the ball sprite at the center of the screen
    // const ball = this.physics.add.sprite(400, 300, 'o');
    const g = this.add.group();
    const arena = new TetrisArena(this);
    this.tetr = new T(this, 100, 100)



    this.keys.e.on('down', () => {
      this.tetr.rotate();
    });

    this.keys.d.on('down', () => {
      this.tetr.moveRight();
    });
    this.keys.a.on('down', () => {
      this.tetr.moveLeft();
    });
  }


  update(): void {
    this.debugGraphics.clear();
    this.c++;
    // Empty for now
    if (this.c >= 40) {
      this.tetr.drop();
      this.c = 0;
    }
    // debugPoints(this.debugGraphics, this.tetr.getAllCoords());

    // this.tetr.update
  }
}