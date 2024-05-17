import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const defaultImageUrl = "/static/images/temp-background.jpeg"; // Provide a path to a default image

export default function PlaceDetails({ place }) {
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
        <Button size="small">Add to Trip</Button>
      </CardActions>
    </Card>
  );
}
