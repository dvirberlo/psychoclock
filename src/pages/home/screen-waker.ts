// Note: this class uses an experimental web API, which is not available in all browsers (https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API).

export class ScreenWaker {
  private lock: any | undefined;
  constructor() {}
  public async keepScreenOn() {
    if (!("wakeLock" in navigator) || this.lock) return;
    this.lock = await (navigator as any).wakeLock.request("screen");
  }
  public async releaseScreen() {
    if (!("wakeLock" in navigator) || !this.lock) return;
    this.lock.release();
    this.lock = undefined;
  }
}
