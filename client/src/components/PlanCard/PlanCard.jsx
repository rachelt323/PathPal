import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const useCardStyles = {
  card: {
    flex: "1 0 auto",
    margin: "10px",
    backgroundColor: "#F5EFE6",
    "&:hover": {
      backgroundColor: "#E8DFCA",
    },
    cursor: "pointer",
    border: "1px solid #1A4D2E",
  },
  media: {
    height: 160,
  },
  title: {
    color: "#1A4D2E",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

export default function PlanCard({ userPlan, isMoving }) {
  const navigate = useNavigate();

  function handleClick(e) {
    if (isMoving) {
      e.preventDefault();
      return;
    }
    navigate(`/plan/${userPlan._id}`);
  }

  return (
    <a
      onClick={handleClick}
      href={`/plan/${userPlan._id}`}
      style={{ textDecoration: "none" }}
    >
      <Card sx={useCardStyles.card}>
        <CardMedia
          sx={useCardStyles.media}
          image="/static/images/temp-background.jpeg"
          title={userPlan.title}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            style={useCardStyles.title}
          >
            {userPlan.title}
          </Typography>
        </CardContent>
      </Card>
    </a>
  );
}
