import * as React from "react";
import { Grid, TextField, Button, Box } from "@mui/material";

export default function HomePage() {
  return (
    <Box
      alignItems="center"
      justifyContent="center"
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      width="100%"
    >
      <Box m={4} sx={{ fontWeight: "bold", typography: "h1" }}>
        Plan a new trip
      </Box>

      <Box mb={4}>
        <TextField id="outlined-basic" label="Destination" variant="outlined" />
      </Box>

      <Button variant="contained">Begin</Button>
    </Box>
  );
}
