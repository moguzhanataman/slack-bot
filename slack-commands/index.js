const express = require("express");
const User = require("../models/user");
const UserService = require("../services/user");
const router = express.Router();
const db = require("../utils/db");

router.use('/', (req, res, next) => {
  console.log('captured', req.body);
  next();
})

router.post("/running", (req, res) => {
  const text = req.body.text;
  res.json({
    response_type: "in_channel",
    text: `Got it! ${text}`,
  });
});

router.post("/biking", async (req, res) => {
  const userService = new UserService();
  try {
    const newUser = await userService.createUser(
      new User("U1235", "Oguzhan Ataman")
    );
    res.json(newUser);
  } catch (err) {
    console.error(err);
    res.json({ error: "cant create user" });
  }
});

router.post("/leaderboard", (req, res) => {});

module.exports = router;
