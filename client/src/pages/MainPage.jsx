import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import ImageCarousel from "../components/ImageCarousel/ImageCarousel";
import { usePlacesWidget } from "react-google-autocomplete";

const useStyles = {
  button: {
    backgroundColor: "#4F6F52",
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: "#1A4D2E",
    },
    marginBottom: "20px",
  },
  box: {
    backgroundColor: "#F5EFE6",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #E8DFCA",
  },
  gridContainer: {
    backgroundColor: "#F5EFE6",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #E8DFCA",
  },
  loading: {
    color: "#1A4D2E",
    fontSize: "20px",
    textAlign: "center",
  },
};

export default function MainPage() {
  const [userPlans, setUserPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thePlace, setPlace] = useState(null); // To handle place selection
  const navigate = useNavigate();

  const { ref: materialRef } = usePlacesWidget({
    apiKey: process.env.REACT_APP_MAPS_KEY,
    onPlaceSelected: (place) => setPlace(place),
    inputAutocompleteValue: "country",
  });

  const getUserInfo = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/plan", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      setUserPlans(data);
    } catch (error) {
      console.error("An error occurred", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
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
  };

  const onDelete = async (plan_id, planIndex) => {
    try {
      await fetch(`http://localhost:3001/api/plan/${plan_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "applications/json",
        },
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    }
    const newPlans = userPlans.filter((item, idx) => idx !== planIndex);
    setUserPlans(newPlans);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  if (loading) {
    return <div style={useStyles.loading}>Loading...</div>;
  }

  return (
    <>
      <Header />
      <Box style={useStyles.box}>
        {/* Display Existing Trips */}
        <ImageCarousel userPlans={userPlans} onDelete={onDelete} />

        {/* Plan a New Trip Section */}
        <Box mt={4} textAlign="center">
          <Box sx={{ fontWeight: "bold", typography: "h4", marginBottom: "20px" }}>
            Plan a new trip
          </Box>

          <div style={{ width: "250px", marginBottom: "20px" }}>
            <TextField
              fullWidth
              color="secondary"
              variant="outlined"
              inputRef={materialRef}
              placeholder="Enter location"
            />
          </div>

          <Button onClick={handleCreate} variant="contained" style={useStyles.button}>
            Begin
          </Button>
        </Box>
      </Box>
    </>
  );
}
