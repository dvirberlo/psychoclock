import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Page } from "../Routing";

export default function AppNavBar({ pages }: { pages: Page[] }) {
  const navigate = useNavigate();
  const itemClick = (page: Page) => {
    navigate(page.path);
  };
  return (
    <AppBar component="nav" position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <img
            src="/icons/app-color.svg"
            style={{ width: "1.5rem", marginRight: 4 }}
            alt="App Icon"
          />
          Psycho Clock
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
