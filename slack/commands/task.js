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

    if (Number.isNaN(parseInt(text))) {
      res.json(
        ephemeralResponse(
          `You have to provide a numerical value after command name ex. '/${commandName} 5'`
        )
      );
    }

    const taskResult = await TaskService.createTask(
      user_id,
      user_name,
      commandName,
      text
    );

    if (taskResult != null) {
      res.json(ephemeralResponse(`Got it! ${taskResult.value}`));
    } else {
      res.json(ephemeralResponse(`Can't save task to database`));
    }
  } catch (err) {
    console.error(err);
    res.json(ephemeralResponse(`Server error: ${err}`));
  }
}

module.exports = handleTask;
