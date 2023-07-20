import { TetrisScene } from "../scene";

const toggleWidth = 60;
const toggleHeight = 30;
const togglePadding = 3;

const toggleInactiveColor = 0xff0000;
const toggleActiveColor = 0x008000;
const toggleBackgroundColor = 0xb0b0b0;

const textGap = 10;
const textYOff = 2;

const defaultFont = {
  fontFamily: 'Arial',
  fontSize: '14px',
  color: '#FFFFFF' // White color
};

/** Switch, on or off. */
export default class Toggle {

  private graphics: Phaser.GameObjects.Graphics;

  private isToggleActive: boolean = false;

  constructor(
    scene: TetrisScene,
    private readonly x: number,
    private readonly y: number,
    private readonly onChange: (value: boolean) => void,
    readonly label: string = '',
  ) {
    this.graphics = scene.add.graphics();

    this.updateToggleColor();

    this.graphics.setInteractive(
      new Phaser.Geom.Rectangle(x, y, toggleWidth, toggleHeight),
      Phaser.Geom.Rectangle.Contains,
    );

    const text = scene.add.text(
      x, y, label, defaultFont
    );
    text.x -= text.width + textGap;
    text.y += toggleHeight / 2 - text.height / 2 - textYOff;

    this.graphics.on('pointerdown', () => this.toggle());
  }

  private updateToggleColor(): void {
    this.graphics.fillStyle(toggleBackgroundColor);
    this.graphics.fillRect(this.x, this.y, toggleWidth, toggleHeight);

    const color = this.isToggleActive ? toggleActiveColor : toggleInactiveColor;
    const xOff = this.isToggleActive ? toggleWidth / 2 : 0;
    this.graphics.fillStyle(color);
    this.graphics.fillRect(
      this.x + xOff + togglePadding,
      this.y + togglePadding,
      toggleWidth / 2 - 2 * togglePadding,
      toggleHeight - 2 * togglePadding,
    );
  }

  private toggle(): void {
    this.isToggleActive = !this.isToggleActive;
    this.onChange(this.isToggleActive);
    this.updateToggleColor();
  }
}