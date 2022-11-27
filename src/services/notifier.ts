export type Notifier = {
  cancel: () => void;
  start: () => void;
  continue: () => void;
  minutesLeft: (minutes: number) => void;
  nextChapter: () => void;
  end: () => void;
  mute: () => void;
  unmute: () => void;
};

const DEFAULT_VOICE = {
  lang: "en-US",
  rate: 1.3,
  volume: 1,
};
Object.freeze(DEFAULT_VOICE);

export class VoiceNotifier implements Notifier {
  private voice?: SpeechSynthesisUtterance;
  constructor() {
    try {
      if (!window.speechSynthesis)
        throw new Error("Speech synthesis not supported.");
      this.voice = new SpeechSynthesisUtterance();
      this.voice.lang = DEFAULT_VOICE.lang;
      this.voice.rate = DEFAULT_VOICE.rate;
      this.voice.volume = DEFAULT_VOICE.volume;
    } catch (e) {
      this.notSupported(e);
    }
  }
  private notSupported(e: unknown) {
    console.error(e);
    window.alert(
      "Your browser does not support speech synthesis. \nPlease, do the yourself a favor and use a modern browser."
    );
  }
  private speak(text: string) {
    if (this.voice === undefined) return;
    this.cancel();
    this.voice.text = text;
    window.speechSynthesis.speak(this.voice);
  }

  public cancel() {
    if (this.voice === undefined) return;
    window.speechSynthesis.cancel();
  }
  public mute() {
    if (this.voice === undefined) return;
    this.voice.volume = 0;
  }
  public unmute() {
    if (this.voice === undefined) return;
    this.voice.volume = DEFAULT_VOICE.volume;
  }

  public start() {
    this.speak("Start now.");
  }
  public continue() {
    this.speak("Continue now.");
  }
  public minutesLeft(count = 5) {
    this.speak(count + " minutes left.");
  }
  public nextChapter() {
    this.speak("Chapter finished, continue to the next one.");
  }
  public end() {
    this.speak("Pencils down. Time's up.");
  }
}
