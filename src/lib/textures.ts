import * as Phaser from 'phaser';
import iImage from '../../assets/I.png'
import jImage from '../../assets/J.png'
import lImage from '../../assets/L.png'
import oImage from '../../assets/O.png'
import sImage from '../../assets/S.png'
import tImage from '../../assets/T.png'
import zImage from '../../assets/Z.png'
import borderImage from '../../assets/Border.png';
import blueImage from '../../assets/Blue.png';
import greenImage from '../../assets/Green.png';
import lightBlueImage from '../../assets/LightBlue.png';
import orangeImage from '../../assets/Orange.png';
import purpleImage from '../../assets/Purple.png';
import redImage from '../../assets/Red.png';
import yellowImage from '../../assets/Yellow.png';
import ghostBlockImage from '../../assets/GhostSingle.png';

export const I_TEXTURE = 'i';
export const J_TEXTURE = 'j';
export const L_TEXTURE = 'l';
export const O_TEXTURE = 'o';
export const S_TEXTURE = 's';
export const T_TEXTURE = 't';
export const Z_TEXTURE = 'z';

export const BORDER = 'border';

export const BLUE = 'blue';
export const GREEN = 'green';
export const LIGHT_BLUE = 'light_blue';
export const ORANGE = 'orange';
export const PURPLE = 'purple';
export const RED = 'red';
export const YELLOW = 'yellow';

export const GHOST_BLOCK = 'ghost_block';

export function preloadTextures(scene: Phaser.Scene): void {
  scene.load.image(I_TEXTURE, iImage);
  scene.load.image(J_TEXTURE, jImage);
  scene.load.image(L_TEXTURE, lImage);
  scene.load.image(O_TEXTURE, oImage);
  scene.load.image(S_TEXTURE, sImage);
  scene.load.image(T_TEXTURE, tImage);
  scene.load.image(Z_TEXTURE, zImage);

  scene.load.image(BORDER, borderImage);

  scene.load.image(BLUE, blueImage);
  scene.load.image(GREEN, greenImage);
  scene.load.image(LIGHT_BLUE, lightBlueImage);
  scene.load.image(ORANGE, orangeImage);
  scene.load.image(PURPLE, purpleImage);
  scene.load.image(RED, redImage);
  scene.load.image(YELLOW, yellowImage);

  scene.load.image(GHOST_BLOCK, ghostBlockImage);
}