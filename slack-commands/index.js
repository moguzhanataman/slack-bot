const express = require("express");
const router = express.Router();

const db = require("../utils/db");
const signVerification = require("../middlewares/sign-verification");

const handleTask = require("./handle-task");
const handleLeaderboard = require("./handle-leaderboard");

// Ensure requests coming from slack
router.use("/", signVerification);

// Commands
router.post("/running", handleTask);
router.post("/biking", handleTask);
router.post("/leaderboard", handleLeaderboard);

module.exports = router;
