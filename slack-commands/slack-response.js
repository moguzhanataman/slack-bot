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
  let msg = "```| ===== User name ===== | === Points === | Most Active |\n| --------------------- | -------------- | ----------- |\n";
  for (let index = 0; index < leaderboardData.length; index++) {
    const element = leaderboardData[index];
    msg += `| ${element.user_name.padEnd(21)} | ${element.total_points.padEnd(14)} | ${element.activity_name.padEnd(11)} |\n`;
  }
  msg += "```";

  console.log(msg);

  return {
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
  markdownResponse: leaderboardResponse,
  ephemeralResponse,
};
