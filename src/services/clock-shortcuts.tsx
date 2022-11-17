import { Dialog, DialogTitle, Typography } from "@mui/material";
import { Container, Stack } from "@mui/system";
import { useState } from "react";

export const ClockShortcuts = {
  toggle: { key: "E", details: "Toggle Clock On/Off" },
  reset: { key: "R", details: "Reset Clock" },
  question: { key: "Q", details: "Move to next question" },
  showShortcuts: { key: "?", details: "Show Shortcuts" },
};

export function setupShortcuts(
  toggle: () => void,
  reset: () => void,
  question: () => void
) {
  const [dialogOpen, setDialogOpen] = useState(false);
  document.onkeydown = (e) => {
    let captured = true;
    switch (e.key) {
      case ClockShortcuts.toggle.key:
        toggle();
        break;
      case ClockShortcuts.reset.key:
        reset();
        break;
      case ClockShortcuts.question.key:
        question();
        break;
      case ClockShortcuts.showShortcuts.key:
        setDialogOpen(true);
        break;
      default:
        captured = false;
    }
    if (captured) e.preventDefault();
  };
  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle>Shortcuts</DialogTitle>
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
