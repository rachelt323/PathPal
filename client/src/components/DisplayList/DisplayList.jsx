import React, { useState, useEffect } from "react";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
import {
  FormControl,
  TextField,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

const defaultImageUrl = "/static/images/temp-background.jpeg";

export default function DisplayList({ listItem }) {
  const [name, setName] = useState(listItem.name);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPlaces = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/place/list/${listItem._id}`,
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

  useEffect(() => {
    getPlaces();
  }, []);

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

  if (loading) {
    return <div>Loading..</div>;
  }

  return (
    <div>
      <FormControl>
        <TextField
          variant="filled"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleEdit}
          placeholder="Add a title (e.g., Resturants)"
        />
      </FormControl>
      <Box>
        {places?.map((place) => (
          <Card sx={{ display: "flex" }} key={place._id}>
            <CardContent xs={6}>
              <Typography>{place.data.name}</Typography>
              <Typography>{place.data.description}</Typography>
            </CardContent>
            <CardMedia
              xs={6}
              sx={{ width: 140 }}
              image={place.data.photo?.images?.small?.url || defaultImageUrl}
            />
          </Card>
        ))}
      </Box>
    </div>
  );
}
