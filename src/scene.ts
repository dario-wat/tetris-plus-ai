import * as Phaser from 'phaser';
import TetrisArena from './ui/TetrisArena';
import KeyboardInput from './lib/keyboard_input';
import { preloadTextures } from './lib/textures';
import TetrisState from './game_logic/TetrisState';
import NextTetromino from './ui/NextTetromino';
import { DEBUG_GRAPHICS_ENABLED, DEBUG_TEXT_X, DEBUG_TEXT_Y, DRAGGABLE_BAR_X, DRAGGABLE_BAR_Y, DRAGGABLE_BAR_GAP, DRAGGABLE_LINE_WIDTH } from './lib/consts';
import GameOverButton from './ui/GameOverButton';
import Text from './ui/Text';
import DebugGraphics from './ui/DebugGraphics';
import BlockSprite from './ui/BlockSprite';
import TetrominoSprite from './ui/TetrominoSprite';
import AI from './game_logic/AI';
import Dragger from './ui/Dragger';
import Toggle from './ui/Toggle';
import { addAiControls } from './ui/complex';

// TODO show where the tetromino will drop (ghost tetromino)
// TODO score & speed
// TODO make moves manually with AI
// TODO ai speed
// TODO switch between AI and human
// TODO scan depth 2+, dragger for that
// TODO genetic algo to figure out best params, maybe sum heights at the end
// TODO stats for the number of tetrominoes and rows crushed
// TODO remove reset and replace it with new tetris state

const DELAY_MS = 100;

export class TetrisScene extends Phaser.Scene {

  private keys: KeyboardInput;

  private tetrisState: TetrisState;

  private blocks: BlockSprite[] = [];
  private tetromino: TetrominoSprite = undefined;

  private ai: AI;

  private nextTetromino: NextTetromino;
  private debugText: Text;
  private statsText: Text;
  private gameOverButton: GameOverButton;
  private debugGraphics: DebugGraphics | null = null;

  constructor() {
    super({ key: 'TetrisScene' })
  }

  preload(): void {
    preloadTextures(this);
  }

  create(): void {
    // new Toggle(this, 100, 600, 'Govno')

    this.keys = new KeyboardInput(this);

    this.tetrisState = new TetrisState();

    this.ai = new AI(this.tetrisState);

    addAiControls(this, this.ai);

    new TetrisArena(this);


    this.gameOverButton = new GameOverButton(this, () => this.tetrisState.reset());


    this.debugText = new Text(
      this,
      DEBUG_TEXT_X,
      DEBUG_TEXT_Y,
    );

    // TODO const for coordinates
    this.statsText = new Text(this, DEBUG_TEXT_X, DEBUG_TEXT_Y + 100);


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
      callback: () => this.makeStep(),
      callbackScope: this,
      loop: true,
    });
  }

  makeStep(): void {
    // this.tetrisState.makeStep();


    const move = this.ai.bestMove();
    this.tetrisState.tetromino.forceDropPosition(move);
    this.tetrisState.tetrominoTotalDrop();

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
    this.statsText.setText(
      'Crushed rows: ' + this.tetrisState.getCrushedRows().toString()
      + '\nTetrominoes created: ' + this.tetrisState.getTetrominoesCreated().toString()
    );

    this.gameOverButton.setVisible(this.tetrisState.gameOver);

    if (this.debugGraphics) {
      this.debugGraphics.tetrominoPoint = this.tetrisState.tetromino?.getCenterPoint();
    }
  }
}