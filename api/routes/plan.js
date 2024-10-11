const express = require("express");
const Plan = require("../models/Plan.js");
const List = require("../models/List.js");
const Place = require("../models/Place.js");

const planRouter = express.Router();

planRouter.post("/create", async (req, res) => {
  try {
    const { title, place, lat, lng, fromDate, toDate } = req.body;

    var newPlan = new Plan({
      owner: req.user.id,
      title: title,
      place: place,
      lat: lat,
      lng: lng,
      fromDate: fromDate || null,
      toDate: toDate || null,
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

planRouter.put("/:id", async (req, res) => {
  await Plan.updateOne(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
      },
    }
  );
  res.status(200).json({ message: "success" });
});

planRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const plan = await Plan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    await List.deleteMany({ planCode: id });

    await Place.deleteMany({ plan: id });

    await Plan.findByIdAndDelete(id);

    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = planRouter;
