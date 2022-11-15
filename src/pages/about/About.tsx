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
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          This web app was build in one day using React, TypeScript, and MUI.
          <br />
          It's a simple clock app for those who want to simulate a psychometric
          test.
          <br />
        </Typography>
        <Button
          onClick={() =>
            (document.location.href = "https://github.com/dvirberlo")
          }
        >
          Made by @dvirberlo
        </Button>
      </Stack>
    </Container>
  );
}
