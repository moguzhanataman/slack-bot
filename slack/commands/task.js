const TaskService = require("../../services/task");
const { ephemeralResponse } = require("../response");

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

    const taskResult = TaskService.createTask(
      user_id,
      user_name,
      commandName,
      text
    );

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
