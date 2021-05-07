const db = require("../utils/db");

class LeaderboardService {
  async getTop3UsersWithHighestPointsInLastHour() {
    const top3UsersWithPoints = await db.query(
    `
        SELECT user_name, sum(total)
        FROM (
            SELECT 
                users.name AS user_name, 
                commands.name AS cmd_name, 
                sum(value * factor) AS total
            FROM tasks
            JOIN commands ON commands.id = command_id 
            JOIN users ON users.id = user_id
            GROUP BY users.id, users.name, commands.name
        ) AS s
        GROUP BY user_name
    `
    );
    const whichActivityUsersAreMostActive = await db.query(
      `
        SELECT user_name, cmd_name FROM (
            SELECT
                users.name AS user_name, 
                commands.name AS cmd_name, 
                SUM(value * factor) AS total,
                RANK() OVER (PARTITION BY users.name ORDER BY SUM(value * factor) DESC) AS rnk
            FROM tasks
            JOIN commands ON commands.id = command_id 
            JOIN users ON users.id = user_id
            GROUP BY users.id, users.name, commands.name
        ) AS t
        WHERE rnk = 1
    `
    );

    return whichActivityUsersAreMostActive.rows;
  }
}

module.exports = LeaderboardService;
