const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListSchema = new Schema(
  {
    name: {
      type: String,
    },
    planCode: {
      type: Schema.Types.ObjectId, // Updated to store an ObjectId reference
      ref: "Plan", // Optionally reference back to the Plan if needed
    },
    places: {
      type: Array,
    },
  },
  { timestamps: true }
);

const List = mongoose.model("List", ListSchema);
module.exports = List;
