import React, { useState, useEffect } from "react";
import { Grid, Box, Button, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import DisplayList from "../components/DisplayList/DisplayList";
import { getPlanInfo } from "../util/api";
import Header from "../components/Header/Header";
import PlanMap from "../components/PlanMap/PlanMap";

const useStyles = {
  container: {
    backgroundColor: "#F5EFE6",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #E8DFCA",
    marginTop: "20px",
  },
  header: {
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#4F6F52",
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: "#1A4D2E",
    },
    marginBottom: "20px",
  },
  listContainer: {
    backgroundColor: "#E8DFCA",
    padding: "20px",
    borderRadius: "8px",
  },
};

export default function Plan() {
  const [planInfo, setPlanInfo] = useState(null);
  const [selected, setSelected] = useState(null);
  const [places, setPlaces] = useState([]);
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

  const getPlaces = async (listItem) => {
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
      return data;
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
      setLists((prev) => [...prev, data]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (lists.length) {
      const fetchPlaces = async () => {
        const promises = lists.map((list) => getPlaces(list));
        try {
          const placesResults = await Promise.all(promises);
          setPlaces(placesResults); // Assuming each call returns an array of places
        } catch (error) {
          console.error("Failed to fetch places:", error);
        }
      };

      fetchPlaces();
    }
  }, [lists]);

  useEffect(() => {
    console.log(places);
  }, [places]);

  useEffect(() => {
    const fetchData = async () => {
      const planInfoData = await getPlanInfo(planCode);
      setPlanInfo(planInfoData);
      await getList();
    };

    fetchData();
  }, [planCode]);

  if (!planInfo || !lists) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div style={useStyles.container}>
        <Button
          variant="contained"
          onClick={() => {
            navigate(`/plan/${planCode}/explore`);
          }}
          style={useStyles.button}
        >
          Explore Places
        </Button>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box style={useStyles.listContainer}>
              <Typography variant="h4" gutterBottom>
                {planInfo.title}
              </Typography>

              {lists?.map((listItem, listIndex) => (
                <DisplayList
                  listItem={listItem}
                  key={listItem._id}
                  listIndex={listIndex}
                  allPlaces={places}
                  setAllPlaces={setPlaces}
                />
              ))}

              <Button
                sx={{ mt: 2 }}
                onClick={handleAdd}
                variant="contained"
                style={useStyles.button}
              >
                Add a new list
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box style={useStyles.listContainer}>
              <Typography variant="h4" gutterBottom>
                Map
              </Typography>

              <PlanMap
                places={places}
                coords={{ lat: planInfo.lat, lng: planInfo.lng }}
                setSelected={setSelected}
              />
            </Box>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
