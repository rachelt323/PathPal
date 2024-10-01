import React from "react";
import "./ExploreList.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PlaceDetails from "../PlaceDetails/PlaceDetails";

export default function ExploreList({ plan, type, setType, places, lists }) {
  return (
    <div className="explore-list-container">
      <FormControl className="explore-list-form" variant="standard">
        <InputLabel>Type</InputLabel>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <MenuItem value={"restaurants"}>Restaurants</MenuItem>
          <MenuItem value={"attractions"}>Attractions</MenuItem>
          <MenuItem value={"hotels"}>Hotels</MenuItem>
        </Select>
      </FormControl>
      <div className="places-container">
        {places?.map(
          (place, i) =>
            place["name"] && (
              <PlaceDetails
                plan={plan}
                place={place}
                lists={lists}
                key={i}
                className="place-card"
              />
            )
        )}
      </div>
    </div>
  );
}
