import { NEXT_TETROMINO_X, NEXT_TETROMINO_Y, SCALE } from "../lib/consts";
import { TetrisScene } from "../scene";
import { I_TEXTURE, J_TEXTURE, L_TEXTURE, O_TEXTURE, S_TEXTURE, T_TEXTURE, Z_TEXTURE } from '../lib/textures';

/** Shows what the next Tetromino is in the sequence. */
export default class NextTetromino extends Phaser.GameObjects.Sprite {

  constructor(scene: TetrisScene) {
    super(scene, NEXT_TETROMINO_X, NEXT_TETROMINO_Y, I_TEXTURE)
    scene.add.existing(this);

    const nextText = scene.add.text(
      NEXT_TETROMINO_X,
      NEXT_TETROMINO_Y - 60,
      'Next',
      {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#FFFFFF' // White color
      }
    );
    nextText.setOrigin(0.5);

    this.setScale(SCALE);

    this.scene.events.on('update', () => {
      const next = this.getNextTetrominoTexture(scene.tetrominoGenerator.next);
      this.setRotation(0);
      if (next === I_TEXTURE) {
        this.setRotation(Math.PI / 2);
      }
      this.setTexture(next);
    });
  }

  // TODO replace with enum
  private getNextTetrominoTexture(nextIndex: number): string {
    switch (nextIndex) {
      case 0:
        return I_TEXTURE;
      case 1:
        return J_TEXTURE;
      case 2:
        return L_TEXTURE;
      case 3:
        return O_TEXTURE;
      case 4:
        return S_TEXTURE;
      case 5:
        return T_TEXTURE;
      case 6:
        return Z_TEXTURE;
    }
  }
}