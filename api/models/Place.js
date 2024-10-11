const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaceSchema = new Schema(
  {
    plan: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
    },
    location_id: {
      type: String,
    },
    listId: {
      type: Schema.Types.ObjectId,
      ref: "List",
    },
    data: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const Place = mongoose.model("Place", PlaceSchema);
module.exports = Place;
