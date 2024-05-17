const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const List = require("../models/List");

const PlanSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    place: {
      type: String,
    },
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
  { timestamps: true }
);

PlanSchema.post("save", async function (doc, next) {
  try {
    const defaultList = new List({
      name: "Places to visit",
      planCode: doc._id, // Using the Plan's _id after it has been saved
      places: [],
    });

    await defaultList.save(); // Save and wait for the List document

    next(); // Proceed with the middleware chain
  } catch (err) {
    next(err); // Handle any errors that occur during the process
  }
});

const Plan = mongoose.model("Plan", PlanSchema);
module.exports = Plan;
