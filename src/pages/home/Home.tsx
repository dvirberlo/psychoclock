import {
  PauseRounded as StopIcon,
  PlayArrowRounded as ContinueIcon,
  PlayCircleFilledRounded as StartIcon,
  RestartAltRounded as ResetIcon,
} from "@mui/icons-material";
import { Button, CircularProgress, Container, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { Clock, ClockMode, ViewUpdater } from "../../services/clock";
import { setupShortcuts } from "../../services/clock-shortcuts";
import { SettingsComponent } from "./Settings";

const clock = new Clock();
const CLOCK_INTERVAL = 500;
const viewUpdater = new ViewUpdater(CLOCK_INTERVAL, clock);
let timeout: NodeJS.Timeout | undefined;

export default function Home() {
  const [clockMode, setClockMode] = useState<ClockMode>(ClockMode.Off);
  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        paddingInline: ".3rem",
      }}
    >
      {ClockDisplay(clock, clockMode, setClockMode)}
      <SettingsComponent clock={clock} clockMode={clockMode} />
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
  clock: Clock,
  clockMode: ClockMode,
  setClockMode: (mode: ClockMode) => void
) {
  const [mode, setMode] = useState(clockMode);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [percent, setPercent] = useState(0);
  const [inEssay, setInEssay] = useState(true);

  viewUpdater.stateCB = (state) => {
    if (state.mode !== mode) setMode(state.mode);
    if (state.hours !== hours) setHours(state.hours);
    if (state.minutes !== minutes) setMinutes(state.minutes);
    if (state.seconds !== seconds) setSeconds(state.seconds);
    if (state.chapterIndex !== chapterIndex)
      setChapterIndex(state.chapterIndex);
    if (state.percent !== percent) setPercent(state.percent);
    if (state.inEssay !== inEssay) setInEssay(state.inEssay);
  };
  if (mode !== clockMode) setClockMode(mode);

  const startClick = () => {
    clock.start();
    viewUpdater.activate();
  };
  const stopClick = () => {
    viewUpdater.now();
    clock.stop();
    viewUpdater.deactivate();
    setMode(ClockMode.Paused);
  };
  const continueClick = () => {
    clock.continue();
    viewUpdater.activate();
  };
  const getAction = () => {
    switch (mode) {
      case ClockMode.Off:
      case ClockMode.Done:
        return startClick;
      case ClockMode.On:
        return stopClick;
      case ClockMode.Paused:
        return continueClick;
    }
  };
  const resetClick = () => {
    clock.reset();
    viewUpdater.deactivate();
    viewUpdater.now();
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
        {inEssay ? "Essay" : "Chapter " + chapterIndex}
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
              [ClockMode.Done]: <StartIcon />,
              [ClockMode.On]: <StopIcon />,
              [ClockMode.Paused]: <ContinueIcon />,
            }[mode]
          }
          onClick={getAction()}
        >
          {
            {
              [ClockMode.Off]: "Start",
              [ClockMode.Done]: "Start",
              [ClockMode.On]: "Stop",
              [ClockMode.Paused]: "Continue",
            }[mode]
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
