import React, { useState, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import ImageCarousel from "../components/ImageCarousel/ImageCarousel";
import { usePlacesWidget } from "react-google-autocomplete";
import './MainPage.css'; // Import the CSS file
import './PathPal.mp4';

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
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <video className="background-video" autoPlay={true} muted loop>
          <source src={require("./PathPal.mp4")} type="video/mp4"/>
       </video>
       
      <Header />
      <Box className="box">
        {/* Display Existing Trips */}
        <ImageCarousel userPlans={userPlans} onDelete={onDelete} />
      </Box>

      {/* Plan a New Trip Section */} 
      <div className="shadow">
      <Box className="newTripSection">
        <Box className="tripHeader">
        <br />Plan a new trip
        </Box>

        <div className="inputField">
          <input text="text" placeholder="Enter location" />
          {/*
          <TextField
            fullWidth
            color="secondary"
            variant="outlined"
            inputRef={materialRef}
            placeholder="Enter location"
          />
  \         */}

        </div>

        <Button onClick={handleCreate} variant="contained" className="beginButton">
          Begin
        </Button>
      </Box>
      </div>
    </>
  );
}
