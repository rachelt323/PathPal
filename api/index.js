const express = require("express");
const authRoutes = require("./routes/auth.js");

const router = express.Router();

router.use("/auth", authRoutes);

module.exports = router;
