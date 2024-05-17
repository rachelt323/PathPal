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

export default function DisplayList({ code }) {
  const [name, setName] = useState("");
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPlacesInfo = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/list/${code}`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const result = await response.json();
      setInfo(result);
      setName(result.name);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      await fetch(`http://localhost:3001/api/list/${code}`, {
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

  useEffect(() => {
    getPlacesInfo();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <FormControl>
        <TextField
          variant="filled"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleEdit}
        />
      </FormControl>
      <Box>
        {info.places?.map((plan) => (
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
