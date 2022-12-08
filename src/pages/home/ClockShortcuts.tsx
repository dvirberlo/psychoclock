import { Dialog, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";

const ClockShortcuts = {
  toggle: { key: "E", details: "Toggle Clock On/Off" },
  reset: { key: "R", details: "Reset Clock" },
  showShortcuts: { key: "?", details: "Show Shortcuts" },
} as const;

let _setDialogOpen = (b: boolean) => {},
  _toggle = () => {},
  _reset = () => {};

document.addEventListener("keydown", (e) => {
  let captured = true;
  switch (e.key) {
    case ClockShortcuts.toggle.key:
      _toggle();
      break;
    case ClockShortcuts.reset.key:
      _reset();
      break;
    case ClockShortcuts.showShortcuts.key:
      _setDialogOpen(true);
      break;
    default:
      captured = false;
  }
  if (captured) e.preventDefault();
});

export function ClockShortcutsDialog({
  toggle,
  reset,
}: {
  toggle: () => void;
  reset: () => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  _setDialogOpen = setDialogOpen;
  _toggle = toggle;
  _reset = reset;
  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <Typography
        color="primary"
        variant="h5"
        sx={{ paddingBlock: 2, paddingInline: 10 }}
      >
        Shortcuts
      </Typography>
      <Stack spacing={2} sx={{ padding: 2 }}>
        {Object.entries(ClockShortcuts).map(([key, value]) => (
          <Typography key={key}>
            <b style={{ marginRight: 6 }}>{value.key}</b> {value.details}
          </Typography>
        ))}
        <Typography>
          <b style={{ marginRight: 6 }}>Esc</b> Close this dialog
        </Typography>
      </Stack>
    </Dialog>
  );
}
