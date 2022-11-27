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
};
const SettingsSX: SxProps = {
  ...centeredSX,
  marginBottom: ".5rem",
  maxWidth: { xs: "30rem%", sm: "35rem", md: "45rem" },
  width: "100%",
  padding: "0",
};
const SettingsTypographyVariant = "body2" as const;

function SettingsToggle({
  field,
  label,
  disabled = false,
  settings,
  setSettings,
  stateCounter = 0,
}: {
  field: keyof ClockSettings;
  label: string;
  disabled?: boolean;
  settings: ClockSettings;
  setSettings: (settings: Partial<ClockSettings>) => void;
  stateCounter?: number;
}) {
  return (
    <FormControlLabel
      control={
        <Switch
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
  stateCounter = 0,
}: {
  field: keyof ClockSettings;
  settings: ClockSettings;
  setSettings: (settings: Partial<ClockSettings>) => void;
  disabled?: boolean;
  float?: boolean;
  sx?: SxProps;
  devider?: number;
  stateCounter?: number;
}) {
  return (
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
        <AccordionDetails sx={{ paddingInline: ".5rem" }}>
          <Stack sx={centeredSX} spacing={1.5}>
            <SettingsToggle
              field="notifyEnds"
              label="Notify when chapter or essay ends"
              settings={clock.settings}
              setSettings={_setSettings}
            />
            <SettingsToggle
              field="resetVisualClockEssay"
              label="Reset clock when easay ends"
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
              label="Reset clock when chapter ends"
              settings={clock.settings}
              setSettings={_setSettings}
            />
            <SettingsToggle
              field="totalPercent"
              label="Circular progress bar shows total percent"
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
  const [expanded, setExpanded] = useState(false);
  const _setSettings = (newSettings: Partial<ClockSettings>) => {
    clock.setSettings(newSettings);
    updateState(stateCounter + 1);
  };
  const active = clockMode !== ClockMode.Off && clockMode !== ClockMode.Done;
  if (active && expanded) setExpanded(false);
  return (
    <Container sx={SettingsSX} maxWidth={false}>
      <Accordion
        style={{ width: "100%" }}
        disabled={clockMode !== ClockMode.Off && clockMode !== ClockMode.Done}
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
      >
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography variant="h6" sx={centeredSX}>
            <SettingsIcon style={{ marginRight: 6 }} />
            Settings
            <Typography variant="body2" sx={{ marginLeft: 2 }}>
              {active ? "reset clock to enable" : ""}
            </Typography>
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ paddingInline: ".5rem" }}>
          <Stack sx={centeredSX} spacing={1.5}>
            <Stack direction="row" sx={centeredSX}>
              <SettingsToggle
                field="withEssay"
                label="Essay at start"
                settings={clock.settings}
                setSettings={_setSettings}
              />
              <SettingsNumberInput
                sx={{ marginInline: ".5rem" }}
                disabled={!clock.settings.withEssay}
                field="essaySeconds"
                settings={clock.settings}
                setSettings={_setSettings}
                devider={60}
              />
              <Typography variant={SettingsTypographyVariant}>
                minutes long
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} sx={centeredSX}>
              <SettingsNumberInput
                field="chaptersCount"
                settings={clock.settings}
                setSettings={_setSettings}
                float={false}
                stateCounter={stateCounter}
              />
              <Typography variant={SettingsTypographyVariant}>
                chapters.
              </Typography>
              <Typography variant={SettingsTypographyVariant}>each</Typography>
              <SettingsNumberInput
                disabled={clock.settings.chaptersCount < 1}
                field="chapterSeconds"
                settings={clock.settings}
                setSettings={_setSettings}
                stateCounter={stateCounter}
                devider={60}
              />
              <Typography variant={SettingsTypographyVariant}>
                minutes long
              </Typography>
            </Stack>

            <FormControlLabel
              control={
                <Switch
                  checked={clock.settings.notifyMinutesLeft}
                  onClick={(event) => {
                    _setSettings({
                      notifyMinutesLeft: !clock.settings.notifyMinutesLeft,
                    });
                  }}
                />
              }
              label={
                <Stack direction="row" alignItems="center">
                  <Typography variant={SettingsTypographyVariant}>
                    Notify when chapter or essay ends in
                  </Typography>
                  <SettingsNumberInput
                    sx={{ marginInline: "0.5em" }}
                    disabled={!clock.settings.notifyMinutesLeft}
                    field="secondsLeftCount"
                    settings={clock.settings}
                    setSettings={_setSettings}
                    stateCounter={stateCounter}
                    devider={60}
                  />
                  <Typography variant={SettingsTypographyVariant}>
                    minutes
                  </Typography>
                </Stack>
              }
              labelPlacement="end"
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
