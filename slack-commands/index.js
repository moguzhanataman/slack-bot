const express = require("express");
const router = express.Router();

const db = require("../utils/db");
const signVerification = require("../utils/sign-verification");

const LeaderboardService = require("../services/leaderboard");
const leaderboardService = new LeaderboardService();

const handleTask = require("./handle-task");

// Ensure requests coming from slack
router.use("/", signVerification);

router.post("/running", handleTask);
router.post("/biking", handleTask);
router.post("/leaderboard", handleLeaderboard);

async function handleLeaderboard(req, res) {
  const lb = await leaderboardService.getTop3UsersWithHighestPointsInLastHour();
  console.log("lb", lb);
}

module.exports = router;
