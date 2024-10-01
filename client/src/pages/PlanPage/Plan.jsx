import React, { useState, useEffect, createRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlanInfo } from "../../util/api";
import DisplayList from "../../components/DisplayList/DisplayList";
import Header from "../../components/Header/Header";
import PlanMap from "../../components/PlanMap/PlanMap";
import "./styles.css";
import {
  Grid,
  Box,
  Button,
  Typography,
  FormControl,
  TextField,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const useStyles = {
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
    borderRadius: "8px",
    overflowY: "scroll", // Enable scrolling
    height: "calc(100vh - 64px)", // Adjust based on your layout needs
  },
};

export default function Plan() {
  const [planInfo, setPlanInfo] = useState(null);
  const [childClicked, setChildClicked] = useState(null);
  const [places, setPlaces] = useState([]);
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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

      // Ensure `prev` is an array before spreading
      setLists((prev) => (Array.isArray(prev) ? [...prev, data] : [data]));
    } catch (error) {
      console.error(error);
    }
  };

  const calculateWidth = () => {
    const baseWidth = 301; // Minimum width in pixels
    const scalingFactor = 11; // Increase in width per character
    return Math.max(baseWidth, title.length * scalingFactor);
  };

  const handleEdit = async () => {
    try {
      await fetch(`http://localhost:3001/api/plan/${planCode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
        }),
      });
    } catch (error) {
      console.error("Error updating name:", error);
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
    if (planInfo) setTitle(planInfo.title);
  }, [planInfo]);

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
      <div className="container">
        <Grid container>
          <Grid item xs={12} md={6}>
            <Box style={useStyles.listContainer}>
              <Button
                variant="contained"
                onClick={() => {
                  navigate(`/plan/${planCode}/explore`);
                }}
                style={useStyles.button}
              >
                Explore Places
              </Button>
              <FormControl fullWidth className="titleFormControl">
                <TextField
                  style={{ width: calculateWidth() }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  variant="standard"
                  className="titleTextField"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    handleEdit();
                    setIsFocused(false);
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <EditIcon
                          style={{
                            visibility:
                              isHovered || isFocused ? "visible" : "hidden",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
              {lists &&
                lists.length > 0 &&
                lists.map((listItem, listIndex) => (
                  <DisplayList
                    listItem={listItem}
                    key={listItem._id}
                    listIndex={listIndex}
                    allPlaces={places}
                    setAllPlaces={setPlaces}
                    lists={lists}
                    setLists={setLists}
                    childClicked={childClicked}
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
            <Box style={useStyles.mapContainer}>
              <PlanMap
                places={places}
                coords={{ lat: planInfo.lat, lng: planInfo.lng }}
                setChildClicked={setChildClicked}
              />
            </Box>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
