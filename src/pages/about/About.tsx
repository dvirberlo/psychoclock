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
              whiteSpace: "pre-line",
            }}
          >
            This web app was build in one day using React(Vite), TypeScript, and
            MUI.
            {"\n"}
            It is a modern and customizable clock to simulate a psychometric
            test.
            {"\n"}
            Its focus is modern and simple design, yet packed with features.
          </Typography>
          <Button
            onClick={() =>
              (document.location.href = "https://github.com/dvirberlo")
            }
          >
            Made by @dvirberlo
          </Button>
          <Button
            onClick={() =>
              (document.location.href =
                "https://github.com/dvirberlo/psychoclock")
            }
          >
            Source on GitHub
          </Button>
        </div>
      </Stack>
    </Container>
  );
}
