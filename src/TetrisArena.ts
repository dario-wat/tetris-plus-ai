import { CELL_SIZE, TETRIS_HEIGHT, TETRIS_WIDTH } from "./consts";
import { ox, oy } from "./grid";
import { TetrisScene } from "./scene";
import { StaticTileSprite } from "./sprite";
import { BORDER } from "./textures";

const IMAGE_SIZE = 64; // Hardcoded (image size)
const SIZE = CELL_SIZE;
const SCALE = SIZE / IMAGE_SIZE;

export default class TetrisArena {

  private walls: Phaser.Physics.Arcade.StaticGroup

  constructor(scene: TetrisScene) {
    this.walls = scene.physics.add.staticGroup();
    this.walls.add(new TetrisArenaWall(
      scene,
      ox(-1),
      oy(-1),
      TETRIS_WIDTH + 2,
      false,
    ));
    this.walls.add(new TetrisArenaWall(
      scene,
      ox(-1),
      oy(TETRIS_HEIGHT),
      TETRIS_WIDTH + 2,
      false,
    ));
    this.walls.add(new TetrisArenaWall(
      scene,
      ox(-1),
      oy(-1),
      TETRIS_HEIGHT + 2,
      true,
    ));
    this.walls.add(new TetrisArenaWall(
      scene,
      ox(TETRIS_WIDTH),
      oy(-1),
      TETRIS_HEIGHT + 2,
      true,
    ));
  }
}

class TetrisArenaWall extends StaticTileSprite {

  constructor(
    scene: TetrisScene,
    x: number,  // Top left X
    y: number,  // Top left Y
    length: number,
    isVertical: boolean,
  ) {
    super(
      scene,
      x,
      y,
      isVertical ? SIZE : length * SIZE,
      isVertical ? length * SIZE : SIZE,
      BORDER,
    );

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.setTileScale(SCALE);

    this.setOrigin(0, 0);
    this.body.updateFromGameObject();
  }
}
