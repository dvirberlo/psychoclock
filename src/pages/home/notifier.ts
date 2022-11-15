export type Notifier = {
  cancel: () => void;
  start: () => void;
  continue: () => void;
  minutesLeft: (minutes: number) => void;
  nextChapter: () => void;
  end: () => void;
};

export class VoiceNotifier implements Notifier {
  private voice: SpeechSynthesisUtterance;
  constructor() {
    this.voice = new SpeechSynthesisUtterance();
    this.voice.lang = "en-US";
    this.voice.rate = 1.3;
    this.voice.volume = 1;
  }
  private speak(text: string) {
    this.cancel();
    this.voice.text = text;
    window.speechSynthesis.speak(this.voice);
  }
  public cancel() {
    window.speechSynthesis.cancel();
  }
  public start() {
    this.speak("You can start now. Good luck!");
  }
  public continue() {
    this.speak("You can continue now. Good luck!");
  }
  public minutesLeft(count = 5) {
    this.speak(count + " minutes left");
  }
  public nextChapter() {
    this.speak("Chapter finished. Continue to the next chapter.");
  }
  public end() {
    this.speak("Time's up. Good job!");
  }
}
