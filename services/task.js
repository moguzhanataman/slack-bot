const db = require("../utils/db");
const Task = require("../models/task");
/**
 * Handles task CRUD operations
 */
class TaskService {
  /**
   * Creates new task, return it
   * @param {Task} taskModel - The task we want to add to database
   * @returns {Task} created task
   */
  async createTask(taskModel) {
    try {
      // EXCLUDED represents the new row that conflicted, we are updating only name column
      const newTask = await db.query(
        `
        INSERT INTO tasks (command_id, user_id, value, created_at)
        VALUES ($1, $2, $3, $4) 
        RETURNING *
        `,
        [
          taskModel.command_id,
          taskModel.user_id,
          taskModel.value,
          taskModel.created_at,
        ]
      );

      return newTask.rows[0];
    } catch (err) {
      console.error("SQL error in UserService.createUser: ", err.message);
      throw new Error(err);
    }
  }
}

module.exports = TaskService;
