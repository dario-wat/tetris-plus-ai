import * as Phaser from 'phaser';
import iImage from '../../assets/I.png'
import jImage from '../../assets/J.png'
import lImage from '../../assets/L.png'
import oImage from '../../assets/O.png'
import sImage from '../../assets/S.png'
import tImage from '../../assets/T.png'
import zImage from '../../assets/Z.png'
import borderImage from '../../assets/Border.png';

export const I_TEXTURE = 'i';
export const J_TEXTURE = 'j';
export const L_TEXTURE = 'l';
export const O_TEXTURE = 'o';
export const S_TEXTURE = 's';
export const T_TEXTURE = 't';
export const Z_TEXTURE = 'z';

export const BORDER = 'border';

export function preloadTextures(scene: Phaser.Scene): void {
  scene.load.image(I_TEXTURE, iImage);
  scene.load.image(J_TEXTURE, jImage);
  scene.load.image(L_TEXTURE, lImage);
  scene.load.image(O_TEXTURE, oImage);
  scene.load.image(S_TEXTURE, sImage);
  scene.load.image(T_TEXTURE, tImage);
  scene.load.image(Z_TEXTURE, zImage);

  scene.load.image(BORDER, borderImage);
}