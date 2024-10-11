import React, { useRef, useState } from "react";
import { Grid, TextField, Button, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Header from "../components/Header/Header";
import { usePlacesWidget } from "react-google-autocomplete";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function HomePage() {
  const [thePlace, setPlace] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
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
          fromDate: fromDate ? dayjs(fromDate).toISOString() : null,
          toDate: toDate ? dayjs(toDate).toISOString() : null,
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
    <>
      <Header />
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

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <DatePicker
                label="Start Date"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item>
              <DatePicker
                label="End Date"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>

        <Button onClick={handleCreate} variant="contained" sx={{ mt: 3 }}>
          Begin
        </Button>
      </Box>
    </>
  );
}
