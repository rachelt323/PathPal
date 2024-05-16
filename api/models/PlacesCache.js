const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlacesCacheSchema = new Schema({
  places: {
    type: Array,
  },
  type: {
    type: String,
    required: true,
  },
  lat: {
    type: String,
    required: true,
  },
  lng: {
    type: String,
    required: true,
  },
});

const PlacesCache = mongoose.model("PlacesCache", PlacesCacheSchema);
module.exports = PlacesCache;
