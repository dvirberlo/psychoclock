import {
  PauseRounded as StopIcon,
  PlayArrowRounded as ContinueIcon,
  PlayCircleFilledRounded as StartIcon,
  RestartAltRounded as ResetIcon,
} from "@mui/icons-material";
import { Button, CircularProgress, Container, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { useForceUpdate } from "../../hooks/common";
import { Clock, ClockMode } from "../../services/clock";
import { ClockShortcutsDialog } from "./ClockShortcuts";
import {
  GloablSettingsManager,
  GlobalClock,
  GlobalViewUpdater,
} from "./globals";
import "./Home.css";
import { ClockSettingsComponent } from "./Settings";

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
      {ClockDisplay(GlobalClock, clockMode, setClockMode)}
      <ClockSettingsComponent clockMode={clockMode} />
    </Container>
  );
}

function ClockDisplay(
  clock: Clock,
  clockMode: ClockMode,
  setClockMode: (mode: ClockMode) => void
) {
  const forceUpdate = useForceUpdate();
  GlobalViewUpdater.state.mode = clockMode;

  GlobalViewUpdater.stateCB = () => {
    if (GlobalViewUpdater.state.mode !== clockMode)
      setClockMode(GlobalViewUpdater.state.mode);
    forceUpdate();
  };

  const startClick = () => {
    clock.start();
    GlobalViewUpdater.activate();
  };
  const stopClick = () => {
    GlobalViewUpdater.now();
    clock.stop();
    GlobalViewUpdater.deactivate();
    setClockMode(ClockMode.Paused);
  };
  const continueClick = () => {
    clock.continue();
    GlobalViewUpdater.activate();
  };
  const getAction = () => {
    switch (GlobalViewUpdater.state.mode) {
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
    GlobalViewUpdater.deactivate();
    GlobalViewUpdater.now();
  };

  const showReset = GloablSettingsManager.get("showReset") as boolean;
  GloablSettingsManager.changeListeners["home"] = (updated) => {
    if ("showReset" in updated) forceUpdate();
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
      <ClockShortcutsDialog toggle={getAction()} reset={resetClick} />
      <CircularProgress
        variant="determinate"
        value={GlobalViewUpdater.state.percent}
        size={300}
        thickness={0.8}
        color="secondary"
        sx={{
          position: "absolute",
          zIndex: -1,
        }}
      />
      <Typography variant="h3">
        {GlobalViewUpdater.state.inEssay
          ? "Essay"
          : "Chapter " + GlobalViewUpdater.state.chapterIndex}
      </Typography>
      <Typography variant="h4">
        {GlobalViewUpdater.state.hours > 0
          ? GlobalViewUpdater.state.hours.toString().padStart(2, "0") + " : "
          : ""}
        {GlobalViewUpdater.state.minutes.toString().padStart(2, "0")} :{" "}
        {GlobalViewUpdater.state.seconds.toString().padStart(2, "0")}
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
            }[GlobalViewUpdater.state.mode]
          }
          onClick={getAction()}
          className={
            {
              [ClockMode.Off]: "flickering",
              [ClockMode.Done]: "flickering",
              [ClockMode.On]: "",
              [ClockMode.Paused]: "flickering",
            }[GlobalViewUpdater.state.mode]
          }
        >
          {
            {
              [ClockMode.Off]: "Start",
              [ClockMode.Done]: "Start",
              [ClockMode.On]: "Stop",
              [ClockMode.Paused]: "Continue",
            }[GlobalViewUpdater.state.mode]
          }
        </Button>
        <Button
          style={{ display: showReset ? "flex" : "none" }}
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
