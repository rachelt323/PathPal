import React, { useRef, useState } from "react";
import { Grid, TextField, Button, Box, Input } from "@mui/material";
import Autocomplete from "react-google-autocomplete";
import { usePlacesWidget } from "react-google-autocomplete";
import { useNavigate } from "react-router-dom";
export default function HomePage() {
  const [thePlace, setPlace] = useState(null);
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const { ref: materialRef } = usePlacesWidget({
    apiKey: process.env.REACT_APP_MAPS_KEY,
    onPlaceSelected: (place) => setPlace(place),
    inputAutocompleteValue: "country",
  });
  async function handleCreate() {
    try {
      const res = await fetch("http://localhost:3001/api/plan/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: "Trip to " + thePlace.formatted_address,
          place: thePlace.formatted_address,
          lat: thePlace.geometry.location.lat(),
          lng: thePlace.geometry.location.lng(),
          lists: [],
        }),
      });
      const data = await res.json();
      navigate(`/plan/${data._id}`);
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  }
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
        <div style={{ width: "250px", marginTop: "20px" }}>
          <TextField
            fullWidth
            color="secondary"
            variant="outlined"
            inputRef={materialRef}
          />
        </div>
      </Box>

      <Button onClick={handleCreate} variant="contained">
        Begin
      </Button>
    </Box>
  );
}
