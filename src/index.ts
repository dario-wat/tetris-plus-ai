import * as Phaser from 'phaser';
import { TetrisScene } from './scene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 1000 },
      debug: false,
    }
  },
  scene: new TetrisScene(),
};

let game = new Phaser.Game(config);

