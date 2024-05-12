import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

export default function PlanCard({ userPlan }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/path/${userPlan._id}`);
  }
  return (
    <Card sx={{ width: 300 }} onClick={handleClick}>
      <CardMedia
        sx={{ height: 160 }}
        image="/static/images/temp-background.jpeg"
        title="temp"
      />
      <CardContent>
        <Typography gutterBottom variant="h7" component="div">
          {userPlan.title}
        </Typography>
      </CardContent>
    </Card>
  );
}
