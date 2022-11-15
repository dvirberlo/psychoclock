import { Typography } from "@mui/material";
import { Container } from "@mui/system";

export default function NotFound() {
  return (
    <Container className="not-found">
      <Typography variant="h2">404</Typography>
      <Typography>
        Sorry, the page you were looking for was not found.
      </Typography>
    </Container>
  );
}
