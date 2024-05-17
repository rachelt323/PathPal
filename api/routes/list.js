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
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = ListRouter;
