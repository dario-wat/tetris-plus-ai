import { DRAGGABLE_BAR_DEPTH } from "../lib/consts";
import { TetrisScene } from "../scene";

const BAR_WIDTH = 20;   // Width of the draggable bar
const BAR_HEIGHT = 30;  // Height of the draggable bar

const LINE_HEIGHT = 5;  // Height of the line under the bar

const VALUE_LABEL_OFFSET_Y = 30;
const VALUE_TEXT_OFFSET_Y = -20;
const LABEL_OFFSET_X = -80;

const FONT = {
  fontFamily: 'Arial',
  fontSize: '14px',
  color: '#FFFFFF' // White color
};

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
    private readonly label: string = '',
    private readonly startValue: number = 0,
  ) {
    this.value = this.startValue;

    this.draggableContainer = scene.add.container(x, y);

    this.draggableGraphics = scene.add.graphics();
    this.draggableGraphics.fillStyle(0x808080);
    this.draggableGraphics.fillRect(0, 0, BAR_WIDTH, BAR_HEIGHT);

    this.draggableContainer.add(this.draggableGraphics);
    this.draggableContainer.setDepth(DRAGGABLE_BAR_DEPTH);
    this.draggableContainer.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, BAR_WIDTH, BAR_HEIGHT),
      Phaser.Geom.Rectangle.Contains,
    );

    this.draggableContainer.x = this.valueToPosition(startValue) - BAR_WIDTH / 2;

    this.staticGraphics = scene.add.graphics();
    this.staticGraphics.fillStyle(0xffffff);
    this.staticGraphics.fillRect(
      x,
      y + BAR_HEIGHT / 2 - LINE_HEIGHT / 2,
      width,
      LINE_HEIGHT,
    );

    const leftText = scene.add.text(
      x,
      y + VALUE_LABEL_OFFSET_Y,
      minValue.toString(),
      FONT,
    );
    leftText.x = leftText.x - leftText.width / 2;

    const rightText = scene.add.text(
      x + width,
      y + VALUE_LABEL_OFFSET_Y,
      maxValue.toString(),
      FONT,
    );
    rightText.x = rightText.x - rightText.width / 2;

    this.valueText = scene.add.text(
      x + width / 2,
      y + VALUE_TEXT_OFFSET_Y,
      startValue.toString(),
      FONT,
    );
    this.valueText.x = this.valueText.x - this.valueText.width / 2;

    scene.add.text(x + LABEL_OFFSET_X, y + VALUE_TEXT_OFFSET_Y, label, FONT);

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

      this.draggableContainer.x = positionX - BAR_WIDTH / 2;
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
