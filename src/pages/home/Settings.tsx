import {
  ExpandMoreRounded as ExpandIcon,
  SettingsRounded as SettingsIcon,
  VisibilityRounded as DisplaySettingsIcon,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  FormControlLabel,
  Switch,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import {
  Clock,
  ClockMode,
  ClockSettings,
  PersistentSettings,
} from "../../services/clock";

const centeredSX: SxProps = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
} as const;
const SettingsSX: SxProps = {
  ...centeredSX,
  marginBottom: ".5rem",
  maxWidth: "98vw",
  width: { xs: "30rem", sm: "35rem", md: "45rem" },
  padding: "0",
} as const;
const AccordionDetailsSX: SxProps = {
  paddingInline: ".5rem",
} as const;
const SettingsSpacing = { xs: 1.5, sm: 2, md: 2.5 } as const;
const SettingsTypographyVariant = "body2" as const;

function SettingsToggle({
  field,
  label,
  settings,
  setSettings,
  stateCounter = 0,
  disabled = false,
  display = true,
}: {
  field: keyof ClockSettings;
  label: string;
  settings: ClockSettings;
  setSettings: (settings: Partial<ClockSettings>) => void;
  stateCounter?: number;
  disabled?: boolean;
  display?: boolean;
}) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        ...centeredSX,
        display: display ? "flex" : "none",
      }}
    >
      <FormControlLabel
        control={
          <Switch
            size="medium"
            disabled={disabled}
            checked={settings[field] as boolean}
            onClick={(event) => {
              setSettings({
                [field]: !settings[field],
              });
            }}
          />
        }
        label={
          <Typography variant={SettingsTypographyVariant}>{label}</Typography>
        }
        labelPlacement="end"
      />
    </Stack>
  );
}

function SettingsNumberInput({
  field,
  settings,
  setSettings,
  disabled = false,
  float = true,
  sx = {},
  devider = 1,
  display = true,
  before = "",
  after = "",
  stateCounter = 0,
}: {
  field: keyof ClockSettings;
  settings: ClockSettings;
  setSettings: (settings: Partial<ClockSettings>) => void;
  disabled?: boolean;
  float?: boolean;
  sx?: SxProps;
  devider?: number;
  display?: boolean;
  before?: string;
  after?: string;
  stateCounter?: number;
}) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        ...centeredSX,
        display: display ? "flex" : "none",
      }}
    >
      <Typography variant={SettingsTypographyVariant}>{before}</Typography>
      <TextField
        sx={sx}
        disabled={disabled}
        inputProps={{ min: 0, max: 99, style: { textAlign: "center" } }}
        type="number"
        variant="standard"
        defaultValue={((settings[field] as number) / devider).toString()}
        onChange={(event) => {
          setSettings({
            [field]:
              (float
                ? parseFloat(event.target.value)
                : parseInt(event.target.value)) * devider,
          });
        }}
      />
      <Typography variant={SettingsTypographyVariant}>{after}</Typography>
    </Stack>
  );
}

