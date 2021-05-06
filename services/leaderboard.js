const db = require('../utils/db');

class LeaderboardService {
  async getTop3UsersWithHighestPointsInLastHour() {
      const leaderboard = await db.query(
        `
        SELECT
            u.name,
            factor * sum(value) as total_points
        FROM
            tasks t
        INNER JOIN
            commands c ON c.id = t.command_id
        INNER JOIN
            users u ON u.id = t.user_id
        
        -- only last 1 hour
        WHERE
            t.timestamp >= (NOW() - INTERVAL '1 hour')
        
        -- highest to lowest points
        ORDER BY
            total_points DESC
        
        -- top 3 users
        LIMIT 3
        `,
    );

    return leaderboard;
  }
}

module.exports = LeaderboardService;