import React, { useState, useEffect } from "react";
import { List, arrayMove } from "react-movable";
import {
  FormControl,
  TextField,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "./styles.css";

const defaultImageUrl = "/static/images/temp-background.jpeg";

export default function DisplayList({
  listItem,
  listIndex,
  allPlaces,
  setAllPlaces,
  lists,
  setLists,
}) {
  const [name, setName] = useState(listItem.name);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getPlaces = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/list/${listItem._id}/places`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const rearrangePlaces = async (newPlaces) => {
    try {
      await fetch(`http://localhost:3001/api/list/${listItem._id}/rearrange`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          newOrder: newPlaces,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async () => {
    try {
      await fetch(`http://localhost:3001/api/list/${listItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
        }),
      });
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:3001/api/list/${listItem._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const newPlaces = allPlaces.filter((item, idx) => idx !== listIndex);
      setAllPlaces(newPlaces);
      const newLists = lists.filter((item, idx) => idx !== listIndex);
      setLists(newLists);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlaces();
  }, []);

  if (loading) {
    return <div>Loading..</div>;
  }

  return (
    <Box className="box">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <FormControl fullWidth className="formControl" variant="standard">
          <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add a title (e.g., Restaurants)"
            className="textField"
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <InputAdornment position="end">
                  <EditIcon
                    style={{
                      visibility: isHovered || isFocused ? "visible" : "hidden",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              handleEdit();
              setIsFocused(false);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        </FormControl>
        <IconButton onClick={handleDelete} size="large">
          <DeleteIcon />
        </IconButton>
      </Box>

      <List
        values={places}
        onChange={({ oldIndex, newIndex }) => {
          const newPlaces = arrayMove(places, oldIndex, newIndex);
          const newList = [...allPlaces];
          newList[listIndex] = newPlaces;
          setAllPlaces(newList);
          setPlaces(newPlaces);
          rearrangePlaces(newPlaces);
        }}
        renderList={({ children, props }) => <Box {...props}>{children}</Box>}
        renderItem={({ value, props }) => (
          <Card className="card" {...props} key={value.location_id}>
            <Grid container spacing={0}>
              <Grid item xs={8}>
                <CardContent>
                  <Typography variant="h6">{value.name}</Typography>
                  <Typography variant="body2">{value.description}</Typography>
                </CardContent>
              </Grid>
              <Grid item xs={4}>
                <CardMedia
                  className="media"
                  image={value.photo?.images?.medium?.url || defaultImageUrl}
                  title={value.name}
                />
              </Grid>
            </Grid>
          </Card>
        )}
      />
    </Box>
  );
}
