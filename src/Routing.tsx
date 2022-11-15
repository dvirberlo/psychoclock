import { TimerRounded as TitleAppIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import About from "./pages/about";
import Home from "./pages/home";
import NotFound from "./pages/not-found";

type Page = {
  name: string;
  path: string;
  component: JSX.Element;
};
const pages: Page[] = [
  { name: "Home", path: "/", component: <Home /> },
  { name: "About", path: "/about", component: <About /> },
];

export default function Routing() {
  return (
    <BrowserRouter>
      <AppNavBar />
      <Routes>
        {pages.map((page) => (
          <Route key={page.path} path={page.path} element={page.component} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function AppNavBar() {
  const navigate = useNavigate();
  const itemClick = (page: Page) => {
    setTitle(page.name);
    navigate(page.path);
  };
  const [title, setTitle] = useState(pages[0].name);
  return (
    <AppBar component="nav" position="static">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          sx={{ mr: 0.5 }}
        >
          <TitleAppIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PsychoClock
        </Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
        >
          {title}
        </Typography>
        <Box>
          {pages.map((page) => (
            <Button
              key={page.name}
              sx={{ color: "#fff" }}
              onClick={() => itemClick(page)}
            >
              {page.name}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
