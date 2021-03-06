const express = require("express");
const router = express.Router();

const signVerification = require("../../middlewares/sign-verification");

const handleTask = require("./task");
const handleLeaderboard = require("./leaderboard");

// Ensure requests coming from slack
router.use("/", signVerification);

// Commands
router.post("/running", handleTask);
router.post("/biking", handleTask);
router.post("/leaderboard", handleLeaderboard);

module.exports = router;
