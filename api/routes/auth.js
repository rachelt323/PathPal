const express = require("express");
const User = require("../models/User.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/status", async (req, res) => {
  try {
    // Extract the JWT from the cookie
    const token = req.cookies.access_token;
    if (!token) {
      // If no token is found, the user is not logged in
      return res.status(401).json({ isLoggedIn: false });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_CODE, (err, decoded) => {
      if (err) {
        // If token verification fails, the user is not logged in
        return res.status(401).json({ isLoggedIn: false });
      }

      // If token is valid, return user data and logged in status
      // `decoded` is the object that was previously encoded into the JWT
      return res.json({
        isLoggedIn: true,
        user: {
          id: decoded.id,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
        },
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ isLoggedIn: false, error: "Internal Server Error" });
  }
});

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

router.get("/logout", async (req, res) => {
  res.clearCookie("access_token");
  return res.status(200).json({ message: "logout success" });
});

module.exports = router;
