import { Notifier, VoiceNotifier } from "./notifier";
import { ScreenWaker } from "./screen-waker";

export type ClockViewState = {
  chapterIndex: number;
  inEssay: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  percent: number;
  mode: ClockMode;
};

const SETTINGS_VERSION = 2 as const;
const SETTINGS_STORAGE_KEY = `settingsV${SETTINGS_VERSION}` as const;
let _DEFAULT_SETTINGS = {
  withEssay: true,
  essaySeconds: 30 * 60,

  chaptersCount: 8,
  chapterSeconds: 20 * 60,

  notifyEnds: true,
  notifyMinutesLeft: true,
  secondsLeftCount: 5 * 60,

  resetVisualClockEssay: true,
  resetVisualClockChapter: true,
  chapterPercent: true,
};
export type ClockSettings = typeof _DEFAULT_SETTINGS;
export const DEFAULT_SETTINGS = { ..._DEFAULT_SETTINGS } as const;

export namespace PersistentSettings {
  export let loaded = false;
  export const load = (): Partial<ClockSettings> => {
    const storage = localStorage.getItem(SETTINGS_STORAGE_KEY);
    loaded = true;
    if (storage != null) return JSON.parse(storage) as Partial<ClockSettings>;
    return {};
  };
  export const save = (settings: ClockSettings) => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  };
}

export enum ClockMode {
  On,
  Off,
  Paused,
  Done,
}
export class Clock {
  static readonly timeSettings: (keyof ClockSettings)[] = [
    "withEssay",
    "essaySeconds",
    "chapterSeconds",
    "secondsLeftCount",
    "chaptersCount",
  ];

  private laststartTime = 0;
  private activatedTime = 0;
  private timeouts: NodeJS.Timeout[] = [];
  private mode: ClockMode = ClockMode.Off;

  private notifier: Notifier = new VoiceNotifier();
  private waker = new ScreenWaker();
  constructor(public settings = structuredClone(DEFAULT_SETTINGS)) {}

  public start() {
    this.reset();
    this.continue(true);
    this.notifier.start();
  }
  public continue(muted = false) {
    this.laststartTime = Date.now();
    this.defineTimeouts();
    this.waker.keepScreenOn();
    if (!muted) this.notifier.continue();
    this.mode = ClockMode.On;
  }
  public stop(muted = false) {
    this.activatedTime += Date.now() - this.laststartTime;
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.timeouts = [];
    this.waker.releaseScreen();
    if (!muted) this.notifier.cancel();
    this.mode = ClockMode.Paused;
  }
  public reset() {
    this.stop();
    this.activatedTime = 0;
    this.mode = ClockMode.Off;
  }
  public setSettings(settings: Partial<ClockSettings>) {
    // Note: it tries to work also with a running clock, but it can result in unexpected behavior (like not stop forever)
    const hasTimeSettings = Clock.timeSettings.some((key) => key in settings);
    if (hasTimeSettings && this.mode === ClockMode.On) this.stop(true);
    this.settings = { ...this.settings, ...settings };
    if (hasTimeSettings && this.mode === ClockMode.On) this.continue(true);
    (async () => {
      PersistentSettings.save(this.settings);
    })();
  }

  private done() {
    this.reset();
    this.notifier.end();
    this.mode = ClockMode.Done;
  }

  private defineTimeouts() {
    let baseTime = -this.activatedTime;
    if (this.settings.withEssay) {
      baseTime +=
        (this.settings.essaySeconds - this.settings.secondsLeftCount) * 1000;
      if (baseTime > 0) {
        this.timeouts.push(
          setTimeout(() => {
            if (this.settings.notifyMinutesLeft)
              this.notifier.minutesLeft(this.settings.secondsLeftCount / 60);
          }, baseTime)
        );
      }
      baseTime += this.settings.secondsLeftCount * 1000;
      if (baseTime > 0)
        this.timeouts.push(
          setTimeout(() => {
            if (this.settings.notifyEnds) this.notifier.nextChapter();
          }, baseTime)
        );
    }
    for (let i = 0; i < this.settings.chaptersCount; i++) {
      baseTime +=
        (this.settings.chapterSeconds - this.settings.secondsLeftCount) * 1000;
      if (baseTime > 0)
        this.timeouts.push(
          setTimeout(() => {
            if (this.settings.notifyMinutesLeft)
              this.notifier.minutesLeft(this.settings.secondsLeftCount / 60);
          }, baseTime)
        );
      baseTime += this.settings.secondsLeftCount * 1000;
      if (baseTime > 0) {
        if (i !== this.settings.chaptersCount - 1)
          this.timeouts.push(
            setTimeout(() => {
              if (this.settings.notifyEnds) this.notifier.nextChapter();
            }, baseTime)
          );
      }
    }
    this.timeouts.push(setTimeout(() => this.done(), baseTime));
  }

