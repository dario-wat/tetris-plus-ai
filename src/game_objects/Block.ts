/** Type containing block for game logic. */
export default class Block {

  constructor(
    public xCoord: number,
    public yCoord: number,
    public readonly texture: string,
  ) { }
}
