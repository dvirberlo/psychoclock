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
          />
          Psycho Clock
        </Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
        >
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8145571465576979"
            crossOrigin="anonymous"
          ></script>
          {/* <!-- Horizontal Ad --> */}
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-8145571465576979"
            data-ad-slot="8731925237"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
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
