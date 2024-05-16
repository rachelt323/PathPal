const express = require("express");
const PlacesCache = require("../models/PlacesCache.js");

const placesRouter = express.Router();

placesRouter.get("/:lat/:lng/:type", async (req, res) => {
  try {
    var location = await PlacesCache.findOne({
      type: req.params.type,
      lat: req.params.lat,
      lng: req.params.lng,
    });
    if (!location) {
      return res.status(204).json({ message: "Location not cached" });
    }
    res.status(200).json(location.places);
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});

placesRouter.post("/", async (req, res) => {
  try {
    await PlacesCache.create({
      places: req.body.places,
      type: req.body.type,
      lat: req.body.lat,
      lng: req.body.lng,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error" });
  }
});

module.exports = placesRouter;
