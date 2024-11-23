import React from "react";
import GoogleMapReact from "google-map-react";
import "./Map.css";

export default function Map({ coords, places }) {
  const mapStyles = [
    {
      featureType: "all",
      elementType: "labels.text",
      stylers: [
        {
          color: "#878787",
        },
      ],
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [
        {
          color: "#f9f5ed",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "all",
      stylers: [
        {
          color: "#f5f5f5",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#c9c9c9",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "all",
      stylers: [
        {
          color: "#aee0f4",
        },
      ],
    },
  ];

  return (
    <div className="Map-container">
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_KEY }}
        defaultCenter={coords}
        defaultZoom={14}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: mapStyles,
        }}
        onChildClick={(child) => console.log(child)}
      >
        {places?.map((item, index) =>
          item.name ? (
            <div
              key={index}
              lat={item.latitude}
              lng={item.longitude}
              className="Map-marker"
            >
              <div className="Map-infoCard">
                <img
                  src={
                    item.photo
                      ? item.photo.images.large.url
                      : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
                  }
                  alt={item.name}
                  className="Map-infoImage"
                />
                <div className="Map-infoDetails">
                  <span className="Map-infoTitle">{item.name}</span>
                  <span className="Map-infoRating">
                    {`Rating: ${item.rating || "N/A"}`}
                  </span>
                </div>
              </div>
            </div>
          ) : null
        )}
      </GoogleMapReact>
    </div>
  );
}