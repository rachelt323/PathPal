import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const useCardStyles = {
  card: {
    flex: "1 0 auto",
    margin: "10px",
    backgroundColor: "#F5EFE6",
    position: "relative", // Needed for the delete icon positioning
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
  deleteIcon: {
    position: "absolute",
    top: "10px",
    right: "10px",
    display: "none",
    "&:hover": {
      color: "red",
    },
  },
  cardHover: {
    "&:hover $deleteIcon": {
      display: "block", // Show delete icon on hover
    },
  },
};

export default function PlanCard({ userPlan, isMoving, onDelete, planIndex }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  function handleClick(e) {
    if (isMoving) {
      e.preventDefault();
      return;
    }
    navigate(`/plan/${userPlan._id}`);
  }

  function handleDelete(e) {
    e.stopPropagation(); // Prevent click event from bubbling up to the <a> tag
    e.preventDefault();
    onDelete(userPlan._id, planIndex);
  }

  return (
    <a
      onClick={handleClick}
      href={`/plan/${userPlan._id}`}
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        sx={{
          ...useCardStyles.card,
          ...(isHovered && useCardStyles.cardHover),
        }}
      >
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

        {/* Delete Icon */}
        <IconButton
          sx={useCardStyles.deleteIcon}
          onClick={handleDelete} // Only delete will be triggered when clicked
          style={{ display: isHovered ? "block" : "none" }}
        >
          <DeleteIcon />
        </IconButton>
      </Card>
    </a>
  );
}
