const express = require("express");
const Plan = require("../models/Plan.js");

const planRouter = express.Router();

planRouter.post("/create", async (req, res) => {
  try {
    var newPlan = new Plan({
      owner: req.user.id,
      title: req.body.title,
      place: req.body.place,
      lat: req.body.lat,
      lng: req.body.lng,
      lists: [],
    });
    await newPlan.save();
    res.status(200).json(newPlan);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

planRouter.get("/:id", async (req, res) => {
  try {
    var userPlan = await Plan.findOne({ _id: req.params.id });
    if (!userPlan) {
      return res.status(404).send({ message: "Plan not found" });
    }

    res.status(200).json(userPlan);
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});

planRouter.get("/", async (req, res) => {
  var userPlans = await Plan.find({ owner: req.user.id });
  res.status(200).json(userPlans);
});

module.exports = planRouter;
