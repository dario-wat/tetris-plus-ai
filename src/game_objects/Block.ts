/** Type containing block for game logic. */
export default class Block {

  constructor(
    public xCoord: number,
    public yCoord: number,
    public readonly texture: string,
  ) { }

  public copy(): Block {
    return new Block(this.xCoord, this.yCoord, this.texture);
  }
}
