import * as Phaser from 'phaser';

export default class KeyboardInput {

  public a: Phaser.Input.Keyboard.Key;
  public d: Phaser.Input.Keyboard.Key;
  public w: Phaser.Input.Keyboard.Key;
  public e: Phaser.Input.Keyboard.Key;
  public s: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene) {
    this.a = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.d = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.w = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.e = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.s = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  }
}