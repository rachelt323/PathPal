import React, { useState, useEffect } from "react";
import { CssBaseline, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { getPlacesInfo, getPlanInfo } from "../../util/api.js";
import Map from "../../components/Map/Map";
import ExploreList from "../../components/ExploreList/ExploreList";
import Header from "../../components/Header/Header.jsx";
import "./ExplorePage.css"; // Import the CSS file

export default function ExplorePage() {
  const [coords, setCoords] = useState(null);
  const [type, setType] = useState("restaurants");
  const [places, setPlaces] = useState([]);
  const [lists, setLists] = useState([]);
  const { planCode } = useParams();

  const getList = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/list/all/${planCode}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);
      setLists(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlanInfo(planCode).then((data) =>
      setCoords({ lat: data.lat, lng: data.lng })
    );
    getList();
  }, [planCode]);

  useEffect(() => {
    if (coords) {
      console.log(coords);
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
      <Header />
      <Grid container>
        <Grid item xs={12} md={4} className="explore-list-container">
          <ExploreList
            plan={planCode}
            type={type}
            setType={setType}
            places={places}
            lists={lists}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map coords={coords} places={places} />
        </Grid>
      </Grid>
    </>
  );
}
