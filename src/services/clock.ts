import { Notifier, VoiceNotifier } from "./notifier";
import { ScreenWaker } from "./screen-waker";

export type ClockCB = {
  chapterIndex: number;
  inEssay: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  percent: number;
};

const SETTINGS_VERSION = 1;
export const DEFAULT_SETTINGS = {
  withEssay: true,
  essaySeconds: 30 * 60,

  chaptersCount: 8,
  chapterSeconds: 20 * 60,

  notifyEnds: true,
  notifyMinutesLeft: true,
  secondsLeftCount: 5 * 60,

  resetVisualClockEssay: true,
  resetVisualClockChapter: true,
  totalPercent: false,
};
Object.freeze(DEFAULT_SETTINGS);
export type ClockSettings = typeof DEFAULT_SETTINGS;

const CLOCK_INTERVAL = 500;
export class Clock {
  public readonly settings: ClockSettings;
  private notfier: Notifier;
  private waker = new ScreenWaker();
  public state = {
    notifiedMinutesLeft: false,
    chapterIndex: 0,
    seconds: 0,
    totalSeconds: 0,
    inEssay: false,
    isRunning: false,
    lastTickTock: -1,
  };

  constructor(
    public clockCB: (data: ClockCB) => void = () => {},
    public finishedCB: () => void = () => {},
    public settingsCB: () => void = () => {}
  ) {
    this.notfier = new VoiceNotifier();
    this.settings = structuredClone(DEFAULT_SETTINGS);
    (async () => {
      const storage = localStorage.getItem("settingsV" + SETTINGS_VERSION);
      if (storage != null)
        this.setSettings(JSON.parse(storage) as Partial<ClockSettings>);
    })();
  }

  public setSettings(settings: Partial<ClockSettings>) {
    Object.assign(this.settings, settings);
    if (settings.resetVisualClockEssay === false)
      this.settings.resetVisualClockChapter = false;
    if (settings.resetVisualClockEssay === true)
      this.settings.resetVisualClockChapter = true;
    if (
      (settings.chapterSeconds != null &&
        this.settings.secondsLeftCount > settings.chapterSeconds) ||
      (settings.essaySeconds != null &&
        this.settings.secondsLeftCount > settings.essaySeconds)
    )
      this.settings.notifyMinutesLeft = false;
    else this.settings.notifyMinutesLeft = true;
    this.settingsCB();
    (async () => {
      localStorage.setItem(
        "settingsV" + SETTINGS_VERSION,
        JSON.stringify(this.settings)
      );
    })();
  }

  private formatStateCB() {
    const computedTotalSeconds =
      (this.settings.withEssay ? this.settings.essaySeconds : 0) +
      this.settings.chapterSeconds * this.settings.chaptersCount;
    const percent = this.settings.totalPercent
      ? (this.state.totalSeconds / computedTotalSeconds) * 100
      : (this.state.seconds /
          (this.state.inEssay
            ? this.settings.essaySeconds
            : this.settings.chapterSeconds)) *
        100;

    let selectedSeconds = this.state.seconds;
    if (
      !this.settings.resetVisualClockEssay &&
      this.settings.withEssay &&
      !this.state.inEssay
    )
      selectedSeconds += this.settings.essaySeconds;
    if (!this.settings.resetVisualClockChapter && !this.state.inEssay)
      selectedSeconds +=
        this.settings.chapterSeconds *
        (this.state.chapterIndex - (this.settings.withEssay ? 1 : 0));

    this.clockCB({
      chapterIndex: this.state.chapterIndex,
      inEssay: this.state.inEssay,
      hours: Math.floor(selectedSeconds / 3600),
      minutes: Math.floor(selectedSeconds / 60),
      seconds: Math.floor(selectedSeconds % 60),
      percent: percent > 100 ? 100 : percent,
    });
  }

  public resetClock() {
    this.waker.releaseScreen();
    this.notfier.cancel();
    this.state.inEssay = this.settings.withEssay;
    this.state.chapterIndex = 0;
    this.state.totalSeconds = 0;
    this.state.seconds = 0;
    this.state.isRunning = false;
    this.state.lastTickTock = -1;
    this.formatStateCB();
  }

  public startClock() {
    this.resetClock();
    this.notfier.start();
    this.continueClock(true);
  }

  public stopClock() {
    this.waker.releaseScreen();
    this.notfier.cancel();
    this.ticktock().then(() => {
      this.state.isRunning = false;
      this.state.lastTickTock = -1;
    });
  }

  private finished() {
    this.waker.releaseScreen();
    if (this.settings.notifyEnds) {
      this.notfier.end();
    }
    this.formatStateCB();
    this.finishedCB();
  }

  public continueClock(started = false) {
    this.waker.keepScreenOn();
    this.formatStateCB();
    if (!started) this.notfier.continue();

    // Note: this function uses ClockSettings by reference, so it will be updated automatically, if the settings change.
    // also, it's a stopwatch, not a timer
    this.state.lastTickTock = Date.now();
    this.state.isRunning = true;
    this.ticktock();
  }

  private async ticktock() {
    if (!this.state.isRunning) {
      // clearInterval(interval);
      return;
    }
    const now = Date.now();
    const deltaSeconds = (now - this.state.lastTickTock) / 1000;
    this.state.lastTickTock = now;
    setTimeout(() => this.ticktock(), CLOCK_INTERVAL);
    this.state.totalSeconds += deltaSeconds;
    this.state.seconds += deltaSeconds;
    if (
      this.settings.notifyMinutesLeft &&
      !this.state.notifiedMinutesLeft &&
      this.settings.secondsLeftCount + this.state.seconds >=
        (this.state.inEssay
          ? this.settings.essaySeconds
          : this.settings.chapterSeconds)
    ) {
      this.notfier.minutesLeft(this.settings.secondsLeftCount / 60);
      this.state.notifiedMinutesLeft = true;
    }
    if (
      this.state.seconds >=
      (this.state.inEssay
        ? this.settings.essaySeconds
        : this.settings.chapterSeconds)
    ) {
      const chapterIndex = this.state.chapterIndex + 1;
      this.state.notifiedMinutesLeft = false;
      if (this.settings.notifyEnds) this.notfier.nextChapter();
      if (
        chapterIndex ===
        this.settings.chaptersCount + (this.settings.withEssay ? 1 : 0)
      ) {
        this.state.isRunning = false;
        // clearInterval(interval);
        this.finished();
        return;
      }
      this.state.chapterIndex = chapterIndex;
      // essay is always first
      this.state.inEssay = false;
      this.state.seconds = 0;
    }
    this.formatStateCB();
  }
}