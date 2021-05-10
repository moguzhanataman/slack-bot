const db = require("../utils/db");
class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  /**
   * Create new user, if id exists, update name and return user
   * @param {Object} userModel - model that contains id and name
   * @returns {User} created/updated user
   */
  async save() {
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
        [this.id, this.name]
      );

      return newUser.rows[0];
    } catch (err) {
      console.log("id, name", this.id, this.name);
      console.error("SQL error in models/user.js:save ", err.message);
      throw new Error(err);
    }
  }
}

module.exports = User;
