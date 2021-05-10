const db = require("../utils/db");
class Task {
  /**
   *
   * @param {string} command_id Command Id
   * @param {string} user_id User Id
   * @param {number} value Task progress value
   * @param {Date} created_at Created at
   * @param {string} id Task Id
   */
  constructor(command_id, user_id, value, created_at, id) {
    this.id = id || -1;
    this.command_id = command_id;
    this.user_id = user_id;
    this.value = value;
    this.created_at = created_at;
  }

  /**
   * Inserts task to database, return it
   * @param {Task} taskModel - The task we want to add to database
   * @returns {Future<Task>} created task
   */
  async save() {
    try {
      // EXCLUDED represents the new row that conflicted, we are updating only name column
      const newTask = await db.query(
        `
        INSERT INTO tasks (command_id, user_id, value, created_at)
        VALUES ($1, $2, $3, $4) 
        RETURNING *
        `,
        [this.command_id, this.user_id, this.value, this.created_at]
      );

      const dbTask = newTask.rows[0];
      return new Task(
        dbTask.command_id,
        dbTask.user_id,
        dbTask.value,
        dbTask.created_at,
        dbTask.id
      );
    } catch (err) {
      console.error("SQL error in models/task.js:save", err.message);
      console.error(
        "fields: ",
        this.command_id,
        this.user_id,
        this.value,
        this.created_at
      );
      throw new Error(err);
    }
  }
}

module.exports = Task;