  public getView(): ClockViewState {
    if (this.mode === ClockMode.Done || this.mode === ClockMode.Off)
      return {
        chapterIndex:
          this.mode === ClockMode.Done ? this.settings.chaptersCount : 0,
        inEssay: false,
        percent: this.mode === ClockMode.Done ? 100 : 0,
        mode: this.mode,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    const { activeTime, chapterTime, chapterIndex, inEssay } = this.calcState();
    const computedTotalSeconds =
      (this.settings.withEssay ? this.settings.essaySeconds : 0) +
      this.settings.chapterSeconds * this.settings.chaptersCount;
    const percent = this.settings.chapterPercent
      ? (chapterTime /
          1000 /
          (inEssay
            ? this.settings.essaySeconds
            : this.settings.chapterSeconds)) *
        100
      : (activeTime / 1000 / computedTotalSeconds) * 100;

    let chapterCounter = chapterIndex - (this.settings.withEssay ? 1 : 0);
    let chapterSeconds = Math.floor(chapterTime / 1000);
    if (
      !this.settings.resetVisualClockEssay &&
      !inEssay &&
      this.settings.withEssay
    )
      chapterSeconds += this.settings.essaySeconds;
    if (!this.settings.resetVisualClockChapter && !inEssay)
      chapterSeconds += this.settings.chapterSeconds * chapterCounter;

    return {
      chapterIndex: chapterCounter + 1,
      inEssay,
      hours: Math.floor(chapterSeconds / 3600),
      minutes: Math.floor(chapterSeconds / 60),
      seconds: Math.floor(chapterSeconds % 60),
      percent: percent > 100 ? 100 : percent,
      mode: this.mode,
    };
  }

  private calcState(): {
    activeTime: number;
    chapterTime: number;
    chapterIndex: number;
    inEssay: boolean;
  } {
    const activeTime = Date.now() - this.laststartTime + this.activatedTime;
    let chapterTime = activeTime;
    let chapterIndex = 0;
    if (this.settings.withEssay) {
      if (activeTime > this.settings.essaySeconds * 1000) {
        chapterTime -= this.settings.essaySeconds * 1000;
        chapterTime = chapterTime % (this.settings.chapterSeconds * 1000);
        chapterIndex =
          1 +
          Math.floor(
            (activeTime - this.settings.essaySeconds * 1000) /
              (this.settings.chapterSeconds * 1000)
          );
      }
    } else {
      chapterTime = activeTime % (this.settings.chapterSeconds * 1000);
      chapterIndex = Math.floor(
        activeTime / (this.settings.chapterSeconds * 1000)
      );
    }
    const inEssay =
      this.settings.withEssay && activeTime < this.settings.essaySeconds * 1000
        ? true
        : false;
    return {
      activeTime,
      chapterTime,
      chapterIndex,
      inEssay,
    };
  }
}

export class ViewUpdater {
  private active = false;
  constructor(
    private clockInterval: number,
    private clock: Clock,
    public stateCB: (state: ClockViewState) => void = (state) => {}
  ) {}
  public activate() {
    if (this.active) return;
    this.active = true;
    this.updateState();
  }
  public deactivate() {
    if (!this.active) return;
    this.active = false;
  }
  public now() {
    this.updateState(true);
  }
  private updateState(now = false) {
    if (now) this._updateState(now);
    else requestAnimationFrame(this._updateState.bind(this, now));
  }
  private _updateState(now = false) {
    if (!now && !this.active) return;
    const newState = this.clock.getView();
    this.stateCB(newState);
    if (now) return;
    if (newState.mode !== ClockMode.Off)
      setTimeout(this.updateState.bind(this), this.clockInterval);
    else this.active = false;
  }
}
