import {
  ExpandMoreRounded as ExpandIcon,
  SettingsRounded as SettingsIcon,
  TuneRounded as MoreSettingsIcon
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary, Container,
  FormControlLabel,
  Switch,
  SxProps,
  TextField,
  Typography
} from "@mui/material";
import { Stack } from "@mui/system";
import { useForceUpdate } from "../../hooks/common";
import { ClockMode } from "../../services/clock";
import { ClientSettings } from "./clock-settings";
import { GloablSettingsManager } from "./globals";

export function ClockSettingsComponent({
  clockMode,
}: {
  clockMode: ClockMode;
}) {
  const forceUpdate = useForceUpdate();
  if (!GloablSettingsManager.loaded) {
    GloablSettingsManager.load().then(() => {
      forceUpdate();
    });
  }

  return (
    <Stack>
      <TimeSettings clockMode={clockMode} />
      <MoreSettings clockMode={clockMode} />
    </Stack>
  );
}

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
  disabled = false,
  display = true,
  setSettings = (settings: Partial<ClientSettings>) =>
    GloablSettingsManager.set(settings),
}: {
  field: keyof ClientSettings;
  label: string;
  disabled?: boolean;
  display?: boolean;
  setSettings?: (settings: Partial<ClientSettings>) => void;
}) {
  const value = GloablSettingsManager.get(field) as boolean;
  const forceUpdate = useForceUpdate();
  GloablSettingsManager.changeListeners["SettingsToggle:" + field] = (
    updated
  ) => {
    if (field in updated) forceUpdate();
  };
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
            checked={value}
            onClick={(event) => {
              setSettings({
                [field]: !value,
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
  disabled = false,
  float = true,
  sx = {},
  devider = 1,
  display = true,
  before = "",
  after = "",
  nan = undefined,
  setSettings = (settings: Partial<ClientSettings>) =>
    GloablSettingsManager.set(settings),
}: {
  field: keyof ClientSettings;
  disabled?: boolean;
  float?: boolean;
  sx?: SxProps;
  devider?: number;
  display?: boolean;
  before?: string;
  after?: string;
  nan?: number;
  setSettings?: (settings: Partial<ClientSettings>) => void;
}) {
  const value = GloablSettingsManager.settings[field] as number;
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
        key={value}
        defaultValue={(value / devider).toString()}
        onChange={(event) => {
          let val = float
            ? parseFloat(event.target.value)
            : parseInt(event.target.value);
          if (isNaN(val)) {
            if (nan === undefined) return;
            else val = nan;
          }
          setSettings({
            [field]: val * devider,
          });
        }}
      />
      <Typography variant={SettingsTypographyVariant}>{after}</Typography>
    </Stack>
  );
}

function TimeSettings({ clockMode }: { clockMode: ClockMode }) {
  const disabled = clockMode !== ClockMode.Off && clockMode !== ClockMode.Done;
  const chaptersCount = GloablSettingsManager.get("chaptersCount") as number;
  const withEssay = GloablSettingsManager.get("withEssay") as boolean;
  const forceUpdate = useForceUpdate();
  GloablSettingsManager.changeListeners["TimeSettings"] = (updated) => {
    if ("withEssay" in updated) forceUpdate();
    else if (
      ("chaptersCount" in updated && updated["chaptersCount"] === 0) ||
      chaptersCount === 0
    )
      forceUpdate();
  };
  return (
    <Container sx={SettingsSX} maxWidth={false}>
      <Accordion style={{ width: "100%" }} defaultExpanded={true}>
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
              disabled={disabled}
            />
            <SettingsNumberInput
              before="Essay"
              after="minutes long"
              sx={{ marginInline: ".5rem" }}
              display={withEssay}
              field="essaySeconds"
              devider={60}
              disabled={disabled}
            />
            <SettingsNumberInput
              after="chapters"
              field="chaptersCount"
              float={false}
              disabled={disabled}
            />
            <SettingsNumberInput
              before="Each chapter"
              after="minutes long"
              sx={{ marginInline: ".5rem" }}
              display={isNaN(chaptersCount) || chaptersCount > 0}
              field="chapterSeconds"
              devider={60}
              disabled={disabled}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}

function MoreSettings({ clockMode }: { clockMode: ClockMode }) {
  const notifyMinutesLeft = GloablSettingsManager.get(
    "notifyMinutesLeft"
  ) as boolean;
  const resetVisualClockEssay = GloablSettingsManager.get(
    "resetVisualClockEssay"
  ) as boolean;
  const forceUpdate = useForceUpdate();
  GloablSettingsManager.changeListeners["MoreSettings"] = (updated) => {
    if ("resetVisualClockEssay" in updated || "notifyMinutesLeft" in updated)
      forceUpdate();
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
            <MoreSettingsIcon style={{ marginRight: 6 }} />
            More Settings
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack
            sx={AccordionDetailsSX}
            spacing={SettingsSpacing}
            direction="column"
          >
            <SettingsToggle
              field="notifyMinutesLeft"
              label="Notify when a chapter nears its end"
            />
            <SettingsNumberInput
              before="Notify"
              after="minutes before chapter ends"
              sx={{ marginInline: "0.5em" }}
              display={notifyMinutesLeft}
              field="secondsLeftCount"
              devider={60}
            />
            <SettingsToggle
              field="notifyEnds"
              label="Notify when chapters ends"
            />
            <SettingsToggle
              field="resetVisualClockEssay"
              label="Reset clock after easay"
              setSettings={(newSettings) => {
                GloablSettingsManager.set({
                  ...newSettings,
                  resetVisualClockChapter: !resetVisualClockEssay,
                });
              }}
            />
            <SettingsToggle
              disabled={!resetVisualClockEssay}
              field="resetVisualClockChapter"
              label="Reset clock after chapters"
            />
            <SettingsToggle
              field="chapterPercent"
              label="Circular bar represents current chapter"
            />
            <SettingsToggle field="showReset" label="Show reset button" />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}
