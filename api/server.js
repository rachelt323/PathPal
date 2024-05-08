const express = require("express");
const mongoose = require("mongoose");
const allRoutes = require("./index.js");
const app = express();

require("dotenv").config();

// Middleware
app.use(express.json()); // For parsing application/json
app.use("/api", allRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
