import React, { useState, useEffect } from "react";
import { Grid, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import ImageCarousel from "../components/ImageCarousel/ImageCarousel";

const useStyles = {
  button: {
    backgroundColor: "#4F6F52",
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: "#1A4D2E",
    },
    marginBottom: "20px",
  },
  box: {
    backgroundColor: "#F5EFE6",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #E8DFCA",
  },
  gridContainer: {
    backgroundColor: "#F5EFE6",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #E8DFCA",
  },
  loading: {
    color: "#1A4D2E",
    fontSize: "20px",
    textAlign: "center",
  },
};

export default function MainPage() {
  const [userPlans, setUserPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const getUserInfo = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/plan", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      setUserPlans(data);
    } catch (error) {
      console.error("An error occurred", error);
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async (plan_id, planIndex) => {
    try {
      await fetch(`http://localhost:3001/api/plan/${plan_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "applications/json",
        },
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    }
    const newPlans = userPlans.filter((item, idx) => idx !== planIndex);
    setUserPlans(newPlans);
  };

  const handleClick = () => {
    navigate("/plan/create");
  };
  useEffect(() => {
    getUserInfo();
  }, []);
  if (loading) {
    return <div style={useStyles.loading}>Loading...</div>;
  }
  return (
    <>
      <Header />
      <Box style={useStyles.box}>
        <Button
          onClick={handleClick}
          variant="contained"
          style={useStyles.button}
        >
          Plan new trip
        </Button>
        <ImageCarousel userPlans={userPlans} onDelete={onDelete} />
      </Box>
    </>
  );
}
