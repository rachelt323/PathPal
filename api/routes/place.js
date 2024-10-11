const express = require("express");
const Place = require("../models/Place.js");

const PlaceRouter = express.Router();

PlaceRouter.get("/list/:listId", async (req, res) => {
  try {
    const places = await Place.find({
      listId: req.params.listId,
    });
    res.json(places);
  } catch (error) {
    res.status(500).send(error);
  }
});

PlaceRouter.post("/add", async (req, res) => {
  try {
    var newEntry = await Place.create({
      plan: req.body.plan,
      location_id: req.body.location_id,
      listId: req.body.listId,
      data: req.body.data,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

PlaceRouter.delete("/:listId/:locationId", async (req, res) => {
  try {
    await Place.deleteOne({
      location_id: req.params.locationId,
      listId: req.params.listId,
    });
    res.status(200);
  } catch (error) {
    res.status(500).send(error);
  }
});

PlaceRouter.get("/:locationId/:planCode", async (req, res) => {
  try {
    const places = await Place.find({
      plan: req.params.planCode,
      location_id: req.params.locationId,
    }).select("listId -_id");
    const listIds = places.map((place) => place.listId);

    res.json(listIds);
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = PlaceRouter;
