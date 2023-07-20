import * as Phaser from 'phaser';
import TetrisArena from './ui/TetrisArena';
import KeyboardInput from './lib/keyboard_input';
import { preloadTextures } from './lib/textures';
import TetrisState from './game_logic/TetrisState';
import NextTetromino from './ui/NextTetromino';
import { DEBUG_GRAPHICS_ENABLED, DEBUG_TEXT_X, DEBUG_TEXT_Y, DRAGGABLE_BAR_X, DRAGGABLE_BAR_Y, DRAGGABLE_BAR_GAP, AI_TOGGLE_X, AI_TOGGLE_Y } from './lib/consts';
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
// TODO make moves manually with AI
// TODO scan depth 2+, dragger for that
// TODO genetic algo to figure out best params, maybe sum heights at the end
// TODO remove reset and replace it with new tetris state
// TODO add total drop animation (tween)
// TODO add text with instructions

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

  private tetrisMovesPerSec: number = 1;
  private tetrisMovesEvent: Phaser.Time.TimerEvent;

  private aiMovesPerSec: number = 2;
  private aiMovesEvent: Phaser.Time.TimerEvent;

  private isAiActive: boolean = false;

  constructor() {
    super({ key: 'TetrisScene' })
  }

  preload(): void {
    preloadTextures(this);
  }

  create(): void {
    new Toggle(
      this,
      AI_TOGGLE_X,
      AI_TOGGLE_Y,
      (value: boolean) => { this.isAiActive = value; },
      'Activate AI',
    );

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
      if (!this.isAiActive) {
        this.tetrisState.tetrominoRotate();
      }
    });
    this.keys.d.on('down', () => {
      if (!this.isAiActive) {
        this.tetrisState.tetrominoMoveRight();
      }
    });
    this.keys.a.on('down', () => {
      if (!this.isAiActive) {
        this.tetrisState.tetrominoMoveLeft();
      }
    });
    this.keys.s.on('down', () => {
      if (!this.isAiActive) {
        this.tetrisState.tetrominoDrop();
      }
    });
    this.keys.space.on('down', () => {
      if (!this.isAiActive) {
        this.tetrisState.tetrominoTotalDrop();
      }
    });

    // TODO extract and give proper coordinates
    new Dragger(
      this,
      100,
      600,
      1,
      100,
      (value: number) => this.aiMovesEvent.reset({
        delay: 1000 / value,
        callback: () => this.aiMove(),
        callbackScope: this,
        loop: true,
      }),
      'AI moves per second',
      this.aiMovesPerSec,
    );

    new Dragger(
      this,
      100,
      700,
      1,
      20,
      (value: number) => this.tetrisMovesEvent.reset({
        delay: 1000 / value,
        callback: () => this.tetrisStep(),
        callbackScope: this,
        loop: true,
      }),
      'Tetris steps per second',
      this.tetrisMovesPerSec,
    );


    this.aiMovesEvent = this.time.addEvent({
      delay: 1000 / this.aiMovesPerSec,
      callback: () => this.aiMove(),
      callbackScope: this,
      loop: true,
    });

    this.tetrisMovesEvent = this.time.addEvent({
      delay: 1000 / this.tetrisMovesPerSec,
      callback: () => this.tetrisStep(),
      callbackScope: this,
      loop: true,
    });
  }

  aiMove(): void {
    if (!this.isAiActive) {
      return;
    }

    const move = this.ai.bestMove();
    this.tetrisState.tetromino.forceDropPosition(move);
    this.tetrisState.tetrominoTotalDrop();
  }

  tetrisStep(): void {
    if (this.isAiActive) {
      return;
    }
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