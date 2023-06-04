import * as Phaser from 'phaser';
import TetrisArena from './game_objects/TetrisArena';
import { O } from './game_objects/Tetromino';
import { preloadTextures } from './lib/textures';

export class TetrisScene extends Phaser.Scene {

  constructor() {
    super({ key: 'TetrisScene' })
  }

  preload(): void {
    preloadTextures(this);
  }

  create(): void {
    // Create the ball sprite at the center of the screen
    // const ball = this.physics.add.sprite(400, 300, 'o');
    const g = this.add.group();
    const arena = new TetrisArena(this);
    const ball = new O(this, 400, 300)
  }


  update(): void {
    // Empty for now
  }
}