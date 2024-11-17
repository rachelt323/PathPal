import React, { useState, useEffect, createRef } from "react";
import { List, arrayMove } from "react-movable";
import "./DisplayList.css";

const defaultImageUrl = "/static/images/temp-background.jpeg";

export default function DisplayList({
  listItem,
  listIndex,
  allPlaces,
  setAllPlaces,
  lists,
  setLists,
  childClicked,
}) {
  const [name, setName] = useState(listItem.name);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [elRefs, setElRefs] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getPlaces = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/list/${listItem._id}/places`,
        {
          headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          newOrder: newPlaces,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async () => {
    try {
      await fetch(`http://localhost:3001/api/list/${listItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
        }),
      });
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:3001/api/list/${listItem._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const newPlaces = allPlaces.filter((_, idx) => idx !== listIndex);
      setAllPlaces(newPlaces);
      const newLists = lists.filter((_, idx) => idx !== listIndex);
      setLists(newLists);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteEntry = async (location) => {
    try {
      await Promise.all([
        fetch(`http://localhost:3001/api/place/${listItem._id}/${location}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }),
        fetch(
          `http://localhost:3001/api/list/${listItem._id}/${location}/deletePlace`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        ),
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlaceDelete = async (locationId, placeIndex) => {
    try {
      deleteEntry(locationId);
      const updatedPlaces = places.filter((_, idx) => idx !== placeIndex);
      setPlaces(updatedPlaces);

      const updatedAllPlaces = [...allPlaces];
      updatedAllPlaces[listIndex] = updatedPlaces;
      setAllPlaces(updatedAllPlaces);

      rearrangePlaces(updatedPlaces);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlaces();
  }, []);

  useEffect(() => {
    setElRefs((refs) =>
      Array(places.length)
        .fill()
        .map((_, i) => refs[i] || createRef())
    );
  }, [places]);

  useEffect(() => {
    if (childClicked) {
      const indices = childClicked.split("-");
      const listIdx = parseInt(indices[0], 10);
      const placeIdx = parseInt(indices[1], 10);

      if (listIdx === listIndex && elRefs[placeIdx]) {
        elRefs[placeIdx].current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }
  }, [childClicked]);

  if (loading) {
    return <div className="DisplayList-loading">Loading...</div>;
  }

  const calculateWidth = () => {
    const baseWidth = 301; // Minimum width in pixels
    const scalingFactor = 11; // Increase in width per character
    return Math.max(baseWidth, name.length * scalingFactor);
  };

  return (
    <div className="DisplayList-container">
      <div className="DisplayList-header">
        <input
          className="DisplayList-titleInput"
          style={{ width: `${calculateWidth()}px` }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleEdit}
          placeholder="Add a title (e.g., Restaurants)"
        />
        <button className="DisplayList-deleteButton" onClick={handleDelete}>
          &#x1F5D1;
        </button>
      </div>

      <List
        values={places}
        onChange={({ oldIndex, newIndex }) => {
          const newPlaces = arrayMove(places, oldIndex, newIndex);
          setPlaces(newPlaces);
          rearrangePlaces(newPlaces);
        }}
        renderList={({ children, props }) => (
          <div className="DisplayList-list" {...props}>
            {children}
          </div>
        )}
        renderItem={({ value, props, index }) => {
          const isExpanded = expandedIndex === index;
          return (
            <div
              className={`DisplayList-card ${
                isExpanded ? "DisplayList-card-expanded" : ""
              }`}
              {...props}
            >
              <div className="DisplayList-cardContent">
                <h3>{value.name}</h3>
                <p
                  className={`DisplayList-description ${
                    isExpanded ? "DisplayList-description-expanded" : ""
                  }`}
                >
                  {value.description || "No description available"}
                </p>
                <button
                  className="DisplayList-expandButton"
                  onClick={() => toggleExpand(index)}
                >
                  {isExpanded ? "Collapse" : "Expand"}
                </button>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}