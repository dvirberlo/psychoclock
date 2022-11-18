import {
  PauseRounded as StopIcon,
  PlayArrowRounded as ContinueIcon,
  PlayCircleFilledRounded as StartIcon,
  RestartAltRounded as ResetIcon,
} from "@mui/icons-material";
import { Button, CircularProgress, Container, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { Clock, ClockCB } from "../../services/clock";
import { ClockShortcuts, setupShortcuts } from "../../services/clock-shortcuts";
import { DisplaySettingsSection, SettingsSection } from "./Settings";

export enum ClockMode {
  On,
  Off,
  Paused,
}

const clock = new Clock();

export default function Home() {
  const [clockMode, setClockMode] = useState<ClockMode>(ClockMode.Off);

  clock.finishedCB = () => setClockMode(ClockMode.Off);

  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {ClockDisplay(clockMode, setClockMode, clock)}
      <DisplaySettingsSection clock={clock} clockMode={clockMode} />
      <SettingsSection clock={clock} clockMode={clockMode} />
      <Typography
        variant="body1"
        component="div"
        sx={{ display: { sm: "block", md: "none" }, marginTop: 2 }}
      >
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8145571465576979"
          crossOrigin="anonymous"
        ></script>
        {/* <!-- Horizontal Ad --> */}
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-8145571465576979"
          data-ad-slot="8731925237"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </Typography>
    </Container>
  );
}

function ClockDisplay(
  clockMode: ClockMode,
  setClockMode: (clockMode: ClockMode) => void,
  clock: Clock
) {
  const [chapterIndex, setChapterIndex] = useState<number>(
    clock.state.chapterIndex
  );
  const [hours, setHours] = useState<number>(clock.state.seconds);
  const [minutes, setMinutes] = useState<number>(clock.state.seconds);
  const [seconds, setSeconds] = useState<number>(clock.state.seconds);
  const [inEssay, setInEssay] = useState<boolean>(clock.settings.withEssay);
  const [percent, setPercent] = useState<number>(0);
  clock.clockCB = (state: ClockCB) => {
    if (chapterIndex !== state.chapterIndex)
      setChapterIndex(state.chapterIndex);
    if (hours !== state.hours) setHours(state.hours);
    if (minutes !== state.minutes) setMinutes(state.minutes);
    if (seconds !== state.seconds) setSeconds(state.seconds);
    if (inEssay !== state.inEssay) setInEssay(state.inEssay);
    if (percent !== state.percent) setPercent(state.percent);
  };

  const [settingsCounter, settingsUpdated] = useState(0);
  clock.settingsCB = () => settingsUpdated(settingsCounter + 1);

  const startClick = () => {
    clock.startClock();
    setClockMode(ClockMode.On);
  };
  const stopClick = () => {
    clock.stopClock();
    setClockMode(ClockMode.Paused);
  };
  const continueClick = () => {
    clock.continueClock();
    setClockMode(ClockMode.On);
  };
  const getAction = () => {
    switch (clockMode) {
      case ClockMode.Off:
        return startClick;
      case ClockMode.On:
        return stopClick;
      case ClockMode.Paused:
        return continueClick;
    }
  };
  const resetClick = () => {
    clock.resetClock();
    setClockMode(ClockMode.Off);
  };

  return (
    <Stack
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBlock: 13,
      }}
    >
      {setupShortcuts(getAction(), resetClick)}
      <CircularProgress
        variant="determinate"
        value={percent}
        size={300}
        thickness={0.8}
        color="secondary"
        sx={{
          position: "absolute",
          zIndex: -1,
        }}
      />
      <Typography variant="h3">
        {inEssay
          ? "Essay"
          : "Chapter " + (chapterIndex + (clock.settings.withEssay ? 0 : 1))}
      </Typography>
      <Typography variant="h4">
        {hours > 0 ? hours.toString().padStart(2, "0") + " : " : ""}
        {minutes.toString().padStart(2, "0")} :{" "}
        {seconds.toString().padStart(2, "0")}
      </Typography>
      <Stack direction="row">
        <Button
          size="large"
          id="start"
          startIcon={
            {
              [ClockMode.Off]: <StartIcon />,
              [ClockMode.On]: <StopIcon />,
              [ClockMode.Paused]: <ContinueIcon />,
            }[clockMode]
          }
          onClick={getAction()}
        >
          {
            {
              [ClockMode.Off]: "Start",
              [ClockMode.On]: "Stop",
              [ClockMode.Paused]: "Continue",
            }[clockMode]
          }
        </Button>
        <Button
          color="warning"
          size="large"
          startIcon={<ResetIcon />}
          onClick={resetClick}
        >
          Reset
        </Button>
      </Stack>
      <Typography
        variant="caption"
        sx={{
          display:
            (navigator as any).userAgentData.mobile !== true ? "block" : "none",
          marginTop: 2,
        }}
      >
        Hit <b>?</b> to see shortcuts
      </Typography>
    </Stack>
  );
}
