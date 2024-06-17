import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PlaceDetails from "../PlaceDetails/PlaceDetails";

export default function ExploreList({ plan, type, setType, places, lists }) {
  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Type</InputLabel>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <MenuItem value={"restaurants"}>Restaurants</MenuItem>
          <MenuItem value={"attractions"}>Attractions</MenuItem>
          <MenuItem value={"hotels"}>Hotels</MenuItem>
        </Select>
      </FormControl>
      {places?.map((place, i) => {
        if (place["name"])
          return (
            <PlaceDetails plan={plan} place={place} lists={lists} key={i} />
          );
      })}
    </div>
  );
}
