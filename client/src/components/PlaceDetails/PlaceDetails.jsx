import React, { useState, useEffect } from "react";
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
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const defaultImageUrl = "/static/images/temp-background.jpeg"; // Provide a path to a default image
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
    console.log(prev);
    console.log(added);
    for (let i = 0; i < prev.length; i++) {
      if (added.indexOf(prev[i]) == -1) {
        deleteEntry(prev[i]);
      }
    }
    for (let i = 0; i < added.length; i++) {
      if (prev.indexOf(added[i]) == -1) {
        addEntry(added[i]);
      }
    }
  };

  const deleteEntry = async (listId) => {
    try {
      const deletePlaceRequest = fetch(
        `http://localhost:3001/api/place/${listId}/${place.location_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const deleteFromListRequest = fetch(
        `http://localhost:3001/api/list/${listId}/${place.location_id}/deletePlace`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const results = await Promise.all([
        deletePlaceRequest,
        deleteFromListRequest,
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const addEntry = async (listId) => {
    try {
      const addPlaceRequest = fetch("http://localhost:3001/api/place/add", {
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
      });

      const addToListRequest = fetch(
        `http://localhost:3001/api/list/${listId}/addPlace`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            place: place,
          }),
        }
      );

      const results = await Promise.all([addPlaceRequest, addToListRequest]);
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setAdded(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={place?.photo?.images?.small?.url || defaultImageUrl}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {place.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {place.subcategory_ranking}
        </Typography>
      </CardContent>
      <CardActions>
        <div>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel>Add To Trip</InputLabel>
            <Select
              multiple
              value={added}
              onChange={handleChange}
              input={<OutlinedInput label="Tag" />}
              renderValue={() => {
                return `Added to ${added.length} lists`;
              }}
              onBlur={() => {
                updateEntries();
              }}
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
        </div>
      </CardActions>
    </Card>
  );
}
