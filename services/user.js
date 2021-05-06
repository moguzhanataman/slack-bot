const db = require("../utils/db");

/**
 * Handles user CRUD operations
 */
class UserService {
  /**
   * Create new user, if id exists, update name and return user
   * @param {Object} userModel - model that contains id and name
   * @returns {User} created/updated user
   */
  async createUser(userModel) {
    try {
      // EXCLUDED represents the new row that conflicted, we are updating only name column
      const newUser = await db.query(
        `
          INSERT INTO users (id, name)
          VALUES ($1, $2) 
          ON CONFLICT (id) DO 
            UPDATE SET name = EXCLUDED.name 
          RETURNING *
        `,
        [userModel.id, userModel.name]
      );

      return newUser;
    } catch (err) {
      console.error("SQL error in UserService.createUser: ", err.message);
      throw new Error(err);
    }
  }
}

module.exports = UserService;
