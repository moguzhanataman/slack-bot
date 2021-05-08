const { markdownResponse, textResponse } = require("./slack-response");
const LeaderboardService = require("../services/leaderboard");
const leaderboardService = new LeaderboardService();

async function handleLeaderboard(req, res) {
  const userPointsAndActivities = await leaderboardService.getTop3UsersWithHighestPointsInLastHour();

  try {
    res.json(markdownResponse(userPointsAndActivities));
  } catch (err) {
    console.error("err", err);
    res.json(
      textResponse(
        "No tasks submitted yet! To submit tasks use /running or /biking commands with a number parameter"
      )
    );
  }
}

module.exports = handleLeaderboard;
