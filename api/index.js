const express = require("express");
const checkAuth = require("./utils/checkAuth.js");
const authRoutes = require("./routes/auth.js");
const pathRoutes = require("./routes/plan.js");
const placesCacheRoutes = require("./routes/placesCache.js");
const listRoutes = require("./routes/list.js");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/plan", checkAuth, pathRoutes);
router.use("/placesCache", checkAuth, placesCacheRoutes);
router.use("/list", checkAuth, listRoutes);

module.exports = router;
