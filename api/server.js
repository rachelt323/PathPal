const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const allRoutes = require("./index.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

require("dotenv").config();

// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json()); // For parsing application/json
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
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
