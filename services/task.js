const db = require("../utils/db");
const Task = require("../models/task");
const User = require("../models/user");
const Command = require("../models/command");

/**
 * Handles task CRUD operations
 */
class TaskService {
  static async createTask(userId, userName, commandName, value) {
    // Create user if not exists
    const user = new User(userId, userName);
    user.save();

    // Get command.
    // TODO: can be improved by caching commands
    // NOTE: Why not make it an application constant or enum in Postgres?
    // Because we may want to add/remove/re-name etc. these commands, and this solution gives us that flexibility.
    const command = await Command.findByName(commandName);

    // Create task
    const val = parseInt(value, 10);
    const task = new Task(command.id, user.id, val, new Date());
    const taskResult = await task.save();

    return taskResult;
  }

  // CRUD operations
}

module.exports = TaskService;
