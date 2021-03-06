/**
 * Slacks Responses
 * Build objects to send as a response,
 */

const UserPointsAndActivity = require("../models/user-points-and-activity");

/**
 * Create a leaderboard response
 * @param {UserPointsAndActivity[]} leaderboardData
 * @returns {Object}
 */
function leaderboardResponse(leaderboardData) {
  let msg =
    "```| ===== User name ===== | === Points === | Most Active |\n| --------------------- | -------------- | ----------- |\n";
  for (let index = 0; index < leaderboardData.length; index++) {
    const element = leaderboardData[index];
    const userName = element.user_name.padEnd(21);
    const totalPoints = element.total_points.toString().padEnd(14);
    const activityName = element.activity_name.padEnd(11);
    msg += `| ${userName} | ${totalPoints} | ${activityName} |\n`;
  }
  msg += "```";

  return {
    response_type: "in_channel",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: msg,
        },
      },
    ],
  };
}

// Everyone in the channel can see this response
function textResponse(msg) {
  return {
    response_type: "in_channel",
    text: msg,
  };
}

// Only command user sees the response
function ephemeralResponse(msg) {
  return {
    response_type: "ephemeral",
    text: msg,
  };
}

module.exports = {
  textResponse,
  leaderboardResponse,
  ephemeralResponse,
};
