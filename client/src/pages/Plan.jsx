import React, { useState, useEffect } from "react";
import { Grid, Box, Button, ListItem } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import DisplayList from "../components/DisplayList/DisplayList";
import { getPlanInfo } from "../api/api";

export default function Plan() {
  const [planInfo, setPlanInfo] = useState(null);
  const [lists, setLists] = useState([]);
  const { planCode } = useParams();
  const navigate = useNavigate();

  const getList = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/list/all/${planCode}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      setLists(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/list/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          planCode,
        }),
      });
      const data = await response.json();
      setLists([...lists, data]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlanInfo(planCode).then((data) => setPlanInfo(data));
    getList();
  }, [planCode]);

  if (!planInfo || !lists) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => {
          navigate(`/plan/${planCode}/explore`);
        }}
      >
        Explore Places
      </Button>
      <Grid container>
        <Grid item xs={6}>
          <Box>
            <h1>{planInfo.title}</h1>
            {lists?.map((listItem) => (
              <DisplayList listItem={listItem} key={listItem._id} />
            ))}
          </Box>
          <Button sx={{ mt: 1 }} onClick={handleAdd} variant="contained">
            Add a new list
          </Button>
        </Grid>
        <Grid item xs={6}>
          <h1>Map</h1>
        </Grid>
      </Grid>
    </div>
  );
}
