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
    lists: [
      {
        type: Schema.Types.ObjectId,
        ref: "List",
      },
    ],
  },
  { timestamps: true }
);

PlanSchema.post("save", async function (doc, next) {
  try {
    if (doc.lists.length === 0) {
      const defaultList = new List({
        name: "Places to visit",
        planCode: doc._id, // Using the Plan's _id after it has been saved
        places: [],
      });

      const savedList = await defaultList.save(); // Save and wait for the List document
      doc.lists.push(savedList._id); // Add the List document's ID to the Plan's lists
      await doc.save(); // Save the Plan document again with the new List reference
      next(); // Proceed with the middleware chain
    } else {
      next(); // If there are already lists, proceed without changes
    }
  } catch (err) {
    next(err); // Handle any errors that occur during the process
  }
});

const Plan = mongoose.model("Plan", PlanSchema);
module.exports = Plan;
