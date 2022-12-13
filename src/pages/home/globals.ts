import { Clock, ViewUpdater } from "../../services/clock";
import { SettingsManager } from "./clock-settings";

export const CLOCK_INTERVAL = 500;

export const GlobalClock = new Clock();
export const GloablSettingsManager = new SettingsManager(GlobalClock);
export const GlobalViewUpdater = new ViewUpdater(CLOCK_INTERVAL, GlobalClock);
