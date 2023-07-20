import * as Phaser from 'phaser';
import TetrisArena from './ui/TetrisArena';
import KeyboardInput from './lib/keyboard_input';
import { preloadTextures } from './lib/textures';
import TetrisState from './game_logic/TetrisState';
import NextTetromino from './ui/NextTetromino';
import { DEBUG_GRAPHICS_ENABLED, DEBUG_TEXT_X, DEBUG_TEXT_Y, DRAGGABLE_BAR_X, DRAGGABLE_BAR_Y, DRAGGABLE_BAR_GAP, AI_TOGGLE_X, AI_TOGGLE_Y, LOOKAHEAD_TOGGLE_X, LOOKAHEAD_TOGGLE_Y, SPEED_SLIDER_X, SPEED_SLIDER_Y, SPEED_SLIDER_GAP, KEYS_TEXT_X, KEYS_TEXT_Y, DEBUG_TEXT_GAP } from './lib/consts';
import GameOverButton from './ui/GameOverButton';
import Text from './ui/Text';
import DebugGraphics from './ui/DebugGraphics';
import BlockSprite from './ui/BlockSprite';
import TetrominoSprite from './ui/TetrominoSprite';
import AI from './game_logic/AI';
import Dragger from './ui/Dragger';
import Toggle from './ui/Toggle';
import { addAiControls } from './ui/complex';
import FrequencyEvent from './lib/FrequencyEvent';
import { Move } from './game_objects/Tetromino';

// TODO show where the tetromino will drop (ghost tetromino)
// TODO genetic algo to figure out best params, maybe sum heights at the end
// TODO make the code nicer, especially in this file

export class TetrisScene extends Phaser.Scene {

  private keys: KeyboardInput;

  private tetrisState: TetrisState;

  private ai: AI;

  private blocks: BlockSprite[] = [];
  private tetromino: TetrominoSprite = undefined;
  private nextTetromino: NextTetromino;
  private debugText: Text;
  private statsText: Text;
  private gameOverButton: GameOverButton;
  private debugGraphics: DebugGraphics | null = null;

  private tetrisMovesPerSec: number = 1;
  private tetrisMovesEvent: FrequencyEvent;

  private aiMovesPerSec: number = 2;
  private aiMovesEvent: FrequencyEvent;

  // TODO maybe part of AI
  private lookaheadDepth: number = 1;

  // TODO should be a part of AI or something (movement system)
  private moveQueue: Move[] = [];

  constructor() {
    super({ key: 'TetrisScene' })
  }

  preload(): void {
    preloadTextures(this);
  }

  private buildUi(): void {
    new Text(this, KEYS_TEXT_X, KEYS_TEXT_Y)
      .setText('Keys: a - left, d - right, w - rotate, s - down, space - drop');
    this.debugText = new Text(this, DEBUG_TEXT_X, DEBUG_TEXT_Y);
    this.statsText = new Text(this, DEBUG_TEXT_X, DEBUG_TEXT_Y + DEBUG_TEXT_GAP);

    new Toggle(
      this,
      AI_TOGGLE_X,
      AI_TOGGLE_Y,
      (value: boolean) => this.ai.setIsActive(value),
      'Activate AI',
    );
    new Toggle(   // TODO maybe should be part of AI
      this,
      LOOKAHEAD_TOGGLE_X,
      LOOKAHEAD_TOGGLE_Y,
      (value: boolean) => {
        if (value) {
          this.lookaheadDepth = 2;
        } else {
          this.lookaheadDepth = 1;
        }
      },
      'AI use next tetromino',
    );

    if (DEBUG_GRAPHICS_ENABLED) {
      this.debugGraphics = new DebugGraphics(this);
    }

    new TetrisArena(this);
    this.nextTetromino = new NextTetromino(this);
  }

  create(): void {
    this.buildUi();

    this.keys = new KeyboardInput(this);

    this.tetrisState = new TetrisState();
    this.ai = new AI(this.tetrisState);

    addAiControls(this, this.ai);
    this.gameOverButton = new GameOverButton(this, () => this.tetrisState.reset());

    this.keys.w.on('down', () => {
      if (!this.ai.isActive) {
        this.tetrisState.tetrominoRotate();
      }
    });
    this.keys.d.on('down', () => {
      if (!this.ai.isActive) {
        this.tetrisState.tetrominoMoveRight();
      }
    });
    this.keys.a.on('down', () => {
      if (!this.ai.isActive) {
        this.tetrisState.tetrominoMoveLeft();
      }
    });
    this.keys.s.on('down', () => {
      if (!this.ai.isActive) {
        this.tetrisState.tetrominoDrop();
      }
    });
    this.keys.space.on('down', () => {
      if (!this.ai.isActive) {
        this.tetrisState.tetrominoTotalDrop();
      }
    });

    new Dragger(
      this,
      SPEED_SLIDER_X,
      SPEED_SLIDER_Y,
      1,
      100,
      (value: number) => this.aiMovesEvent.setFrequency(value),
      'AI moves per second',
      this.aiMovesPerSec,
    );
    new Dragger(
      this,
      SPEED_SLIDER_X,
      SPEED_SLIDER_Y + SPEED_SLIDER_GAP,
      1,
      20,
      (value: number) => this.tetrisMovesEvent.setFrequency(value),
      'Tetris steps per second',
      this.tetrisMovesPerSec,
    );


    this.aiMovesEvent = new FrequencyEvent(
      this,
      this.aiMovesPerSec,
      () => this.aiMove(),
    );
    this.tetrisMovesEvent = new FrequencyEvent(
      this,
      this.tetrisMovesPerSec,
      () => this.tetrisStep(),
    );
  }

  aiMove(): void {
    if (!this.ai.isActive) {
      return;
    }

    if (this.moveQueue.length === 0) {
      const bestPosition = this.ai.bestPosition(this.lookaheadDepth);
      this.moveQueue = [
        ...this.tetrisState.tetromino.movesTo(bestPosition),
        Move.TOTAL_DROP,
      ];
    }
    this.tetrisState.doMove(this.moveQueue.shift());
  }

  tetrisStep(): void {
    this.tetrisState.makeStep();
  }

  update(): void {
    this.blocks.forEach(block => block.destroy());
    this.blocks = [];
    this.blocks = this.tetrisState.blocks.map(block =>
      new BlockSprite(this, block.xCoord, block.yCoord, block.texture)
    );

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