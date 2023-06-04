import { CELL_SIZE, SCALE, TETRIS_HEIGHT, TETRIS_WIDTH } from "../lib/consts";
import { ox, oy } from "../lib/grid";
import { TetrisScene } from "../scene";
import { StaticTileSprite } from "../lib/sprite";
import { BORDER } from "../lib/textures";

export default class TetrisArena {

  private walls: Phaser.GameObjects.TileSprite[];

  constructor(scene: TetrisScene) {
    this.walls = [];
    this.walls.push(new TetrisArenaWall(
      scene,
      ox(-1),
      oy(-1),
      TETRIS_WIDTH + 2,
      false,
    ));
    this.walls.push(new TetrisArenaWall(
      scene,
      ox(-1),
      oy(TETRIS_HEIGHT),
      TETRIS_WIDTH + 2,
      false,
    ));
    this.walls.push(new TetrisArenaWall(
      scene,
      ox(-1),
      oy(-1),
      TETRIS_HEIGHT + 2,
      true,
    ));
    this.walls.push(new TetrisArenaWall(
      scene,
      ox(TETRIS_WIDTH),
      oy(-1),
      TETRIS_HEIGHT + 2,
      true,
    ));
  }
}

class TetrisArenaWall extends Phaser.GameObjects.TileSprite {

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
      isVertical ? CELL_SIZE : length * CELL_SIZE,
      isVertical ? length * CELL_SIZE : CELL_SIZE,
      BORDER,
    );

    scene.add.existing(this);

    this.setTileScale(SCALE);
    this.setOrigin(0, 0);
  }
}
