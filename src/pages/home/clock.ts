import { Notifier, VoiceNotifier } from "./notifier";
import { ScreenWaker } from "./screen-waker";

export type ClockCB = {
  chapterIndex: number;
  inEssay: boolean;
  hours: number;
  minutes: number;
  seconds: number;
};

export type ClockState = {
  chapterIndex: number;
  totalSeconds: number;
  seconds: number;
  inEssay: boolean;
  isRunning: boolean;
  lastActionTime: number;
};

export type ClockSettings = {
  withEssay: boolean;
  essaySeconds: number;

  chaptersCount: number;
  chapterSeconds: number;

  notifyEnds: boolean;
  notifyMinutesLeft: boolean;
  secondsLeftCount: number;

  resetVisualClockEssay: boolean;
  resetVisualClockChapter: boolean;
};
export const DEFAULT_SETTINGS: ClockSettings = {
  withEssay: true,
  essaySeconds: 30 * 60,

  chaptersCount: 8,
  chapterSeconds: 20 * 60,

  notifyEnds: true,
  notifyMinutesLeft: true,
  secondsLeftCount: 5 * 60,

  resetVisualClockEssay: true,
  resetVisualClockChapter: true,
};
Object.freeze(DEFAULT_SETTINGS);

export class Clock {
  public readonly settings: ClockSettings;
  private notfier: Notifier;
  private waker = new ScreenWaker();
  public state: ClockState = {
    chapterIndex: 0,
    seconds: 0,
    totalSeconds: 0,
    inEssay: false,
    isRunning: false,
    lastActionTime: -1,
  };

  constructor(
    public clockCB: (data: ClockCB) => void = () => {},
    public finishedCB: () => void = () => {}
  ) {
    this.notfier = new VoiceNotifier();
    this.settings = structuredClone(DEFAULT_SETTINGS);
  }

  public setSettings(settings: ClockSettings) {
    Object.assign(this.settings, settings);
  }

  private formatStateCB() {
    this.clockCB({
      chapterIndex: this.state.chapterIndex,
      inEssay: this.state.inEssay,
      hours: Math.floor(this.state.seconds / 3600),
      minutes: Math.floor(this.state.seconds / 60),
      seconds: this.state.seconds % 60,
    });
  }

  public resetClock() {
    this.waker.releaseScreen();
    this.state.inEssay = this.settings.withEssay;
    this.state.chapterIndex = 0;
    this.state.totalSeconds = 0;
    this.state.seconds = 0;
    this.state.isRunning = false;
    this.state.lastActionTime = -1;
    this.formatStateCB();
  }

  public startClock() {
    this.notfier.start();
    this.resetClock();
    this.continueClock(true);
  }

  public stopClock() {
    this.waker.releaseScreen();
    this.notfier.cancel();
    this.state.lastActionTime = -1;
    this.state.isRunning = false;
  }

  private finished() {
    this.waker.releaseScreen();
    if (this.settings.notifyEnds) {
      this.notfier.end();
    }
    this.finishedCB();
  }

  public continueClock(started = false) {
    this.waker.keepScreenOn();
    this.formatStateCB();
    if (!started) this.notfier.continue();

    // Note: this function uses ClockSettings by reference, so it will be updated automatically, if the settings change.
    // also, it's a stopwatch, not a timer
    const newActionTime = Date.now();
    this.state.lastActionTime = newActionTime;
    this.state.isRunning = true;
    const interval = setInterval(() => {
      if (this.state.lastActionTime != newActionTime) {
        clearInterval(interval);
        return;
      }
      this.state.totalSeconds += 1;
      this.state.seconds += 1;
      if (
        this.settings.notifyMinutesLeft &&
        this.settings.secondsLeftCount + this.state.seconds ===
          (this.state.inEssay
            ? this.settings.essaySeconds
            : this.settings.chapterSeconds)
      )
        this.notfier.minutesLeft(this.settings.secondsLeftCount / 60);
      if (
        this.state.seconds >=
        (this.state.inEssay
          ? this.settings.essaySeconds
          : this.settings.chapterSeconds)
      ) {
        const chapterIndex = this.state.chapterIndex + 1;
        if (this.settings.notifyEnds) this.notfier.nextChapter();
        if (
          chapterIndex ===
          this.settings.chaptersCount + (this.settings.withEssay ? 1 : 0)
        ) {
          this.state.isRunning = false;
          clearInterval(interval);
          this.finished();
          return;
        }
        this.state.chapterIndex = chapterIndex;
        // essay is always first
        this.state.inEssay = false;
        this.state.seconds = 0;
      }
      this.formatStateCB();
    }, 1000);
  }
}
