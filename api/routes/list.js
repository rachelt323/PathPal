const express = require("express");
const List = require("../models/List.js");

const ListRouter = express.Router();

ListRouter.get("/:id", async (req, res) => {
  try {
    var userList = await List.findOne({ _id: req.params.id });
    if (!userList) {
      return res.status(400).send({ message: "List not found" });
    }
    res.status(200).json(userList);
  } catch (error) {
    res.status(500).send(error);
  }
});

ListRouter.get("/all/:planCode", async (req, res) => {
  try {
    const allLists = await List.find({ planCode: req.params.planCode }).sort({
      createdAt: 1,
    });
    if (!allLists.length) {
      return res.status(404).json({ message: "Plan has no lists" });
    }
    res.status(200).json(allLists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

ListRouter.post("/add", async (req, res) => {
  try {
    var newList = await List.create({
      name: "",
      planCode: req.body.planCode,
      places: [],
    });
    res.status(200).json(newList);
  } catch (error) {
    res.status(400).send(error);
  }
});

ListRouter.put("/:id", async (req, res) => {
  await List.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
      },
    }
  );
  res.status(200).json({ message: "success" });
});

ListRouter.put("/:listId/addPlace", async (req, res) => {
  try {
    const { listId } = req.params;
    const { place } = req.body;
    const updatedList = await List.findByIdAndUpdate(listId, {
      $push: { places: place },
    });
    res.json(updatedList);
  } catch (error) {
    console.error("Failed to add place:", error);
    res.status(500).send(error);
  }
});

ListRouter.put("/:listId/rearrange", async (req, res) => {
  try {
    const { listId } = req.params;
    const { newOrder } = req.body;
    const updatedList = await List.findByIdAndUpdate(
      listId,
      { $set: { places: newOrder } },
      { new: true }
    );
    res.json(updatedList);
  } catch (error) {
    console.error("Failed to rearrange places:", error);
    res.status(500).send(error);
  }
});

ListRouter.delete("/:listId/:placeId/deletePlace", async (req, res) => {
  try {
    const { listId, placeId } = req.params;

    const updatedList = await List.findByIdAndUpdate(
      listId,
      { $pull: { places: { location_id: placeId } } },
      { new: true }
    );
    if (updatedList) {
      res.json(updatedList);
    } else {
      res.status(404).send("List not found");
    }
  } catch (error) {
    console.error("Failed to delete place:", error);
    res.status(500).send(error);
  }
});

ListRouter.get("/:id/places", async (req, res) => {
  try {
    var userList = await List.findOne({ _id: req.params.id });
    if (!userList) {
      return res.status(400).send({ message: "List not found" });
    }
    res.status(200).json(userList.places);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = ListRouter;
