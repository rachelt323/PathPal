const express = require("express");
const User = require("../models/User.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const newPassword = await bcryptjs.hash(req.body.password, 10);
    await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error", error: "Duplicate email" });
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(401).json({ error: "Invalid Email" });
  }

  const isPasswordValid = await bcryptjs.compare(
    req.body.password,
    user.password
  );

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      process.env.JWT_CODE
    );
    return res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ message: "Login success" });
  } else {
    return res.status(401).json({ error: "Invalid Password" });
  }
});

module.exports = router;
