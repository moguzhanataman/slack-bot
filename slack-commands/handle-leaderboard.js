const { leaderboardResponse, textResponse } = require("./slack-response");
const LeaderboardService = require("../services/leaderboard");
const leaderboardService = new LeaderboardService();

async function handleLeaderboard(req, res) {
  const userPointsAndActivities = await leaderboardService.getTop3UsersWithHighestPointsInLastHour();

  try {
    if (
      userPointsAndActivities == null ||
      userPointsAndActivities.length <= 0
    ) {
      return res.json(
        textResponse(
          "No tasks submitted yet! To submit tasks use /running or /biking commands with a number parameter"
        )
      );
    }
    return res.json(leaderboardResponse(userPointsAndActivities));
  } catch (err) {
    console.error("err", err);
    return res.json(textResponse("Error: " + err.message));
  }
}

module.exports = handleLeaderboard;
