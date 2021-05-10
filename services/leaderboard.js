const db = require("../utils/db");
const UserPointsAndActivity = require("../models/user-points-and-activity");

class LeaderboardService {
  /**
   * Get top 3 users by points in last hour and which activity they are most active
   * @returns {Future<UserPointsAndActivity[]>}
   */
  async getTop3UsersWithHighestPointsInLastHour() {
    const lastXhours = 1;
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

    const top3UserNames = top3UsersWithPoints.rows.map((u) => u.user_name);

    const whichActivityUsersAreMostActive = await db.query(
      `
        SELECT user_name, cmd_name 
        FROM (
            SELECT
                users.name AS user_name, 
                commands.name AS cmd_name, 
                SUM(value * factor) AS total,
                -- Rank by users highest point to find which activity accumulated more points
                RANK() OVER (PARTITION BY users.name ORDER BY SUM(value * factor) DESC) AS rnk
            FROM tasks
            JOIN commands ON commands.id = command_id 
            JOIN users ON users.id = user_id
            WHERE 
              tasks.created_at >= (NOW() - INTERVAL '${lastXhours} hour') 
              -- We are sending which users we want to look for, if we are 
              -- going to search globally we can get highest of 'running' 
              -- but that person might not be in a leaderboard
              AND users.name = ANY ($1)
            GROUP BY users.id, users.name, commands.name
            ORDER BY total DESC
        ) AS t
        -- Get highest of points to find which command it corresponds to
        WHERE rnk = 1
        LIMIT 3
      `,
      [top3UserNames]
    );

    // 2 result sets might not be in same order, we can't do simple merge
    const result = [];
    for (let index = 0; index < top3UsersWithPoints.rows.length; index++) {
      const element = top3UsersWithPoints.rows[index];
      const activityName = whichActivityUsersAreMostActive.rows.find(
        (byActivity) => byActivity.user_name == element.user_name
      ).cmd_name;

      element.activity_name = activityName;
      result.push(element);
    }

    // return [whichActivityUsersAreMostActive.rows, top3UsersWithPoints.rows];
    return result;
  }
}

module.exports = LeaderboardService;
