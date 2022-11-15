import { createTheme, CssBaseline, Theme, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import Routing from "./Routing";

const theme: Theme = createTheme({
  palette: {
    mode: "dark",
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routing />
    </ThemeProvider>
  </React.StrictMode>
);
