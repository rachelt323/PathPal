import React, { useState, useEffect } from "react";
import { Grid, Box, Button, ListItem } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import DisplayList from "../components/DisplayList/DisplayList";
import { getPlanInfo } from "../api/api";

export default function Plan() {
  const [planInfo, setPlanInfo] = useState(null);
  const { planCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getPlanInfo(planCode).then((data) => setPlanInfo(data));
  }, [planCode]);

  if (!planInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => {
          navigate(`/plan/${planCode}/explore`);
        }}
      >
        Explore Places
      </Button>
      <Grid container>
        <Grid item xs={6}>
          <Box>
            <h1>{planInfo.title}</h1>
            {planInfo.lists?.map((listItem) => (
              <DisplayList code={listItem} key={listItem} />
            ))}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <h1>Map</h1>
        </Grid>
      </Grid>
    </div>
  );
}
