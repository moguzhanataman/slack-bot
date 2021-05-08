const db = require("../utils/db");
const UserPointsAndActivity = require("../models/user-points-and-activity");

class LeaderboardService {
  /**
   * Get top 3 users by points in last hour and which activity they are most active
   * @returns {Future<UserPointsAndActivity[]>}
   */
  async getTop3UsersWithHighestPointsInLastHour() {
    const lastXhours = 72;
    const top3UsersWithPoints = await db.query(
      `
      SELECT user_name, sum(total) AS total_points
      FROM (
        SELECT 
          users.name AS user_name, 
          commands.name AS cmd_name, 
          sum(value * factor) AS total
        FROM tasks
        JOIN commands ON commands.id = command_id 
        JOIN users ON users.id = user_id
        -- last 1 hour
        WHERE tasks.created_at >= (NOW() - INTERVAL '${lastXhours} hour')
        GROUP BY users.id, users.name, commands.name
      ) AS s
      GROUP BY user_name
      ORDER BY total_points DESC
      LIMIT 3
    `
    );
    const whichActivityUsersAreMostActive = await db.query(
      `
      SELECT user_name, cmd_name 
      FROM (
          SELECT
              users.name AS user_name, 
              commands.name AS cmd_name, 
              SUM(value * factor) AS total,
              RANK() OVER (PARTITION BY users.name ORDER BY SUM(value * factor) DESC) AS rnk
          FROM tasks
          JOIN commands ON commands.id = command_id 
          JOIN users ON users.id = user_id
          WHERE tasks.created_at >= (NOW() - INTERVAL '${lastXhours} hour')
          GROUP BY users.id, users.name, commands.name
      ) AS t
      WHERE rnk = 1
      LIMIT 3
    `
    );

    // Merge 2 result sets
    for (let index = 0; index < top3UsersWithPoints.rows.length; index++) {
      const element = top3UsersWithPoints.rows[index];
      const activityName = whichActivityUsersAreMostActive.rows.find(
        (byActivity) => byActivity.user_name == element.user_name
      ).cmd_name;

      top3UsersWithPoints.rows[index].activity_name = activityName;
    }

    // return [whichActivityUsersAreMostActive.rows, top3UsersWithPoints.rows];
    return top3UsersWithPoints.rows;
  }
}

module.exports = LeaderboardService;
