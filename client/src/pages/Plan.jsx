import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";

export default function Plan() {
  const [planInfo, setPlanInfo] = useState(null);
  const { planCode } = useParams();

  const getPlanInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/plan/${planCode}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch plan info");
      }
      const data = await response.json();
      setPlanInfo(data);
    } catch (error) {
      console.log("Error fetching plan:", error);
    }
  };

  useEffect(() => {
    getPlanInfo();
  }, [planCode]);

  if (!planInfo) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container>
      <Grid item xs={4}>
        <h1>{planInfo.title}</h1>
      </Grid>
      <Grid item xs={8}>
        <h1>Map</h1>
      </Grid>
    </Grid>
  );
}
