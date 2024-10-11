import React, { useState, useEffect } from "react";
import "./PlaceDetails.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";

const defaultImageUrl = "/static/images/temp-background.jpeg";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function PlaceDetails({ plan, place, lists }) {
  const [added, setAdded] = useState([]);
  const [prev, setPrev] = useState([]);

  const getPlacesEntries = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/place/${place.location_id}/${plan}`,
        {
          headers: {
            "Content-Type": "applications/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      setPrev(data);
      setAdded(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlacesEntries();
  }, [place]);

  const updateEntries = () => {
    for (let i = 0; i < prev.length; i++) {
      if (added.indexOf(prev[i]) === -1) {
        deleteEntry(prev[i]);
      }
    }
    for (let i = 0; i < added.length; i++) {
      if (prev.indexOf(added[i]) === -1) {
        addEntry(added[i]);
      }
    }
  };

  const deleteEntry = async (listId) => {
    try {
      await Promise.all([
        fetch(
          `http://localhost:3001/api/place/${listId}/${place.location_id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        ),
        fetch(
          `http://localhost:3001/api/list/${listId}/${place.location_id}/deletePlace`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        ),
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const addEntry = async (listId) => {
    try {
      await Promise.all([
        fetch("http://localhost:3001/api/place/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            plan: plan,
            location_id: place.location_id,
            listId: listId,
            data: place,
          }),
        }),
        fetch(`http://localhost:3001/api/list/${listId}/addPlace`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            place: place,
          }),
        }),
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setAdded(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Card className="place-card">
      <CardMedia
        className="place-image"
        image={place?.photo?.images?.small?.url || defaultImageUrl}
        title={place.name}
      />
      <CardContent className="place-details">
        <Typography
          className="place-title"
          gutterBottom
          variant="h5"
          component="div"
        >
          {place.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {place.subcategory_ranking}
        </Typography>
      </CardContent>
      <CardActions>
        <FormControl className="add-to-trip" variant="outlined">
          <InputLabel>Add To Trip</InputLabel>
          <Select
            multiple
            value={added}
            onChange={handleChange}
            input={<OutlinedInput label="Tag" />}
            renderValue={() => `Added to ${added.length} lists`}
            onBlur={() => updateEntries()}
            MenuProps={MenuProps}
          >
            {lists.map((listItem) => (
              <MenuItem key={listItem._id} value={listItem._id}>
                <Checkbox checked={added.indexOf(listItem._id) > -1} />
                <ListItemText primary={listItem.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardActions>
    </Card>
  );
}
