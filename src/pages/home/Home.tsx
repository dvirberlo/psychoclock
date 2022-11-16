import {
  ExpandMoreRounded as ExpandIcon,
  PlayArrowRounded as ContinueIcon,
  PlayCircleFilledRounded as StartIcon,
  RestartAltRounded as ResetIcon,
  SettingsRounded as SettingsIcon,
  PauseRounded as StopIcon,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { Clock, ClockCB } from "./clock";

enum ClockMode {
  On,
  Off,
  Paused,
}

const clock = new Clock();

export default function Home() {
  const [clockMode, setClockMode] = useState<ClockMode>(ClockMode.Off);

  clock.finishedCB = () => setClockMode(ClockMode.Off);

  return (
    <Container sx={{ paddingTop: 3 }}>
      {ClockDisplay(clockMode, setClockMode, clock)}
      {SettingsDisplay(clockMode, clock)}
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
  const [minutes, setMinutes] = useState<number>(clock.state.seconds);
  const [seconds, setSeconds] = useState<number>(clock.state.seconds);
  const [inEssay, setInEssay] = useState<boolean>(clock.settings.withEssay);
  clock.clockCB = (state: ClockCB) => {
    if (chapterIndex !== state.chapterIndex)
      setChapterIndex(state.chapterIndex);
    if (minutes !== state.minutes) setMinutes(state.minutes);
    if (seconds !== state.seconds) setSeconds(state.seconds);
    if (inEssay !== state.inEssay) setInEssay(state.inEssay);
  };

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
  const resetClick = () => {
    clock.resetClock();
    setClockMode(ClockMode.Off);
  };
  return (
    <Stack
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Typography variant="h6">
        {inEssay ? "Essay" : "Chapter " + chapterIndex}
      </Typography>
      <Typography variant="h6">
        {minutes.toString().padStart(2, "0")} :{" "}
        {seconds.toString().padStart(2, "0")}
      </Typography>
      <Button
        id="start"
        startIcon={
          {
            [ClockMode.Off]: <StartIcon />,
            [ClockMode.On]: <StopIcon />,
            [ClockMode.Paused]: <ContinueIcon />,
          }[clockMode]
        }
        onClick={
          {
            [ClockMode.Off]: startClick,
            [ClockMode.On]: stopClick,
            [ClockMode.Paused]: continueClick,
          }[clockMode]
        }
      >
        {
          {
            [ClockMode.Off]: "Start",
            [ClockMode.On]: "Stop",
            [ClockMode.Paused]: "Continue",
          }[clockMode]
        }
      </Button>
      <Button startIcon={<ResetIcon />} onClick={resetClick}>
        Reset
      </Button>
    </Stack>
  );
}

function SettingsDisplay(clockMode: ClockMode, clock: Clock) {
  const [counter, stateUpdated] = useState(0);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "1rem",
      }}
    >
      <Accordion>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SettingsIcon />
            Settings
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ paddingInline: ".5rem" }}>
          <Stack
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            spacing={1.5}
          >
            <Stack
              direction="row"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={clock.settings.withEssay}
                    onClick={(event) => {
                      clock.settings.withEssay = !clock.settings.withEssay;
                      stateUpdated(counter + 1);
                    }}
                  />
                }
                label="Essay at start"
                labelPlacement="end"
              />
              <TextField
                sx={{
                  marginInline: ".5rem",
                }}
                disabled={!clock.settings.withEssay}
                inputProps={{ min: 0, max: 99, style: { textAlign: "center" } }}
                type="number"
                variant="standard"
                defaultValue={(clock.settings.essaySeconds / 60).toString()}
                onChange={(event) => {
                  clock.settings.essaySeconds =
                    parseFloat(event.target.value) * 60;
                  stateUpdated(counter + 1);
                  console.log(clock.settings.essaySeconds);
                }}
              />
              <Typography>minutes long</Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TextField
                inputProps={{ min: 0, max: 99, style: { textAlign: "center" } }}
                type="number"
                variant="standard"
                defaultValue={clock.settings.chaptersCount.toString()}
                onChange={(event) => {
                  clock.settings.chaptersCount = parseFloat(event.target.value);
                  stateUpdated(counter + 1);
                  console.log(clock.settings.chaptersCount);
                }}
              />
              <Typography> chapters.</Typography>
              <Typography>each</Typography>
              <TextField
                disabled={clock.settings.chaptersCount < 1}
                inputProps={{ min: 0, max: 99, style: { textAlign: "center" } }}
                type="number"
                variant="standard"
                defaultValue={(clock.settings.chapterSeconds / 60).toString()}
                onChange={(event) => {
                  clock.settings.chapterSeconds =
                    parseFloat(event.target.value) * 60;
                  stateUpdated(counter + 1);
                  console.log(clock.settings.chapterSeconds);
                }}
              />
              <Typography>minutes long</Typography>
            </Stack>

            <FormControlLabel
              control={
                <Switch
                  checked={clock.settings.notifyMinutesLeft}
                  onClick={(event) => {
                    clock.settings.notifyMinutesLeft =
                      !clock.settings.notifyMinutesLeft;
                    stateUpdated(counter + 1);
                  }}
                />
              }
              label={
                <Stack direction="row" alignItems="center">
                  <Typography>Notify when chapter or essay ends in</Typography>
                  <TextField
                    sx={{ marginInline: "0.5em" }}
                    margin="none"
                    disabled={!clock.settings.notifyMinutesLeft}
                    inputProps={{
                      min: 0,
                      max: 99,
                      style: { textAlign: "center" },
                    }}
                    type="number"
                    variant="standard"
                    defaultValue={(
                      clock.settings.secondsLeftCount / 60
                    ).toString()}
                    onChange={(event) => {
                      clock.settings.secondsLeftCount =
                        parseFloat(event.target.value) * 60;
                      stateUpdated(counter + 1);
                      console.log(clock.settings.secondsLeftCount);
                    }}
                  />
                  minutes
                </Stack>
              }
              labelPlacement="end"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={clock.settings.notifyEnds}
                  onClick={(event) => {
                    clock.settings.notifyEnds = !clock.settings.notifyEnds;
                    stateUpdated(counter + 1);
                  }}
                />
              }
              label="Notify when chapter or essay ends"
              labelPlacement="end"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={clock.settings.resetVisualClockEssay}
                  onClick={(event) => {
                    clock.settings.resetVisualClockEssay =
                      !clock.settings.resetVisualClockEssay;
                    stateUpdated(counter + 1);
                  }}
                />
              }
              label="Reset clock when easay ends"
              labelPlacement="end"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={clock.settings.resetVisualClockChapter}
                  onClick={(event) => {
                    clock.settings.resetVisualClockChapter =
                      !clock.settings.resetVisualClockChapter;
                    stateUpdated(counter + 1);
                  }}
                />
              }
              label="Reset clock when chapter ends"
              labelPlacement="end"
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
