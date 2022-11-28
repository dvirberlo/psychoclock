import { Button, Stack, Typography } from "@mui/material";
import { Container } from "@mui/system";

export default function About() {
  return (
    <Container
      sx={{
        paddingTop: 3,
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h2">About</Typography>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            This web app was build in one day using React(Vite), TypeScript, and
            MUI.
            <br />
            It is a modern and customizable clock to simulate a psychometric
            test.
            <br />
            Its focus is modern and simple design, yet packed with features.
            <br />
          </Typography>
          <Button
            sx={{
              maxWidth: 200,
            }}
            onClick={() =>
              (document.location.href = "https://github.com/dvirberlo")
            }
          >
            Made by @dvirberlo
          </Button>
        </div>
      </Stack>
    </Container>
  );
}