function DisplaySettingsSection({
  clockMode,
  clock,
  stateCounter,
  updateState,
}: {
  clockMode: ClockMode;
  clock: Clock;
  stateCounter: number;
  updateState: (stateCounter: number) => void;
}) {
  const _setSettings = (newSettings: Partial<ClockSettings>) => {
    clock.setSettings(newSettings);
    updateState(stateCounter + 1);
  };
  return (
    <Container sx={SettingsSX} maxWidth={false}>
      <Accordion style={{ width: "100%" }}>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DisplaySettingsIcon style={{ marginRight: 6 }} />
            Display Settings
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack
            sx={AccordionDetailsSX}
            spacing={SettingsSpacing}
            direction="column"
          >
            <SettingsToggle
              field="notifyEnds"
              label="Notify when chapters ends"
              settings={clock.settings}
              setSettings={_setSettings}
            />
            <SettingsToggle
              field="resetVisualClockEssay"
              label="Reset clock after easay"
              settings={clock.settings}
              setSettings={(newSettings) => {
                _setSettings({
                  ...newSettings,
                  resetVisualClockChapter:
                    !clock.settings.resetVisualClockEssay,
                });
              }}
            />
            <SettingsToggle
              disabled={!clock.settings.resetVisualClockEssay}
              field="resetVisualClockChapter"
              label="Reset clock after chapters"
              settings={clock.settings}
              setSettings={_setSettings}
            />
            <SettingsToggle
              field="chapterPercent"
              label="Circular bar represents current chapter"
              settings={clock.settings}
              setSettings={_setSettings}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}

function SettingsSection({
  clockMode,
  clock,
  stateCounter,
  updateState,
}: {
  clockMode: ClockMode;
  clock: Clock;
  stateCounter: number;
  updateState: (stateCounter: number) => void;
}) {
  const _setSettings = (newSettings: Partial<ClockSettings>) => {
    clock.setSettings(newSettings);
    updateState(stateCounter + 1);
  };
  const disabled = clockMode !== ClockMode.Off && clockMode !== ClockMode.Done;
  return (
    <Container sx={SettingsSX} maxWidth={false}>
      <Accordion style={{ width: "100%" }}>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography variant="h6" sx={centeredSX}>
            <SettingsIcon style={{ marginRight: 6 }} />
            Time Settings
            <Typography variant="body2" sx={{ marginLeft: 2 }}>
              {disabled ? "reset clock to enable" : ""}
            </Typography>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack
            sx={AccordionDetailsSX}
            spacing={SettingsSpacing}
            direction="column"
          >
            <SettingsToggle
              field="withEssay"
              label="Essay at start"
              settings={clock.settings}
              setSettings={_setSettings}
              disabled={disabled}
            />
            <SettingsNumberInput
              before="Essay"
              after="minutes long"
              sx={{ marginInline: ".5rem" }}
              display={clock.settings.withEssay}
              field="essaySeconds"
              settings={clock.settings}
              setSettings={_setSettings}
              devider={60}
              disabled={disabled}
            />
            <SettingsNumberInput
              after="chapters"
              field="chaptersCount"
              settings={clock.settings}
              setSettings={_setSettings}
              float={false}
              stateCounter={stateCounter}
              disabled={disabled}
            />
            <SettingsNumberInput
              before="Each chapter"
              after="minutes long"
              sx={{ marginInline: ".5rem" }}
              display={
                isNaN(clock.settings.chaptersCount) ||
                clock.settings.chaptersCount > 0
              }
              field="chapterSeconds"
              settings={clock.settings}
              setSettings={_setSettings}
              stateCounter={stateCounter}
              devider={60}
              disabled={disabled}
            />
            <SettingsToggle
              field="notifyMinutesLeft"
              label="Notify when a chapter nears its end"
              stateCounter={stateCounter}
              settings={clock.settings}
              setSettings={_setSettings}
              disabled={disabled}
            />
            <SettingsNumberInput
              before="Notify"
              after="minutes before chapter ends"
              sx={{ marginInline: "0.5em" }}
              display={clock.settings.notifyMinutesLeft}
              field="secondsLeftCount"
              settings={clock.settings}
              setSettings={_setSettings}
              stateCounter={stateCounter}
              devider={60}
              disabled={disabled}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}

export function SettingsComponent({
  clockMode,
  clock,
}: {
  clockMode: ClockMode;
  clock: Clock;
}) {
  const [stateCounter, updateState] = useState(0);
  if (!PersistentSettings.loaded) {
    (async () => {
      const loadedSettings = PersistentSettings.load();
      clock.setSettings(loadedSettings);
      updateState(stateCounter + 1);
    })();
  }
  return (
    <Stack>
      <SettingsSection
        stateCounter={stateCounter}
        updateState={updateState}
        clockMode={clockMode}
        clock={clock}
      />
      <DisplaySettingsSection
        stateCounter={stateCounter}
        updateState={updateState}
        clockMode={clockMode}
        clock={clock}
      />
    </Stack>
  );
}
