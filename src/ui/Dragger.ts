import { DRAGGABLE_BAR_DEPTH } from "../lib/consts";
import { TetrisScene } from "../scene";

const barWidth = 20;
const barHeight = 30;

const lineHeight = 5;

const valueLabelYOff = 30;
const valueTextYOff = -20;
const labelXOff = -80;

const defaultFont = {
  fontFamily: 'Arial',
  fontSize: '14px',
  color: '#FFFFFF' // White color
};

/** Or slider, whatever you wanna call it. */
export default class Dragger {

  private draggableGraphics: Phaser.GameObjects.Graphics;
  private draggableContainer: Phaser.GameObjects.Container;
  private staticGraphics: Phaser.GameObjects.Graphics;
  private valueText: Phaser.GameObjects.Text;

  private value: number;
  private isDragging: boolean = false;

  constructor(
    scene: TetrisScene,
    private readonly x: number,
    private readonly y: number,
    private readonly width: number,
    private readonly minValue: number,
    private readonly maxValue: number,
    private readonly onChange: (value: number) => void,
    readonly label: string = '',
    private readonly startValue: number = 0,
  ) {
    this.value = this.startValue;

    this.draggableContainer = scene.add.container(x, y);

    this.draggableGraphics = scene.add.graphics();
    this.draggableGraphics.fillStyle(0x808080);
    this.draggableGraphics.fillRect(0, 0, barWidth, barHeight);

    this.draggableContainer.add(this.draggableGraphics);
    this.draggableContainer.setDepth(DRAGGABLE_BAR_DEPTH);
    this.draggableContainer.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, barWidth, barHeight),
      Phaser.Geom.Rectangle.Contains,
    );

    this.draggableContainer.x = this.valueToPosition(startValue) - barWidth / 2;

    this.staticGraphics = scene.add.graphics();
    this.staticGraphics.fillStyle(0xffffff);
    this.staticGraphics.fillRect(
      x,
      y + barHeight / 2 - lineHeight / 2,
      width,
      lineHeight,
    );

    const leftText = scene.add.text(
      x,
      y + valueLabelYOff,
      minValue.toString(),
      defaultFont,
    );
    leftText.x = leftText.x - leftText.width / 2;

    const rightText = scene.add.text(
      x + width,
      y + valueLabelYOff,
      maxValue.toString(),
      defaultFont,
    );
    rightText.x = rightText.x - rightText.width / 2;

    this.valueText = scene.add.text(
      x + width / 2,
      y + valueTextYOff,
      startValue.toString(),
      defaultFont,
    );
    this.valueText.x = this.valueText.x - this.valueText.width / 2;

    scene.add.text(x + labelXOff, y + valueTextYOff, label, defaultFont);

    scene.input.on('pointerdown', this.startDrag, this);
    scene.input.on('pointerup', this.stopDrag, this);
    scene.input.on('pointermove', this.handleDrag, this);
  }

  private startDrag(pointer: Phaser.Input.Pointer) {
    if (
      this.draggableContainer.input.hitArea.contains(
        pointer.x - this.draggableContainer.x,
        pointer.y - this.draggableContainer.y,
      )
    ) {
      this.isDragging = true;
    }

  }

  private stopDrag() {
    this.isDragging = false;
  }

  private handleDrag(pointer: Phaser.Input.Pointer) {
    if (this.isDragging) {
      const positionX = Phaser.Math.Clamp(
        pointer.x,
        this.x,
        this.x + this.width,
      );

      this.value = this.positionToValue(positionX);
      this.onChange(this.value);

      this.valueText.setText(this.value.toFixed(2));
      this.valueText.x = this.x + this.width / 2 - this.valueText.width / 2;

      this.draggableContainer.x = positionX - barWidth / 2;
    }
  }

  private positionToValue(position: number): number {
    const dragDistance = position - this.x;
    const valueSpan = this.maxValue - this.minValue;
    return dragDistance * valueSpan / this.width + this.minValue;
  }

  private valueToPosition(value: number): number {
    const valueSpan = this.maxValue - this.minValue;
    const dragDistance = (value - this.minValue) * this.width / valueSpan;
    return dragDistance + this.x;
  }
}
