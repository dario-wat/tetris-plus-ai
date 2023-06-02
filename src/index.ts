import * as Phaser from 'phaser';
import { MyScene } from './scene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: false,
    }
  },
  scene: new MyScene(),
};

let game = new Phaser.Game(config);

