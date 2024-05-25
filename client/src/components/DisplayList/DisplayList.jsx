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
} from "@mui/material";

const defaultImageUrl = "/static/images/temp-background.jpeg";

const useStyles = {
  card: {
    display: "flex",
    height: "150px",
    marginBottom: "20px",
    backgroundColor: "#F5EFE6",
    border: "1px solid #E8DFCA",
  },
  media: {
    width: "100%",
    height: "100%",
    objectFir: "cover",
  },
  formControl: {
    marginBottom: "20px",
  },
  textField: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
  },
  box: {
    backgroundColor: "#E8DFCA",
    padding: "20px",
    borderRadius: "8px",
  },
};

export default function DisplayList({ listItem }) {
  const [name, setName] = useState(listItem.name);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <Box style={useStyles.box}>
      <FormControl fullWidth style={useStyles.formControl}>
        <TextField
          variant="filled"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleEdit}
          placeholder="Add a title (e.g., Restaurants)"
          style={useStyles.textField}
        />
      </FormControl>
      <List
        values={places}
        onChange={({ oldIndex, newIndex }) => {
          const newPlaces = arrayMove(places, oldIndex, newIndex);
          setPlaces(newPlaces);
          rearrangePlaces(newPlaces);
        }}
        renderList={({ children, props }) => <Box {...props}>{children}</Box>}
        renderItem={({ value, props }) => (
          <Card {...props} sx={useStyles.card} key={value.location_id}>
            <Grid container spacing={0}>
              <Grid item xs={8}>
                <CardContent>
                  <Typography variant="h6">{value.name}</Typography>
                  <Typography variant="body2">{value.description}</Typography>
                </CardContent>
              </Grid>
              <Grid item xs={4}>
                <CardMedia
                  sx={useStyles.media}
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
