import * as Phaser from "phaser";
import { TetrisScene } from "../scene";
import { CELL_SIZE, TETRIS_HEIGHT, TETRIS_WIDTH, X_ORIGIN, Y_ORIGIN } from "../lib/consts";

const buttonWidth = 200;
const buttonHeight = 50;
const cornerRadius = 10;
const defaultColor = 0x000000; // Black
const hoverColor = 0x888888; // Gray
const borderWidth = 2;
const borderColor = 0xFFFFFF; // White

export default class GameOverButton {

  private buttonGraphics: Phaser.GameObjects.Graphics;

  constructor(scene: TetrisScene) {
    this.buttonGraphics = scene.add.graphics();

    this.drawButton(defaultColor);
    this.buttonGraphics.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, buttonWidth, buttonHeight),
      Phaser.Geom.Rectangle.Contains,
    );

    this.buttonGraphics.on('pointerover', () => {
      this.buttonGraphics.clear();
      this.drawButton(hoverColor);
    });

    this.buttonGraphics.on('pointerout', () => {
      this.buttonGraphics.clear();
      this.drawButton(defaultColor);
    });

    const buttonText = scene.add.text(
      buttonWidth / 2,
      buttonHeight / 2,
      'Game Over',
      {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#FFFFFF'
      },
    );
    buttonText.setOrigin(0.5);

    const x = X_ORIGIN + TETRIS_WIDTH * CELL_SIZE / 2 - buttonWidth / 2;
    const y = Y_ORIGIN + TETRIS_HEIGHT * CELL_SIZE / 2 - buttonHeight / 2;
    scene.add.container(x, y, [this.buttonGraphics, buttonText]);
  }

  private drawButton(fillColor: number): void {
    this.buttonGraphics.lineStyle(borderWidth, borderColor);
    this.buttonGraphics.fillStyle(fillColor);
    this.buttonGraphics.fillRoundedRect(
      0,
      0,
      buttonWidth,
      buttonHeight,
      cornerRadius,
    );
    this.buttonGraphics.strokeRoundedRect(
      borderWidth,
      borderWidth,
      buttonWidth - borderWidth * 2,
      buttonHeight - borderWidth * 2,
      cornerRadius,
    );
  }
}