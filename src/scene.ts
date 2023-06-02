import * as Phaser from 'phaser';
import { O } from './tetrominoes/Tetromino';
import { preloadTextures } from './textures';

export class TetrisScene extends Phaser.Scene {

  constructor() {
    super({ key: 'MyScene' })
  }

  preload(): void {
    preloadTextures(this);
  }

  create(): void {
    // Create the ball sprite at the center of the screen
    // const ball = this.physics.add.sprite(400, 300, 'o');
    const ball = new O(this, 400, 300)
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);

    // Set initial velocity for the ball
    ball.setVelocity(200, 200);
    ball.setGravityY(300);
  }


  update(): void {
    // Empty for now
  }
}