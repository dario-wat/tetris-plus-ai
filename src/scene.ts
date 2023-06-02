import * as Phaser from 'phaser';
import ballImage from '../assets/ball.png'

export class MyScene extends Phaser.Scene {

  constructor() {
    super({ key: 'MyScene' })
  }

  preload(): void {
    this.load.image('ball', ballImage);
  }

  create(): void {
    // Create the ball sprite at the center of the screen
    const ball = this.physics.add.sprite(400, 300, 'ball');
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