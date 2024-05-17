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

export default function DisplayList({ listItem }) {
  const [name, setName] = useState(listItem.name);

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
        {listItem.places?.map((plan) => (
          <Card sx={{ display: "flex" }}>
            <CardContent>
              <Typography>TEMP</Typography>
              <Typography>
                Akihabara is a buzzing shopping hub famed for its electronics
                retailers, ranging from tiny stalls to vast department stores
                like Yodobashi Multimedia Akiba.
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              sx={{ width: 300 }}
              image="/static/images/temp-background.jpeg"
            />
          </Card>
        ))}
      </Box>
    </div>
  );
}
