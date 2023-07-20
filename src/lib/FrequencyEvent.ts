import { TetrisScene } from "../scene";

/** Updateable time event. Number of events per second. */
export default class FrequencyEvent {

  private timerEvent: Phaser.Time.TimerEvent;

  constructor(
    scene: TetrisScene,
    frequency: number,
    private onEvent: () => void,
  ) {
    this.timerEvent = scene.time.addEvent({
      delay: 1000 / frequency,
      callback: onEvent,
      loop: true,
    });
  }

  public setFrequency(frequency: number): void {
    this.timerEvent.reset({
      delay: 1000 / frequency,
      callback: this.onEvent,
      loop: true,
    });
  }
}