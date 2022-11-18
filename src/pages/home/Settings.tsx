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
import { Clock } from "../../services/clock";
import { ClockMode } from "./Home";

export function SettingsToggle({
  clockMode,
  clock,
  field,
  updateState = () => {},
  label,
  disabled = false,
}: {
  clockMode: ClockMode;
  clock: Clock;
  field: keyof Clock["settings"];
  updateState?: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <FormControlLabel
      control={
        <Switch
          disabled={disabled}
          checked={clock.settings[field] as boolean}
          onClick={(event) => {
            clock.setSettings({
              [field]: !clock.settings[field],
            });
            updateState();
          }}
        />
      }
      label={label}
      labelPlacement="end"
    />
  );
}

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

export function SettingsSection({
  clockMode,
  clock,
}: {
  clockMode: ClockMode;
  clock: Clock;
}) {
  return (
    <Container sx={SettingsSX} maxWidth={false}>
      <Accordion
        style={{ width: "100%" }}
        disabled={clockMode !== ClockMode.Off}
        expanded={clockMode === ClockMode.Off}
      >
        <AccordionSummary>
          <Typography variant="h6" sx={centeredSX}>
            <SettingsIcon style={{ marginRight: 6 }} />
            Settings
            <Typography variant="body1" sx={{ marginLeft: 2 }}>
              {clockMode !== ClockMode.Off ? "reset clock to enable" : ""}
            </Typography>
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ paddingInline: ".5rem" }}>
          <Stack sx={centeredSX} spacing={1.5}>
            <Stack direction="row" sx={centeredSX}>
              <SettingsToggle
                clockMode={clockMode}
                clock={clock}
                field="withEssay"
                label="Essay at start"
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
                  clock.setSettings({
                    essaySeconds: parseFloat(event.target.value) * 60,
                  });
                }}
              />
              <Typography>minutes long</Typography>
            </Stack>

            <Stack direction="row" spacing={2} sx={centeredSX}>
              <TextField
                inputProps={{ min: 0, max: 99, style: { textAlign: "center" } }}
                type="number"
                variant="standard"
                defaultValue={clock.settings.chaptersCount.toString()}
                onChange={(event) => {
                  clock.setSettings({
                    chaptersCount: parseFloat(event.target.value),
                  });
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
                  clock.setSettings({
                    chapterSeconds: parseFloat(event.target.value) * 60,
                  });
                }}
              />
              <Typography>minutes long</Typography>
            </Stack>

            <FormControlLabel
              control={
                <Switch
                  checked={clock.settings.notifyMinutesLeft}
                  onClick={(event) => {
                    clock.setSettings({
                      notifyMinutesLeft: !clock.settings.notifyMinutesLeft,
                    });
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
                      clock.setSettings({
                        secondsLeftCount: parseFloat(event.target.value) * 60,
                      });
                    }}
                  />
                  minutes
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

export function DisplaySettingsSection({
  clockMode,
  clock,
}: {
  clockMode: ClockMode;
  clock: Clock;
}) {
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
              clockMode={clockMode}
              clock={clock}
              field="notifyEnds"
              label="Notify when chapter or essay ends"
            />
            <SettingsToggle
              clockMode={clockMode}
              clock={clock}
              field="resetVisualClockEssay"
              label="Reset clock when easay ends"
            />
            <SettingsToggle
              disabled={!clock.settings.resetVisualClockEssay}
              clockMode={clockMode}
              clock={clock}
              field="resetVisualClockChapter"
              label="Reset clock when chapter ends"
            />
            <SettingsToggle
              clockMode={clockMode}
              clock={clock}
              field="totalPercent"
              label="Circular progress bar shows total percent"
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}
