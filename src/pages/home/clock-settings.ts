import {
  Clock,
  ClockSettings,
  DEFAULT_SETTINGS,
  SETTINGS_VERSION,
} from "../../services/clock";

const CLIENT_SETTINGS_VERSION = 1 as const;
const SETTINGS_STORAGE_KEY = `settingsV${
  SETTINGS_VERSION + CLIENT_SETTINGS_VERSION
}` as const;

export type ClientSettings = ClockSettings & {
  showReset: boolean;
};
const DEFAULT_CLIENT_SETTINGS: ClientSettings = {
  ...DEFAULT_SETTINGS,
  showReset: true,
} as const;

export namespace PersistentSettings {
  export let loaded = false;
  export const load = (): Partial<ClientSettings> => {
    const storage = localStorage.getItem(SETTINGS_STORAGE_KEY);
    loaded = true;
    if (storage != null) return JSON.parse(storage) as Partial<ClientSettings>;
    save(DEFAULT_CLIENT_SETTINGS);
    return DEFAULT_CLIENT_SETTINGS;
  };
  export const save = (settings: ClientSettings) => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  };
}

export class SettingsManager {
  static SET_DELAY = 50 as const;
  private timeout: NodeJS.Timeout | undefined = undefined;
  private updateSettings: Partial<ClientSettings> = {};
  public loaded = false;
  constructor(
    public clock: Clock,
    public settings: ClientSettings = structuredClone(DEFAULT_CLIENT_SETTINGS),
    public changeListeners: {
      [name: string]: (settings: Partial<ClientSettings>) => void;
    } = {}
  ) {}

  public load = () =>
    new Promise<void>((resolve) => {
      if (this.loaded) resolve();
      else
        (async () => {
          const loadedSettings = PersistentSettings.load();
          await this.set(loadedSettings);
          resolve();
        })();
      this.loaded = true;
    });

  public set = (settings: Partial<ClientSettings>) =>
    new Promise<void>((resolve) => {
      if (this.timeout !== undefined) clearTimeout(this.timeout);
      this.updateSettings = { ...this.updateSettings, ...settings };
      this.timeout = setTimeout(() => {
        // this.clock.setSettings(Object.fromEntries(Object.entries(this.updateSettings).filter(([key]) => key in this.clock.settings)));
        this.clock.setSettings(this.updateSettings);
        this.settings = { ...this.settings, ...this.updateSettings };
        PersistentSettings.save(this.settings);
        for (const listener in this.changeListeners)
          this.changeListeners[listener](this.updateSettings);
        this.updateSettings = {};
        resolve();
      }, SettingsManager.SET_DELAY);
    });

  public get(
    field: keyof ClientSettings,
    defaultValue: ClientSettings[keyof ClientSettings] = DEFAULT_CLIENT_SETTINGS[
      field
    ]
  ) {
    return this.settings[field] ?? defaultValue;
  }
}
