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

ListRouter.post("/add", async (req, res) => {
  try {
    await List.create({
      name: "",
      planCode: req.body.planCode,
      places: [],
    });
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

module.exports = ListRouter;
