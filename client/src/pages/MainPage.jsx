import React, { useState, useEffect } from "react";
import { Grid, Box, Button } from "@mui/material";
import PlanCard from "../components/PlanCard/PlanCard";
import { useNavigate } from "react-router-dom";
import Plan from "./Plan";

export default function MainPage() {
  const [userPlans, setUserPlans] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
  const handleClick = () => {
    navigate("/plan/create");
  };
  useEffect(() => {
    getUserInfo();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Box>
      <Button onClick={handleClick} variant="contained">
        Plan new trip
      </Button>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {userPlans.map((plan) => (
          <Grid item key={plan._id}>
            <PlanCard userPlan={plan} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
