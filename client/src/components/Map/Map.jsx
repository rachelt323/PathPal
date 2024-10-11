import React, { useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { Paper, Typography, Rating } from "@mui/material";
import mapStyles from "./MapStyles";
import "./styles.css";

export default function Map({ coords, places }) {
  return (
    <div className="mapContainer">
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_KEY }}
        defaultCenter={coords}
        margin={[50, 50, 50, 50]}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: mapStyles,
        }}
        defaultZoom={14}
        onChildClick={(child) => console.log(child)}
      >
        {places.length &&
          places.map((item, index) => {
            if (item["name"]) {
              return (
                <div
                  key={index}
                  lat={item.latitude}
                  lng={item.longitude}
                  className="marker"
                >
                  <Paper elevation={3} className="paperContainer">
                    <Typography variant="subtitle2" gutterBottom>
                      {item.name}
                    </Typography>
                    <img
                      src={
                        item.photo
                          ? item.photo.images.large.url
                          : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
                      }
                      style={{ cursor: "pointer" }}
                    />
                    <Rating
                      name="read-only"
                      size="small"
                      value={Number(item.rating)}
                      readOnly
                    />
                  </Paper>
                </div>
              );
            }
          })}
      </GoogleMapReact>
    </div>
  );
}
