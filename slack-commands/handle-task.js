const Task = require("../models/task");
const User = require("../models/user");

const TaskService = require("../services/task");
const UserService = require("../services/user");
const CommandService = require("../services/command");
const { ephemeralResponse } = require("./response");

const userService = new UserService();
const taskService = new TaskService();
const commandService = new CommandService();

/**
 * "running" and "biking" commands are almost identical.
 * Only difference is command name, which can be retrieved from req.body.command
 * @param {Request} req
 */
async function handleTask(req, res) {
  try {
    const { user_id, user_name, text } = req.body;
    // ignore leading slash in command name, for example "/running" => "running"
    const commandName = req.body.command.substring(1);

    // Create user if not exists
    const user = new User(user_id, user_name);
    await userService.createUser(user);

    // Get command.
    // TODO: can be improved by caching commands
    // NOTE: Why not make it an application constant or enum in Postgres?
    // Because we may want to add/remove/re-name etc. these commands, and this solution gives us that flexibility.
    const command = await commandService.getCommandByName(commandName);

    // Create task
    const value = parseInt(text, 10);
    const task = new Task(command.id, user.id, value, new Date());
    const taskResult = await taskService.createTask(task);

    if (taskResult != null) {
      console.log("taskResult, value", taskResult);
      res.json(ephemeralResponse(`Got it! ${taskResult.value}`));
    } else {
      res.json(ephemeralResponse(`Can't save task to database`));
    }
  } catch (err) {
    res.json(ephemeralResponse(`${err}`));
  }
}

module.exports = handleTask;
