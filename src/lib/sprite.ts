import * as Phaser from 'phaser';

export class DynamicSprite
  extends Phaser.Physics.Arcade.Sprite
  implements Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {

  public body: Phaser.Physics.Arcade.Body;

}

export class StaticSprite
  extends Phaser.Physics.Arcade.Sprite
  implements Phaser.Types.Physics.Arcade.SpriteWithStaticBody {

  public body: Phaser.Physics.Arcade.StaticBody;

}

export class StaticTileSprite
  extends Phaser.GameObjects.TileSprite {

  public body: Phaser.Physics.Arcade.StaticBody;

}