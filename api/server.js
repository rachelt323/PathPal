const express = require("express");
const mongoose = require("mongoose");
const app = express();

require("dotenv").config();

// Middleware
app.use(express.json()); // For parsing application/json

// DB Config (Update your URI)

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
