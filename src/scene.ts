import * as Phaser from 'phaser';
import TetrisArena from './ui/TetrisArena';
import KeyboardInput from './lib/keyboard_input';
import { preloadTextures } from './lib/textures';
import TetrisState from './game_logic/TetrisState';
import NextTetromino from './ui/NextTetromino';
import { DEBUG_GRAPHICS_ENABLED, DEBUG_TEXT_X, DEBUG_TEXT_Y } from './lib/consts';
import GameOverButton from './ui/GameOverButton';
import Text from './ui/Text';
import DebugGraphics from './ui/DebugGraphics';
import BlockSprite from './ui/BlockSprite';
import TetrominoSprite from './ui/TetrominoSprite';

// TODO make ai solver
// TODO show where the tetromino will drop (ghost tetromino)
// TODO score & speed
// TODO remove scene from non objects
// TODO IMPORTANT separate logic classes from rendering classes (tetromino and blocks)
// TODO memory leak in best move
// TODO maybe use events for blocks
// TODO drop position should have only column and rotation
// TODO use only x y objects instead of tuples

const DELAY_MS = 400;

export class TetrisScene extends Phaser.Scene {

  private keys: KeyboardInput;

  private tetrisState: TetrisState;

  private blocks: BlockSprite[] = [];
  private tetromino: TetrominoSprite = undefined;

  private nextTetromino: NextTetromino;
  private debugText: Text;
  private gameOverButton: GameOverButton;
  private debugGraphics: DebugGraphics | null = null;

  constructor() {
    super({ key: 'TetrisScene' })
  }

  preload(): void {
    preloadTextures(this);
  }

  create(): void {
    this.keys = new KeyboardInput(this);

    this.tetrisState = new TetrisState();

    new TetrisArena(this);


    this.gameOverButton = new GameOverButton(this, () => this.tetrisState.reset());


    this.debugText = new Text(
      this,
      DEBUG_TEXT_X,
      DEBUG_TEXT_Y,
      {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#FFFFFF' // White color
      },
    );


    if (DEBUG_GRAPHICS_ENABLED) {
      this.debugGraphics = new DebugGraphics(this);
    }


    this.nextTetromino = new NextTetromino(this);


    this.keys.w.on('down', () => {
      this.tetrisState.tetrominoRotate();
    });
    this.keys.d.on('down', () => {
      this.tetrisState.tetrominoMoveRight();
    });
    this.keys.a.on('down', () => {
      this.tetrisState.tetrominoMoveLeft();
    });
    this.keys.s.on('down', () => {
      this.tetrisState.tetrominoDrop();
    });
    this.keys.space.on('down', () => {
      this.tetrisState.tetrominoTotalDrop();
    });

    this.time.addEvent({
      delay: DELAY_MS,
      callback: this.makeStep,
      callbackScope: this,
      loop: true,
    });
  }

  makeStep(): void {
    this.tetrisState.makeStep();
  }

  update(): void {


    // TODO extract to some system
    this.blocks.forEach(block => block.destroy());
    this.blocks = [];
    this.blocks = this.tetrisState.blocks.map(block =>
      new BlockSprite(this, block.xCoord, block.yCoord, block.texture)
    );



    // TODO extract
    if (this.tetrisState.tetromino) {
      this.tetromino?.destroy();
      this.tetromino = new TetrominoSprite(
        this,
        this.tetrisState.tetromino.xCoord,
        this.tetrisState.tetromino.yCoord,
        this.tetrisState.tetromino.getWidth(),
        this.tetrisState.tetromino.getHeight(),
        this.tetrisState.tetromino.currRotation,
        this.tetrisState.tetromino.texture,
      );
    }

    // TODO extract
    this.nextTetromino.setNext(this.tetrisState.tetrominoGenerator.next());


    this.debugText.setText(this.tetrisState.getHeuristicText());

    this.gameOverButton.setVisible(this.tetrisState.gameOver);

    if (this.debugGraphics) {
      this.debugGraphics.tetrominoPoint = this.tetrisState.tetromino?.getCenterPoint();
    }
  }
}