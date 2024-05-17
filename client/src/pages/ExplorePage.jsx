import React, { useState, useEffect } from "react";
import { CssBaseline, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { getPlacesInfo, getPlanInfo } from "../api/api.js";
import Map from "../components/Map/Map";
import List from "../components/List/List";

export default function ExplorePage() {
  const [coords, setCoords] = useState(null);
  const [type, setType] = useState("restaurants");
  const [places, setPlaces] = useState([]);
  const { planCode } = useParams();

  useEffect(() => {
    getPlanInfo(planCode).then((data) =>
      setCoords({ lat: data.lat, lng: data.lng })
    );
  }, [planCode]);

  useEffect(() => {
    if (coords) {
      getPlacesInfo(type, coords.lat, coords.lng).then((data) =>
        setPlaces(data)
      );
    }
  }, [coords, type]);

  if (!coords) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CssBaseline />
      <Grid container>
        <Grid item xs={12} md={4}>
          <List type={type} setType={setType} places={places} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map />
        </Grid>
      </Grid>
    </>
  );
}
