import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import {
  FormControl,
  TextField,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import "./PlanMap.css";

const Marker = ({ place, text, hovered, color, setCenter }) => (
  <div
    className={`custom-marker ${hovered ? "hovered" : ""}`}
    style={{
      backgroundColor: color,
    }}
    onClick={() => {
      console.log("called");
      setCenter({ lat: place.lat, lng: place.lng });
    }}
  >
    <div className="inner-circle">{text}</div>
    <div className="tooltip" style={hovered ? { display: "block" } : {}}>
      {place.name}
    </div>
  </div>
);

export default function PlanMap({ places, coords, setChildClicked }) {
  const [hover, setHover] = useState(null);
  const [listColors, setListColors] = useState([]);
  const [center, setCenter] = useState({
    lat: coords.lat,
    lng: coords.lng,
  });

  // Function to generate a random color
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    setListColors(places.map(() => getRandomColor()));
  }, [places]);

  const onChildMouseEnter = (child) => {
    setHover(child);
  };

  const onChildMouseLeave = () => {
    setHover(null);
  };

  const defaultProps = {
    center: {
      lat: coords.lat,
      lng: coords.lng,
    },
    zoom: 15,
  };

  return (
    <div
      style={{
        height: "calc(100vh - 64px)",
        width: "100%",
        position: "relative",
      }}
    >
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_KEY }}
        center={center}
        defaultZoom={defaultProps.zoom}
        onChildMouseEnter={(child) => onChildMouseEnter(child)}
        onChildMouseLeave={onChildMouseLeave}
        onChildClick={(child) => {
          setChildClicked(child);
          console.log(child);
        }}
      >
        {places.map((placeList, listIndex) =>
          placeList.map((place, placeIndex) => (
            <Marker
              key={`${listIndex}-${placeIndex}`}
              lat={place.latitude}
              lng={place.longitude}
              text={placeIndex + 1}
              position={placeIndex}
              place={place}
              hovered={hover ? Number(hover) === placeIndex : 0}
              color={listColors[listIndex]}
              setCenter={setCenter}
            />
          ))
        )}
      </GoogleMapReact>
    </div>
  );
}
