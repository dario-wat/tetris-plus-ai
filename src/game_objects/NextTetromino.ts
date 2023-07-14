import { NEXT_TETROMINO_UPDATED, NEXT_TETROMINO_X, NEXT_TETROMINO_Y, SCALE } from "../lib/consts";
import { TetrisScene } from "../scene";
import { I_TEXTURE, J_TEXTURE, L_TEXTURE, O_TEXTURE, S_TEXTURE, T_TEXTURE, Z_TEXTURE } from '../lib/textures';
import { TetrominoEnum } from "../lib/tetromino_enum";

const NEXT_TETROMINO_TEXT_Y_OFFSET = -60;

/** 
 * Shows what the next Tetromino is in the sequence. 
 * This is not a real tetromino component, but just a texture.
 */
export default class NextTetromino extends Phaser.GameObjects.Sprite {

  constructor(scene: TetrisScene) {
    super(scene, NEXT_TETROMINO_X, NEXT_TETROMINO_Y, I_TEXTURE)
    scene.add.existing(this);

    const nextText = scene.add.text(
      NEXT_TETROMINO_X,
      NEXT_TETROMINO_Y + NEXT_TETROMINO_TEXT_Y_OFFSET,
      'Next',
      {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#FFFFFF' // White color
      }
    );
    nextText.setOrigin(0.5);

    this.setScale(SCALE);

    this.scene.events.on(
      NEXT_TETROMINO_UPDATED,
      (nextTetromino: TetrominoEnum) => {
        const next = this.getNextTetrominoTexture(nextTetromino);
        this.setRotation(0);
        if (next === I_TEXTURE) {
          this.setRotation(Math.PI / 2);
        }
        this.setTexture(next);
      }
    );
  }

  private getNextTetrominoTexture(nextIndex: TetrominoEnum): string {
    switch (nextIndex) {
      case TetrominoEnum.I:
        return I_TEXTURE;
      case TetrominoEnum.J:
        return J_TEXTURE;
      case TetrominoEnum.L:
        return L_TEXTURE;
      case TetrominoEnum.O:
        return O_TEXTURE;
      case TetrominoEnum.S:
        return S_TEXTURE;
      case TetrominoEnum.T:
        return T_TEXTURE;
      case TetrominoEnum.Z:
        return Z_TEXTURE;
    }
  }
}